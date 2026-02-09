/**
 * DynamicHero - Hero visual contextual para cada tela de onboarding
 *
 * Features:
 * - Variantes visuais por tela (welcome, stage, date, etc.)
 * - Gradientes aurora animados
 * - Formas flutuantes (bubbles)
 * - Logo opcional
 * - Responsivo ao tamanho da tela
 *
 * @example
 * <DynamicHero variant="welcome" showLogo />
 * <DynamicHero variant="stage" height={200} />
 */

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Tokens } from "@/theme/tokens";
import { FloatingEmojis } from "../decorations/FloatingEmojis";
import { Sparkles } from "../decorations/Sparkles";

// ===========================================
// TYPES
// ===========================================

export type HeroVariant =
  | "welcome"
  | "stage"
  | "date"
  | "concerns"
  | "emotional"
  | "checkin"
  | "season"
  | "summary"
  | "paywall";

export interface DynamicHeroProps {
  /** Visual variant for the hero */
  variant: HeroVariant;
  /** Whether to show the logo */
  showLogo?: boolean;
  /** Custom height (default: 40% of screen) */
  height?: number;
  /** Height as percentage of screen (0-1) */
  heightPercent?: number;
  /** Whether to show floating emojis (default: true for welcome variant) */
  showFloatingEmojis?: boolean;
  /** Whether to show sparkles (default: true for welcome variant) */
  showSparkles?: boolean;
  /** Test ID for e2e testing */
  testID?: string;
}

// ===========================================
// CONSTANTS
// ===========================================

const LOGO = require("../../../../assets/logo.png");

interface VariantConfig {
  gradient: readonly [string, string, string];
  bubblePrimary: string;
  bubbleSecondary: string;
  bubblePrimaryOpacity: number;
  bubbleSecondaryOpacity: number;
}

const VARIANT_CONFIGS: Record<HeroVariant, VariantConfig> = {
  welcome: {
    gradient: [Tokens.brand.accent[300], Tokens.brand.primary[100], Tokens.brand.accent[50]],
    bubblePrimary: Tokens.nathAccent.roseLight,
    bubbleSecondary: Tokens.brand.primary[200],
    bubblePrimaryOpacity: 0.35,
    bubbleSecondaryOpacity: 0.25,
  },
  stage: {
    gradient: [Tokens.brand.primary[200], Tokens.brand.accent[100], Tokens.brand.primary[50]],
    bubblePrimary: Tokens.brand.primary[300],
    bubbleSecondary: Tokens.brand.accent[200],
    bubblePrimaryOpacity: 0.3,
    bubbleSecondaryOpacity: 0.2,
  },
  date: {
    gradient: [Tokens.brand.secondary[200], Tokens.brand.accent[100], Tokens.brand.secondary[50]],
    bubblePrimary: Tokens.brand.secondary[300],
    bubbleSecondary: Tokens.brand.accent[200],
    bubblePrimaryOpacity: 0.3,
    bubbleSecondaryOpacity: 0.2,
  },
  concerns: {
    gradient: [Tokens.brand.teal[200], Tokens.brand.primary[100], Tokens.brand.teal[50]],
    bubblePrimary: Tokens.brand.teal[300],
    bubbleSecondary: Tokens.brand.primary[200],
    bubblePrimaryOpacity: 0.3,
    bubbleSecondaryOpacity: 0.2,
  },
  emotional: {
    gradient: [Tokens.brand.accent[200], Tokens.brand.secondary[100], Tokens.brand.accent[50]],
    bubblePrimary: Tokens.brand.accent[300],
    bubbleSecondary: Tokens.brand.secondary[200],
    bubblePrimaryOpacity: 0.35,
    bubbleSecondaryOpacity: 0.25,
  },
  checkin: {
    gradient: [Tokens.brand.primary[200], Tokens.brand.teal[100], Tokens.brand.primary[50]],
    bubblePrimary: Tokens.brand.primary[300],
    bubbleSecondary: Tokens.brand.teal[200],
    bubblePrimaryOpacity: 0.3,
    bubbleSecondaryOpacity: 0.2,
  },
  season: {
    gradient: [Tokens.brand.accent[200], Tokens.brand.primary[100], Tokens.brand.accent[50]],
    bubblePrimary: Tokens.brand.accent[300],
    bubbleSecondary: Tokens.brand.primary[200],
    bubblePrimaryOpacity: 0.3,
    bubbleSecondaryOpacity: 0.2,
  },
  summary: {
    gradient: [Tokens.brand.primary[200], Tokens.brand.accent[100], Tokens.brand.primary[50]],
    bubblePrimary: Tokens.brand.primary[300],
    bubbleSecondary: Tokens.brand.accent[200],
    bubblePrimaryOpacity: 0.25,
    bubbleSecondaryOpacity: 0.2,
  },
  paywall: {
    gradient: [
      Tokens.premium.gradient.top,
      Tokens.premium.gradient.mid,
      Tokens.premium.gradient.bottom,
    ],
    bubblePrimary: Tokens.brand.accent[400],
    bubbleSecondary: Tokens.brand.primary[400],
    bubblePrimaryOpacity: 0.2,
    bubbleSecondaryOpacity: 0.15,
  },
};

