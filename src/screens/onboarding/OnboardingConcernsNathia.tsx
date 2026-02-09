/**
 * OnboardingConcernsNathia - Seleção de Preocupações
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Header com progress
 * - Título + contador
 * - Grid de cards de preocupações
 * - CTA continuar
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Body, Caption, NathBadge, Title } from "@/components/ui";

// Config
import { getConcernsByJourney } from "@/config/expanded-onboarding-data";
import { CONCERN_CARDS } from "@/config/nath-journey-onboarding-data";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
import { OnboardingConcern } from "@/types/nath-journey-onboarding.types";
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

type Props = RootStackScreenProps<"OnboardingConcerns">;

const MAX_CONCERNS = 3;

/**
 * ConcernCard - Card de preocupação (Design Premium)
 */
const ConcernCard = ({
  icon,
  title,
  isSelected,
  disabled,
  onPress,
  index,
  gradient,
}: {
  icon: string;
  title: string;
  isSelected: boolean;
  disabled: boolean;
  onPress: () => void;
  index: number;
  gradient: readonly [string, string];
}) => {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  const handlePress = async () => {
    if (disabled && !isSelected) return;
    await Haptics.impactAsync(
      isSelected ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    );
    scale.value = withSequence(withSpring(0.96, { damping: 12 }), withSpring(1, { damping: 10 }));
    if (!isSelected) {
      iconScale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 10 })
      );
    }
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 40).duration(350)}
      style={[styles.cardWrapper, animatedStyle]}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.concernCard,
          isSelected && styles.concernCardSelected,
          disabled && !isSelected && styles.concernCardDisabled,
          pressed && !disabled && styles.concernCardPressed,
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected, disabled: disabled && !isSelected }}
        accessibilityLabel={title}
      >
        {/* Subtle gradient overlay when selected */}
        {isSelected && (
          <LinearGradient
            colors={[`${gradient[0]}15`, `${gradient[1]}08`]}
            style={styles.selectedOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}

        {/* Icon with clean circular background */}
        <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
          <LinearGradient
            colors={isSelected ? gradient : [`${gradient[0]}30`, `${gradient[1]}20`]}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons
              name={icon as React.ComponentProps<typeof Ionicons>["name"]}
              size={22}
              color={isSelected ? nathColors.white : gradient[0]}
            />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Caption
          weight={isSelected ? "semibold" : "medium"}
          style={[
            styles.concernTitle,
            isSelected && styles.concernTitleSelected,
            disabled && !isSelected && styles.concernTitleDisabled,
          ]}
        >
          {title}
        </Caption>

        {/* Premium checkmark badge */}
        {isSelected && (
          <LinearGradient
            colors={gradient}
            style={styles.checkmark}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark" size={11} color={nathColors.white} />
          </LinearGradient>
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

export default function OnboardingConcernsNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // Store selectors
  const concerns = useNathJourneyOnboardingStore((s) => s.data.concerns);
  const journey = useNathJourneyOnboardingStore((s) => s.data.journey);
  const toggleConcern = useNathJourneyOnboardingStore((s) => s.toggleConcern);
  const canProceed = useNathJourneyOnboardingStore((s) => s.canProceed);
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);

  // Set current screen on mount
  useEffect(() => {
    setCurrentScreen("OnboardingConcerns");
  }, [setCurrentScreen]);

  // Filtrar concerns por jornada selecionada
  const concernCards = useMemo(() => {
    if (journey) {
      return getConcernsByJourney(journey);
    }
    return CONCERN_CARDS;
  }, [journey]);

  // Validation
  const isValid = useMemo(() => canProceed(), [canProceed]);

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectConcern = useCallback(
    (concern: OnboardingConcern) => {
      toggleConcern(concern);
      logger.info(`Concern toggled: ${concern}`, "OnboardingConcernsNathia");
    },
    [toggleConcern]
  );

  const handleContinue = useCallback(async () => {
    if (!isValid) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("OnboardingEmotionalState");
  }, [isValid, navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[Tokens.cleanDesign.pink[50], Tokens.cleanDesign.pink[100], Tokens.neutral[0]]}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />
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

        <ProgressDots current={3} total={5} />

        <View style={styles.backButton} />
      </Animated.View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.titleSection}>
          <Title style={styles.title}>O que mais te pega agora?</Title>
          <Body style={styles.subtitle}>Escolha até 3 opções</Body>
        </Animated.View>

        {/* Counter Badge */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(500)}
          style={styles.counterContainer}
        >
          <NathBadge variant={concerns.length === MAX_CONCERNS ? "warning" : "muted"} size="sm">
            {concerns.length} de {MAX_CONCERNS} selecionados
          </NathBadge>
        </Animated.View>

        {/* Concerns Grid */}
        <View style={styles.grid}>
          {concernCards.map((cardData, index) => {
            const concern = cardData.concern as OnboardingConcern;
            const isSelected = concerns.includes(concern);
            const isDisabled = !isSelected && concerns.length >= MAX_CONCERNS;

            return (
              <ConcernCard
                key={cardData.concern}
                icon={cardData.icon}
                title={cardData.title}
                isSelected={isSelected}
                disabled={isDisabled}
                onPress={() => handleSelectConcern(concern)}
                index={index}
                gradient={cardData.gradient as [string, string]}
              />
            );
          })}
        </View>

        {/* Helper text */}
        {concerns.length === MAX_CONCERNS && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Caption style={styles.helperText}>Máximo selecionado! Remova um para trocar.</Caption>
          </Animated.View>
        )}
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
            Continuar ({concerns.length} de {MAX_CONCERNS})
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
    backgroundColor: Tokens.neutral[0],
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
    marginBottom: spacing.lg,
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

  counterContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  cardWrapper: {
    width: "48%",
    marginBottom: spacing.sm,
  },

  concernCard: {
    backgroundColor: nathColors.white,
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 130,
    borderWidth: 1.5,
    borderColor: `${nathColors.border}80`,
    position: "relative",
    overflow: "hidden",
    ...shadows.sm,
  },

  concernCardSelected: {
    borderColor: nathColors.rosa.DEFAULT,
    backgroundColor: nathColors.white,
    borderWidth: 2.5,
    ...shadows.md,
  },

  concernCardPressed: {
    backgroundColor: nathColors.input,
  },

  concernCardDisabled: {
    opacity: 0.45,
  },

  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius["2xl"],
  },

  iconWrapper: {
    marginBottom: spacing.md,
  },

  iconGradient: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },

  concernTitle: {
    fontSize: 13,
    textAlign: "center",
    color: nathColors.text.DEFAULT,
    lineHeight: 17,
    letterSpacing: -0.1,
  },

  concernTitleSelected: {
    color: nathColors.text.DEFAULT,
  },

  concernTitleDisabled: {
    color: nathColors.text.muted,
  },

  checkmark: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },

  helperText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.md,
    color: nathColors.laranja.dark,
    fontWeight: "600",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: Tokens.neutral[0],
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
