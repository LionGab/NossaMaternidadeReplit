/**
 * ChatInputArea - Chat input component with attachments and voice
 * Extracted from AssistantScreen for better separation of concerns
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { brand, neutral, radius, semantic, spacing } from "../../theme/tokens";
import { VoiceRecordingInput } from "./VoiceRecordingInput";
import { ASSISTANT_THEME_STATIC } from "../../hooks/useAssistantTheme";
import { usePrivacyStore } from "../../state/usePrivacyStore";

/** Quick suggestion chips */
export const QUICK_CHIPS = [
  "Como está meu bebê?",
  "Posso tomar café?",
  "Dicas de sono",
  "Preparar enxoval",
];

interface SelectedImage {
  uri: string;
  base64?: string;
  mediaType?: string;
}

interface ChatInputAreaProps {
  /** Current input text */
  inputText: string;
  /** Handler for input text change */
  onChangeText: (text: string) => void;
  /** Handler for send button */
  onSend: () => void;
  /** Handler for suggested prompt selection */
  onSuggestedPrompt: (text: string) => void;
  /** Handler for attachment button */
  onAttachment: () => void;
  /** Handler for mic button */
  onMicPress: () => void;
  /** Handler for cancel recording */
  onCancelRecording: () => void;
  /** Handler for clear selected image */
  onClearImage: () => void;
  /** Whether there are messages in the chat */
  hasMessages: boolean;
  /** Selected image for attachment */
  selectedImage: SelectedImage | null;
  /** Voice recording state */
  voiceRecording: {
    isRecording: boolean;
    isTranscribing: boolean;
    duration: number;
  };
  /** Reference to TextInput */
  inputRef: React.RefObject<TextInput | null>;
  /** Theme colors */
  theme: {
    primary: string;
    bgPrimary: string;
    bgSecondary: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
  /** Horizontal padding */
  horizontalPadding: number;
}

export const ChatInputArea = React.memo(function ChatInputArea({
  inputText,
  onChangeText,
  onSend,
  onSuggestedPrompt,
  onAttachment,
  onMicPress,
  onCancelRecording,
  onClearImage,
  hasMessages,
  selectedImage,
  voiceRecording,
  inputRef,
  theme,
  horizontalPadding,
}: ChatInputAreaProps) {
  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 72;
  const showQuickChips = hasMessages && !inputText.trim();
  // Use canUseAi from privacy store (unified consent check)
  const canUseAi = usePrivacyStore((s) => s.canUseAi)();

  return (
    <View
      style={[
        styles.inputContainer,
        {
          paddingBottom: TAB_BAR_HEIGHT + spacing.xs,
          paddingHorizontal: horizontalPadding,
          paddingTop: spacing.xs,
          backgroundColor: theme.bgPrimary,
          borderTopWidth: 1,
          borderTopColor: brand.accent[50],
        },
      ]}
    >
      {/* Quick Chips - More elegant horizontal scroll */}
      {showQuickChips && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
        >
          {QUICK_CHIPS.map((chip, index) => (
            <Pressable
              key={index}
              onPress={() => onSuggestedPrompt(chip)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: pressed ? brand.accent[50] : neutral[0],
                  borderColor: pressed ? brand.accent[300] : brand.accent[100],
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              accessibilityLabel={`Sugestão: ${chip}`}
              accessibilityRole="button"
            >
              <Text style={[styles.chipText, { color: brand.accent[600] }]}>{chip}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Image Preview */}
      {selectedImage && (
        <Animated.View entering={FadeIn} style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.imagePreview}
            accessibilityLabel="Imagem selecionada para envio"
          />
          <Pressable
            onPress={onClearImage}
            style={styles.imagePreviewClose}
            accessibilityLabel="Remover imagem"
            accessibilityRole="button"
          >
            <Ionicons name="close-circle" size={22} color={semantic.light.error} />
          </Pressable>
        </Animated.View>
      )}

      {/* Input Box - Clean minimal style */}
      <View
        style={[
          styles.inputBox,
          {
            backgroundColor: neutral[50],
            borderColor: brand.accent[100],
          },
        ]}
      >
        {/* Attachment */}
        <Pressable
          onPress={onAttachment}
          disabled={!canUseAi}
          style={[styles.inputButton, !canUseAi && styles.inputButtonDisabled]}
          accessibilityLabel={
            canUseAi
              ? "Anexar imagem"
              : "A IA está desativada. Ative em Privacidade e Preferências."
          }
          accessibilityRole="button"
          accessibilityState={{ disabled: !canUseAi }}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={!canUseAi ? neutral[300] : selectedImage ? brand.accent[500] : neutral[400]}
          />
        </Pressable>

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          value={inputText}
          onChangeText={onChangeText}
          placeholder="Pergunte qualquer coisa..."
          placeholderTextColor={neutral[400]}
          multiline
          maxLength={2000}
          style={[styles.textInput, { color: theme.textPrimary }]}
          accessibilityLabel="Digite sua mensagem aqui"
        />

        {/* Send/Mic/Recording Button */}
        {voiceRecording.isRecording || voiceRecording.isTranscribing ? (
          <VoiceRecordingInput
            isRecording={voiceRecording.isRecording}
            isTranscribing={voiceRecording.isTranscribing}
            duration={voiceRecording.duration}
            onMicPress={onMicPress}
            onCancelRecording={onCancelRecording}
            theme={theme}
          />
        ) : inputText.trim() ? (
          <Pressable
            onPress={onSend}
            style={[
              styles.sendButton,
              {
                backgroundColor: brand.accent[500],
                shadowColor: brand.accent[500],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              },
            ]}
            accessibilityLabel="Enviar mensagem"
            accessibilityRole="button"
          >
            <Ionicons name="send" size={16} color={neutral[0]} />
          </Pressable>
        ) : (
          <VoiceRecordingInput
            isRecording={false}
            isTranscribing={false}
            duration={0}
            onMicPress={onMicPress}
            onCancelRecording={onCancelRecording}
            theme={theme}
          />
        )}
      </View>

      {/* Disclaimer - More subtle */}
      <Text style={[styles.disclaimer, { color: neutral[400] }]}>
        NathIA pode cometer erros. Consulte sempre seu médico.
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: spacing.xs,
    backgroundColor: ASSISTANT_THEME_STATIC.bgPrimary,
  },
  chipsScroll: {
    marginBottom: spacing.xs,
  },
  chipsContent: {
    paddingRight: spacing.md,
    gap: spacing.xs,
  },
  chip: {
    backgroundColor: neutral[0],
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: brand.accent[100],
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: neutral[50],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: brand.accent[100],
    minHeight: 44,
    maxHeight: 100,
  },
  inputButton: {
    minWidth: 40,
    minHeight: 40,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  inputButtonDisabled: {
    opacity: 0.4,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: ASSISTANT_THEME_STATIC.textPrimary,
    paddingVertical: 10,
    paddingRight: 8,
    maxHeight: 80,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: brand.accent[500],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
    marginBottom: 4,
  },
  disclaimer: {
    fontSize: 10,
    textAlign: "center",
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: spacing.xs,
    alignSelf: "flex-start",
  },
  imagePreview: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: neutral[100],
  },
  imagePreviewClose: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: neutral[0],
    borderRadius: radius.full,
  },
});
