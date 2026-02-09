/**
 * Premium Status Hook
 *
 * Consulta o status premium do usuário via RevenueCat
 * com cache inteligente para reduzir chamadas à API
 *
 * @module hooks/usePremiumStatus
 */

import { useEffect, useState, useCallback } from "react";
import { logger } from "@/utils/logger";
import { usePremiumStore } from "@/state/premium-store";

// Cache TTL: 5 minutos
const CACHE_TTL_MS = 5 * 60 * 1000;

interface PremiumStatus {
  isPremium: boolean;
  isLoading: boolean;
  error: Error | null;
  lastChecked: number | null;
  refresh: () => Promise<void>;
}

// Cache global (compartilhado entre todas as instâncias do hook)
let cachedStatus: boolean | null = null;
let cacheTimestamp: number | null = null;

/**
 * Hook para verificar status premium do usuário
 *
 * Estratégia:
 * 1. Verifica cache (válido por 5 minutos)
 * 2. Se cache inválido, consulta RevenueCat via premium store
 * 3. Mantém estado local sincronizado com store
 *
 * @param options - Opções de configuração
 * @param options.autoRefresh - Se deve buscar automaticamente no mount (default: true)
 * @param options.refreshInterval - Intervalo de refresh automático em ms (default: null)
 */
export function usePremiumStatus(
  options: {
    autoRefresh?: boolean;
    refreshInterval?: number | null;
  } = {}
): PremiumStatus {
  const { autoRefresh = true, refreshInterval = null } = options;

  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Premium store state
  const revenueCatPremium = usePremiumStore((s) => s.isPremium);
  const checkPremiumStatus = usePremiumStore((s) => s.checkPremiumStatus);

  /**
   * Verifica se cache ainda é válido
   */
  const isCacheValid = useCallback((): boolean => {
    if (cachedStatus === null || cacheTimestamp === null) {
      return false;
    }

    const now = Date.now();
    const age = now - cacheTimestamp;

    return age < CACHE_TTL_MS;
  }, []);

  /**
   * Busca status premium do RevenueCat via store
   */
  const fetchPremiumStatus = useCallback(async (): Promise<boolean> => {
    try {
      // 1. Verificar cache
      if (isCacheValid()) {
        logger.info("Premium status from cache", "usePremiumStatus", {
          isPremium: cachedStatus,
          age: Date.now() - (cacheTimestamp || 0),
        });
        return cachedStatus as boolean;
      }

      // 2. Buscar do RevenueCat via store
      const premium = await checkPremiumStatus();

      // 3. Atualizar cache
      cachedStatus = premium;
      cacheTimestamp = Date.now();

      logger.info("Premium status fetched from RevenueCat", "usePremiumStatus", {
        isPremium: premium,
      });
      return premium;
    } catch (err) {
      logger.error("Unexpected error fetching premium status", "usePremiumStatus", err as Error);
      // Fallback para estado atual do store
      return revenueCatPremium;
    }
  }, [isCacheValid, checkPremiumStatus, revenueCatPremium]);

  /**
   * Refresh manual do status
   */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await fetchPremiumStatus();
      setIsPremium(status);
    } catch (err) {
      const error = err as Error;
      setError(error);
      logger.error("Failed to refresh premium status", "usePremiumStatus", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPremiumStatus]);

  // Auto-refresh no mount
  useEffect(() => {
    if (autoRefresh) {
      refresh();
    } else {
      setIsLoading(false);
    }
  }, [autoRefresh, refresh]);

  // Refresh interval (opcional)
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        refresh();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [refreshInterval, refresh]);

  return {
    isPremium,
    isLoading,
    error,
    lastChecked: cacheTimestamp,
    refresh,
  };
}

/**
 * Invalida cache de premium status
 * Útil após mudanças de assinatura (upgrade/downgrade)
 */
export function invalidatePremiumCache(): void {
  cachedStatus = null;
  cacheTimestamp = null;
  logger.info("Premium status cache invalidated", "usePremiumStatus");
}

/**
 * Helper: Verifica se usuário é premium (sync)
 * Retorna valor do cache ou false se cache inválido
 */
export function isPremiumCached(): boolean {
  const now = Date.now();
  if (cachedStatus !== null && cacheTimestamp !== null) {
    const age = now - cacheTimestamp;
    if (age < CACHE_TTL_MS) {
      return cachedStatus;
    }
  }
  return false;
}
