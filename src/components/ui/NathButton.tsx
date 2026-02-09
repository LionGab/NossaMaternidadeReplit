/**
 * NathButton Component
 *
 * Botão de alta qualidade com:
 * - Feedback visual via Reanimated (escala + opacidade)
 * - Design system compliance (Tokens + useThemeColors)
 * - Acessibilidade completa (role, label, state)
 * - Tap target mínimo de 44pt
 */

import React, { useCallback } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import {
  typography,
  radius,
  spacing,
  brand,
  semantic,
  neutral,
  text as textTokens,
} from "@/theme/tokens";
import { useTheme } from "@/hooks/useTheme";
import { shadowPresets } from "@/utils/shadow";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface NathButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  /** Accessibility label - required for icon-only buttons */
  accessibilityLabel?: string;
  /** Accessibility hint - describes what happens on press */
  accessibilityHint?: string;
  /** Test ID for e2e testing */
  testID?: string;
}

// Configuração de animação de spring
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

export const NathButton: React.FC<NathButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  onPress,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { text: themeText } = useTheme();
  const pressed = useSharedValue(0);

  // Cores por variante usando design system
  const variantColors = {
    primary: {
      bg: brand.accent[400], // Rosa vibrante
      bgPressed: brand.accent[500],
      text: textTokens.light.primary,
      shadow: brand.accent[400],
    },
    secondary: {
      bg: brand.primary[300], // Azul claro
      bgPressed: brand.primary[400],
      text: textTokens.light.primary,
      shadow: brand.primary[300],
    },
    ghost: {
      bg: "transparent",
      bgPressed: neutral[100],
      text: themeText.primary,
      shadow: "transparent",
    },
    destructive: {
      bg: semantic.light.errorLight,
      bgPressed: semantic.light.error,
      text: semantic.light.errorText,
      shadow: semantic.light.error,
    },
  };

  // Tamanhos com tap target mínimo de 44pt
  const sizeStyles = {
    sm: {
      minHeight: 44, // Garantir tap target
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      fontSize: 13,
      letterSpacing: 0.3,
    },
    md: {
      minHeight: 48,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing["2xl"],
      fontSize: 15,
      letterSpacing: 0.15,
    },
    lg: {
      minHeight: 56,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing["3xl"],
      fontSize: 17,
      letterSpacing: 0,
    },
  };

  const currentVariant = variantColors[variant];
  const currentSize = sizeStyles[size];

  const handlePress = useCallback(async () => {
    if (disabled || loading) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [disabled, loading, onPress]);

  const handlePressIn = useCallback(() => {
    pressed.value = withSpring(1, SPRING_CONFIG);
  }, [pressed]);

  const handlePressOut = useCallback(() => {
    pressed.value = withSpring(0, SPRING_CONFIG);
  }, [pressed]);

  // Estilo animado para feedback visual
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.97]);
    const opacity = interpolate(pressed.value, [0, 1], [1, 0.9]);

    return {
      transform: [{ scale }],
      opacity: disabled ? 0.5 : opacity,
    };
  }, [disabled]);

  // Estilo do container
  const containerStyle: ViewStyle[] = [
    styles.base,
    {
      backgroundColor: currentVariant.bg,
      minHeight: currentSize.minHeight,
      paddingVertical: currentSize.paddingVertical,
      paddingHorizontal: currentSize.paddingHorizontal,
    },
  ];

  if (fullWidth) {
    containerStyle.push(styles.fullWidth);
  }

  // Shadow apenas para variantes não-ghost e não-disabled
  if (!disabled && variant !== "ghost") {
    containerStyle.push(shadowPresets.md);
  }

  // Border para ghost variant
  if (variant === "ghost") {
    containerStyle.push({
      borderWidth: 2,
      borderColor: neutral[200],
    });
  }

  if (style) {
    containerStyle.push(style);
  }

  // Estilo do texto
  const textStyles: TextStyle[] = [
    styles.text,
    {
      color: currentVariant.text,
      fontSize: currentSize.fontSize,
      letterSpacing: currentSize.letterSpacing,
    },
  ];

  if (textStyle) {
    textStyles.push(textStyle);
  }

  // Label de acessibilidade
  const computedLabel = accessibilityLabel || (typeof children === "string" ? children : undefined);

  return (
    <AnimatedPressable
      style={[containerStyle, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={computedLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={currentVariant.text}
          accessibilityLabel="Carregando"
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" && (
            <View
              style={styles.iconLeft}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              {icon}
            </View>
          )}
          <Text style={textStyles}>{children}</Text>
          {icon && iconPosition === "right" && (
            <View
              style={styles.iconRight}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              {icon}
            </View>
          )}
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    minWidth: 100,
  },

  text: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: "700",
    textAlign: "center",
  },

  fullWidth: {
    width: "100%",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  iconLeft: {
    marginRight: spacing.xs,
  },

  iconRight: {
    marginLeft: spacing.xs,
  },
});

export default NathButton;
