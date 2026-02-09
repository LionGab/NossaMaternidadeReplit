/**
 * LoadingDots - Indicador de loading animado
 *
 * Design System 2025 - Calm FemTech
 * Loading state padronizado para chat e outros contextos
 */

import React, { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { useLoadingAnimation } from "../../hooks/useOptimizedAnimation";

interface LoadingDotsProps {
  /** Dot size */
  size?: "sm" | "md" | "lg";
  /** Color variant */
  variant?: "primary" | "accent" | "neutral";
  /** Custom color override */
  color?: string;
  /** Number of dots */
  count?: 3 | 4 | 5;
  /** Additional container style */
  style?: ViewStyle;
}

const SIZES = {
  sm: { dot: 6, gap: 4 },
  md: { dot: 8, gap: 6 },
  lg: { dot: 10, gap: 8 },
};

/**
 * Animated loading dots for chat and loading states
 *
 * @example
 * ```tsx
 * <LoadingDots variant="primary" size="md" />
 * ```
 */
export function LoadingDots({
  size = "md",
  variant = "primary",
  color,
  count = 3,
  style,
}: LoadingDotsProps) {
  const { brand, colors, isDark } = useTheme();

  const currentSize = SIZES[size];

  // Get color based on variant
  const getColor = (index: number) => {
    if (color) return color;

    const baseColor =
      variant === "accent"
        ? brand.accent[500]
        : variant === "neutral"
          ? isDark
            ? colors.neutral[500]
            : colors.neutral[400]
          : brand.primary[500];

    // For first dot, use full color
    if (index === 0) return baseColor;

    // For other dots, use lighter versions from the palette
    const colorScale =
      variant === "accent"
        ? [brand.accent[500], brand.accent[300], brand.accent[200]]
        : variant === "neutral"
          ? [colors.neutral[400], colors.neutral[300], colors.neutral[200]]
          : [brand.primary[500], brand.primary[300], brand.primary[200]];

    return colorScale[Math.min(index, colorScale.length - 1)];
  };

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {Array.from({ length: count }).map((_, index) => (
        <AnimatedDot
          key={index}
          size={currentSize.dot}
          color={getColor(index)}
          delay={index * 150}
          marginLeft={index > 0 ? currentSize.gap : 0}
        />
      ))}
    </View>
  );
}

interface AnimatedDotProps {
  size: number;
  color: string;
  delay: number;
  marginLeft: number;
}

function AnimatedDot({ size, color, delay, marginLeft }: AnimatedDotProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);
  const { shouldAnimate, isActive, maxIterations } = useLoadingAnimation();

  useEffect(() => {
    // Skip animation if reduced motion or app in background
    if (!shouldAnimate || !isActive) {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    // Scale animation - uses maxIterations from hook (infinite for loading)
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1.3, {
          duration: 600,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        maxIterations,
        true
      )
    );

    // Opacity animation
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 600,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        maxIterations,
        true
      )
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [delay, scale, opacity, shouldAnimate, isActive, maxIterations]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          marginLeft,
        },
        animatedStyle,
      ]}
    />
  );
}

export default LoadingDots;
