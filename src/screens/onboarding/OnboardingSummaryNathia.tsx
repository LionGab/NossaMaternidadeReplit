/**
 * OnboardingSummaryNathia - Resumo da Jornada
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Header com progress
 * - Título de celebração
 * - Cards de resumo com checkmarks
 * - CTA para paywall
 */

import { Ionicons } from "@expo/vector-icons";
import { differenceInWeeks, parseISO } from "date-fns";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Body, Caption, NathCard, Subtitle, Title } from "@/components/ui";

// API
import { saveOnboardingData } from "@/api/onboarding-service";

// Config
import { STAGE_CARDS } from "@/config/nath-journey-onboarding-data";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { useAppStore } from "@/state/store";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
import { OnboardingConcern } from "@/types/nath-journey-onboarding.types";
import type { RootStackScreenProps } from "@/types/navigation";

// Utils
import { logger } from "@/utils/logger";

// Cores do design Nathia
const nathColors = {
  rosa: { DEFAULT: Tokens.brand.accent[300], light: Tokens.brand.accent[100] },
  azul: {
    DEFAULT: Tokens.brand.primary[200],
    light: Tokens.brand.primary[50],
    dark: Tokens.brand.primary[300],
  },
  verde: {
    DEFAULT: Tokens.brand.teal[200],
    light: Tokens.brand.teal[50],
    dark: Tokens.brand.teal[300],
  },
  laranja: {
    DEFAULT: Tokens.maternal.warmth.peach,
    light: Tokens.maternal.warmth.honey,
    dark: Tokens.brand.accent[300],
  },
  cream: Tokens.maternal.warmth.cream,
  white: Tokens.neutral[0],
  text: {
    DEFAULT: Tokens.neutral[800],
    muted: Tokens.neutral[500],
    light: Tokens.neutral[600],
  },
  border: Tokens.neutral[200],
  input: Tokens.neutral[50],
  success: {
    text: Tokens.semantic.light.successText,
    bg: Tokens.semantic.light.successLight,
  },
};

type Props = RootStackScreenProps<"OnboardingSummary">;

const CONCERN_LABELS: Record<OnboardingConcern, string> = {
  ANSIEDADE_MEDO: "Ansiedade e medo",
  FALTA_INFORMACAO: "Falta de informação",
  SINTOMAS_FISICOS: "Sintomas físicos",
  MUDANCAS_CORPO: "Mudanças no corpo",
  RELACIONAMENTO: "Relacionamento",
  TRABALHO_MATERNIDADE: "Trabalho e maternidade",
  SOLIDAO: "Solidão",
  FINANCAS: "Finanças",
};

/**
 * SummaryCard - Card de resumo
 */
const SummaryCard = ({
  icon,
  title,
  subtitle,
  delay = 0,
  highlight = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  delay?: number;
  highlight?: boolean;
}) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(350).springify()}>
    <NathCard
      variant={highlight ? "elevated" : "outlined"}
      style={[styles.card, highlight && styles.cardHighlight]}
      padding="md"
    >
      <View style={styles.cardContent}>
        {/* Checkmark circle */}
        <View style={[styles.checkCircle, highlight && styles.checkCircleHighlight]}>
          <Ionicons
            name="checkmark"
            size={14}
            color={highlight ? nathColors.white : nathColors.rosa.DEFAULT}
          />
        </View>

        {/* Text content */}
        <View style={styles.cardTextContainer}>
          <View style={styles.cardTitleRow}>
            <Ionicons
              name={icon}
              size={16}
              color={highlight ? nathColors.rosa.DEFAULT : nathColors.text.muted}
              style={styles.cardIcon}
            />
            <Body weight="semibold" style={[styles.cardTitle, highlight && styles.cardTitleHighlight]}>
              {title}
            </Body>
          </View>
          {subtitle && <Caption style={styles.cardSubtitle}>{subtitle}</Caption>}
        </View>
      </View>
    </NathCard>
  </Animated.View>
);

/**
 * Progress Dots
 */
const ProgressDots = ({ current, total }: { current: number; total: number }) => (
  <View style={styles.progressDots}>
    {Array.from({ length: total }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          index < current && styles.dotFilled,
          index === current - 1 && styles.dotActive,
        ]}
      />
    ))}
  </View>
);

