/**
 * TanStack Query Hooks - API Integration
 *
 * React Query hooks para chamadas de API do Supabase.
 * Usa query key factory de src/api/queryKeys.ts para consistency.
 */

import { createComment, deleteComment, fetchComments, toggleCommentLike } from "@/api/comments";
import {
  createPost,
  fetchMyPosts,
  fetchPostById,
  fetchPosts,
  searchPosts,
  togglePostLike,
} from "@/api/community";
import { communityKeys, userKeys } from "@/api/queryKeys";
import type { Post } from "@/types/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Input para criação de post
 */
interface CreatePostInput {
  content: string;
  imageUrl?: string;
  groupId?: string;
}

// ============ COMMUNITY POSTS ============

/**
 * Hook para buscar feed de posts da comunidade
 */
export function usePosts(limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: communityKeys.posts({ limit, offset }),
    queryFn: async () => {
      const { data, error } = await fetchPosts(limit, offset);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Hook para buscar um post específico
 */
export function usePost(postId: string) {
  return useQuery({
    queryKey: communityKeys.post(postId),
    queryFn: async () => {
      const { data, error } = await fetchPostById(postId);
      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}

/**
 * Hook para buscar posts do usuário logado
 */
export function useMyPosts(limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: userKeys.myPosts({ limit, offset }),
    queryFn: async () => {
      const { data, error } = await fetchMyPosts(limit, offset);
      if (error) throw error;
      return data;
    },
  });
}

/**
 * Hook para buscar posts por termo de busca
 */
export function useSearchPosts(query: string, limit: number = 20) {
  return useQuery({
    queryKey: communityKeys.search(query),
    queryFn: async () => {
      const { data, error } = await searchPosts(query, limit);
      if (error) throw error;
      return data;
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60, // 1 minuto
  });
}

/**
 * Hook para criar novo post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const { data, error } = await createPost(input.content, input.imageUrl, input.groupId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.myPosts() });
    },
  });
}

/**
 * Hook para curtir/descurtir post
 */
export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await togglePostLike(postId);
      if (error) throw error;
    },
    onMutate: async (postId) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: communityKeys.post(postId) });

      // Snapshot do valor anterior
      const previousPost = queryClient.getQueryData<Post>(communityKeys.post(postId));

      // Optimistic update
      if (previousPost) {
        queryClient.setQueryData<Post>(communityKeys.post(postId), {
          ...previousPost,
          isLiked: !previousPost.isLiked,
          likesCount: previousPost.isLiked
            ? previousPost.likesCount - 1
            : previousPost.likesCount + 1,
        });
      }

      return { previousPost };
    },
    onError: (_err, postId, context) => {
      // Reverter em caso de erro
      if (context?.previousPost) {
        queryClient.setQueryData(communityKeys.post(postId), context.previousPost);
      }
    },
    onSettled: () => {
      // Refetch para garantir consistência
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

// ============ COMMENTS ============

/**
 * Hook para buscar comentários de um post
 */
export function useComments(postId: string) {
  return useQuery({
    queryKey: communityKeys.comments(postId),
    queryFn: async () => {
      const { data, error } = await fetchComments(postId);
      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}

/**
 * Hook para criar comentário
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { postId: string; content: string; parentId?: string }) => {
      const { data, error } = await createComment(input);
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidar comentários do post
      queryClient.invalidateQueries({
        queryKey: communityKeys.comments(variables.postId),
      });
      // Atualizar contagem de comentários
      queryClient.invalidateQueries({
        queryKey: communityKeys.post(variables.postId),
      });
    },
  });
}

/**
 * Hook para curtir/descurtir comentário
 */
export function useToggleCommentLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await toggleCommentLike(commentId);
      if (error) throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

/**
 * Hook para deletar comentário
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await deleteComment(commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

// ============ COMMUNITY STATS ============

import { fetchCommunityStats, type CommunityStats } from "@/api/community";

/**
 * Hook para buscar stats reais da comunidade (membros, posts, engajamento)
 */
export function useCommunityStats() {
  return useQuery<CommunityStats>({
    queryKey: communityKeys.stats(),
    queryFn: async () => {
      const { data, error } = await fetchCommunityStats();
      if (error || !data) throw error ?? new Error("Stats indisponíveis");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// ============ PHASE 2 HOOKS ============

export { useCommunityPosts } from "./useCommunityPosts";
export { useCycleData } from "./useCycleData";
export { useDeletePost } from "./useDeletePost";
export { useHabits, useToggleHabit } from "./useHabits";
export { useLikePost } from "./useLikePost";
export { useReportPost } from "./useReportPost";
export { useSaveCycleDailyLog, useUpdateCycle } from "./useUpdateCycle";
