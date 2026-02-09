/**
 * Testes para retry utility
 * Valida retry automático com backoff exponencial
 */

import { withRetry, retryNetworkRequest } from "../retry";

// Mock logger para evitar logs nos testes
jest.mock("../logger", () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

describe("withRetry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar resultado em caso de sucesso na primeira tentativa", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");

    const result = await withRetry(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("deve fazer retry após falha e retornar sucesso", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail 1"))
      .mockResolvedValue("success");

    const result = await withRetry(mockFn, { maxAttempts: 3, initialDelay: 10 });

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("deve respeitar maxAttempts", async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error("always fails"));

    await expect(withRetry(mockFn, { maxAttempts: 3, initialDelay: 10 })).rejects.toThrow(
      "always fails"
    );

    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it("deve parar retry se retryable retornar false", async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error("non-retryable"));

    await expect(
      withRetry(mockFn, {
        maxAttempts: 3,
        initialDelay: 10,
        retryable: (error) => (error as Error).message !== "non-retryable",
      })
    ).rejects.toThrow("non-retryable");

    expect(mockFn).toHaveBeenCalledTimes(1); // Não faz retry
  });

  it("deve usar valores padrão", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");

    const result = await withRetry(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("deve fazer múltiplos retries antes de sucesso", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail 1"))
      .mockRejectedValueOnce(new Error("fail 2"))
      .mockResolvedValue("success");

    const result = await withRetry(mockFn, {
      maxAttempts: 5,
      initialDelay: 10,
    });

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});

describe("retryNetworkRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve fazer retry em erros de network", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("network request failed"))
      .mockResolvedValue("success");

    const result = await retryNetworkRequest(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("deve fazer retry em erros de timeout", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("request timeout"))
      .mockResolvedValue("success");

    const result = await retryNetworkRequest(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("deve fazer retry em erros de fetch", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fetch failed"))
      .mockResolvedValue("success");

    const result = await retryNetworkRequest(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("deve fazer retry em erros de connection", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("connection refused"))
      .mockResolvedValue("success");

    const result = await retryNetworkRequest(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("não deve fazer retry em erros não-network", async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error("validation failed"));

    await expect(retryNetworkRequest(mockFn)).rejects.toThrow("validation failed");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("deve aceitar opções personalizadas de maxAttempts", async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error("network error"));

    await expect(retryNetworkRequest(mockFn, { maxAttempts: 2 })).rejects.toThrow("network error");

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("não deve fazer retry em erros que não são Error", async () => {
    const mockFn = jest.fn().mockRejectedValue("string error");

    await expect(retryNetworkRequest(mockFn)).rejects.toBe("string error");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
