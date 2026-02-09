/**
 * Reactotron integration for Zustand stores
 * DEV only - provides debugging capabilities
 */

import { logger } from "../utils/logger";

/**
 * Initialize Reactotron with all Zustand stores
 * Call this once at app startup in DEV mode
 */
export async function initializeReactotron(): Promise<void> {
  if (!__DEV__) return;

  try {
    const { registerZustandStores } = await import("../config/reactotron");
    const { useAppStore } = await import("./app-store");
    const { useCommunityStore } = await import("./community-store");
    const { useChatStore } = await import("./chat-store");
    const { useCycleStore } = await import("./cycle-store");
    const { useAffirmationsStore } = await import("./affirmations-store");
    const { useHabitsStore } = await import("./habits-store");
    const { useCheckInStore } = await import("./checkin-store");
    const { usePremiumStore } = await import("./premium-store");
    const { useNathJourneyOnboardingStore } = await import("./nath-journey-onboarding-store");
    const { useNathIAOnboardingStore } = await import("./nathia-onboarding-store");

    registerZustandStores({
      app: useAppStore,
      community: useCommunityStore,
      chat: useChatStore,
      cycle: useCycleStore,
      affirmations: useAffirmationsStore,
      habits: useHabitsStore,
      checkIn: useCheckInStore,
      premium: usePremiumStore,
      nathJourney: useNathJourneyOnboardingStore,
      nathIA: useNathIAOnboardingStore,
    });

    logger.debug("Reactotron initialized with Zustand stores", "ReactotronInit");
  } catch (error) {
    logger.warn("Failed to initialize Reactotron", "ReactotronInit", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Auto-initialize on import in DEV mode
if (__DEV__) {
  initializeReactotron();
}
