/**
 * HomeScreenV2 - Dashboard de Ação
 *
 * Nova Home personalizada que integra componentes existentes:
 * - Logo + Saudação personalizada no header
 * - EmotionalCheckInPrimary: Check-in de humor com hierarquia (Opção C)
 * - DailyMicroActions: 8 micro-ações com toggle "Ver todas"
 * - DailyProgressBar: Progresso de hábitos + streak
 * - DailyInsightsSection: Insights da semana (apenas pregnant)
 * - Pull-to-refresh para atualizar dados
 * - Safe Area dinâmico
 *
 * @version 2.1 - Janeiro 2026
 */

import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";

import {
  DailyInsightsSection,
  DailyMicroActions,
  DailyProgressBar,
  DailyReminders,
  EmotionalCheckInPrimary,
} from "@/components/home";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/state/store";
import { useNathIAOnboardingStore } from "@/state/nathia-onboarding-store";
import { brand, neutral, spacing } from "@/theme/tokens";
import { getGreeting } from "@/utils/greeting";

// Logo local (assets)
const LOGO = require("../../../assets/mother-baby-logo.png");

// ============================================================================
// MAIN SCREEN
// ============================================================================

export default function HomeScreenV2(): React.JSX.Element {
  const { isDark, text, surface } = useTheme();

  // Stores - seguindo padrão Zustand (seletores atômicos)
  const lifeStage = useNathIAOnboardingStore((s) => s.profile.life_stage);
  const dueDate = useAppStore((s) => s.user?.dueDate);
  const userName = useAppStore((s) => s.user?.name);

  // Pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Safe area dinâmico
  const tabBarHeight = useBottomTabBarHeight();

  // Saudação personalizada (memoizada)
  const greeting = useMemo(() => getGreeting(), []);

  // Handler de pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simula delay de refresh (pode adicionar recarregamento de dados aqui)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? surface.base : neutral[50] }]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: tabBarHeight + spacing.lg, // Safe area dinâmico para tab bar
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={brand.primary[500]}
            colors={[brand.primary[500]]}
          />
        }
      >
        {/* Header: Logo + Saudação */}
        <View style={styles.header}>
          <Image
            source={LOGO}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="Logo Nossa Maternidade"
          />
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: isDark ? text.primary : neutral[800] }]}>
              {greeting.emoji} {greeting.text}
            </Text>
            {userName && (
              <Text style={[styles.userName, { color: isDark ? text.secondary : neutral[600] }]}>
                {userName}
              </Text>
            )}
          </View>
        </View>

        {/* Check-in emocional - sempre visível, progressive disclosure */}
        <EmotionalCheckInPrimary />

        {/* 8 micro-ações do dia (top 3 + toggle) */}
        <DailyMicroActions />

        {/* Progresso de hábitos + streak */}
        <DailyProgressBar />

        {/* Próximos lembretes do dia */}
        <DailyReminders />

        {/* Insights da semana - apenas para grávidas com dueDate */}
        {lifeStage === "pregnant" && dueDate && (
          <DailyInsightsSection dueDate={new Date(dueDate)} />
        )}
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingVertical: spacing.xs,
  },
  logo: {
    width: 56,
    height: 56,
  },
  greetingContainer: {
    flex: 1,
    gap: 2,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    lineHeight: 22,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    lineHeight: 26,
  },
});
