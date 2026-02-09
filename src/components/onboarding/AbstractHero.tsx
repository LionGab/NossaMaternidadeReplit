/**
 * AbstractHero - Premium hero section with gradients and floating bubbles
 *
 * Features:
 * - Abstract gradient background (no photos)
 * - Floating bubble animations
 * - Optional centered content (logo, title, etc.)
 * - Smooth fade-in animation
 * - Accessibility compliant
 */

import React from "react";
import { StyleSheet, View, ViewStyle, DimensionValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { FloatingBubbles } from "./FloatingBubbles";
import { Tokens } from "../../theme/tokens";

interface AbstractHeroProps {
  gradientColors?: readonly [string, string, ...string[]];
  height?: DimensionValue;
  children?: React.ReactNode;
  showBubbles?: boolean;
  bubbleCount?: number;
  style?: ViewStyle;
}

export function AbstractHero({
  gradientColors = [
    Tokens.gradients.accentVibrant[0],
    Tokens.brand.primary[100],
    Tokens.brand.accent[50],
  ] as readonly [string, string, ...string[]],
  height = 300,
  children,
  showBubbles = true,
  bubbleCount = 3,
  style,
}: AbstractHeroProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(800)}
      style={[styles.container, { height }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {/* Gradient background */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Floating bubbles */}
      {showBubbles && <FloatingBubbles count={bubbleCount} />}

      {/* Content overlay */}
      {children && <View style={styles.contentContainer}>{children}</View>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
