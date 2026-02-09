/**
 * Community API Service
 *
 * Serviço para interagir com a tabela community_posts do Supabase
 * Mapeia campos do Supabase para o tipo Post usado no app
 *
 * NOTA: Usa type assertions porque community_posts não está no Database type ainda
 */

import { z } from "zod";
import type { ReportContentType, ReportReason, UserBlock } from "../types/community";
import type { Post } from "../types/navigation";
import { logger } from "../utils/logger";
import { imagemUrlSchema, uuidSchema, validateWithSchema } from "../utils/validation";
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
      "Variáveis de ambiente faltando:",
      diagnostics.url
        ? `  ✓ EXPO_PUBLIC_SUPABASE_URL: ${diagnostics.url.substring(0, 40)}...`
        : "  ✗ EXPO_PUBLIC_SUPABASE_URL: faltando",
      diagnostics.hasKey
        ? "  ✓ EXPO_PUBLIC_SUPABASE_ANON_KEY: [configurado]"
        : "  ✗ EXPO_PUBLIC_SUPABASE_ANON_KEY: faltando",
      "",
      "Para corrigir:",
      "1. Crie arquivo .env.local na raiz do projeto",
      "2. Adicione: EXPO_PUBLIC_SUPABASE_URL=... e EXPO_PUBLIC_SUPABASE_ANON_KEY=...",
      "3. Ou configure em app.config.js → seção extra",
      "4. Reinicie o servidor Expo: npm start -- --clear",
    ].join("\n");

    logger.error("Verificação do Supabase falhou", "Community", new Error(errorMessage));
    throw new Error(errorMessage);
  }
  return supabase;
}

/**
 * Tipos de retorno das RPC functions
 */
interface ReportContentRpcResult {
  report_id: string;
}

interface BlockUserRpcResult {
  success: boolean;
}

interface IsBlockedRpcResult {
  is_blocked: boolean;
}

interface BlockedUserRpcRow {
  id: string;
  blocked_id: string;
  blocked_name: string | null;
  blocked_avatar: string | null;
  created_at: string;
}

interface RpcResult<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Helper for RPC calls with function names that may not be in generated types
 * Uses a type assertion approach that maintains runtime safety while allowing
 * custom RPC functions not yet in the Database type
 *
 * @typeParam T - Expected return type from the RPC function
 * @param name - Name of the RPC function
 * @param params - Parameters to pass to the RPC function
 * @returns Promise with data or error
 */
