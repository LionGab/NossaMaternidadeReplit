/**
 * OnboardingWelcomePremium - Tela de boas-vindas estilo "cinema"
 *
 * Mobile-First: iOS + Android (App Store / Google Play)
 *
 * Features:
 * - Hero abstrato (gradiente aurora, sem foto)
 * - Overlay gradient suave
 * - Botão 60px com glow pulsante
 * - Typography refinada premium (Manrope)
 * - Animações staggered elegantes (Reanimated v4)
 * - Acessibilidade WCAG AAA (tap targets 44px+)
 *
 * Performance:
 *  * - Reanimated v4 para animações 60fps
 * - Platform-specific shadow handling
 *
 * Layout:
 * - Background gradient (tela inteira): Tokens.brand.accent[50] → Tokens.brand.primary[50]
 * - Hero image: 50% altura da tela, contentFit="cover"
 * - Overlay gradient: 40% inferior do hero com aurora pink
 */

import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo } from "react";
import { Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useOptimizedAnimation } from "../../hooks/useOptimizedAnimation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { Tokens } from "../../theme/tokens";
import { RootStackScreenProps } from "../../types/navigation";
import { logger } from "../../utils/logger";

type Props = RootStackScreenProps<"OnboardingWelcome">;

const LOGO = require("../../../assets/logo.png");

