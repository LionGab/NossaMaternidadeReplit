/**
 * useScreenTimeAnalytics - Hook para rastrear tempo em tela
 *
 * Rastreia quanto tempo o usuário permanece em uma tela específica,
 * útil para analytics e métricas de engajamento.
 *
 * Features:
 * - Auto-tracking on mount/unmount
 * - AppState awareness (pausa quando app em background)
 * - Callback opcional no desmount com tempo total
 *
 * @example
 * ```tsx
 * // Uso básico
 * useScreenTimeAnalytics("OnboardingWelcome");
 *
 * // Com callback para quando sair da tela
 * useScreenTimeAnalytics("OnboardingWelcome", {
 *   onLeave: (timeSpentMs) => {
 *     logger.info(`User spent ${timeSpentMs}ms on welcome screen`);
 *   }
 * });
 * ```
 */

import { useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { logger } from "@/utils/logger";

interface UseScreenTimeAnalyticsOptions {
  /** Callback chamado quando usuário sai da tela, com tempo em ms */
  onLeave?: (timeSpentMs: number) => void;
  /** Se deve pausar o timer quando app vai pra background (default: true) */
  pauseInBackground?: boolean;
  /** Nome customizado para logs (default: screenName) */
  logContext?: string;
}

interface UseScreenTimeAnalyticsResult {
  /** Retorna o tempo atual gasto em ms */
  getTimeSpent: () => number;
}

/**
 * Hook para rastrear tempo em tela com awareness de AppState
 *
 * @param screenName - Nome da tela para identificação em analytics
 * @param options - Configurações opcionais
 */
export function useScreenTimeAnalytics(
  screenName: string,
  options: UseScreenTimeAnalyticsOptions = {}
): UseScreenTimeAnalyticsResult {
  const { onLeave, pauseInBackground = true, logContext } = options;

  const startTimeRef = useRef<number>(Date.now());
  const totalTimeRef = useRef<number>(0);
  const isActiveRef = useRef<boolean>(true);
  const context = logContext ?? screenName;

  // Função para calcular tempo total gasto
  const getTimeSpent = useCallback((): number => {
    if (isActiveRef.current) {
      return totalTimeRef.current + (Date.now() - startTimeRef.current);
    }
    return totalTimeRef.current;
  }, []);

  // AppState listener - pausa quando em background
  useEffect(() => {
    if (!pauseInBackground) return;

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active" && !isActiveRef.current) {
        // App voltou ao foreground - reinicia timer
        isActiveRef.current = true;
        startTimeRef.current = Date.now();
        logger.debug(`[${context}] Screen time tracking resumed`, context);
      } else if (nextState !== "active" && isActiveRef.current) {
        // App foi pra background - acumula tempo
        isActiveRef.current = false;
        totalTimeRef.current += Date.now() - startTimeRef.current;
        logger.debug(`[${context}] Screen time tracking paused`, context);
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [pauseInBackground, context]);

  // Log on mount e cleanup on unmount
  useEffect(() => {
    logger.debug(`[${context}] Screen time tracking started`, context);

    return () => {
      const timeSpent = getTimeSpent();
      logger.info(`[${context}] Time spent: ${timeSpent}ms`, context, {
        screenName,
        timeSpentMs: timeSpent,
        timeSpentSec: Math.round(timeSpent / 1000),
      });

      onLeave?.(timeSpent);
    };
  }, [screenName, context, onLeave, getTimeSpent]);

  return {
    getTimeSpent,
  };
}
