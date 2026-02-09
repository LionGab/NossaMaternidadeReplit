/**
 * Tela 3: OnboardingConcerns - "Compartilhe suas Preocupacoes"
 *
 * Flo Health Minimal Design:
 * - Subtle pink-to-white gradient background
 * - Clean selection cards with soft pink shadows
 * - Manrope typography throughout
 * - Animated progress indicator in header
 * - CTA button using OnboardingFooter
 * - Full dark mode support
 *
 * Features:
 * - Grid 2 colunas com 8 cards de preocupacoes
 * - Animated counter (0/3)
 * - Haptic feedback on selection
 * - Staggered card animations
 */

import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { ConcernCard } from "@/components/onboarding/ConcernCard";
import { DynamicHero } from "@/components/onboarding/hero/DynamicHero";
import { OnboardingFooter } from "@/components/onboarding/layout/OnboardingFooter";
import { OnboardingHeader } from "@/components/onboarding/layout/OnboardingHeader";
import { OnboardingLayout } from "@/components/onboarding/layout/OnboardingLayout";

import { getConcernsByJourney } from "@/config/expanded-onboarding-data";
import { CONCERN_CARDS } from "@/config/nath-journey-onboarding-data";
import { useOnboardingResponsive } from "@/hooks/useOnboardingResponsive";
import { useTheme } from "@/hooks/useTheme";
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { Tokens } from "@/theme/tokens";
import { ConcernCardData as ExpandedConcernCardData } from "@/types/expanded-onboarding.types";
import { ConcernCardData, OnboardingConcern } from "@/types/nath-journey-onboarding.types";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"OnboardingConcerns">;

// ===========================================
// CONSTANTS
// ===========================================

const TOTAL_STEPS = 7;
const CURRENT_STEP = 3;
const HERO_HEIGHT_PERCENT = 0.12;
const MAX_CONCERNS = 3;

// ===========================================
// COMPONENT
// ===========================================

