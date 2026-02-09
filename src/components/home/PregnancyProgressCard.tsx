/**
 * PregnancyProgressCard - Flo-inspired Pregnancy Progress Display
 *
 * Shows:
 * - Circular progress with baby emoji in center
 * - Week number and trimester
 * - Baby size comparison
 * - Days remaining countdown
 *
 * @version 1.0 - Flo Clean Design
 */

import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withDelay,
  FadeIn,
} from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import {
  brand,
  cleanDesign,
  neutral,
  radius,
  shadows,
  spacing,
  typography,
} from "../../theme/tokens";
import {
  getBabySize,
  getDaysRemaining,
  getPregnancyDayOfWeek,
  getPregnancyProgress,
  getPregnancyWeek,
  getTrimester,
  formatDueDate,
} from "../../utils/pregnancyData";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PregnancyProgressCardProps {
  /** User's due date */
  dueDate: Date;
  /** Animation delay in ms */
  animationDelay?: number;
}

export const PregnancyProgressCard: React.FC<PregnancyProgressCardProps> = React.memo(
  ({ dueDate, animationDelay = 200 }) => {
    const { isDark, text, surface, border } = useTheme();

    // Calculate pregnancy data
    const pregnancyData = useMemo(() => {
      const week = getPregnancyWeek(dueDate);
      return {
        week,
        dayOfWeek: getPregnancyDayOfWeek(dueDate),
        trimester: getTrimester(week),
        daysRemaining: getDaysRemaining(dueDate),
        babySize: getBabySize(week),
        progress: getPregnancyProgress(week),
        formattedDueDate: formatDueDate(dueDate),
      };
    }, [dueDate]);

    // Circle dimensions
    const size = 120;
    const strokeWidth = 8;
    const circleRadius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * circleRadius;

    // Animated progress
    const animatedProgress = useSharedValue(0);

    React.useEffect(() => {
      animatedProgress.value = withDelay(
        animationDelay,
        withSpring(pregnancyData.progress, {
          damping: 15,
          stiffness: 100,
        })
      );
    }, [pregnancyData.progress, animatedProgress, animationDelay]);

    const animatedCircleProps = useAnimatedProps(() => ({
      strokeDashoffset: circumference * (1 - animatedProgress.value),
    }));

    // Theme-aware colors
    const cardBg = isDark ? surface.card : cleanDesign.card.background;
    const cardBorder = isDark ? border.subtle : cleanDesign.card.border;
    const textPrimary = isDark ? text.primary : neutral[800];
    const textSecondary = isDark ? text.secondary : neutral[500];

    return (
      <Animated.View
        entering={FadeIn.delay(100).duration(500)}
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
          },
          isDark ? shadows.md : shadows.flo.soft,
        ]}
      >
        <View style={styles.content}>
          {/* Circular Progress */}
          <View style={styles.progressContainer}>
            <Svg width={size} height={size} style={styles.svg}>
              <Defs>
                <SvgGradient id="pregnancyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor={brand.accent[400]} />
                  <Stop offset="100%" stopColor={brand.accent[500]} />
                </SvgGradient>
              </Defs>
              {/* Background circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={circleRadius}
                stroke={isDark ? neutral[700] : brand.accent[100]}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress circle */}
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={circleRadius}
                stroke="url(#pregnancyGradient)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeLinecap="round"
                animatedProps={animatedCircleProps}
              />
            </Svg>
            {/* Baby emoji in center */}
            <View style={styles.emojiContainer}>
              <Text style={styles.babyEmoji}>{pregnancyData.babySize.fruit}</Text>
            </View>
          </View>

          {/* Week Info */}
          <View style={styles.infoContainer}>
            <View style={styles.weekRow}>
              <Text style={[styles.weekNumber, { color: textPrimary }]}>{pregnancyData.week}</Text>
              <Text style={[styles.weekLabel, { color: textSecondary }]}>semanas</Text>
            </View>

            <Text style={[styles.trimesterText, { color: brand.accent[500] }]}>
              {pregnancyData.trimester}º Trimestre • Dia {pregnancyData.dayOfWeek}
            </Text>

            {/* Baby size comparison */}
            <View
              style={[
                styles.babySizeBox,
                { backgroundColor: isDark ? surface.elevated : brand.accent[50] },
              ]}
            >
              <Text style={[styles.babySizeLabel, { color: textSecondary }]}>
                Seu bebê tem o tamanho de uma
              </Text>
              <Text style={[styles.babySizeName, { color: textPrimary }]}>
                {pregnancyData.babySize.name} ({pregnancyData.babySize.length})
              </Text>
            </View>
          </View>
        </View>

        {/* Days countdown */}
        <View
          style={[styles.countdownRow, { borderTopColor: isDark ? border.subtle : neutral[100] }]}
        >
          <View>
            <Text style={[styles.countdownLabel, { color: textSecondary }]}>Data prevista</Text>
            <Text style={[styles.countdownValue, { color: textPrimary }]}>
              {pregnancyData.formattedDueDate}
            </Text>
          </View>
          <View style={styles.countdownRight}>
            <Text style={[styles.countdownLabel, { color: textSecondary }]}>Faltam</Text>
            <Text style={[styles.countdownDays, { color: brand.accent[500] }]}>
              {pregnancyData.daysRemaining} dias
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }
);

PregnancyProgressCard.displayName = "PregnancyProgressCard";

const styles = StyleSheet.create({
  card: {
    borderRadius: radius["3xl"],
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.xl,
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    transform: [{ rotate: "-90deg" }],
  },
  emojiContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  babyEmoji: {
    fontSize: 40,
  },
  infoContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  weekRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  weekNumber: {
    fontSize: 40,
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -1,
  },
  weekLabel: {
    fontSize: typography.bodyMedium.fontSize,
    fontFamily: typography.fontFamily.base,
  },
  trimesterText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "500",
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.sm,
  },
  babySizeBox: {
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  babySizeLabel: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.fontFamily.base,
  },
  babySizeName: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
  },
  countdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
  },
  countdownRight: {
    alignItems: "flex-end",
  },
  countdownLabel: {
    fontSize: typography.caption.fontSize,
    fontFamily: typography.fontFamily.base,
  },
  countdownValue: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
  },
  countdownDays: {
    fontSize: typography.bodyMedium.fontSize,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
  },
});
