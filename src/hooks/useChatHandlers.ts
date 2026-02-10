/**
 * useChatHandlers - Hook customizado para handlers do chat
 * Extrai lógica complexa do AssistantScreen
 */

import { useCallback, useEffect, useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { preClassifyMessage } from "../ai/policies/nathia.preClassifier";
import { isAppleFoundationModelsAvailable } from "../ai/appleFoundationModels";
import {
  detectCrisis,
  detectMedicalQuestion,
  estimateTokens,
  getNathIAResponse,
  imageUriToBase64,
} from "../api/ai-service";
import {
  SENSITIVE_TOPIC_DISCLAIMER,
  containsSensitiveTopic,
  getRandomFallbackMessage,
  prepareMessagesForAPI,
} from "../config/nathia";
import { useChatStore, useAppStore } from "../state";
import { useNathJourneyOnboardingStore } from "../state/nath-journey-onboarding-store";
import { usePrivacyStore } from "../state/usePrivacyStore";
import { usePremiumStatus } from "./usePremiumStatus";
import { useStreaming } from "./useStreaming";
import { ChatMessage, MainTabScreenProps } from "../types/navigation";
import { logger } from "../utils/logger";
import { saveMessageCountData, getTodayBrasilia, MessageCountData } from "../utils/messageCount";
import { AppError, ErrorCode } from "../utils/error-handler";

const FREE_MESSAGE_LIMIT = 20;

interface SelectedImage {
  uri: string;
  base64?: string;
  mediaType?: string;
}

interface UseChatHandlersProps {
  navigation: MainTabScreenProps<"Assistant">["navigation"];
  inputText: string;
  setInputText: (text: string) => void;
  messageCount: number;
  setMessageCount: (count: number) => void;
  flatListRef: React.RefObject<FlashListRef<ChatMessage> | null>;
  selectedImage?: SelectedImage | null;
  setSelectedImage?: (image: SelectedImage | null) => void;
}

export function useChatHandlers(props: UseChatHandlersProps) {
  const {
    navigation,
    inputText,
    setInputText,
    messageCount,
    setMessageCount,
    flatListRef,
    selectedImage,
    setSelectedImage,
  } = props;

  // Check premium status via Supabase (profiles.is_premium)
  const { isPremium } = usePremiumStatus({ autoRefresh: false });
  const user = useAppStore((s) => s.user);
  const conversations = useChatStore((s) => s.conversations);
  const currentConversationId = useChatStore((s) => s.currentConversationId);
  const isLoading = useChatStore((s) => s.isLoading);
  const setLoading = useChatStore((s) => s.setLoading);
  const addMessage = useChatStore((s) => s.addMessage);
  const setCurrentConversation = useChatStore((s) => s.setCurrentConversation);
  const clearCurrentChat = useChatStore((s) => s.clearCurrentChat);
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  // AI Consent gate (Apple Guideline 5.1.2(i) compliance)
  const canUseAi = usePrivacyStore((s) => s.canUseAi);

  // Get onboarding stage to determine if user is GENERAL (non-maternal context)
  const onboardingStage = useNathJourneyOnboardingStore((s) => s.data.stage);
  const isGeneralStage = onboardingStage === "GENERAL";

  // Streaming state (SSE) - exposed for UI typing indicator
  const isStreaming = useChatStore((s) => s.isStreaming);
  const currentStreamText = useChatStore((s) => s.currentStreamText);
  const clearStreamText = useChatStore((s) => s.clearStreamText);
  const { streamResponse, cancelStreaming } = useStreaming();

  // Track if send is in progress to prevent double sends
  const isSendingRef = useRef(false);

  // Track mounted state to prevent scroll calls after unmount
  const isMountedRef = useRef(true);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cancelStreaming();
      setLoading(false);
      // Clear all pending timeouts
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current = [];
    };
  }, [cancelStreaming, setLoading]);

  // Safe scroll helper - checks if component is mounted and ref is available
  const safeScrollToEnd = useCallback(() => {
    if (!isMountedRef.current) return;

    // Get current conversation to check if there are messages
    const currentConv = conversations.find((c) => c.id === currentConversationId);
    const hasMessages = currentConv && currentConv.messages.length > 0;

    // Don't try to scroll if there are no messages
    if (!hasMessages) return;

    // Use double requestAnimationFrame to ensure FlashList is fully rendered
    requestAnimationFrame(() => {
      if (!isMountedRef.current) return;

      requestAnimationFrame(() => {
        if (!isMountedRef.current) return;

        try {
          const ref = flatListRef.current;
          // Extra safety: verify ref is valid and has scrollToEnd method
          if (ref && ref.scrollToEnd && typeof ref.scrollToEnd === "function") {
            ref.scrollToEnd({ animated: true });
          }
        } catch (error) {
          // Silently fail if scroll fails (component may be unmounting)
          logger.debug("Scroll to end failed", "useChatHandlers", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });
    });
  }, [flatListRef, conversations, currentConversationId]);

  const handleNewChat = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    cancelStreaming();
    setLoading(false);
    setCurrentConversation(null);
  }, [cancelStreaming, setCurrentConversation, setLoading]);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      cancelStreaming();
      setLoading(false);
      setCurrentConversation(id);
    },
    [cancelStreaming, setCurrentConversation, setLoading]
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      deleteConversation(id);
    },
    [deleteConversation]
  );

  const handleSuggestedPrompt = useCallback(
    async (text: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setInputText(text);
    },
    [setInputText]
  );

  const handleClearChat = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearCurrentChat();
  }, [clearCurrentChat]);

  const handleVoiceOptInRequired = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // ARCHIVED: PrivacySettings moved to archive/privacy-support/
    // AI opt-in is now implicit - voice features require premium
    // navigation.navigate("PrivacySettings");
    logger.warn("Voice opt-in required but PrivacySettings is archived", "useChatHandlers");
  }, []);

  /**
   * Main send handler - processes user message and gets AI response
   */
  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading || isSendingRef.current) return;

    // Prevent double sends
    isSendingRef.current = true;

    // Check message limit for free users
    if (!isPremium && messageCount >= FREE_MESSAGE_LIMIT) {
      logger.info("Message limit reached for free user", "useChatHandlers", { messageCount });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      navigation.navigate("Paywall", { source: "chat_limit_reached" });
      isSendingRef.current = false;
      return;
    }

    // CRITICAL: Check AI consent (Apple Guideline 5.1.2(i))
    if (!canUseAi()) {
      logger.warn("AI request blocked - consent not granted", "useChatHandlers");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "⚠️ Para usar a NathIA com IA, você precisa aceitar o consentimento de compartilhamento de dados.\n\nVá em **Perfil → Personalização com IA** para ativar.",
        createdAt: new Date().toISOString(),
      };
      addMessage(errorMessage);
      setLoading(false);
      isSendingRef.current = false;
      const timeout = setTimeout(() => {
        safeScrollToEnd();
      }, 300);
      timeoutRefs.current.push(timeout);
      return;
    }

    const userInput = inputText.trim();
    const hasImage = !!selectedImage;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Create user message (with image indicator if present)
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: hasImage ? `${userInput}\n\n📷 [Imagem anexada]` : userInput,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);
    setInputText("");
    setLoading(true);

    // Save image reference and clear state
    const imageToSend = selectedImage;
    if (setSelectedImage) {
      setSelectedImage(null);
    }

    // Increment message count for free users
    if (!isPremium) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      try {
        const data: MessageCountData = {
          count: newCount,
          lastResetDate: getTodayBrasilia(),
        };
        await saveMessageCountData(user?.id || "anonymous", data);
      } catch (error) {
        logger.error(
          "Failed to save message count",
          "useChatHandlers",
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }

    // Scroll to end (safe) - delay to allow FlashList to render
    const timeout1 = setTimeout(() => {
      safeScrollToEnd();
    }, 300);
    timeoutRefs.current.push(timeout1);

    try {
      // SECURITY: Pre-classify message BEFORE calling LLM
      const preClassifyResult = preClassifyMessage(userInput);

      if (preClassifyResult.shouldBlock) {
        logger.info("Message blocked by pre-classifier", "useChatHandlers", {
          blockType: preClassifyResult.blockType,
          inputLength: userInput.length,
        });

        const blockedMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: preClassifyResult.template || "",
          createdAt: new Date().toISOString(),
        };
        addMessage(blockedMessage);
        setLoading(false);
        isSendingRef.current = false;
        const timeout = setTimeout(() => {
          safeScrollToEnd();
        }, 300);
        timeoutRefs.current.push(timeout);
        return;
      }

      // NOTE: AI consent is already verified by canUseAi() above (usePrivacyStore)
      // The NathIAStackNavigator also gates access to AssistantScreen based on consent
      // No need for duplicate aiOptIn check from usePreferencesStore

      // Prepare message history for API
      const currentConv = conversations.find((c) => c.id === currentConversationId);
      const messageHistory = currentConv?.messages || [];

      // Convert to API format
      const conversationForAPI = [
        ...messageHistory.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: userInput },
      ];

      // Prepare messages with NathIA system prompt (GENERAL context if applicable)
      const apiMessages = prepareMessagesForAPI(conversationForAPI, { isGeneralStage });

      // Estimate tokens and detect medical questions
      const estimated = estimateTokens(apiMessages);
      const requiresGrounding = detectMedicalQuestion(userInput);

      // Convert image to base64 if present
      let imageData: { base64: string; mediaType: string } | undefined;
      if (imageToSend?.uri) {
        try {
          imageData = await imageUriToBase64(imageToSend.uri);
          logger.info("Image converted to base64", "useChatHandlers", {
            mediaType: imageData.mediaType,
            size: imageData.base64.length,
          });
        } catch (imgError) {
          logger.error(
            "Failed to convert image",
            "useChatHandlers",
            imgError instanceof Error ? imgError : new Error(String(imgError))
          );
        }
      }

      // Determine if we should use streaming
      // Streaming only for: no crisis, no grounding, no image, and no on-device Apple provider
      const isCrisis = detectCrisis(userInput);
      const useAppleProvider = isAppleFoundationModelsAvailable();
      const shouldStream = !useAppleProvider && !isCrisis && !requiresGrounding && !imageData;

      const preferredProvider = useAppleProvider ? "apple" : "openai";
      const preferredModel = preferredProvider === "openai" ? "gpt-4o-mini" : undefined;

      let aiContent: string;
      let grounding: { citations?: Array<{ title?: string }> } | undefined;
      let responseProvider: string | undefined;
      let responseTokens: number | undefined;

      if (shouldStream) {
        // SSE STREAMING PATH
        logger.info("Using SSE streaming", "useChatHandlers");
        try {
          const streamResult = await streamResponse(apiMessages, {
            conversationId: currentConversationId || undefined,
          });
          aiContent = streamResult.content;
          responseProvider = streamResult.provider;
          responseTokens = streamResult.usage?.totalTokens;
        } catch (streamError) {
          logger.warn("SSE failed, falling back to JSON response", "useChatHandlers", {
            error: streamError instanceof Error ? streamError.message : String(streamError),
          });

          const response = await getNathIAResponse(apiMessages, {
            estimatedTokens: estimated,
            conversationId: currentConversationId || undefined,
            preferredProvider,
            ...(preferredModel && { preferredModel }),
          });
          aiContent = response.content;
          grounding = response.grounding;
          responseProvider = response.provider;
          responseTokens = response.usage?.totalTokens;
        }
      } else {
        // NON-STREAMING PATH (crisis, grounding, or image)
        logger.info("Using non-streaming path", "useChatHandlers", {
          isCrisis,
          requiresGrounding,
          hasImage: !!imageData,
        });
        const response = await getNathIAResponse(apiMessages, {
          estimatedTokens: estimated,
          requiresGrounding,
          imageData,
          isCrisis,
          conversationId: currentConversationId || undefined,
          preferredProvider,
          ...(preferredModel && { preferredModel }),
        });
        aiContent = response.content;
        grounding = response.grounding;
        responseProvider = response.provider;
        responseTokens = response.usage?.totalTokens;
      }

      // Clear streaming state
      clearStreamText();

      // Check for sensitive topics
      if (containsSensitiveTopic(userInput)) {
        aiContent = aiContent + "\n\n" + SENSITIVE_TOPIC_DISCLAIMER;
      }

      // Add grounding citations if present (only non-streaming path)
      if (grounding?.citations && grounding.citations.length > 0) {
        aiContent += "\n\n📚 Fontes:\n";
        grounding.citations.slice(0, 3).forEach((citation, i) => {
          aiContent += `${i + 1}. ${citation.title || "Fonte"}\n`;
        });
      }

      // Create AI message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        createdAt: new Date().toISOString(),
      };
      addMessage(aiMessage);

      logger.info("NathIA response generated", "useChatHandlers", {
        inputLength: userInput.length,
        outputLength: aiContent.length,
        tokens: responseTokens,
        provider: responseProvider,
        wasStreamed: shouldStream,
      });
    } catch (error) {
      if (
        error instanceof AppError &&
        (error.code === ErrorCode.REQUEST_CANCELLED || error.context?.flag === "cancelled")
      ) {
        logger.info("Streaming cancelled silently", "useChatHandlers");
        return;
      }
      logger.error(
        "NathIA API error",
        "useChatHandlers",
        error instanceof Error ? error : new Error(String(error))
      );

      let errorMessage = getRandomFallbackMessage();

      if (error instanceof AppError) {
        if (error.code === ErrorCode.UNAUTHORIZED || error.code === ErrorCode.SESSION_EXPIRED) {
          errorMessage =
            "Sua sessão expirou. Faça login novamente para continuar conversando comigo. 🔒";
        } else if (error.code === ErrorCode.RATE_LIMITED) {
          errorMessage =
            "Você está enviando muitas mensagens! Aguarde um minutinho e voltamos a conversar. ⏱️";
        } else if (error.userMessage) {
          errorMessage = error.userMessage;
        }
      }

      if (error instanceof Error) {
        if (
          error.message.includes("não autenticado") ||
          error.message.includes("Sessão expirada")
        ) {
          errorMessage =
            "Sua sessão expirou. Faça login novamente para continuar conversando comigo. 🔒";
        } else if (
          error.message.includes("muitas mensagens") ||
          error.message.includes("Rate limit")
        ) {
          errorMessage =
            "Você está enviando muitas mensagens! Aguarde um minutinho e voltamos a conversar. ⏱️";
        }
      }

      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessage,
        createdAt: new Date().toISOString(),
      };
      addMessage(fallbackMessage);
    } finally {
      setLoading(false);
      isSendingRef.current = false;
      setTimeout(() => {
        safeScrollToEnd();
      }, 300);
    }
  }, [
    inputText,
    isLoading,
    isPremium,
    messageCount,
    setMessageCount,
    navigation,
    user,
    selectedImage,
    setSelectedImage,
    conversations,
    currentConversationId,
    addMessage,
    setLoading,
    setInputText,
    safeScrollToEnd,
    streamResponse,
    clearStreamText,
    canUseAi,
    isGeneralStage,
  ]);

  return {
    handleNewChat,
    handleSelectConversation,
    handleDeleteConversation,
    handleSuggestedPrompt,
    handleClearChat,
    handleVoiceOptInRequired,
    handleSend,
    isLoading,
    // Streaming state for UI typing indicator
    isStreaming,
    currentStreamText,
    cancelStreaming,
  };
}
