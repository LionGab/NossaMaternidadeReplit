import { useState, useCallback, useEffect, useMemo } from "react";
import { mundoNathAdminService } from "../services/mundoNathAdmin";
import { MundoNathPostAdmin, MundoNathPostStatus, AdminPostsStats } from "../types/community";
import { logger } from "../utils/logger";

const CONTEXT = "useAdminPosts";

interface UseAdminPostsOptions {
  /** Carregar automaticamente ao montar */
  autoLoad?: boolean;
  /** Limite de posts por página */
  limit?: number;
  /** Filtrar por status */
  status?: MundoNathPostStatus | "all";
}

interface UseAdminPostsReturn {
  /** Lista de posts */
  posts: MundoNathPostAdmin[];
  /** Estatísticas dos posts */
  stats: AdminPostsStats;
  /** Carregando dados */
  isLoading: boolean;
  /** Erro ao carregar */
  error: string | null;
  /** Recarregar posts */
  refresh: () => Promise<void>;
  /** Buscar post por ID */
  getById: (id: string) => Promise<MundoNathPostAdmin | null>;
}

const INITIAL_STATS: AdminPostsStats = {
  published: 0,
  draft: 0,
  scheduled: 0,
  total: 0,
};

/**
 * Hook para gerenciar posts admin do Mundo da Nath
 *
 * @example
 * ```tsx
 * const { posts, stats, isLoading, refresh } = useAdminPosts();
 *
 * // Com filtro de status
 * const { posts } = useAdminPosts({ status: 'draft' });
 * ```
 */
export function useAdminPosts(options: UseAdminPostsOptions = {}): UseAdminPostsReturn {
  const { autoLoad = true, limit = 20, status = "all" } = options;

  const [posts, setPosts] = useState<MundoNathPostAdmin[]>([]);
  const [stats, setStats] = useState<AdminPostsStats>(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega posts e estatísticas
   */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Carregar posts e stats em paralelo
      const [postsResult, statsResult] = await Promise.all([
        mundoNathAdminService.listPosts({ limit, status }),
        mundoNathAdminService.getStats(),
      ]);

      if (postsResult.error) {
        setError(postsResult.error);
        logger.error("Erro ao carregar posts", CONTEXT, new Error(postsResult.error));
      } else {
        setPosts(postsResult.data || []);
      }

      if (statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      logger.error("Erro inesperado", CONTEXT, err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [limit, status]);

  /**
   * Busca post por ID
   */
  const getById = useCallback(
    async (id: string): Promise<MundoNathPostAdmin | null> => {
      // Primeiro tenta encontrar no cache local
      const cached = posts.find((p) => p.id === id);
      if (cached) {
        return cached;
      }

      // Se não encontrar, busca no servidor
      const result = await mundoNathAdminService.getPost(id);
      if (result.error) {
        logger.error("Erro ao buscar post por ID", CONTEXT, new Error(result.error));
        return null;
      }

      return result.data;
    },
    [posts]
  );

  // Carregar automaticamente se autoLoad = true
  useEffect(() => {
    if (autoLoad) {
      refresh();
    }
  }, [autoLoad, refresh]);

  // Memoizar retorno para evitar re-renders desnecessários
  const memoizedReturn = useMemo(
    () => ({
      posts,
      stats,
      isLoading,
      error,
      refresh,
      getById,
    }),
    [posts, stats, isLoading, error, refresh, getById]
  );

  return memoizedReturn;
}
