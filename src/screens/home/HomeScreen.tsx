/**
 * HomeScreen - Dashboard Premium Consolidado
 *
 * Design Premium:
 * - Background com gradiente suave rosa/azul
 * - Header com avatar e saudação personalizada
 * - Cards com sombras refinadas
 * - Animações fluidas
 *
 * @version 5.0 - Premium Redesign Fevereiro 2026
 */

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, TrendingUp } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StatusBar, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  DailyInsightsSection,
  DailyMicroActions,
  DailyProgressBar,
  DailyReminders,
  EmotionalCheckInPrimary,
  PremiumHeader,
  SectionHeader,
} from "@/components/home";
import { DailyInsightCard } from "@/components/home/DailyInsightCard";
import { useDailyInsight } from "@/hooks/useDailyInsight";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/state";
import { useNathIAOnboardingStore } from "@/state/nathia-onboarding-store";
import { brand, maternal, neutral, spacing } from "@/theme/tokens";
import { MainTabScreenProps } from "@/types/navigation";
import { staggeredFadeUp } from "@/utils/animations";
import { getGreeting } from "@/utils/greeting";

const COLORS = {
  gradientStart: maternal.warmth.blush,
  gradientMid: maternal.warmth.cream,
  gradientEnd: brand.primary[50],
  primary: brand.primary[500],
  accent: brand.accent[400],
  teal: brand.teal[400],
} as const;

export default function HomeScreen({ navigation }: MainTabScreenProps<"Home">): React.JSX.Element {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const lifeStage = useNathIAOnboardingStore((s) => s.profile.life_stage);
  const dueDate = useAppStore((s) => s.user?.dueDate);
  const userName = useAppStore((s) => s.user?.name);

  const { insight, dayIndex } = useDailyInsight();

  const [refreshing, setRefreshing] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();
  const greeting = useMemo(() => getGreeting(), []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const gradientColors: readonly [string, string, string] = isDark
    ? [neutral[900], neutral[800], neutral[900]]
    : [COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd];

  return (
    <LinearGradient colors={gradientColors} style={styles.container} locations={[0, 0.3, 1]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top,
            paddingBottom: tabBarHeight + spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <PremiumHeader greeting={greeting} userName={userName} />

        {insight && (
          <Animated.View entering={staggeredFadeUp(0)} style={styles.section}>
            <DailyInsightCard
              insight={insight}
              dayIndex={dayIndex}
              onPressCTA={(action) => {
                switch (action) {
                  case "open_assistant":
                    navigation.navigate("Assistant");
                    break;
                  case "open_daily_log":
                    navigation.navigate("DailyLog" as never);
                    break;
                  case "open_affirmations":
                    navigation.navigate("Affirmations" as never);
                    break;
                  case "open_care":
                    navigation.navigate("MyCare");
                    break;
                  case "open_cycle":
                    navigation.navigate("Cycle" as never);
                    break;
                }
              }}
            />
          </Animated.View>
        )}

        <Animated.View entering={staggeredFadeUp(1)} style={styles.section}>
          <SectionHeader title="Como você está?" icon={<Heart size={20} color={COLORS.accent} />} />
          <EmotionalCheckInPrimary />
        </Animated.View>

        <Animated.View entering={staggeredFadeUp(2)} style={styles.section}>
          <DailyMicroActions />
        </Animated.View>

        <Animated.View entering={staggeredFadeUp(3)} style={styles.section}>
          <SectionHeader
            title="Seu progresso"
            icon={<TrendingUp size={20} color={COLORS.primary} />}
          />
          <DailyProgressBar />
        </Animated.View>

        <Animated.View entering={staggeredFadeUp(4)} style={styles.section}>
          <DailyReminders />
        </Animated.View>

        {lifeStage === "pregnant" && dueDate && (
          <Animated.View entering={staggeredFadeUp(5)} style={styles.section}>
            <DailyInsightsSection dueDate={new Date(dueDate)} />
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    gap: spacing["2xl"],
  },

  section: {
    paddingHorizontal: spacing.xl,
  },
});
