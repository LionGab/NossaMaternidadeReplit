/**
 * OnboardingFooter - Footer CTA unificado para telas de onboarding
 *
 * Features:
 * - Botão principal com gradient e glow pulsante
 * - Link secundário opcional
 * - Haptic feedback em interações
 * - Animações suaves (Reanimated v4)
 * - Safe area bottom handling
 *
 * @example
 * <OnboardingFooter
 *   label="Continuar"
 *   onPress={handleNext}
 *   disabled={!canProceed}
 *   secondaryLabel="Pular"
 *   onSecondaryPress={handleSkip}
 * />
 */

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOptimizedAnimation } from "@/hooks/useOptimizedAnimation";
import { Tokens } from "@/theme/tokens";

// ===========================================
// TYPES
// ===========================================

export interface OnboardingFooterProps {
  /** Primary button label */
  label: string;
  /** Primary button press handler */
  onPress: () => void;
  /** Whether primary button is disabled */
  disabled?: boolean;
  /** Whether to show loading state */
  loading?: boolean;
  /** Secondary link label (optional) */
  secondaryLabel?: string;
  /** Secondary link press handler */
  onSecondaryPress?: () => void;
  /** Whether to show glow animation (default: true) */
  showGlow?: boolean;
  /** Additional style for container */
  style?: ViewStyle;
  /** Test ID for e2e testing */
  testID?: string;
}

// ===========================================
// COMPONENT
// ===========================================

export function OnboardingFooter({
  label,
  onPress,
  disabled = false,
  loading = false,
  secondaryLabel,
  onSecondaryPress,
  showGlow = true,
  style,
  testID,
}: OnboardingFooterProps) {
  const insets = useSafeAreaInsets();
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

  // Glow animation values
  const glowOpacity = useSharedValue(0.4);
  const glowScale = useSharedValue(1);

  // Start glow animation when enabled and not disabled
  useEffect(() => {
    if (!showGlow || disabled || !shouldAnimate || !isActive) {
      cancelAnimation(glowOpacity);
      cancelAnimation(glowScale);
      glowOpacity.value = 0.4;
      glowScale.value = 1;
      return;
    }

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      false
    );

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      false
    );

    return () => {
      cancelAnimation(glowOpacity);
      cancelAnimation(glowScale);
    };
  }, [showGlow, disabled, shouldAnimate, isActive, maxIterations, glowOpacity, glowScale]);

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: disabled ? 0 : glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress();
  }, [disabled, loading, onPress]);

  const handleSecondaryPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onSecondaryPress?.();
  }, [onSecondaryPress]);

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom + Tokens.spacing.xl }, style]}
      testID={testID}
    >
      {/* Primary CTA */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(500).springify()}
        style={styles.buttonContainer}
      >
        {/* Glow halo */}
        {showGlow && <Animated.View style={[styles.buttonGlow, glowAnimatedStyle]} />}

        {/* Button */}
        <Pressable
          onPress={handlePress}
          disabled={disabled || loading}
          style={[styles.button, disabled && styles.buttonDisabled]}
          accessibilityLabel={label}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
        >
          <LinearGradient
            colors={
              disabled ? [Tokens.neutral[300], Tokens.neutral[400]] : Tokens.gradients.accentVibrant
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
              {loading ? "Carregando..." : label}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Secondary link */}
      {secondaryLabel && onSecondaryPress && (
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Pressable
            onPress={handleSecondaryPress}
            style={styles.secondaryButton}
            accessibilityLabel={secondaryLabel}
            accessibilityRole="button"
            hitSlop={{ top: 12, bottom: 12, left: 20, right: 20 }}
          >
            <Text style={styles.secondaryText}>{secondaryLabel}</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    gap: Tokens.spacing.md,
  },
  buttonContainer: {
    position: "relative",
    alignItems: "center",
  },
  buttonGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Tokens.radius["3xl"],
    backgroundColor: Tokens.brand.accent[400],
  },
  button: {
    width: "100%",
    borderRadius: Tokens.radius["3xl"],
    overflow: "hidden",
    ...Tokens.shadows.md,
    ...(Platform.OS === "android" ? { elevation: 4 } : {}),
    zIndex: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: Tokens.spacing.xl,
    paddingHorizontal: Tokens.spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  buttonText: {
    color: Tokens.neutral[0],
    fontSize: 18,
    fontFamily: Tokens.typography.fontFamily.bold,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  buttonTextDisabled: {
    color: Tokens.neutral[100],
  },
  secondaryButton: {
    paddingVertical: Tokens.spacing.sm,
    alignItems: "center",
    minHeight: Tokens.accessibility.minTapTarget,
    justifyContent: "center",
  },
  secondaryText: {
    fontSize: 14,
    fontFamily: Tokens.typography.fontFamily.medium,
    fontWeight: "500",
    color: Tokens.neutral[500],
  },
});

// ===========================================
// EXPORTS
// ===========================================

export default OnboardingFooter;