export default function OnboardingConcerns({ navigation }: Props) {
  const theme = useTheme();
  const responsive = useOnboardingResponsive();
  const isDark = theme.isDark;

  // Store selectors
  const concerns = useNathJourneyOnboardingStore((s) => s.data.concerns);
  const journey = useNathJourneyOnboardingStore((s) => s.data.journey);
  const toggleConcern = useNathJourneyOnboardingStore((s) => s.toggleConcern);
  const canProceed = useNathJourneyOnboardingStore((s) => s.canProceed);
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);

  // Filtrar concerns por jornada selecionada (se disponivel)
  const concernCards = useMemo(() => {
    if (journey) {
      return getConcernsByJourney(journey);
    }
    return CONCERN_CARDS;
  }, [journey]);

  // Set current screen on mount
  useEffect(() => {
    setCurrentScreen("OnboardingConcerns");
  }, [setCurrentScreen]);

  // Progress
  const progress = useMemo(() => CURRENT_STEP / TOTAL_STEPS, []);

  // Responsive hero height
  const heroHeightPercent = useMemo(
    () => responsive.getHeroHeightPercent(HERO_HEIGHT_PERCENT),
    [responsive]
  );

  // Can proceed validation
  const isValid = useMemo(() => canProceed(), [canProceed]);

  // Flo Health Minimal gradient - subtle pink to white (dark mode aware)
  const backgroundGradient = useMemo(
    () =>
      isDark
        ? ([Tokens.neutral[900], Tokens.neutral[800]] as const)
        : ([Tokens.cleanDesign.pink[50], Tokens.neutral[0]] as const),
    [isDark]
  );

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectConcern = useCallback(
    (concern: OnboardingConcern) => {
      const willBeSelected = !concerns.includes(concern);
      const currentCount = concerns.length;

      // Haptic feedback - different for selection/deselection
      if (willBeSelected && currentCount < MAX_CONCERNS) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      } else if (!willBeSelected) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }

      toggleConcern(concern);
      logger.info(`Concern toggled: ${concern}`, "OnboardingConcerns");
    },
    [concerns, toggleConcern]
  );

  const handleContinue = useCallback(() => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    navigation.navigate("OnboardingEmotionalState");
  }, [isValid, navigation]);

  // Dynamic colors for dark mode - Flo Health Minimal style
  const titleColor = isDark ? Tokens.neutral[50] : Tokens.neutral[900];
  const subtitleColor = isDark ? Tokens.neutral[400] : Tokens.neutral[600];

  return (
    <OnboardingLayout
      gradient={backgroundGradient}
      scrollable={true}
      testID="onboarding-concerns-screen"
    >
      {/* Dynamic Hero - subtle in Flo style */}
      <DynamicHero variant="concerns" heightPercent={heroHeightPercent} />

      {/* Header with progress */}
      <View style={[styles.headerContainer, { marginTop: responsive.headerMarginTop }]}>
        <OnboardingHeader progress={progress} onBack={handleBack} showProgress={true} />
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingHorizontal: responsive.paddingHorizontal }]}>
        {/* Title section with Flo Health Minimal styling */}
        <Animated.View entering={FadeIn.delay(100).duration(400)}>
          <Text
            style={[
              styles.title,
              {
                fontSize: responsive.titleFontSize,
                lineHeight: responsive.titleLineHeight,
                color: titleColor,
                fontFamily: Tokens.typography.fontFamily.bold,
              },
            ]}
          >
            O que mais te pega agora?
          </Text>

          {/* Subtitle - Flo style */}
          <Text
            style={[
              styles.subtitle,
              {
                color: subtitleColor,
                fontFamily: Tokens.typography.fontFamily.base,
              },
            ]}
          >
            Escolha até 3 opções
          </Text>
        </Animated.View>

        {/* Counter - Texto inline discreto */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Text
            style={[
              styles.counterInline,
              {
                color: subtitleColor,
                fontFamily: Tokens.typography.fontFamily.base,
              },
            ]}
          >
            {concerns.length} de {MAX_CONCERNS} selecionados
          </Text>
        </Animated.View>

        {/* Concerns Grid with staggered animations - Flo Health Minimal card style */}
        <View style={[styles.grid, { gap: responsive.cardGap }]}>
          {concernCards.map((cardData, index) => {
            const concern = cardData.concern as OnboardingConcern;
            const isSelected = concerns.includes(concern);
            const isDisabled = !isSelected && concerns.length >= MAX_CONCERNS;

            // Adapta expanded card data para legacy format
            const legacyCardData: ConcernCardData = {
              concern,
              icon: cardData.icon,
              title: cardData.title,
              quote:
                "quote" in cardData
                  ? cardData.quote
                  : (cardData as ExpandedConcernCardData).nathQuote,
              gradient: cardData.gradient,
              iconColor: cardData.iconColor,
            };

            return (
              <Animated.View
                key={cardData.concern}
                entering={FadeInDown.delay(200 + index * 50).duration(400)}
                style={styles.cardWrapper}
              >
                <ConcernCard
                  data={legacyCardData}
                  isSelected={isSelected}
                  disabled={isDisabled}
                  onPress={() => handleSelectConcern(concern)}
                />
              </Animated.View>
            );
          })}
        </View>

        {/* Helper text - Flo style */}
        {concerns.length > 0 && concerns.length < MAX_CONCERNS && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text
              style={[
                styles.helperText,
                {
                  color: subtitleColor,
                  fontFamily: Tokens.typography.fontFamily.base,
                },
              ]}
            >
              Você pode escolher até {MAX_CONCERNS}
            </Text>
          </Animated.View>
        )}
        {concerns.length === MAX_CONCERNS && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text
              style={[
                styles.helperText,
                {
                  color: isDark ? Tokens.brand.accent[300] : Tokens.brand.accent[500],
                  fontFamily: Tokens.typography.fontFamily.medium,
                },
              ]}
            >
              Máximo selecionado! Remova um para trocar.
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Footer CTA - Flo Health Minimal style */}
      <OnboardingFooter
        label={
          concerns.length > 0 ? `Continuar (${concerns.length} de ${MAX_CONCERNS})` : "Continuar"
        }
        onPress={handleContinue}
        disabled={!isValid}
        showGlow={isValid}
      />
    </OnboardingLayout>
  );
}

// ===========================================
// STYLES - Flo Health Minimal Design
// ===========================================

const styles = StyleSheet.create({
  headerContainer: {
    // marginTop is set dynamically via responsive hook
  },
  content: {
    flex: 1,
    paddingTop: Tokens.spacing["2xl"],
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
    marginBottom: Tokens.spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Tokens.spacing["2xl"],
    opacity: 0.8,
  },
  counterInline: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: Tokens.spacing.lg,
    opacity: 0.7,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: Tokens.spacing["4xl"],
    gap: Tokens.spacing.md,
  },
  cardWrapper: {
    width: "48%",
    marginBottom: Tokens.spacing.sm,
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: Tokens.spacing.md,
    marginBottom: Tokens.spacing["3xl"],
    fontWeight: "600",
  },
});
