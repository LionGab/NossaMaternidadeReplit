/**
 * Nossa Maternidade - MeusCuidadosPremiumScreen
 *
 * Flo Health Minimal Premium Design Style
 * Feature-rich wellness screen with tracking and insights
 *
 * Features:
 * - Premium header with avatar and streak
 * - Mood tracker with visual feedback
 * - Quick trackers (sleep, water, exercise)
 * - Weekly progress chart
 * - Daily affirmation
 * - Achievements system
 * - Personalized tips
 * - Habits tracking
 *
 * @version 2.0 - Flo Health Minimal Redesign
 * @date Janeiro 2026
 */

import React, { useMemo, useCallback, memo, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";

import { MainTabScreenProps } from "@/types/navigation";
import { useAppStore, useHabitsStore, useCheckInStore, Habit } from "@/state/store";
import { useTheme } from "@/hooks/useTheme";
import {
  FloScreenWrapper,
  FloHeader,
  FloActionCard,
  FloSectionTitle,
  FloMotivationalCard,
} from "@/components/ui";
import { Tokens, spacing, typography, radius, shadows, surface } from "@/theme/tokens";
import { getPregnancyInfo } from "@/utils/formatters";
import { getGreeting } from "@/utils/greeting";
import { IconName } from "@/types/icons";
import { PregnancyStage } from "@/types/navigation";

// ============================================================================
// TYPES
// ============================================================================

type MoodType = "great" | "good" | "okay" | "low" | "bad" | null;
type TrackerType = "sleep" | "water" | "exercise";

interface TrackerData {
  sleep: number;
  water: number;
  exercise: number;
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MOODS: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: "great", emoji: "😊", label: "Otimo", color: Tokens.brand.teal[500] },
  { type: "good", emoji: "🙂", label: "Bem", color: Tokens.brand.primary[500] },
  { type: "okay", emoji: "😐", label: "Ok", color: Tokens.brand.secondary[500] },
  { type: "low", emoji: "😔", label: "Baixo", color: Tokens.brand.accent[400] },
  { type: "bad", emoji: "😢", label: "Dificil", color: Tokens.brand.accent[600] },
];

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
    title: "Sentimentos",
    subtitle: "Registre como se sente",
    icon: "heart-outline",
    color: Tokens.brand.accent[500],
  },
  {
    id: "rest",
    title: "Descanso",
    subtitle: "Sons relaxantes",
    icon: "moon-outline",
    color: Tokens.brand.secondary[500],
  },
  {
    id: "connect",
    title: "Comunidade",
    subtitle: "Conecte-se",
    icon: "people-outline",
    color: Tokens.brand.primary[500],
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "first_checkin", title: "Primeiro Check-in", icon: "🌟", unlocked: true },
  {
    id: "week_streak",
    title: "Semana Consistente",
    icon: "🔥",
    unlocked: false,
    progress: 3,
    maxProgress: 7,
  },
  {
    id: "hydration_master",
    title: "Hidratacao Master",
    icon: "💧",
    unlocked: false,
    progress: 1,
    maxProgress: 3,
  },
  {
    id: "self_care_queen",
    title: "Rainha do Autocuidado",
    icon: "👑",
    unlocked: false,
    progress: 6,
    maxProgress: 10,
  },
];

