/**
 * OnboardingJourneySelect - Primeira Tela do Onboarding Expandido
 *
 * Design Philosophy: ULTRA MINIMALISTA
 * - Rosa Clean + Azul Suave
 * - Whitespace generoso (Flo-inspired)
 * - Tipografia Manrope limpa
 * - Máximo 2-3 cores por tela
 * - Sem ruído visual
 *
 * Conceito: PERTENCIMENTO ao Movimento Valente
 * - "O que você quer transformar na sua vida?"
 * - Cards elegantes com gradientes sutis
 * - Feedback háptico suave
 *
 * @version 1.0 - Janeiro 2026
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { JOURNEY_CARDS } from "../../config/expanded-onboarding-data";
import { ONBOARDING_MESSAGES } from "../../config/valente-movement-concept";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { brand, neutral, radius, shadows, spacing, typography } from "../../theme/tokens";
import type { LifeJourney } from "../../types/expanded-onboarding.types";
import type { RootStackScreenProps } from "../../types/navigation";

// ============================================================================
// TYPES
// ============================================================================

type Props = RootStackScreenProps<"OnboardingJourneySelect">;

// ============================================================================
// CONSTANTS - Design Minimalista
// ============================================================================

const COLORS = {
  background: brand.primary[50], // Azul quase branco - ultra clean
  cardBg: neutral[0], // Branco puro
  cardBorder: neutral[100], // Borda sutilíssima
  cardBorderSelected: brand.accent[300], // Rosa suave quando selecionado
  textPrimary: neutral[900], // Quase preto
  textSecondary: neutral[500], // Cinza médio
  accent: brand.accent[500], // Rosa vibrante
  accentSoft: brand.accent[50], // Rosa quase branco
  primarySoft: brand.primary[50], // Azul quase branco
};

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * JourneyCard - Card minimalista para seleção de jornada
 */
