import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle, StyleProp, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Tokens } from "../../theme/tokens";

interface SoftCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * Visual variant:
   * - elevated: Default with shadow (glassmorphism)
   * - outlined: Subtle border, no shadow
   * - flat: Minimal, no elevation
   * - gradient: Premium gradient background
   */
  variant?: "elevated" | "outlined" | "flat" | "gradient";
  /**
   * Padding using Tokens.spacing
   * @default "2xl"
   */
  padding?: keyof typeof Tokens.spacing;
  /**
   * Make card pressable (interactive)
   */
  onPress?: () => void;
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
  /**
   * Accessibility role
   * @default "none" or "button" if onPress
   */
  accessibilityRole?: "none" | "button" | "link";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * SoftCard - Premium card component with glassmorphism
 *
 * Design Philosophy:
 * - 24px border radius = Soft Premium (not generic 8px/16px)
 * - Diffuse shadows for depth without harshness
 * - Gradient variant for maximum impact moments
 *
 * @example
 * // Elevated card (default)
 * <SoftCard>
 *   <Text>Content</Text>
 * </SoftCard>
 *
 * @example
 * // Pressable card
 * <SoftCard variant="gradient" onPress={handlePress}>
 *   <Text>Tap me</Text>
 * </SoftCard>
 */
export function SoftCard({
  children,
  style,
  variant = "elevated",
  padding = "2xl",
  onPress,
  accessibilityLabel,
  accessibilityRole,
}: SoftCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const paddingValue = Tokens.spacing[padding];
  const role = accessibilityRole || (onPress ? "button" : "none");

  // Gradient variant
  if (variant === "gradient") {
    const CardWrapper = onPress ? AnimatedPressable : View;
    const wrapperProps = onPress
      ? {
          onPress,
          onPressIn: handlePressIn,
          onPressOut: handlePressOut,
          accessibilityRole: role,
          accessibilityLabel,
          style: [styles.base, animatedStyle, style],
        }
      : {
          accessibilityRole: role,
          accessibilityLabel,
          style: [styles.base, style],
        };

    return (
      <CardWrapper {...wrapperProps}>
        <LinearGradient
          colors={[Tokens.brand.primary[50], Tokens.brand.accent[50]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { padding: paddingValue }]}
        >
          {children}
        </LinearGradient>
      </CardWrapper>
    );
  }

  // Other variants
  const CardWrapper = onPress ? AnimatedPressable : View;
  const wrapperProps = onPress
    ? {
        onPress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        accessibilityRole: role,
        accessibilityLabel,
        style: [styles.base, styles[variant], { padding: paddingValue }, animatedStyle, style],
      }
    : {
        accessibilityRole: role,
        accessibilityLabel,
        style: [styles.base, styles[variant], { padding: paddingValue }, style],
      };

  return <CardWrapper {...wrapperProps}>{children}</CardWrapper>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Tokens.radius.lg, // 24px - Soft Premium
  },
  elevated: {
    backgroundColor: Tokens.surface.light.card,
    ...Tokens.shadows.md, // Diffuse shadow
  },
  outlined: {
    backgroundColor: Tokens.surface.light.card,
    borderWidth: 1,
    borderColor: Tokens.brand.primary[200],
  },
  flat: {
    backgroundColor: Tokens.surface.light.base,
  },
  gradient: {
    borderRadius: Tokens.radius.lg,
    overflow: "hidden",
  },
});
