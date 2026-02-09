/**
 * FloatingEmojis - Elementos decorativos flutuantes com emojis
 * Inspirado no design "Rosa Suave + Azul Tiffany"
 *
 * Features:
 * - Emojis flutuantes animados
 * - Posicionamento aleatório responsivo
 * - Animações suaves e performáticas
 * - Respeita preferências de movimento reduzido
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

export interface FloatingEmoji {
  emoji: string;
  size: number;
  top: number; // percentage
  left: number; // percentage
  delay: number;
  duration: number;
}

export interface FloatingEmojisProps {
  /** Emojis to display */
  emojis?: FloatingEmoji[];
  /** Whether to enable animations (default: true) */
  animated?: boolean;
  /** Test ID for e2e testing */
  testID?: string;
}

// ===========================================
// DEFAULT EMOJIS (Rosa Suave + Azul Tiffany theme)
// ===========================================

const DEFAULT_EMOJIS: FloatingEmoji[] = [
  { emoji: "🌸", size: 24, top: 10, left: 8, delay: 0, duration: 4000 },
  { emoji: "💎", size: 20, top: 20, left: 90, delay: 700, duration: 4500 },
  { emoji: "🦋", size: 18, top: 40, left: 5, delay: 1400, duration: 3800 },
  { emoji: "🌷", size: 22, top: 55, left: 93, delay: 2100, duration: 4200 },
  { emoji: "✨", size: 16, top: 65, left: 12, delay: 2800, duration: 3600 },
];

// ===========================================
// FLOATING EMOJI ITEM
// ===========================================

interface FloatingEmojiItemProps {
  emoji: FloatingEmoji;
  screenWidth: number;
  screenHeight: number;
  animated: boolean;
}

function FloatingEmojiItem({ emoji, screenWidth, screenHeight, animated }: FloatingEmojiItemProps) {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0.6);
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

  useEffect(() => {
    if (!animated || !shouldAnimate || !isActive) {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
      translateY.value = 0;
      rotate.value = 0;
      opacity.value = 0.6;
      return;
    }

    // Floating animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: emoji.duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: emoji.duration, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    // Rotation animation
    rotate.value = withRepeat(
      withSequence(
        withTiming(3, { duration: emoji.duration * 0.8, easing: Easing.inOut(Easing.ease) }),
        withTiming(-2, { duration: emoji.duration * 0.8, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    // Opacity pulse
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: emoji.duration * 0.6 }),
        withTiming(0.6, { duration: emoji.duration * 0.6 })
      ),
      maxIterations,
      true
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
    };
  }, [
    animated,
    shouldAnimate,
    isActive,
    maxIterations,
    emoji.duration,
    translateY,
    rotate,
    opacity,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  const positionStyle = useMemo(
    () => ({
      top: (screenHeight * emoji.top) / 100,
      left: (screenWidth * emoji.left) / 100,
    }),
    [screenHeight, screenWidth, emoji.top, emoji.left]
  );

  return (
    <Animated.View
      entering={FadeIn.delay(emoji.delay).duration(600)}
      style={[styles.emojiContainer, positionStyle, animatedStyle]}
      pointerEvents="none"
    >
      <Text style={[styles.emoji, { fontSize: emoji.size }]}>{emoji.emoji}</Text>
    </Animated.View>
  );
}

// ===========================================
// COMPONENT
// ===========================================

export function FloatingEmojis({
  emojis = DEFAULT_EMOJIS,
  animated = true,
  testID,
}: FloatingEmojisProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  return (
    <View style={styles.container} testID={testID} pointerEvents="none">
      {emojis.map((emoji, index) => (
        <FloatingEmojiItem
          key={`${emoji.emoji}-${index}`}
          emoji={emoji}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
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
  emojiContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    textAlign: "center",
  },
});

export default FloatingEmojis;
