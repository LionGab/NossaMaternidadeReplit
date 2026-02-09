/**
 * Tela 7: OnboardingSummary - "Sua Jornada"
 *
 * Flo Health Minimal Design Redesign:
 * - Clean summary cards with checkmark icons for completed items
 * - Subtle pink-to-white gradient background
 * - Generous whitespace and minimal visual noise
 * - Typography-focused hierarchy
 * - Button component for CTA
 *
 * Features:
 * - Summary cards showing user selections
 * - Personalized journey recap
 * - Sync to backend (local-first)
 */

import React, { useCallback, useEffect, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { differenceInWeeks, parseISO } from "date-fns";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Button } from "@/components/ui/Button";
import { OnboardingHeader } from "@/components/onboarding/layout/OnboardingHeader";

import { saveOnboardingData } from "@/api/onboarding-service";
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { useAppStore } from "@/state";
import { STAGE_CARDS } from "@/config/nath-journey-onboarding-data";
import { Tokens } from "@/theme/tokens";
import { logger } from "@/utils/logger";
import { RootStackScreenProps } from "@/types/navigation";
import { OnboardingConcern } from "@/types/nath-journey-onboarding.types";

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"OnboardingSummary">;

interface SummaryCardProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  delay?: number;
  highlight?: boolean;
}

// ===========================================
// CONSTANTS
// ===========================================

const TOTAL_STEPS = 7;
const CURRENT_STEP = 7;
const FALLBACK_STAGE_ICON: React.ComponentProps<typeof Ionicons>["name"] = "heart";

const CONCERN_LABELS: Record<OnboardingConcern, string> = {
  ANSIEDADE_MEDO: "Ansiedade e medo",
  FALTA_INFORMACAO: "Falta de informacao",
  SINTOMAS_FISICOS: "Sintomas fisicos",
  MUDANCAS_CORPO: "Mudancas no corpo",
  RELACIONAMENTO: "Relacionamento",
  TRABALHO_MATERNIDADE: "Trabalho e maternidade",
  SOLIDAO: "Solidao",
  FINANCAS: "Financas",
};

// ===========================================
// HELPERS
// ===========================================

function resolveIoniconName(icon: string): React.ComponentProps<typeof Ionicons>["name"] {
  if (Object.prototype.hasOwnProperty.call(Ionicons.glyphMap, icon)) {
    return icon as React.ComponentProps<typeof Ionicons>["name"];
  }
  logger.warn("Invalid Ionicons icon name", "OnboardingSummary", { icon });
  return FALLBACK_STAGE_ICON;
}

// ===========================================
// SUMMARY CARD COMPONENT
// ===========================================