async function callRpc<T = unknown>(
  name: string,
  params?: Record<string, unknown>
): Promise<RpcResult<T>> {
  const client = checkSupabase();

  try {
    // Type assertion needed for custom RPC functions not in generated Database type
    // Runtime validation is handled by Supabase - if function doesn't exist, it throws
    const result = await client.rpc(name as Parameters<typeof client.rpc>[0], params as never);
    return result as unknown as RpcResult<T>;
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Mapeia moderation_status do Supabase para status do app
 */
function mapModerationStatus(
  moderationStatus: "safe" | "flagged" | "blocked" | null | undefined
): "pending" | "approved" | "rejected" {
  switch (moderationStatus) {
    case "safe":
      return "approved";
    case "flagged":
      return "pending";
    case "blocked":
      return "rejected";
    default:
      return "approved"; // Default seguro
  }
}

/**
 * Tipo para post do Supabase (community_posts)
 */
interface SupabasePost {
  id: string;
  author_id: string;
  group_id?: string | null;
  content: string;
  image_url?: string | null;
  type?: string | null;
  likes_count: number | null;
  comments_count: number | null;
  created_at: string | null;
  moderation_status?: "safe" | "flagged" | "blocked" | null;
  is_hidden?: boolean | null | undefined;
  profiles?: {
    name: string;
    avatar_url?: string | null;
  } | null;
}

/**
 * Mapeia Post do Supabase para Post do app
 */
function mapSupabasePostToAppPost(supabasePost: SupabasePost, isLiked?: boolean): Post {
  return {
    id: supabasePost.id,
    authorId: supabasePost.author_id,
    authorName: supabasePost.profiles?.name || "Usuário",
    authorAvatar: supabasePost.profiles?.avatar_url || undefined,
    content: supabasePost.content,
    imageUrl: supabasePost.image_url || undefined,
    likesCount: supabasePost.likes_count ?? 0,
    commentsCount: supabasePost.comments_count ?? 0,
    createdAt: supabasePost.created_at || new Date().toISOString(),
    groupId: supabasePost.group_id || undefined,
    type: supabasePost.type || undefined,
    status: mapModerationStatus(supabasePost.moderation_status),
    isLiked: isLiked ?? false,
  };
}

/**
 * Busca posts da comunidade com filtro de texto (busca)
 *
 * @param query - Texto para buscar no conteúdo dos posts
 * @param limit - Número máximo de resultados
 * @param offset - Offset para paginação
 */
export async function searchPosts(
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ data: Post[]; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Validar query
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      return { data: [], error: null };
    }

    // Buscar sessão atual para verificar likes
    const {
      data: { session },
    } = await client.auth.getSession();

    // Buscar posts que contenham o texto (case insensitive)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (client as unknown as { from: (table: string) => any })
      .from("community_posts")
      .select(
        `
        id,
        author_id,
        group_id,
        content,
        image_url,
        type,
        likes_count,
        comments_count,
        created_at,
        moderation_status,
        is_hidden,
        profiles:author_id (
          name,
          avatar_url
        )
      `
      )
      .eq("is_deleted", false)
      .eq("is_hidden", false)
      .or("moderation_status.eq.safe,moderation_status.is.null")
      .ilike("content", `%${trimmedQuery}%`)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    // Verificar quais posts o usuário curtiu
    let likedPostIds: Set<string> = new Set();
    if (session?.user?.id && data && data.length > 0) {
      const postIds = data.map((p: SupabasePost) => p.id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: likesData, error: likesError } = await (client as unknown as { from: (table: string) => any })
        .from("community_likes")
        .select("post_id")
        .eq("user_id", session.user.id)
        .in("post_id", postIds);

      if (!likesError && likesData) {
        likedPostIds = new Set(likesData.map((l: { post_id: string }) => l.post_id));
      }
    }

    // Mapear para formato do app
    const posts: Post[] =
      data?.map((post: SupabasePost) =>
        mapSupabasePostToAppPost(post, likedPostIds.has(post.id))
      ) || [];

    logger.info(`Busca "${trimmedQuery}" retornou ${posts.length} posts`, "CommunityAPI");
    return { data: posts, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao buscar posts", "CommunityAPI", errorObj);
    return { data: [], error: errorObj };
  }
}

/**
 * Busca posts da comunidade (feed público)
 *
 * MODERAÇÃO: Filtra apenas posts aprovados (safe) ou sem status (null = legacy)
 * Posts pendentes/rejeitados não aparecem no feed público
 */
export async function fetchPosts(
  limit: number = 20,
  offset: number = 0
): Promise<{ data: Post[]; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Buscar sessão atual para verificar se usuário está logado
    const {
      data: { session },
    } = await client.auth.getSession();

    // Query com join em profiles para pegar nome do autor
    // FILTRO DE MODERAÇÃO: safe ou null (posts antigos sem status)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (client as unknown as { from: (table: string) => any })
      .from("community_posts")
      .select(
        `
        id,
        author_id,
        group_id,
        content,
        image_url,
        type,
        likes_count,
        comments_count,
        created_at,
        moderation_status,
        is_hidden,
        profiles:author_id (
          name,
          avatar_url
        )
      `
      )
      .eq("is_deleted", false)
      .eq("is_hidden", false)
      .or("moderation_status.eq.safe,moderation_status.is.null")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    // Verificar quais posts o usuário curtiu
    let likedPostIds: Set<string> = new Set();
    if (session?.user?.id && data && data.length > 0) {
      const postIds = data.map((p: SupabasePost) => p.id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: likesData, error: likesError } = await (client as unknown as { from: (table: string) => any })
        .from("community_likes")
        .select("post_id")
        .eq("user_id", session.user.id)
        .in("post_id", postIds);

      if (!likesError && likesData) {
        likedPostIds = new Set(likesData.map((l: { post_id: string }) => l.post_id));
      }
    }

    // Mapear para formato do app
    const posts: Post[] =
      data?.map((post: SupabasePost) =>
        mapSupabasePostToAppPost(post, likedPostIds.has(post.id))
      ) || [];

    return { data: posts, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao buscar posts da comunidade", "CommunityAPI", errorObj);
    return { data: [], error: errorObj };
  }
}

/**
 * Busca um post específico pelo ID
 *
 * @param postId - UUID do post
 * @returns Post encontrado ou erro
 */
export async function fetchPostById(
  postId: string
): Promise<{ data: Post | null; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Validar UUID
    const validation = validateWithSchema(uuidSchema, postId);
    if (!validation.success) {
      return { data: null, error: new Error("ID do post inválido") };
    }

    // Buscar sessão atual para verificar likes
    const {
      data: { session },
    } = await client.auth.getSession();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (client as unknown as { from: (table: string) => any })
      .from("community_posts")
      .select(
        `
        id,
        author_id,
        group_id,
        content,
        image_url,
        type,
        likes_count,
        comments_count,
        created_at,
        moderation_status,
        is_hidden,
        profiles:author_id (
          name,
          avatar_url
        )
      `
      )
      .eq("id", postId)
      .eq("is_deleted", false)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return { data: null, error: new Error("Post não encontrado") };
    }

    // Verificar se o usuário curtiu este post
    let isLiked = false;
    if (session?.user?.id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: likeData } = await (client as unknown as { from: (table: string) => any })
        .from("community_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      isLiked = !!likeData;
    }

    const post = mapSupabasePostToAppPost(data as SupabasePost, isLiked);
    return { data: post, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao buscar post por ID", "CommunityAPI", errorObj);
    return { data: null, error: errorObj };
  }
}

