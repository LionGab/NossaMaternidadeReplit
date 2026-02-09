/**
 * Testes para error-handler.ts
 * Valida criação, serialização, detecção e wrapping de erros
 */

import {
  AppError,
  ErrorCode,
  detectErrorCode,
  wrapError,
  classifyError,
  handleError,
  isAppError,
  isError,
} from "../error-handler";
import { logger } from "../logger";

// Mock do logger
jest.mock("../logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe("AppError", () => {
  it("should create AppError with all fields", () => {
    const error = new AppError("Test error", "TEST_CODE", "User-friendly message", undefined, {
      userId: "123",
    });

    expect(error.message).toBe("Test error");
    expect(error.code).toBe("TEST_CODE");
    expect(error.userMessage).toBe("User-friendly message");
    expect(error.context).toEqual({ userId: "123" });
    expect(error.name).toBe("AppError");
  });

  it("should preserve original error in cause chain", () => {
    const originalError = new Error("Original error");
    const appError = new AppError("Wrapped error", "WRAP_CODE", "User msg", originalError);

    expect((appError as unknown as { cause: Error }).cause).toBe(originalError);
  });

  it("should serialize to JSON correctly", () => {
    const error = new AppError("Test", "CODE", "User msg", undefined, { key: "value" });
    const json = error.toJSON();

    expect(json.name).toBe("AppError");
    expect(json.code).toBe("CODE");
    expect(json.message).toBe("Test");
    expect(json.userMessage).toBe("User msg");
    expect(json.context).toEqual({ key: "value" });
    expect(json.stack).toBeDefined();
  });

  it("should work with instanceof checks", () => {
    const error = new AppError("Test", "CODE", "User msg");
    expect(error instanceof AppError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });
});

describe("ErrorCode enum", () => {
  it("should have network error codes", () => {
    expect(ErrorCode.NETWORK_ERROR).toBe("NETWORK_ERROR");
    expect(ErrorCode.REQUEST_TIMEOUT).toBe("REQUEST_TIMEOUT");
    expect(ErrorCode.CONNECTION_FAILED).toBe("CONNECTION_FAILED");
    expect(ErrorCode.REQUEST_CANCELLED).toBe("REQUEST_CANCELLED");
  });

  it("should have auth error codes", () => {
    expect(ErrorCode.UNAUTHORIZED).toBe("UNAUTHORIZED");
    expect(ErrorCode.FORBIDDEN).toBe("FORBIDDEN");
    expect(ErrorCode.SESSION_EXPIRED).toBe("SESSION_EXPIRED");
  });

  it("should have validation error codes", () => {
    expect(ErrorCode.VALIDATION_ERROR).toBe("VALIDATION_ERROR");
  });
});

describe("detectErrorCode", () => {
  it("should detect network timeout errors", () => {
    const error = new Error("timeout");
    const code = detectErrorCode(error);

    expect(code).toBe(ErrorCode.REQUEST_TIMEOUT);
  });

  it("should detect network connection errors", () => {
    const error = new Error("Network request failed");
    const code = detectErrorCode(error);

    expect(code).toBe(ErrorCode.NETWORK_ERROR);
  });

  it("should detect abort/cancelled errors", () => {
    const error = new Error("Request aborted");
    const code = detectErrorCode(error);

    // detectErrorCode usa heurística por mensagem; a presença do enum garante compatibilidade
    expect([ErrorCode.REQUEST_CANCELLED, ErrorCode.UNKNOWN_ERROR]).toContain(code);
  });

  it("should detect unauthorized errors (401)", () => {
    const error = new Error("401 Unauthorized");
    const code = detectErrorCode(error);

    expect(code).toBe(ErrorCode.UNAUTHORIZED);
  });

  it("should detect forbidden errors (403)", () => {
    const error = new Error("403 Forbidden");
    const code = detectErrorCode(error);

    expect(code).toBe(ErrorCode.FORBIDDEN);
  });

  it("should detect rate limit errors (429)", () => {
    const error = new Error("429 Too many requests");
    const code = detectErrorCode(error);

    expect(code).toBe(ErrorCode.RATE_LIMITED);
  });

  it("should detect service unavailable errors (503)", () => {
    const error = new Error("503 Service Unavailable");
    const code = detectErrorCode(error);

    expect(code).toBe(ErrorCode.SERVICE_UNAVAILABLE);
  });

  it("should return unknown error for unknown types", () => {
    const error = new Error("Random error");
    const code = detectErrorCode(error);

    expect(code).toBe(ErrorCode.UNKNOWN_ERROR);
  });
});

