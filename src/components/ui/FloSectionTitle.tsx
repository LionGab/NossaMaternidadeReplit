/**
 * FloSectionTitle - Título de seção minimalista estilo Flo Health
 *
 * Design Flo Health Minimal:
 * - Tipografia clean e hierarquia clara
 * - Ação opcional à direita
 * - Espaçamento consistente
 *
 * @example
 * ```tsx
 * <FloSectionTitle
 *   title="Sua Jornada"
 *   action={{ label: "Ver todas", onPress: handleViewAll }}
 * />
 * ```
 */

import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { spacing, typography, Tokens } from "../../theme/tokens";

interface FloSectionTitleProps {
  /** Section title */
  title: string;
  /** Subtitle */
  subtitle?: string;
  /** Custom subtitle style */
  subtitleStyle?: { color?: string };
  /** Right action */
  action?: {
    label: string;
    onPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
  };
  /** Icon before title */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Icon color */
  iconColor?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Animation delay */
  animationDelay?: number;
  /** Custom style */
  style?: ViewStyle;
}

export function FloSectionTitle({
  title,
  subtitle,
  subtitleStyle,
  action,
  icon,
  iconColor,
  size = "md",
  animationDelay = 0,
  style,
}: FloSectionTitleProps) {
  const { isDark } = useTheme();

  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  // Melhor contraste: neutral[600] ao invés de [500] para AA+
  const textSecondary = isDark ? Tokens.neutral[300] : Tokens.neutral[600];
  const accentColor = iconColor || Tokens.brand.accent[500];

  const handleAction = async () => {
    if (action) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      action.onPress();
    }
  };

  // Font sizes based on size prop
  const titleSize = {
    sm: 16,
    md: 18,
    lg: 20,
  }[size];

  const marginBottom = {
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
  }[size];

  return (
    <Animated.View
      entering={FadeIn.delay(animationDelay).duration(300)}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {icon && (
          <View
            style={{
              width: 32, // 32px (era 28px) - maior presença
              height: 32,
              borderRadius: 16,
              backgroundColor: isDark ? Tokens.glass.dark.strong : `${accentColor}18`, // um pouco mais de opacidade
              alignItems: "center",
              justifyContent: "center",
              marginRight: spacing.md, // 12px (era 8px)
            }}
          >
            <Ionicons name={icon} size={18} color={accentColor} />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: titleSize,
              fontFamily: typography.fontFamily.bold,
              color: textPrimary,
              letterSpacing: -0.3,
            }}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={{
                fontSize: 14, // 14px (era 13px) - melhor legibilidade
                fontFamily: typography.fontFamily.medium,
                color: subtitleStyle?.color || textSecondary,
                marginTop: spacing.xs, // 4px (era 2px)
                lineHeight: 20, // line-height explícito
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {action && (
        <Pressable
          onPress={handleAction}
          accessibilityLabel={action.label}
          accessibilityRole="button"
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: typography.fontFamily.semibold,
              color: accentColor,
              marginRight: action.icon ? 4 : 0,
            }}
          >
            {action.label}
          </Text>
          {action.icon && <Ionicons name={action.icon} size={14} color={accentColor} />}
        </Pressable>
      )}
    </Animated.View>
  );
}

export default FloSectionTitle;
