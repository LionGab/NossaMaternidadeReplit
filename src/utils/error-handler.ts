/**
 * Sistema centralizado de error handling
 * Preserva stack traces completos e contexto para debugging
 */

import { logger } from "./logger";

/**
 * Classe base para erros da aplicação
 * Preserva stack trace original usando Error.cause (Node 16.9+)
 * Fornece contexto estruturado para logging e monitoring
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public originalError?: Error,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";

    // Preservar stack trace original via Error.cause chain
    if (originalError) {
      (this as Record<string, unknown>).cause = originalError;
    }

    // Capturar stack trace no ponto de criação (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    // Manter prototype chain para instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Serializar erro para logging estruturado
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      stack: this.stack,
      cause: this.originalError?.stack,
      context: this.context,
    };
  }
}

/**
 * Tipos de erro reconhecidos
 */
export enum ErrorCode {
  // Network
  NETWORK_ERROR = "NETWORK_ERROR",
  REQUEST_TIMEOUT = "REQUEST_TIMEOUT",
  CONNECTION_FAILED = "CONNECTION_FAILED",
  REQUEST_CANCELLED = "REQUEST_CANCELLED",

  // Authentication
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  SESSION_EXPIRED = "SESSION_EXPIRED",

  // Validation
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",

  // API
  API_ERROR = "API_ERROR",
  RATE_LIMITED = "RATE_LIMITED",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",

  // Upload
  UPLOAD_FAILED = "UPLOAD_FAILED",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  INVALID_FILE_FORMAT = "INVALID_FILE_FORMAT",

  // AI
  AI_SERVICE_ERROR = "AI_SERVICE_ERROR",
  GENERATION_FAILED = "GENERATION_FAILED",

  // Audio
  AUDIO_PROCESSING_ERROR = "AUDIO_PROCESSING_ERROR",
  TRANSCRIPTION_FAILED = "TRANSCRIPTION_FAILED",

  // Generic
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Mensagens padrão para usuários (sem detalhes técnicos)
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.NETWORK_ERROR]: "Erro de conexão. Verifique sua internet.",
  [ErrorCode.REQUEST_TIMEOUT]: "A requisição demorou muito. Tente novamente.",
  [ErrorCode.CONNECTION_FAILED]: "Não foi possível conectar. Verifique sua conexão.",
  [ErrorCode.REQUEST_CANCELLED]: "A requisição foi cancelada.",

  [ErrorCode.UNAUTHORIZED]: "Você não tem permissão para isso.",
  [ErrorCode.FORBIDDEN]: "Acesso negado.",
  [ErrorCode.SESSION_EXPIRED]: "Sua sessão expirou. Faça login novamente.",

  [ErrorCode.VALIDATION_ERROR]: "Os dados fornecidos são inválidos.",
  [ErrorCode.INVALID_INPUT]: "Entrada inválida. Verifique os dados.",

  [ErrorCode.API_ERROR]: "Erro ao conectar com o servidor.",
  [ErrorCode.RATE_LIMITED]: "Você está enviando muitas requisições. Aguarde.",
  [ErrorCode.SERVICE_UNAVAILABLE]: "Serviço indisponível no momento.",

  [ErrorCode.UPLOAD_FAILED]: "Falha no upload. Tente novamente.",
  [ErrorCode.FILE_TOO_LARGE]: "Arquivo muito grande. Máximo 10MB.",
  [ErrorCode.INVALID_FILE_FORMAT]: "Formato de arquivo inválido.",

  [ErrorCode.AI_SERVICE_ERROR]: "Erro do serviço de IA. Tente novamente.",
  [ErrorCode.GENERATION_FAILED]: "Não consegui processar sua solicitação. Tente novamente.",

  [ErrorCode.AUDIO_PROCESSING_ERROR]: "Erro ao processar áudio.",
  [ErrorCode.TRANSCRIPTION_FAILED]: "Falha na transcrição. Tente novamente.",

  [ErrorCode.UNKNOWN_ERROR]: "Ocorreu um erro inesperado.",
};

/**
 * Wrapper para converter erros genéricos em AppError
 * Preserva stack trace e fornece contexto estruturado
 */
export function wrapError(
  error: unknown,
  code: ErrorCode,
  userMessage?: string,
  context?: Record<string, unknown>
): AppError {
  // Se já é AppError, apenas enriquecer contexto
  if (error instanceof AppError) {
    if (context) {
      error.context = { ...error.context, ...context };
    }
    return error;
  }

  // Converter para Error para preservar stack trace
  const originalError = error instanceof Error ? error : new Error(String(error));

  const appError = new AppError(
    originalError.message,
    code,
    userMessage || ERROR_MESSAGES[code],
    originalError,
    context
  );

  // Log automático (sem duplicar logs em catch)
  logger.error(appError.message, code, appError, { context });

  return appError;
}

/**
 * Detectar tipo de erro por padrão de mensagem
 */
export function detectErrorCode(error: Error): ErrorCode {
  const message = error.message.toLowerCase();

  // Network errors
  if (message.includes("network") || message.includes("fetch") || message.includes("offline")) {
    return ErrorCode.NETWORK_ERROR;
  }

  if (message.includes("timeout")) {
    return ErrorCode.REQUEST_TIMEOUT;
  }

  // HTTP errors
  if (message.includes("401")) {
    return ErrorCode.UNAUTHORIZED;
  }

  if (message.includes("403")) {
    return ErrorCode.FORBIDDEN;
  }

  if (message.includes("429")) {
    return ErrorCode.RATE_LIMITED;
  }

  if (message.includes("503")) {
    return ErrorCode.SERVICE_UNAVAILABLE;
  }

  // File errors
  if (message.includes("file too large")) {
    return ErrorCode.FILE_TOO_LARGE;
  }

  if (message.includes("invalid format")) {
    return ErrorCode.INVALID_FILE_FORMAT;
  }

  return ErrorCode.UNKNOWN_ERROR;
}

/**
 * Type guard para AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard para Error
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Classify any error into an ErrorCode
 * Wrapper convenience function that handles unknown types
 *
 * @example
 * ```ts
 * try {
 *   await fetchData();
 * } catch (e) {
 *   const code = classifyError(e);
 *   // code will be ErrorCode.NETWORK_ERROR, ErrorCode.UNAUTHORIZED, etc.
 * }
 * ```
 */
export function classifyError(error: unknown): ErrorCode {
  // Already an AppError - extract code
  if (isAppError(error)) {
    return error.code as ErrorCode;
  }

  // Standard Error - detect from message
  if (isError(error)) {
    return detectErrorCode(error);
  }

  // Unknown type
  return ErrorCode.UNKNOWN_ERROR;
}

/**
 * Handle any error by wrapping it in AppError with automatic classification
 * Use this as a catch-all error handler
 *
 * @example
 * ```ts
 * try {
 *   await riskyOperation();
 * } catch (e) {
 *   const appError = handleError(e, { operation: 'riskyOperation' });
 *   showErrorToast(appError.userMessage);
 * }
 * ```
 */
export function handleError(error: unknown, context?: Record<string, unknown>): AppError {
  const code = classifyError(error);
  return wrapError(error, code, undefined, context);
}