export default function OnboardingSummaryNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // Store selectors
  const data = useNathJourneyOnboardingStore((s) => s.data);
  const needsExtraCare = useNathJourneyOnboardingStore((s) => s.needsExtraCare);
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);
  const getSeasonName = useNathJourneyOnboardingStore((s) => s.getSeasonName);
  const formatCheckInTime = useNathJourneyOnboardingStore((s) => s.formatCheckInTime);
  const getCheckInTime = useNathJourneyOnboardingStore((s) => s.getCheckInTime);
  const authUserId = useAppStore((s) => s.authUserId);

  // Set current screen on mount
  useEffect(() => {
    setCurrentScreen("OnboardingSummary");
  }, [setCurrentScreen]);

  // Derived values
  const stage = data.stage;
  const concerns = data.concerns;
  const dailyCheckIn = data.dailyCheckIn;
  const checkInTime = formatCheckInTime(data.checkInHour);
  const seasonName = getSeasonName();
  const date = data.dateIso;

  // Calculate pregnancy week (if applicable)
  const pregnancyWeek = useMemo(() => {
    if (stage?.startsWith("GRAVIDA_") && date) {
      try {
        const dueDate = parseISO(date);
        const today = new Date();
        const weeks = differenceInWeeks(dueDate, today);
        return Math.max(0, 40 - weeks);
      } catch (error) {
        logger.error(
          "Failed to parse due date",
          "OnboardingSummaryNathia",
          error instanceof Error ? error : new Error(String(error))
        );
        return null;
      }
    }
    return null;
  }, [stage, date]);

  // Stage card data
  const stageCard = useMemo(() => STAGE_CARDS.find((card) => card.stage === stage), [stage]);

  // Is extra care needed?
  const showExtraCare = needsExtraCare();

  // Build concerns string
  const concernsText = useMemo(() => {
    if (concerns.length === 0) return null;
    const labels = concerns
      .map((c) => CONCERN_LABELS[c as OnboardingConcern])
      .filter(Boolean);
    if (labels.length === 0) return null;
    return labels.join(", ");
  }, [concerns]);

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleContinue = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Opportunistic sync (local-first)
    if (authUserId && data.stage) {
      try {
        const result = await saveOnboardingData(authUserId, {
          stage: data.stage,
          date: data.dateKind === "none" ? null : data.dateIso,
          concerns: data.concerns,
          emotionalState: data.emotionalState,
          dailyCheckIn: data.dailyCheckIn,
          checkInTime: getCheckInTime(),
          seasonName: getSeasonName(),
          needsExtraCare: needsExtraCare(),
        });

        if (!result.success) {
          logger.warn("Onboarding sync failed (non-blocking)", "OnboardingSummaryNathia", {
            error: result.error,
          });
        }
      } catch (error) {
        logger.warn("Onboarding sync error (non-blocking)", "OnboardingSummaryNathia", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    navigation.navigate("OnboardingPaywall");
  }, [authUserId, data, getCheckInTime, getSeasonName, needsExtraCare, navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[nathColors.rosa.light, nathColors.cream]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="chevron-back" size={24} color={nathColors.text.muted} />
        </Pressable>

        <ProgressDots current={5} total={5} />

        <View style={styles.backButton} />
      </Animated.View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.titleSection}>
          <Title style={styles.title}>Tudo pronto! 🎉</Title>
          <Subtitle style={styles.subtitle}>Vou te acompanhar do seu jeito</Subtitle>
        </Animated.View>

        {/* Summary Cards */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Momento/Stage */}
          {stageCard && (
            <SummaryCard
              icon={stageCard.icon as React.ComponentProps<typeof Ionicons>["name"]}
              title={stageCard.title}
              subtitle={
                stage !== "GENERAL" && pregnancyWeek !== null
                  ? `Semana ${pregnancyWeek} da gestação`
                  : stage === "GENERAL"
                    ? "Foco em autocuidado e bem-estar"
                    : undefined
              }
              delay={200}
              highlight={true}
            />
          )}

          {/* Card 2: Preocupações */}
          {concernsText && (
            <SummaryCard
              icon="chatbubble-ellipses-outline"
              title="Vou focar em"
              subtitle={concernsText}
              delay={300}
            />
          )}

          {/* Card 3: Tom acolhedor (extra care) */}
          {showExtraCare && (
            <SummaryCard
              icon="heart-outline"
              title="Tom acolhedor sempre"
              subtitle="Você não está sozinha. CVV 188"
              delay={400}
            />
          )}

          {/* Card 4: Check-in diário */}
          {dailyCheckIn && (
            <SummaryCard
              icon="notifications-outline"
              title={`Check-in diário às ${checkInTime}`}
              delay={500}
            />
          )}

          {/* Card 5: Temporada */}
          {seasonName && (
            <SummaryCard
              icon="sparkles-outline"
              title={`Temporada "${seasonName}"`}
              subtitle="Sua jornada começa agora"
              delay={600}
            />
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <Animated.View
        entering={FadeInDown.delay(700).duration(400)}
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <Pressable
          onPress={handleContinue}
          style={styles.continueButton}
          accessibilityRole="button"
          accessibilityLabel="Vamos juntas"
        >
          <LinearGradient
            colors={[nathColors.rosa.DEFAULT, nathColors.azul.DEFAULT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <Body weight="bold" style={styles.continueButtonText}>
              Vamos juntas
            </Body>
            <Ionicons name="arrow-forward" size={20} color={nathColors.white} />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nathColors.cream,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  progressDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: nathColors.border,
  },

  dotFilled: {
    backgroundColor: nathColors.rosa.light,
  },

  dotActive: {
    backgroundColor: nathColors.rosa.DEFAULT,
    width: 24,
  },

  scrollContent: {
    paddingHorizontal: spacing.xl,
  },

  titleSection: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: nathColors.text.DEFAULT,
    marginBottom: spacing.xs,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: nathColors.text.muted,
  },

  cardsContainer: {
    gap: spacing.sm,
  },

  card: {
    backgroundColor: nathColors.white,
    borderColor: nathColors.rosa.light,
    paddingVertical: spacing.md,
  },

  cardHighlight: {
    backgroundColor: nathColors.rosa.light,
    borderColor: nathColors.rosa.DEFAULT,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: nathColors.rosa.light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  checkCircleHighlight: {
    backgroundColor: nathColors.rosa.DEFAULT,
  },

  cardTextContainer: {
    flex: 1,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardIcon: {
    marginRight: spacing.sm,
  },

  cardTitle: {
    fontSize: 14,
    color: nathColors.text.DEFAULT,
    flex: 1,
    lineHeight: 18,
  },

  cardTitleHighlight: {
    color: nathColors.text.DEFAULT,
  },

  cardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: nathColors.text.muted,
    lineHeight: 16,
    marginLeft: 22,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: "transparent",
  },

  continueButton: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
    ...shadows.lg,
  },

  continueButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },

  continueButtonText: {
    fontSize: 16,
    color: nathColors.white,
  },
});
