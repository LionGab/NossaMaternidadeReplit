/**
 * Sparkles - Efeito de brilhos animados
 * Inspirado no design "Rosa Suave + Azul Tiffany"
 *
 * Features:
 * - Sparkles animados com twinkle effect
 * - Posicionamento configurável
 * - Animações suaves e performáticas
 */

import React, { useEffect, useMemo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
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
import { useOptimizedAnimation } from "@/hooks/useOptimizedAnimation";

// ===========================================
// TYPES
// ===========================================

export interface Sparkle {
  emoji: string;
  size: number;
  top: number; // percentage
  left: number; // percentage
  delay: number;
}

export interface SparklesProps {
  /** Sparkles to display */
  sparkles?: Sparkle[];
  /** Whether to enable animations (default: true) */
  animated?: boolean;
  /** Test ID for e2e testing */
  testID?: string;
}

// ===========================================
// DEFAULT SPARKLES
// ===========================================

const DEFAULT_SPARKLES: Sparkle[] = [
  { emoji: "✨", size: 16, top: -5, left: 85, delay: 0 },
  { emoji: "💕", size: 14, top: 15, left: 2, delay: 300 },
  { emoji: "🌟", size: 18, top: 65, left: 88, delay: 600 },
  { emoji: "💫", size: 12, top: 75, left: 8, delay: 900 },
];

// ===========================================
// SPARKLE ITEM
// ===========================================

interface SparkleItemProps {
  sparkle: Sparkle;
  containerHeight: number;
  containerWidth: number;
  animated: boolean;
}

function SparkleItem({ sparkle, containerHeight, containerWidth, animated }: SparkleItemProps) {
  const positionStyle = useMemo(() => {
    const top = sparkle.top < 0 ? sparkle.top : (containerHeight * sparkle.top) / 100;
    const left = (containerWidth * sparkle.left) / 100;
    return { top, left };
  }, [sparkle.top, sparkle.left, containerHeight, containerWidth]);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0.5);
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

  useEffect(() => {
    if (!animated || !shouldAnimate || !isActive) {
      cancelAnimation(scale);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
      scale.value = 1;
      rotate.value = 0;
      opacity.value = 0.5;
      return;
    }

    // Twinkle animation (scale + rotate + opacity)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    opacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 1500 }), withTiming(0.5, { duration: 1500 })),
      maxIterations,
      true
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
    };
  }, [animated, shouldAnimate, isActive, maxIterations, scale, rotate, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      entering={FadeIn.delay(sparkle.delay).duration(600)}
      style={[styles.sparkleContainer, positionStyle, animatedStyle]}
      pointerEvents="none"
    >
      <Text style={[styles.sparkle, { fontSize: sparkle.size }]}>{sparkle.emoji}</Text>
    </Animated.View>
  );
}

// ===========================================
// COMPONENT
// ===========================================

export function Sparkles({ sparkles = DEFAULT_SPARKLES, animated = true, testID }: SparklesProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Use hero height as approximate container height
  const containerHeight = useMemo(() => screenHeight * 0.35, [screenHeight]);
  const containerWidth = screenWidth;

  return (
    <View style={styles.container} testID={testID} pointerEvents="none">
      {sparkles.map((sparkle, index) => (
        <SparkleItem
          key={`sparkle-${index}`}
          sparkle={sparkle}
          containerHeight={containerHeight}
          containerWidth={containerWidth}
          animated={animated}
        />
      ))}
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  sparkleContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    textAlign: "center",
  },
});

export default Sparkles;
