/**
 * OnboardingStageNathia - Seleção de Estágio/Momento de Vida
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Header com progress
 * - Título + subtítulo
 * - Cards de estágio com icon e quote
 * - CTA continuar
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo } from "react";
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
import { STAGE_CARDS } from "@/config/nath-journey-onboarding-data";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
import type {
  StageCardData,
  OnboardingStage as StageType,
} from "@/types/nath-journey-onboarding.types";
import type { RootStackScreenProps } from "@/types/navigation";

// Utils
import { logger } from "@/utils/logger";

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

type Props = RootStackScreenProps<"OnboardingStage">;

/**
 * StageSelectionCard - Card de seleção de estágio
 */
const StageSelectionCard = ({
  data,
  isSelected,
  onPress,
  index,
}: {
  data: StageCardData;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}) => {
  const scale = useSharedValue(1);

  const handlePress = async () => {
    await Haptics.impactAsync(
      isSelected ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    );
    scale.value = withSequence(withSpring(0.96, { damping: 15 }), withSpring(1, { damping: 12 }));
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(150 + index * 70)
        .duration(400)
        .springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={handlePress}
        style={[styles.stageCard, isSelected && styles.stageCardSelected]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${data.title}${isSelected ? ", selecionado" : ""}`}
      >
        {/* Icon Container */}
        <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
          <Ionicons
            name={data.icon as React.ComponentProps<typeof Ionicons>["name"]}
            size={24}
            color={isSelected ? nathColors.white : nathColors.rosa.DEFAULT}
          />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Body weight="bold" style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
            {data.title}
          </Body>
          <Caption style={styles.cardQuote} numberOfLines={2}>
            {data.quote}
          </Caption>
        </View>

        {/* Selection Indicator */}
        {isSelected && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.checkmarkContainer}>
            <View style={styles.checkmark}>
              <Ionicons name="checkmark" size={14} color={nathColors.white} />
            </View>
          </Animated.View>
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

export default function OnboardingStageNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // Store selectors
  const selectedStage = useNathJourneyOnboardingStore((s) => s.data.stage);
  const setStage = useNathJourneyOnboardingStore((s) => s.setStage);
  const canProceed = useNathJourneyOnboardingStore((s) => s.canProceed);
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);

  // Set current screen on mount
  useEffect(() => {
    setCurrentScreen("OnboardingStage");
  }, [setCurrentScreen]);

  // Validation
  const isValid = useMemo(() => canProceed(), [canProceed]);

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectStage = useCallback(
    (stage: StageType) => {
      setStage(stage);
      logger.info(`Stage selected: ${stage}`, "OnboardingStageNathia");
    },
    [setStage]
  );

  const handleContinue = useCallback(async () => {
    if (!isValid) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Branching: TENTANTE/GENERAL skip date screen
    if (selectedStage === "GENERAL" || selectedStage === "TENTANTE") {
      logger.info("Skipping date (maternity-first)", "OnboardingStageNathia", {
        stage: selectedStage,
      });
      navigation.navigate("OnboardingConcerns");
      return;
    }

    logger.info("Continuing to date", "OnboardingStageNathia", { stage: selectedStage });
    navigation.navigate("OnboardingDate");
  }, [isValid, selectedStage, navigation]);

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
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.titleSection}>
          <Title style={styles.title}>Onde você está agora?</Title>
          <Body style={styles.subtitle}>Escolha a fase que melhor descreve seu momento</Body>
        </Animated.View>

        {/* Stage Cards */}
        <View style={styles.cardsContainer}>
          {STAGE_CARDS.map((cardData, index) => (
            <StageSelectionCard
              key={cardData.stage}
              data={cardData}
              isSelected={selectedStage === cardData.stage}
              onPress={() => handleSelectStage(cardData.stage)}
              index={index}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <Animated.View
        entering={FadeInUp.delay(500).duration(400)}
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <Pressable
          onPress={handleContinue}
          disabled={!isValid}
          style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Continuar"
          accessibilityState={{ disabled: !isValid }}
        >
          <Body
            weight="bold"
            style={[styles.continueButtonText, !isValid && styles.continueButtonTextDisabled]}
          >
            Continuar
          </Body>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={!isValid ? nathColors.text.muted : nathColors.white}
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
    marginBottom: spacing["2xl"],
  },

  title: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: nathColors.text.DEFAULT,
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: nathColors.text.muted,
  },

  cardsContainer: {
    gap: spacing.md,
  },

  stageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: nathColors.white,
    padding: spacing.lg,
    borderRadius: radius["2xl"],
    borderWidth: 1.5,
    borderColor: nathColors.border,
    ...shadows.sm,
  },

  stageCardSelected: {
    borderColor: nathColors.rosa.DEFAULT,
    backgroundColor: nathColors.rosa.light,
    borderWidth: 2,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: nathColors.rosa.light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  iconContainerSelected: {
    backgroundColor: nathColors.rosa.DEFAULT,
  },

  cardContent: {
    flex: 1,
    marginRight: spacing.sm,
  },

  cardTitle: {
    fontSize: 15,
    color: nathColors.text.DEFAULT,
    lineHeight: 20,
    marginBottom: 2,
  },

  cardTitleSelected: {
    color: nathColors.text.DEFAULT,
  },

  cardQuote: {
    fontSize: 13,
    color: nathColors.text.muted,
    lineHeight: 18,
    fontStyle: "italic",
  },

  checkmarkContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  checkmark: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
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
