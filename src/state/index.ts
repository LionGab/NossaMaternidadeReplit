/**
 * State Management - Zustand Stores
 *
 * This file re-exports all stores from their individual files.
 * Import stores from "@/state" or "@/state/store" for backward compatibility.
 *
 * Example:
 *   import { useAppStore, useChatStore } from "@/state";
 *
 * IMPORTANT: Use individual selectors to prevent infinite loops:
 *   const user = useAppStore((s) => s.user);           // CORRECT
 *   const { user } = useAppStore((s) => ({ user }));   // WRONG - creates new ref
 */

// Core stores
export { useAppStore } from "./app-store";
export type { AppState } from "./app-store";
export { useDailyInsightStore } from "./daily-insight-store";

export { useCommunityStore } from "./community-store";

export { useChatStore } from "./chat-store";
export type { Conversation } from "./chat-store";

export { useCycleStore } from "./cycle-store";

export { useAffirmationsStore } from "./affirmations-store";

export { useHabitsStore } from "./habits-store";
export type { Habit } from "./habits-store";

export { useCheckInStore } from "./checkin-store";
export type { DailyCheckIn } from "./checkin-store";

export { useRemindersStore } from "./reminders-store";
export type { Reminder } from "./reminders-store";

// Additional stores (already in separate files)
export { usePremiumStore } from "./premium-store";
export { useNathJourneyOnboardingStore } from "./nath-journey-onboarding-store";
export { useNathIAOnboardingStore } from "./nathia-onboarding-store";
export { usePreferencesStore } from "./usePreferencesStore";
export { usePrivacyStore } from "./usePrivacyStore";
export { useThemePresetStore } from "./theme-preset-store";

// Initialize auth listener and Reactotron
import "./auth-init";
import "./reactotron-init";
