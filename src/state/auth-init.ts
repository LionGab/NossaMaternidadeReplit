/**
 * Auth state listener initialization
 * This file initializes the auth state change listener that syncs
 * authentication state with Supabase and RevenueCat
 */

import { onAuthStateChange } from "../api/auth";
import { logger } from "../utils/logger";
import { useAppStore } from "./app-store";

/**
 * Initialize auth state listener
 * Call this once at app startup (e.g., in App.tsx or index.ts)
 */
export function initializeAuthListener(): void {
  try {
    onAuthStateChange(async (authUser) => {
      const store = useAppStore.getState();
      if (authUser) {
        store.setAuthUserId(authUser.id);
        store.setAuthenticated(true);
        // Load full profile from database
        await store.loadUserProfile(authUser.id);

        // CRÍTICO: Sincronizar RevenueCat após login (inclui login social)
        try {
          const revenuecat = await import("../services/revenuecat");
          await revenuecat.loginUser(authUser.id);
          logger.info("RevenueCat sincronizado após login", "AuthInit", { userId: authUser.id });
        } catch (error) {
          // Não bloquear login se RevenueCat falhar (pode ser Expo Go)
          logger.warn("Erro ao sincronizar RevenueCat após login", "AuthInit", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      } else {
        store.clearUser();
      }
    });
  } catch {
    // Supabase not configured, skip auth state listener
    logger.info("Supabase not configured - skipping auth state listener", "AuthInit");
  }
}

// Auto-initialize on import (maintains backward compatibility with store.ts)
initializeAuthListener();
