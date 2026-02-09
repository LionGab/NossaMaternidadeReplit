/**
 * State Management - Zustand Stores
 *
 * DEPRECATED: This file is kept for backward compatibility.
 * Import stores from "@/state" instead:
 *
 *   import { useAppStore, useChatStore } from "@/state";
 *
 * All stores have been split into individual files for better maintainability:
 *   - app-store.ts      (user profile, auth, theme)
 *   - chat-store.ts     (AI conversations)
 *   - community-store.ts (posts, groups)
 *   - cycle-store.ts    (menstrual cycle tracking)
 *   - affirmations-store.ts (daily affirmations)
 *   - habits-store.ts   (habit tracking)
 *   - checkin-store.ts  (daily check-ins)
 *
 * IMPORTANT: Use individual selectors to prevent infinite loops:
 *   const user = useAppStore((s) => s.user);           // CORRECT
 *   const { user } = useAppStore((s) => ({ user }));   // WRONG
 */

// Re-export everything from index for backward compatibility
export * from "./index";
