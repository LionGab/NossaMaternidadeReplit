/**
 * MessageBubble - Premium chat message component with Markdown + Streaming
 *
 * Design: Flo/I Am inspired with:
 * - User bubbles with rosa gradient
 * - AI bubbles with glassmorphism
 * - Markdown rendering for AI messages
 * - Streaming text with cursor indicator
 *
 * Performance: React.memo with stable props for optimal rendering.
 *
 * @version 3.0 - Markdown + Streaming support
 */

import React, { useEffect } from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { VoiceMessagePlayer } from "../VoiceMessagePlayer";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { brand, neutral, shadows, typography, radius } from "../../theme/tokens";
import { NATHIA_GRADIENTS } from "../../hooks/useAssistantTheme";
import { ChatMessage } from "../../types/navigation";
import { cn } from "../../utils/cn";

// Theme colors type
interface ThemeColors {
  userBubble: string;
  aiBubble: string;
  textPrimary: string;
  borderLight: string;
  primary: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
  maxWidth: number;
  theme: ThemeColors;
  hasVoiceAccess: boolean;
  onVoicePremiumRequired?: () => void;
  // Streaming props (optional)
  isStreaming?: boolean;
  streamText?: string;
}

/**
 * Blinking cursor component for streaming indicator
 */
const StreamingCursor: React.FC = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0, { duration: 500 }),
      -1, // infinite
      true // reverse
    );

    return () => {
      cancelAnimation(opacity);
    };
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.cursor, animatedStyle]}>
      <View style={styles.cursorBar} />
    </Animated.View>
  );
};

const MessageBubbleComponent = ({
  message,
  index,
  maxWidth,
  theme,
  hasVoiceAccess,
  onVoicePremiumRequired,
  isStreaming = false,
  streamText,
}: MessageBubbleProps) => {
  const isUser = message.role === "user";
  // For streaming bubble, use streamText; otherwise use message.content
  const displayContent = isStreaming && streamText !== undefined ? streamText : message.content;
  // Don't render empty streaming bubble
  if (isStreaming && (!streamText || streamText.trim() === "")) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(Math.min(index * 15, 150)).duration(250)}
      className={cn("flex-row mb-3 px-3", isUser ? "justify-end" : "justify-start")}
    >
      {/* Message Bubble */}
      {isUser ? (
        // User bubble with rosa gradient - plain text (no markdown)
        <LinearGradient
          colors={NATHIA_GRADIENTS.userBubble}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl rounded-br-sm px-4 py-3 overflow-hidden"
          style={{
            maxWidth,
            shadowColor: brand.accent[500],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Image preview for user messages */}
          {message.image_url && (
            <View className="mb-2 overflow-hidden rounded-lg">
              <Image
                source={{ uri: message.image_url }}
                className="w-full h-40"
                resizeMode="cover"
                accessibilityLabel="Imagem anexada à mensagem"
              />
            </View>
          )}
          <Text
            style={{
              color: neutral[0],
              fontSize: 15,
              lineHeight: 21,
              fontFamily: typography.fontFamily.base,
            }}
          >
            {displayContent}
          </Text>
        </LinearGradient>
      ) : (
        // AI bubble - clean white with subtle border + MARKDOWN
        <View
          className="rounded-2xl rounded-bl-sm px-4 py-3 overflow-hidden"
          style={{
            maxWidth,
            backgroundColor: neutral[0],
            borderWidth: 1,
            borderColor: brand.accent[100],
            ...shadows.sm,
          }}
        >
          {/* Image analysis for AI messages */}
          {message.image_analysis && message.image_url && (
            <View className="mb-2 overflow-hidden rounded-lg">
              <Image
                source={{ uri: message.image_url }}
                className="w-full h-40"
                resizeMode="cover"
                accessibilityLabel="Imagem analisada pela NathIA"
              />
            </View>
          )}

          {/* Markdown content + streaming cursor */}
          <View style={styles.contentContainer}>
            <MarkdownRenderer textColor={theme.textPrimary}>{displayContent}</MarkdownRenderer>
            {isStreaming && <StreamingCursor />}
          </View>

          {/* Voice Player - Only for NathIA messages (not during streaming) */}
          {hasVoiceAccess && !isStreaming && (
            <View className="mt-2 pt-2 border-t" style={{ borderTopColor: brand.accent[50] }}>
              <VoiceMessagePlayer
                messageId={message.id}
                text={displayContent}
                onPremiumRequired={onVoicePremiumRequired}
                size="small"
                compact
                iconColor={brand.accent[500]}
              />
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  cursor: {
    marginLeft: 2,
    marginBottom: 4,
  },
  cursorBar: {
    width: 2,
    height: 16,
    backgroundColor: brand.accent[500],
    borderRadius: radius.xs,
  },
});

// Memoized with custom comparison for stable re-renders
export const MessageBubble = React.memo(MessageBubbleComponent, (prevProps, nextProps) => {
  // Always re-render if streaming state changes
  if (prevProps.isStreaming !== nextProps.isStreaming) return false;
  if (prevProps.streamText !== nextProps.streamText) return false;

  // Standard comparison for non-streaming props
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.image_url === nextProps.message.image_url &&
    prevProps.message.image_analysis === nextProps.message.image_analysis &&
    prevProps.maxWidth === nextProps.maxWidth &&
    prevProps.hasVoiceAccess === nextProps.hasVoiceAccess &&
    prevProps.theme.userBubble === nextProps.theme.userBubble &&
    prevProps.theme.aiBubble === nextProps.theme.aiBubble
  );
});

MessageBubble.displayName = "MessageBubble";
