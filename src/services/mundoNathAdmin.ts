import { supabase } from "../api/supabase";
import { AdminPostsStats, MundoNathPostAdmin, MundoNathPostStatus } from "../types/community";
import { logger } from "../utils/logger";

const CONTEXT = "MundoNathAdminService";

interface ListPostsOptions {
  limit?: number;
  offset?: number;
  status?: MundoNathPostStatus | "all";
}

interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

function extractScheduledAt(post: Record<string, unknown>): string | null {
  if (typeof post.scheduled_at === "string") {
    return post.scheduled_at;
  }

  // TODO(2026-04-01): Remover fallback publish_time após migração completa do banco.
  // A coluna scheduled_at deve ser a única fonte de verdade após essa data.
  // Backward compatibility while databases are still migrating from legacy naming.
  if (typeof post.publish_time === "string") {
    return post.publish_time;
  }

  return null;
}

function mapPostStatus(post: Record<string, unknown>): MundoNathPostStatus {
  const isPublished = Boolean(post.is_published);
  if (isPublished) {
    return "published";
  }

  const scheduledAt = extractScheduledAt(post);
  if (scheduledAt) {
    const scheduledDate = new Date(scheduledAt);
    if (!Number.isNaN(scheduledDate.getTime()) && scheduledDate.getTime() > Date.now()) {
      return "scheduled";
    }
  }

  return "draft";
}

function mapAdminPost(post: Record<string, unknown>): MundoNathPostAdmin {
  const status = mapPostStatus(post);
  return {
    ...(post as unknown as MundoNathPostAdmin),
    is_published: Boolean(post.is_published),
    published_at:
      typeof post.published_at === "string" ? post.published_at : new Date().toISOString(),
    created_at: typeof post.created_at === "string" ? post.created_at : undefined,
    scheduled_at: extractScheduledAt(post),
    status,
  };
}

