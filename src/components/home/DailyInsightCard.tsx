/**
 * DailyInsightCard - Card Premium de Insight Diário
 *
 * Design premium com:
 * - Gradiente suave no background
 * - Ícone animado
 * - Tipografia elegante
 * - Sombra refinada
 *
 * @version 2.0 - Premium Redesign
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

import { brand, neutral, radius, spacing } from "@/theme/tokens";
import { shadowPresets } from "@/utils/shadow";
import type { DailyInsight } from "../../content/insights";

const COLORS = {
  white: neutral[0],
  cardBg: "#FEFEFE",
  gradientStart: "#FFF7F8",
  gradientMid: "#F8FAFF",
  gradientEnd: "#FFFFFF",
  accent: brand.accent[400],
  accentLight: brand.accent[100],
  accentSoft: brand.accent[50],
  primary: brand.primary[500],
  primaryLight: brand.primary[100],
  textPrimary: neutral[900],
  textSecondary: neutral[600],
  textMuted: neutral[500],
  border: "rgba(0,0,0,0.04)",
} as const;

type Props = {
  insight: DailyInsight;
  dayIndex: number;
  onPressCTA?: (action: NonNullable<DailyInsight["ctaAction"]>) => void;
};

function SparkleIcon({ size = 20 }: { size?: number }) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
    rotate.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 2000 }),
        withTiming(-8, { duration: 2000 })
      ),
      -1,
      true
    );
  }, [scale, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name="sparkles" size={size} color={COLORS.accent} />
    </Animated.View>
  );
}

export function DailyInsightCard({ insight, dayIndex, onPressCTA }: Props) {
  const showCTA = Boolean(insight.ctaLabel && insight.ctaAction && onPressCTA);

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.cardWrapper}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <SparkleIcon size={18} />
            </View>
            <Text style={styles.label}>Insight do Dia</Text>
          </View>

          <View style={styles.dayBadge}>
            <Text style={styles.dayText}>Dia {dayIndex}</Text>
          </View>
        </View>

        <Text style={styles.title}>{insight.title}</Text>
        <Text style={styles.message}>{insight.message}</Text>

        {showCTA && (
          <Pressable
            onPress={() => onPressCTA!(insight.ctaAction!)}
            style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel={insight.ctaLabel}
          >
            <Text style={styles.ctaText}>{insight.ctaLabel}</Text>
            <Ionicons name="arrow-forward" size={16} color={neutral[0]} />
          </Pressable>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadowPresets.md,
  },

  card: {
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.lg,
    backgroundColor: COLORS.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  dayBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: COLORS.primaryLight,
  },

  dayText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: COLORS.primary,
  },

  title: {
    fontSize: 20,
    fontFamily: "Manrope_700Bold",
    color: COLORS.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 26,
    letterSpacing: -0.3,
  },

  message: {
    fontSize: 15,
    fontFamily: "Manrope_400Regular",
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },

  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: brand.primary[500],
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
  },

  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  ctaText: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: neutral[0],
  },
});
