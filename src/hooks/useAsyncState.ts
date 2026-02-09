/**
 * Hook para gerenciar estados de loading/error de operações assíncronas
 * Padroniza o padrão data/loading/error em todo o app
 */

import { useState, useCallback } from "react";

export interface UseAsyncStateReturn<T> {
  /** Dados retornados pela operação */
  data: T | null;
  /** Se está carregando */
  isLoading: boolean;
  /** Erro ocorrido, se houver */
  error: Error | null;
  /** Executa a operação assíncrona */
  execute: (fn: () => Promise<T>) => Promise<T>;
  /** Limpa o estado (útil para reset) */
  reset: () => void;
}

/**
 * Hook para operações assíncronas com estados padronizados
 *
 * @example
 * ```ts
 * const { data, isLoading, error, execute } = useAsyncState<Post[]>();
 *
 * useEffect(() => {
 *   execute(() => getPosts());
 * }, []);
 * ```
 */
export function useAsyncState<T>(): UseAsyncStateReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return { data, isLoading, error, execute, reset };
}
