/**
 * ChatInputAreaPremium - Input area estilo "cinema" com glassmorphism
 *
 * Mobile-First: iOS + Android (App Store / Google Play)
 *
 * Features:
 * - Glassmorphism com BlurView (iOS) / fallback sólido (Android)
 * - Send button 48x48 com glow pulsante
 * - Quick chips premium com sombra azul suave
 * - Typography refinada Manrope
 * - Acessibilidade WCAG AAA (tap targets 44px+)
 *
 * Performance:
 * - React.memo para evitar re-renders
 * - useCallback para handlers estáveis
 * - Reanimated v4 para animações 60fps
 * - Platform-specific optimizations
 *
 * Nota Android: BlurView pode ser pesado em dispositivos low-end.
 * Fallback usa overlay sólido com Tokens.premium.glass.strong.
 */

import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useCallback, useEffect } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useOptimizedAnimation } from "../../hooks/useOptimizedAnimation";
import { Tokens } from "../../theme/tokens";

interface ChatInputAreaPremiumProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onImagePick?: () => void;
  imageUri?: string;
  quickChips?: string[];
}

export const ChatInputAreaPremium: React.FC<ChatInputAreaPremiumProps> = React.memo(
  ({ value, onChangeText, onSend, onImagePick, imageUri, quickChips }) => {
    // Glow animation for send button (Reanimated v4)
    const glowOpacity = useSharedValue(0.5);
    const glowScale = useSharedValue(1);
    const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

    // Start pulsating animation on mount
    useEffect(() => {
      if (!shouldAnimate || !isActive) {
        cancelAnimation(glowOpacity);
        cancelAnimation(glowScale);
        glowOpacity.value = 0.5;
        glowScale.value = 1;
        return;
      }

      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        maxIterations,
        false
      );
      glowScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        maxIterations,
        false
      );

      return () => {
        cancelAnimation(glowOpacity);
        cancelAnimation(glowScale);
      };
    }, [glowOpacity, glowScale, shouldAnimate, isActive, maxIterations]);

    // Animated glow style (halo view behind button)
    const glowAnimatedStyle = useAnimatedStyle(() => ({
      opacity: glowOpacity.value,
      transform: [{ scale: glowScale.value }],
    }));

    // Handlers with haptics
    const handleSend = useCallback(() => {
      if (!value.trim()) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      onSend();
    }, [value, onSend]);

    const handleChipPress = useCallback(
      (chip: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onChangeText(chip);
      },
      [onChangeText]
    );

    const handleImagePick = useCallback(() => {
      if (onImagePick) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onImagePick();
      }
    }, [onImagePick]);

    // Premium shadow for container
    // iOS: glow rosa, Android: elevation
    const containerShadow = {
      ...Tokens.shadows.glow(Tokens.brand.accent[400]),
      shadowOpacity: 0.12,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 6 },
      elevation: Platform.OS === "android" ? 8 : undefined,
    };

    // Chip shadow (subtle blue)
    const chipShadow = {
      ...Tokens.shadows.glow(Tokens.brand.primary[300]),
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: Platform.OS === "android" ? 2 : undefined,
    };

    const canSend = value.trim().length > 0;

    // Inner content (shared between iOS BlurView and Android fallback)
    const renderContent = () => (
      <View style={styles.innerContainer}>
        {/* Quick Chips - só mostra quando input está vazio */}
        {quickChips && quickChips.length > 0 && !value.trim() && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsContent}
          >
            {quickChips.map((chip, index) => (
              <Pressable
                key={index}
                onPress={() => handleChipPress(chip)}
                style={[styles.chip, chipShadow]}
                accessibilityLabel={`Sugestão: ${chip}`}
                accessibilityRole="button"
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Image Preview */}
        {imageUri && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              contentFit="cover"
              cachePolicy="memory"
              accessibilityLabel="Imagem selecionada para envio"
            />
            <Pressable
              onPress={handleImagePick}
              style={styles.imagePreviewClose}
              accessibilityLabel="Remover imagem"
              accessibilityRole="button"
            >
              <Ionicons name="close-circle" size={24} color={Tokens.semantic.light.error} />
            </Pressable>
          </Animated.View>
        )}

        {/* Input Row */}
        <View style={styles.inputRow}>
          {/* Attachment button */}
          {onImagePick && (
            <Pressable
              onPress={handleImagePick}
              style={styles.attachButton}
              accessibilityLabel="Anexar imagem"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="add-circle-outline"
                size={26}
                color={imageUri ? Tokens.brand.accent[500] : Tokens.neutral[400]}
              />
            </Pressable>
          )}

          {/* Text Input */}
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder="Mensagem para NathIA..."
            placeholderTextColor={Tokens.neutral[400]}
            multiline
            maxLength={2000}
            style={styles.textInput}
            accessibilityLabel="Campo de mensagem"
            accessibilityHint="Digite sua mensagem para a NathIA"
          />

          {/* Send Button with Glow */}
          <View style={styles.sendButtonContainer}>
            {/* Glow halo (animated) - só aparece quando pode enviar */}
            {canSend && <Animated.View style={[styles.sendButtonGlow, glowAnimatedStyle]} />}
            {/* Actual button */}
            <Pressable
              onPress={handleSend}
              style={[styles.sendButton, { opacity: canSend ? 1 : 0.5 }]}
              disabled={!canSend}
              accessibilityLabel="Enviar mensagem"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSend }}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Ionicons name="send" size={20} color={Tokens.neutral[0]} />
            </Pressable>
          </View>
        </View>
      </View>
    );

    // iOS: BlurView com glassmorphism
    // Android: fallback sólido (BlurView pode ser pesado em low-end devices)
    if (Platform.OS === "ios") {
      return (
        <View style={[styles.container, containerShadow]}>
          <BlurView intensity={80} tint="light" style={styles.blurView}>
            <View style={styles.blurOverlay}>{renderContent()}</View>
          </BlurView>
        </View>
      );
    }

    // Android fallback (solid background, no blur)
    return (
      <View style={[styles.container, styles.androidContainer, containerShadow]}>
        {renderContent()}
      </View>
    );
  }
);

