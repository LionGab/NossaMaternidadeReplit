/**
 * Community Store - Zustand
 *
 * Gerencia estado da comunidade Mães Valente:
 * - Posts do feed (com sistema de moderação)
 * - Loading/error states
 * - Ações assíncronas integradas com API
 */

import { create } from "zustand";
import { Group, Post } from "../types/navigation";
import {
  fetchPosts as apiFetchPosts,
  createPost as apiCreatePost,
  togglePostLike,
} from "../api/community";
import { logger } from "../utils/logger";

interface CommunityState {
  // Data
  posts: Post[];
  groups: Group[];

  // UI States
  isLoading: boolean;
  isRefreshing: boolean;
  isCreating: boolean;
  error: string | null;

  // Pagination
  hasMore: boolean;
  offset: number;

  // Actions - Data
  loadPosts: () => Promise<void>;
  refreshPosts: () => Promise<void>;
  loadMorePosts: () => Promise<void>;
  createPost: (content: string, imageUrl?: string) => Promise<boolean>;

  // Actions - Local State
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  toggleLike: (postId: string) => Promise<void>;
  setGroups: (groups: Group[]) => void;
  clearError: () => void;
}

const POSTS_PER_PAGE = 20;

/**
 * Community Store (não persistido para manter dados fresh)
 */
export const useCommunityStore = create<CommunityState>()((set, get) => ({
  // Initial state
  posts: [],
  groups: [],
  isLoading: false,
  isRefreshing: false,
  isCreating: false,
  error: null,
  hasMore: true,
  offset: 0,

  /**
   * Carrega posts iniciais do feed
   */
  loadPosts: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const { data, error } = await apiFetchPosts(POSTS_PER_PAGE, 0);

      if (error) {
        throw error;
      }

      set({
        posts: data,
        offset: data.length,
        hasMore: data.length === POSTS_PER_PAGE,
        isLoading: false,
      });

      logger.info(`Carregados ${data.length} posts`, "CommunityStore");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar posts";
      logger.error(
        "Erro ao carregar posts",
        "CommunityStore",
        error instanceof Error ? error : new Error(message)
      );
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Atualiza feed (pull-to-refresh)
   */
  refreshPosts: async () => {
    set({ isRefreshing: true, error: null });

    try {
      const { data, error } = await apiFetchPosts(POSTS_PER_PAGE, 0);

      if (error) {
        throw error;
      }

      set({
        posts: data,
        offset: data.length,
        hasMore: data.length === POSTS_PER_PAGE,
        isRefreshing: false,
      });

      logger.info("Feed atualizado", "CommunityStore");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar feed";
      logger.error(
        "Erro ao atualizar feed",
        "CommunityStore",
        error instanceof Error ? error : new Error(message)
      );
      set({ error: message, isRefreshing: false });
    }
  },

  /**
   * Carrega mais posts (infinite scroll)
   */
  loadMorePosts: async () => {
    const { isLoading, isRefreshing, hasMore, offset } = get();
    if (isLoading || isRefreshing || !hasMore) return;

    set({ isLoading: true });

    try {
      const { data, error } = await apiFetchPosts(POSTS_PER_PAGE, offset);

      if (error) {
        throw error;
      }

      set((state) => ({
        posts: [...state.posts, ...data],
        offset: state.offset + data.length,
        hasMore: data.length === POSTS_PER_PAGE,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar mais posts";
      logger.error(
        "Erro ao carregar mais posts",
        "CommunityStore",
        error instanceof Error ? error : new Error(message)
      );
      set({ isLoading: false });
    }
  },

  /**
   * Cria novo post (vai para revisão - status pending)
   */
  createPost: async (content: string, imageUrl?: string) => {
    set({ isCreating: true, error: null });

    try {
      const { data, error } = await apiCreatePost(content, imageUrl);

      if (error) {
        throw error;
      }

      if (data) {
        // Adiciona no topo do feed local (mesmo pendente, mostra para o autor)
        set((state) => ({
          posts: [data, ...state.posts],
          isCreating: false,
        }));

        logger.info("Post criado e enviado para revisão", "CommunityStore");
        return true;
      }

      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar post";
      logger.error(
        "Erro ao criar post",
        "CommunityStore",
        error instanceof Error ? error : new Error(message)
      );
      set({ error: message, isCreating: false });
      return false;
    }
  },

  // Local state setters
  setPosts: (posts) => set({ posts }),

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  /**
   * Toggle like em um post (otimistic update)
   */
  toggleLike: async (postId: string) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Optimistic update
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      ),
    }));

    // API call
    const { error } = await togglePostLike(postId);

    if (error) {
      // Revert on error
      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                isLiked: post.isLiked,
                likesCount: post.likesCount,
              }
            : p
        ),
      }));
      logger.error("Erro ao curtir post", "CommunityStore", error);
    }
  },

  setGroups: (groups) => set({ groups }),

  clearError: () => set({ error: null }),
}));