const TIPS_BY_STAGE: Record<PregnancyStage, string[]> = {
  trying: [
    "Mantenha um ciclo de sono regular para equilibrar seus hormonios",
    "Hidratacao e fundamental - beba pelo menos 2L de agua por dia",
    "Pratique tecnicas de relaxamento para reduzir o estresse",
  ],
  pregnant: [
    "Descanse sempre que puder - seu corpo esta trabalhando muito",
    "Alimentos ricos em ferro ajudam a prevenir anemia na gravidez",
    "Exercicios leves como caminhada ajudam na circulacao",
  ],
  postpartum: [
    "Durma quando o bebe dorme - sua recuperacao e prioridade",
    "Peca ajuda sem culpa - voce nao precisa fazer tudo sozinha",
    "Alimentacao nutritiva ajuda na producao de leite e energia",
  ],
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Circular Progress Ring
const CircularProgress = memo(function CircularProgress({
  percentage,
  size = 100,
  strokeWidth = 8,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = r * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgLinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={Tokens.brand.accent[400]} />
            <Stop offset="100%" stopColor={Tokens.brand.teal[500]} />
          </SvgLinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={Tokens.neutral[200]}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
});

// Mood Button Component
const MoodButton = memo(function MoodButton({
  mood,
  isSelected,
  index,
  onSelect,
}: {
  mood: (typeof MOODS)[0];
  isSelected: boolean;
  index: number;
  onSelect: () => void;
}) {
  const scale = useSharedValue(1);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(withSpring(1.2, { damping: 10 }), withSpring(1, { damping: 15 }));
    onSelect();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(100 + index * 40).duration(300)} style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.moodButton,
          isSelected && { backgroundColor: `${mood.color}20`, borderColor: mood.color },
        ]}
      >
        <Text style={styles.moodEmoji}>{mood.emoji}</Text>
        <Text style={[styles.moodLabel, { color: isSelected ? mood.color : Tokens.neutral[500] }]}>
          {mood.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

// Mood Tracker Component
const MoodTracker = memo(function MoodTracker({
  selectedMood,
  onSelectMood,
  isDark,
}: {
  selectedMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
  isDark: boolean;
}) {
  const cardBg = isDark ? surface.dark.cardAlpha : Tokens.neutral[0];
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[100];

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
      <View
        style={[
          styles.moodCard,
          { backgroundColor: cardBg, borderColor, ...(isDark ? {} : shadows.flo.soft) },
        ]}
      >
        <View style={styles.moodHeader}>
          <Text
            style={[styles.moodTitle, { color: isDark ? Tokens.neutral[50] : Tokens.neutral[800] }]}
          >
            Como voce esta?
          </Text>
          {selectedMood && (
            <View style={[styles.moodBadge, { backgroundColor: `${Tokens.brand.teal[500]}20` }]}>
              <Text style={[styles.moodBadgeText, { color: Tokens.brand.teal[600] }]}>
                Registrado
              </Text>
            </View>
          )}
        </View>
        <View style={styles.moodGrid}>
          {MOODS.map((mood, index) => (
            <MoodButton
              key={mood.type}
              mood={mood}
              isSelected={selectedMood === mood.type}
              index={index}
              onSelect={() => onSelectMood(mood.type)}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
});

// Quick Tracker Item
const QuickTrackerItem = memo(function QuickTrackerItem({
  value,
  maxValue,
  icon,
  label,
  unit,
  color,
  onIncrement,
  onDecrement,
  isDark,
}: {
  value: number;
  maxValue: number;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  unit: string;
  color: string;
  onIncrement: () => void;
  onDecrement: () => void;
  isDark: boolean;
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const isComplete = value >= maxValue;
  const cardBg = isDark ? surface.dark.cardAlpha : Tokens.neutral[0];
  const borderColor = isComplete
    ? Tokens.brand.teal[400]
    : isDark
      ? Tokens.neutral[700]
      : Tokens.neutral[100];

  return (
    <View
      style={[
        styles.trackerItem,
        { backgroundColor: cardBg, borderColor, ...(isDark ? {} : shadows.flo.minimal) },
      ]}
    >
      <View style={styles.trackerHeader}>
        <View style={[styles.trackerIconBg, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text
          style={[
            styles.trackerLabel,
            { color: isDark ? Tokens.neutral[50] : Tokens.neutral[800] },
          ]}
        >
          {label}
        </Text>
        {isComplete && (
          <Ionicons name="checkmark-circle" size={16} color={Tokens.brand.teal[500]} />
        )}
      </View>
      <View style={styles.trackerValueRow}>
        <Pressable
          onPress={onDecrement}
          style={[
            styles.trackerButton,
            { backgroundColor: isDark ? Tokens.neutral[700] : Tokens.neutral[100] },
          ]}
        >
          <Ionicons name="remove" size={16} color={Tokens.neutral[500]} />
        </Pressable>
        <View style={styles.trackerValueContainer}>
          <Text style={[styles.trackerValue, { color }]}>{value}</Text>
          <Text style={[styles.trackerUnit, { color: Tokens.neutral[500] }]}>
            /{maxValue} {unit}
          </Text>
        </View>
        <Pressable onPress={onIncrement} style={[styles.trackerButton, { backgroundColor: color }]}>
          <Ionicons name="add" size={16} color={Tokens.neutral[0]} />
        </Pressable>
      </View>
      <View style={styles.trackerProgressBg}>
        <View
          style={[styles.trackerProgressFill, { width: `${percentage}%`, backgroundColor: color }]}
        />
      </View>
    </View>
  );
});

// Weekly Progress Chart
const WeeklyProgressChart = memo(function WeeklyProgressChart({
  data,
  isDark,
}: {
  data: number[];
  isDark: boolean;
}) {
  const days = ["D", "S", "T", "Q", "Q", "S", "S"];
  const today = new Date().getDay();
  const maxValue = Math.max(...data, 1);
  const cardBg = isDark ? surface.dark.cardAlpha : Tokens.neutral[0];
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[100];

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)}>
      <View
        style={[
          styles.chartCard,
          { backgroundColor: cardBg, borderColor, ...(isDark ? {} : shadows.flo.soft) },
        ]}
      >
        <View style={styles.chartContainer}>
          {data.map((value, index) => {
            const height = (value / maxValue) * 60;
            const isToday = index === today;
            return (
              <View key={index} style={styles.chartBarContainer}>
                <View style={styles.chartBarWrapper}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: Math.max(height, 4),
                        backgroundColor: isToday
                          ? Tokens.brand.accent[500]
                          : Tokens.brand.primary[400],
                        opacity: isToday ? 1 : 0.6,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.chartDayLabel,
                    {
                      color: isToday ? Tokens.brand.accent[500] : Tokens.neutral[500],
                      fontWeight: isToday ? "700" : "500",
                    },
                  ]}
                >
                  {days[index]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
});

// Achievement Badge
const AchievementBadge = memo(function AchievementBadge({
  achievement,
  index,
  isDark,
}: {
  achievement: Achievement;
  index: number;
  isDark: boolean;
}) {
  const { unlocked, progress, maxProgress } = achievement;
  const progressPercentage = progress && maxProgress ? (progress / maxProgress) * 100 : 0;
  const cardBg = isDark ? surface.dark.cardAlpha : Tokens.neutral[0];
  const borderColor = unlocked
    ? Tokens.brand.teal[400]
    : isDark
      ? Tokens.neutral[700]
      : Tokens.neutral[100];

  return (
    <Animated.View entering={FadeInDown.delay(100 + index * 60).duration(300)}>
      <View
        style={[
          styles.achievementBadge,
          {
            backgroundColor: cardBg,
            borderColor,
            opacity: unlocked ? 1 : 0.7,
            ...(isDark ? {} : shadows.flo.minimal),
          },
        ]}
      >
        <Text style={[styles.achievementIcon, { opacity: unlocked ? 1 : 0.5 }]}>
          {achievement.icon}
        </Text>
        <View style={styles.achievementContent}>
          <Text
            style={[
              styles.achievementTitle,
              { color: isDark ? Tokens.neutral[50] : Tokens.neutral[800] },
            ]}
          >
            {achievement.title}
          </Text>
          {!unlocked && progress !== undefined && maxProgress !== undefined && (
            <View style={styles.achievementProgressContainer}>
              <View style={styles.achievementProgressBg}>
                <View
                  style={[styles.achievementProgressFill, { width: `${progressPercentage}%` }]}
                />
              </View>
              <Text style={[styles.achievementProgressText, { color: Tokens.neutral[500] }]}>
                {progress}/{maxProgress}
              </Text>
            </View>
          )}
          {unlocked && (
            <Text style={[styles.achievementUnlocked, { color: Tokens.brand.teal[500] }]}>
              Conquistado!
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
});

// Tip Card
const TipCard = memo(function TipCard({
  tip,
  index,
  isDark,
}: {
  tip: string;
  index: number;
  isDark: boolean;
}) {
  const cardBg = isDark ? surface.dark.cardAlpha : Tokens.brand.primary[50];
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.brand.primary[200];

  return (
    <Animated.View entering={FadeInDown.delay(100 + index * 80).duration(300)}>
      <View style={[styles.tipCard, { backgroundColor: cardBg, borderColor }]}>
        <View style={styles.tipIconContainer}>
          <Ionicons name="bulb" size={18} color={Tokens.brand.primary[500]} />
        </View>
        <Text
          style={[styles.tipText, { color: isDark ? Tokens.neutral[200] : Tokens.neutral[700] }]}
        >
          {tip}
        </Text>
      </View>
    </Animated.View>
  );
});

// Habit Item Premium
const HabitItemPremium = memo(function HabitItemPremium({
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
    scale.value = withSequence(withSpring(0.95, { damping: 15 }), withSpring(1, { damping: 10 }));
    onToggle();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardBg = habit.completed
    ? `${Tokens.brand.teal[500]}10`
    : isDark
      ? surface.dark.cardAlpha
      : Tokens.neutral[0];
  const borderColor = habit.completed
    ? Tokens.brand.teal[400]
    : isDark
      ? Tokens.neutral[700]
      : Tokens.neutral[100];
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];

  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 40).duration(400)}
      style={animatedStyle}
    >
      <Pressable
        onPress={handlePress}
        style={[styles.habitItemPremium, { backgroundColor: cardBg, borderColor }]}
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
        <View style={styles.habitContentPremium}>
          <Text
            style={[
              styles.habitTitlePremium,
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
            <Text style={[styles.habitDescPremium, { color: Tokens.neutral[500] }]}>
              {habit.description}
            </Text>
          )}
        </View>
        <Text style={styles.habitEmojiPremium}>{habit.icon}</Text>
      </Pressable>
    </Animated.View>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MeusCuidadosPremiumScreen({ navigation }: MainTabScreenProps<"MyCare">) {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType>(null);
  const [trackers, setTrackers] = useState<TrackerData>({ sleep: 0, water: 0, exercise: 0 });
  const [weeklyData] = useState([3, 5, 4, 6, 2, 7, 4]);

  // Store
  const user = useAppStore((s) => s.user);
  const habits = useHabitsStore((s) => s.habits);
  const toggleHabit = useHabitsStore((s) => s.toggleHabit);
  const checkInStreak = useCheckInStore((s) => s.streak);

  // Computed
  const completedHabits = useMemo(() => habits.filter((h) => h.completed).length, [habits]);
  const totalHabits = habits.length;
  const habitsProgress = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const greetingData = getGreeting();
  const greeting = `${greetingData.emoji} ${greetingData.text}`;
  const pregnancyInfo = getPregnancyInfo(
    user?.stage || undefined,
    user?.dueDate || undefined,
    undefined
  );

  const todayAffirmation = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return DAILY_AFFIRMATIONS[dayOfYear % DAILY_AFFIRMATIONS.length];
  }, []);

  const userStage = user?.stage || "pregnant";
  const personalizedTips = TIPS_BY_STAGE[userStage] || TIPS_BY_STAGE.pregnant;

  // Handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  const handleMoodSelect = useCallback(async (mood: MoodType) => {
    setSelectedMood(mood);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleTrackerIncrement = useCallback((type: TrackerType) => {
    setTrackers((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleTrackerDecrement = useCallback((type: TrackerType) => {
    setTrackers((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleToggleHabit = useCallback(
    async (habitId: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const today = new Date().toISOString().split("T")[0];
      toggleHabit(habitId, today);
    },
    [toggleHabit]
  );

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

  const handleNathIA = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Assistant");
  }, [navigation]);

  const handleAffirmations = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Affirmations");
  }, [navigation]);

  const handleProfile = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("EditProfile");
  }, [navigation]);

  return (
    <FloScreenWrapper
      scrollable
      refreshing={refreshing}
      onRefresh={handleRefresh}
      testID="meus-cuidados-premium-screen"
    >
      {/* Header */}
      <FloHeader
        greeting={greeting}
        title={user?.name || "Mamae"}
        subtitle={pregnancyInfo || undefined}
        subtitleAccent
        variant="large"
        rightActions={[{ icon: "chatbubble-ellipses", onPress: handleNathIA, label: "NathIA" }]}
        avatar={{ onPress: handleProfile }}
      />

      {/* Progress Ring */}
      <Animated.View entering={FadeIn.delay(50).duration(400)} style={styles.progressRingSection}>
        <View style={styles.progressRingCard}>
          <CircularProgress percentage={habitsProgress} size={100} strokeWidth={8} />
          <View style={styles.progressRingInfo}>
            <Text
              style={[
                styles.progressRingPercentage,
                { color: isDark ? Tokens.neutral[50] : Tokens.neutral[800] },
              ]}
            >
              {habitsProgress}%
            </Text>
            <Text style={[styles.progressRingLabel, { color: Tokens.neutral[500] }]}>
              do dia completo
            </Text>
            <Text style={[styles.progressRingDetail, { color: Tokens.brand.accent[500] }]}>
              {completedHabits}/{totalHabits} habitos
            </Text>
          </View>
          {checkInStreak > 0 && (
            <View style={styles.streakBadgePremium}>
              <Ionicons name="flame" size={14} color={Tokens.neutral[0]} />
              <Text style={styles.streakNumber}>{checkInStreak}</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Mood Tracker */}
      <View style={styles.section}>
        <MoodTracker selectedMood={selectedMood} onSelectMood={handleMoodSelect} isDark={isDark} />
      </View>

      {/* Quick Trackers */}
      <View style={styles.section}>
        <FloSectionTitle title="Rastreadores" animationDelay={150} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trackersScroll}
        >
          <QuickTrackerItem
            value={trackers.sleep}
            maxValue={8}
            icon="moon"
            label="Sono"
            unit="h"
            color={Tokens.brand.secondary[500]}
            onIncrement={() => handleTrackerIncrement("sleep")}
            onDecrement={() => handleTrackerDecrement("sleep")}
            isDark={isDark}
          />
          <QuickTrackerItem
            value={trackers.water}
            maxValue={8}
            icon="water"
            label="Agua"
            unit="copos"
            color={Tokens.brand.primary[500]}
            onIncrement={() => handleTrackerIncrement("water")}
            onDecrement={() => handleTrackerDecrement("water")}
            isDark={isDark}
          />
          <QuickTrackerItem
            value={trackers.exercise}
            maxValue={30}
            icon="fitness"
            label="Exercicio"
            unit="min"
            color={Tokens.brand.teal[500]}
            onIncrement={() => handleTrackerIncrement("exercise")}
            onDecrement={() => handleTrackerDecrement("exercise")}
            isDark={isDark}
          />
        </ScrollView>
      </View>

      {/* Weekly Progress */}
      <View style={styles.section}>
        <FloSectionTitle title="Sua semana" animationDelay={200} />
        <WeeklyProgressChart data={weeklyData} isDark={isDark} />
      </View>

      {/* Affirmation */}
      <View style={styles.section}>
        <FloSectionTitle title="Afirmacao do dia" animationDelay={250} />
        <Pressable onPress={handleAffirmations}>
          <FloMotivationalCard
            message={todayAffirmation}
            author="Nathalia Valente"
            variant="featured"
            animationDelay={250}
          />
        </Pressable>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <FloSectionTitle
          title="Conquistas"
          action={{ label: "Ver todas", onPress: () => {}, icon: "chevron-forward" }}
          animationDelay={300}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementsScroll}
        >
          {DEFAULT_ACHIEVEMENTS.map((achievement, index) => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              index={index}
              isDark={isDark}
            />
          ))}
        </ScrollView>
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <FloSectionTitle title="Dicas para voce" animationDelay={350} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tipsScroll}
        >
          {personalizedTips.map((tip, index) => (
            <TipCard key={index} tip={tip} index={index} isDark={isDark} />
          ))}
        </ScrollView>
      </View>

      {/* Habits */}
      {totalHabits > 0 && (
        <View style={styles.section}>
          <FloSectionTitle
            title="Habitos de hoje"
            action={{
              label: "Ver todos",
              onPress: () => navigation.navigate("Habits"),
              icon: "chevron-forward",
            }}
            animationDelay={400}
          />
          <View style={styles.habitsListPremium}>
            {habits.slice(0, 4).map((habit, index) => (
              <HabitItemPremium
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

      {/* Quick Actions */}
      <View style={styles.section}>
        <FloSectionTitle title="Seu momento" animationDelay={450} />
        <View style={styles.quickActionsGrid}>
          {CARE_ACTIONS.map((action) => (
            <View key={action.id} style={styles.quickActionWrapper}>
              <FloActionCard
                icon={action.icon as keyof typeof Ionicons.glyphMap}
                iconColor={action.color}
                title={action.title}
                subtitle={action.subtitle}
                onPress={() => handleQuickAction(action.id)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* NathIA CTA */}
      <View style={styles.section}>
        <FloActionCard
          icon="chatbubble-ellipses-outline"
          iconColor={Tokens.brand.accent[500]}
          title="Quer conversar?"
          subtitle="A NathIA ta aqui pra te ouvir e apoiar"
          onPress={handleNathIA}
        />
      </View>

      {/* Footer */}
      <Animated.View entering={FadeIn.delay(500).duration(400)} style={styles.footerPremium}>
        <Text style={[styles.footerTextPremium, { color: Tokens.neutral[400] }]}>
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

  // Progress Ring
  progressRingSection: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  progressRingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
  },
  progressRingInfo: {
    alignItems: "flex-start",
  },
  progressRingPercentage: {
    fontSize: 32,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -1,
  },
  progressRingLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  progressRingDetail: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semibold,
    marginTop: spacing.xs,
  },
  streakBadgePremium: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Tokens.brand.accent[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    position: "absolute",
    top: -8,
    right: -8,
  },
  streakNumber: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
    color: Tokens.neutral[0],
  },

  // Mood Tracker
  moodCard: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  moodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  moodTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semibold,
  },
  moodBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  moodBadgeText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semibold,
  },
  moodGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodButton: {
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: 54,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
  },

  // Trackers
  trackersScroll: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  trackerItem: {
    width: 130,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.sm,
  },
  trackerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  trackerIconBg: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  trackerLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semibold,
    flex: 1,
  },
  trackerValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trackerButton: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  trackerValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  trackerValue: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
  },
  trackerUnit: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    marginLeft: 2,
  },
  trackerProgressBg: {
    height: 4,
    backgroundColor: Tokens.neutral[200],
    borderRadius: radius.full,
    overflow: "hidden",
  },
  trackerProgressFill: {
    height: "100%",
    borderRadius: radius.full,
  },

  // Chart
  chartCard: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 80,
  },
  chartBarContainer: {
    alignItems: "center",
    flex: 1,
  },
  chartBarWrapper: {
    height: 60,
    justifyContent: "flex-end",
  },
  chartBar: {
    width: 18,
    borderRadius: radius.sm,
  },
  chartDayLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    marginTop: spacing.xs,
  },

  // Achievements
  achievementsScroll: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  achievementBadge: {
    width: 150,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semibold,
  },
  achievementProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: 4,
  },
  achievementProgressBg: {
    flex: 1,
    height: 4,
    backgroundColor: Tokens.neutral[200],
    borderRadius: radius.full,
    overflow: "hidden",
  },
  achievementProgressFill: {
    height: "100%",
    backgroundColor: Tokens.brand.teal[500],
    borderRadius: radius.full,
  },
  achievementProgressText: {
    fontSize: 9,
    fontFamily: typography.fontFamily.medium,
  },
  achievementUnlocked: {
    fontSize: 10,
    fontFamily: typography.fontFamily.semibold,
    marginTop: 2,
  },

  // Tips
  tipsScroll: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  tipCard: {
    width: 240,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  tipIconContainer: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: `${Tokens.brand.primary[500]}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 18,
  },

  // Habits Premium
  habitsListPremium: {
    gap: spacing.sm,
  },
  habitItemPremium: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  habitCheckbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  habitContentPremium: {
    flex: 1,
  },
  habitTitlePremium: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  habitDescPremium: {
    fontSize: 11,
    fontFamily: typography.fontFamily.base,
    marginTop: 2,
  },
  habitEmojiPremium: {
    fontSize: 18,
  },

  // Quick Actions
  quickActionsGrid: {
    gap: spacing.md,
  },
  quickActionWrapper: {
    marginBottom: 0,
  },

  // Footer
  footerPremium: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginTop: spacing.lg,
  },
  footerTextPremium: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
});
