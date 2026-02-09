/**
 * NathCard Component
 *
 * Cards reutilizáveis com:
 * - Suporte a dark mode via useTheme()
 * - Tokens do design system
 * - Acessibilidade para cards interativos
 * - Variantes: default, outlined, gradient, highlight, dark, elevated
 */

import { useTheme } from "@/hooks/useTheme";
import { Tokens, neutral, radius, shadows, spacing } from "@/theme/tokens";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type CardVariant = "default" | "outlined" | "gradient" | "highlight" | "dark" | "elevated";

interface NathCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  highlightColor?: string;
  gradientColors?: readonly [string, string, ...string[]];
  style?: StyleProp<ViewStyle>;
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  /** Accessibility label for interactive cards */
  accessibilityLabel?: string;
  /** Accessibility hint for interactive cards */
  accessibilityHint?: string;
  /** Test ID for e2e testing */
  testID?: string;
}

const paddingMap = {
  none: 0,
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
};

// Configuração de animação de spring
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

export const NathCard: React.FC<NathCardProps> = ({
  children,
  variant = "default",
  onPress,
  highlightColor,
  gradientColors,
  style,
  padding = "lg",
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { isDark, surface, border: borderTokens } = useTheme();
  const cardPadding = paddingMap[padding];
  const pressed = useSharedValue(0);

  // Cores adaptativas para dark mode
  const cardColors = useMemo(
    () => ({
      bg: isDark ? surface.card : neutral[0],
      border: isDark ? borderTokens.subtle : neutral[200],
      darkGradient: isDark
        ? ([Tokens.neutral[900], Tokens.neutral[950]] as const)
        : ([Tokens.neutral[800], Tokens.neutral[900]] as const),
    }),
    [isDark, surface.card, borderTokens.subtle]
  );

  const handlePressIn = () => {
    if (onPress) {
      pressed.value = withSpring(1, SPRING_CONFIG);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      pressed.value = withSpring(0, SPRING_CONFIG);
    }
  };

  // Estilo animado para cards interativos
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.98]);

    return {
      transform: [{ scale }],
    };
  }, []);

  // Estilos base do card
  const baseStyles: StyleProp<ViewStyle> = [
    styles.base,
    {
      padding: cardPadding,
      backgroundColor: cardColors.bg,
    },
    variant === "outlined" && {
      borderWidth: 1,
      borderColor: cardColors.border,
    },
    variant === "elevated" && shadows.lg,
    variant === "default" && shadows.md,
    variant === "highlight" && {
      borderWidth: 1,
      borderColor: cardColors.border,
    },
    highlightColor && {
      borderLeftColor: highlightColor,
      borderLeftWidth: 4,
    },
    style,
  ];

  // Card com gradiente customizado
  if (variant === "gradient" && gradientColors) {
    const Wrapper = onPress ? AnimatedPressable : View;

    return (
      <Wrapper
        onPress={onPress}
        onPressIn={onPress ? handlePressIn : undefined}
        onPressOut={onPress ? handlePressOut : undefined}
        style={onPress ? animatedStyle : undefined}
        accessibilityRole={onPress ? "button" : undefined}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
      >
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, shadows.md, { padding: cardPadding }, style]}
        >
          {children}
        </LinearGradient>
      </Wrapper>
    );
  }

  // Card dark (premium/destaque)
  if (variant === "dark") {
    const Wrapper = onPress ? AnimatedPressable : View;

    return (
      <Wrapper
        onPress={onPress}
        onPressIn={onPress ? handlePressIn : undefined}
        onPressOut={onPress ? handlePressOut : undefined}
        style={onPress ? animatedStyle : undefined}
        accessibilityRole={onPress ? "button" : undefined}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
      >
        <LinearGradient
          colors={cardColors.darkGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, shadows.lg, { padding: cardPadding }, style]}
        >
          {children}
        </LinearGradient>
      </Wrapper>
    );
  }

  // Cards padrão (default, outlined, elevated, highlight)
  if (onPress) {
    return (
      <AnimatedPressable
        style={[baseStyles, animatedStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View style={baseStyles} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    overflow: "hidden",
  },
});

export default NathCard;