function SummaryCard({ icon, title, subtitle, delay = 0, highlight = false }: SummaryCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={[styles.card, highlight && styles.cardHighlight]}
    >
      <View style={styles.cardContent}>
        {/* Checkmark circle */}
        <View style={[styles.checkCircle, highlight && styles.checkCircleHighlight]}>
          <Ionicons
            name="checkmark"
            size={16}
            color={highlight ? Tokens.neutral[0] : Tokens.brand.accent[500]}
          />
        </View>

        {/* Text content */}
        <View style={styles.cardTextContainer}>
          <View style={styles.cardTitleRow}>
            <Ionicons
              name={icon}
              size={18}
              color={highlight ? Tokens.brand.accent[600] : Tokens.neutral[600]}
              style={styles.cardIcon}
            />
            <Text style={[styles.cardTitle, highlight && styles.cardTitleHighlight]}>{title}</Text>
          </View>
          {subtitle && (
            <Text style={styles.cardSubtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function OnboardingSummary({ navigation }: Props) {
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

  // Progress
  const progress = useMemo(() => CURRENT_STEP / TOTAL_STEPS, []);

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
          "OnboardingSummary",
          error instanceof Error ? error : new Error(String(error))
        );
        return null;
      }
    }
    return null;
  }, [stage, date]);

  // Stage card data
  const stageCard = useMemo(() => STAGE_CARDS.find((card) => card.stage === stage), [stage]);
  const stageIconName = stageCard ? resolveIoniconName(stageCard.icon) : FALLBACK_STAGE_ICON;

  // Is extra care needed?
  const showExtraCare = needsExtraCare();

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleContinue = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    // Opportunistic sync (local-first): only try if logged in; don't block UX
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
          logger.warn("Onboarding sync failed (non-blocking)", "OnboardingSummary", {
            error: result.error,
          });
        } else {
          logger.info("Onboarding sync success", "OnboardingSummary");
        }
      } catch (error) {
        logger.warn("Onboarding sync error (non-blocking)", "OnboardingSummary", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      logger.info("Skipping onboarding sync (no auth)", "OnboardingSummary");
    }

    navigation.navigate("OnboardingPaywall");
  }, [authUserId, data, getCheckInTime, getSeasonName, needsExtraCare, navigation]);

  // Build concerns string
  const concernsText = useMemo(() => {
    if (concerns.length === 0) return null;
    return concerns.map((c) => CONCERN_LABELS[c as OnboardingConcern]).join(", ");
  }, [concerns]);

  return (
    <View style={styles.container}>
      {/* Background gradient - pink to white */}
      <LinearGradient
        colors={[Tokens.cleanDesign.pink[50], Tokens.neutral[0]]}
        locations={[0, 0.6]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Safe area container */}
      <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
        {/* Header */}
        <OnboardingHeader progress={progress} onBack={handleBack} showProgress={true} />

        {/* Scrollable content */}
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Title section */}
          <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.titleSection}>
            <Text style={styles.title}>Tudo pronto!</Text>
            <Text style={styles.subtitle}>Vou te acompanhar do seu jeito</Text>
          </Animated.View>

          {/* Summary cards */}
          <View style={styles.cardsContainer}>
            {/* Card 1: Momento/Stage */}
            {stageCard && (
              <SummaryCard
                icon={stageIconName}
                title={stageCard.title}
                subtitle={
                  stage !== "GENERAL" && pregnancyWeek !== null
                    ? `Semana ${pregnancyWeek} da gestacao`
                    : stage === "GENERAL"
                      ? "Foco em autocuidado e bem-estar"
                      : undefined
                }
                delay={200}
                highlight={true}
              />
            )}

            {/* Card 2: Preocupacoes */}
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
                subtitle="Voce nao esta sozinha. CVV 188"
                delay={400}
              />
            )}

            {/* Card 4: Check-in diario */}
            {dailyCheckIn && (
              <SummaryCard
                icon="notifications-outline"
                title={`Check-in diario as ${checkInTime}`}
                delay={500}
              />
            )}

            {/* Card 5: Temporada */}
            {seasonName && (
              <SummaryCard
                icon="sparkles-outline"
                title={`Temporada "${seasonName}"`}
                subtitle="Sua jornada comeca agora"
                delay={600}
              />
            )}
          </View>
        </Animated.ScrollView>

        {/* Footer CTA */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(400)}
          style={[styles.footer, { paddingBottom: insets.bottom + Tokens.spacing.lg }]}
        >
          <Button
            variant="glow"
            size="lg"
            fullWidth
            onPress={handleContinue}
            icon="arrow-forward"
            iconPosition="right"
          >
            Vamos juntas
          </Button>
        </Animated.View>
      </View>
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.neutral[0],
  },
  safeContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Tokens.cleanDesign.spacing.screenPadding,
  },
  titleSection: {
    marginTop: Tokens.spacing["2xl"],
    marginBottom: Tokens.spacing["3xl"],
  },
  title: {
    fontSize: 32,
    fontFamily: Tokens.typography.fontFamily.bold,
    fontWeight: "700",
    color: Tokens.neutral[900],
    letterSpacing: -0.5,
    marginBottom: Tokens.spacing.sm,
  },
  subtitle: {
    fontSize: Tokens.typography.bodyLarge.fontSize,
    fontFamily: Tokens.typography.fontFamily.base,
    color: Tokens.neutral[500],
    lineHeight: 24,
  },
  cardsContainer: {
    gap: Tokens.spacing.md,
    paddingBottom: Tokens.spacing.xl,
  },
  card: {
    backgroundColor: Tokens.neutral[0],
    borderRadius: Tokens.radius["2xl"],
    padding: Tokens.spacing.lg,
    borderWidth: 1,
    borderColor: Tokens.cleanDesign.pink[100],
    ...Tokens.shadows.flo.soft,
  },
  cardHighlight: {
    backgroundColor: Tokens.cleanDesign.pink[50],
    borderColor: Tokens.cleanDesign.pink[200],
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Tokens.cleanDesign.pink[100],
    alignItems: "center",
    justifyContent: "center",
    marginRight: Tokens.spacing.md,
  },
  checkCircleHighlight: {
    backgroundColor: Tokens.brand.accent[500],
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    marginRight: Tokens.spacing.sm,
  },
  cardTitle: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontWeight: "600",
    color: Tokens.neutral[800],
    flex: 1,
  },
  cardTitleHighlight: {
    color: Tokens.neutral[900],
  },
  cardSubtitle: {
    marginTop: Tokens.spacing.xs,
    fontSize: Tokens.typography.bodySmall.fontSize,
    fontFamily: Tokens.typography.fontFamily.base,
    color: Tokens.neutral[500],
    lineHeight: 20,
    marginLeft: 26, // Align with title (icon width + margin)
  },
  footer: {
    paddingHorizontal: Tokens.cleanDesign.spacing.screenPadding,
    paddingTop: Tokens.spacing.lg,
    backgroundColor: "transparent",
  },
});
