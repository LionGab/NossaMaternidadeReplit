/**
 * GlowEffect - Efeito de brilho premium
 *
 * Adiciona um halo de luz suave ao redor de elementos
 * Perfeito para CTAs, avatares e elementos de destaque
 */

import React, { useEffect } from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import { brand, overlay } from "../../theme/tokens";
import { useOptimizedAnimation, useLoadingAnimation } from "../../hooks/useOptimizedAnimation";
import { shadowPresets } from "../../utils/shadow";

interface GlowEffectProps {
  /** Children to wrap with glow */
  children: React.ReactNode;
  /** Glow color */
  color?: string;
  /** Glow intensity (0-1) */
  intensity?: number;
  /** Size of the glow spread */
  size?: number;
  /** Whether to animate the glow */
  animated?: boolean;
  /** Animation duration in ms */
  duration?: number;
  /** Container style */
  style?: ViewStyle;
}

export function GlowEffect({
  children,
  color = brand.accent[400],
  intensity = 0.6,
  size: _size = 20,
  animated = true,
  duration = 2000,
  style,
}: GlowEffectProps) {
  const glowOpacity = useSharedValue(intensity);
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

  useEffect(() => {
    if (!animated || !shouldAnimate || !isActive) {
      cancelAnimation(glowOpacity);
      glowOpacity.value = intensity;
      return;
    }

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(intensity * 0.4, {
          duration: duration / 2,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
        withTiming(intensity, {
          duration: duration / 2,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
      ),
      maxIterations,
      false
    );

    return () => cancelAnimation(glowOpacity);
  }, [animated, intensity, duration, glowOpacity, shouldAnimate, isActive, maxIterations]);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.container, style]}>
      {/* Glow layer */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: color,
          },
          shadowPresets.colored(color, 1),
          animatedGlowStyle,
        ]}
      />
      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

/**
 * PulseGlow - Efeito de pulso luminoso
 * Ideal para notificações e elementos que precisam de atenção
 */
interface PulseGlowProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export function PulseGlow({
  children,
  color = brand.accent[400],
  size = 30,
  style,
}: PulseGlowProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

  useEffect(() => {
    if (!shouldAnimate || !isActive) {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = 1;
      opacity.value = 0.6;
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.in(Easing.ease) })
      ),
      maxIterations,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1000, easing: Easing.out(Easing.ease) }),
        withTiming(0.6, { duration: 1000, easing: Easing.in(Easing.ease) })
      ),
      maxIterations,
      false
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [scale, opacity, shouldAnimate, isActive, maxIterations]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.pulseGlow,
          {
            backgroundColor: color,
            borderRadius: 9999,
            position: "absolute",
            top: -size / 2,
            left: -size / 2,
            right: -size / 2,
            bottom: -size / 2,
          },
          animatedStyle,
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

/**
 * ShimmerEffect - Efeito de brilho deslizante
 * Perfeito para botões premium e loading states
 */
interface ShimmerEffectProps {
  children: React.ReactNode;
  /** Width of the shimmer container */
  width: number;
  /** Height of the shimmer container */
  height: number;
  /** Shimmer color */
  color?: string;
  /** Animation duration */
  duration?: number;
  style?: ViewStyle;
}

export function ShimmerEffect({
  children,
  width,
  height,
  color = overlay.shimmer,
  duration = 1500,
  style,
}: ShimmerEffectProps) {
  const translateX = useSharedValue(-width);
  const { shouldAnimate, isActive, maxIterations } = useLoadingAnimation();

  useEffect(() => {
    if (!shouldAnimate || !isActive) {
      cancelAnimation(translateX);
      translateX.value = -width;
      return;
    }

    translateX.value = withRepeat(
      withTiming(width * 2, {
        duration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      maxIterations,
      false
    );

    return () => cancelAnimation(translateX);
  }, [width, duration, translateX, shouldAnimate, isActive, maxIterations]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[{ width, height, overflow: "hidden" }, style]}>
      {children}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            width: width * 0.5,
            height: "100%",
            backgroundColor: color,
            opacity: 0.5,
          },
          shimmerStyle,
        ]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
  pulseGlow: {
    position: "absolute",
  },
});

export default GlowEffect;
