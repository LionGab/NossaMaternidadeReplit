/**
 * Atualiza status premium quando app volta do background
 *
 * PR-D: Foreground refresh com cooldown para evitar refreshes excessivos
 */
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { usePremiumStore } from "../state/premium-store";
import { isExpoGo } from "../utils/expo";
import { logger } from "../utils/logger";

const FOREGROUND_REFRESH_COOLDOWN_MS = 30_000; // 30 segundos

export function usePremiumForegroundRefresh() {
  const syncWithRevenueCat = usePremiumStore((s) => s.syncWithRevenueCat);
  const lastRefresh = useRef<number>(0);

  useEffect(() => {
    if (Platform.OS === "web" || isExpoGo()) {
      return;
    }

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        const now = Date.now();
        const elapsed = now - lastRefresh.current;

        // Cooldown para evitar refreshes excessivos
        if (elapsed >= FOREGROUND_REFRESH_COOLDOWN_MS) {
          lastRefresh.current = now;
          logger.debug("App foregrounded, refreshing premium status", "PremiumRefresh");
          syncWithRevenueCat("appstate");
        }
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [syncWithRevenueCat]);
}
