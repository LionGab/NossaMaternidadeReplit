/**
 * Hook para otimizar selectors do Zustand
 * Evita re-renders desnecessários usando shallow comparison
 */

import { useCallback, useMemo, useRef } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand";

const EMPTY_DEPS: readonly unknown[] = [];

/**
 * Shallow comparison for objects
 */
function shallowEqual<T extends Record<string, unknown>>(a: T, b: T): boolean {
  if (a === b) return true;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

/**
 * Cria um selector otimizado que evita re-renders
 * Use quando precisar de múltiplos valores do store
 */
export function useOptimizedSelector<T, U>(store: StoreApi<T>, selector: (state: T) => U): U {
  return useStore(store, selector);
}

/**
 * Helper para criar selectors múltiplos sem causar re-renders
 * Retorna um objeto com os valores selecionados
 *
 * Usa um único selector memoizado que extrai todas as chaves de uma vez,
 * evitando a violação das Rules of Hooks (não chama hooks em loops)
 *
 * IMPORTANTE: O array `selectors` deve ser estável (memoizado ou constante)
 * para melhor performance. Se passado inline, o selector será recriado a cada render.
 *
 * @example
 * // ✅ Bom: array constante fora do componente
 * const KEYS = ['name', 'email'] as const;
 * const data = useMultipleSelectors(store, KEYS);
 *
 * // ✅ Bom: array memoizado
 * const keys = useMemo(() => ['name', 'email'], []);
 * const data = useMultipleSelectors(store, keys);
 *
 * // ⚠️ Evitar: array inline (recria selector a cada render)
 * const data = useMultipleSelectors(store, ['name', 'email']);
 *
 * @param store - Zustand store
 * @param selectors - Array of keys to select (should be stable/memoized for best performance)
 */
export function useMultipleSelectors<T extends Record<string, unknown>>(
  store: StoreApi<T>,
  selectors: readonly (keyof T)[]
): Partial<T> {
  // Cache for shallow comparison - starts null to handle first run correctly
  const cacheRef = useRef<Partial<T> | null>(null);

  // Memoize the selector function based on selectors array
  const combinedSelector = useCallback(
    (state: T): Partial<T> => {
      const result: Partial<T> = {};
      for (const key of selectors) {
        result[key] = state[key];
      }

      // First run or if values changed, update cache
      if (cacheRef.current === null || !shallowEqual(result, cacheRef.current)) {
        cacheRef.current = result;
      }

      return cacheRef.current;
    },
    [selectors]
  );

  return useStore(store, combinedSelector);
}

/**
 * Hook para memoizar selector complexo
 */
export function useMemoizedSelector<T, U>(
  store: StoreApi<T>,
  selector: (state: T) => U,
  deps: readonly unknown[] = EMPTY_DEPS
): U {
  const memoizedSelector = useMemo(() => {
    // deps é intencional: permite que o caller force re-memoização quando necessário
    void deps;
    return (state: T) => selector(state);
  }, [deps, selector]);
  return useStore(store, memoizedSelector);
}
