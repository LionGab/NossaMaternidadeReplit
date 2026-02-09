/**
 * HabitosScreenNathia - Meus Cuidados (Premium Design)
 * 
 * Design Premium 2025:
 * - Gradientes suaves e modernos
 * - Animações fluidas com Reanimated
 * - Haptics em todas as interações
 * - Cards com sombras premium
 * - Persistência real via habits-store
 */

// Icons from lucide-react-native are used instead of Ionicons
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Activity,
  BookOpen,
  Check,
  CheckCircle,
  Droplets,
  Flame,
  Heart,
  Moon,
  Plus,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Body,
  Caption,
  NathBadge,
  NathCard,
  NathProgressBar,
  Subtitle,
  Title,
} from "@/components/ui";
import { useHabits, useToggleHabit } from "@/api/hooks";
import { brand, mockupColors, nathAccent, radius, shadows, spacing, Tokens } from "@/theme/tokens";
import { MainTabScreenProps } from "@/types/navigation";

const habitsWomanImage = require("../../../assets/images/habits-woman.png");

const ICON_MAP: Record<string, React.ElementType> = {
  water: Droplets,
  restaurant: Heart,
  sparkles: Sparkles,
  sunny: Sun,
  chatbubbles: Activity,
  leaf: BookOpen,
  camera: Zap,
  "hand-left": Moon,
};

const COLOR_MAP: Record<string, { bg: string; icon: string; gradient: readonly [string, string] }> = {
  [Tokens.brand.secondary[400]]: {
    bg: brand.primary[50],
    icon: brand.primary[500],
    gradient: [brand.primary[100], brand.primary[200]] as const,
  },
  [Tokens.mood.sensitive]: {
    bg: brand.accent[50],
    icon: brand.accent[500],
    gradient: [brand.accent[100], brand.accent[200]] as const,
  },
  [Tokens.mood.energetic]: {
    bg: mockupColors.rosa.blush,
    icon: nathAccent.rose,
    gradient: [mockupColors.rosa.claro, mockupColors.rosa.suave] as const,
  },
  warning: {
    bg: Tokens.semantic.light.warningLight,
    icon: Tokens.semantic.light.warning,
    gradient: [Tokens.semantic.light.warningLight, Tokens.premium.special.gold] as const,
  },
  success: {
    bg: brand.teal[50],
    icon: brand.teal[500],
    gradient: [brand.teal[100], brand.teal[200]] as const,
  },
  [Tokens.mood.tired]: {
    bg: brand.secondary[50],
    icon: brand.secondary[500],
    gradient: [brand.secondary[100], brand.secondary[200]] as const,
  },
  [Tokens.brand.accent[500]]: {
    bg: brand.accent[50],
    icon: brand.accent[500],
    gradient: [brand.accent[100], brand.accent[200]] as const,
  },
};

const getColorConfig = (color: string) => {
  return COLOR_MAP[color] || {
    bg: brand.primary[50],
    icon: brand.primary[500],
    gradient: [brand.primary[100], brand.primary[200]] as const,
  };
};

