/**
 * HomeScreen - Design Flo Health Minimal 2025
 *
 * Design Concept: "Seu Santuário Diário"
 * - Layout clean e minimalista inspirado no Flo Health
 * - Tipografia elegante com hierarquia clara
 * - Cards com sombras rosadas sutis
 * - Muito whitespace para respiração visual
 * - Animações suaves e respeitando acessibilidade
 *
 * @example
 * ```tsx
 * <HomeScreenRedesign navigation={navigation} />
 * ```
 */

import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useAppStore, useHabitsStore, useCheckInStore } from "@/state";
import { MainTabScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";
import { getPregnancyInfo, getMoodEmoji } from "@/utils/formatters";
import { getGreeting } from "@/utils/greeting";
import {
  FloScreenWrapper,
  FloHeader,
  FloMotivationalCard,
  FloStatusCard,
  FloActionCard,
  FloSectionTitle,
} from "@/components/ui";

/**
 * Quick Actions Configuration
 */
const QUICK_ACTIONS = [
  {
    id: "nathia",
    icon: "chatbubbles" as const,
    title: "Conversar com NathIA",
    subtitle: "Sua companheira sempre disponível",
    route: "Assistant" as const,
  },
  {
    id: "community",
    icon: "people" as const,
    title: "Mães Valente",
    subtitle: "Conecte-se com outras mães",
    route: "Community" as const,
  },
  {
    id: "mundo",
    icon: "star" as const,
    title: "Mundo da Nath",
    subtitle: "Conteúdos exclusivos premium",
    route: "MundoDaNath" as const,
    badge: "NOVO",
  },
];

export default function HomeScreenRedesign({
  navigation,
}: MainTabScreenProps<"Home">): React.JSX.Element {
  // User data
  const userName = useAppStore((s) => s.user?.name);
  const userStage = useAppStore((s) => s.user?.stage);
  const dueDate = useAppStore((s) => s.user?.dueDate);
  const babyBirthDate = useAppStore((s) => s.user?.babyBirthDate);

  // Habits data
  const habits = useHabitsStore((s) => s.habits);
  const completedHabits = useMemo(() => habits.filter((h) => h.completed).length, [habits]);
  const totalHabits = habits.length;
  const habitsProgress = totalHabits > 0 ? completedHabits / totalHabits : 0;

  // Check-in data
  const checkInStreak = useCheckInStore((s) => s.streak);
  const todayMood = useCheckInStore((s) => s.getTodayCheckIn()?.mood);

  // Refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Greeting and pregnancy info
  const greetingData = getGreeting();
  const greeting = `${greetingData.emoji} ${greetingData.text}`;
  const pregnancyInfo = getPregnancyInfo(userStage, dueDate, babyBirthDate);

  // Motivational message based on time and check-in status
  const motivationalMessage = useMemo(() => {
    const hour = new Date().getHours();
    if (todayMood) return "Você já registrou como se sente hoje. Isso é se cuidar.";
    if (hour < 10) return "Comece o dia com um momento só seu.";
    if (hour < 14) return "Cada passo que você dá conta. Continue assim.";
    if (hour < 19) return "A tarde também merece seu autocuidado.";
    return "Descanse. Amanhã você recomeça mais forte.";
  }, [todayMood]);

  // Handlers
  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  const handleProfilePress = useCallback(async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logger.info("Profile pressed", "HomeScreen");
    navigation.navigate("EditProfile");
  }, [navigation]);

  const handleCheckIn = useCallback(async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logger.info("Check-in pressed", "HomeScreen");
    // Navigate to check-in - implement based on your navigation setup
  }, []);

  const handleHabits = useCallback(async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logger.info("Habits pressed", "HomeScreen");
    navigation.navigate("Habits");
  }, [navigation]);

  const handleQuickAction = useCallback(
    async (action: (typeof QUICK_ACTIONS)[0]): Promise<void> => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      logger.info(`Quick action pressed: ${action.id}`, "HomeScreen");
      navigation.navigate(action.route);
    },
    [navigation]
  );

  return (
    <FloScreenWrapper scrollable refreshing={refreshing} onRefresh={onRefresh} paddingBottom={120}>
      {/* Header */}
      <FloHeader
        greeting={greeting}
        title={userName || "Querida"}
        subtitle={pregnancyInfo || undefined}
        subtitleAccent
        avatar={{ onPress: handleProfilePress }}
        variant="large"
      />

      {/* Motivational Card */}
      <FloMotivationalCard
        message={motivationalMessage}
        author="Nathalia Valente"
        variant="default"
        animationDelay={100}
        style={{ marginBottom: 24 }}
      />

      {/* Status Section */}
      <View style={{ gap: 12, marginBottom: 32 }}>
        {/* Check-in Status */}
        <FloStatusCard
          icon="heart-outline"
          title="Como você está?"
          description={
            todayMood ? `Registrou humor: ${getMoodEmoji(todayMood)}` : "Ainda não registrou hoje"
          }
          badge={checkInStreak > 0 ? `${checkInStreak} dias` : undefined}
          badgeIcon="flame"
          variant="pink"
          completed={!!todayMood}
          onPress={handleCheckIn}
          animationDelay={150}
        />

        {/* Habits Progress */}
        <FloStatusCard
          icon="checkmark-circle-outline"
          title="Hábitos de Hoje"
          description={
            totalHabits > 0
              ? `${completedHabits} de ${totalHabits} completados`
              : "Nenhum hábito criado ainda"
          }
          progress={habitsProgress}
          variant="purple"
          onPress={handleHabits}
          animationDelay={200}
        />
      </View>

      {/* Quick Actions Section */}
      <FloSectionTitle title="Sua Jornada" size="lg" animationDelay={250} />

      <View style={{ gap: 12 }}>
        {QUICK_ACTIONS.map((action, index) => (
          <Animated.View key={action.id} entering={FadeInUp.delay(300 + index * 50).duration(400)}>
            <FloActionCard
              icon={action.icon}
              title={action.title}
              subtitle={action.subtitle}
              badge={action.badge}
              onPress={() => handleQuickAction(action)}
            />
          </Animated.View>
        ))}
      </View>
    </FloScreenWrapper>
  );
}
