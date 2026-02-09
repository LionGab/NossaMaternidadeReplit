/**
 * Comments API Service
 *
 * Serviço para interagir com a tabela community_comments do Supabase
 */

import { z } from "zod";
import { logger } from "../utils/logger";
import { validateWithSchema } from "../utils/validation";
import { getSupabaseDiagnostics, supabase } from "./supabase";

/**
 * Type guard para verificar se Supabase está configurado
 */
function checkSupabase() {
  if (!supabase) {
    const diagnostics = getSupabaseDiagnostics();
    const errorMessage = [
      "Supabase não está configurado.",
      "",
      "Variáveis de ambiente:",
      diagnostics.url
        ? `  ✓ EXPO_PUBLIC_SUPABASE_URL: configurado`
        : "  ✗ EXPO_PUBLIC_SUPABASE_URL: faltando",
      diagnostics.hasKey
        ? "  ✓ EXPO_PUBLIC_SUPABASE_ANON_KEY: configurado"
        : "  ✗ EXPO_PUBLIC_SUPABASE_ANON_KEY: faltando",
    ].join("\n");

    logger.error("Verificação do Supabase falhou", "CommentsAPI", new Error(errorMessage));
    throw new Error(errorMessage);
  }
  return supabase;
}

/**
 * Interface para comentário retornado da API
 */
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  parentId?: string;
}

/**
 * Interface para criar comentário
 */
export interface CreateCommentInput {
  postId: string;
  content: string;
  parentId?: string;
}

/**
 * Busca comentários de um post
 */
export async function fetchComments(
  postId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ data: Comment[]; error: Error | null }> {
  try {
    const client = checkSupabase();

    const {
      data: { session },
    } = await client.auth.getSession();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (client as any)
      .from("community_comments")
      .select(
        `
        id,
        post_id,
        user_id,
        content,
        likes_count,
        created_at,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    // Verificar quais comentários o usuário curtiu
    let likedCommentIds: Set<string> = new Set();
    if (session?.user?.id && data && data.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const commentIds = data.map((c: any) => c.id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: likesData, error: likesError } = await (client as any)
        .from("community_likes")
        .select("comment_id")
        .eq("user_id", session.user.id)
        .in("comment_id", commentIds);

      if (!likesError && likesData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        likedCommentIds = new Set(likesData.map((l: any) => l.comment_id));
      }
    }

    // Mapear para formato do app
    const comments: Comment[] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?.map((comment: any) => {
        const profile = comment.profiles as { full_name?: string; avatar_url?: string } | null;
        return {
          id: comment.id,
          postId: comment.post_id,
          authorId: comment.user_id,
          authorName: profile?.full_name || "Usuária",
          authorAvatar: profile?.avatar_url || undefined,
          content: comment.content,
          likesCount: comment.likes_count ?? 0,
          isLiked: likedCommentIds.has(comment.id),
          createdAt: comment.created_at ?? new Date().toISOString(),
        };
      }) || [];

    return { data: comments, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao buscar comentários", "CommentsAPI", errorObj);
    return { data: [], error: errorObj };
  }
}

/**
 * Cria um novo comentário
 */
export async function createComment(
  input: CreateCommentInput
): Promise<{ data: Comment | null; error: Error | null }> {
  try {
    // Validação com Zod
    const contentSchema = z
      .string()
      .trim()
      .min(1, "Comentário não pode estar vazio")
      .max(2000, "Comentário muito longo (máximo 2000 caracteres)");

    const contentValidation = validateWithSchema(contentSchema, input.content);
    if (!contentValidation.success) {
      const errorMessage = contentValidation.errors.join(", ");
      logger.error("Comment content validation failed", "CommentsAPI", new Error(errorMessage));
      return { data: null, error: new Error(errorMessage) };
    }

    const client = checkSupabase();

    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session?.user?.id) {
      return { data: null, error: new Error("Usuário não autenticado") };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (client as any)
      .from("community_comments")
      .insert({
        post_id: input.postId,
        user_id: session.user.id,
        content: input.content.trim(),
      })
      .select(
        `
        id,
        post_id,
        user_id,
        content,
        likes_count,
        created_at,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const profile = data?.profiles as { full_name?: string; avatar_url?: string } | null;
    const comment: Comment = {
      id: data?.id,
      postId: data?.post_id,
      authorId: data?.user_id,
      authorName: profile?.full_name || "Você",
      authorAvatar: profile?.avatar_url || undefined,
      content: data?.content,
      likesCount: data?.likes_count ?? 0,
      isLiked: false,
      createdAt: data?.created_at || new Date().toISOString(),
    };

    logger.info("Comentário criado com sucesso", "CommentsAPI", { postId: input.postId });
    return { data: comment, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao criar comentário", "CommentsAPI", errorObj);
    return { data: null, error: errorObj };
  }
}

/**
 * Toggle like em um comentário
 */
export async function toggleCommentLike(
  commentId: string
): Promise<{ liked: boolean; error: Error | null }> {
  try {
    const client = checkSupabase();

    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session?.user?.id) {
      return { liked: false, error: new Error("Usuário não autenticado") };
    }

    // Verificar se já curtiu (community_likes com comment_id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingLike } = await (client as any)
      .from("community_likes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (existingLike) {
      // Remover like
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: deleteError } = await (client as any)
        .from("community_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", session.user.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      return { liked: false, error: null };
    } else {
      // Adicionar like
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (client as any).from("community_likes").insert({
        comment_id: commentId,
        user_id: session.user.id,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      return { liked: true, error: null };
    }
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao curtir comentário", "CommentsAPI", errorObj);
    return { liked: false, error: errorObj };
  }
}

/**
 * Deleta um comentário (soft delete)
 */
export async function deleteComment(
  commentId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const client = checkSupabase();

    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session?.user?.id) {
      return { success: false, error: new Error("Usuário não autenticado") };
    }

    // Deletar comentário (hard delete já que não temos is_deleted)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (client as any)
      .from("community_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", session.user.id);

    if (error) {
      throw new Error(error.message);
    }

    logger.info("Comentário deletado", "CommentsAPI", { commentId });
    return { success: true, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao deletar comentário", "CommentsAPI", errorObj);
    return { success: false, error: errorObj };
  }
}
