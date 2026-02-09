/**
 * Privacy Store - AI Consent Management
 *
 * Manages AI consent state for NathIA feature (Apple Guideline 5.1.2(i) compliance).
 * Syncs consent status with Supabase user metadata for backend validation.
 *
 * @see docs/release/TESTFLIGHT_GATES_v1.md Gate G2.5 (Privacy Compliance)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "../api/supabase";
import { logger } from "../utils/logger";

export type AiConsentStatus = "unknown" | "accepted" | "declined";

interface PrivacyState {
  // State
  aiConsentStatus: AiConsentStatus;
  isAiEnabled: boolean;

  // Hydration state (for async storage loading)
  _hasHydrated: boolean;

  // Derived helper (computed property - always check latest state)
  canUseAi: () => boolean;

  // Hydration check
  hasHydrated: () => boolean;

  // Actions
  acceptAiConsent: () => Promise<void>;
  declineAiConsent: () => Promise<void>;
  setAiEnabled: (enabled: boolean) => Promise<void>;
}

/**
 * Syncs AI consent/enabled flags to Supabase user metadata
 * This allows backend Edge Functions to validate consent before processing AI requests
 */
async function updateUserAiMetadata(data: Record<string, unknown>): Promise<void> {
  if (!supabase) {
    logger.warn("Supabase not configured - skipping AI metadata sync", "PrivacyStore");
    return;
  }

  try {
    const { error } = await supabase.auth.updateUser({ data });

    if (error) {
      logger.error("Failed to sync AI metadata to Supabase", "PrivacyStore", error);
      throw error;
    }

    logger.info("AI metadata synced to Supabase", "PrivacyStore", data);
  } catch (error) {
    logger.error(
      "Unexpected error syncing AI metadata",
      "PrivacyStore",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set, get) => ({
      // Initial state: unknown (user hasn't seen consent screen yet)
      aiConsentStatus: "unknown",
      isAiEnabled: false,

      // Hydration state: false until AsyncStorage loads
      _hasHydrated: false,

      // Derived state: can use AI only if accepted AND enabled
      canUseAi: () => {
        const state = get();
        return state.aiConsentStatus === "accepted" && state.isAiEnabled === true;
      },

      // Check if store has been hydrated from AsyncStorage
      hasHydrated: () => {
        return get()._hasHydrated;
      },

      // Accept AI consent: sets accepted + enables AI + syncs to backend
      acceptAiConsent: async () => {
        set({ aiConsentStatus: "accepted", isAiEnabled: true });

        try {
          await updateUserAiMetadata({ ai_consent: true, is_ai_enabled: true });
        } catch (error) {
          // Non-blocking: local state is source of truth for UX
          // Backend will validate on first AI request and return 403 if metadata is missing
          logger.warn(
            "AI consent accepted locally but sync failed - backend will retry on first AI request",
            "PrivacyStore",
            { error: error instanceof Error ? error.message : String(error) }
          );
        }
      },

      // Decline AI consent: sets declined + disables AI + syncs to backend
      declineAiConsent: async () => {
        set({ aiConsentStatus: "declined", isAiEnabled: false });

        try {
          await updateUserAiMetadata({ ai_consent: false, is_ai_enabled: false });
        } catch (error) {
          // Non-blocking: local state is source of truth for UX
          logger.warn("AI consent declined locally but sync failed", "PrivacyStore", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },

      // Toggle AI enabled state (only works if consent is accepted)
      setAiEnabled: async (enabled: boolean) => {
        const status = get().aiConsentStatus;

        // Guard: can't enable AI without consent
        const nextEnabled = status === "accepted" ? enabled : false;

        set({ isAiEnabled: nextEnabled });

        try {
          // Sync to backend (preserves ai_consent, only updates is_ai_enabled)
          await updateUserAiMetadata({ is_ai_enabled: nextEnabled });
        } catch (error) {
          logger.warn("AI enabled state changed locally but sync failed", "PrivacyStore", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      },
    }),
    {
      name: "privacy-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist state (not derived functions, not hydration state)
      partialize: (state) => ({
        aiConsentStatus: state.aiConsentStatus,
        isAiEnabled: state.isAiEnabled,
      }),
      // Mark hydration complete when AsyncStorage loads
      onRehydrateStorage: () => (state) => {
        if (state) {
          usePrivacyStore.setState({ _hasHydrated: true });
          logger.info("Privacy store hydrated", "PrivacyStore", {
            aiConsentStatus: state.aiConsentStatus,
            isAiEnabled: state.isAiEnabled,
          });
        }
      },
    }
  )
);
