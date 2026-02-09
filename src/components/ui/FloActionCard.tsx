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
 *   iconColor="#FF6B8A"
 *   title="Conversar com NathIA"
 *   subtitle="Sua companheira sempre disponível"
 *   onPress={handleChat}
 *   badge="NOVO"
 * />
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Tokens, shadows, spacing, typography } from "../../theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Default colors
  const defaultIconColor = iconColor || Tokens.brand.accent[500];
  const defaultIconBgColor =
    iconBgColor || (isDark ? "rgba(255,107,138,0.15)" : Tokens.brand.accent[50]);
  const defaultBadgeColor = badgeColor || Tokens.brand.accent[500];

  // Card colors
  const cardBg = isDark ? "rgba(255,255,255,0.06)" : Tokens.neutral[0];
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : Tokens.neutral[100];
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    opacity.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    opacity.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = async () => {
    if (!disabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }]}
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
              backgroundColor: isDark ? "rgba(255,255,255,0.1)" : Tokens.neutral[100],
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
    </AnimatedPressable>
  );
}

export default FloActionCard;
