/**
 * Moderation Service
 *
 * Serviço para gerenciar denúncias e bloqueios de usuários.
 * Usa RPCs do Supabase para operações seguras.
 *
 * @example
 * ```ts
 * // Denunciar um post
 * await moderationService.reportContent('post', postId, 'spam');
 *
 * // Bloquear um usuário
 * await moderationService.blockUser(userId);
 * ```
 */

import { supabase } from "../api/supabase";
import { logger } from "../utils/logger";

// Type assertion for RPC calls (RPCs are defined but not yet in generated types)
interface SupabaseRpc {
  rpc: <TData = unknown>(
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: TData; error: Error | null }>;
}

// ============================================
// TYPES
// ============================================

export type ContentType = "post" | "comment" | "profile" | "message";

export type ReportReason =
  | "spam"
  | "harassment"
  | "hate_speech"
  | "inappropriate_content"
  | "misinformation"
  | "impersonation"
  | "other";

export interface ReportReasonOption {
  value: ReportReason;
  label: string;
  description: string;
  icon: string;
}

export interface BlockedUser {
  user_id: string;
  name: string;
  blocked_at: string;
}

export interface ReportResult {
  success: boolean;
  reportId?: string;
  error?: string;
}

export interface BlockResult {
  success: boolean;
  error?: string;
}

// ============================================
// CONSTANTS
// ============================================

export const REPORT_REASONS: ReportReasonOption[] = [
  {
    value: "spam",
    label: "Spam",
    description: "Publicidade não solicitada ou conteúdo repetitivo",
    icon: "mail-unread-outline",
  },
  {
    value: "harassment",
    label: "Assédio",
    description: "Intimidação, bullying ou comportamento abusivo",
    icon: "warning-outline",
  },
  {
    value: "hate_speech",
    label: "Discurso de ódio",
    description: "Conteúdo discriminatório ou preconceituoso",
    icon: "ban-outline",
  },
  {
    value: "inappropriate_content",
    label: "Conteúdo inapropriado",
    description: "Conteúdo sexual, violento ou perturbador",
    icon: "eye-off-outline",
  },
  {
    value: "misinformation",
    label: "Desinformação",
    description: "Informações falsas sobre saúde ou outros temas",
    icon: "alert-circle-outline",
  },
  {
    value: "impersonation",
    label: "Perfil falso",
    description: "Fingindo ser outra pessoa",
    icon: "person-outline",
  },
  {
    value: "other",
    label: "Outro",
    description: "Outro motivo não listado acima",
    icon: "help-circle-outline",
  },
];

// ============================================
// SERVICE
// ============================================

class ModerationService {
  private readonly context = "ModerationService";

  // Get supabase with type assertion for RPC calls
  private get db(): SupabaseRpc {
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }
    return supabase as unknown as SupabaseRpc;
  }

  /**
   * Denuncia um conteúdo (post, comentário, perfil ou mensagem)
   */
  async reportContent(
    contentType: ContentType,
    contentId: string,
    reason: ReportReason,
    description?: string
  ): Promise<ReportResult> {
    try {
      logger.info("Reporting content", this.context, {
        contentType,
        contentId,
        reason,
      });

      const { data, error } = await this.db.rpc("report_content", {
        p_content_type: contentType,
        p_content_id: contentId,
        p_reason: reason,
        p_description: description || null,
      });

      if (error) {
        logger.error("Failed to report content", this.context, error);

        // Tratar erros específicos
        if (error.message.includes("already reported")) {
          return {
            success: false,
            error: "Você já denunciou este conteúdo",
          };
        }

        if (error.message.includes("own content")) {
          return {
            success: false,
            error: "Não é possível denunciar seu próprio conteúdo",
          };
        }

        return {
          success: false,
          error: "Erro ao enviar denúncia. Tente novamente.",
        };
      }

      logger.info("Content reported successfully", this.context, {
        reportId: data,
      });

      return {
        success: true,
        reportId: data as string,
      };
    } catch (error) {
      logger.error("Unexpected error reporting content", this.context, error as Error);
      return {
        success: false,
        error: "Erro inesperado. Tente novamente.",
      };
    }
  }

  /**
   * Bloqueia um usuário
   */
  async blockUser(userId: string): Promise<BlockResult> {
    try {
      logger.info("Blocking user", this.context, { userId });

      const { error } = await this.db.rpc("block_user", {
        p_user_id: userId,
      });

      if (error) {
        logger.error("Failed to block user", this.context, error);

        if (error.message.includes("yourself")) {
          return {
            success: false,
            error: "Não é possível bloquear a si mesmo",
          };
        }

        if (error.message.includes("not found")) {
          return {
            success: false,
            error: "Usuário não encontrado",
          };
        }

        return {
          success: false,
          error: "Erro ao bloquear usuário. Tente novamente.",
        };
      }

      logger.info("User blocked successfully", this.context, { userId });

      return { success: true };
    } catch (error) {
      logger.error("Unexpected error blocking user", this.context, error as Error);
      return {
        success: false,
        error: "Erro inesperado. Tente novamente.",
      };
    }
  }

  /**
   * Desbloqueia um usuário
   */
  async unblockUser(userId: string): Promise<BlockResult> {
    try {
      logger.info("Unblocking user", this.context, { userId });

      const { error } = await this.db.rpc("unblock_user", {
        p_user_id: userId,
      });

      if (error) {
        logger.error("Failed to unblock user", this.context, error);
        return {
          success: false,
          error: "Erro ao desbloquear usuário. Tente novamente.",
        };
      }

      logger.info("User unblocked successfully", this.context, { userId });

      return { success: true };
    } catch (error) {
      logger.error("Unexpected error unblocking user", this.context, error as Error);
      return {
        success: false,
        error: "Erro inesperado. Tente novamente.",
      };
    }
  }

  /**
   * Verifica se um usuário está bloqueado
   *
   * FAIL-SAFE: Em caso de erro, retorna true (bloqueado) por segurança.
   * Isso previne que falhas de rede/banco permitam interações com
   * usuários que deveriam estar bloqueados.
   */
  async isBlocked(userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.db.rpc("is_blocked", {
        p_user_id: userId,
      });

      if (error) {
        // FAIL-SAFE: assume bloqueado em caso de erro de RPC
        logger.error(
          "Failed to check block status - assuming blocked for safety",
          this.context,
          error
        );
        return true;
      }

      return Boolean(data);
    } catch (error) {
      // FAIL-SAFE: assume bloqueado em caso de erro inesperado
      logger.error(
        "Unexpected error checking block status - assuming blocked for safety",
        this.context,
        error as Error
      );
      return true;
    }
  }

  /**
   * Lista todos os usuários bloqueados
   */
  async getBlockedUsers(): Promise<BlockedUser[]> {
    try {
      const { data, error } = await this.db.rpc("get_blocked_users");

      if (error) {
        logger.error("Failed to get blocked users", this.context, error);
        return [];
      }

      return (data || []) as BlockedUser[];
    } catch (error) {
      logger.error("Unexpected error getting blocked users", this.context, error as Error);
      return [];
    }
  }
}

// Singleton
export const moderationService = new ModerationService();
