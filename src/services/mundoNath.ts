import { supabase } from "../api/supabase";
import { logger } from "../utils/logger";
import { MediaType, MundoNathPost } from "../types/community";

export const mundoNathService = {
  getFeed: async (page = 1, limit = 10): Promise<{ data: MundoNathPost[]; isPremium: boolean }> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", "MundoNathService");
        return { data: [], isPremium: false };
      }

      const { data, error } = await supabase.functions.invoke("mundo-nath-feed", {
        body: { page, limit },
      });

      if (error) throw error;

      return {
        data: data.data || [],
        isPremium: data.user_is_premium || false,
      };
    } catch (error) {
      logger.error("Erro ao buscar feed Mundo Nath", "MundoNathService", error as Error);
      return { data: [], isPremium: false };
    }
  },

  createPost: async ({
    title,
    body,
    type,
  }: {
    title: string;
    body: string;
    type: MediaType;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", "MundoNathService");
        return { success: false, error: "Supabase not initialized" };
      }

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        return { success: false, error: "Usuário não autenticado" };
      }

      // Simple merge of title + body; media upload não implementado aqui.
      const text = [title.trim(), body.trim()].filter(Boolean).join("\n\n");

      const { error } = await supabase.from("mundo_nath_posts").insert({
        type,
        text,
        is_published: true,
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      logger.error("Erro ao criar post Mundo Nath", "MundoNathService", error as Error);
      return { success: false, error: (error as Error).message };
    }
  },
};
