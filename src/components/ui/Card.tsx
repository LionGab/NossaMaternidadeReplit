import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, View, ViewProps } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { cn } from "../../utils/cn";

interface CardProps extends ViewProps {
  /**
   * Visual variant:
   * - default: Fundo card padrão com borda sutil
   * - elevated: Com sombra suave e fundo branco
   * - outlined: Borda mais visível
   * - soft: Fundo azul/rosa suave
   * - accent: Destaque com borda rosa
   * - glass: Efeito glassmorphism premium
   */
  variant?: "default" | "elevated" | "outlined" | "soft" | "accent" | "glass";
  /** Internal padding */
  padding?: "none" | "sm" | "md" | "lg";
  /** Border radius */
  radius?: "sm" | "md" | "lg" | "xl" | "full";
  /** Press handler (makes card interactive) */
  onPress?: () => void;
  /** Animate on mount */
  animated?: boolean;
  /** Animation delay in ms */
  animationDelay?: number;
  /** Accessibility label for interactive cards (required when onPress is provided) */
  accessibilityLabel?: string;
  /** Accessibility hint for screen readers */
  accessibilityHint?: string;
  /** Additional className for NativeWind styling */
  className?: string;
  /** Card content */
  children: React.ReactNode;
}

/**
 * NativeWind class mappings for Card variants
 */
const VARIANT_CLASSES: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700",
  elevated: "bg-white dark:bg-neutral-800 shadow-soft-md dark:shadow-none border-0",
  outlined: "bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600",
  soft: "bg-primary-50 dark:bg-primary-900/20 border-0",
  accent:
    "bg-accent-50 dark:bg-accent-900/10 border-[1.5px] border-accent-300 dark:border-accent-400",
  glass: "card-glass",
};

const PADDING_CLASSES: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const RADIUS_CLASSES: Record<NonNullable<CardProps["radius"]>, string> = {
  sm: "rounded-xl",
  md: "rounded-2xl",
  lg: "rounded-[20px]",
  xl: "rounded-3xl",
  full: "rounded-full",
};

/**
 * Design System Card Component - NativeWind 2025
 *
 * Unified card component with dark mode support via className.
 * Uses NativeWind for styling - no StyleSheet.create.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg">
 *   <Text>Card content</Text>
 * </Card>
 *
 * <Card variant="outlined" onPress={handlePress}>
 *   <Text>Clickable card</Text>
 * </Card>
 *
 * <Card variant="accent" className="my-4">
 *   <Text>Highlight card</Text>
 * </Card>
 *
 * <Card variant="glass" className="backdrop-blur-md">
 *   <Text>Glassmorphism card</Text>
 * </Card>
 * ```
 */
export function Card({
  variant = "default",
  padding = "md",
  radius = "lg",
  onPress,
  animated = false,
  animationDelay = 0,
  accessibilityLabel,
  accessibilityHint,
  className,
  children,
  style,
  ...props
}: CardProps) {
  const cardClassName = cn(
    // Base structure
    "overflow-hidden",
    // Variant styles
    VARIANT_CLASSES[variant],
    // Padding
    PADDING_CLASSES[padding],
    // Border radius
    RADIUS_CLASSES[radius],
    // Custom overrides
    className
  );

  const handlePress = async () => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  // Static card (no animation, no press)
  if (!animated && !onPress) {
    return (
      <View className={cardClassName} style={style} {...props}>
        {children}
      </View>
    );
  }

  // Animated card without press
  if (animated && !onPress) {
    return (
      <Animated.View
        entering={FadeInUp.delay(animationDelay).duration(500).springify()}
        className={cardClassName}
        style={style}
        {...props}
      >
        {children}
      </Animated.View>
    );
  }

  // Pressable card without animation
  if (!animated && onPress) {
    return (
      <Pressable
        onPress={handlePress}
        className="active:opacity-95"
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        <View className={cardClassName} style={style} {...props}>
          {children}
        </View>
      </Pressable>
    );
  }

  // Animated pressable card
  return (
    <Pressable
      onPress={handlePress}
      className="active:opacity-95"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <Animated.View
        entering={FadeInUp.delay(animationDelay).duration(500).springify()}
        className={cardClassName}
        style={style}
        {...props}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

/** Legacy export for backward compatibility */
export default Card;
