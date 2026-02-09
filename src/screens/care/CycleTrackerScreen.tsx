/**
 * CycleTrackerScreen - Flo Health Minimal Redesign
 *
 * Tela de rastreamento do ciclo menstrual
 *
 * Design Flo Health Minimal:
 * - Subtle gradient background via FloScreenWrapper
 * - Clean calendar design with soft dots
 * - Pulsing cycle day indicator
 * - Soft shadows (shadows.flo.soft)
 * - Manrope typography
 * - Dark mode support
 *
 * Features:
 * - Calendar with cycle phases
 * - Current phase status card
 * - Period logging
 * - Fertility probability chart
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useCycleData, useUpdateCycle } from "@/api/hooks";
import { useTheme } from "@/hooks/useTheme";
import { FloScreenWrapper } from "@/components/ui/FloScreenWrapper";
import { FloHeader } from "@/components/ui/FloHeader";
import { Tokens, typography, spacing, shadows } from "@/theme/tokens";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface DayInfo {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isPeriod: boolean;
  isOvulation: boolean;
  isFertile: boolean;
  isPredictedPeriod: boolean;
  isToday: boolean;
}

export default function CycleTrackerScreen() {
  const { isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  // Responsive sizing
  const DAY_SIZE = useMemo(() => (screenWidth - 80) / 7, [screenWidth]);
  const GLOW_CIRCLE_SIZE = useMemo(() => Math.min(screenWidth * 0.22, 100), [screenWidth]);
  const INNER_CIRCLE_SIZE = useMemo(() => GLOW_CIRCLE_SIZE * 0.84, [GLOW_CIRCLE_SIZE]);
  const CHART_MAX_HEIGHT = useMemo(() => Math.min(screenWidth * 0.28, 120), [screenWidth]);

  // Theme colors - Flo style
  const textMain = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const cardBg = isDark ? Tokens.overlay.lightInverted : Tokens.neutral[0];
  const borderColor = isDark ? Tokens.overlay.lightInvertedMedium : Tokens.neutral[100];
  const accentColor = Tokens.brand.accent[500];

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: cycleData } = useCycleData();
  const updateCycleMutation = useUpdateCycle();

  const lastPeriodStart = cycleData?.settings?.last_period_start ?? null;
  const cycleLength = cycleData?.settings?.cycle_length ?? 28;
  const periodLength = cycleData?.settings?.period_length ?? 5;

  const today = useMemo(() => new Date(), []);

  // Pulsing animation for cycle day circle (Flo style)
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.08, { duration: Tokens.animation.duration.glow }),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withTiming(0.15, { duration: Tokens.animation.duration.glow }),
      -1,
      true
    );

    return () => {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const cycleInfo = useMemo(() => {
    if (!lastPeriodStart) return null;

    const start = new Date(lastPeriodStart);
    const now = new Date();
    const daysSincePeriod = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const currentCycleDay = (daysSincePeriod % cycleLength) + 1;

    const ovulationDay = cycleLength - 14;
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;

    const nextPeriodDate = new Date(start);
    nextPeriodDate.setDate(
      start.getDate() + cycleLength * Math.ceil(daysSincePeriod / cycleLength)
    );

    const daysUntilPeriod = Math.max(
      0,
      Math.floor((nextPeriodDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    const isInPeriod = currentCycleDay <= periodLength;
    const isInFertileWindow = currentCycleDay >= fertileStart && currentCycleDay <= fertileEnd;
    const isOvulationDay = currentCycleDay === ovulationDay;

    let phase = "Folicular";
    let phaseDescription = "Seu corpo está se preparando para a ovulação";
    let phaseColor: string = Tokens.cycleColors.fertile;

    if (isInPeriod) {
      phase = "Menstruação";
      phaseDescription = "Período menstrual";
      phaseColor = Tokens.cycleColors.menstrual;
    } else if (isOvulationDay) {
      phase = "Ovulação";
      phaseDescription = "Dia mais fértil do ciclo";
      phaseColor = Tokens.cycleColors.ovulation;
    } else if (isInFertileWindow) {
      phase = "Janela Fértil";
      phaseDescription = "Alta chance de concepção";
      phaseColor = Tokens.cycleColors.fertile;
    } else if (currentCycleDay > ovulationDay) {
      phase = "Lútea";
      phaseDescription = "Corpo se preparando para o próximo ciclo";
      phaseColor = Tokens.cycleColors.luteal;
    }

    return {
      currentCycleDay,
      daysUntilPeriod,
      phase,
      phaseDescription,
      phaseColor,
      isInPeriod,
      isInFertileWindow,
      isOvulationDay,
      ovulationDay,
      fertileStart,
      fertileEnd,
    };
  }, [lastPeriodStart, cycleLength, periodLength]);

  const createDayInfo = useCallback(
    (date: Date, isCurrentMonth: boolean): DayInfo => {
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      let isPeriod = false;
      let isOvulation = false;
      let isFertile = false;
      let isPredictedPeriod = false;

      if (lastPeriodStart) {
        const start = new Date(lastPeriodStart);
        const daysSinceStart = Math.floor(
          (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceStart >= 0) {
          const cycleDay = (daysSinceStart % cycleLength) + 1;
          const ovulationDay = cycleLength - 14;
          const fertileStart = ovulationDay - 5;
          const fertileEnd = ovulationDay + 1;

          isPeriod = cycleDay <= periodLength && daysSinceStart < cycleLength;
          isPredictedPeriod = cycleDay <= periodLength && daysSinceStart >= cycleLength;
          isOvulation = cycleDay === ovulationDay;
          isFertile = cycleDay >= fertileStart && cycleDay <= fertileEnd && !isOvulation;
        }
      }

      return {
        date,
        day: date.getDate(),
        isCurrentMonth,
        isPeriod,
        isOvulation,
        isFertile,
        isPredictedPeriod,
        isToday,
      };
    },
    [cycleLength, lastPeriodStart, periodLength, today]
  );

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: DayInfo[] = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push(createDayInfo(date, false));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(createDayInfo(date, true));
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(createDayInfo(date, false));
    }

    return days;
  }, [createDayInfo, currentMonth]);

  const goToPrevMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayPress = (dayInfo: DayInfo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(dayInfo.date);
  };

  const handleLogPeriod = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const dateToLog = selectedDate || new Date();
    updateCycleMutation.mutate({
      cycle_length: cycleLength,
      last_period_start: dateToLog.toISOString(),
      period_length: periodLength,
    });
    setSelectedDate(null);
  };

  const renderDay = (dayInfo: DayInfo, index: number) => {
    const isSelected =
      selectedDate &&
      dayInfo.date.getDate() === selectedDate.getDate() &&
      dayInfo.date.getMonth() === selectedDate.getMonth() &&
      dayInfo.date.getFullYear() === selectedDate.getFullYear();

    // Determine dot color (Flo style)
    let dotColor: string | null = null;
    if (dayInfo.isPeriod || dayInfo.isPredictedPeriod) {
      dotColor = Tokens.cycleColors.menstrual;
    } else if (dayInfo.isOvulation) {
      dotColor = Tokens.cycleColors.ovulation;
    } else if (dayInfo.isFertile) {
      dotColor = Tokens.cycleColors.fertile;
    }

    // Text color
    let textColor: string = dayInfo.isCurrentMonth
      ? isDark
        ? Tokens.neutral[200]
        : Tokens.neutral[700]
      : isDark
        ? Tokens.neutral[600]
        : Tokens.neutral[300];

    if (dayInfo.isToday) {
      textColor = accentColor;
    }

    // Border for today and selected
    const showBorder = dayInfo.isToday || isSelected;
    const dayBorderColor = isSelected ? Tokens.neutral[700] : accentColor;

    // Accessibility label
    const monthName = MONTHS[currentMonth.getMonth()];
    const year = currentMonth.getFullYear();
    const accessibilityParts = [
      `${dayInfo.day} de ${monthName} de ${year}`,
      dayInfo.isToday ? "hoje" : "",
      dayInfo.isPeriod ? "período menstrual" : "",
      dayInfo.isPredictedPeriod ? "período previsto" : "",
      dayInfo.isOvulation ? "dia de ovulação" : "",
      dayInfo.isFertile ? "janela fértil" : "",
      isSelected ? "selecionado" : "",
    ].filter(Boolean);
    const accessibilityLabel = accessibilityParts.join(", ");
    const accessibilityHint = isSelected
      ? "Toque duas vezes para desmarcar este dia"
      : "Toque duas vezes para selecionar e marcar período";

    return (
      <Pressable
        key={index}
        onPress={() => handleDayPress(dayInfo)}
        style={{
          width: DAY_SIZE,
          height: DAY_SIZE,
          alignItems: "center",
          justifyContent: "center",
        }}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{ selected: !!isSelected }}
      >
        <View
          style={{
            width: DAY_SIZE - 8,
            height: DAY_SIZE - 8,
            borderRadius: (DAY_SIZE - 8) / 2,
            backgroundColor: "transparent",
            borderWidth: showBorder ? 2 : 0,
            borderColor: dayBorderColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily:
                dayInfo.isToday || isSelected
                  ? typography.fontFamily.semibold
                  : typography.fontFamily.base,
              color: textColor,
            }}
          >
            {dayInfo.day}
          </Text>
          {/* Dot indicator (Flo style) */}
          {dotColor && (
            <View
              style={{
                position: "absolute",
                bottom: 4,
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: dotColor,
              }}
            />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <FloScreenWrapper scrollable paddingBottom={120}>
      {/* Header */}
      <FloHeader
        title="Ciclo Menstrual"
        subtitle="Acompanhe seu ciclo e fertilidade"
        variant="large"
      />

      {/* Cycle Status Card */}
      {cycleInfo && (
        <Animated.View
          entering={FadeInUp.delay(100).duration(600).springify()}
          style={{ marginBottom: spacing["2xl"] }}
        >
          <View
            style={{
              backgroundColor: cycleInfo.phaseColor,
              borderRadius: 24,
              padding: spacing["2xl"],
              ...shadows.flo.elevated,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing.lg,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: typography.fontFamily.semibold,
                    color: Tokens.overlay.semiWhite,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 4,
                  }}
                >
                  Fase Atual
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: typography.fontFamily.bold,
                    color: Tokens.neutral[0],
                  }}
                >
                  {cycleInfo.phase}
                </Text>
              </View>

              {/* Pulsing cycle day circle (Flo style) */}
              <View
                style={{
                  width: GLOW_CIRCLE_SIZE,
                  height: GLOW_CIRCLE_SIZE,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Pulsing glow ring */}
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      width: GLOW_CIRCLE_SIZE,
                      height: GLOW_CIRCLE_SIZE,
                      borderRadius: GLOW_CIRCLE_SIZE / 2,
                      backgroundColor: Tokens.overlay.shimmer,
                    },
                    pulseStyle,
                  ]}
                />
                {/* Main circle */}
                <View
                  style={{
                    width: INNER_CIRCLE_SIZE,
                    height: INNER_CIRCLE_SIZE,
                    borderRadius: INNER_CIRCLE_SIZE / 2,
                    backgroundColor: Tokens.overlay.lightInverted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: Tokens.neutral[0],
                      fontSize: Math.min(INNER_CIRCLE_SIZE * 0.33, 28),
                      fontFamily: typography.fontFamily.bold,
                    }}
                  >
                    {cycleInfo.currentCycleDay}
                  </Text>
                  <Text
                    style={{
                      color: Tokens.overlay.cardHighlight,
                      fontSize: Math.min(INNER_CIRCLE_SIZE * 0.13, 11),
                      fontFamily: typography.fontFamily.medium,
                      marginTop: -2,
                    }}
                  >
                    dia
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                fontSize: 15,
                fontFamily: typography.fontFamily.base,
                color: Tokens.overlay.cardHighlight,
                marginBottom: spacing.lg,
              }}
            >
              {cycleInfo.phaseDescription}
            </Text>

            {/* Stats cards */}
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: Tokens.overlay.lightInvertedMedium,
                  borderRadius: 16,
                  padding: spacing.lg,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: typography.fontFamily.medium,
                    color: Tokens.overlay.semiWhite,
                    marginBottom: 4,
                  }}
                >
                  Próxima menstruação
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: typography.fontFamily.bold,
                    color: Tokens.neutral[0],
                  }}
                >
                  {cycleInfo.daysUntilPeriod} dias
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: Tokens.overlay.lightInvertedMedium,
                  borderRadius: 16,
                  padding: spacing.lg,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: typography.fontFamily.medium,
                    color: Tokens.overlay.semiWhite,
                    marginBottom: 4,
                  }}
                >
                  Ciclo de
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: typography.fontFamily.bold,
                    color: Tokens.neutral[0],
                  }}
                >
                  {cycleLength} dias
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Calendar Card */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(600).springify()}
        style={{ marginBottom: spacing["2xl"] }}
      >
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 24,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: borderColor,
            ...shadows.flo.soft,
          }}
        >
          {/* Month Navigation */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: spacing.xl,
            }}
          >
            <Pressable
              onPress={goToPrevMonth}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDark ? Tokens.overlay.lightInverted : Tokens.brand.accent[50],
              }}
              accessibilityLabel="Mês anterior"
              accessibilityRole="button"
            >
              <Ionicons name="chevron-back" size={20} color={accentColor} />
            </Pressable>
            <Text
              style={{
                color: textMain,
                fontSize: 18,
                fontFamily: typography.fontFamily.semibold,
              }}
            >
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <Pressable
              onPress={goToNextMonth}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDark ? Tokens.overlay.lightInverted : Tokens.brand.accent[50],
              }}
              accessibilityLabel="Próximo mês"
              accessibilityRole="button"
            >
              <Ionicons name="chevron-forward" size={20} color={accentColor} />
            </Pressable>
          </View>

          {/* Weekday Headers */}
          <View style={{ flexDirection: "row", marginBottom: spacing.sm }}>
            {WEEKDAYS.map((day) => (
              <View key={day} style={{ width: DAY_SIZE, alignItems: "center" }}>
                <Text
                  style={{
                    color: textSecondary,
                    fontSize: 12,
                    fontFamily: typography.fontFamily.medium,
                  }}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {calendarDays.map((dayInfo, index) => renderDay(dayInfo, index))}
          </View>

          {/* Legend with icons (Flo style) */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: spacing.xl,
              paddingTop: spacing.lg,
              borderTopWidth: 1,
              borderTopColor: borderColor,
              gap: spacing.lg,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: `${Tokens.cycleColors.menstrual}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing.xs,
                }}
              >
                <Ionicons name="water" size={12} color={Tokens.cycleColors.menstrual} />
              </View>
              <Text
                style={{
                  color: textSecondary,
                  fontSize: 12,
                  fontFamily: typography.fontFamily.base,
                }}
              >
                Período
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: `${Tokens.cycleColors.ovulation}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing.xs,
                }}
              >
                <Ionicons name="sunny" size={12} color={Tokens.cycleColors.ovulation} />
              </View>
              <Text
                style={{
                  color: textSecondary,
                  fontSize: 12,
                  fontFamily: typography.fontFamily.base,
                }}
              >
                Ovulação
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: `${Tokens.cycleColors.fertile}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing.xs,
                }}
              >
                <Ionicons name="leaf" size={12} color={Tokens.cycleColors.fertile} />
              </View>
              <Text
                style={{
                  color: textSecondary,
                  fontSize: 12,
                  fontFamily: typography.fontFamily.base,
                }}
              >
                Fértil
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: accentColor,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing.xs,
                }}
              >
                <Ionicons name="today" size={10} color={accentColor} />
              </View>
              <Text
                style={{
                  color: textSecondary,
                  fontSize: 12,
                  fontFamily: typography.fontFamily.base,
                }}
              >
                Hoje
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Log Period Button */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(600).springify()}
        style={{ marginBottom: spacing["2xl"] }}
      >
        <Pressable
          onPress={handleLogPeriod}
          style={({ pressed }) => ({
            backgroundColor: accentColor,
            borderRadius: 16,
            paddingVertical: spacing.lg,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            ...shadows.flo.cta,
          })}
          accessibilityLabel={selectedDate ? "Marcar período neste dia" : "Registrar menstruação"}
          accessibilityRole="button"
        >
          <Ionicons name="add-circle" size={24} color={Tokens.neutral[0]} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: typography.fontFamily.semibold,
              color: Tokens.neutral[0],
              marginLeft: spacing.sm,
            }}
          >
            {selectedDate ? "Marcar Período Neste Dia" : "Registrar Menstruação"}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Fertility Chart */}
      {cycleInfo && (
        <Animated.View
          entering={FadeInUp.delay(400).duration(600).springify()}
          style={{ marginBottom: spacing["2xl"] }}
        >
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: spacing.xl,
              borderWidth: 1,
              borderColor: borderColor,
              ...shadows.flo.soft,
            }}
          >
            <Text
              style={{
                color: textMain,
                fontSize: 18,
                fontFamily: typography.fontFamily.semibold,
                marginBottom: spacing.lg,
              }}
            >
              Probabilidade de Gravidez
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
                height: CHART_MAX_HEIGHT + 32,
                marginBottom: spacing.lg,
              }}
            >
              {Array.from({ length: 7 }).map((_, index) => {
                const dayOffset = cycleInfo.ovulationDay - 3 + index;
                const isFertileDay =
                  dayOffset >= cycleInfo.fertileStart && dayOffset <= cycleInfo.fertileEnd;
                const isOvDay = dayOffset === cycleInfo.ovulationDay;

                let heightRatio = 0.17;
                let color: string = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

                if (isFertileDay) {
                  heightRatio = 0.33 + index * 0.125;
                  color = Tokens.brand.secondary[200];
                }
                if (isOvDay) {
                  heightRatio = 1;
                  color = Tokens.brand.secondary[500];
                }

                const barHeight = CHART_MAX_HEIGHT * heightRatio;
                const barWidth = Math.min((screenWidth - 128) / 9, 32);

                return (
                  <View key={index} style={{ alignItems: "center", flex: 1 }}>
                    <View
                      style={{
                        height: barHeight,
                        width: barWidth,
                        backgroundColor: color,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    />
                    <Text
                      style={{
                        color: textSecondary,
                        fontSize: 12,
                        fontFamily: typography.fontFamily.base,
                        marginTop: spacing.sm,
                      }}
                    >
                      {dayOffset}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: spacing.sm,
              }}
            >
              <Text
                style={{
                  color: textSecondary,
                  fontSize: 12,
                  fontFamily: typography.fontFamily.base,
                }}
              >
                Baixa
              </Text>
              <Text
                style={{
                  color: textSecondary,
                  fontSize: 12,
                  fontFamily: typography.fontFamily.base,
                }}
              >
                Média
              </Text>
              <Text
                style={{
                  color: textSecondary,
                  fontSize: 12,
                  fontFamily: typography.fontFamily.base,
                }}
              >
                Alta
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Empty State - No cycle data */}
      {!cycleInfo && (
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={{ marginTop: spacing["2xl"] }}
        >
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: spacing["3xl"],
              alignItems: "center",
              borderWidth: 1,
              borderColor: borderColor,
              ...shadows.flo.soft,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: `${accentColor}15`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: spacing.xl,
              }}
            >
              <Ionicons name="calendar-outline" size={40} color={accentColor} />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: typography.fontFamily.semibold,
                color: textMain,
                textAlign: "center",
                marginBottom: spacing.sm,
              }}
            >
              Comece a rastrear seu ciclo
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: typography.fontFamily.base,
                color: textSecondary,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Registre o início da sua menstruação para começar a acompanhar seu ciclo e receber
              previsões personalizadas.
            </Text>
          </View>
        </Animated.View>
      )}
    </FloScreenWrapper>
  );
}
