/**
 * AssistantScreen - NathIA Chat Interface
 *
 * DESIGN: Flo Health Minimal Style
 * FEATURES:
 * - FloScreenWrapper with subtle gradient background
 * - FloHeader minimal component
 * - Chat bubbles with soft shadows
 * - Minimal borders and generous whitespace
 * - Typography: Manrope font family
 * - Smooth animations with react-native-reanimated
 * - Dark mode support using useTheme hook
 * - Clean minimal input area at bottom
 *
 * @refactored 2025-01 - Flo Health Minimal redesign
 */

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo, useRef, useState } from "react";

// Avatar da NathIA
const NATHIA_AVATAR = require("../../../assets/nathia-app.png");
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChatEmptyState, ChatHistorySidebar } from "@/components/chat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { LoadingDots } from "@/components/ui";
import { EmotionalMoodType, getEmotionalResponse } from "@/config/nathia";
import { useAssistantTheme } from "@/hooks/useAssistantTheme";
import { useChatHandlers } from "@/hooks/useChatHandlers";
import { useTheme } from "@/hooks/useTheme";
import { useVoiceOptInGate } from "@/hooks/useVoice";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useIsPremium } from "@/state/premium-store";
import { Conversation, useAppStore, useChatStore } from "@/state/store";
import { Tokens, mockupColors, radius, shadows, spacing, typography } from "@/theme/tokens";
import { ChatMessage, MainTabScreenProps } from "@/types/navigation";
// Navigation types provided by MainTabScreenProps
import { wp } from "@/utils/dimensions";
import { logger } from "@/utils/logger";
import { loadMessageCountData, resetMessageCount } from "@/utils/messageCount";

// ============================================
// CUSTOM HEADER COMPONENT - Flo Health Minimal Style
// ============================================
interface FloAssistantHeaderProps {
  onHistoryPress: () => void;
  onNewChatPress: () => void;
  onClearPress?: () => void;
  hasMessages: boolean;
  isDark: boolean;
}

const FloAssistantHeader: React.FC<FloAssistantHeaderProps> = ({
  onHistoryPress,
  onNewChatPress,
  onClearPress,
  hasMessages,
  isDark,
}) => {
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const buttonBg = isDark ? Tokens.overlay.lightInvertedVeryLight : Tokens.overlay.darkVeryLight;

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.floHeader}>
      {/* Left - History Button */}
      <Pressable
        onPress={onHistoryPress}
        style={[styles.floHeaderButton, { backgroundColor: buttonBg }]}
        accessibilityLabel="Abrir histórico de conversas"
        accessibilityRole="button"
      >
        <Ionicons
          name="chatbubbles-outline"
          size={22}
          color={isDark ? Tokens.neutral[300] : Tokens.neutral[600]}
        />
      </Pressable>

      {/* Center - Avatar + Info */}
      <Pressable
        style={styles.floHeaderCenter}
        accessibilityLabel="NathIA - Assistente virtual online"
        accessibilityRole="header"
      >
        <View style={styles.floHeaderAvatarContainer}>
          <Image
            source={NATHIA_AVATAR}
            style={styles.floHeaderAvatar}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.floHeaderOnlineBadge} />
        </View>
        <View style={styles.floHeaderInfo}>
          <Text
            style={[
              styles.floHeaderTitle,
              { color: textPrimary, fontFamily: typography.fontFamily.bold },
            ]}
          >
            NathIA
          </Text>
          <Text
            style={[
              styles.floHeaderSubtitle,
              { color: Tokens.brand.teal[500], fontFamily: typography.fontFamily.medium },
            ]}
          >
            Online
          </Text>
        </View>
      </Pressable>

      {/* Right - Actions */}
      <View style={styles.floHeaderActions}>
        {hasMessages && onClearPress && (
          <Pressable
            onPress={onClearPress}
            style={[styles.floHeaderButton, { backgroundColor: buttonBg }]}
            accessibilityLabel="Limpar conversa atual"
            accessibilityRole="button"
            accessibilityHint="Remove todas as mensagens da conversa atual"
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={isDark ? Tokens.neutral[400] : Tokens.neutral[500]}
            />
          </Pressable>
        )}
        <Pressable
          onPress={onNewChatPress}
          style={[styles.floHeaderButton, { backgroundColor: buttonBg }]}
          accessibilityLabel="Iniciar nova conversa"
          accessibilityRole="button"
          accessibilityHint="Cria uma nova conversa com a NathIA"
        >
          <Ionicons name="add" size={22} color={Tokens.brand.accent[500]} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

