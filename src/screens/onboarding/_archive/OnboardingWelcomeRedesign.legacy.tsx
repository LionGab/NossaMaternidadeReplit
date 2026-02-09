/**
 * OnboardingWelcome - Flo Health Minimal Design
 *
 * Design Concept: "Warm Welcome"
 * A clean, elegant onboarding experience inspired by Flo Health's minimal design.
 *
 * Design Principles:
 * - Full-screen elegant design with subtle pink-to-white gradient
 * - Serif typography (Georgia) for emotional welcome messages
 * - Manrope for body text and UI elements
 * - Clean CTA button at bottom using Button component with 'accent' variant
 * - Minimal decorative elements - no heavy particles
 * - Warm and inviting atmosphere
 *
 * @example
 * ```tsx
 * <OnboardingWelcomeRedesign navigation={navigation} />
 * ```
 */

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { Tokens } from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";

// ===========================================
// DESIGN TOKENS (from theme/tokens)
// ===========================================

const COLORS = {
  // Text colors from Tokens
  textPrimary: Tokens.text.light.primary,
  textSecondary: Tokens.text.light.secondary,
  textTertiary: Tokens.text.light.tertiary,

  // Brand accent for highlights
  accent: Tokens.brand.accent[500],
  accentLight: Tokens.brand.accent[100],
  accentSoft: Tokens.brand.accent[50],

  // Surfaces
  white: Tokens.neutral[0],
  surface: Tokens.surface.light.base,

  // Gradient colors (pink to white)
  gradientStart: Tokens.brand.accent[50], // Soft pink
  gradientMid: Tokens.maternal.warmth.blush, // Almost white with pink tint
  gradientEnd: Tokens.neutral[0], // Pure white
};

// ===========================================
// TYPOGRAPHY (Georgia serif + Manrope sans)
// ===========================================

const TYPOGRAPHY = {
  // Serif for emotional titles (Georgia)
  serifFamily: Platform.OS === "ios" ? "Georgia" : "serif",

  // Sans-serif for body (Manrope)
  sansFamily: Tokens.typography.fontFamily.base,
  sansMedium: Tokens.typography.fontFamily.medium,
  sansSemibold: Tokens.typography.fontFamily.semibold,
};

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"OnboardingWelcome">;

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function OnboardingWelcomeRedesign({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);

  useEffect(() => {
    setCurrentScreen("OnboardingWelcome");
  }, [setCurrentScreen]);

  const handleStart = useCallback(() => {
    logger.info("Onboarding welcome completed", "OnboardingWelcomeRedesign");
    navigation.navigate("OnboardingStage");
  }, [navigation]);

  return (
    <View style={styles.container} testID="onboarding-welcome-screen">
      {/* Subtle Gradient Background (Pink to White) */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Main Content */}
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Avatar */}
          <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require("../../../assets/onboarding/images/nath-profile-small.jpg")}
                style={styles.avatar}
                contentFit="cover"
                transition={300}
              />
            </View>
          </Animated.View>

          {/* Welcome Title (Serif) */}
          <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.titleContainer}>
            <Text style={styles.welcomeTitle}>Seja Bem-Vinda</Text>
            <Text style={styles.welcomeSubtitle}>ao seu espaco de acolhimento</Text>
          </Animated.View>

          {/* Personal Message (Sans-serif) */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.messageContainer}
          >
            <Text style={styles.personalMessage}>
              Sou a <Text style={styles.messageHighlight}>Nathalia</Text>, e criei este espaco
              especialmente para voce.
            </Text>
            <Text style={styles.personalMessageSecondary}>
              Aqui, cada momento da sua jornada sera acolhido com carinho e compreensao.
            </Text>
          </Animated.View>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Decorative Element - Subtle Line */}
        <Animated.View entering={FadeIn.delay(500).duration(400)} style={styles.decorativeLine} />

        {/* Bottom Section */}
        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.bottomSection}>
          {/* Promise Text */}
          <Text style={styles.promiseText}>
            Sua jornada e unica, e estaremos juntas em cada passo.
          </Text>

          {/* CTA Button */}
          <View style={styles.buttonContainer}>
            <Button
              variant="accent"
              size="lg"
              fullWidth
              onPress={handleStart}
              icon="arrow-forward"
              iconPosition="right"
              accessibilityLabel="Comecar minha jornada"
            >
              Comecar Minha Jornada
            </Button>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>
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
    backgroundColor: COLORS.white,
  },

  content: {
    flex: 1,
    paddingHorizontal: Tokens.spacing["2xl"],
  },

  // Hero Section
  heroSection: {
    alignItems: "center",
    paddingTop: Tokens.spacing["3xl"],
  },

  // Avatar
  avatarContainer: {
    marginBottom: Tokens.spacing["3xl"],
  },

  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    padding: 3,
    ...Tokens.shadows.md,
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 47,
  },

  // Title
  titleContainer: {
    alignItems: "center",
    marginBottom: Tokens.spacing["2xl"],
  },

  welcomeTitle: {
    fontSize: 36,
    lineHeight: 44,
    fontFamily: TYPOGRAPHY.serifFamily,
    fontWeight: "400",
    color: COLORS.textPrimary,
    textAlign: "center",
    letterSpacing: -0.5,
  },

  welcomeSubtitle: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: TYPOGRAPHY.serifFamily,
    fontWeight: "400",
    fontStyle: "italic",
    color: COLORS.accent,
    textAlign: "center",
    marginTop: Tokens.spacing.sm,
  },

  // Message
  messageContainer: {
    alignItems: "center",
    paddingHorizontal: Tokens.spacing.lg,
  },

  personalMessage: {
    fontSize: 17,
    lineHeight: 26,
    fontFamily: TYPOGRAPHY.sansFamily,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  personalMessageSecondary: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: TYPOGRAPHY.sansFamily,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginTop: Tokens.spacing.md,
  },

  messageHighlight: {
    fontFamily: TYPOGRAPHY.sansSemibold,
    color: COLORS.textPrimary,
  },

  // Spacer
  spacer: {
    flex: 1,
    minHeight: Tokens.spacing["4xl"],
  },

  // Decorative Line
  decorativeLine: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.accentLight,
    alignSelf: "center",
    marginBottom: Tokens.spacing["3xl"],
    borderRadius: 1,
  },

  // Bottom Section
  bottomSection: {
    alignItems: "center",
  },

  promiseText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: TYPOGRAPHY.sansMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: Tokens.spacing["2xl"],
    paddingHorizontal: Tokens.spacing.lg,
  },

  buttonContainer: {
    width: "100%",
    marginBottom: Tokens.spacing["2xl"],
  },

  // Progress Indicator
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing.sm,
    marginBottom: Tokens.spacing.lg,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accentLight,
  },

  progressDotActive: {
    width: 24,
    backgroundColor: COLORS.accent,
  },
});
