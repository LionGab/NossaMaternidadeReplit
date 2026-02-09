/**
 * Testes para fetch-utils
 * Valida fetch com timeout, retry, e requisições canceláveis
 */

import { AppError, ErrorCode } from "../error-handler";
import {
  blobFetch,
  createCancellableJsonRequest,
  createCancellableRequest,
  fetchWithRetry,
  fetchWithTimeout,
  jsonFetch,
  TIMEOUT_PRESETS,
} from "../fetch-utils";

// Mock logger
jest.mock("../logger", () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockFetchWithAbort = () => {
  mockFetch.mockImplementation((_url: string, options?: RequestInit) => {
    const signal = options?.signal as AbortSignal | undefined;

    return new Promise((_resolve, reject) => {
      const abortError = new DOMException("Aborted", "AbortError");

      if (!signal) {
        return;
      }

      if (signal.aborted) {
        reject(abortError);
        return;
      }

      const onAbort = () => {
        signal.removeEventListener("abort", onAbort);
        signal.onabort = null;
        reject(abortError);
      };

      signal.onabort = onAbort;
      signal.addEventListener("abort", onAbort);
    });
  });
};

describe("TIMEOUT_PRESETS", () => {
  it("deve ter os presets corretos", () => {
    expect(TIMEOUT_PRESETS.SHORT).toBe(10000);
    expect(TIMEOUT_PRESETS.NORMAL).toBe(30000);
    expect(TIMEOUT_PRESETS.LONG).toBe(60000);
    expect(TIMEOUT_PRESETS.CRITICAL).toBe(45000);
  });
});

describe("fetchWithTimeout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("deve retornar response em caso de sucesso", async () => {
    jest.useFakeTimers();
    const mockResponse = new Response(JSON.stringify({ data: "test" }), { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const resultPromise = fetchWithTimeout("https://api.test.com/data");
    jest.runAllTimers();
    const result = await resultPromise;

    expect(result).toBe(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.test.com/data",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it("deve usar timeout padrão NORMAL (30s)", async () => {
    jest.useFakeTimers();
    const mockResponse = new Response(JSON.stringify({ data: "test" }), { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const resultPromise = fetchWithTimeout("https://api.test.com/data");
    jest.runAllTimers();
    await resultPromise;

    // Verificar que fetch foi chamado
    expect(mockFetch).toHaveBeenCalled();
  });

  it("deve lançar AppError com REQUEST_TIMEOUT após timeout", async () => {
    jest.useFakeTimers();
    mockFetchWithAbort();

    const resultPromise = fetchWithTimeout("https://api.test.com/data", {
      timeoutMs: 100, // Timeout rápido para testes
      context: "test-context",
    });
    const timeoutExpectation = expect(resultPromise).rejects.toMatchObject({
      code: ErrorCode.REQUEST_TIMEOUT,
    });

    await jest.advanceTimersByTimeAsync(100);
    await timeoutExpectation;
  }, 10000);

  it("deve lançar AppError com API_ERROR para HTTP errors", async () => {
    jest.useFakeTimers();
    const mockResponse = new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
    });
    mockFetch.mockResolvedValue(mockResponse);

    const resultPromise = fetchWithTimeout("https://api.test.com/data");
    jest.runAllTimers();

    await expect(resultPromise).rejects.toMatchObject({
      code: ErrorCode.API_ERROR,
    });
  });

  it("deve suportar abortSignal externo", async () => {
    jest.useFakeTimers();
    const controller = new AbortController();

    // Abortar imediatamente
    controller.abort();

    const resultPromise = fetchWithTimeout("https://api.test.com/data", {
      abortSignal: controller.signal,
    });

    await expect(resultPromise).rejects.toMatchObject({
      code: ErrorCode.REQUEST_CANCELLED,
    });
  });

  it("deve diferenciar abort do usuário vs timeout", async () => {
    jest.useFakeTimers();
    const controller = new AbortController();
    mockFetchWithAbort();

    const resultPromise = fetchWithTimeout("https://api.test.com/data", {
      timeoutMs: 5000,
      abortSignal: controller.signal,
    });

    // Cancelar pelo usuário após pequeno delay
    setTimeout(() => controller.abort(), 50);

    jest.advanceTimersByTime(60);

    await expect(resultPromise).rejects.toMatchObject({
      code: ErrorCode.REQUEST_CANCELLED,
      message: expect.stringContaining("cancelled by user"),
    });
  });

  it("deve lançar NETWORK_ERROR para erros de rede", async () => {
    jest.useFakeTimers();
    const networkError = new TypeError("Failed to fetch");
    mockFetch.mockRejectedValue(networkError);

    const resultPromise = fetchWithTimeout("https://api.test.com/data");
    jest.runAllTimers();

    await expect(resultPromise).rejects.toMatchObject({
      code: ErrorCode.NETWORK_ERROR,
    });
  });

  it("deve preservar AppError existente", async () => {
    jest.useFakeTimers();
    const appError = new AppError(
      "Custom error",
      ErrorCode.API_ERROR,
      "Erro customizado",
      undefined,
      { custom: true }
    );
    mockFetch.mockRejectedValue(appError);

    const resultPromise = fetchWithTimeout("https://api.test.com/data");
    jest.runAllTimers();

    await expect(resultPromise).rejects.toBe(appError);
  });

  it("deve aceitar opções de fetch padrão", async () => {
    jest.useFakeTimers();
    const mockResponse = new Response(JSON.stringify({ data: "test" }), { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const resultPromise = fetchWithTimeout("https://api.test.com/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: true }),
    });
    jest.runAllTimers();
    await resultPromise;

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.test.com/data",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      })
    );
  });
});

describe("fetchWithRetry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("deve retornar response em caso de sucesso", async () => {
    jest.useFakeTimers();
    const mockResponse = new Response(JSON.stringify({ data: "test" }), { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const resultPromise = fetchWithRetry("https://api.test.com/data");
    await jest.runAllTimersAsync();
    const result = await resultPromise;

    expect(result.ok).toBe(true);
  });

  it("deve fazer retry em erros de timeout", async () => {
    jest.useFakeTimers();
    const timeoutError = new AppError(
      "Timeout",
      ErrorCode.REQUEST_TIMEOUT,
      "Timeout",
      undefined,
      {}
    );

    mockFetch
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: "test" }), { status: 200 }));

    const resultPromise = fetchWithRetry("https://api.test.com/data");
    await jest.runAllTimersAsync();
    const result = await resultPromise;

    expect(result.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("deve fazer retry em erros de rede", async () => {
    jest.useFakeTimers();
    const networkError = new AppError(
      "Network error",
      ErrorCode.NETWORK_ERROR,
      "Erro de rede",
      undefined,
      {}
    );

    mockFetch
      .mockRejectedValueOnce(networkError)
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: "test" }), { status: 200 }));

    const resultPromise = fetchWithRetry("https://api.test.com/data");
    await jest.runAllTimersAsync();
    const result = await resultPromise;

    expect(result.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("não deve fazer retry em erro 401", async () => {
    jest.useRealTimers(); // Real timers para rejections

    const mockResponse = new Response("Unauthorized", { status: 401 });
    mockFetch.mockResolvedValue(mockResponse);

    await expect(fetchWithRetry("https://api.test.com/data")).rejects.toMatchObject({
      code: ErrorCode.API_ERROR,
      context: expect.objectContaining({ status: 401 }),
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  }, 15000);

  it("não deve fazer retry em erro 403", async () => {
    jest.useRealTimers();

    const mockResponse = new Response("Forbidden", { status: 403 });
    mockFetch.mockResolvedValue(mockResponse);

    await expect(fetchWithRetry("https://api.test.com/data")).rejects.toMatchObject({
      code: ErrorCode.API_ERROR,
      context: expect.objectContaining({ status: 403 }),
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  }, 15000);

  it("não deve fazer retry em erro 400", async () => {
    jest.useRealTimers();

    const mockResponse = new Response("Bad Request", { status: 400 });
    mockFetch.mockResolvedValue(mockResponse);

    await expect(fetchWithRetry("https://api.test.com/data")).rejects.toMatchObject({
      code: ErrorCode.API_ERROR,
      context: expect.objectContaining({ status: 400 }),
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  }, 15000);

  it("deve aceitar retry options customizadas", async () => {
    jest.useRealTimers();

    const networkError = new AppError(
      "Network error",
      ErrorCode.NETWORK_ERROR,
      "Erro de rede",
      undefined,
      {}
    );

    mockFetch.mockRejectedValue(networkError);

    await expect(
      fetchWithRetry("https://api.test.com/data", {}, { maxAttempts: 2 })
    ).rejects.toThrow();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  }, 15000);
});

describe("jsonFetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("deve retornar JSON parseado", async () => {
    jest.useFakeTimers();
    const mockData = { id: 1, name: "Test" };
    const mockResponse = new Response(JSON.stringify(mockData), { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const resultPromise = jsonFetch<typeof mockData>("https://api.test.com/data");
    await jest.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toEqual(mockData);
  });

  it("deve lançar erro para JSON inválido", async () => {
    jest.useRealTimers();

    const mockResponse = new Response("not json", { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    await expect(jsonFetch("https://api.test.com/data")).rejects.toMatchObject({
      code: ErrorCode.API_ERROR,
    });
  }, 15000);

  it("deve passar opções para fetch", async () => {
    jest.useFakeTimers();
    const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const resultPromise = jsonFetch("https://api.test.com/data", {
      method: "POST",
      headers: { "X-Custom": "header" },
    });
    await jest.runAllTimersAsync();
    await resultPromise;

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.test.com/data",
      expect.objectContaining({
        method: "POST",
        headers: { "X-Custom": "header" },
      })
    );
  });
});

describe("blobFetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("deve retornar blob", async () => {
    jest.useFakeTimers();
    const mockBlob = new Blob(["test content"], { type: "text/plain" });
    const mockResponse = new Response(mockBlob, { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const resultPromise = blobFetch("https://api.test.com/file.txt");
    await jest.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toBeInstanceOf(Blob);
  });

  it("deve lançar erro se blob falhar", async () => {
    jest.useRealTimers();

    const mockResponse = {
      ok: true,
      status: 200,
      blob: jest.fn().mockRejectedValue(new Error("Blob error")),
      text: jest.fn().mockResolvedValue(""),
    };
    mockFetch.mockResolvedValue(mockResponse);

    await expect(blobFetch("https://api.test.com/file.txt")).rejects.toMatchObject({
      code: ErrorCode.API_ERROR,
    });
  }, 15000);
});

describe("createCancellableRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("deve retornar promise, cancel e signal", () => {
    jest.useFakeTimers();
    const mockResponse = new Response(JSON.stringify({ data: "test" }), { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const result = createCancellableRequest("https://api.test.com/data");

    expect(result).toHaveProperty("promise");
    expect(result).toHaveProperty("cancel");
    expect(result).toHaveProperty("signal");
    expect(typeof result.cancel).toBe("function");
    expect(result.signal).toBeInstanceOf(AbortSignal);
  });

  it("deve resolver com response", async () => {
    jest.useFakeTimers();
    const mockResponse = new Response(JSON.stringify({ data: "test" }), { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const { promise } = createCancellableRequest("https://api.test.com/data");
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result.ok).toBe(true);
  });

  it("deve cancelar requisição quando cancel é chamado", async () => {
    jest.useFakeTimers();
    mockFetchWithAbort();

    const { promise, cancel } = createCancellableRequest("https://api.test.com/data");

    // Cancelar após delay mínimo
    setTimeout(() => cancel(), 50);

    jest.advanceTimersByTime(60);

    await expect(promise).rejects.toMatchObject({
      code: ErrorCode.REQUEST_CANCELLED,
    });
  });
});

describe("createCancellableJsonRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("deve resolver com JSON parseado", async () => {
    jest.useFakeTimers();
    const mockData = { id: 1, name: "Test" };
    const mockResponse = new Response(JSON.stringify(mockData), { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const { promise } = createCancellableJsonRequest<typeof mockData>("https://api.test.com/data");
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual(mockData);
  });

  it("deve cancelar requisição JSON", async () => {
    jest.useFakeTimers();
    mockFetchWithAbort();

    const { promise, cancel } = createCancellableJsonRequest("https://api.test.com/data");

    // Cancelar após delay mínimo
    setTimeout(() => cancel(), 50);

    jest.advanceTimersByTime(60);

    await expect(promise).rejects.toMatchObject({
      code: ErrorCode.REQUEST_CANCELLED,
    });
  });

  it("deve passar opções para fetch", async () => {
    jest.useFakeTimers();
    const mockResponse = new Response(JSON.stringify({ ok: true }), { status: 200 });
    mockFetch.mockResolvedValue(mockResponse);

    const { promise } = createCancellableJsonRequest("https://api.test.com/data", {
      method: "POST",
    });
    await jest.runAllTimersAsync();
    await promise;

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.test.com/data",
      expect.objectContaining({ method: "POST" })
    );
  });
});
