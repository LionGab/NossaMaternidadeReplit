/**
 * DailyProgressBar - Visual de progresso diário
 *
 * Mostra:
 * - Hábitos completados hoje (X/total)
 * - Ring visual de progresso
 * - Streak de check-ins consecutivos
 *
 * WCAG: Contraste adequado, texto descritivo para screen readers
 */

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "@/hooks/useTheme";
import { useHabitsStore, useCheckInStore } from "@/state";
import { accessibility, brand, neutral, spacing, radius, shadows } from "@/theme/tokens";
import { getHabitsMessage } from "@/utils/contextual-messages";
import type { MainTabParamList } from "@/types/navigation";

// ============================================================================
// PROGRESS RING COMPONENT
// ============================================================================

interface ProgressRingProps {
  progress: number; // 0-1
  size: number;
  strokeWidth: number;
  progressColor: string;
  backgroundColor: string;
}

function ProgressRing({
  progress,
  size,
  strokeWidth,
  progressColor,
  backgroundColor,
}: ProgressRingProps): React.JSX.Element {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Progress circle */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={progressColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        fill="transparent"
        rotation={-90}
        origin={`${center}, ${center}`}
      />
    </Svg>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const DailyProgressBar: React.FC = () => {
  const { isDark, text, surface } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  // Stores - seletores atômicos
  const habits = useHabitsStore((s) => s.habits);
  const streak = useCheckInStore((s) => s.streak);

  // Compute habits progress
  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;
  const progress = totalHabits > 0 ? completedHabits / totalHabits : 0;
  const allCompleted = completedHabits === totalHabits && totalHabits > 0;

  // Mensagem contextual não-punitiva
  const habitsMsg = getHabitsMessage(completedHabits, totalHabits);

  // Colors
  const cardBg = isDark ? surface.card : neutral[50];
  const textPrimary = isDark ? text.primary : neutral[800];
  const textSecondary = isDark ? text.secondary : neutral[500];
  const progressColor = brand.primary[500];
  const progressBg = isDark ? neutral[700] : neutral[200];

  // CTA label based on progress
  const ctaLabel = allCompleted ? "Celebrar" : completedHabits === 0 ? "Começar" : "Continuar";

  const handleCTAPress = () => {
    navigation.navigate("MyCare");
  };

  return (
    <View
      style={[styles.outerContainer, { backgroundColor: cardBg }]}
      accessibilityRole="summary"
      accessibilityLabel={`Progresso do dia: ${completedHabits} de ${totalHabits} hábitos completados. Streak de ${streak} dias.`}
    >
      <View style={styles.container}>
        {/* Habits Progress Section */}
        <View style={styles.section}>
          <View style={styles.ringContainer}>
            <ProgressRing
              progress={progress}
              size={56}
              strokeWidth={6}
              progressColor={progressColor}
              backgroundColor={progressBg}
            />
            <View style={styles.ringCenter}>
              <Text style={[styles.ringText, { color: textPrimary }]}>
                {completedHabits}/{totalHabits}
              </Text>
            </View>
          </View>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: textPrimary }]}>{habitsMsg.title}</Text>
            <Text style={[styles.sublabel, { color: textSecondary }]}>{habitsMsg.subtitle}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: isDark ? neutral[700] : neutral[200] }]} />

        {/* Streak Section */}
        <View style={styles.section}>
          <View
            style={[
              styles.streakBadge,
              { backgroundColor: isDark ? brand.accent[800] : brand.accent[100] },
            ]}
          >
            <Ionicons name="flame" size={24} color={brand.accent[500]} />
          </View>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: textPrimary }]}>
              {streak === 0 ? "Sequência" : `${streak} ${streak === 1 ? "dia" : "dias"}`}
            </Text>
            <Text style={[styles.sublabel, { color: textSecondary }]}>
              {streak === 0
                ? "Hoje é o dia 1!"
                : `Você está há ${streak} ${streak === 1 ? "dia" : "dias"} cuidando de si`}
            </Text>
          </View>
        </View>
      </View>

      {/* CTA Button */}
      <Pressable
        onPress={handleCTAPress}
        style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
        accessibilityRole="button"
        accessibilityLabel={ctaLabel}
      >
        <Text style={styles.ctaText}>{ctaLabel}</Text>
        <Ionicons name="arrow-forward" size={14} color={neutral[0]} />
      </Pressable>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  ringContainer: {
    position: "relative",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  sublabel: {
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: spacing.md,
  },
  streakBadge: {
    width: accessibility.minTapTarget,
    height: accessibility.minTapTarget,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: brand.primary[500],
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    marginTop: spacing.md,
    alignSelf: "flex-end",
  },
  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: neutral[0],
  },
});

export default DailyProgressBar;
