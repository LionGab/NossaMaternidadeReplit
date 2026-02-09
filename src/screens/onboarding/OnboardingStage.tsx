/**
 * OnboardingStage - Flo Health Minimal Design
 *
 * Redesigned with clean, minimal aesthetics:
 * - Subtle pink-to-white gradient background
 * - Clean selection cards with Manrope typography
 * - Pink accent highlight for selected state
 * - Progress indicator at top
 * - Smooth animations with react-native-reanimated
 *
 * Features:
 * - Stagger animation on cards
 * - Branching: TENTANTE/GENERAL skip date screen
 * - Haptic feedback on selections
 */

import React, { useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { Button } from "@/components/ui/Button";
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { STAGE_CARDS } from "@/config/nath-journey-onboarding-data";
import { Tokens } from "@/theme/tokens";
import { logger } from "@/utils/logger";
import { RootStackScreenProps } from "@/types/navigation";
import type {
  OnboardingStage as StageType,
  StageCardData,
} from "@/types/nath-journey-onboarding.types";

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"OnboardingStage">;

// ===========================================
// CONSTANTS
// ===========================================

const TOTAL_STEPS = 7;
const CURRENT_STEP = 1;

// Flo Health Minimal Colors
const COLORS = {
  // Background gradient
  gradientStart: Tokens.cleanDesign.pink[50],
  gradientEnd: Tokens.neutral[0],

  // Card colors
  cardBackground: Tokens.neutral[0],
  cardBorder: Tokens.cleanDesign.pink[100],
  cardSelectedBorder: Tokens.cleanDesign.pink[500],
  cardSelectedBackground: Tokens.cleanDesign.pink[50],

  // Text colors
  textPrimary: Tokens.neutral[900],
  textSecondary: Tokens.neutral[500],
  textMuted: Tokens.neutral[400],

  // Progress
  progressBackground: Tokens.cleanDesign.pink[100],
  progressFill: Tokens.cleanDesign.pink[500],

  // Accent
  accent: Tokens.cleanDesign.pink[500],
  accentLight: Tokens.cleanDesign.pink[100],
} as const;

// ===========================================
// ANIMATED COMPONENTS
// ===========================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ===========================================
// STAGE SELECTION CARD
// ===========================================

interface StageSelectionCardProps {
  data: StageCardData;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

function StageSelectionCard({ data, isSelected, onPress, index }: StageSelectionCardProps) {
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(1);
  const backgroundColor = useSharedValue(0);

  useEffect(() => {
    borderWidth.value = withSpring(isSelected ? 2 : 1, {
      damping: 15,
      stiffness: 200,
    });
    backgroundColor.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected, borderWidth, backgroundColor]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderWidth.value,
    borderColor: interpolateColor(
      borderWidth.value,
      [1, 2],
      [COLORS.cardBorder, COLORS.cardSelectedBorder]
    ),
    backgroundColor: interpolateColor(
      backgroundColor.value,
      [0, 1],
      [COLORS.cardBackground, COLORS.cardSelectedBackground]
    ),
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 1 : 0, { duration: 200 }),
    transform: [
      {
        scale: withSpring(isSelected ? 1 : 0, {
          damping: 12,
          stiffness: 200,
        }),
      },
    ],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(150 + index * 80)
        .duration(400)
        .springify()}
      style={styles.cardWrapper}
    >
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, animatedCardStyle]}
        accessibilityLabel={`${data.title}. ${isSelected ? "Selecionado" : "Nao selecionado"}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        {/* Icon Container */}
        <View style={[styles.iconContainer, { backgroundColor: data.gradient[0] }]}>
          <Ionicons
            name={data.icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color={data.iconColor}
          />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {data.title}
          </Text>
          <Text style={styles.cardQuote} numberOfLines={2}>
            {data.quote}
          </Text>
        </View>

        {/* Selection Indicator */}
        <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
          <View style={styles.checkmark}>
            <Ionicons name="checkmark" size={14} color={COLORS.cardBackground} />
          </View>
        </Animated.View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ===========================================
// PROGRESS INDICATOR
// ===========================================

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const progress = current / total;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {current} de {total}
      </Text>
    </View>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function OnboardingStage({ navigation }: Props) {
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

  // Handlers
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    navigation.goBack();
  }, [navigation]);

  const handleSelectStage = useCallback(
    (stage: StageType) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setStage(stage);
      logger.info(`Stage selected: ${stage}`, "OnboardingStage");
    },
    [setStage]
  );

  const handleContinue = useCallback(() => {
    if (!canProceed()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    // Branching: TENTANTE/GENERAL skip date screen
    if (selectedStage === "GENERAL" || selectedStage === "TENTANTE") {
      logger.info("Skipping date (maternity-first)", "OnboardingStage", { stage: selectedStage });
      navigation.navigate("OnboardingConcerns");
      return;
    }

    logger.info("Continuing to date", "OnboardingStage", { stage: selectedStage });
    navigation.navigate("OnboardingDate");
  }, [canProceed, selectedStage, navigation]);

  const isButtonEnabled = canProceed();

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
      />

      {/* Header */}
      <Animated.View
        entering={FadeIn.delay(50).duration(300)}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        {/* Back Button */}
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </Pressable>

        {/* Progress */}
        <ProgressIndicator current={CURRENT_STEP} total={TOTAL_STEPS} />

        {/* Spacer for alignment */}
        <View style={styles.headerSpacer} />
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        entering={FadeIn.delay(100).duration(400)}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Title Section */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.titleSection}>
          <Text style={styles.title}>Onde voce esta agora?</Text>
          <Text style={styles.subtitle}>Escolha a fase que melhor descreve seu momento</Text>
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

        {/* Bottom spacing for button */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Footer CTA */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(400)}
        style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}
      >
        <Button
          variant={isButtonEnabled ? "accent" : "soft"}
          size="lg"
          fullWidth
          disabled={!isButtonEnabled}
          onPress={handleContinue}
          accessibilityLabel="Continuar para a proxima etapa"
        >
          Continuar
        </Button>
      </Animated.View>
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gradientEnd,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Tokens.radius.full,
    backgroundColor: Tokens.glass.light.soft,
  },
  headerSpacer: {
    width: 44,
  },

  // Progress
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
  },
  progressTrack: {
    width: 80,
    height: 4,
    backgroundColor: COLORS.progressBackground,
    borderRadius: Tokens.radius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.progressFill,
    borderRadius: Tokens.radius.full,
  },
  progressText: {
    fontSize: 12,
    fontFamily: Tokens.typography.fontFamily.medium,
    color: COLORS.textMuted,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
  },

  // Title Section
  titleSection: {
    marginBottom: Tokens.spacing["2xl"],
  },
  title: {
    fontSize: 28,
    fontFamily: Tokens.typography.fontFamily.bold,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 34,
    marginBottom: Tokens.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Tokens.typography.fontFamily.base,
    fontWeight: "400",
    color: COLORS.textSecondary,
    lineHeight: 24,
  },

  // Cards Container
  cardsContainer: {
    gap: Tokens.spacing.md,
  },

  // Card
  cardWrapper: {
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Tokens.spacing.lg,
    borderRadius: Tokens.radius.xl,
    backgroundColor: COLORS.cardBackground,
    ...Tokens.shadows.flo.soft,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Tokens.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Tokens.spacing.md,
  },
  cardContent: {
    flex: 1,
    marginRight: Tokens.spacing.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontWeight: "600",
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: 2,
  },
  cardQuote: {
    fontSize: 13,
    fontFamily: Tokens.typography.fontFamily.base,
    fontWeight: "400",
    color: COLORS.textSecondary,
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
    borderRadius: Tokens.radius.full,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    backgroundColor: Tokens.glass.light.strong,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
});