ChatInputAreaPremium.displayName = "ChatInputAreaPremium";

const styles = StyleSheet.create({
  container: {
    borderRadius: Tokens.radius["3xl"], // 28
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Tokens.brand.accent[200],
  },
  blurView: {
    borderRadius: Tokens.radius["3xl"], // 28
    overflow: "hidden",
  },
  blurOverlay: {
    backgroundColor: Tokens.premium.glass.strong,
  },
  androidContainer: {
    backgroundColor: Tokens.neutral[50],
  },
  innerContainer: {
    padding: Tokens.spacing.lg, // 16
  },
  chipsScroll: {
    marginBottom: Tokens.spacing.md, // 12
  },
  chipsContent: {
    gap: Tokens.spacing.sm, // 8
    paddingRight: Tokens.spacing.md, // 12
  },
  chip: {
    backgroundColor: Tokens.brand.primary[50],
    borderRadius: Tokens.radius.xl, // 20
    paddingHorizontal: Tokens.spacing.md, // 12
    paddingVertical: Tokens.spacing.sm, // 8
    minHeight: 36,
    justifyContent: "center",
  },
  chipText: {
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    color: Tokens.brand.primary[700],
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: Tokens.spacing.md, // 12
    alignSelf: "flex-start",
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: Tokens.radius.lg, // 16
    backgroundColor: Tokens.neutral[100],
  },
  imagePreviewClose: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Tokens.neutral[0],
    borderRadius: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Tokens.spacing.sm, // 8
  },
  attachButton: {
    width: Tokens.accessibility.minTapTarget, // 44
    height: Tokens.accessibility.minTapTarget, // 44
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
    color: Tokens.neutral[900],
    padding: Tokens.spacing.lg, // 16
    maxHeight: 120,
    minHeight: 48,
    textAlignVertical: "center",
  },
  sendButtonContainer: {
    position: "relative",
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonGlow: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Tokens.brand.accent[400],
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Tokens.brand.accent[500],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