const JourneyCard = ({
  title,
  subtitle,
  emoji,
  isSelected,
  onPress,
  index,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}) => {
  const scale = useSharedValue(1);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(withSpring(0.96, { damping: 15 }), withSpring(1, { damping: 12 }));
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(200 + index * 60)
        .duration(400)
        .springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={handlePress}
        style={[styles.journeyCard, isSelected && styles.journeyCardSelected]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${title} - ${subtitle}`}
      >
        {/* Emoji */}
        <Text style={styles.journeyEmoji}>{emoji}</Text>

        {/* Text */}
        <View style={styles.journeyTextContainer}>
          <Text style={[styles.journeyTitle, isSelected && styles.journeyTitleSelected]}>
            {title}
          </Text>
          <Text style={styles.journeySubtitle}>{subtitle}</Text>
        </View>

        {/* Checkmark */}
        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark" size={16} color={neutral[0]} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

/**
 * ContinueButton - Botão minimalista de continuar
 */
const ContinueButton = ({ onPress, disabled }: { onPress: () => void; disabled: boolean }) => {
  const scale = useSharedValue(1);

  const handlePress = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSequence(withSpring(0.96, { damping: 15 }), withSpring(1, { damping: 12 }));
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.buttonContainer, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={[styles.continueButton, disabled && styles.continueButtonDisabled]}
        accessibilityRole="button"
        accessibilityLabel="Continuar"
        accessibilityState={{ disabled }}
      >
        <Text style={[styles.continueButtonText, disabled && styles.continueButtonTextDisabled]}>
          Continuar
        </Text>
        <Ionicons name="arrow-forward" size={20} color={disabled ? neutral[400] : neutral[0]} />
      </Pressable>
    </Animated.View>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OnboardingJourneySelect({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedJourney, setSelectedJourney] = useState<LifeJourney | null>(null);

  // Store - Persistir jornada selecionada
  const setJourneyInStore = useNathJourneyOnboardingStore((s) => s.setJourney);

  // Handlers
  const handleSelectJourney = useCallback((journey: LifeJourney) => {
    setSelectedJourney(journey);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedJourney) return;

    // Persistir no store
    setJourneyInStore(selectedJourney);

    // Branching: se MATERNIDADE, vai pra tela de estágio
    if (selectedJourney === "MATERNIDADE") {
      navigation.navigate("OnboardingMaternityStage");
    } else {
      // Outras jornadas vão direto pra Concerns
      navigation.navigate("OnboardingConcerns");
    }
  }, [selectedJourney, navigation, setJourneyInStore]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Memoized data
  const journeyCards = useMemo(() => JOURNEY_CARDS, []);
  const messages = useMemo(() => ONBOARDING_MESSAGES.journey, []);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Header minimalista */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={24} color={neutral[600]} />
          </Pressable>

          {/* Progress dots minimalistas */}
          <View style={styles.progressDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Spacer para balancear */}
          <View style={styles.backButton} />
        </Animated.View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Section - Ultra clean */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.titleSection}>
            <Text style={styles.title}>{messages.title}</Text>
            <Text style={styles.subtitle}>{messages.subtitle}</Text>
          </Animated.View>

          {/* Nath Quote - Sutil */}
          <Animated.View
            entering={FadeInDown.delay(150).duration(500)}
            style={styles.quoteContainer}
          >
            <View style={styles.quoteLine} />
            <Text style={styles.quoteText}>"{messages.nathQuote}"</Text>
            <Text style={styles.quoteAuthor}>— Nathalia Valente</Text>
          </Animated.View>

          {/* Journey Cards Grid */}
          <View style={styles.cardsContainer}>
            {journeyCards.map((card, index) => (
              <JourneyCard
                key={card.journey}
                title={card.title}
                subtitle={card.subtitle}
                emoji={card.emoji}
                isSelected={selectedJourney === card.journey}
                onPress={() => handleSelectJourney(card.journey)}
                index={index}
              />
            ))}
          </View>
        </ScrollView>

        {/* Bottom CTA - Fixed */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(400)}
          style={[styles.bottomContainer, { paddingBottom: insets.bottom + spacing.md }]}
        >
          <ContinueButton onPress={handleContinue} disabled={!selectedJourney} />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

// ============================================================================
// STYLES - Design Minimalista
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Header
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
    backgroundColor: neutral[200],
  },
  dotActive: {
    backgroundColor: brand.accent[500],
    width: 24,
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: spacing.xl,
  },

  // Title Section
  titleSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    fontWeight: "700",
    color: neutral[900],
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 16,
    fontFamily: typography.fontFamily.base,
    fontWeight: "400",
    color: neutral[500],
    lineHeight: 24,
  },

  // Quote
  quoteContainer: {
    marginBottom: spacing["2xl"],
    paddingLeft: spacing.lg,
  },
  quoteLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: brand.accent[200],
    borderRadius: 2,
  },
  quoteText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.base,
    fontWeight: "400",
    fontStyle: "italic",
    color: neutral[600],
    lineHeight: 22,
  },
  quoteAuthor: {
    marginTop: spacing.xs,
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    fontWeight: "500",
    color: brand.accent[500],
  },

  // Cards
  cardsContainer: {
    gap: spacing.md,
  },
  journeyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: neutral[0],
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: neutral[100],
    padding: spacing.lg,
    gap: spacing.md,
    ...(Platform.OS === "ios" ? shadows.flo.minimal : { elevation: 1 }),
  },
  journeyCardSelected: {
    borderColor: brand.accent[400],
    backgroundColor: brand.accent[50],
  },
  journeyEmoji: {
    fontSize: 28,
  },
  journeyTextContainer: {
    flex: 1,
  },
  journeyTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semibold,
    fontWeight: "600",
    color: neutral[800],
    lineHeight: 22,
  },
  journeyTitleSelected: {
    color: brand.accent[700],
  },
  journeySubtitle: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: typography.fontFamily.base,
    fontWeight: "400",
    color: neutral[500],
    lineHeight: 18,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: brand.accent[500],
    alignItems: "center",
    justifyContent: "center",
  },

  // Bottom Container
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: neutral[100],
  },
  buttonContainer: {
    width: "100%",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: brand.accent[500],
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    ...(Platform.OS === "ios" ? shadows.flo.cta : { elevation: 4 }),
  },
  continueButtonDisabled: {
    backgroundColor: neutral[100],
    ...Platform.select({
      ios: {},
      android: { elevation: 0 },
    }),
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semibold,
    fontWeight: "600",
    color: neutral[0],
  },
  continueButtonTextDisabled: {
    color: neutral[400],
  },
});