/**
 * Busca posts do próprio usuário (Meus Posts)
 *
 * Inclui TODOS os posts do usuário, independente do status de moderação
 * Permite ver posts pendentes, aprovados e rejeitados
 */
export async function fetchMyPosts(
  limit: number = 20,
  offset: number = 0
): Promise<{ data: Post[]; error: Error | null }> {
  try {
    const client = checkSupabase();

    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Busca posts do próprio usuário (sem filtro de moderação)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (client as unknown as { from: (table: string) => any })
      .from("community_posts")
      .select(
        `
        id,
        author_id,
        group_id,
        content,
        image_url,
        type,
        likes_count,
        comments_count,
        created_at,
        moderation_status,
        is_hidden,
        profiles:author_id (
          name,
          avatar_url
        )
      `
      )
      .eq("author_id", userId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    // Verificar quais posts o usuário curtiu
    let likedPostIds: Set<string> = new Set();
    if (data && data.length > 0) {
      const postIds = data.map((p: SupabasePost) => p.id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: likesData, error: likesError } = await (client as unknown as { from: (table: string) => any })
        .from("community_likes")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", postIds);

      if (!likesError && likesData) {
        likedPostIds = new Set(likesData.map((l: { post_id: string }) => l.post_id));
      }
    }

    // Mapear para formato do app
    const posts: Post[] =
      data?.map((post: SupabasePost) =>
        mapSupabasePostToAppPost(post, likedPostIds.has(post.id))
      ) || [];

    return { data: posts, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao buscar meus posts", "CommunityAPI", errorObj);
    return { data: [], error: errorObj };
  }
}

/**
 * Cria um novo post na comunidade
 */
export async function createPost(
  content: string,
  imageUrl?: string,
  groupId?: string
): Promise<{ data: Post | null; error: Error | null }> {
  try {
    // Validação com Zod (CRÍTICO: previne XSS, spam, conteúdo malicioso)
    // Validar content
    const contentSchema = z
      .string()
      .trim()
      .min(1, "Post não pode estar vazio")
      .max(2000, "Post muito longo (máximo 2000 caracteres)");

    const contentValidation = validateWithSchema(contentSchema, content);
    if (!contentValidation.success) {
      const errorMessage = contentValidation.errors.join(", ");
      logger.error("Post content validation failed", "CommunityAPI", new Error(errorMessage));
      return { data: null, error: new Error(errorMessage) };
    }

    // Validar imageUrl se fornecida
    if (imageUrl) {
      const imageValidation = validateWithSchema(imagemUrlSchema, imageUrl);
      if (!imageValidation.success) {
        const errorMessage = imageValidation.errors.join(", ");
        logger.error("Image URL validation failed", "CommunityAPI", new Error(errorMessage));
        return { data: null, error: new Error(errorMessage) };
      }
    }

    // Validar groupId se fornecido
    if (groupId) {
      const groupValidation = validateWithSchema(uuidSchema, groupId);
      if (!groupValidation.success) {
        const errorMessage = groupValidation.errors.join(", ");
        logger.error("Group ID validation failed", "CommunityAPI", new Error(errorMessage));
        return { data: null, error: new Error(errorMessage) };
      }
    }

    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const authorId = session.user.id;

    // Inserir post
    const { data: postData, error } = await client
      .from("community_posts")
      .insert({
        author_id: authorId,
        content: content.trim(),
        image_url: imageUrl || null,
        group_id: groupId || null,
        type: imageUrl ? "image" : "text",
      })
      .select(
        `
        id,
        author_id,
        group_id,
        content,
        image_url,
        type,
        likes_count,
        comments_count,
        created_at,
        moderation_status,
        is_hidden,
        profiles:author_id (
          name,
          avatar_url
        )
      `
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!postData) {
      throw new Error("Post não foi criado");
    }

    // Mapear para formato do app
    const post = mapSupabasePostToAppPost(postData as SupabasePost, false);

    return { data: post, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao criar post", "CommunityAPI", errorObj);
    return { data: null, error: errorObj };
  }
}

/**
 * Alterna like em um post
 */
export async function togglePostLike(
  postId: string
): Promise<{ data: boolean; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Verificar se já curtiu
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingLike } = await (client as any)
      .from("community_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingLike) {
      // Remover like
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (client as any)
        .from("community_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (error) {
        throw new Error(error.message);
      }
      return { data: false, error: null }; // Like removido
    } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (client as any).from("community_likes").insert({
      post_id: postId,
      user_id: userId,
    });

      if (error) {
        throw new Error(error.message);
      }
      return { data: true, error: null }; // Like adicionado
    }
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao alternar like", "CommunityAPI", errorObj);
    return { data: false, error: errorObj };
  }
}

