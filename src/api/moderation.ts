/**
 * Moderation API Service
 *
 * Sistema completo de moderação de conteúdo:
 * - Análise automática de posts
 * - Ranking de qualidade para seleção
 * - Fila de moderação para aprovação
 * - Métricas de moderação
 *
 * NOTA: Usa untypedFrom() para moderation_queue (não existe no Database type gerado)
 */

import { supabase, untypedFrom } from "./supabase";
import {
  analyzeProfanity,
  needsHumanReview,
  shouldAutoBlock,
  type ProfanityResult,
} from "../utils/profanity-filter";
import { logger } from "../utils/logger";

const CONTEXT = "ModerationAPI";

export type ModerationStatus = "pending" | "approved" | "rejected" | "auto_blocked";

export interface ModerationQueueItem {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  content: string;
  mediaUrl: string | null;
  mediaType: "text" | "image" | "video";
  status: ModerationStatus;
  profanityScore: number;
  flaggedTerms: string[];
  categories: string[];
  qualityScore: number;
  createdAt: string;
  moderatedAt: string | null;
  moderatedBy: string | null;
  moderatorNotes: string | null;
}

export interface ModerationStats {
  pending: number;
  approved: number;
  rejected: number;
  autoBlocked: number;
  total: number;
  avgProcessingTime: number;
}

export interface QualityMetrics {
  textLength: number;
  hasMedia: boolean;
  hasQuestions: boolean;
  isPositive: boolean;
  userReputation: number;
}

/**
 * Calcula score de qualidade do post (0-100)
 * Usado para ranquear os melhores posts para aprovação
 */
export function calculateQualityScore(
  content: string,
  hasMedia: boolean,
  userReputation: number = 50
): number {
  let score = 0;

  // Tamanho do texto (posts muito curtos ou muito longos perdem pontos)
  const length = content.trim().length;
  if (length >= 50 && length <= 500) {
    score += 20;
  } else if (length >= 20 && length < 50) {
    score += 10;
  } else if (length > 500 && length <= 1000) {
    score += 15;
  }

  // Tem mídia (engaja mais)
  if (hasMedia) {
    score += 15;
  }

  // Faz perguntas (engaja comunidade)
  if (/\?/.test(content)) {
    score += 10;
  }

  // Palavras positivas
  const positiveWords = [
    "obrigada",
    "ajuda",
    "dica",
    "experiência",
    "compartilhar",
    "conselho",
    "apoio",
    "amor",
    "carinho",
    "feliz",
    "gratidão",
  ];
  const hasPositive = positiveWords.some((word) => content.toLowerCase().includes(word));
  if (hasPositive) {
    score += 15;
  }

  // Reputação do usuário (0-100)
  score += Math.round(userReputation * 0.4);

  // Limitar a 100
  return Math.min(score, 100);
}

/**
 * Analisa post e determina próximo passo
 */
export interface ModerationDecision {
  action: "auto_approve" | "queue_for_review" | "auto_block";
  profanityResult: ProfanityResult;
  qualityScore: number;
  reason: string;
}

export function analyzePost(
  content: string,
  hasMedia: boolean,
  userReputation: number = 50
): ModerationDecision {
  const profanityResult = analyzeProfanity(content);
  const qualityScore = calculateQualityScore(content, hasMedia, userReputation);

  // Auto-block: palavrões graves ou score muito alto
  if (shouldAutoBlock(profanityResult)) {
    return {
      action: "auto_block",
      profanityResult,
      qualityScore,
      reason: "Conteúdo bloqueado automaticamente por violação das regras da comunidade.",
    };
  }

  // Queue for review: conteúdo sensível ou score médio
  if (needsHumanReview(profanityResult)) {
    return {
      action: "queue_for_review",
      profanityResult,
      qualityScore,
      reason: "Post enviado para revisão da equipe.",
    };
  }

  // Auto-approve: conteúdo limpo
  return {
    action: "auto_approve",
    profanityResult,
    qualityScore,
    reason: "Post aprovado automaticamente.",
  };
}