// ============================================
// CUSTOM INPUT COMPONENT - Flo Health Minimal Style
// ============================================
interface FloMinimalInputProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttachment: () => void;
  onMicPress: () => void;
  inputRef: React.RefObject<TextInput | null>;
  isDark: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  selectedImage: { uri: string } | null;
  onClearImage: () => void;
}

const FloMinimalInput: React.FC<FloMinimalInputProps> = ({
  inputText,
  onChangeText,
  onSend,
  onAttachment,
  onMicPress,
  inputRef,
  isDark,
  isRecording,
  isTranscribing,
  selectedImage,
  onClearImage,
}) => {
  const scale = useSharedValue(1);

  const animatedSendStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSendPress = async () => {
    scale.value = withSpring(0.9, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend();
  };

  const bgColor = isDark ? Tokens.overlay.lightInvertedVeryLight : Tokens.neutral[50];
  const borderColor = isDark ? Tokens.overlay.lightInvertedLight : Tokens.brand.accent[100];
  const textColor = isDark ? Tokens.neutral[100] : Tokens.neutral[800];
  const placeholderColor = isDark ? Tokens.neutral[500] : Tokens.neutral[400];
  const iconColor = isDark ? Tokens.neutral[400] : Tokens.neutral[500];

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.floInputWrapper}>
      {/* Image Preview */}
      {selectedImage && (
        <Animated.View entering={FadeIn} style={styles.floImagePreview}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.floImagePreviewImage}
            contentFit="cover"
          />
          <Pressable
            onPress={onClearImage}
            style={styles.floImagePreviewClose}
            accessibilityLabel="Remover imagem"
          >
            <Ionicons name="close-circle" size={22} color={Tokens.semantic.light.error} />
          </Pressable>
        </Animated.View>
      )}

      {/* Input Container */}
      <View style={[styles.floInputContainer, { backgroundColor: bgColor, borderColor }]}>
        {/* Attachment Button */}
        <Pressable
          onPress={onAttachment}
          style={styles.floInputButton}
          accessibilityLabel="Anexar imagem"
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={selectedImage ? Tokens.brand.accent[500] : iconColor}
          />
        </Pressable>

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          value={inputText}
          onChangeText={onChangeText}
          placeholder="Pergunte qualquer coisa..."
          placeholderTextColor={placeholderColor}
          multiline
          maxLength={2000}
          style={[
            styles.floTextInput,
            { color: textColor, fontFamily: typography.fontFamily.base },
          ]}
          accessibilityLabel="Digite sua mensagem"
        />

        {/* Send or Mic Button */}
        {isRecording || isTranscribing ? (
          <View style={styles.floRecordingIndicator}>
            <View style={styles.floRecordingDot} />
            <Text style={styles.floRecordingText}>{isTranscribing ? "..." : "Gravando"}</Text>
          </View>
        ) : inputText.trim() ? (
          <Animated.View style={animatedSendStyle}>
            <Pressable
              onPress={handleSendPress}
              style={styles.floSendButton}
              accessibilityLabel="Enviar mensagem"
            >
              <Ionicons name="arrow-up" size={18} color={Tokens.neutral[0]} />
            </Pressable>
          </Animated.View>
        ) : (
          <Pressable
            onPress={onMicPress}
            style={styles.floInputButton}
            accessibilityLabel="Gravar áudio"
          >
            <Ionicons name="mic-outline" size={22} color={iconColor} />
          </Pressable>
        )}
      </View>

      {/* Disclaimer */}
      <Text
        style={[
          styles.floDisclaimer,
          {
            color: isDark ? Tokens.neutral[500] : Tokens.neutral[400],
            fontFamily: typography.fontFamily.base,
          },
        ]}
      >
        NathIA pode cometer erros. Consulte sempre seu médico.
      </Text>
    </Animated.View>
  );
};

// ============================================
// LOADING INDICATOR - Flo Health Minimal Style
// ============================================
const FloLoadingIndicator: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const bgColor = isDark ? Tokens.overlay.lightInvertedLight : Tokens.neutral[0];
  const borderColor = isDark ? Tokens.overlay.lightInvertedLight : Tokens.brand.accent[50];

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[styles.floLoadingContainer, { backgroundColor: bgColor, borderColor }]}
    >
      <LoadingDots variant="primary" size="sm" />
    </Animated.View>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
