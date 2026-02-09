/**
 * OnboardingMaternityStage - Sub-seleção de Estágio de Maternidade
 *
 * Design Philosophy: ULTRA MINIMALISTA
 * - Apenas mostrado quando jornada = MATERNIDADE
 * - Cards limpos com gradientes sutis
 * - Feedback háptico elegante
 *
 * Fluxo:
 * JourneySelect (MATERNIDADE) → MaternityStage → Concerns
 *
 * @version 1.0 - Janeiro 2026
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { ComponentProps } from "react";
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

import { MATERNITY_STAGE_CARDS } from "../../config/expanded-onboarding-data";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { brand, neutral, radius, shadows, spacing, typography } from "../../theme/tokens";
import type { MaternityStage } from "../../types/expanded-onboarding.types";
import type { RootStackScreenProps } from "../../types/navigation";

// ============================================================================
// TYPES
// ============================================================================

type Props = RootStackScreenProps<"OnboardingMaternityStage">;

// ============================================================================
// CONSTANTS
// ============================================================================

const COLORS = {
  background: neutral[50],
  cardBg: neutral[0],
  cardBorder: neutral[100],
  cardBorderSelected: brand.accent[300],
  textPrimary: neutral[900],
  textSecondary: neutral[500],
  accent: brand.accent[500],
};

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * StageCard - Card para seleção de estágio de maternidade
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
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(withSpring(0.96, { damping: 15 }), withSpring(1, { damping: 12 }));
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(150 + index * 50)
        .duration(400)
        .springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={handlePress}
        style={[styles.stageCard, isSelected && styles.stageCardSelected]}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${title}`}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
          <Ionicons
            name={icon as ComponentProps<typeof Ionicons>["name"]}
            size={24}
            color={isSelected ? neutral[0] : brand.accent[500]}
          />
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={[styles.stageTitle, isSelected && styles.stageTitleSelected]}>{title}</Text>
          <Text style={styles.stageQuote} numberOfLines={2}>
            "{nathQuote}"
          </Text>
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
 * ContinueButton - Botão minimalista
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

export default function OnboardingMaternityStage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedStage, setSelectedStage] = useState<MaternityStage | null>(null);

  // Store - Persistir estágio de maternidade
  const setMaternityStageInStore = useNathJourneyOnboardingStore((s) => s.setMaternityStage);

  // Handlers
  const handleSelectStage = useCallback((stage: MaternityStage) => {
    setSelectedStage(stage);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedStage) return;

    // Persistir no store
    setMaternityStageInStore(selectedStage);

    // Navega direto para Concerns (simplificado)
    navigation.navigate("OnboardingConcerns");
  }, [selectedStage, navigation, setMaternityStageInStore]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Memoized data
  const stageCards = useMemo(() => MATERNITY_STAGE_CARDS, []);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={24} color={neutral[600]} />
          </Pressable>

          {/* Progress dots */}
          <View style={styles.progressDots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <View style={styles.backButton} />
        </Animated.View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Section */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.titleSection}>
            <Text style={styles.title}>Em qual fase você está?</Text>
            <Text style={styles.subtitle}>Cada momento da maternidade é único</Text>
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
          <ContinueButton onPress={handleContinue} disabled={!selectedStage} />
        </Animated.View>
      </SafeAreaView>
    </View>
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

  // Content
  scrollContent: {
    paddingHorizontal: spacing.xl,
  },
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

  // Cards
  cardsContainer: {
    gap: spacing.md,
  },
  stageCard: {
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
  stageCardSelected: {
    borderColor: brand.accent[400],
    backgroundColor: brand.accent[50],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: brand.accent[50],
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerSelected: {
    backgroundColor: brand.accent[500],
  },
  textContainer: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semibold,
    fontWeight: "600",
    color: neutral[800],
    lineHeight: 22,
  },
  stageTitleSelected: {
    color: brand.accent[700],
  },
  stageQuote: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: typography.fontFamily.base,
    fontWeight: "400",
    fontStyle: "italic",
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

  // Bottom
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