/**
 * Deleta um post (soft delete)
 */
export async function deletePost(postId: string): Promise<{ data: boolean; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Soft delete
    const { error } = await client
      .from("community_posts")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("author_id", session.user.id); // Apenas o autor pode deletar

    if (error) {
      throw new Error(error.message);
    }

    return { data: true, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao deletar post", "CommunityAPI", errorObj);
    return { data: false, error: errorObj };
  }
}

// ============================================================================
// MODERATION FUNCTIONS - Report & Block
// ============================================================================

/**
 * Labels para os tipos de denúncia (usado na UI)
 */
export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: "Spam ou propaganda",
  harassment: "Assédio ou bullying",
  hate_speech: "Discurso de ódio",
  inappropriate_content: "Conteúdo inapropriado",
  misinformation: "Informação falsa",
  impersonation: "Fingindo ser outra pessoa",
  other: "Outro motivo",
};

/**
 * Denuncia um conteúdo (post, comentário, usuário ou mensagem)
 * Chama a RPC report_content() do Supabase
 */
export async function reportContent(
  contentType: ReportContentType,
  contentId: string,
  reason: ReportReason,
  description?: string
): Promise<{ reportId: string | null; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Chamar RPC do Supabase
    const { data, error } = await callRpc<ReportContentRpcResult>("report_content", {
      p_content_type: contentType,
      p_content_id: contentId,
      p_reason: reason,
      p_description: description || null,
    });

    if (error) {
      throw new Error(error.message);
    }

    const reportId = data?.report_id ?? null;
    logger.info(`Conteúdo denunciado: ${contentType}/${contentId}`, "CommunityAPI");
    return { reportId, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao denunciar conteúdo", "CommunityAPI", errorObj);
    return { reportId: null, error: errorObj };
  }
}

/**
 * Bloqueia um usuário
 * Usuário bloqueado não aparece mais no feed
 */
export async function blockUser(
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Não pode bloquear a si mesmo
    if (userId === session.user.id) {
      throw new Error("Você não pode bloquear a si mesmo");
    }

    // Chamar RPC do Supabase
    const { data, error } = await callRpc<BlockUserRpcResult>("block_user", {
      p_user_id: userId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const success = data?.success ?? false;
    logger.info(`Usuário bloqueado: ${userId}`, "CommunityAPI");
    return { success, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao bloquear usuário", "CommunityAPI", errorObj);
    return { success: false, error: errorObj };
  }
}

/**
 * Desbloqueia um usuário
 */
export async function unblockUser(
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Chamar RPC do Supabase
    const { data, error } = await callRpc<BlockUserRpcResult>("unblock_user", {
      p_user_id: userId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const success = data?.success ?? false;
    logger.info(`Usuário desbloqueado: ${userId}`, "CommunityAPI");
    return { success, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao desbloquear usuário", "CommunityAPI", errorObj);
    return { success: false, error: errorObj };
  }
}

/**
 * Verifica se um usuário está bloqueado
 */
export async function isUserBlocked(
  userId: string
): Promise<{ blocked: boolean; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      return { blocked: false, error: null };
    }

    // Chamar RPC do Supabase
    const { data, error } = await callRpc<IsBlockedRpcResult>("is_blocked", {
      p_user_id: userId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const blocked = data?.is_blocked ?? false;
    return { blocked, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao verificar bloqueio", "CommunityAPI", errorObj);
    return { blocked: false, error: errorObj };
  }
}

/**
 * Retorna lista de usuários bloqueados
 */
export async function getBlockedUsers(): Promise<{
  users: UserBlock[];
  error: Error | null;
}> {
  try {
    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Chamar RPC do Supabase
    const { data, error } = await callRpc<BlockedUserRpcRow[]>("get_blocked_users");

    if (error) {
      throw new Error(error.message);
    }

    // Mapear resultado para o tipo UserBlock
    const users: UserBlock[] = (data ?? []).map((row) => ({
      id: row.id,
      blocker_id: session.user.id,
      blocked_id: row.blocked_id,
      created_at: row.created_at,
      blocked_user: {
        id: row.blocked_id,
        name: row.blocked_name || "Usuário",
        avatar_url: row.blocked_avatar || null,
      },
    }));

    return { users, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao buscar usuários bloqueados", "CommunityAPI", errorObj);
    return { users: [], error: errorObj };
  }
}
