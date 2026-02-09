/**
 * Nossa Maternidade - HabitsEnhancedScreen
 * Flo Health Minimal Design Style
 *
 * Design principles:
 * - Very subtle backgrounds (white/light pink gradient)
 * - Clean, minimal habit cards with checkboxes
 * - Cards with soft pink shadows (shadows.flo.soft)
 * - Minimal borders (1px, neutral[100])
 * - Typography: Manrope font family, clear hierarchy
 * - Subtle progress indicators
 * - Smooth animations with react-native-reanimated
 * - Dark mode support using useTheme hook
 *
 * Performance optimizations:
 * - React.memo for all sub-components
 * - useCallback for handlers
 * - useMemo for derived data
 * - StyleSheet for static styles
 * - FlashList for habits list
 */

import { useTheme } from "@/hooks/useTheme";
import { useHabits, useToggleHabit } from "@/api/hooks";
import { Habit } from "@/state";
import { Tokens, radius, shadows, spacing, streak, typography } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { memo, useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Flo Components
import { FloHeader } from "@/components/ui/FloHeader";
import { FloScreenWrapper } from "@/components/ui/FloScreenWrapper";
import { FloSectionTitle } from "@/components/ui/FloSectionTitle";
import { FloStatusCard } from "@/components/ui/FloStatusCard";

type ViewMode = "today" | "week" | "month";

// ============================================================================
// STATS ROW - Clean stat cards
// ============================================================================
interface StatsRowProps {
  completed: number;
  total: number;
  currentStreak: number;
  bestStreak: number;
}

const StatsRow = memo(function StatsRow({
  completed,
  total,
  currentStreak,
  bestStreak,
}: StatsRowProps) {
  const { isDark } = useTheme();

  const StatItem = ({
    icon,
    value,
    label,
    color,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    value: number;
    label: string;
    color: string;
  }) => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        backgroundColor: isDark ? Tokens.surface.dark.elevatedSoft : Tokens.neutral[0],
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: isDark ? Tokens.glass.dark.border : Tokens.neutral[100],
        ...(!isDark && shadows.flo.minimal),
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: isDark ? `${color}20` : `${color}15`,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.xs,
        }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontFamily: typography.fontFamily.bold,
          color: isDark ? Tokens.neutral[50] : Tokens.neutral[800],
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 11,
          fontFamily: typography.fontFamily.medium,
          color: isDark ? Tokens.neutral[400] : Tokens.neutral[500],
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(400)}
      style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xl }}
    >
      <StatItem
        icon="checkmark-circle"
        value={completed}
        label={`de ${total} hoje`}
        color={Tokens.brand.accent[500]}
      />
      <StatItem icon="flame" value={currentStreak} label="dias seguidos" color={streak.icon} />
      <StatItem
        icon="trophy"
        value={bestStreak}
        label="recorde"
        color={Tokens.brand.secondary[500]}
      />
    </Animated.View>
  );
});

// ============================================================================
// VIEW MODE TABS - Minimal segmented control
// ============================================================================
interface ViewModeTabsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const VIEW_MODES: ViewMode[] = ["today", "week", "month"];
const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  today: "Hoje",
  week: "Semana",
  month: "Mes",
};

const ViewModeTabs = memo(function ViewModeTabs({ viewMode, onViewModeChange }: ViewModeTabsProps) {
  const { isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{
        flexDirection: "row",
        backgroundColor: isDark ? Tokens.surface.dark.elevatedSoft : Tokens.neutral[100],
        borderRadius: radius.lg,
        padding: 4,
        marginBottom: spacing.xl,
      }}
    >
      {VIEW_MODES.map((mode) => (
        <Pressable
          key={mode}
          onPress={() => onViewModeChange(mode)}
          accessibilityRole="tab"
          accessibilityState={{ selected: viewMode === mode }}
          style={{
            flex: 1,
            paddingVertical: spacing.sm + 2,
            borderRadius: radius.md,
            backgroundColor:
              viewMode === mode
                ? isDark
                  ? Tokens.glass.dark.strong
                  : Tokens.neutral[0]
                : "transparent",
            ...(viewMode === mode && !isDark && shadows.flo.minimal),
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 13,
              fontFamily: typography.fontFamily.semibold,
              color:
                viewMode === mode
                  ? isDark
                    ? Tokens.neutral[50]
                    : Tokens.neutral[800]
                  : isDark
                    ? Tokens.neutral[500]
                    : Tokens.neutral[500],
            }}
          >
            {VIEW_MODE_LABELS[mode]}
          </Text>
        </Pressable>
      ))}
    </Animated.View>
  );
});

