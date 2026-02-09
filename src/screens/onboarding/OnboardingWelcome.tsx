/**
 * Tela 0: OnboardingWelcome - "Portal de Entrada" v2
 *
 * Versão consolidada combinando os melhores elementos:
 * - BASE: Arquitetura com OnboardingLayout + OnboardingFooter
 * - PREMIUM: Animações otimizadas com useOptimizedAnimation
 * - REDESIGN: Tipografia serif para calor emocional
 * - VALENTE: QuoteCard com mensagem inspiradora da Nathalia
 *
 * Features:
 * - QuoteCard component (citação da Nathalia)
 * - NathAvatar component (avatar animado)
 * - AnimatedGlowWrapper para CTA
 * - useOptimizedAnimation (reduced motion support)
 * - useScreenTimeAnalytics (métricas de engajamento)
 * - Tipografia serif (Georgia) para calor emocional
 */

import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { DynamicHero } from "@/components/onboarding/hero/DynamicHero";
import { OnboardingFooter } from "@/components/onboarding/layout/OnboardingFooter";
import { OnboardingLayout } from "@/components/onboarding/layout/OnboardingLayout";

import { useOnboardingResponsive } from "@/hooks/useOnboardingResponsive";
import { useOptimizedAnimation } from "@/hooks/useOptimizedAnimation";
import { useScreenTimeAnalytics } from "@/hooks/useScreenTimeAnalytics";
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { Tokens } from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"OnboardingWelcome">;

// ===========================================
// CONSTANTS
// ===========================================

const LOGO = require("../../../assets/logo.png");
const NATH_AVATAR = require("../../../assets/nathia-avatar.jpg");
const HERO_HEIGHT_PERCENT = 0.32;

/** Citação inspiradora da Nathalia Valente */
const NATH_QUOTE = {
  text: "Você não precisa ter todas as respostas agora. Vamos descobrir juntas.",
  author: "Nathalia Valente",
} as const;

// ===========================================
// SUB-COMPONENTS
// ===========================================

interface NathAvatarProps {
  size?: number;
  shouldAnimate: boolean;
}

/**
 * Avatar animado da Nathalia com glow pulsante
 */
function NathAvatar({ size = 56, shouldAnimate }: NathAvatarProps) {
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (!shouldAnimate) {
      cancelAnimation(glowScale);
      cancelAnimation(glowOpacity);
      glowScale.value = 1;
      glowOpacity.value = 0.3;
      return;
    }

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      3,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      3,
      false
    );

    return () => {
      cancelAnimation(glowScale);
      cancelAnimation(glowOpacity);
    };
  }, [shouldAnimate, glowScale, glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>
      {/* Glow effect */}
      <Animated.View
        style={[styles.avatarGlow, { width: size * 1.4, height: size * 1.4 }, glowStyle]}
      />
      {/* Avatar image */}
      <Image
        source={NATH_AVATAR}
        style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
        accessibilityLabel="Avatar da Nathalia Valente"
      />
    </View>
  );
}

interface QuoteCardProps {
  quote: string;
  author: string;
  avatarSize?: number;
  shouldAnimate: boolean;
}

/**
 * Card de citação com avatar e texto inspiracional
 */
