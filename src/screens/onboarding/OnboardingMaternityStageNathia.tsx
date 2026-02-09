/**
 * OnboardingMaternityStageNathia - Sub-seleção de Estágio de Maternidade
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Header com progress
 * - Título + subtítulo
 * - Cards de estágio com quotes
 * - CTA continuar
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { ComponentProps } from "react";
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
import { MATERNITY_STAGE_CARDS } from "@/config/expanded-onboarding-data";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
import type { MaternityStage } from "@/types/expanded-onboarding.types";
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

type Props = RootStackScreenProps<"OnboardingMaternityStage">;

/**
 * StageCard - Card de estágio com quote
 */
const StageCard = ({
  title,
  nathQuote,
  icon,
  isSelected,
  onPress,
  index,
}: {
  title: string;
  nathQuote: string;
  icon: string;
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
      entering={FadeInUp.delay(150 + index * 60)
        .duration(400)
        .springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={handlePress}
        style={[styles.stageCard, isSelected && styles.stageCardSelected]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={title}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
          <Ionicons
            name={icon as ComponentProps<typeof Ionicons>["name"]}
            size={24}
            color={isSelected ? nathColors.white : nathColors.rosa.DEFAULT}
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Body weight="bold" style={[styles.stageTitle, isSelected && styles.stageTitleSelected]}>
            {title}
          </Body>
          <Caption style={styles.stageQuote} numberOfLines={2}>
            "{nathQuote}"
          </Caption>
        </View>

        {/* Checkmark */}
        {isSelected && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.checkmark}>
            <Ionicons name="checkmark" size={16} color={nathColors.white} />
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

export default function OnboardingMaternityStageNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedStage, setSelectedStage] = useState<MaternityStage | null>(null);

  // Store
  const setMaternityStageInStore = useNathJourneyOnboardingStore((s) => s.setMaternityStage);

  // Memoized data
  const stageCards = useMemo(() => MATERNITY_STAGE_CARDS, []);

  // Handlers
  const handleSelectStage = useCallback((stage: MaternityStage) => {
    setSelectedStage(stage);
  }, []);

  const handleContinue = useCallback(async () => {
    if (!selectedStage) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMaternityStageInStore(selectedStage);
    navigation.navigate("OnboardingConcerns");
  }, [selectedStage, navigation, setMaternityStageInStore]);

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

        <ProgressDots current={2} total={5} />

        <View style={styles.backButton} />
      </Animated.View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.titleSection}>
          <Title style={styles.title}>Em qual fase você está?</Title>
          <Body style={styles.subtitle}>Cada momento da maternidade é único</Body>
        </Animated.View>

        {/* Stage Cards */}
        <View style={styles.cardsContainer}>
          {stageCards.map((card, index) => (
            <StageCard
              key={card.stage}
              title={card.title}
              nathQuote={card.nathQuote}
              icon={card.icon}
              isSelected={selectedStage === card.stage}
              onPress={() => handleSelectStage(card.stage)}
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
          disabled={!selectedStage}
          style={[styles.continueButton, !selectedStage && styles.continueButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Continuar"
          accessibilityState={{ disabled: !selectedStage }}
        >
          <Body
            weight="bold"
            style={[styles.continueButtonText, !selectedStage && styles.continueButtonTextDisabled]}
          >
            Continuar
          </Body>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={!selectedStage ? nathColors.text.muted : nathColors.white}
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

  cardsContainer: {
    gap: spacing.md,
  },

  stageCard: {
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

  stageCardSelected: {
    borderColor: nathColors.rosa.DEFAULT,
    backgroundColor: nathColors.rosa.light,
    borderWidth: 2,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: nathColors.rosa.light,
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainerSelected: {
    backgroundColor: nathColors.rosa.DEFAULT,
  },

  textContainer: {
    flex: 1,
  },

  stageTitle: {
    fontSize: 16,
    color: nathColors.text.DEFAULT,
  },

  stageTitleSelected: {
    color: nathColors.text.DEFAULT,
  },

  stageQuote: {
    marginTop: 4,
    fontSize: 13,
    fontStyle: "italic",
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