// ============================================================================
// HABIT CARD - Clean minimal design with checkbox
// ============================================================================
interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  index: number;
}

const HabitCard = memo(function HabitCard({ habit, onToggle, index }: HabitCardProps) {
  const { isDark } = useTheme();
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(habit.completed ? 1 : 0);

  const handlePress = useCallback(() => {
    // Animate card scale
    scale.value = withSequence(withSpring(0.98, { damping: 15 }), withSpring(1, { damping: 10 }));

    // Animate checkbox
    if (!habit.completed) {
      checkScale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withSpring(1, { damping: 8 })
      );
    } else {
      checkScale.value = withTiming(0, { duration: 150 });
    }

    onToggle(habit.id);
  }, [habit.id, habit.completed, onToggle, scale, checkScale]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const cardBg = isDark ? Tokens.surface.dark.elevatedSoft : Tokens.neutral[0];
  const borderColor = habit.completed
    ? isDark
      ? `${habit.color}50`
      : `${habit.color}30`
    : isDark
      ? Tokens.glass.dark.border
      : Tokens.neutral[100];

  return (
    <Animated.View entering={FadeInUp.delay(index * 50).duration(400)}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: habit.completed }}
        accessibilityLabel={`${habit.title}. ${habit.completed ? "Completo" : "Nao completo"}. ${habit.streak} dias de sequencia`}
      >
        <Animated.View
          style={[
            {
              backgroundColor: cardBg,
              borderRadius: radius.xl,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor,
              marginBottom: spacing.md,
              ...(!isDark && shadows.flo.soft),
            },
            cardAnimatedStyle,
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Icon */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: radius.xl,
                backgroundColor: habit.completed
                  ? habit.color
                  : isDark
                    ? `${habit.color}20`
                    : `${habit.color}15`,
                alignItems: "center",
                justifyContent: "center",
                marginRight: spacing.lg,
              }}
            >
              <Ionicons
                name={habit.icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={habit.completed ? Tokens.neutral[0] : habit.color}
              />
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: typography.fontFamily.semibold,
                  color: isDark ? Tokens.neutral[50] : Tokens.neutral[800],
                  marginBottom: 2,
                }}
              >
                {habit.title}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: typography.fontFamily.medium,
                  color: isDark ? Tokens.neutral[400] : Tokens.neutral[500],
                  marginBottom: habit.streak > 0 ? spacing.xs : 0,
                }}
              >
                {habit.description}
              </Text>

              {/* Streak badge */}
              {habit.streak > 0 && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: isDark ? Tokens.surface.dark.accentSoft : streak.background,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 3,
                      borderRadius: radius.full,
                      gap: 4,
                    }}
                  >
                    <Ionicons name="flame" size={12} color={streak.icon} />
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: typography.fontFamily.semibold,
                        color: isDark ? streak.icon : streak.text,
                      }}
                    >
                      {habit.streak} dias
                    </Text>
                  </View>

                  {habit.streak === habit.bestStreak && habit.streak > 3 && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: isDark
                          ? Tokens.surface.dark.secondarySoft
                          : Tokens.brand.secondary[50],
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 3,
                        borderRadius: radius.full,
                        marginLeft: spacing.xs,
                        gap: 4,
                      }}
                    >
                      <Ionicons name="trophy" size={11} color={Tokens.brand.secondary[500]} />
                      <Text
                        style={{
                          fontSize: 11,
                          fontFamily: typography.fontFamily.semibold,
                          color: isDark ? Tokens.brand.secondary[400] : Tokens.brand.secondary[700],
                        }}
                      >
                        Recorde!
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Checkbox */}
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: habit.completed ? habit.color : "transparent",
                borderWidth: 2,
                borderColor: habit.completed
                  ? habit.color
                  : isDark
                    ? Tokens.neutral[600]
                    : Tokens.neutral[300],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {habit.completed && (
                <Animated.View style={checkAnimatedStyle}>
                  <Ionicons name="checkmark" size={16} color={Tokens.neutral[0]} />
                </Animated.View>
              )}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
});

