/**
 * HomeScreenV2Premium - Dashboard Premium Nathia 2026
 *
 * Design refinado com:
 * - Header com avatar premium + gradiente
 * - Cards com glassmorphism e sombras suaves
 * - Hierarquia visual clara
 * - Micro-interações polidas
 * - Design system completo (Tokens)
 *
 * @version 3.0 - Fevereiro 2026
 */

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, Sparkles, TrendingUp } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  DailyInsightsSection,
  DailyMicroActions,
  DailyProgressBar,
  DailyReminders,
  EmotionalCheckInPrimary,
} from "@/components/home";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/state";
import { useNathIAOnboardingStore } from "@/state/nathia-onboarding-store";
import { brand, maternal, neutral, radius, shadows, spacing, text } from "@/theme/tokens";
import { MainTabScreenProps } from "@/types/navigation";
import { getGreeting } from "@/utils/greeting";

// Logo local
const LOGO = require("../../../assets/mother-baby-logo.png");

// Color Palette Premium
const COLORS = {
  // Maternal warmth (tons acolhedores)
  cream: maternal.warmth.cream,
  peach: maternal.warmth.peach,
  honey: maternal.warmth.honey,

  // Brand
  primary: brand.primary[500],
  primaryLight: brand.primary[100],
  accent: brand.accent[400],
  accentLight: brand.accent[100],
  teal: brand.teal[400],
  tealLight: brand.teal[100],

  // Text
  textPrimary: text.light.primary,
  textSecondary: text.light.secondary,
  textMuted: neutral[500],

  // Surface
  white: neutral[0],
  gray50: neutral[50],
  gray100: neutral[100],
  gray200: neutral[200],
} as const;

// ============================================================================
// PREMIUM HEADER COMPONENT
// ============================================================================

interface HeaderProps {
  greeting: { emoji: string; text: string };
  userName?: string;
}

function PremiumHeader({ greeting, userName }: HeaderProps): React.JSX.Element {
  const displayName = userName?.split(" ")[0] || "Mamãe";

  return (
    <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.headerContainer}>
      <LinearGradient
        colors={[COLORS.cream, COLORS.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          {/* Avatar Premium */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[COLORS.accent, COLORS.teal]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Image
                source={LOGO}
                style={styles.avatarImage}
                contentFit="cover"
                accessibilityLabel="Avatar"
              />
            </LinearGradient>
          </View>

          {/* Greeting Premium */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingEmoji}>{greeting.emoji}</Text>
            <Text style={styles.greetingText}>{greeting.text}</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

// ============================================================================
// SECTION HEADER COMPONENT
// ============================================================================

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

function SectionHeader({ title, icon, subtitle }: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// ============================================================================
// MAIN SCREEN
// ============================================================================

export default function HomeScreenV2Premium(_props: MainTabScreenProps<"Home">): React.JSX.Element {
  const { isDark } = useTheme();

  // Stores
  const lifeStage = useNathIAOnboardingStore((s) => s.profile.life_stage);
  const dueDate = useAppStore((s) => s.user?.dueDate);
  const userName = useAppStore((s) => s.user?.name);

  // Pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  // Safe area
  const tabBarHeight = useBottomTabBarHeight();

  // Saudação
  const greeting = useMemo(() => getGreeting(), []);

  // Handler de refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
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
        {/* Header Premium */}
        <PremiumHeader greeting={greeting} userName={userName} />

        {/* Check-in Emocional */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.section}>
          <SectionHeader
            title="Como você está agora?"
            icon={<Heart size={20} color={COLORS.accent} />}
            subtitle="Deslize para registrar como você está se sentindo"
          />
          <View style={styles.cardWrapper}>
            <EmotionalCheckInPrimary />
          </View>
        </Animated.View>

        {/* Micro-ações */}
        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.section}>
          <SectionHeader
            title="Micro-ações do dia"
            icon={<Sparkles size={20} color={COLORS.teal} />}
            subtitle="Pequenos passos, grande diferença"
          />
          <DailyMicroActions />
        </Animated.View>

        {/* Progresso */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.section}>
          <SectionHeader
            title="Seu progresso"
            icon={<TrendingUp size={20} color={COLORS.primary} />}
          />
          <DailyProgressBar />
        </Animated.View>

        {/* Lembretes */}
        <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.section}>
          <DailyReminders />
        </Animated.View>

        {/* Insights (apenas grávidas) */}
        {lifeStage === "pregnant" && dueDate && (
          <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.section}>
            <DailyInsightsSection dueDate={new Date(dueDate)} />
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    gap: spacing.xl,
  },

  // ============================================================================
  // HEADER STYLES
  // ============================================================================

  headerContainer: {
    marginBottom: spacing.lg,
  },

  headerGradient: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing["2xl"],
    borderBottomLeftRadius: radius["2xl"],
    borderBottomRightRadius: radius["2xl"],
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },

  avatarContainer: {
    ...shadows.lg,
  },

  avatarGradient: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarImage: {
    width: 66,
    height: 66,
    borderRadius: radius.full,
    backgroundColor: COLORS.white,
  },

  greetingContainer: {
    flex: 1,
    gap: 2,
  },

  greetingEmoji: {
    fontSize: 24,
    lineHeight: 32,
  },

  greetingText: {
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  userName: {
    fontSize: 24,
    fontFamily: "Manrope_700Bold",
    color: COLORS.textPrimary,
    lineHeight: 32,
  },

  // ============================================================================
  // SECTION STYLES
  // ============================================================================

  section: {
    paddingHorizontal: spacing.xl,
  },

  sectionHeader: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: COLORS.textPrimary,
    lineHeight: 24,
  },

  sectionSubtitle: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: COLORS.textMuted,
    lineHeight: 18,
  },

  cardWrapper: {
    // Wrapper para aplicar sombras nos cards dos componentes
  },
});
