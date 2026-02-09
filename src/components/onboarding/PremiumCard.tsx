/**
 * PremiumCard - Reusable card with glassmorphism and press effects
 *
 * Features:
 * - Glassmorphism effect (semi-transparent with blur)
 * - Spring-based press animation
 * - Optional selection state
 * - Customizable colors and styles
 * - Accessibility compliant (44pt min tap target)
 */

import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Tokens } from "../../theme/tokens";

// Glassmorphism opacity constant
const GLASS_OPACITY = 0.95;

interface PremiumCardProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  showGlow?: boolean;
  glowColor?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PremiumCardComponent({
  children,
  isSelected = false,
  onPress,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  showGlow = true,
  glowColor = Tokens.brand.accent[200],
}: PremiumCardProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: isSelected ? Tokens.brand.accent[300] : Tokens.neutral[200],
    borderWidth: withSpring(isSelected ? 2 : 1, { damping: 20 }),
  }));

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
      disabled={disabled || !onPress}
      style={[styles.pressable, animatedCardStyle]}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={{ selected: isSelected, disabled }}
    >
      <AnimatedView
        style={[
          styles.card,
          animatedBorderStyle,
          disabled && !isSelected && styles.cardDisabled,
          style,
        ]}
      >
        {/* Glassmorphism background */}
        <View style={styles.glassBackground} />

        {/* Content */}
        <View style={styles.contentContainer}>{children}</View>

        {/* Selection glow effect */}
        {showGlow && isSelected && (
          <View style={styles.glowContainer} pointerEvents="none">
            <LinearGradient
              colors={[`${glowColor}25`, "transparent"]}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      </AnimatedView>
    </AnimatedPressable>
  );
}

export const PremiumCard = memo(PremiumCardComponent);

const styles = StyleSheet.create({
  pressable: {
    minHeight: Tokens.accessibility.minTapTarget,
  },
  card: {
    borderRadius: Tokens.radius["2xl"],
    overflow: "hidden",
    backgroundColor: Tokens.neutral[0],
    ...Tokens.shadows.md,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${Tokens.neutral[0]}${Math.round(GLASS_OPACITY * 255)
      .toString(16)
      .padStart(2, "0")}`,
  },
  contentContainer: {
    padding: Tokens.spacing.lg,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Tokens.radius.xl,
  },
});