// ============================================================================
// WEEKLY HEATMAP - Minimal week view
// ============================================================================
interface WeeklyHeatmapProps {
  habits: Habit[];
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

const WeeklyHeatmap = memo(function WeeklyHeatmap({ habits }: WeeklyHeatmapProps) {
  const { isDark } = useTheme();

  const weekData = useMemo(() => {
    const today = new Date();
    const todayDay = today.getDay();

    return DAYS.map((day, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - todayDay + i);

      const completed = habits.filter((h) => {
        const dateStr = date.toISOString().split("T")[0];
        const todayStr = today.toISOString().split("T")[0];
        if (dateStr === todayStr) return h.completed;
        const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return h.streak > daysAgo;
      }).length;

      return {
        day,
        date: date.getDate(),
        completed,
        total: habits.length,
        isToday: i === todayDay,
      };
    });
  }, [habits]);

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={{
        backgroundColor: isDark ? Tokens.surface.dark.elevatedSoft : Tokens.neutral[0],
        borderRadius: radius.xl,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: isDark ? Tokens.glass.dark.border : Tokens.neutral[100],
        ...(!isDark && shadows.flo.soft),
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {weekData.map((day, index) => {
          const completion = day.total > 0 ? (day.completed / day.total) * 100 : 0;

          return (
            <View key={index} style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: typography.fontFamily.medium,
                  color: isDark ? Tokens.neutral[500] : Tokens.neutral[500],
                  marginBottom: spacing.sm,
                }}
              >
                {day.day}
              </Text>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.lg,
                  backgroundColor:
                    completion >= 100
                      ? Tokens.brand.accent[500]
                      : completion >= 50
                        ? isDark
                          ? Tokens.surface.dark.accentStrong
                          : Tokens.brand.accent[100]
                        : completion > 0
                          ? isDark
                            ? Tokens.surface.dark.accentSoft
                            : Tokens.brand.accent[50]
                          : isDark
                            ? Tokens.glass.dark.border
                            : Tokens.neutral[100],
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: day.isToday ? 2 : 0,
                  borderColor: Tokens.brand.accent[400],
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: typography.fontFamily.semibold,
                    color:
                      completion >= 100
                        ? Tokens.neutral[0]
                        : isDark
                          ? Tokens.neutral[300]
                          : Tokens.neutral[600],
                  }}
                >
                  {day.date}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: typography.fontFamily.medium,
                  color: isDark ? Tokens.neutral[500] : Tokens.neutral[400],
                  marginTop: spacing.xs,
                }}
              >
                {day.completed}/{day.total}
              </Text>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
});

// ============================================================================
// MONTHLY STATS - Category progress cards
// ============================================================================
interface MonthlyStatsProps {
  habits: Habit[];
}

const CATEGORY_LABELS: Record<string, string> = {
  "self-care": "Autocuidado",
  health: "Saude",
  mindfulness: "Paz Interior",
  connection: "Conexao",
  growth: "Crescimento",
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "self-care": "sparkles",
  health: "heart",
  mindfulness: "leaf",
  connection: "people",
  growth: "trending-up",
};

