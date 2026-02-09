/**
 * AnimatedBadge - Badge Premium com Animações
 *
 * Badges animados para streaks, conquistas e celebrações.
 * Combina feedback visual + háptico para máximo impacto.
 *
 * Tipos:
 * - streak: Badge de sequência (dias consecutivos)
 * - achievement: Badge de conquista desbloqueada
 * - milestone: Badge de marco atingido
 * - notification: Badge de notificação com pulse
 *
 * @example
 * ```tsx
 * // Streak badge
 * <AnimatedBadge type="streak" value={7} />
 *
 * // Achievement unlock
 * <AnimatedBadge type="achievement" label="Primeira Semana" icon="trophy" />
 *
 * // Milestone celebration
 * <AnimatedBadge type="milestone" value={100} label="100 dias!" celebrate />
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  withRepeat,
  interpolate,
  Easing,
  runOnJS,
  cancelAnimation,
} from "react-native-reanimated";
import { useOptimizedAnimation } from "../../hooks/useOptimizedAnimation";
import { haptic } from "../../utils/haptics";
import { SPRING, TIMING } from "../../utils/animations";
import {
  brand,
  streak as streakTokens,
  radius,
  spacing,
  typography,
  semantic,
} from "../../theme/tokens";
import { useTheme } from "../../hooks/useTheme";

// ===========================================
// TYPES
// ===========================================

type BadgeType = "streak" | "achievement" | "milestone" | "notification";
type BadgeSize = "sm" | "md" | "lg";

interface AnimatedBadgeProps {
  /** Badge type determines visual style and animation */
  type: BadgeType;
  /** Numeric value (for streak/milestone) */
  value?: number;
  /** Text label */
  label?: string;
  /** Icon name from Ionicons */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Size variant */
  size?: BadgeSize;
  /** Trigger celebration animation */
  celebrate?: boolean;
  /** Show entrance animation */
  animated?: boolean;
  /** Animation delay in ms */
  delay?: number;
  /** Custom color override */
  color?: string;
  /** Show pulse animation (for notifications) */
  pulse?: boolean;
  /** Additional style */
  style?: ViewStyle;
  /** Accessibility label override */
  accessibilityLabel?: string;
}

// ===========================================
// SIZE CONFIGS
// ===========================================

const SIZES = {
  sm: {
    height: 28,
    paddingH: spacing.sm + 2,
    iconSize: 14,
    fontSize: 12,
    gap: 4,
  },
  md: {
    height: 36,
    paddingH: spacing.md,
    iconSize: 18,
    fontSize: 14,
    gap: 6,
  },
  lg: {
    height: 48,
    paddingH: spacing.lg,
    iconSize: 22,
    fontSize: 16,
    gap: 8,
  },
} as const;

// ===========================================
// ANIMATED BADGE COMPONENT
// ===========================================

