/**
 * Utilitários para fetch com timeout e tratamento de erros
 * Previne requisições penduradas e garante timeouts consistentes
 */

import { AppError, ErrorCode, wrapError } from "./error-handler";
import { retryNetworkRequest, type RetryOptions } from "./retry";

export interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number;
  context?: string;
  /**
   * External AbortSignal for user-initiated cancellation.
   * Will be combined with internal timeout abort.
   */
  abortSignal?: AbortSignal;
}

/**
 * Padrões de timeout para diferentes tipos de requisição
 */
export const TIMEOUT_PRESETS = {
  SHORT: 10000, // 10s - requisições rápidas
  NORMAL: 30000, // 30s - requisições padrão
  LONG: 60000, // 60s - uploads, processamento pesado
  CRITICAL: 45000, // 45s - APIs críticas
} as const;

/**
 * Fetch com timeout automático
 * Usa AbortController para cancelar requisição após timeout
 * Suporta AbortSignal externo para cancelamento pelo usuário
 */
export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const {
    timeoutMs = TIMEOUT_PRESETS.NORMAL,
    context = "fetch",
    abortSignal: externalSignal,
    ...fetchOptions
  } = options;

  // Create internal controller for timeout
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

  // Track if abort was from external signal (user cancellation) vs timeout
  let abortedByUser = false;

  // Listen to external signal if provided
  const onExternalAbort = () => {
    abortedByUser = true;
    timeoutController.abort();
  };

  if (externalSignal) {
    // Check if already aborted
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      return Promise.reject(
        new AppError(
          "Request cancelled by user",
          ErrorCode.REQUEST_CANCELLED,
          "Requisição cancelada.",
          undefined,
          { url, context }
        )
      );
    }
    externalSignal.addEventListener("abort", onExternalAbort);
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: timeoutController.signal,
    });

    clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", onExternalAbort);

    // Verificar status HTTP
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "(empty response)");
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);

      throw new AppError(
        `HTTP ${response.status} from ${url}`,
        ErrorCode.API_ERROR,
        "Erro ao conectar com o servidor.",
        error,
        {
          status: response.status,
          statusText: response.statusText,
          url,
          context,
          responsePreview: errorBody.substring(0, 200),
        }
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", onExternalAbort);

    // AbortError - check if user cancelled or timeout
    if (error instanceof DOMException && error.name === "AbortError") {
      if (abortedByUser) {
        return Promise.reject(
          new AppError(
            "Request cancelled by user",
            ErrorCode.REQUEST_CANCELLED,
            "Requisição cancelada.",
            error,
            { url, context }
          )
        );
      }
      return Promise.reject(
        new AppError(
          `Request timeout after ${timeoutMs}ms`,
          ErrorCode.REQUEST_TIMEOUT,
          "A requisição demorou muito. Tente novamente.",
          error,
          { url, timeoutMs, context }
        )
      );
    }

    // Erros de rede
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return Promise.reject(
        new AppError(
          "Network request failed",
          ErrorCode.NETWORK_ERROR,
          "Erro de conexão. Verifique sua internet.",
          error,
          { url, context }
        )
      );
    }

    // Se já é AppError, apenas re-throw
    if (error instanceof AppError) {
      return Promise.reject(error);
    }

    // Fallback para erros desconhecidos
    return Promise.reject(
      wrapError(error, ErrorCode.NETWORK_ERROR, undefined, {
        url,
        context,
      })
    );
  }
}

/**
 * Fetch com retry + timeout automático
 * Combina retry com backoff exponencial + timeout
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithTimeoutOptions = {},
  retryOptions?: RetryOptions
): Promise<Response> {
  const { timeoutMs = TIMEOUT_PRESETS.NORMAL, context = "fetch" } = options;

  return retryNetworkRequest(
    () =>
      fetchWithTimeout(url, {
        ...options,
        timeoutMs,
        context,
      }),
    {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
      ...retryOptions,
      // Custom logic: não fazer retry em erros HTTP específicos
      retryable: (error) => {
        if (error instanceof AppError) {
          // Não retry em status específicos
          if (error.context?.status === 401) return false; // Unauthorized
          if (error.context?.status === 403) return false; // Forbidden
          if (error.context?.status === 400) return false; // Bad request

          // Retry em timeouts e erros de rede
          return error.code === ErrorCode.REQUEST_TIMEOUT || error.code === ErrorCode.NETWORK_ERROR;
        }

        return true;
      },
    }
  );
}

/**
 * Fazer JSON request com timeout + retry
 */
export async function jsonFetch<T = unknown>(
  url: string,
  options: FetchWithTimeoutOptions = {},
  retryOptions?: RetryOptions
): Promise<T> {
  const response = await fetchWithRetry(url, options, retryOptions);

  try {
    const data = await response.json();
    return data as T;
  } catch (error) {
    throw wrapError(error, ErrorCode.API_ERROR, "Resposta inválida do servidor", {
      url,
      status: response.status,
    });
  }
}

/**
 * Fazer blob request (para downloads, imagens, etc)
 */
export async function blobFetch(
  url: string,
  options: FetchWithTimeoutOptions = {},
  retryOptions?: RetryOptions
): Promise<Blob> {
  const response = await fetchWithRetry(url, options, retryOptions);

  try {
    return await response.blob();
  } catch (error) {
    throw wrapError(error, ErrorCode.API_ERROR, "Erro ao baixar arquivo", {
      url,
      status: response.status,
    });
  }
}

/**
 * Result type for cancellable requests
 */
export interface CancellableRequest<T> {
  /** The promise that resolves with the response */
  promise: Promise<T>;
  /** Call this to cancel the request */
  cancel: () => void;
  /** The AbortController signal - can be passed to child requests */
  signal: AbortSignal;
}

/**
 * Create a cancellable fetch request
 * Returns an object with the promise and a cancel function
 *
 * @example
 * const { promise, cancel } = createCancellableRequest(
 *   'https://api.example.com/data',
 *   { method: 'GET' }
 * );
 *
 * // Later, if needed:
 * cancel();
 *
 * // Or use the result:
 * const response = await promise;
 */
export function createCancellableRequest(
  url: string,
  options: Omit<FetchWithTimeoutOptions, "abortSignal"> = {},
  retryOptions?: RetryOptions
): CancellableRequest<Response> {
  const controller = new AbortController();

  const promise = fetchWithRetry(url, { ...options, abortSignal: controller.signal }, retryOptions);

  return {
    promise,
    cancel: () => controller.abort(),
    signal: controller.signal,
  };
}

/**
 * Create a cancellable JSON fetch request
 */
export function createCancellableJsonRequest<T = unknown>(
  url: string,
  options: Omit<FetchWithTimeoutOptions, "abortSignal"> = {},
  retryOptions?: RetryOptions
): CancellableRequest<T> {
  const controller = new AbortController();

  const promise = jsonFetch<T>(url, { ...options, abortSignal: controller.signal }, retryOptions);

  return {
    promise,
    cancel: () => controller.abort(),
    signal: controller.signal,
  };
}
