/**
 * FloatingBubbles - Animated floating particles/bubbles for premium backgrounds
 *
 * Features:
 * - Smooth floating animations
 * - Respects reduced motion preferences
 * - Performance optimized with useOptimizedAnimation
 * - Customizable colors, sizes, and count
 */

import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useOptimizedAnimation } from "../../hooks/useOptimizedAnimation";
import { Tokens } from "../../theme/tokens";

// Bubble positioning constants
const BUBBLE_POSITION_TOP_MULTIPLIER = 25;
const BUBBLE_POSITION_TOP_MAX = 80;
const BUBBLE_POSITION_LEFT_MULTIPLIER = 35;
const BUBBLE_POSITION_LEFT_MAX = 85;

interface FloatingBubblesProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
}

interface BubbleProps {
  index: number;
  color: string;
  size: number;
  shouldAnimate: boolean;
  isActive: boolean;
  maxIterations: number;
}

function Bubble({ index, color, size, shouldAnimate, isActive, maxIterations }: BubbleProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (!shouldAnimate || !isActive) {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(opacity);
      translateY.value = 0;
      translateX.value = 0;
      opacity.value = 0.3;
      return;
    }

    // Vertical floating animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(-20 - index * 10, {
          duration: 3000 + index * 500,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 3000 + index * 500,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      maxIterations,
      false
    );

    // Horizontal floating animation
    translateX.value = withRepeat(
      withSequence(
        withTiming(15 + index * 5, {
          duration: 2500 + index * 400,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(-15 - index * 5, {
          duration: 2500 + index * 400,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      maxIterations,
      false
    );

    // Opacity pulse
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, {
          duration: 2000 + index * 300,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.2, {
          duration: 2000 + index * 300,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      maxIterations,
      false
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(opacity);
    };
  }, [translateY, translateX, opacity, index, shouldAnimate, isActive, maxIterations]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }));

  // Position bubbles in different areas - use constants for positioning
  const positionTop = (index * BUBBLE_POSITION_TOP_MULTIPLIER) % BUBBLE_POSITION_TOP_MAX;
  const positionLeft = (index * BUBBLE_POSITION_LEFT_MULTIPLIER) % BUBBLE_POSITION_LEFT_MAX;

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
          top: `${positionTop}%`,
          left: `${positionLeft}%`,
        },
        animatedStyle,
      ]}
    />
  );
}

export function FloatingBubbles({
  count = 4,
  colors = [Tokens.brand.accent[200], Tokens.brand.primary[200], Tokens.nathAccent.roseLight],
  minSize = 80,
  maxSize = 180,
}: FloatingBubblesProps) {
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

  const bubbles = Array.from({ length: count }).map((_, index) => {
    const color = colors[index % colors.length];
    const size = minSize + ((maxSize - minSize) * index) / count;

    return (
      <Bubble
        key={index}
        index={index}
        color={color}
        size={size}
        shouldAnimate={shouldAnimate}
        isActive={isActive}
        maxIterations={maxIterations}
      />
    );
  });

  return <View style={styles.container}>{bubbles}</View>;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  bubble: {
    position: "absolute",
  },
});
