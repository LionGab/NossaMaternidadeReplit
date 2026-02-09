/**
 * @deprecated Use `Card` from `./Card` instead.
 *
 * Este componente está DEPRECATED e será removido em versão futura.
 * O componente Card.tsx é mais completo e inclui:
 * - Variante "accent" com borda rosa
 * - Memoização para performance
 * - Integração completa com design tokens (cardTokens)
 * - Melhor suporte a dark mode
 *
 * @example
 * // Antes (deprecated):
 * import AppCard from "./AppCard";
 * <AppCard variant="elevated" padding="lg">...</AppCard>
 *
 * // Depois (recomendado):
 * import { Card } from "./Card";
 * <Card variant="elevated" padding="lg">...</Card>
 *
 * @see Card
 */
import React from "react";
import { View, ViewProps, Pressable } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/useTheme";
import { shadowPresets } from "../../utils/shadow";

/** @deprecated Use `Card` from `./Card` instead */
interface AppCardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined" | "soft";
  color?: string;
  padding?: "none" | "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "xl";
  onPress?: () => void;
  animated?: boolean;
  animationDelay?: number;
  /** Accessibility label for interactive cards (required when onPress is provided) */
  accessibilityLabel?: string;
  /** Accessibility hint for screen readers */
  accessibilityHint?: string;
  children: React.ReactNode;
}

const PADDING_MAP = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 24,
};

const RADIUS_MAP = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

export default function AppCard({
  variant = "default",
  color,
  padding = "md",
  radius = "lg",
  onPress,
  animated = false,
  animationDelay = 0,
  accessibilityLabel,
  accessibilityHint,
  children,
  style,
  ...props
}: AppCardProps) {
  const { colors } = useTheme();

  const baseStyle = {
    backgroundColor: color || colors.background.card,
    borderRadius: RADIUS_MAP[radius],
    padding: PADDING_MAP[padding],
  };

  const variantStyle = {
    default: {},
    elevated: shadowPresets.lg,
    outlined: {
      borderWidth: 1,
      borderColor: colors.neutral[200],
    },
    soft: {
      backgroundColor: color || colors.background.tertiary,
    },
  };

  const combinedStyle = [baseStyle, variantStyle[variant], style];

  const handlePress = async () => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const content = (
    <View style={combinedStyle} {...props}>
      {children}
    </View>
  );

  if (animated) {
    const animatedContent = (
      <Animated.View
        entering={FadeInUp.delay(animationDelay).duration(500).springify()}
        style={combinedStyle}
        {...props}
      >
        {children}
      </Animated.View>
    );

    if (onPress) {
      return (
        <Pressable
          onPress={handlePress}
          style={{ opacity: 1 }}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        >
          {animatedContent}
        </Pressable>
      );
    }
    return animatedContent;
  }

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={{ opacity: 1 }}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