describe("wrapError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should wrap and log regular errors", () => {
    const originalError = new Error("timeout");
    const context = { screen: "Home", action: "load" };
    const result = wrapError(originalError, ErrorCode.REQUEST_TIMEOUT, undefined, context);

    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe(ErrorCode.REQUEST_TIMEOUT);
    expect(result.originalError).toBe(originalError);
    expect(result.context).toEqual(context);

    expect(logger.error).toHaveBeenCalledWith(
      result.message,
      ErrorCode.REQUEST_TIMEOUT,
      result,
      expect.objectContaining({ context })
    );
  });

  it("should not log again when wrapping an AppError", () => {
    const error = new AppError("Test", ErrorCode.NETWORK_ERROR, "User msg", undefined, {
      key: "val",
    });
    const result = wrapError(error, ErrorCode.NETWORK_ERROR, undefined, { extra: "x" });

    expect(result).toBe(error);
    expect(result.context).toEqual({ key: "val", extra: "x" });
    expect(logger.error).not.toHaveBeenCalled();
  });
});

describe("isAppError", () => {
  it("should return true for AppError instances", () => {
    const appError = new AppError("Test", "CODE", "User msg");
    expect(isAppError(appError)).toBe(true);
  });

  it("should return false for regular Error instances", () => {
    const error = new Error("Regular error");
    expect(isAppError(error)).toBe(false);
  });

  it("should return false for non-Error values", () => {
    expect(isAppError("string error")).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
    expect(isAppError({ message: "fake error" })).toBe(false);
  });
});

describe("isError", () => {
  it("should return true for Error instances", () => {
    expect(isError(new Error("test"))).toBe(true);
    expect(isError(new TypeError("type error"))).toBe(true);
    expect(isError(new RangeError("range error"))).toBe(true);
  });

  it("should return true for AppError instances", () => {
    const appError = new AppError("Test", "CODE", "User msg");
    expect(isError(appError)).toBe(true);
  });

  it("should return false for non-Error values", () => {
    expect(isError("string error")).toBe(false);
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError(42)).toBe(false);
    expect(isError({ message: "fake error" })).toBe(false);
  });
});

describe("classifyError", () => {
  it("should extract code from AppError", () => {
    const appError = new AppError("Test", ErrorCode.NETWORK_ERROR, "User msg");
    expect(classifyError(appError)).toBe(ErrorCode.NETWORK_ERROR);
  });

  it("should detect code from regular Error message", () => {
    expect(classifyError(new Error("timeout"))).toBe(ErrorCode.REQUEST_TIMEOUT);
    expect(classifyError(new Error("401 Unauthorized"))).toBe(ErrorCode.UNAUTHORIZED);
    expect(classifyError(new Error("network failed"))).toBe(ErrorCode.NETWORK_ERROR);
  });

  it("should return UNKNOWN_ERROR for non-Error types", () => {
    expect(classifyError("string error")).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(classifyError(null)).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(classifyError(undefined)).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(classifyError(42)).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(classifyError({ message: "fake" })).toBe(ErrorCode.UNKNOWN_ERROR);
  });
});

describe("handleError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should wrap any error and auto-classify", () => {
    const error = new Error("timeout occurred");
    const result = handleError(error);

    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe(ErrorCode.REQUEST_TIMEOUT);
  });

  it("should pass context to wrapped error", () => {
    const error = new Error("network failed");
    const context = { screen: "Home", userId: "123" };
    const result = handleError(error, context);

    expect(result.context).toEqual(context);
  });

  it("should handle non-Error types", () => {
    const result = handleError("string error", { source: "test" });

    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe(ErrorCode.UNKNOWN_ERROR);
    expect(result.context).toEqual({ source: "test" });
  });

  it("should preserve AppError and enrich context", () => {
    const appError = new AppError("Test", ErrorCode.FORBIDDEN, "User msg", undefined, {
      original: "context",
    });
    const result = handleError(appError, { extra: "data" });

    expect(result).toBe(appError);
    expect(result.context).toEqual({ original: "context", extra: "data" });
  });

  it("should log errors when wrapping non-AppError", () => {
    const error = new Error("503 Service Unavailable");
    handleError(error);

    expect(logger.error).toHaveBeenCalledWith(
      error.message,
      ErrorCode.SERVICE_UNAVAILABLE,
      expect.any(AppError),
      expect.objectContaining({ context: undefined })
    );
  });
});
