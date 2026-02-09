/**
 * VoiceRecordingInput - Voice recording UI component
 * Extracted from AssistantScreen for better separation of concerns
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { neutral, semantic, radius } from "../../theme/tokens";

interface VoiceRecordingInputProps {
  /** Whether currently recording */
  isRecording: boolean;
  /** Whether transcribing audio */
  isTranscribing: boolean;
  /** Current recording duration in seconds */
  duration: number;
  /** Handler for mic button press (start/stop recording) */
  onMicPress: () => void;
  /** Handler for cancel recording */
  onCancelRecording: () => void;
  /** Theme colors */
  theme: {
    primary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
}

export const VoiceRecordingInput = React.memo(function VoiceRecordingInput({
  isRecording,
  isTranscribing,
  duration,
  onMicPress,
  onCancelRecording,
  theme,
}: VoiceRecordingInputProps) {
  if (isRecording) {
    return (
      <View style={styles.recordingContainer}>
        <Pressable
          onPress={onCancelRecording}
          style={styles.cancelRecordingButton}
          accessibilityLabel="Cancelar gravacao"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={20} color={semantic.light.error} />
        </Pressable>
        <View style={styles.recordingIndicator}>
          <Animated.View
            entering={FadeIn}
            style={[styles.recordingDot, { backgroundColor: semantic.light.error }]}
          />
          <Text style={[styles.recordingDuration, { color: theme.textPrimary }]}>
            {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
          </Text>
        </View>
        <Pressable
          onPress={onMicPress}
          style={[styles.sendButton, { backgroundColor: semantic.light.error }]}
          accessibilityLabel="Parar gravacao e enviar"
          accessibilityRole="button"
        >
          <Ionicons name="stop" size={18} color={neutral[0]} />
        </Pressable>
      </View>
    );
  }

  if (isTranscribing) {
    return (
      <View style={styles.transcribingContainer}>
        <Text style={[styles.transcribingText, { color: theme.textSecondary }]}>
          Transcrevendo...
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onMicPress}
      style={styles.micButton}
      accessibilityLabel="Gravar mensagem de voz"
      accessibilityRole="button"
    >
      <Ionicons name="mic-outline" size={22} color={theme.textMuted} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  recordingContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  cancelRecordingButton: {
    padding: 8,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  recordingDuration: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  transcribingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  transcribingText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    marginBottom: 6,
  },
  micButton: {
    padding: 12,
  },
});
