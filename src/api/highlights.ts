/**
 * Highlights API - Destaques da Semana
 * 
 * Ranking algorithm:
 * Score = (likes_count * 2) + (comments_count * 3) + recency_boost
 * recency_boost = max(0, 7 - days_since) * 1.5
 */

import { supabase } from "./supabase";
import { logger } from "../utils/logger";
import type { Post } from "../types/navigation";

const CONTEXT = "HighlightsAPI";

interface SupabaseHighlightPost {
  id: string;
  author_id: string;
  content: string;
  image_url?: string | null;
  likes_count: number | null;
  comments_count: number | null;
  created_at: string | null;
  profiles?: {
    name: string;
    avatar_url?: string | null;
  } | null;
}

function calculateScore(post: SupabaseHighlightPost): number {
  const likes = post.likes_count ?? 0;
  const comments = post.comments_count ?? 0;
  const createdAt = post.created_at ? new Date(post.created_at) : new Date();
  const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const recencyBoost = Math.max(0, 7 - daysSince) * 1.5;
  
  return (likes * 2) + (comments * 3) + recencyBoost;
}

function mapToPost(data: SupabaseHighlightPost, isLiked: boolean = false): Post {
  return {
    id: data.id,
    authorId: data.author_id,
    authorName: data.profiles?.name || "Usuária",
    authorAvatar: data.profiles?.avatar_url || undefined,
    content: data.content,
    imageUrl: data.image_url || undefined,
    likesCount: data.likes_count ?? 0,
    commentsCount: data.comments_count ?? 0,
    createdAt: data.created_at || new Date().toISOString(),
    isLiked,
    status: "approved",
  };
}

/**
 * Fetch weekly highlights - posts with highest engagement from last 7 days
 */
export async function fetchWeeklyHighlights(
  limit: number = 5
): Promise<{ data: Post[]; error: Error | null }> {
  try {
    if (!supabase) {
      logger.warn("Supabase not initialized", CONTEXT);
      return { data: [], error: null };
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as unknown as { from: (table: string) => any })
      .from("community_posts")
      .select(`
        id,
        author_id,
        content,
        image_url,
        likes_count,
        comments_count,
        created_at,
        profiles:author_id (
          name,
          avatar_url
        )
      `)
      .eq("is_hidden", false)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return { data: [], error: null };
    }

    let likedPostIds: Set<string> = new Set();
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: likes } = await (supabase as unknown as { from: (table: string) => any })
        .from("community_likes")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", data.map((p: SupabaseHighlightPost) => p.id));
      
      if (likes) {
        likedPostIds = new Set(likes.map((l: { post_id: string }) => l.post_id));
      }
    }

    const scoredPosts = (data as SupabaseHighlightPost[])
      .map(post => ({
        post,
        score: calculateScore(post),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ post }) => mapToPost(post, likedPostIds.has(post.id)));

    logger.info(`Fetched ${scoredPosts.length} weekly highlights`, CONTEXT);
    return { data: scoredPosts, error: null };

  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logger.error("Failed to fetch weekly highlights", CONTEXT, error);
    return { data: [], error };
  }
}
