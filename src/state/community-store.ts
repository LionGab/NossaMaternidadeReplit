/**
 * Community Store - Zustand (UI State Only)
 *
 * Gerencia APENAS estado de UI da comunidade.
 * Server state (posts, comments, likes) está nos hooks TanStack Query:
 *   - usePosts, useCreatePost, useTogglePostLike (src/api/hooks/)
 *
 * @see src/api/hooks/index.ts for server state hooks
 */

import { create } from "zustand";

interface CommunityUIState {
  // UI state
  isCreating: boolean;
  error: string | null;

  // Actions
  setIsCreating: (creating: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Community UI Store (não persistido)
 *
 * Server state migrado para TanStack Query:
 * - posts → usePosts() hook
 * - createPost → useCreatePost() hook
 * - toggleLike → useTogglePostLike() hook
 * - loadPosts/refreshPosts → useQuery refetch
 * - loadMorePosts → pagination via useQuery
 */
export const useCommunityStore = create<CommunityUIState>()((set) => ({
  isCreating: false,
  error: null,

  setIsCreating: (creating) => set({ isCreating: creating }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
