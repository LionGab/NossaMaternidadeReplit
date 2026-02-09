/**
 * OnboardingEmotionalStateNathia - Como você está se sentindo?
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Header com progress
 * - Título + subtítulo
 * - Cards de estado emocional
 * - Mensagem de encorajamento
 * - CTA continuar
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Body, Caption, NathCard, Title } from "@/components/ui";

// Config
import { EMOTIONAL_STATE_OPTIONS } from "@/config/nath-journey-onboarding-data";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
import { EmotionalState } from "@/types/nath-journey-onboarding.types";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = spacing.md;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.xl * 2 - CARD_GAP) / 2;

type Props = RootStackScreenProps<"OnboardingEmotionalState">;

// Mensagens empáticas contextuais
const ENCOURAGEMENT_MESSAGES: Record<EmotionalState, string> = {
  BEM_EQUILIBRADA: "Que momento especial! Vamos celebrar isso ✨",
  UM_POUCO_ANSIOSA: "Te entendo. Vou te passar dicas que me ajudaram 💙",
  MUITO_ANSIOSA: "Te entendo DEMAIS. Vamos com calma, juntas 🤍",
  TRISTE_ESGOTADA: "Você não está sozinha. Estou aqui com você 💜",
  PREFIRO_NAO_RESPONDER: "Tudo bem. Quando quiser, eu to aqui 🌸",
};

/**
 * MoodCard - Card de estado emocional
 */
const MoodCard = ({
  icon,
  title,
  isSelected,
  onPress,
  index,
  isLastOdd,
}: {
  icon: string;
  title: string;
  isSelected: boolean;
  onPress: () => void;
  index: number;
  isLastOdd: boolean;
}) => {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  const handlePress = async () => {
    await Haptics.impactAsync(
      isSelected ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    );

    if (!isSelected) {
      iconScale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );
    }

    scale.value = withSequence(withSpring(0.96, { damping: 15 }), withSpring(1, { damping: 12 }));
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const cardWidth = isLastOdd ? SCREEN_WIDTH - spacing.xl * 2 : CARD_WIDTH;

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 60)
        .duration(400)
        .springify()}
      style={[styles.cardWrapper, { width: cardWidth }, animatedStyle]}
    >
      <Pressable
        onPress={handlePress}
        style={[styles.moodCard, isSelected && styles.moodCardSelected]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected, checked: isSelected }}
        accessibilityLabel={`${title}${isSelected ? ", selecionado" : ""}`}
      >
        {/* Icon Container */}
        <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
          <Animated.View style={iconAnimatedStyle}>
            <Ionicons
              name={icon as React.ComponentProps<typeof Ionicons>["name"]}
              size={28}
              color={isSelected ? nathColors.rosa.DEFAULT : nathColors.text.muted}
            />
          </Animated.View>
        </View>

        {/* Title */}
        <Caption
          weight={isSelected ? "bold" : "regular"}
          style={[styles.moodTitle, isSelected && styles.moodTitleSelected]}
        >
          {title}
        </Caption>

        {/* Checkmark */}
        {isSelected && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.checkmark}>
            <View style={styles.checkmarkCircle}>
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

export default function OnboardingEmotionalStateNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [encouragementMessage, setEncouragementMessage] = useState<string | null>(null);

  // Store selectors
  const emotionalState = useNathJourneyOnboardingStore((s) => s.data.emotionalState);
  const setEmotionalState = useNathJourneyOnboardingStore((s) => s.setEmotionalState);
  const canProceed = useNathJourneyOnboardingStore((s) => s.canProceed);
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);

  // Set current screen on mount
  useEffect(() => {
    setCurrentScreen("OnboardingEmotionalState");
  }, [setCurrentScreen]);

  // Validation
  const isValid = useMemo(() => canProceed(), [canProceed]);

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectState = useCallback(
    (id: string) => {
      const state = id as EmotionalState;
      setEmotionalState(state);
      setEncouragementMessage(ENCOURAGEMENT_MESSAGES[state]);

      logger.info(`Emotional state selected: ${id}`, "OnboardingEmotionalStateNathia");
    },
    [setEmotionalState]
  );

  const handleContinue = useCallback(async () => {
    if (!isValid) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("OnboardingCheckIn");
  }, [isValid, navigation]);

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

        <ProgressDots current={4} total={5} />

        <View style={styles.backButton} />
      </Animated.View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.titleSection}>
          <Title style={styles.title}>Como você está se sentindo nos últimos dias?</Title>
          <Body style={styles.subtitle}>Isso me ajuda a personalizar sua experiência</Body>
        </Animated.View>

        {/* Mood Cards Grid */}
        <View style={styles.cardsGrid}>
          {EMOTIONAL_STATE_OPTIONS.map((option, index) => {
            const isLastOdd =
              index === EMOTIONAL_STATE_OPTIONS.length - 1 &&
              EMOTIONAL_STATE_OPTIONS.length % 2 === 1;

            return (
              <MoodCard
                key={option.state}
                icon={option.icon}
                title={option.title}
                isSelected={emotionalState === option.state}
                onPress={() => handleSelectState(option.state)}
                index={index}
                isLastOdd={isLastOdd}
              />
            );
          })}
        </View>

        {/* Mensagem de encorajamento */}
        {encouragementMessage && (
          <Animated.View entering={FadeIn.delay(200).duration(400)}>
            <NathCard variant="elevated" style={styles.encouragementCard} padding="md">
              <Body style={styles.encouragementText}>{encouragementMessage}</Body>
            </NathCard>
          </Animated.View>
        )}

        {/* Microcopy */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.microcopyContainer}
        >
          <Ionicons
            name="lock-closed-outline"
            size={14}
            color={nathColors.text.muted}
            style={styles.microcopyIcon}
          />
          <Caption style={styles.microcopy}>Confidencial. Sem julgamento.</Caption>
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
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
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: nathColors.text.DEFAULT,
  },

  subtitle: {
    marginTop: spacing.sm,
    fontSize: 16,
    lineHeight: 24,
    color: nathColors.text.muted,
  },

  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
  },

  cardWrapper: {
    // width is set dynamically
  },

  moodCard: {
    backgroundColor: nathColors.white,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    borderWidth: 2,
    borderColor: nathColors.border,
    position: "relative",
    ...shadows.sm,
  },

  moodCardSelected: {
    borderColor: nathColors.rosa.DEFAULT,
    backgroundColor: nathColors.rosa.light,
    borderWidth: 2.5,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: nathColors.input,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  iconContainerSelected: {
    backgroundColor: nathColors.white,
  },

  moodTitle: {
    fontSize: 15,
    textAlign: "center",
    color: nathColors.text.DEFAULT,
    lineHeight: 22,
  },

  moodTitleSelected: {
    color: nathColors.text.DEFAULT,
  },

  checkmark: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
  },

  checkmarkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: nathColors.rosa.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },

  encouragementCard: {
    marginTop: spacing.xl,
    backgroundColor: nathColors.rosa.light,
    borderWidth: 1,
    borderColor: nathColors.rosa.DEFAULT,
  },

  encouragementText: {
    fontSize: 15,
    fontWeight: "600",
    color: nathColors.text.DEFAULT,
    textAlign: "center",
    lineHeight: 22,
  },

  microcopyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing["3xl"],
  },

  microcopyIcon: {
    marginRight: spacing.xs,
  },

  microcopy: {
    fontSize: 13,
    color: nathColors.text.muted,
    textAlign: "center",
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
