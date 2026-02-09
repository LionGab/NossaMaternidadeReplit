/**
 * QuickLogSection - Flo-inspired Quick Logging Options
 *
 * Horizontal scroll with quick actions for:
 * - Mood
 * - Symptoms
 * - Sleep
 * - Water intake
 * - Weight
 *
 * @version 1.0 - Flo Clean Design
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import { accessibility, brand, neutral, radius, spacing, typography } from "../../theme/tokens";

interface QuickLogOption {
  id: string;
  icon: string;
  label: string;
  color: string;
  bgColor: string;
  onPress?: () => void;
}

interface QuickLogSectionProps {
  onMoodPress?: () => void;
  onSymptomsPress?: () => void;
  onSleepPress?: () => void;
  onWaterPress?: () => void;
  onWeightPress?: () => void;
  onHistoryPress?: () => void;
}

const QUICK_LOG_OPTIONS: Omit<QuickLogOption, "onPress">[] = [
  {
    id: "mood",
    icon: "😊",
    label: "Humor",
    color: brand.accent[500],
    bgColor: brand.accent[50],
  },
  {
    id: "symptoms",
    icon: "📝",
    label: "Sintomas",
    color: brand.accent[400],
    bgColor: brand.accent[50],
  },
  {
    id: "sleep",
    icon: "😴",
    label: "Sono",
    color: brand.secondary[500],
    bgColor: brand.secondary[50],
  },
  {
    id: "water",
    icon: "💧",
    label: "Água",
    color: brand.primary[500],
    bgColor: brand.primary[50],
  },
  {
    id: "weight",
    icon: "⚖️",
    label: "Peso",
    color: brand.teal[500],
    bgColor: brand.teal[50],
  },
];

export const QuickLogSection: React.FC<QuickLogSectionProps> = React.memo(
  ({ onMoodPress, onSymptomsPress, onSleepPress, onWaterPress, onWeightPress, onHistoryPress }) => {
    const { isDark, text, surface, border } = useTheme();

    const getOnPress = useCallback(
      (id: string) => {
        switch (id) {
          case "mood":
            return onMoodPress;
          case "symptoms":
            return onSymptomsPress;
          case "sleep":
            return onSleepPress;
          case "water":
            return onWaterPress;
          case "weight":
            return onWeightPress;
          default:
            return undefined;
        }
      },
      [onMoodPress, onSymptomsPress, onSleepPress, onWaterPress, onWeightPress]
    );

    const handlePress = useCallback(
      async (id: string) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const handler = getOnPress(id);
        handler?.();
      },
      [getOnPress]
    );

    const handleHistoryPress = useCallback(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onHistoryPress?.();
    }, [onHistoryPress]);

    const textPrimary = isDark ? text.primary : neutral[800];
    const textSecondary = isDark ? text.secondary : neutral[600];

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textPrimary }]}>Registrar hoje</Text>
          <Pressable
            onPress={handleHistoryPress}
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            accessibilityLabel="Ver histórico de registros"
            accessibilityRole="button"
          >
            <Text style={[styles.historyLink, { color: brand.accent[500] }]}>Ver histórico</Text>
          </Pressable>
        </View>

        {/* Horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {QUICK_LOG_OPTIONS.map((option, index) => (
            <Animated.View key={option.id} entering={FadeInRight.delay(index * 50).duration(400)}>
              <Pressable
                onPress={() => handlePress(option.id)}
                style={({ pressed }) => [
                  styles.optionButton,
                  {
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
                accessibilityLabel={`Registrar ${option.label}`}
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: isDark ? surface.elevated : option.bgColor,
                    },
                  ]}
                >
                  <Text style={styles.emoji}>{option.icon}</Text>
                </View>
                <Text style={[styles.optionLabel, { color: textSecondary }]}>{option.label}</Text>
              </Pressable>
            </Animated.View>
          ))}

          {/* More button */}
          <Animated.View entering={FadeInRight.delay(QUICK_LOG_OPTIONS.length * 50).duration(400)}>
            <Pressable
              onPress={() => handlePress("more")}
              style={({ pressed }) => [
                styles.optionButton,
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
              accessibilityLabel="Ver mais opções de registro"
              accessibilityRole="button"
            >
              <View
                style={[
                  styles.iconCircle,
                  styles.moreButton,
                  {
                    backgroundColor: isDark ? surface.elevated : neutral[100],
                    borderColor: isDark ? border.subtle : neutral[300],
                  },
                ]}
              >
                <Ionicons name="add" size={24} color={isDark ? text.secondary : neutral[400]} />
              </View>
              <Text style={[styles.optionLabel, { color: textSecondary }]}>Mais</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }
);

QuickLogSection.displayName = "QuickLogSection";

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: typography.titleMedium.fontSize,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
  },
  historyLink: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "500",
    fontFamily: typography.fontFamily.medium,
  },
  scrollContent: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  optionButton: {
    alignItems: "center",
    minWidth: 72,
    gap: spacing.xs,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: accessibility.minTapTarget,
  },
  moreButton: {
    borderWidth: 2,
    borderStyle: "dashed",
  },
  emoji: {
    fontSize: 28,
  },
  optionLabel: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.fontFamily.base,
  },
});
