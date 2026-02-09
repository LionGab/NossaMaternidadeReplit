/**
 * ProgressBar - Barra de progresso reutilizável
 *
 * Barra animada com Reanimated para progresso visual.
 * Suporta variantes de cor e tamanhos.
 */

import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { brand, radius } from "@/theme/tokens";

// ============================================================================
// TYPES
// ============================================================================

type ProgressBarVariant = "primary" | "accent" | "secondary" | "teal";
type ProgressBarSize = "sm" | "md";

interface ProgressBarProps {
  /** Valor do progresso (0..1) */
  value: number;
  /** Variante de cor */
  variant?: ProgressBarVariant;
  /** Tamanho da barra */
  size?: ProgressBarSize;
  /** Label de acessibilidade */
  accessibilityLabel?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function getVariantColors(variant: ProgressBarVariant): {
  fill: string;
  track: string;
} {
  switch (variant) {
    case "accent":
      return {
        fill: brand.accent[500],
        track: brand.accent[100],
      };
    case "secondary":
      return {
        fill: brand.secondary[500],
        track: brand.secondary[100],
      };
    case "teal":
      return {
        fill: brand.teal[500],
        track: brand.teal[100],
      };
    case "primary":
    default:
      return {
        fill: brand.primary[500],
        track: brand.primary[100],
      };
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ProgressBar({
  value,
  variant = "primary",
  size = "md",
  accessibilityLabel = "Progresso",
}: ProgressBarProps): React.JSX.Element {
  const colors = getVariantColors(variant);
  const height = size === "sm" ? 8 : 12;
  const progress = useSharedValue(clamp01(value));

  useEffect(() => {
    progress.value = withTiming(clamp01(value), { duration: 350 });
  }, [value, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      style={[styles.track, { height, backgroundColor: colors.track }]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(clamp01(value) * 100),
      }}
    >
      <Animated.View
        style={[styles.fill, { height, backgroundColor: colors.fill }, animatedStyle]}
      />
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  track: {
    borderRadius: radius.full,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    borderRadius: radius.full,
  },
});
