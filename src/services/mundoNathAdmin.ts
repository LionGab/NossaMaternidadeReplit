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

      // Filtrar por status se especificado
      if (status !== "all") {
        // Para compatibilidade, 'published' também checa is_published
        if (status === "published") {
          query = query.eq("is_published", true);
        } else {
          // TODO: Quando migração de status for aplicada, usar:
          // query = query.eq("status", status);
          // Por enquanto, filtrar apenas published vs não-published
          query = query.eq("is_published", false);
        }
      }

      const { data, error } = await query;

      if (error) {
        logger.error("Erro ao listar posts admin", CONTEXT, error);
        return { data: null, error: error.message };
      }

      // Mapear para tipo admin (adicionar campos virtuais)
      const posts: MundoNathPostAdmin[] = (data || []).map((post) => ({
        ...post,
        is_published: post.is_published ?? false,
        published_at: post.published_at ?? new Date().toISOString(),
        created_at: post.created_at ?? undefined,
        status: post.is_published ? "published" : "draft",
      }));

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

      const post: MundoNathPostAdmin = {
        ...data,
        is_published: data.is_published ?? false,
        published_at: data.published_at ?? new Date().toISOString(),
        created_at: data.created_at ?? undefined,
        status: data.is_published ? "published" : "draft",
      };

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

      const { data, error } = await supabase.from("mundo_nath_posts").select("is_published");

      if (error) {
        logger.error("Erro ao buscar stats", CONTEXT, error);
        return { data: null, error: error.message };
      }

      const posts = data || [];
      const stats: AdminPostsStats = {
        published: posts.filter((p) => p.is_published).length,
        draft: posts.filter((p) => !p.is_published).length,
        scheduled: 0, // TODO: Implementar quando migração de scheduled_at existir
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

      const { data, error } = await supabase
        .from("mundo_nath_posts")
        .insert({
          type: post.type || "text",
          text: post.text || "",
          media_path: post.media_path || null,
          is_published: post.is_published ?? false,
          published_at: post.is_published ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) {
        logger.error("Erro ao criar post", CONTEXT, error);
        return { data: null, error: error.message };
      }

      const createdPost: MundoNathPostAdmin = {
        ...data,
        is_published: data.is_published ?? false,
        published_at: data.published_at ?? new Date().toISOString(),
        created_at: data.created_at ?? undefined,
        status: data.is_published ? "published" : "draft",
      };

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
      if (updates.is_published !== undefined) {
        updateData.is_published = updates.is_published;
        // Se publicando agora, atualizar published_at
        if (updates.is_published) {
          updateData.published_at = new Date().toISOString();
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

      const updatedPost: MundoNathPostAdmin = {
        ...data,
        is_published: data.is_published ?? false,
        published_at: data.published_at ?? new Date().toISOString(),
        created_at: data.created_at ?? undefined,
        status: data.is_published ? "published" : "draft",
      };

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

      const { data, error } = await supabase
        .from("mundo_nath_posts")
        .update({
          is_published: publish,
          published_at: publish ? new Date().toISOString() : null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        logger.error("Erro ao alterar status de publicação", CONTEXT, error);
        return { data: null, error: error.message };
      }

      const post: MundoNathPostAdmin = {
        ...data,
        is_published: data.is_published ?? false,
        published_at: data.published_at ?? new Date().toISOString(),
        created_at: data.created_at ?? undefined,
        status: data.is_published ? "published" : "draft",
      };

      logger.info(`Post ${publish ? "publicado" : "despublicado"}`, CONTEXT, { id });
      return { data: post, error: null };
    } catch (err) {
      const error = err as Error;
      logger.error("Erro inesperado ao alterar publicação", CONTEXT, error);
      return { data: null, error: error.message };
    }
  },
};
