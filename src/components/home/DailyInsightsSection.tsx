/**
 * DailyInsightsSection - Flo-inspired Weekly Pregnancy Insights
 *
 * Shows contextual insights about baby development
 * based on current pregnancy week.
 *
 * @version 1.0 - Flo Clean Design
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import {
  accessibility,
  cleanDesign,
  neutral,
  radius,
  shadows,
  spacing,
  typography,
} from "../../theme/tokens";
import { getWeeklyInsights, getPregnancyWeek, WeeklyInsight } from "../../utils/pregnancyData";

interface DailyInsightsSectionProps {
  /** User's due date */
  dueDate: Date;
  /** Callback when an insight is pressed */
  onInsightPress?: (insight: WeeklyInsight) => void;
}

export const DailyInsightsSection: React.FC<DailyInsightsSectionProps> = React.memo(
  ({ dueDate, onInsightPress }) => {
    const { isDark, text, surface, border } = useTheme();

    const week = useMemo(() => getPregnancyWeek(dueDate), [dueDate]);
    const insights = useMemo(() => getWeeklyInsights(week), [week]);

    const handleInsightPress = useCallback(
      async (insight: WeeklyInsight) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onInsightPress?.(insight);
      },
      [onInsightPress]
    );

    const textPrimary = isDark ? text.primary : neutral[800];
    const textSecondary = isDark ? text.secondary : neutral[700];
    const cardBg = isDark ? surface.card : cleanDesign.card.background;
    const cardBorder = isDark ? border.subtle : neutral[100];

    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: textPrimary }]}>Hoje na semana {week}</Text>

        <View style={styles.insightsList}>
          {insights.map((insight, index) => (
            <Animated.View key={insight.id} entering={FadeInUp.delay(index * 100).duration(400)}>
              <Pressable
                onPress={() => handleInsightPress(insight)}
                style={({ pressed }) => [
                  styles.insightCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.99 : 1 }],
                  },
                  isDark ? shadows.sm : shadows.flo.minimal,
                ]}
                accessibilityLabel={insight.text}
                accessibilityRole="button"
              >
                <Text style={styles.insightIcon}>{insight.icon}</Text>
                <Text style={[styles.insightText, { color: textSecondary }]} numberOfLines={2}>
                  {insight.text}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDark ? neutral[500] : neutral[400]}
                />
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </View>
    );
  }
);

DailyInsightsSection.displayName = "DailyInsightsSection";

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    fontSize: typography.titleMedium.fontSize,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
  },
  insightsList: {
    gap: spacing.sm,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    minHeight: accessibility.minTapTarget,
  },
  insightIcon: {
    fontSize: 28,
  },
  insightText: {
    flex: 1,
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: typography.fontFamily.base,
    lineHeight: typography.bodyMedium.lineHeight,
  },
});