type AssistantScreenProps = MainTabScreenProps<"Assistant">;

export default function AssistantScreen({ navigation, route }: AssistantScreenProps) {
  const { isDark } = useTheme();
  const { messageBubbleTheme } = useAssistantTheme();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Responsive values
  const { messageMaxWidth, horizontalPadding } = useMemo(() => {
    const isTablet = screenWidth >= 768;
    return {
      messageMaxWidth: isTablet ? wp(60) : wp(80),
      horizontalPadding: screenWidth < 375 ? 12 : 20,
    };
  }, [screenWidth]);

  // Refs
  const flatListRef = useRef<FlashListRef<ChatMessage>>(null);
  const inputRef = useRef<TextInput>(null);

  // Local state
  const [inputText, setInputText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    base64?: string;
    mediaType?: string;
  } | null>(null);

  // Emotional context from Home check-in
  const emotionalContext = route?.params?.emotionalContext as EmotionalMoodType | undefined;

  // Store selectors
  const conversations = useChatStore((s) => s.conversations);
  const currentConversationId = useChatStore((s) => s.currentConversationId);
  const isLoading = useChatStore((s) => s.isLoading);
  const addMessage = useChatStore((s) => s.addMessage);

  // Premium status
  const isPremium = useIsPremium();
  const user = useAppStore((s) => s.user);

  // AI consent (now implicit)
  const aiConsentSeen = true;

  // Voice opt-in gate
  const { hasAccess: hasVoiceAccess } = useVoiceOptInGate();

  // Voice recording
  const voiceRecording = useVoiceRecording();

  // Chat handlers hook (includes streaming state)
  const handlers = useChatHandlers({
    navigation,
    inputText,
    setInputText,
    messageCount,
    setMessageCount,
    flatListRef,
    selectedImage,
    setSelectedImage,
  });

  // Destructure streaming state
  const { isStreaming, currentStreamText } = handlers;

  // Auto-scroll during streaming - throttled with cleanup
  const lastScrollRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (isStreaming && currentStreamText) {
      const now = Date.now();
      if (now - lastScrollRef.current > 100) {
        lastScrollRef.current = now;
        // Clear pending timeout before creating new one
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
          scrollTimeoutRef.current = null;
        }, 50);
      }
    }
    // Cleanup on unmount or when streaming stops
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [isStreaming, currentStreamText]);

  // Load message count on mount (with migration)
  React.useEffect(() => {
    let isMounted = true;

    const runMigration = async () => {
      const MIGRATION_KEY = "migration_message_limit_v2_done";
      try {
        const migrated = await AsyncStorage.getItem(MIGRATION_KEY);
        if (migrated === "true") return;

        if (!isPremium && user?.id) {
          await resetMessageCount(user.id);
          await AsyncStorage.setItem(MIGRATION_KEY, "true");
          logger.info("Migration: message count reset for limit change", "Migration");
        }
      } catch (error) {
        logger.error(
          "Migration failed (non-critical)",
          "Migration",
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    const loadMessageCount = async () => {
      if (isPremium) {
        if (isMounted) setMessageCount(0);
        return;
      }
      try {
        const data = await loadMessageCountData(user?.id || "anonymous");
        if (isMounted) {
          setMessageCount(data.count);
        }
      } catch (error) {
        if (isMounted) {
          logger.error(
            "Failed to load message count (non-critical)",
            "AssistantScreen",
            error instanceof Error ? error : new Error(String(error))
          );
          setMessageCount(0);
        }
      }
    };

    runMigration()
      .catch((err) => {
        logger.error(
          "Migration crashed (non-critical)",
          "Migration",
          err instanceof Error ? err : new Error(String(err))
        );
      })
      .finally(() => {
        if (isMounted) {
          loadMessageCount().catch((err) => {
            logger.error(
              "Load message count crashed (non-critical)",
              "AssistantScreen",
              err instanceof Error ? err : new Error(String(err))
            );
            if (isMounted) setMessageCount(0);
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isPremium, user?.id]);

  // Process emotional context from check-in
  React.useEffect(() => {
    if (emotionalContext && aiConsentSeen) {
      const emotionalResponse = getEmotionalResponse(emotionalContext);
      const assistantMessage: ChatMessage = {
        id: `emotional-${Date.now()}`,
        role: "assistant",
        content: emotionalResponse,
        createdAt: new Date().toISOString(),
      };
      addMessage(assistantMessage);
      navigation.setParams({ emotionalContext: undefined });
    }
  }, [emotionalContext, aiConsentSeen, addMessage, navigation]);

  // Get current messages
  const currentMessages = useMemo(() => {
    const conv = conversations.find((c) => c.id === currentConversationId);
    return conv?.messages || [];
  }, [conversations, currentConversationId]);

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups: { title: string; conversations: Conversation[] }[] = [
      { title: "Hoje", conversations: [] },
      { title: "Ontem", conversations: [] },
      { title: "Esta semana", conversations: [] },
      { title: "Anteriores", conversations: [] },
    ];

    conversations.forEach((conv) => {
      const convDate = new Date(conv.createdAt);
      if (convDate.toDateString() === today.toDateString()) {
        groups[0].conversations.push(conv);
      } else if (convDate.toDateString() === yesterday.toDateString()) {
        groups[1].conversations.push(conv);
      } else if (convDate > lastWeek) {
        groups[2].conversations.push(conv);
      } else {
        groups[3].conversations.push(conv);
      }
    });

    return groups.filter((g) => g.conversations.length > 0);
  }, [conversations]);

  // ============================================
  // HANDLERS
  // ============================================

  const renderMessageItem = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => (
      <MessageBubble
        message={item}
        index={index}
        maxWidth={messageMaxWidth}
        theme={messageBubbleTheme}
        hasVoiceAccess={hasVoiceAccess}
        onVoicePremiumRequired={handlers.handleVoiceOptInRequired}
      />
    ),
    [messageMaxWidth, messageBubbleTheme, hasVoiceAccess, handlers.handleVoiceOptInRequired]
  );

  const handleNewChat = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await handlers.handleNewChat();
    setShowHistory(false);
  }, [handlers]);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      await handlers.handleSelectConversation(id);
      setShowHistory(false);
    },
    [handlers]
  );

  const handleSuggestedPrompt = useCallback(
    async (text: string) => {
      await handlers.handleSuggestedPrompt(text);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    },
    [handlers]
  );

  // Voice recording handlers
  const handleMicPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (voiceRecording.isRecording) {
      const transcribedText = await voiceRecording.stopRecording();
      if (transcribedText) {
        setInputText(transcribedText);
      }
      return;
    }
    await voiceRecording.startRecording();
  }, [voiceRecording]);

  // Image attachment handler
  const handleAttachment = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      logger.warn("Image picker permission denied", "AssistantScreen");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage({ uri: result.assets[0].uri });
      logger.info("Image selected for attachment", "AssistantScreen");
    }
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Background gradient colors - Flo Health Minimal style
  const bgGradient = isDark
    ? ([Tokens.neutral[950], Tokens.neutral[900], Tokens.neutral[950]] as const)
    : ([Tokens.neutral[50], Tokens.neutral[50], Tokens.neutral[0]] as const);

  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 72;

  // ============================================
  // RENDER
  // ============================================
  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: bgGradient[1] }]} />

      {/* Safe Area Content */}
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {/* Header - Flo Health Minimal */}
        <FloAssistantHeader
          onHistoryPress={() => setShowHistory(true)}
          onNewChatPress={handleNewChat}
          onClearPress={currentMessages.length > 0 ? handlers.handleClearChat : undefined}
          hasMessages={currentMessages.length > 0}
          isDark={isDark}
        />

        {/* Messages Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.messagesContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          {currentMessages.length === 0 ? (
            <ScrollView
              contentContainerStyle={[
                styles.emptyScrollContent,
                { paddingHorizontal: horizontalPadding },
              ]}
              showsVerticalScrollIndicator={false}
            >
              <ChatEmptyState
                onSuggestedPrompt={handleSuggestedPrompt}
                screenWidth={screenWidth}
                horizontalPadding={horizontalPadding}
              />
            </ScrollView>
          ) : (
            <FlashList
              ref={flatListRef}
              data={currentMessages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessageItem}
              contentContainerStyle={[
                styles.messagesListContent,
                { paddingHorizontal: horizontalPadding },
              ]}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                isStreaming && currentStreamText ? (
                  <MessageBubble
                    message={{
                      id: "streaming",
                      role: "assistant",
                      content: "",
                      createdAt: new Date().toISOString(),
                    }}
                    index={currentMessages.length}
                    maxWidth={messageMaxWidth}
                    theme={messageBubbleTheme}
                    hasVoiceAccess={false}
                    isStreaming={true}
                    streamText={currentStreamText}
                  />
                ) : isLoading ? (
                  <FloLoadingIndicator isDark={isDark} />
                ) : null
              }
            />
          )}

          {/* Input Area - Flo Health Minimal */}
          <View
            style={[
              styles.inputAreaContainer,
              {
                paddingBottom: TAB_BAR_HEIGHT + spacing.xs,
                paddingHorizontal: horizontalPadding,
                backgroundColor: isDark ? Tokens.neutral[950] : Tokens.neutral[0],
                borderTopColor: isDark
                  ? Tokens.overlay.lightInvertedVeryLight
                  : Tokens.brand.accent[50],
              },
            ]}
          >
            <FloMinimalInput
              inputText={inputText}
              onChangeText={setInputText}
              onSend={handlers.handleSend}
              onAttachment={handleAttachment}
              onMicPress={handleMicPress}
              inputRef={inputRef}
              isDark={isDark}
              isRecording={voiceRecording.isRecording}
              isTranscribing={voiceRecording.isTranscribing}
              selectedImage={selectedImage}
              onClearImage={handleClearImage}
            />
          </View>
        </KeyboardAvoidingView>

        {/* Modals */}
        <ChatHistorySidebar
          visible={showHistory}
          conversations={conversations}
          currentConversationId={currentConversationId}
          groupedConversations={groupedConversations}
          onClose={() => setShowHistory(false)}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handlers.handleDeleteConversation}
        />
      </View>
    </View>
  );
}

