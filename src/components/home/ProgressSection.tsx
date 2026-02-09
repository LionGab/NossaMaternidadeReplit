/**
 * ProgressSection - Ultra-Clean Progress Card (Flo + I Am inspired)
 *
 * Design Philosophy:
 * - Bordas quase invisiveis
 * - Sombras ultra-sutis
 * - Light blue theme
 * - Whitespace generoso
 *
 * @version 5.0 - Clean Redesign
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ProgressRing } from "./ProgressRing";
import { brand, neutral, typography, shadows, cleanDesign } from "../../theme/tokens";
import { shadowPresets } from "../../utils/shadow";

interface ProgressSectionProps {
  completedHabits: number;
  totalHabits: number;
  onPress: () => void;
  isDark: boolean;
}

export const ProgressSection: React.FC<ProgressSectionProps> = React.memo(
  ({ completedHabits, totalHabits, onPress, isDark }) => {
    const habitsProgress = totalHabits > 0 ? completedHabits / totalHabits : 0;
    const isComplete = completedHabits === totalHabits && totalHabits > 0;

    // Cores adaptadas - rosa accent quando completo (Flo-like celebration)
    const cardBg = isDark ? brand.primary[900] : cleanDesign.card.background;
    const textMain = isDark ? neutral[100] : neutral[800];
    const textMuted = isDark ? neutral[400] : neutral[500];
    // Rosa accent border quando completo
    const borderColor = isDark
      ? brand.primary[800]
      : isComplete
        ? brand.accent[200]
        : cleanDesign.card.border;

    const progressMessage = React.useMemo(() => {
      if (completedHabits === 0) return "Comece quando se sentir pronta";
      if (completedHabits === totalHabits) return "Parabens! Completou todos";
      return `Faltam ${totalHabits - completedHabits} para completar`;
    }, [completedHabits, totalHabits]);

    return (
      <Pressable
        onPress={onPress}
        accessibilityLabel={`Progresso do dia: ${completedHabits} de ${totalHabits} habitos`}
        accessibilityRole="button"
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: cardBg,
              borderColor: borderColor,
              borderWidth: isDark ? 0 : 1,
            },
            isDark ? styles.containerDark : styles.containerLight,
          ]}
        >
          {/* Progress Ring */}
          <View style={styles.ringContainer}>
            <ProgressRing progress={habitsProgress} size={56} strokeWidth={5} isDark={isDark} />
            <View style={styles.ringCounter}>
              <Text
                style={[styles.counterMain, { color: isComplete ? brand.accent[500] : textMain }]}
              >
                {completedHabits}
              </Text>
              <Text style={[styles.counterTotal, { color: textMuted }]}>/{totalHabits}</Text>
            </View>
          </View>

          {/* Progress Info */}
          <View style={styles.infoContainer}>
            <Text style={[styles.title, { color: textMain }]}>Seus cuidados de hoje</Text>
            <Text style={[styles.subtitle, { color: isComplete ? brand.accent[500] : textMuted }]}>
              {progressMessage}
            </Text>
          </View>

          {/* Chevron - rosa quando completo */}
          <Ionicons
            name={isComplete ? "checkmark-circle" : "chevron-forward"}
            size={isComplete ? 22 : 18}
            color={isComplete ? brand.accent[500] : isDark ? neutral[500] : brand.primary[300]}
            importantForAccessibility="no"
          />
        </View>
      </Pressable>
    );
  }
);

ProgressSection.displayName = "ProgressSection";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: cleanDesign.card.borderRadius,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  // Light mode - ultra clean
  containerLight: {
    ...shadows.flo.soft,
  },
  // Dark mode
  containerDark: {
    ...shadowPresets.md,
  },
  ringContainer: {
    width: 56,
    height: 56,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCounter: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "baseline",
  },
  counterMain: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
  },
  counterTotal: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: typography.fontFamily.medium,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: typography.fontFamily.medium,
    marginTop: 4,
    lineHeight: 18,
    opacity: 0.85,
  },
});