function QuoteCard({ quote, author, avatarSize = 48, shouldAnimate }: QuoteCardProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(300).duration(600).springify()}
      style={styles.quoteCard}
      accessibilityRole="text"
      accessibilityLabel={`Citação de ${author}: ${quote}`}
    >
      <NathAvatar size={avatarSize} shouldAnimate={shouldAnimate} />
      <View style={styles.quoteContent}>
        <Text style={styles.quoteText}>"{quote}"</Text>
        <Text style={styles.quoteAuthor}>— {author}</Text>
      </View>
    </Animated.View>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function OnboardingWelcome({ navigation }: Props) {
  // Responsive values
  const responsive = useOnboardingResponsive();

  // Animation hooks
  const { shouldAnimate } = useOptimizedAnimation();

  // Screen time tracking
  useScreenTimeAnalytics("OnboardingWelcome", {
    onLeave: (timeSpentMs) => {
      logger.info("OnboardingWelcome screen time", "OnboardingWelcome", {
        timeSpentMs,
        timeSpentSec: Math.round(timeSpentMs / 1000),
      });
    },
  });

  // Store
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);
  const setWelcomeSkipped = useNathJourneyOnboardingStore((s) => s.setWelcomeSkipped);

  // Set current screen on mount
  useEffect(() => {
    setCurrentScreen("OnboardingWelcome");
  }, [setCurrentScreen]);

  // Responsive hero height
  const heroHeightPercent = useMemo(
    () => responsive.getHeroHeightPercent(HERO_HEIGHT_PERCENT),
    [responsive]
  );

  // Handlers
  const handleStart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setWelcomeSkipped(false);
    logger.info("Onboarding welcome completed - user started", "OnboardingWelcome");
    navigation.navigate("OnboardingStage");
  }, [navigation, setWelcomeSkipped]);

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setWelcomeSkipped(true);
    logger.info("Onboarding welcome skipped", "OnboardingWelcome");
    navigation.navigate("OnboardingStage");
  }, [navigation, setWelcomeSkipped]);

  return (
    <OnboardingLayout
      gradient={[Tokens.brand.accent[50], Tokens.brand.primary[50]]}
      scrollable={false}
      keyboardAvoiding={false}
      testID="onboarding-welcome-screen"
    >
      {/* Dynamic Hero with logo */}
      <DynamicHero variant="welcome" heightPercent={heroHeightPercent} showLogo={false} />

      {/* Content */}
      <View style={[styles.content, { paddingHorizontal: responsive.paddingHorizontal }]}>
        {/* Logo */}
        <Animated.View entering={FadeIn.delay(200).duration(500)}>
          <Image
            source={LOGO}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="Logo Nossa Maternidade"
          />
        </Animated.View>

        {/* Title with serif typography */}
        <Animated.Text
          entering={FadeInUp.delay(400).duration(600).springify()}
          style={[
            styles.title,
            {
              fontSize: responsive.titleFontSize,
              lineHeight: responsive.titleLineHeight,
            },
          ]}
          accessibilityRole="header"
        >
          Bem-vinda à{"\n"}Nossa Maternidade
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={styles.subtitle}
        >
          Um espaço seguro para você. Vamos personalizar sua experiência.
        </Animated.Text>

        {/* Quote Card - Nathalia's message */}
        <QuoteCard
          quote={NATH_QUOTE.text}
          author={NATH_QUOTE.author}
          avatarSize={48}
          shouldAnimate={shouldAnimate}
        />
      </View>

      {/* Footer CTA */}
      <OnboardingFooter
        label="Começar minha jornada"
        onPress={handleStart}
        secondaryLabel="Responder depois"
        onSecondaryPress={handleSkip}
        showGlow={true}
        testID="onboarding-welcome-footer"
      />
    </OnboardingLayout>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Tokens.spacing["2xl"],
  },
  logo: {
    width: 120,
    height: 48,
    marginBottom: Tokens.spacing.lg,
  },
  title: {
    fontSize: 32,
    // Serif typography for emotional warmth (Georgia available cross-platform)
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "Georgia",
    }),
    fontWeight: "700",
    color: Tokens.neutral[900],
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: Tokens.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Tokens.typography.fontFamily.medium,
    fontWeight: "500",
    color: Tokens.neutral[600],
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: Tokens.spacing.xl,
  },
  // QuoteCard styles
  quoteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Tokens.neutral[0],
    borderRadius: Tokens.radius.xl,
    padding: Tokens.spacing.md,
    marginTop: Tokens.spacing.sm,
    // Soft shadow
    shadowColor: Tokens.brand.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  quoteContent: {
    flex: 1,
    marginLeft: Tokens.spacing.md,
  },
  quoteText: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "Georgia",
    }),
    fontStyle: "italic",
    color: Tokens.neutral[700],
    lineHeight: 22,
    marginBottom: Tokens.spacing.xs,
  },
  quoteAuthor: {
    fontSize: 12,
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontWeight: "600",
    color: Tokens.brand.accent[500],
    letterSpacing: 0.2,
  },
  // NathAvatar styles
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarGlow: {
    position: "absolute",
    backgroundColor: Tokens.brand.accent[200],
    borderRadius: 999,
  },
  avatarImage: {
    borderWidth: 2,
    borderColor: Tokens.neutral[0],
  },
});