export const mundoNathAdminService = {
  /**
   * Lista posts para admin (todos os status)
   */
  listPosts: async (
    options: ListPostsOptions = {}
  ): Promise<ServiceResponse<MundoNathPostAdmin[]>> => {
    const { limit = 20, offset = 0, status = "all" } = options;

    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", CONTEXT);
        return { data: [], error: null };
      }

      let query = supabase
        .from("mundo_nath_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      // Filtrar no banco quando possível para reduzir payload.
      if (status === "published") {
        query = query.eq("is_published", true);
      } else if (status === "draft" || status === "scheduled") {
        query = query.eq("is_published", false);
      }

      const { data, error } = await query;

      if (error) {
        logger.error("Erro ao listar posts admin", CONTEXT, error);
        return { data: null, error: error.message };
      }

      const mappedPosts = (data || []).map((post) => mapAdminPost(post as Record<string, unknown>));
      const posts =
        status === "all" ? mappedPosts : mappedPosts.filter((post) => post.status === status);

      return { data: posts, error: null };
    } catch (err) {
      const error = err as Error;
      logger.error("Erro inesperado ao listar posts", CONTEXT, error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Busca post específico por ID
   */
  getPost: async (id: string): Promise<ServiceResponse<MundoNathPostAdmin>> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", CONTEXT);
        return { data: null, error: "Supabase not initialized" };
      }

      const { data, error } = await supabase
        .from("mundo_nath_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        logger.error("Erro ao buscar post", CONTEXT, error);
        return { data: null, error: error.message };
      }

      const post = mapAdminPost(data as Record<string, unknown>);

      return { data: post, error: null };
    } catch (err) {
      const error = err as Error;
      logger.error("Erro inesperado ao buscar post", CONTEXT, error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Calcula estatísticas dos posts
   */
  getStats: async (): Promise<ServiceResponse<AdminPostsStats>> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", CONTEXT);
        return {
          data: { published: 0, draft: 0, scheduled: 0, total: 0 },
          error: null,
        };
      }

      const { data, error } = await supabase.from("mundo_nath_posts").select("*");

      if (error) {
        logger.error("Erro ao buscar stats", CONTEXT, error);
        return { data: null, error: error.message };
      }

      const posts = (data || []) as Record<string, unknown>[];
      const now = Date.now();
      const published = posts.filter((post) => Boolean(post.is_published)).length;
      const scheduled = posts.filter((post) => {
        if (Boolean(post.is_published)) {
          return false;
        }
        const scheduledAt = extractScheduledAt(post);
        if (!scheduledAt) {
          return false;
        }
        const scheduledDate = new Date(scheduledAt);
        return !Number.isNaN(scheduledDate.getTime()) && scheduledDate.getTime() > now;
      }).length;

      const stats: AdminPostsStats = {
        published,
        draft: posts.length - published - scheduled,
        scheduled,
        total: posts.length,
      };

      return { data: stats, error: null };
    } catch (err) {
      const error = err as Error;
      logger.error("Erro inesperado ao buscar stats", CONTEXT, error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Cria novo post
   */
  createPost: async (
    post: Partial<MundoNathPostAdmin>
  ): Promise<ServiceResponse<MundoNathPostAdmin>> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", CONTEXT);
        return { data: null, error: "Supabase not initialized" };
      }

      const insertData: Record<string, unknown> = {
        type: post.type || "text",
        text: post.text || "",
        media_path: post.media_path || null,
        is_published: post.is_published ?? false,
        scheduled_at: post.scheduled_at || null,
        published_at: post.is_published ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from("mundo_nath_posts")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        logger.error("Erro ao criar post", CONTEXT, error);
        return { data: null, error: error.message };
      }

      const createdPost = mapAdminPost(data as Record<string, unknown>);

      logger.info("Post criado com sucesso", CONTEXT, { id: createdPost.id });
      return { data: createdPost, error: null };
    } catch (err) {
      const error = err as Error;
      logger.error("Erro inesperado ao criar post", CONTEXT, error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Atualiza post existente
   */
  updatePost: async (
    id: string,
    updates: Partial<MundoNathPostAdmin>
  ): Promise<ServiceResponse<MundoNathPostAdmin>> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", CONTEXT);
        return { data: null, error: "Supabase not initialized" };
      }

      // Prepara campos para atualização
      const updateData: Record<string, unknown> = {};
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.text !== undefined) updateData.text = updates.text;
      if (updates.media_path !== undefined) updateData.media_path = updates.media_path;
      if (updates.scheduled_at !== undefined) updateData.scheduled_at = updates.scheduled_at;
      if (updates.is_published !== undefined) {
        updateData.is_published = updates.is_published;
        // Se publicando agora, atualizar published_at
        if (updates.is_published) {
          updateData.published_at = new Date().toISOString();
          updateData.scheduled_at = null;
        }
      }

      const { data, error } = await supabase
        .from("mundo_nath_posts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        logger.error("Erro ao atualizar post", CONTEXT, error);
        return { data: null, error: error.message };
      }

      const updatedPost = mapAdminPost(data as Record<string, unknown>);

      logger.info("Post atualizado com sucesso", CONTEXT, { id });
      return { data: updatedPost, error: null };
    } catch (err) {
      const error = err as Error;
      logger.error("Erro inesperado ao atualizar post", CONTEXT, error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Deleta post (hard delete)
   */
  deletePost: async (id: string): Promise<ServiceResponse<boolean>> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", CONTEXT);
        return { data: null, error: "Supabase not initialized" };
      }

      const { error } = await supabase.from("mundo_nath_posts").delete().eq("id", id);

      if (error) {
        logger.error("Erro ao deletar post", CONTEXT, error);
        return { data: null, error: error.message };
      }

      logger.info("Post deletado com sucesso", CONTEXT, { id });
      return { data: true, error: null };
    } catch (err) {
      const error = err as Error;
      logger.error("Erro inesperado ao deletar post", CONTEXT, error);
      return { data: null, error: error.message };
    }
  },

  /**
   * Toggle publish status de um post
   */
  togglePublish: async (
    id: string,
    publish: boolean
  ): Promise<ServiceResponse<MundoNathPostAdmin>> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", CONTEXT);
        return { data: null, error: "Supabase not initialized" };
      }

      const updatePublishData: Record<string, unknown> = {
        is_published: publish,
        scheduled_at: publish ? null : undefined,
        published_at: publish ? new Date().toISOString() : null,
      };

      const { data, error } = await supabase
        .from("mundo_nath_posts")
        .update(updatePublishData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        logger.error("Erro ao alterar status de publicação", CONTEXT, error);
        return { data: null, error: error.message };
      }

      const post = mapAdminPost(data as Record<string, unknown>);

      logger.info(`Post ${publish ? "publicado" : "despublicado"}`, CONTEXT, { id });
      return { data: post, error: null };
    } catch (err) {
      const error = err as Error;
      logger.error("Erro inesperado ao alterar publicação", CONTEXT, error);
      return { data: null, error: error.message };
    }
  },
};
