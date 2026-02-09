/**
 * OnboardingHeader - Header unificado para telas de onboarding
 *
 * Features:
 * - Back button com haptic feedback
 * - Progress bar animada
 * - Título opcional
 * - Acessibilidade completa
 *
 * @example
 * <OnboardingHeader
 *   title="Escolha sua jornada"
 *   progress={0.25}
 *   onBack={() => navigation.goBack()}
 * />
 */

import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Tokens } from "@/theme/tokens";

// ===========================================
// TYPES
// ===========================================

export interface OnboardingHeaderProps {
  /** Title to display (optional) */
  title?: string;
  /** Progress value from 0 to 1 */
  progress?: number;
  /** Callback when back button is pressed */
  onBack?: () => void;
  /** Whether to show back button (default: true if onBack provided) */
  showBack?: boolean;
  /** Whether to show progress bar (default: true if progress provided) */
  showProgress?: boolean;
  /** Additional style for container */
  style?: ViewStyle;
  /** Test ID for e2e testing */
  testID?: string;
}

// ===========================================
// COMPONENT
// ===========================================

export function OnboardingHeader({
  title,
  progress,
  onBack,
  showBack = Boolean(onBack),
  showProgress = progress !== undefined,
  style,
  testID,
}: OnboardingHeaderProps) {
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onBack?.();
  }, [onBack]);

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Top row: Back button + title */}
      <View style={styles.topRow}>
        {/* Back button */}
        {showBack ? (
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            accessibilityHint="Volta para a tela anterior"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={28} color={Tokens.neutral[700]} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        {/* Title */}
        {title && (
          <Animated.Text
            entering={FadeIn.duration(300)}
            style={styles.title}
            accessibilityRole="header"
            numberOfLines={1}
          >
            {title}
          </Animated.Text>
        )}

        {/* Right placeholder for symmetry */}
        <View style={styles.backPlaceholder} />
      </View>

      {/* Progress bar */}
      {showProgress && progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <ProgressFill progress={progress} />
          </View>
        </View>
      )}
    </View>
  );
}

// ===========================================
// PROGRESS FILL SUBCOMPONENT
// ===========================================

interface ProgressFillProps {
  progress: number;
}

function ProgressFill({ progress }: ProgressFillProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
    transform: [{ scaleX: withSpring(1, { damping: 15 }) }],
  }));

  return <Animated.View style={[styles.progressFill, animatedStyle]} />;
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.sm,
    paddingBottom: Tokens.spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: Tokens.accessibility.minTapTarget,
  },
  backButton: {
    width: Tokens.accessibility.minTapTarget,
    height: Tokens.accessibility.minTapTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Tokens.radius.lg,
  },
  backPlaceholder: {
    width: Tokens.accessibility.minTapTarget,
    height: Tokens.accessibility.minTapTarget,
  },
  title: {
    flex: 1,
    fontSize: Tokens.typography.headlineMedium.fontSize,
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontWeight: Tokens.typography.headlineMedium.fontWeight,
    color: Tokens.neutral[800],
    textAlign: "center",
  },
  progressContainer: {
    marginTop: Tokens.spacing.md,
    paddingHorizontal: Tokens.spacing.sm,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Tokens.neutral[200],
    borderRadius: Tokens.radius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Tokens.brand.accent[400],
    borderRadius: Tokens.radius.full,
  },
});

// ===========================================
// EXPORTS
// ===========================================

export default OnboardingHeader;
