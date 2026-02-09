/**
 * FloStatusCard - Card de status minimalista estilo Flo Health
 *
 * Design Flo Health Minimal:
 * - Fundo com gradiente muito sutil
 * - Ícone proeminente
 * - Informações claras e organizadas
 * - Sombra rosada delicada
 *
 * @example
 * ```tsx
 * <FloStatusCard
 *   icon="heart-outline"
 *   title="Como você está?"
 *   description="Ainda não registrou hoje"
 *   badge="5 dias"
 *   badgeIcon="flame"
 *   onPress={handleCheckIn}
 * />
 * ```
 */

import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInUp,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { spacing, typography, Tokens, shadows } from "../../theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FloStatusCardProps {
  /** Ionicons icon name */
  icon: keyof typeof Ionicons.glyphMap;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Badge text (e.g., "5 dias") */
  badge?: string;
  /** Badge icon */
  badgeIcon?: keyof typeof Ionicons.glyphMap;
  /** Progress value 0-1 */
  progress?: number;
  /** Press handler */
  onPress?: () => void;
  /** Card color variant */
  variant?: "pink" | "purple" | "blue" | "teal";
  /** Show as completed */
  completed?: boolean;
  /** Animation delay */
  animationDelay?: number;
  /** Custom style */
  style?: ViewStyle;
}

export function FloStatusCard({
  icon,
  title,
  description,
  badge,
  badgeIcon,
  progress,
  onPress,
  variant = "pink",
  completed = false,
  animationDelay = 0,
  style,
}: FloStatusCardProps) {
  const { isDark } = useTheme();

  const scale = useSharedValue(1);

  // Variant colors - very subtle gradients
  const variantColors = {
    pink: {
      gradient: isDark
        ? ([Tokens.overlay.accentLight, Tokens.overlay.accentVeryLight] as const)
        : ([Tokens.brand.accent[50], Tokens.neutral[0]] as const),
      icon: Tokens.brand.accent[500],
      iconBg: isDark ? Tokens.overlay.accentLight : Tokens.brand.accent[50],
      badge: Tokens.brand.accent[500],
    },
    purple: {
      gradient: isDark
        ? ([Tokens.overlay.secondaryLight, Tokens.overlay.accentVeryLight] as const)
        : ([Tokens.brand.secondary[50], Tokens.neutral[0]] as const),
      icon: Tokens.brand.secondary[500],
      iconBg: isDark ? Tokens.overlay.secondaryLight : Tokens.brand.secondary[50],
      badge: Tokens.brand.secondary[500],
    },
    blue: {
      gradient: isDark
        ? ([Tokens.overlay.lightInverted, Tokens.overlay.accentVeryLight] as const)
        : ([Tokens.brand.primary[50], Tokens.neutral[0]] as const),
      icon: Tokens.brand.primary[500],
      iconBg: isDark ? Tokens.overlay.lightInverted : Tokens.brand.primary[50],
      badge: Tokens.brand.primary[500],
    },
    teal: {
      gradient: isDark
        ? ([Tokens.overlay.lightInverted, Tokens.overlay.accentVeryLight] as const)
        : ([Tokens.brand.teal[50], Tokens.neutral[0]] as const),
      icon: Tokens.brand.teal[500],
      iconBg: isDark ? Tokens.overlay.lightInverted : Tokens.brand.teal[50],
      badge: Tokens.brand.teal[500],
    },
  };

  const colors = variantColors[variant];
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const borderColor = isDark ? Tokens.overlay.lightInverted : Tokens.overlay.light;

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const handlePress = async () => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardContent = (
    <LinearGradient
      colors={colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          borderRadius: 20, // 20px (era 16px) - mais suave
          borderWidth: 1,
          borderColor,
          padding: spacing.xl, // 20px (era 16px) - mais respiração
          ...(!isDark && shadows.flo.soft), // sombra mais pronunciada
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        {/* Content */}
        <View style={{ flex: 1, paddingRight: spacing.md }}>
          <Text
            style={{
              fontSize: 17, // 17px (era 16px) - mais destaque
              fontFamily: typography.fontFamily.semibold,
              color: textPrimary,
              marginBottom: spacing.xs, // 4px - consistente
              letterSpacing: -0.2, // tracking mais apertado para títulos
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14, // 14px (era 13px) - melhor legibilidade
              fontFamily: typography.fontFamily.medium,
              color: textSecondary,
              lineHeight: 21, // 1.5x line-height
            }}
          >
            {description}
          </Text>
        </View>

        {/* Icon - mais proeminente */}
        <View
          style={{
            width: 48, // 48px (era 44px) - maior
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.iconBg,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: spacing.md,
          }}
        >
          <Ionicons
            name={completed ? "checkmark-circle" : icon}
            size={24} // 24px (era 22px)
            color={colors.icon}
          />
        </View>
      </View>

      {/* Progress bar - mais refinado */}
      {progress !== undefined && (
        <View
          style={{
            marginTop: spacing.lg, // 16px (era 12px)
            height: 8, // 8px (era 6px) - mais visível
            borderRadius: 4,
            backgroundColor: isDark ? Tokens.overlay.lightInverted : Tokens.overlay.light,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${Math.min(progress * 100, 100)}%`,
              borderRadius: 4,
              backgroundColor: colors.icon,
            }}
          />
        </View>
      )}

      {/* Badge - mais elegante */}
      {badge && (
        <View
          style={{
            position: "absolute",
            top: spacing.lg, // 16px (era 12px)
            right: spacing.lg, // 16px (era 12px)
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.badge,
            paddingHorizontal: spacing.md, // 12px (era 8px)
            paddingVertical: 6, // 6px (era 4px)
            borderRadius: 10, // 10px (era 8px)
            gap: 4,
          }}
        >
          {badgeIcon && <Ionicons name={badgeIcon} size={12} color={Tokens.neutral[0]} />}
          <Text
            style={{
              fontSize: 11,
              fontFamily: typography.fontFamily.bold,
              color: Tokens.neutral[0],
              letterSpacing: 0.3,
            }}
          >
            {badge}
          </Text>
        </View>
      )}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Animated.View entering={FadeInUp.delay(animationDelay).duration(400)}>
        <AnimatedPressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={title}
          style={animatedStyle}
        >
          {cardContent}
        </AnimatedPressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.delay(animationDelay).duration(400)}>
      {cardContent}
    </Animated.View>
  );
}

export default FloStatusCard;
