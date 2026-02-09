/**
 * OnboardingJourneySelectNathia - Seleção de Jornada de Vida
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Header com progress dots
 * - Título + citação
 * - Cards de jornada (6 opções)
 * - CTA continuar
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Body, Caption, Title } from "@/components/ui";

// Config
import { JOURNEY_CARDS } from "@/config/expanded-onboarding-data";
import { ONBOARDING_MESSAGES } from "@/config/valente-movement-concept";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
import type { LifeJourney } from "@/types/expanded-onboarding.types";
import type { RootStackScreenProps } from "@/types/navigation";

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
};

type Props = RootStackScreenProps<"OnboardingJourneySelect">;

/**
 * JourneyCard - Card de seleção de jornada
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
      entering={FadeInUp.delay(150 + index * 60)
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
        <View style={[styles.emojiContainer, isSelected && styles.emojiContainerSelected]}>
          <Body style={styles.journeyEmoji}>{emoji}</Body>
        </View>

        {/* Text */}
        <View style={styles.journeyTextContainer}>
          <Body
            weight="bold"
            style={[styles.journeyTitle, isSelected && styles.journeyTitleSelected]}
          >
            {title}
          </Body>
          <Caption style={styles.journeySubtitle}>{subtitle}</Caption>
        </View>

        {/* Checkmark */}
        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark" size={16} color={nathColors.white} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

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

export default function OnboardingJourneySelectNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedJourney, setSelectedJourney] = useState<LifeJourney | null>(null);

  // Store
  const setJourneyInStore = useNathJourneyOnboardingStore((s) => s.setJourney);

  // Memoized data
  const journeyCards = useMemo(() => JOURNEY_CARDS, []);
  const messages = useMemo(() => ONBOARDING_MESSAGES.journey, []);

  // Handlers
  const handleSelectJourney = useCallback((journey: LifeJourney) => {
    setSelectedJourney(journey);
  }, []);

  const handleContinue = useCallback(async () => {
    if (!selectedJourney) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="chevron-back" size={24} color={nathColors.text.muted} />
        </Pressable>

        <ProgressDots current={1} total={5} />

        <View style={styles.backButton} />
      </Animated.View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.titleSection}>
          <Title style={styles.title}>{messages.title}</Title>
          <Body style={styles.subtitle}>{messages.subtitle}</Body>
        </Animated.View>

        {/* Nath Quote */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.quoteContainer}>
          <View style={styles.quoteLine} />
          <Caption style={styles.quoteText}>"{messages.nathQuote}"</Caption>
          <Caption style={styles.quoteAuthor}>— Nathalia Valente</Caption>
        </Animated.View>

        {/* Journey Cards */}
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

      {/* Bottom CTA */}
      <Animated.View
        entering={FadeInUp.delay(600).duration(400)}
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <Pressable
          onPress={handleContinue}
          disabled={!selectedJourney}
          style={[styles.continueButton, !selectedJourney && styles.continueButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Continuar"
          accessibilityState={{ disabled: !selectedJourney }}
        >
          <Body
            weight="bold"
            style={[
              styles.continueButtonText,
              !selectedJourney && styles.continueButtonTextDisabled,
            ]}
          >
            Continuar
          </Body>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={!selectedJourney ? nathColors.text.muted : nathColors.white}
          />
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
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: nathColors.text.DEFAULT,
  },

  subtitle: {
    marginTop: spacing.sm,
    fontSize: 16,
    lineHeight: 24,
    color: nathColors.text.muted,
  },

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
    backgroundColor: nathColors.rosa.light,
    borderRadius: 2,
  },

  quoteText: {
    fontSize: 14,
    fontStyle: "italic",
    color: nathColors.text.light,
    lineHeight: 22,
  },

  quoteAuthor: {
    marginTop: spacing.xs,
    fontSize: 12,
    fontWeight: "500",
    color: nathColors.rosa.DEFAULT,
  },

  cardsContainer: {
    gap: spacing.md,
  },

  journeyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: nathColors.white,
    borderRadius: radius["2xl"],
    borderWidth: 1.5,
    borderColor: nathColors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
  },

  journeyCardSelected: {
    borderColor: nathColors.rosa.DEFAULT,
    backgroundColor: nathColors.rosa.light,
    borderWidth: 2,
  },

  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: nathColors.input,
    alignItems: "center",
    justifyContent: "center",
  },

  emojiContainerSelected: {
    backgroundColor: nathColors.white,
  },

  journeyEmoji: {
    fontSize: 24,
  },

  journeyTextContainer: {
    flex: 1,
  },

  journeyTitle: {
    fontSize: 16,
    color: nathColors.text.DEFAULT,
  },

  journeyTitleSelected: {
    color: nathColors.text.DEFAULT,
  },

  journeySubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: nathColors.text.muted,
    lineHeight: 18,
  },

  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: nathColors.rosa.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: nathColors.cream,
    borderTopWidth: 1,
    borderTopColor: nathColors.border,
  },

  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: nathColors.rosa.DEFAULT,
    borderRadius: radius["2xl"],
    paddingVertical: spacing.lg,
    ...shadows.md,
  },

  continueButtonDisabled: {
    backgroundColor: nathColors.input,
    ...shadows.sm,
  },

  continueButtonText: {
    fontSize: 16,
    color: nathColors.white,
  },

  continueButtonTextDisabled: {
    color: nathColors.text.muted,
  },
});
