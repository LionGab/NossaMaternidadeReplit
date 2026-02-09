/**
 * Nossa Maternidade - MeusCuidadosScreen
 *
 * Flo Health Minimal Design Style
 * Clean, minimal, and focused on user well-being
 *
 * Features:
 * - Daily affirmation from Nathalia Valente
 * - Quick actions (Breathe, Feelings, Rest, Community)
 * - Daily habits with visual progress
 * - NathIA quick access
 *
 * @version 2.0 - Flo Health Minimal Redesign
 * @date Janeiro 2026
 */

import React, { useMemo, useCallback, memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { MainTabScreenProps } from "@/types/navigation";
import { useAppStore, useHabitsStore, useCheckInStore, Habit } from "@/state";
import { useTheme } from "@/hooks/useTheme";
import {
  FloScreenWrapper,
  FloHeader,
  FloActionCard,
  FloSectionTitle,
  FloMotivationalCard,
} from "@/components/ui";
import { Tokens, spacing, typography, radius, shadows } from "@/theme/tokens";
import { getGreeting } from "@/utils/greeting";
import { IconName } from "@/types/icons";

// ============================================================================
// CONSTANTS
// ============================================================================

const DAILY_AFFIRMATIONS = [
  "Voce ta fazendo o melhor que pode, e isso ja e demais",
  "Nao existe mae perfeita, existe mae real e presente",
  "Cuidar de voce tambem e cuidar do seu bebe",
  "Seus sentimentos sao validos, todos eles",
  "Descansa, mae. Voce merece esse respiro",
  "Pedir ajuda e forca, nao fraqueza",
  "Cada dia e uma chance nova de se conectar",
  "Voce nao precisa dar conta de tudo",
  "Seu corpo fez um milagre. Respeita ele",
  "Nao deixa ninguem te julgar",
  "Uma respiracao de cada vez, mamae",
  "Voce e mais forte do que imagina",
];

const CARE_ACTIONS: {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  color: string;
}[] = [
  {
    id: "breathe",
    title: "Respira comigo",
    subtitle: "Exercicios de respiracao",
    icon: "leaf-outline",
    color: Tokens.brand.teal[500],
  },
  {
    id: "feelings",
    title: "Como voce esta?",
    subtitle: "Registre seus sentimentos",
    icon: "heart-outline",
    color: Tokens.brand.accent[500],
  },
  {
    id: "rest",
    title: "Momento de descanso",
    subtitle: "Sons relaxantes",
    icon: "moon-outline",
    color: Tokens.brand.secondary[500],
  },
  {
    id: "connect",
    title: "Comunidade",
    subtitle: "Conecte-se com outras maes",
    icon: "people-outline",
    color: Tokens.brand.primary[500],
  },
];

// ============================================================================
// COMPONENTS
// ============================================================================

// Habit Item Component
const HabitItem = memo(function HabitItem({
  habit,
  onToggle,
  isDark,
  index,
}: {
  habit: Habit;
  onToggle: () => void;
  isDark: boolean;
  index: number;
}) {
  const scale = useSharedValue(1);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);
    onToggle();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardBg = isDark ? "rgba(255,255,255,0.06)" : Tokens.neutral[0];
  const borderColor = habit.completed
    ? Tokens.brand.teal[400]
    : isDark
      ? "rgba(255,255,255,0.08)"
      : Tokens.neutral[100];
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];

  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 40).duration(400)}
      style={animatedStyle}
    >
      <Pressable
        onPress={handlePress}
        style={[
          styles.habitItem,
          {
            backgroundColor: habit.completed ? `${Tokens.brand.teal[500]}10` : cardBg,
            borderColor,
          },
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: habit.completed }}
        accessibilityLabel={`${habit.title}, ${habit.completed ? "completo" : "pendente"}`}
      >
        <View
          style={[
            styles.habitCheckbox,
            {
              backgroundColor: habit.completed ? Tokens.brand.teal[500] : "transparent",
              borderColor: habit.completed ? Tokens.brand.teal[500] : Tokens.neutral[400],
            },
          ]}
        >
          {habit.completed && <Ionicons name="checkmark" size={14} color={Tokens.neutral[0]} />}
        </View>
        <View style={styles.habitContent}>
          <Text
            style={[
              styles.habitName,
              {
                color: textPrimary,
                textDecorationLine: habit.completed ? "line-through" : "none",
                opacity: habit.completed ? 0.7 : 1,
              },
            ]}
          >
            {habit.title}
          </Text>
          {habit.description && (
            <Text style={[styles.habitDescription, { color: Tokens.neutral[500] }]}>
              {habit.description}
            </Text>
          )}
        </View>
        <Text style={styles.habitEmoji}>{habit.icon}</Text>
      </Pressable>
    </Animated.View>
  );
});