const HabitCard = React.memo(({
  habit,
  index,
  onToggle,
}: {
  habit: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    completed: boolean;
    streak: number;
  };
  index: number;
  onToggle: () => void;
}) => {
  const scale = useSharedValue(1);
  const colorConfig = getColorConfig(habit.color);
  const Icon = ICON_MAP[habit.icon] || Sparkles;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(
      habit.completed
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium
    );
    scale.value = withSpring(0.95, { damping: 10 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);
    onToggle();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(400).springify()}
      style={styles.habitCardContainer}
    >
      <Animated.View style={animatedStyle}>
        <Pressable onPress={handlePress} accessibilityRole="button">
          <NathCard
            variant={habit.completed ? "elevated" : "outlined"}
            style={[
              styles.habitCard,
              habit.completed && {
                borderColor: brand.teal[200],
                borderWidth: 1.5,
              },
            ]}
            padding="lg"
          >
            {/* Gradient overlay for completed */}
            {habit.completed && (
              <LinearGradient
                colors={[`${brand.teal[100]}40`, `${brand.teal[50]}20`]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}

            <View style={styles.habitHeader}>
              {/* Icon */}
              <LinearGradient
                colors={colorConfig.gradient}
                style={styles.habitIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon size={22} color={colorConfig.icon} />
              </LinearGradient>

              {/* Content */}
              <View style={styles.habitContent}>
                <Body weight="bold" style={styles.habitTitle}>
                  {habit.title}
                </Body>
                <Caption style={styles.habitDescription} numberOfLines={1}>
                  {habit.description}
                </Caption>
              </View>

              {/* Status */}
              {habit.completed ? (
                <Animated.View entering={ZoomIn.duration(300)}>
                  <LinearGradient
                    colors={[brand.teal[400], brand.teal[500]]}
                    style={styles.completedBadge}
                  >
                    <CheckCircle size={16} color={Tokens.neutral[0]} />
                  </LinearGradient>
                </Animated.View>
              ) : habit.streak > 0 ? (
                <NathBadge variant="warning" size="sm">
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Flame size={10} color={nathAccent.coral} />
                    <Caption style={{ color: nathAccent.coral }}>{habit.streak}</Caption>
                  </View>
                </NathBadge>
              ) : null}
            </View>

            {/* Action hint */}
            {!habit.completed && (
              <View style={styles.actionHint}>
                <Caption style={{ color: colorConfig.icon }}>
                  Toque para completar
                </Caption>
              </View>
            )}
          </NathCard>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
});

HabitCard.displayName = "HabitCard";

type Props = MainTabScreenProps<"MyCare">;

export default function HabitosScreenNathia({ navigation: _navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { data: habits = [] } = useHabits();
  const toggleHabitMutation = useToggleHabit();

  const today = new Date().toISOString().split("T")[0];
  const completedToday = habits.filter((habit) => habit.completed).length;
  const totalHabits = habits.length;
  const progressPercent = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  const weekDays = useMemo(() => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const todayIndex = new Date().getDay();
    const now = new Date();
    
    return days.map((day, index) => {
      const isToday = index === todayIndex;
      const isPast = index < todayIndex;
      
      if (isToday) {
        return {
          day,
          isToday: true,
          completed: progressPercent === 100,
          progress: progressPercent,
        };
      }
      
      if (isPast) {
        const dayDate = new Date(now);
        dayDate.setDate(now.getDate() - (todayIndex - index));
        const dateStr = dayDate.toISOString().split("T")[0];
        
        const habitsCompletedThatDay = habits.filter(h => 
          h.completedDates.includes(dateStr)
        ).length;
        const dayProgress = totalHabits > 0 ? (habitsCompletedThatDay / totalHabits) * 100 : 0;
        
        return {
          day,
          isToday: false,
          completed: dayProgress >= 100,
          progress: dayProgress,
        };
      }
      
      return {
        day,
        isToday: false,
        completed: false,
        progress: 0,
      };
    });
  }, [progressPercent, habits, totalHabits]);

  const handleToggleHabit = useCallback(
    (habitId: string) => {
      toggleHabitMutation.mutate({ habitId, date: today });
    },
    [today, toggleHabitMutation]
  );

  const completedHabits = habits.filter((h) => h.completed);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Premium Header */}
      <LinearGradient
        colors={[Tokens.neutral[0], mockupColors.rosa.blush]}
        style={styles.header}
      >
        <Title style={styles.headerTitle}>Meus Cuidados</Title>
        <Pressable
          style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.8 : 1 }]}
          accessibilityLabel="Adicionar novo hábito"
          accessibilityRole="button"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <LinearGradient
            colors={[brand.accent[400], brand.accent[500]]}
            style={styles.addButtonGradient}
          >
            <Plus size={20} color={Tokens.neutral[0]} />
          </LinearGradient>
        </Pressable>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <LinearGradient
            colors={[mockupColors.rosa.blush, mockupColors.azul.sereno + "30"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTextArea}>
                <Title style={styles.heroTitle}>
                  {completedToday === totalHabits && totalHabits > 0
                    ? "Parabéns! 🎉"
                    : completedToday > 0
                      ? "Continue assim!"
                      : "Bom dia!"}
                </Title>
                <Body style={styles.heroSubtitle}>
                  {completedToday === totalHabits && totalHabits > 0
                    ? "Você completou todos os cuidados de hoje!"
                    : `${completedToday} de ${totalHabits} cuidados feitos`}
                </Body>

                {/* Progress Ring */}
                <View style={styles.progressContainer}>
                  <NathProgressBar
                    progress={progressPercent}
                    color="rosa"
                    style={{ flex: 1 }}
                  />
                  <Caption style={styles.progressText}>
                    {Math.round(progressPercent)}%
                  </Caption>
                </View>
              </View>
              <Image
                source={habitsWomanImage}
                style={styles.heroImage}
                contentFit="contain"
                transition={300}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Weekly Overview */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Subtitle>Esta Semana</Subtitle>
            <NathBadge variant="rosa" size="sm">
              <Flame size={10} color={brand.primary[600]} />
              <Caption style={{ color: brand.primary[600], marginLeft: 4 }}>
                {habits.filter(h => h.streak > 0).length} sequências
              </Caption>
            </NathBadge>
          </View>

          <View style={styles.weekContainer}>
            {weekDays.map((day, index) => (
              <Animated.View
                key={index}
                entering={FadeInRight.delay(index * 50).duration(300)}
                style={styles.dayColumn}
              >
                <Caption
                  weight={day.isToday ? "bold" : "regular"}
                  style={{
                    color: day.isToday ? brand.accent[500] : Tokens.neutral[500],
                    fontSize: 11,
                  }}
                >
                  {day.isToday ? "Hoje" : day.day}
                </Caption>

                <LinearGradient
                  colors={
                    day.completed || (day.isToday && progressPercent === 100)
                      ? [brand.teal[400], brand.teal[500]]
                      : day.isToday
                        ? [brand.accent[100], brand.accent[200]]
                        : [Tokens.neutral[100], Tokens.neutral[200]]
                  }
                  style={[
                    styles.dayCircle,
                    day.isToday && styles.dayTodayRing,
                  ]}
                >
                  {day.completed || (day.isToday && progressPercent === 100) ? (
                    <Check size={14} color={Tokens.neutral[0]} />
                  ) : (
                    <Caption
                      weight="bold"
                      style={{
                        color: day.isToday ? brand.accent[600] : Tokens.neutral[500],
                        fontSize: 9,
                      }}
                    >
                      {Math.round(day.progress)}%
                    </Caption>
                  )}
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Today's Habits */}
        <View style={styles.section}>
          <Subtitle style={{ marginBottom: spacing.md }}>Hoje</Subtitle>

          {habits.map((habit, index) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              index={index}
              onToggle={() => handleToggleHabit(habit.id)}
            />
          ))}
        </View>

        {/* Completed This Week */}
        {completedHabits.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
            <Subtitle style={{ marginBottom: spacing.md }}>Concluídos Hoje</Subtitle>

            <View style={styles.completedContainer}>
              {completedHabits.map((habit) => (
                <NathBadge
                  key={habit.id}
                  variant="success"
                  size="sm"
                  style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Check size={10} color={brand.teal[700]} />
                    <Caption style={{ color: brand.teal[700] }}>{habit.title}</Caption>
                  </View>
                </NathBadge>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.neutral[50],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Tokens.neutral[200],
  },
  headerTitle: {
    color: Tokens.neutral[900],
  },
  addButton: {
    borderRadius: radius.full,
    ...shadows.md,
  },
  addButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  heroCard: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.lg,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroTextArea: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroTitle: {
    fontSize: 22,
    color: Tokens.neutral[900],
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    color: Tokens.neutral[600],
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  heroImage: {
    width: 100,
    height: 120,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  progressText: {
    color: brand.accent[500],
    fontWeight: "600",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Tokens.neutral[0],
    padding: spacing.md,
    borderRadius: radius.xl,
    ...shadows.sm,
  },
  dayColumn: {
    alignItems: "center",
    gap: spacing.xs,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  dayTodayRing: {
    borderWidth: 2,
    borderColor: brand.accent[400],
  },
  habitCardContainer: {
    marginBottom: spacing.md,
  },
  habitCard: {
    overflow: "hidden",
  },
  habitHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  habitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  habitContent: {
    flex: 1,
  },
  habitTitle: {
    color: Tokens.neutral[900],
    fontSize: 15,
  },
  habitDescription: {
    color: Tokens.neutral[500],
    marginTop: 2,
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  actionHint: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Tokens.neutral[100],
    alignItems: "center",
  },
  completedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
