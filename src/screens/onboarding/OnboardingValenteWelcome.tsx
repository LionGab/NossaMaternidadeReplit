/**
 * OnboardingValenteWelcome - Tela de Boas-Vindas ao Movimento Valente
 *
 * Design Philosophy: ULTRA MINIMALISTA
 * - Fundo: Rosa clean degradê suavíssimo
 * - Tipografia: Manrope grande e impactante
 * - Animações: Sutis e elegantes
 * - Sensação: Pertencimento a algo maior
 *
 * Fluxo:
 * 1. Tela de impacto com a mensagem principal
 * 2. Quote autêntica da Nath
 * 3. CTA convidativo para fazer parte
 *
 * @version 1.0 - Janeiro 2026
 */

import React, { useCallback, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Platform, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

import { brand, neutral, typography, spacing, radius } from "../../theme/tokens";
import { ONBOARDING_MESSAGES } from "../../config/valente-movement-concept";
import { PressableScale } from "../../components/ui";
import type { RootStackScreenProps } from "../../types/navigation";

// ============================================================================
// TYPES
// ============================================================================

type Props = RootStackScreenProps<"OnboardingWelcome">;

// ============================================================================
// CONSTANTS
// ============================================================================

const NATHIA_AVATAR = require("../../../assets/nathia-app.png");

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Logo animado com pulse sutil
 */
const AnimatedLogo = () => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={[styles.logoContainer, animatedStyle]}>
      <View style={styles.logoBorder}>
        <Image
          source={NATHIA_AVATAR}
          style={styles.logoImage}
          contentFit="cover"
          transition={300}
        />
      </View>
    </Animated.View>
  );
};

/**
 * Botão CTA principal
 */
const CTAButton = ({ label, onPress }: { label: string; onPress: () => void }) => {
  const scale = useSharedValue(1);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(withSpring(0.96, { damping: 15 }), withSpring(1, { damping: 12 }));
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <PressableScale onPress={handlePress} scale={0.97}>
        <LinearGradient
          colors={[brand.accent[500], brand.accent[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaText}>{label}</Text>
          <Ionicons name="arrow-forward" size={20} color={neutral[0]} />
        </LinearGradient>
      </PressableScale>
    </Animated.View>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OnboardingValenteWelcome({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  // Messages
  const messages = useMemo(() => ONBOARDING_MESSAGES.welcome, []);

  // Handlers
  const handleStart = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("OnboardingJourneySelect");
  }, [navigation]);

  // Dynamic sizing
  const isSmallScreen = screenHeight < 700;
  const titleSize = isSmallScreen ? 32 : 38;
  const subtitleSize = isSmallScreen ? 15 : 17;

  return (
    <LinearGradient
      colors={[brand.accent[50], brand.primary[50], neutral[0]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Top Section - Logo & Title */}
        <View style={styles.topSection}>
          {/* Animated Logo */}
          <Animated.View entering={FadeIn.delay(200).duration(600)}>
            <AnimatedLogo />
          </Animated.View>

          {/* Title */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.titleContainer}
          >
            <Text style={[styles.title, { fontSize: titleSize }]}>{messages.title}</Text>
            <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>{messages.subtitle}</Text>
          </Animated.View>
        </View>

        {/* Middle Section - Quote */}
        <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.quoteSection}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteIcon}>"</Text>
            <Text style={styles.quoteText}>{messages.nathQuote}</Text>
            <View style={styles.quoteFooter}>
              <View style={styles.quoteAuthorAvatar}>
                <Image source={NATHIA_AVATAR} style={styles.quoteAuthorImage} contentFit="cover" />
              </View>
              <Text style={styles.quoteAuthor}>Nathalia Valente</Text>
            </View>
          </View>
        </Animated.View>

        {/* Bottom Section - CTA */}
        <Animated.View
          entering={FadeInUp.delay(800).duration(500)}
          style={[styles.bottomSection, { paddingBottom: insets.bottom + spacing.lg }]}
        >
          <CTAButton label={messages.cta} onPress={handleStart} />

          {/* Stats - Social proof */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>+35M</Text>
              <Text style={styles.statLabel}>de mulheres</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9★</Text>
              <Text style={styles.statLabel}>avaliação</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>#1</Text>
              <Text style={styles.statLabel}>em autocuidado</Text>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },

  // Top Section
  topSection: {
    alignItems: "center",
    paddingTop: spacing["2xl"],
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: brand.accent[300],
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: brand.accent[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: "700",
    color: neutral[900],
    textAlign: "center",
    lineHeight: 44,
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: spacing.md,
    fontFamily: typography.fontFamily.base,
    fontWeight: "400",
    color: neutral[600],
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },

  // Quote Section
  quoteSection: {
    paddingHorizontal: spacing.xl,
  },
  quoteCard: {
    backgroundColor: neutral[0],
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  quoteIcon: {
    fontSize: 48,
    fontFamily: typography.fontFamily.bold,
    color: brand.accent[200],
    lineHeight: 48,
    marginBottom: -spacing.sm,
  },
  quoteText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.base,
    fontWeight: "400",
    color: neutral[700],
    lineHeight: 24,
  },
  quoteFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  quoteAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: brand.accent[200],
  },
  quoteAuthorImage: {
    width: "100%",
    height: "100%",
  },
  quoteAuthor: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
    fontWeight: "600",
    color: brand.accent[600],
  },

  // Bottom Section
  bottomSection: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    ...Platform.select({
      ios: {
        shadowColor: brand.accent[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  ctaText: {
    fontSize: 17,
    fontFamily: typography.fontFamily.semibold,
    fontWeight: "600",
    color: neutral[0],
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    fontWeight: "700",
    color: neutral[800],
  },
  statLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.base,
    fontWeight: "400",
    color: neutral[500],
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: neutral[200],
  },
});