// Progress Card Component
const ProgressCard = memo(function ProgressCard({
  completed,
  total,
  streak,
  isDark,
}: {
  completed: number;
  total: number;
  streak: number;
  isDark: boolean;
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const getMessage = () => {
    if (percentage === 0) return { emoji: "🌱", text: "Comece seu dia!" };
    if (percentage < 50) return { emoji: "💪", text: "Continue assim!" };
    if (percentage < 100) return { emoji: "🌟", text: "Quase la!" };
    return { emoji: "🏆", text: "Voce arrasou!" };
  };

  const message = getMessage();
  const cardBg = isDark ? "rgba(255,255,255,0.06)" : Tokens.neutral[0];
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : Tokens.neutral[100];
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];

  return (
    <Animated.View entering={FadeInDown.delay(150).duration(400)}>
      <View
        style={[
          styles.progressCard,
          {
            backgroundColor: cardBg,
            borderColor,
            ...(isDark ? {} : shadows.flo.soft),
          },
        ]}
      >
        <View style={styles.progressHeader}>
          <View style={styles.progressLeft}>
            <Text style={styles.progressEmoji}>{message.emoji}</Text>
            <View>
              <Text style={[styles.progressTitle, { color: textPrimary }]}>Hoje</Text>
              <Text style={[styles.progressSubtitle, { color: Tokens.neutral[500] }]}>
                {message.text}
              </Text>
            </View>
          </View>

          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={14} color={Tokens.brand.accent[500]} />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={[styles.progressPercentage, { color: Tokens.brand.teal[500] }]}>
            {completed}/{total}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MeusCuidadosScreen({ navigation }: MainTabScreenProps<"MyCare">) {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  // Store data
  const userName = useAppStore((s) => s.user?.name);
  const habits = useHabitsStore((s) => s.habits);
  const toggleHabit = useHabitsStore((s) => s.toggleHabit);
  const checkInStreak = useCheckInStore((s) => s.streak);

  // Computed values
  const greetingData = getGreeting();
  const greeting = `${greetingData.emoji} ${greetingData.text}`;
  const completedHabits = useMemo(() => habits.filter((h) => h.completed).length, [habits]);
  const totalHabits = habits.length;

  const todayAffirmation = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return DAILY_AFFIRMATIONS[dayOfYear % DAILY_AFFIRMATIONS.length];
  }, []);

  // Handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  const handleAffirmationPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Affirmations");
  }, [navigation]);

  const handleQuickAction = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      switch (id) {
        case "breathe":
          navigation.navigate("BreathingExercise");
          break;
        case "feelings":
          navigation.navigate("DailyLog", {});
          break;
        case "rest":
          navigation.navigate("RestSounds");
          break;
        case "connect":
          navigation.navigate("Community");
          break;
      }
    },
    [navigation]
  );

  const handleToggleHabit = useCallback(
    async (habitId: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const today = new Date().toISOString().split("T")[0];
      toggleHabit(habitId, today);
    },
    [toggleHabit]
  );

  const handleNathIA = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Assistant");
  }, [navigation]);

  return (
    <FloScreenWrapper
      scrollable
      refreshing={refreshing}
      onRefresh={handleRefresh}
      testID="meus-cuidados-screen"
    >
      {/* Header */}
      <FloHeader
        greeting={greeting + (userName ? `, ${userName}` : "")}
        title="Meus Cuidados"
        variant="large"
        rightActions={[
          {
            icon: "chatbubble-ellipses",
            onPress: handleNathIA,
            label: "Falar com NathIA",
          },
        ]}
      />

      {/* Affirmation Card */}
      <Pressable onPress={handleAffirmationPress}>
        <FloMotivationalCard
          message={todayAffirmation}
          author="Nathalia Valente"
          variant="featured"
          animationDelay={100}
        />
      </Pressable>

      {/* Quick Actions */}
      <View style={styles.section}>
        <FloSectionTitle title="Seu momento" size="md" animationDelay={150} />

        {CARE_ACTIONS.map((action, index) => (
          <Animated.View
            key={action.id}
            entering={FadeInDown.delay(200 + index * 50).duration(400)}
          >
            <FloActionCard
              icon={action.icon as keyof typeof Ionicons.glyphMap}
              iconColor={action.color}
              title={action.title}
              subtitle={action.subtitle}
              onPress={() => handleQuickAction(action.id)}
              style={{ marginBottom: spacing.md }}
            />
          </Animated.View>
        ))}
      </View>

      {/* Progress Section */}
      {totalHabits > 0 && (
        <View style={styles.section}>
          <ProgressCard
            completed={completedHabits}
            total={totalHabits}
            streak={checkInStreak}
            isDark={isDark}
          />
        </View>
      )}

      {/* Habits List */}
      {totalHabits > 0 && (
        <View style={styles.section}>
          <FloSectionTitle
            title="Habitos de hoje"
            action={{
              label: "Ver todos",
              onPress: () => navigation.navigate("Habits"),
              icon: "chevron-forward",
            }}
            animationDelay={250}
          />

          <View style={styles.habitsList}>
            {habits.slice(0, 5).map((habit, index) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={() => handleToggleHabit(habit.id)}
                isDark={isDark}
                index={index}
              />
            ))}
          </View>
        </View>
      )}

      {/* NathIA CTA */}
      <View style={styles.section}>
        <FloActionCard
          icon="chatbubble-ellipses-outline"
          iconColor={Tokens.brand.accent[500]}
          title="Quer conversar?"
          subtitle="A NathIA ta aqui pra te ouvir"
          onPress={handleNathIA}
        />
      </View>

      {/* Footer */}
      <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.footer}>
        <Text style={[styles.footerText, { color: Tokens.neutral[400] }]}>
          Cuidar de voce e cuidar do seu filho
        </Text>
      </Animated.View>
    </FloScreenWrapper>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xl,
  },

  // Progress Card
  progressCard: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  progressLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  progressEmoji: {
    fontSize: 28,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
  progressSubtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${Tokens.brand.accent[500]}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  streakText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: Tokens.brand.accent[500],
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: Tokens.neutral[200],
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Tokens.brand.teal[500],
    borderRadius: radius.full,
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    minWidth: 40,
    textAlign: "right",
  },

  // Habits
  habitsList: {
    gap: spacing.sm,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  habitCheckbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
  },
  habitDescription: {
    fontSize: 12,
    fontFamily: typography.fontFamily.base,
    marginTop: 2,
  },
  habitEmoji: {
    fontSize: 20,
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
});
