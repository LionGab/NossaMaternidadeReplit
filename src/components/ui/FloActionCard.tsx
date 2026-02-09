/**
 * FloActionCard - Card de ação minimalista estilo Flo Health
 *
 * Design Flo Health Minimal:
 * - Fundo branco clean
 * - Bordas muito sutis
 * - Sombra rosada suave
 * - Ícones em círculos coloridos
 * - Animação de press suave
 *
 * @example
 * ```tsx
 * <FloActionCard
 *   icon="chatbubbles"
 *   iconColor={Tokens.brand.accent[400]}
 *   title="Conversar com NathIA"
 *   subtitle="Sua companheira sempre disponível"
 *   onPress={handleChat}
 *   badge="NOVO"
 * />
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Tokens, shadows, spacing, typography } from "../../theme/tokens";
import { PressableScale } from "./PressableScale";

interface FloActionCardProps {
  /** Ionicons icon name */
  icon: keyof typeof Ionicons.glyphMap;
  /** Icon color */
  iconColor?: string;
  /** Icon background color */
  iconBgColor?: string;
  /** Card title */
  title: string;
  /** Card subtitle/description */
  subtitle?: string;
  /** Badge text (e.g., "NOVO", "Premium") */
  badge?: string;
  /** Badge color */
  badgeColor?: string;
  /** Press handler */
  onPress: () => void;
  /** Show chevron arrow */
  showChevron?: boolean;
  /** Progress value 0-1 (optional) */
  progress?: number;
  /** Right side value (e.g., "5 dias") */
  rightValue?: string;
  /** Right side icon */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  /** Disabled state */
  disabled?: boolean;
  /** Custom style */
  style?: ViewStyle;
  /** Animation delay for staggered entrance */
  animationDelay?: number;
}

export function FloActionCard({
  icon,
  iconColor,
  iconBgColor,
  title,
  subtitle,
  badge,
  badgeColor,
  onPress,
  showChevron = true,
  progress,
  rightValue,
  rightIcon,
  disabled = false,
  style,
}: FloActionCardProps) {
  const { isDark } = useTheme();

  // Default colors
  const defaultIconColor = iconColor || Tokens.brand.accent[500];
  const defaultIconBgColor =
    iconBgColor || (isDark ? Tokens.accent.dark.soft : Tokens.brand.accent[50]);
  const defaultBadgeColor = badgeColor || Tokens.brand.accent[500];

  // Card colors
  const cardBg = isDark ? Tokens.glass.dark.light : Tokens.neutral[0];
  const borderColor = isDark ? Tokens.glass.dark.medium : Tokens.neutral[100];
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      spring="snappy"
      scale={0.98}
      haptic="light"
      accessibilityLabel={title}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <View
        style={[
          {
            backgroundColor: cardBg,
            borderRadius: 16,
            borderWidth: 1,
            borderColor,
            padding: spacing.lg,
            ...(!isDark && shadows.flo.soft),
          },
          style,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Icon */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: defaultIconBgColor,
              alignItems: "center",
              justifyContent: "center",
              marginRight: spacing.lg,
            }}
          >
            <Ionicons name={icon} size={24} color={defaultIconColor} />
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: typography.fontFamily.semibold,
                color: textPrimary,
                marginBottom: subtitle ? 2 : 0,
              }}
              numberOfLines={1}
            >
              {title}
            </Text>

            {subtitle && (
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: typography.fontFamily.medium,
                  color: textSecondary,
                }}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>

          {/* Right side content */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            {badge && (
              <View
                style={{
                  backgroundColor: defaultBadgeColor,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: typography.fontFamily.bold,
                    color: Tokens.neutral[0],
                    letterSpacing: 0.5,
                  }}
                >
                  {badge}
                </Text>
              </View>
            )}

            {rightValue && (
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: typography.fontFamily.semibold,
                  color: defaultIconColor,
                }}
              >
                {rightValue}
              </Text>
            )}

            {rightIcon && <Ionicons name={rightIcon} size={18} color={textSecondary} />}

            {showChevron && <Ionicons name="chevron-forward" size={18} color={textSecondary} />}
          </View>
        </View>

        {/* Progress bar */}
        {progress !== undefined && (
          <View
            style={{
              marginTop: spacing.md,
              height: 6,
              borderRadius: 3,
              backgroundColor: isDark ? Tokens.glass.dark.strong : Tokens.neutral[100],
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${Math.min(progress * 100, 100)}%`,
                borderRadius: 3,
                backgroundColor: defaultIconColor,
              }}
            />
          </View>
        )}
      </View>
    </PressableScale>
  );
}

export default FloActionCard;
