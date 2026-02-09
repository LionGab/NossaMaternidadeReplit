/**
 * Hook para APIs com retry automático
 * Wrapper para funções de API com tratamento de erro e retry
 * Previne memory leaks: não atualiza estado em componentes desmontados
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { retryNetworkRequest } from "../utils/retry";
import { logger } from "../utils/logger";
import { isAppError } from "../utils/error-handler";
import { useToast } from "../context/ToastContext";

export interface UseApiWithRetryOptions {
  showErrorToast?: boolean;
  errorMessage?: string;
  maxRetries?: number;
}

export function useApiWithRetry<T extends unknown[], R>(
  apiFunction: (...args: T) => Promise<R>,
  options: UseApiWithRetryOptions = {}
) {
  const {
    showErrorToast = true,
    errorMessage = "Erro ao carregar dados",
    maxRetries = 3,
  } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useToast();

  // Track se componente está montado para evitar memory leaks
  const isMountedRef = useRef(true);

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: T): Promise<R | null> => {
      // Se componente já foi desmontado, não executar
      if (!isMountedRef.current) {
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await retryNetworkRequest(() => apiFunction(...args), {
          maxAttempts: maxRetries,
          context: "useApiWithRetry",
        });

        // Só atualizar estado se componente ainda está montado
        if (isMountedRef.current) {
          setLoading(false);
        }

        return result;
      } catch (err) {
        // Só atualizar estado se componente ainda está montado
        if (!isMountedRef.current) {
          return null;
        }

        // Converter erro para Error se necessário
        let errorObj: Error;
        if (err instanceof Error) {
          errorObj = err;
        } else {
          errorObj = new Error(String(err));
        }

        setError(errorObj);
        setLoading(false);

        // Log estruturado
        if (isAppError(errorObj)) {
          logger.error(errorObj.message, errorObj.code, errorObj, errorObj.context);
        } else {
          logger.error(`API call failed: ${errorMessage}`, "API", errorObj);
        }

        // Mostrar toast se configurado
        if (showErrorToast) {
          showError(isAppError(errorObj) ? errorObj.userMessage : errorMessage);
        }

        return null;
      }
    },
    [apiFunction, errorMessage, maxRetries, showErrorToast, showError]
  );

  return {
    execute,
    loading,
    error,
  };
}