// ===========================================
// COMPONENT
// ===========================================

export function DynamicHero({
  variant,
  showLogo = false,
  height,
  heightPercent = 0.35,
  showFloatingEmojis = variant === "welcome",
  showSparkles = variant === "welcome",
  testID,
}: DynamicHeroProps) {
  const { height: screenHeight } = useWindowDimensions();

  const computedHeight = useMemo(
    () => height ?? screenHeight * heightPercent,
    [height, screenHeight, heightPercent]
  );

  const config = VARIANT_CONFIGS[variant];

  return (
    <Animated.View
      entering={FadeIn.duration(800)}
      style={[styles.container, { height: computedHeight }]}
      testID={testID}
    >
      {/* Gradient background */}
      <LinearGradient
        colors={config.gradient as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Floating bubbles */}
      <View style={styles.shapesContainer}>
        <Animated.View
          entering={FadeInUp.delay(200).duration(600)}
          style={[
            styles.bubbleLarge,
            {
              backgroundColor: config.bubblePrimary,
              opacity: config.bubblePrimaryOpacity,
            },
          ]}
        />
        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          style={[
            styles.bubbleSmall,
            {
              backgroundColor: config.bubbleSecondary,
              opacity: config.bubbleSecondaryOpacity,
            },
          ]}
        />
        <Animated.View
          entering={FadeInUp.delay(300).duration(600)}
          style={[
            styles.bubbleTiny,
            {
              backgroundColor: config.bubblePrimary,
              opacity: config.bubbleSecondaryOpacity,
            },
          ]}
        />
      </View>

      {/* Floating emojis (Rosa Suave + Azul Tiffany theme) */}
      {showFloatingEmojis && (
        <FloatingEmojis animated={true} testID={`${testID}-floating-emojis`} />
      )}

      {/* Sparkles effect */}
      {showSparkles && (
        <View style={styles.sparklesContainer}>
          <Sparkles animated={true} testID={`${testID}-sparkles`} />
        </View>
      )}

      {/* Optional logo */}
      {showLogo && (
        <Animated.View entering={FadeIn.delay(500).duration(500)}>
          <Image
            source={LOGO}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="Logo Nossa Maternidade"
          />
        </Animated.View>
      )}
    </Animated.View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  shapesContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleLarge: {
    width: 200,
    height: 200,
    borderRadius: 100,
    transform: [{ translateY: 20 }],
  },
  bubbleSmall: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    transform: [{ translateY: -30 }, { translateX: 90 }],
  },
  bubbleTiny: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    transform: [{ translateY: 50 }, { translateX: -100 }],
  },
  logo: {
    position: "absolute",
    width: 140,
    height: 56,
    alignSelf: "center",
    bottom: 40,
  },
  sparklesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

// ===========================================
// EXPORTS
// ===========================================

export default DynamicHero;