const MonthlyStats = memo(function MonthlyStats({ habits }: MonthlyStatsProps) {
  const { isDark } = useTheme();

  const categoryStats = useMemo(() => {
    const stats: Record<string, { completed: number; total: number; color: string }> = {};

    for (const habit of habits) {
      if (!stats[habit.category]) {
        stats[habit.category] = { completed: 0, total: 0, color: habit.color };
      }
      stats[habit.category].total++;
      if (habit.completed) stats[habit.category].completed++;
    }

    return Object.entries(stats);
  }, [habits]);

  return (
    <View style={{ gap: spacing.md }}>
      {categoryStats.map(([category, stats], index) => {
        const percentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

        return (
          <Animated.View
            key={category}
            entering={FadeInUp.delay(index * 80).duration(400)}
            style={{
              backgroundColor: isDark ? Tokens.surface.dark.elevatedSoft : Tokens.neutral[0],
              borderRadius: radius.xl,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: isDark ? Tokens.glass.dark.border : Tokens.neutral[100],
              ...(!isDark && shadows.flo.soft),
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: isDark ? `${stats.color}20` : `${stats.color}15`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing.md,
                }}
              >
                <Ionicons
                  name={CATEGORY_ICONS[category] || "ellipse"}
                  size={18}
                  color={stats.color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: typography.fontFamily.semibold,
                    color: isDark ? Tokens.neutral[50] : Tokens.neutral[800],
                  }}
                >
                  {CATEGORY_LABELS[category] || category}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: typography.fontFamily.semibold,
                  color: stats.color,
                }}
              >
                {stats.completed}/{stats.total}
              </Text>
            </View>

            {/* Progress bar */}
            <View
              style={{
                height: 6,
                borderRadius: 3,
                backgroundColor: isDark ? Tokens.glass.dark.strong : Tokens.neutral[100],
                overflow: "hidden",
              }}
            >
              <Animated.View
                style={{
                  height: "100%",
                  width: `${percentage}%`,
                  borderRadius: 3,
                  backgroundColor: stats.color,
                }}
              />
            </View>

            <Text
              style={{
                fontSize: 12,
                fontFamily: typography.fontFamily.medium,
                color: isDark ? Tokens.neutral[500] : Tokens.neutral[500],
                marginTop: spacing.sm,
              }}
            >
              {Math.round(percentage)}% completo este mes
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
});

// ============================================================================
// MOTIVATIONAL MESSAGE
// ============================================================================
interface MotivationalMessageProps {
  completed: number;
  total: number;
}

const MOTIVATIONAL_MESSAGES = {
  zero: { icon: "leaf" as const, text: "Comece seu dia com um pequeno passo" },
  low: { icon: "heart" as const, text: "Voce esta no caminho certo!" },
  medium: { icon: "star" as const, text: "Mais da metade! Continue assim!" },
  high: { icon: "sparkles" as const, text: "Quase la! Voce esta arrasando!" },
  complete: { icon: "trophy" as const, text: "Parabens! Voce completou tudo hoje!" },
};

const MotivationalMessage = memo(function MotivationalMessage({
  completed,
  total,
}: MotivationalMessageProps) {
  const { isDark } = useTheme();

  const getMessage = () => {
    if (total === 0) return MOTIVATIONAL_MESSAGES.zero;
    const percentage = (completed / total) * 100;
    if (percentage === 0) return MOTIVATIONAL_MESSAGES.zero;
    if (percentage < 50) return MOTIVATIONAL_MESSAGES.low;
    if (percentage < 75) return MOTIVATIONAL_MESSAGES.medium;
    if (percentage < 100) return MOTIVATIONAL_MESSAGES.high;
    return MOTIVATIONAL_MESSAGES.complete;
  };

  const message = getMessage();

  return (
    <Animated.View
      entering={FadeIn.delay(200).duration(400)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isDark ? Tokens.surface.dark.elevatedSoft : Tokens.brand.accent[50],
        borderRadius: radius.full,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
        marginBottom: spacing.xl,
        gap: spacing.sm,
      }}
    >
      <Ionicons name={message.icon} size={18} color={Tokens.brand.accent[500]} />
      <Text
        style={{
          fontSize: 13,
          fontFamily: typography.fontFamily.medium,
          color: isDark ? Tokens.neutral[200] : Tokens.neutral[700],
          flex: 1,
        }}
      >
        {message.text}
      </Text>
    </Animated.View>
  );
});

// ============================================================================
// MAIN SCREEN
// ============================================================================
export default function HabitsEnhancedScreen() {
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState<ViewMode>("today");

  const { data: habits = [] } = useHabits();
  const toggleHabitMutation = useToggleHabit();

  // Memoized calculations
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const { completedCount, totalCount, completionPercentage } = useMemo(() => {
    const completed = habits.filter((h) => h.completed).length;
    const total = habits.length;
    return {
      completedCount: completed,
      totalCount: total,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [habits]);

  const totalStreak = useMemo(
    () => habits.reduce((max, h) => Math.max(max, h.streak), 0),
    [habits]
  );

  const bestStreak = useMemo(
    () => habits.reduce((max, h) => Math.max(max, h.bestStreak), 0),
    [habits]
  );

  // Memoized handlers
  const handleToggleHabit = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleHabitMutation.mutate({ habitId: id, date: today });
    },
    [today, toggleHabitMutation]
  );

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode(mode);
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddHabit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // FlatList renderItem
  const renderHabitItem: ListRenderItem<Habit> = useCallback(
    ({ item, index }) => <HabitCard habit={item} onToggle={handleToggleHabit} index={index} />,
    [handleToggleHabit]
  );

  const keyExtractor = useCallback((item: Habit) => item.id, []);

  // Header component for FlatList
  const ListHeader = useMemo(
    () => (
      <>
        {/* Hero Status Card */}
        <FloStatusCard
          icon="heart-outline"
          title="Meus Rituais"
          description="Pequenos habitos diarios que transformam sua jornada"
          progress={completionPercentage / 100}
          variant="pink"
          animationDelay={0}
          style={{ marginBottom: spacing.xl }}
        />

        {/* Motivational Message */}
        <MotivationalMessage completed={completedCount} total={totalCount} />

        {/* Stats Row */}
        <StatsRow
          completed={completedCount}
          total={totalCount}
          currentStreak={totalStreak}
          bestStreak={bestStreak}
        />

        {/* View Mode Tabs */}
        <ViewModeTabs viewMode={viewMode} onViewModeChange={handleViewModeChange} />

        {/* Week View */}
        {viewMode === "week" && (
          <View style={{ marginBottom: spacing.xl }}>
            <FloSectionTitle title="Esta Semana" icon="calendar-outline" size="md" />
            <WeeklyHeatmap habits={habits} />
          </View>
        )}

        {/* Month View */}
        {viewMode === "month" && (
          <View style={{ marginBottom: spacing.xl }}>
            <FloSectionTitle
              title="Este Mes"
              subtitle="Progresso por categoria"
              icon="bar-chart-outline"
              size="md"
            />
            <MonthlyStats habits={habits} />
          </View>
        )}

        {/* Today's habits header */}
        {viewMode === "today" && (
          <FloSectionTitle
            title="Seus habitos de hoje"
            subtitle={`${completedCount} de ${totalCount} completos`}
            icon="sunny-outline"
            size="md"
          />
        )}
      </>
    ),
    [
      viewMode,
      handleViewModeChange,
      habits,
      completedCount,
      totalCount,
      completionPercentage,
      totalStreak,
      bestStreak,
    ]
  );

  return (
    <FloScreenWrapper scrollable={viewMode !== "today"} paddingHorizontal={spacing.xl}>
      {/* Header */}
      <FloHeader
        title="Meus Cuidados"
        showBack
        onBack={handleGoBack}
        rightActions={[
          {
            icon: "add-circle-outline",
            onPress: handleAddHabit,
            label: "Adicionar habito",
          },
        ]}
        variant="default"
      />

      {/* Content */}
      {viewMode === "today" ? (
        <FlashList
          data={habits}
          renderItem={renderHabitItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing["2xl"] }}
        />
      ) : (
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing["2xl"] }}
        >
          {ListHeader}
        </Animated.ScrollView>
      )}
    </FloScreenWrapper>
  );
}