// Raw row type from moderation_queue table
interface ModerationQueueRow {
  id: string;
  user_id: string | null;
  post_id: string | null;
  message: string;
  category: string | null;
  severity: number | null;
  quality_score: number | null;
  flagged_terms: string[] | null;
  categories: string[] | null;
  reviewed: boolean;
  action: string | null;
  moderator_notes: string | null;
  created_at: string;
}

/**
 * Busca itens pendentes na fila de moderação
 *
 * NOTE: Uses untypedFrom() because moderation_queue table
 * is not in the generated Database types
 */
export async function fetchModerationQueue(
  limit: number = 50,
  status: ModerationStatus = "pending"
): Promise<{ data: ModerationQueueItem[]; error: Error | null }> {
  if (!supabase) {
    return { data: [], error: new Error("Supabase não configurado") };
  }

  try {
    const client = supabase!;

    let query = untypedFrom(client, "moderation_queue")
      .select(
        `
        id,
        user_id,
        post_id,
        message,
        category,
        severity,
        quality_score,
        flagged_terms,
        categories,
        reviewed,
        action,
        moderator_notes,
        created_at
      `
      )
      .order("quality_score", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: true })
      .limit(limit);

    // Add filter based on status
    if (status === "pending") {
      query = query.eq("reviewed", false);
    } else {
      query = query.eq("reviewed", true);
    }

    const { data, error } = await query;

    if (error) {
      logger.error("Erro ao buscar fila de moderação", CONTEXT, error);
      return { data: [], error };
    }

    // Map to expected format
    const rows = (data || []) as ModerationQueueRow[];
    const items: ModerationQueueItem[] = rows.map((item) => ({
      id: item.id,
      postId: item.post_id || item.id,
      userId: item.user_id || "",
      userName: "Usuária", // TODO: Join with profiles table for real name
      userAvatar: null,
      content: item.message,
      mediaUrl: null,
      mediaType: "text" as const,
      status: item.reviewed ? "approved" : "pending",
      profanityScore: item.severity || 0,
      flaggedTerms: item.flagged_terms || [],
      categories: item.categories || (item.category ? [item.category] : []),
      qualityScore: item.quality_score || 50,
      createdAt: item.created_at,
      moderatedAt: null,
      moderatedBy: null,
      moderatorNotes: item.moderator_notes,
    }));

    return { data: items, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logger.error("Erro ao buscar fila", CONTEXT, error);
    return { data: [], error };
  }
}

/**
 * Busca os N melhores posts para revisão (ranqueados por qualidade)
 */
export async function fetchTopPostsForReview(
  limit: number = 200
): Promise<{ data: ModerationQueueItem[]; error: Error | null }> {
  const result = await fetchModerationQueue(limit, "pending");

  if (result.error) return result;

  // Already sorted by quality_score from database, just limit
  return {
    data: result.data.slice(0, limit),
    error: null,
  };
}

/**
 * Aprova um post - atualiza fila E status do post original
 */
export async function approvePost(
  queueItemId: string,
  moderatorId: string,
  notes?: string
): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error("Supabase não configurado") };
  }

  try {
    const client = supabase!;

    // 1. Buscar o post_id da fila
    const { data: queueItem } = await untypedFrom(client, "moderation_queue")
      .select("post_id")
      .eq("id", queueItemId)
      .single();

    // 2. Atualizar a fila de moderação
    const { error: queueError } = await untypedFrom(client, "moderation_queue")
      .update({
        reviewed: true,
        action: "approved",
        moderator_notes: notes || "Aprovado pela equipe",
      })
      .eq("id", queueItemId);

    if (queueError) {
      logger.error("Erro ao aprovar na fila", CONTEXT, queueError);
      return { success: false, error: queueError };
    }

    // 3. Atualizar o status do post original para "approved"
    if (queueItem?.post_id) {
      const { error: postError } = await supabase!
        .from("community_posts")
        .update({ status: "approved" })
        .eq("id", queueItem.post_id);

      if (postError) {
        logger.warn("Erro ao atualizar post original", CONTEXT, { error: postError.message });
        // Não falhar a operação, a fila já foi atualizada
      }
    }

    logger.info("Post aprovado", CONTEXT, { queueItemId, moderatorId });
    return { success: true, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { success: false, error };
  }
}