export function AnimatedBadge({
  type,
  value,
  label,
  icon,
  size = "md",
  celebrate = false,
  animated = true,
  delay = 0,
  color,
  pulse = false,
  style,
  accessibilityLabel,
}: AnimatedBadgeProps) {
  const { isDark } = useTheme();
  const sizeConfig = SIZES[size];
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

  // Animation values
  const scale = useSharedValue(animated ? 0 : 1);
  const opacity = useSharedValue(animated ? 0 : 1);
  const rotate = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  // Trigger haptic on celebration
  const triggerCelebration = useCallback(() => {
    haptic.success();
  }, []);

  // Entrance animation
  useEffect(() => {
    if (animated) {
      scale.value = withDelay(delay, withSpring(1, SPRING.bouncy));
      opacity.value = withDelay(delay, withTiming(1, TIMING.normal));
    }
  }, [animated, delay, scale, opacity]);

  // Celebration animation
  useEffect(() => {
    if (celebrate) {
      // Pop effect
      scale.value = withSequence(withSpring(1.3, SPRING.bouncy), withSpring(1, SPRING.gentle));

      // Glow pulse
      glowOpacity.value = withSequence(
        withTiming(0.8, { duration: 200 }),
        withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) })
      );

      // Slight rotation for playfulness
      rotate.value = withSequence(
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 100 }),
        withTiming(-3, { duration: 80 }),
        withTiming(0, { duration: 100 })
      );

      // Trigger haptic
      runOnJS(triggerCelebration)();
    }
  }, [celebrate, scale, glowOpacity, rotate, triggerCelebration]);

  // Pulse animation for notifications
  useEffect(() => {
    if (pulse && shouldAnimate && isActive) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        maxIterations,
        false
      );
    } else {
      cancelAnimation(pulseScale);
      pulseScale.value = 1;
    }
    return () => cancelAnimation(pulseScale);
  }, [pulse, pulseScale, shouldAnimate, isActive, maxIterations]);

  // Get colors based on type
  const getColors = useCallback(() => {
    if (color) {
      return {
        bg: `${color}20`,
        border: color,
        text: color,
        icon: color,
        glow: color,
      };
    }

    switch (type) {
      case "streak":
        return {
          bg: isDark ? semantic.dark.warningLight : streakTokens.background,
          border: streakTokens.icon,
          text: isDark ? semantic.dark.warning : streakTokens.text,
          icon: streakTokens.icon,
          glow: streakTokens.icon,
        };
      case "achievement":
        return {
          bg: isDark ? brand.accent[900] : brand.accent[50],
          border: brand.accent[400],
          text: isDark ? brand.accent[300] : brand.accent[700],
          icon: brand.accent[500],
          glow: brand.accent[400],
        };
      case "milestone":
        return {
          bg: isDark ? brand.teal[900] : brand.teal[50],
          border: brand.teal[400],
          text: isDark ? brand.teal[300] : brand.teal[700],
          icon: brand.teal[500],
          glow: brand.teal[400],
        };
      case "notification":
        return {
          bg: isDark ? semantic.dark.errorLight : semantic.light.errorLight,
          border: semantic.light.error,
          text: isDark ? semantic.dark.errorText : semantic.light.errorText,
          icon: semantic.light.error,
          glow: semantic.light.error,
        };
      default:
        return {
          bg: isDark ? brand.primary[900] : brand.primary[50],
          border: brand.primary[400],
          text: isDark ? brand.primary[300] : brand.primary[700],
          icon: brand.primary[500],
          glow: brand.primary[400],
        };
    }
  }, [type, color, isDark]);

  const colors = getColors();

  // Get icon for type
  const getDefaultIcon = useCallback((): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "streak":
        return "flame";
      case "achievement":
        return "trophy";
      case "milestone":
        return "star";
      case "notification":
        return "notifications";
      default:
        return "checkmark-circle";
    }
  }, [type]);

  const displayIcon = icon || getDefaultIcon();

  // Format display text
  const getDisplayText = useCallback(() => {
    if (label) return label;
    if (value !== undefined) {
      if (type === "streak") return `${value} dias`;
      return value.toString();
    }
    return "";
  }, [label, value, type]);

  const displayText = getDisplayText();

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * pulseScale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: interpolate(glowOpacity.value, [0, 0.8], [0.9, 1.2]) }],
  }));

  // Accessibility
  const a11yLabel =
    accessibilityLabel ||
    (type === "streak"
      ? `Sequência de ${value} dias`
      : type === "achievement"
        ? `Conquista: ${label || "desbloqueada"}`
        : type === "milestone"
          ? `Marco: ${displayText}`
          : `Notificação: ${displayText}`);

  return (
    <Animated.View
      style={[styles.container, containerStyle, style]}
      accessibilityLabel={a11yLabel}
      accessibilityRole="text"
    >
      {/* Glow effect layer */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: colors.glow,
            borderRadius: radius.full,
          },
          glowStyle,
        ]}
        pointerEvents="none"
      />

      {/* Badge content */}
      <View
        style={[
          styles.badge,
          {
            height: sizeConfig.height,
            paddingHorizontal: sizeConfig.paddingH,
            backgroundColor: colors.bg,
            borderColor: colors.border,
            gap: sizeConfig.gap,
          },
        ]}
      >
        <Ionicons name={displayIcon} size={sizeConfig.iconSize} color={colors.icon} />
        {displayText && (
          <Text
            style={[
              styles.text,
              {
                fontSize: sizeConfig.fontSize,
                color: colors.text,
              },
            ]}
          >
            {displayText}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

// ===========================================
// STREAK BADGE SHORTHAND
// ===========================================

interface StreakBadgeProps {
  days: number;
  size?: BadgeSize;
  animate?: boolean;
  style?: ViewStyle;
}

/**
 * StreakBadge - Badge otimizado para exibir sequência de dias
 *
 * @example
 * ```tsx
 * <StreakBadge days={7} />
 * <StreakBadge days={30} animate />
 * ```
 */
export function StreakBadge({ days, size = "md", animate = true, style }: StreakBadgeProps) {
  // Celebrate milestones
  const isMilestone = [7, 14, 21, 30, 60, 90, 100, 365].includes(days);

  return (
    <AnimatedBadge
      type="streak"
      value={days}
      size={size}
      animated={animate}
      celebrate={isMilestone}
      style={style}
    />
  );
}

// ===========================================
// ACHIEVEMENT BADGE SHORTHAND
// ===========================================

interface AchievementBadgeProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  unlocked?: boolean;
  size?: BadgeSize;
  style?: ViewStyle;
}

/**
 * AchievementBadge - Badge para conquistas desbloqueadas
 *
 * @example
 * ```tsx
 * <AchievementBadge title="Primeira Semana" unlocked />
 * <AchievementBadge title="Super Mãe" icon="heart" />
 * ```
 */
export function AchievementBadge({
  title,
  icon = "trophy",
  unlocked = true,
  size = "md",
  style,
}: AchievementBadgeProps) {
  const combinedStyle: ViewStyle = {
    ...(unlocked ? {} : styles.locked),
    ...style,
  };

  return (
    <AnimatedBadge
      type="achievement"
      label={title}
      icon={icon}
      size={size}
      animated
      celebrate={unlocked}
      style={combinedStyle}
    />
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "flex-start",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  text: {
    fontFamily: typography.fontFamily.semibold,
    fontWeight: "600",
  },
  locked: {
    opacity: 0.5,
  },
});

export default AnimatedBadge;