// ============================================
// STYLES - Flo Health Minimal Design
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mockupColors.gradients.card[0],
  },
  content: {
    flex: 1,
  },

  // ============================================
  // HEADER STYLES - Flo Health Minimal
  // ============================================
  floHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    // Subtle shadow for visual separation
    shadowColor: Tokens.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 10,
  },
  floHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  floHeaderCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.md,
  },
  floHeaderAvatarContainer: {
    position: "relative",
  },
  floHeaderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Tokens.brand.accent[200],
  },
  floHeaderOnlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Tokens.brand.teal[500],
    borderWidth: 2.5,
    borderColor: Tokens.neutral[0],
  },
  floHeaderInfo: {
    marginLeft: spacing.sm,
  },
  floHeaderTitle: {
    fontSize: 18,
    letterSpacing: -0.3,
  },
  floHeaderSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  floHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  // ============================================
  // MESSAGES STYLES
  // ============================================
  messagesContainer: {
    flex: 1,
  },
  messagesListContent: {
    paddingVertical: spacing.lg,
  },
  emptyScrollContent: {
    paddingTop: spacing.xl,
    paddingBottom: spacing["6xl"],
  },

  // ============================================
  // LOADING STYLES - Flo Health Minimal
  // ============================================
  floLoadingContainer: {
    alignSelf: "flex-start",
    marginLeft: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    ...shadows.flo.soft,
  },

  // ============================================
  // INPUT AREA STYLES - Flo Health Minimal
  // ============================================
  inputAreaContainer: {
    borderTopWidth: 1,
    paddingTop: spacing.sm,
  },
  floInputWrapper: {
    width: "100%",
  },
  floImagePreview: {
    position: "relative",
    marginBottom: spacing.sm,
    alignSelf: "flex-start",
  },
  floImagePreviewImage: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
  },
  floImagePreviewClose: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Tokens.neutral[0],
    borderRadius: radius.full,
  },
  floInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: radius["2xl"],
    borderWidth: 1,
    minHeight: 52,
    maxHeight: 120,
    overflow: "hidden",
  },
  floInputButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    // Ensure minimum 44pt touch target
    minWidth: 44,
    minHeight: 44,
  },
  floTextInput: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 12,
    paddingRight: spacing.sm,
    maxHeight: 100,
  },
  floSendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Tokens.brand.accent[500],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    marginBottom: 6,
    ...shadows.flo.cta,
  },
  floRecordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  floRecordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Tokens.semantic.light.error,
    marginRight: spacing.xs,
  },
  floRecordingText: {
    fontSize: 13,
    color: Tokens.semantic.light.error,
    fontFamily: typography.fontFamily.medium,
  },
  floDisclaimer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: spacing.sm,
    letterSpacing: 0.1,
    lineHeight: 16,
  },
});