export default function OnboardingWelcomePremium({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();
  const { height: screenHeight } = useWindowDimensions();

  // Calculate hero height reactively based on screen size (40% for more content space)
  const heroHeight = useMemo(() => screenHeight * 0.4, [screenHeight]);

  // Glow animation for button (Reanimated v4)
  const glowOpacity = useSharedValue(0.4);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    setCurrentScreen("OnboardingWelcome");
  }, [setCurrentScreen]);

  // Start pulsating glow animation - respects reduced motion and app state
  useEffect(() => {
    // Pause animations when app is in background or reduced motion
    if (!shouldAnimate || !isActive) {
      cancelAnimation(glowOpacity);
      cancelAnimation(glowScale);
      glowOpacity.value = 0.6;
      glowScale.value = 1;
      return;
    }

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      false
    );
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      false
    );

    return () => {
      cancelAnimation(glowOpacity);
      cancelAnimation(glowScale);
    };
  }, [glowOpacity, glowScale, shouldAnimate, isActive, maxIterations]);

  // Animated glow style (halo view behind button)
  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const handleStart = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    logger.info("Onboarding welcome premium completed", "OnboardingWelcomePremium");
    navigation.navigate("OnboardingStage");
  }, [navigation]);

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    logger.info("Onboarding welcome skipped", "OnboardingWelcomePremium");
    navigation.navigate("OnboardingStage");
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Background gradient (full screen) */}
      <LinearGradient
        colors={[Tokens.brand.accent[50], Tokens.brand.primary[50]]}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />

      {/* Hero abstrato (top ~45%) */}
      <Animated.View
        entering={FadeIn.duration(800)}
        style={[styles.heroContainer, { height: heroHeight }]}
      >
        <LinearGradient
          colors={[
            Tokens.gradients.accentVibrant[0],
            Tokens.brand.primary[100],
            Tokens.brand.accent[50],
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroAura}
        />
        <View style={styles.heroShapes}>
          <View style={styles.heroBubbleLarge} />
          <View style={styles.heroBubbleSmall} />
        </View>
        <Image
          source={LOGO}
          style={styles.heroLogo}
          contentFit="contain"
          accessibilityLabel="Logo Nossa Maternidade"
        />
      </Animated.View>

      {/* Content - ScrollView for small screens */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          <Image
            source={LOGO}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="Logo Nossa Maternidade"
          />
          {/* Greeting (eyebrow) */}
          <Animated.Text
            entering={FadeInUp.delay(400).duration(600).springify()}
            style={styles.greeting}
            accessibilityRole="header"
          >
            Oi, eu sou a Nath 💜
          </Animated.Text>

          {/* Title */}
          <Animated.Text
            entering={FadeInUp.delay(500).duration(600).springify()}
            style={styles.title}
            accessibilityRole="header"
          >
            Vamos começar sua jornada
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            entering={FadeInUp.delay(600).duration(600).springify()}
            style={styles.subtitle}
          >
            Me diga em que fase você está da maternidade.{"\n"}Leva menos de 1 minuto.
          </Animated.Text>
        </View>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + Tokens.spacing.xl,
            },
          ]}
        >
          {/* CTA Button with glow */}
          <Animated.View
            entering={FadeInDown.delay(700).duration(600).springify()}
            style={styles.buttonContainer}
          >
            {/* Glow halo (animated) */}
            <Animated.View style={[styles.buttonGlow, glowAnimatedStyle]} />

            {/* Button */}
            <Pressable
              onPress={handleStart}
              style={styles.button}
              accessibilityLabel="Começar onboarding"
              accessibilityRole="button"
              accessibilityHint="Inicia o processo de configuração do app"
            >
              <LinearGradient
                colors={Tokens.gradients.accentVibrant}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Começar agora</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Secondary - less prominent */}
          <Animated.View entering={FadeIn.delay(800).duration(400)}>
            <Pressable
              onPress={handleSkip}
              style={styles.skipButton}
              accessibilityLabel="Responder onboarding depois"
              accessibilityRole="button"
              hitSlop={{ top: 12, bottom: 12, left: 20, right: 20 }}
            >
              <Text style={styles.skipText}>Responder depois</Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Tokens.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  heroContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  heroAura: {
    flex: 1,
  },
  heroShapes: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  heroBubbleLarge: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Tokens.nathAccent.roseLight,
    opacity: 0.3,
    transform: [{ translateY: 20 }],
  },
  heroBubbleSmall: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Tokens.brand.primary[200],
    opacity: 0.25,
    transform: [{ translateY: -10 }, { translateX: 80 }],
  },
  heroLogo: {
    position: "absolute",
    width: 140,
    height: 56,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: Tokens.spacing["2xl"], // 24
    paddingBottom: Tokens.spacing["3xl"], // 32
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    color: Tokens.brand.accent[500],
    letterSpacing: 0,
    marginBottom: Tokens.spacing.sm, // 8
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    fontFamily: "Manrope_800ExtraBold",
    color: Tokens.neutral[900],
    lineHeight: 42,
    letterSpacing: -0.8,
    marginBottom: Tokens.spacing.md, // 12
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
    color: Tokens.neutral[600],
    lineHeight: 24,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: Tokens.spacing["2xl"], // 24
    gap: Tokens.spacing.md, // 12 - tighter for better visual hierarchy
  },
  logo: {
    width: 120,
    height: 48,
    marginBottom: Tokens.spacing.lg,
  },
  buttonContainer: {
    position: "relative",
    alignItems: "center",
  },
  buttonGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Tokens.radius["3xl"], // 28
    backgroundColor: Tokens.brand.accent[400],
  },
  button: {
    width: "100%",
    borderRadius: Tokens.radius["3xl"], // 28
    overflow: "hidden",
    ...Tokens.shadows.md,
    // Platform-specific shadow
    ...(Platform.OS === "android" ? { elevation: 4 } : {}),
    zIndex: 1,
  },
  buttonGradient: {
    paddingVertical: Tokens.spacing.xl, // 20
    paddingHorizontal: Tokens.spacing["2xl"], // 24
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60, // >= Tokens.accessibility.minTapTarget
  },
  buttonText: {
    color: Tokens.neutral[0],
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.3,
  },
  skipButton: {
    paddingVertical: Tokens.spacing.sm, // 8
    alignItems: "center",
    minHeight: Tokens.accessibility.minTapTarget, // 44
    justifyContent: "center",
  },
  skipText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
    color: Tokens.neutral[400],
  },
} as const;
