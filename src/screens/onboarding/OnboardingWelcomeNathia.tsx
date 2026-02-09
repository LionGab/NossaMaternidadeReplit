/**
 * OnboardingWelcomeNathia - Tela de boas-vindas
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Logo + título
 * - Citação inspiradora da Nathalia
 * - Avatar da NathIA com glow
 * - CTA principal
 */

import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect } from "react";
import { Pressable, StatusBar, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Body, Caption, Subtitle, Title } from "@/components/ui";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";

// Types
import { RootStackScreenProps } from "@/types/navigation";

// Utils
import { logger } from "@/utils/logger";

// Assets
const LOGO = require("../../../assets/logo.png");
const NATH_AVATAR = require("../../../assets/nathia-avatar.jpg");

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
};

type Props = RootStackScreenProps<"OnboardingWelcome">;

/** Citação inspiradora da Nathalia Valente */
const NATH_QUOTE = {
  text: "Você não precisa ter todas as respostas agora. Vamos descobrir juntas.",
  author: "Nathalia Valente",
};

/**
 * Avatar animado da Nathalia com glow pulsante
 */
function NathAvatarAnimated({ size = 80 }: { size?: number }) {
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [glowScale, glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.avatarGlow,
          { width: size * 1.5, height: size * 1.5, borderRadius: (size * 1.5) / 2 },
          glowStyle,
        ]}
      />
      <Image
        source={NATH_AVATAR}
        style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
        accessibilityLabel="Avatar da Nathalia Valente"
      />
    </View>
  );
}

export default function OnboardingWelcomeNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);
  const setWelcomeSkipped = useNathJourneyOnboardingStore((s) => s.setWelcomeSkipped);

  useEffect(() => {
    setCurrentScreen("OnboardingWelcome");
  }, [setCurrentScreen]);

  const handleStart = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWelcomeSkipped(false);
    logger.info("Onboarding welcome completed", "OnboardingWelcomeNathia");
    navigation.navigate("OnboardingJourneySelect");
  }, [navigation, setWelcomeSkipped]);

  const handleSkip = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWelcomeSkipped(true);
    logger.info("Onboarding welcome skipped", "OnboardingWelcomeNathia");
    navigation.navigate("OnboardingJourneySelect");
  }, [navigation, setWelcomeSkipped]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={nathColors.cream} />

      {/* Background Gradient */}
      <LinearGradient
        colors={[nathColors.rosa.light, nathColors.cream]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.logoSection}>
          <Image
            source={LOGO}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="Logo Nossa Maternidade"
          />
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.titleSection}>
          <Title style={styles.title}>Bem-vinda à{"\n"}Nossa Maternidade</Title>
          <Body style={styles.subtitle}>
            Um espaço seguro para você. Vamos personalizar sua experiência.
          </Body>
        </Animated.View>

        {/* Quote Card */}
        <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.quoteCard}>
          <NathAvatarAnimated size={64} />
          <View style={styles.quoteContent}>
            <Body style={styles.quoteText}>"{NATH_QUOTE.text}"</Body>
            <Caption style={styles.quoteAuthor}>— {NATH_QUOTE.author}</Caption>
          </View>
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View
        entering={FadeInUp.delay(800).duration(400)}
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        {/* Primary CTA */}
        <Pressable
          style={styles.primaryButton}
          onPress={handleStart}
          accessibilityLabel="Começar minha jornada"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={[nathColors.rosa.DEFAULT, nathColors.azul.DEFAULT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            <Subtitle style={styles.primaryButtonText}>Começar minha jornada</Subtitle>
          </LinearGradient>
        </Pressable>

        {/* Skip */}
        <Pressable
          style={styles.skipButton}
          onPress={handleSkip}
          accessibilityLabel="Responder depois"
          accessibilityRole="button"
        >
          <Caption style={styles.skipText}>Responder depois</Caption>
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

  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
  },

  logoSection: {
    alignItems: "center",
    marginBottom: spacing["3xl"],
  },

  logo: {
    width: 120,
    height: 120,
    borderRadius: radius.full,
  },

  titleSection: {
    marginBottom: spacing["2xl"],
  },

  title: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: nathColors.text.DEFAULT,
    marginBottom: spacing.md,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: nathColors.text.muted,
    textAlign: "center",
    maxWidth: 300,
    alignSelf: "center",
  },

  quoteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: nathColors.white,
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.md,
    borderWidth: 1,
    borderColor: nathColors.border,
  },

  quoteContent: {
    flex: 1,
  },

  quoteText: {
    fontSize: 14,
    fontStyle: "italic",
    color: nathColors.text.light,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },

  quoteAuthor: {
    fontSize: 12,
    fontWeight: "600",
    color: nathColors.rosa.DEFAULT,
    letterSpacing: 0.2,
  },

  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  avatarGlow: {
    position: "absolute",
    backgroundColor: nathColors.rosa.light,
  },

  avatarImage: {
    borderWidth: 3,
    borderColor: nathColors.white,
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },

  primaryButton: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
    marginBottom: spacing.md,
    ...shadows.lg,
  },

  primaryButtonGradient: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: nathColors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  skipButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },

  skipText: {
    color: nathColors.text.muted,
    fontSize: 14,
  },
});
