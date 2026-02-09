import { supabase } from "../api/supabase";
import { logger } from "../utils/logger";
import { CommunityPost, MediaType } from "../types/community";
import { analyzePost, addToModerationQueue, type AddToModerationQueueParams } from "../api/moderation";

/**
 * React Native FormData file interface
 * RN's FormData accepts file objects with uri/name/type properties,
 * which differs from the standard web FormData that expects Blob/File objects.
 * @see https://reactnative.dev/docs/network#uploading-multipart-data
 */
interface ReactNativeFormDataFile {
  uri: string;
  name: string;
  type: string;
}

export interface CreatePostResult {
  success: boolean;
  error?: string;
  moderationStatus?: "auto_approved" | "pending_review" | "auto_blocked";
  message?: string;
}

export const communityService = {
  // Feed Aprovado
  getFeed: async (page = 1, limit = 10): Promise<CommunityPost[]> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", "CommunityService");
        return [];
      }

      const { data, error } = await supabase.functions.invoke("community-feed", {
        body: { page, limit, type: "feed" },
      });

      if (error) throw error;
      return data.data || [];
    } catch (error) {
      logger.error("Erro ao buscar feed Comunidade", "CommunityService", error as Error);
      return [];
    }
  },

  // Meus Posts
  getMyPosts: async (page = 1, limit = 10): Promise<CommunityPost[]> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", "CommunityService");
        return [];
      }

      const { data, error } = await supabase.functions.invoke("community-feed", {
        body: { page, limit, type: "my_posts" },
      });

      if (error) throw error;
      return data.data || [];
    } catch (error) {
      logger.error("Erro ao buscar meus posts", "CommunityService", error as Error);
      return [];
    }
  },

  // Criar Post (Upload via FormData para evitar crash de memória com vídeos)
  // Integrado com sistema de moderação AI
  createPost: async (
    text: string,
    mediaUri: string | null,
    mediaType: MediaType,
    _tags: string[] = []
  ): Promise<CreatePostResult> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", "CommunityService");
        return { success: false, error: "Supabase not initialized" };
      }

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Usuário não autenticado");

      // 1. Analisar conteúdo com AI moderation
      const hasMedia = !!mediaUri;
      const userReputation = 50; // TODO: Buscar reputação real do usuário
      const moderationDecision = analyzePost(text, hasMedia, userReputation);

      logger.info("Análise de moderação", "CommunityService", {
        action: moderationDecision.action,
        score: moderationDecision.profanityResult.score,
        qualityScore: moderationDecision.qualityScore,
      });

      // 2. Se auto-bloqueado, não inserir e retornar
      if (moderationDecision.action === "auto_block") {
        const suggestion = moderationDecision.profanityResult.suggestion || 
          "Seu conteúdo não atende às diretrizes da comunidade.";
        
        // Registrar na fila para auditoria com dados completos
        const queueParams: AddToModerationQueueParams = {
          userId: user.id,
          content: text,
          category: moderationDecision.profanityResult.categories[0] || "profanity",
          severity: moderationDecision.profanityResult.score,
          qualityScore: moderationDecision.qualityScore,
          flaggedTerms: moderationDecision.profanityResult.flaggedTerms,
          categories: moderationDecision.profanityResult.categories,
        };
        await addToModerationQueue(queueParams);

        return {
          success: false,
          error: suggestion,
          moderationStatus: "auto_blocked",
          message: moderationDecision.reason,
        };
      }

      let mediaPath = null;

      // 3. Upload Mídia (se houver)
      if (mediaUri) {
        const ext = mediaUri.split(".").pop() || "jpg";
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const path = `${user.id}/${fileName}`;

        // Usar FormData é mais eficiente para memória do que base64
        const formData = new FormData();
        // Create the file object using React Native's FormData file format
        const fileData: ReactNativeFormDataFile = {
          uri: mediaUri,
          name: fileName,
          type: mediaType === "video" ? "video/mp4" : "image/jpeg",
        };
        // Cast to Blob since RN's FormData.append accepts this format at runtime
        formData.append("files", fileData as unknown as Blob);

        const { error: uploadError } = await supabase.storage
          .from("community-media")
          .upload(path, formData, {
            contentType: mediaType === "video" ? "video/mp4" : "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }
        mediaPath = path;
      }

      // 4. Determinar status inicial baseado na moderação
      // Database enum allows: draft, submitted, approved, rejected, needs_changes
      const isAutoApproved = moderationDecision.action === "auto_approve";
      const postStatus = isAutoApproved ? "approved" : "submitted"; // submitted = aguardando moderação

      // 5. Insert Post
      const { data: postData, error: insertError } = await supabase
        .from("community_posts")
        .insert({
          author_id: user.id,
          content: text,
          image_url: mediaPath,
          // Note: Database enum only allows: text, image, poll, question, announcement, milestone
          // Both video and image media use "image" type
          type: mediaPath ? "image" : "text",
          status: postStatus,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      // 6. Se precisa revisão, adicionar à fila de moderação com post_id
      if (moderationDecision.action === "queue_for_review" && postData) {
        const queueParams: AddToModerationQueueParams = {
          userId: user.id,
          postId: postData.id, // Link to actual post
          content: text,
          category: moderationDecision.profanityResult.categories[0] || "review",
          severity: moderationDecision.profanityResult.score,
          qualityScore: moderationDecision.qualityScore,
          flaggedTerms: moderationDecision.profanityResult.flaggedTerms,
          categories: moderationDecision.profanityResult.categories,
        };
        await addToModerationQueue(queueParams);

        return {
          success: true,
          moderationStatus: "pending_review",
          message: "Seu post foi enviado para revisão e será publicado após aprovação.",
        };
      }

      // 7. Auto-aprovado
      return {
        success: true,
        moderationStatus: "auto_approved",
        message: "Post publicado com sucesso!",
      };
    } catch (error) {
      logger.error("Erro ao criar post", "CommunityService", error as Error);
      return { success: false, error: (error as Error).message };
    }
  },
};