/**
 * Rejeita um post - atualiza fila E status do post original
 */
export async function rejectPost(
  queueItemId: string,
  moderatorId: string,
  reason: string
): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error("Supabase não configurado") };
  }

  try {
    const client = supabase!;

    // 1. Buscar o post_id da fila
    const { data: queueItem } = await untypedFrom(client, "moderation_queue")
      .select("post_id")
      .eq("id", queueItemId)
      .single();

    // 2. Atualizar a fila de moderação
    const { error: queueError } = await untypedFrom(client, "moderation_queue")
      .update({
        reviewed: true,
        action: "rejected",
        moderator_notes: reason,
      })
      .eq("id", queueItemId);

    if (queueError) {
      logger.error("Erro ao rejeitar na fila", CONTEXT, queueError);
      return { success: false, error: queueError };
    }

    // 3. Atualizar o status do post original para "rejected"
    if (queueItem?.post_id) {
      const { error: postError } = await supabase!
        .from("community_posts")
        .update({ status: "rejected" })
        .eq("id", queueItem.post_id);

      if (postError) {
        logger.warn("Erro ao atualizar post original", CONTEXT, { error: postError.message });
        // Não falhar a operação, a fila já foi atualizada
      }
    }

    logger.info("Post rejeitado", CONTEXT, { queueItemId, moderatorId, reason });
    return { success: true, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { success: false, error };
  }
}

/**
 * Parâmetros para adicionar à fila de moderação
 */
export interface AddToModerationQueueParams {
  userId: string;
  postId?: string;
  content: string;
  category: string;
  severity: number;
  qualityScore?: number;
  flaggedTerms?: string[];
  categories?: string[];
}

/**
 * Adiciona post à fila de moderação com dados completos
 */
export async function addToModerationQueue(
  userIdOrParams: string | AddToModerationQueueParams,
  content?: string,
  category?: string,
  severity?: number
): Promise<{ success: boolean; id: string | null; error: Error | null }> {
  if (!supabase) {
    return { success: false, id: null, error: new Error("Supabase não configurado") };
  }

  // Suporta chamada antiga (4 params) e nova (objeto)
  const params: AddToModerationQueueParams =
    typeof userIdOrParams === "string"
      ? {
          userId: userIdOrParams,
          content: content || "",
          category: category || "review",
          severity: severity || 0,
        }
      : userIdOrParams;

  try {
    const client = supabase!;

    const { data, error } = await untypedFrom(client, "moderation_queue")
      .insert({
        user_id: params.userId,
        post_id: params.postId || null,
        message: params.content,
        category: params.category,
        severity: params.severity,
        quality_score: params.qualityScore || null,
        flagged_terms: params.flaggedTerms || null,
        categories: params.categories || null,
        reviewed: false,
      })
      .select("id")
      .single();

    if (error) {
      logger.error("Erro ao adicionar à fila", CONTEXT, error);
      return { success: false, id: null, error };
    }

    return { success: true, id: data?.id || null, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { success: false, id: null, error };
  }
}

/**
 * Busca estatísticas de moderação
 */
export async function fetchModerationStats(): Promise<{
  data: ModerationStats | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error("Supabase não configurado") };
  }

  try {
    const client = supabase!;

    // Buscar contagens
    const { count: pendingCount } = await untypedFrom(client, "moderation_queue")
      .select("id", { count: "exact", head: true })
      .eq("reviewed", false);

    const { data: reviewedData } = await untypedFrom(client, "moderation_queue")
      .select("id, action")
      .eq("reviewed", true);

    const pending = pendingCount || 0;
    const reviewed = (reviewedData || []) as { id: string; action: string }[];

    const approved = reviewed.filter((r) => r.action === "approved").length;
    const rejected = reviewed.filter((r) => r.action === "rejected").length;
    const autoBlocked = reviewed.filter((r) => r.action === "auto_blocked").length;

    return {
      data: {
        pending,
        approved,
        rejected,
        autoBlocked,
        total: pending + reviewed.length,
        avgProcessingTime: 0,
      },
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { data: null, error };
  }
}
