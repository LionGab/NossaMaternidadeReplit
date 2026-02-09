/**
 * AnimatedCounter - Smooth animated counter component
 *
 * Features:
 * - Smooth spring-based count animation
 * - Customizable colors and styles
 * - Accessibility support
 * - Shows current/max (e.g., "2/3")
 */

import React, { useEffect } from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Tokens } from "../../theme/tokens";

interface AnimatedCounterProps {
  current: number;
  max: number;
  style?: TextStyle;
  color?: string;
  highlightColor?: string;
  size?: "small" | "medium" | "large";
  accessibilityLabel?: string;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export function AnimatedCounter({
  current,
  max,
  style,
  color = Tokens.neutral[700],
  highlightColor = Tokens.brand.accent[500],
  size = "medium",
  accessibilityLabel,
}: AnimatedCounterProps) {
  const scale = useSharedValue(1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Skip animations if reduced motion is enabled
    if (reducedMotion) {
      return;
    }

    // Pulse animation when count changes
    scale.value = withSpring(1.15, { damping: 10, stiffness: 300 });
    const timeoutId = setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    }, 150);

    return () => {
      clearTimeout(timeoutId);
    };
    // scale is a SharedValue (Reanimated) - stable reference, doesn't need to be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sizeStyles = {
    small: styles.textSmall,
    medium: styles.textMedium,
    large: styles.textLarge,
  };

  const isFull = current >= max;
  const currentColor = isFull ? highlightColor : color;

  return (
    <View style={styles.container}>
      <AnimatedText
        style={[sizeStyles[size], { color: currentColor }, style, animatedStyle]}
        accessibilityLabel={accessibilityLabel || `${current} de ${max} selecionados`}
        accessibilityRole="text"
      >
        <Text style={{ fontWeight: "700" }}>{current}</Text>
        <Text style={{ fontWeight: "400" }}>/{max}</Text>
      </AnimatedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textSmall: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  textMedium: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  textLarge: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
  },
});
