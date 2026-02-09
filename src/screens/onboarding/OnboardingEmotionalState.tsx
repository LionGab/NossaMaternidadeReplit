/**
 * Tela 4: OnboardingEmotionalState - "Como Você Está?"
 *
 * Flo Health Minimal Design Style:
 * - Clean emoji/mood selection cards with subtle shadows
 * - Subtle gradient background (pink to white)
 * - Selected state with pink accent border
 * - Progress indicator at top
 * - CTA button at bottom using Button component
 * - All colors from Tokens
 *
 * Features:
 * - Grid layout with 5 emotional state cards
 * - Haptic feedback on selection
 * - Staggered entrance animations
 * - CRITICAL: Sets needsExtraCare flag via store
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
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

import { Button } from "@/components/ui/Button";
import { EMOTIONAL_STATE_OPTIONS } from "@/config/nath-journey-onboarding-data";
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { Tokens } from "@/theme/tokens";
import { EmotionalState } from "@/types/nath-journey-onboarding.types";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"OnboardingEmotionalState">;

interface MoodCardProps {
  icon: string;
  title: string;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

// ===========================================
// CONSTANTS
// ===========================================

const TOTAL_STEPS = 7;
const CURRENT_STEP = 4;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = Tokens.spacing.md;
const HORIZONTAL_PADDING = Tokens.spacing["2xl"] * 2;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING - CARD_GAP) / 2;

// Mensagens empáticas contextuais
const ENCOURAGEMENT_MESSAGES: Record<EmotionalState, string> = {
  BEM_EQUILIBRADA: "Que momento especial! Vamos celebrar isso ✨",
  UM_POUCO_ANSIOSA: "Te entendo. Vou te passar dicas que me ajudaram 💙",
  MUITO_ANSIOSA: "Te entendo DEMAIS. Vamos com calma, juntas 🤍",
  TRISTE_ESGOTADA: "Você não está sozinha. Estou aqui com você 💜",
  PREFIRO_NAO_RESPONDER: "Tudo bem. Quando quiser, eu to aqui 🌸",
};

// ===========================================
// MOOD CARD COMPONENT
// ===========================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MoodCard({ icon, title, isSelected, onPress, index }: MoodCardProps) {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePress = useCallback(() => {
    // Haptic diferenciado (médio para celebração, leve para trocar)
    Haptics.impactAsync(
      isSelected ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
    ).catch(() => {});

    // Animação de celebração no ícone
    if (!isSelected) {
      iconScale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );
    }

    onPress();
  }, [isSelected, onPress, iconScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  // Determine card size - last item spans full width if odd count
  const isLastOdd =
    index === EMOTIONAL_STATE_OPTIONS.length - 1 && EMOTIONAL_STATE_OPTIONS.length % 2 === 1;
  const cardWidth = isLastOdd ? SCREEN_WIDTH - Tokens.spacing["2xl"] * 2 : CARD_WIDTH;

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 60)
        .duration(400)
        .springify()}
      style={[styles.cardWrapper, { width: cardWidth }]}
    >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle]}
        accessibilityLabel={`${title}${isSelected ? ", selecionado" : ""}`}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected, checked: isSelected }}
        accessibilityHint="Toque para selecionar como você está se sentindo"
      >
        <View style={[styles.card, isSelected && styles.cardSelected]}>
          {/* Icon Container com animação */}
          <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
            <Animated.View style={iconAnimatedStyle}>
              <Ionicons
                name={icon as React.ComponentProps<typeof Ionicons>["name"]}
                size={24}
                color={isSelected ? Tokens.brand.accent[500] : Tokens.neutral[500]}
              />
            </Animated.View>
          </View>

          {/* Title */}
          <Text
            style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}
            numberOfLines={2}
          >
            {title}
          </Text>

          {/* Selected Checkmark */}
          {isSelected && (
            <Animated.View entering={FadeIn.duration(200)} style={styles.checkmark}>
              <View style={styles.checkmarkCircle}>
                <Ionicons name="checkmark" size={14} color={Tokens.neutral[0]} />
              </View>
            </Animated.View>
          )}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// ===========================================
// PROGRESS INDICATOR
// ===========================================

function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.progressWrapper}>
      <View style={styles.progressContainer}>
        {Array.from({ length: total }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index < current && styles.progressDotFilled,
              index === current - 1 && styles.progressDotActive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressText}>
        {current}/{total}
      </Text>
    </View>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function OnboardingEmotionalState({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // Local state para mensagem de encorajamento
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

  // Can proceed validation
  const isValid = useMemo(() => canProceed(), [canProceed]);

  // Handlers
  const handleBack = useCallback(() => {
    // Analytics: track se voltou sem selecionar
    if (!emotionalState) {
      logger.info("Emotional state skipped via back button", "OnboardingEmotionalState");
    }
    navigation.goBack();
  }, [navigation, emotionalState]);

  const handleSelectState = useCallback(
    (id: string) => {
      const state = id as EmotionalState;
      setEmotionalState(state);

      // Mostrar mensagem de encorajamento
      setEncouragementMessage(ENCOURAGEMENT_MESSAGES[state]);

      // Analytics tracking
      logger.info(`Emotional state selected: ${id}`, "OnboardingEmotionalState", {
        state: id,
        screen_index: CURRENT_STEP,
        total_steps: TOTAL_STEPS,
        timestamp: new Date().toISOString(),
      });
    },
    [setEmotionalState]
  );

  const handleContinue = useCallback(() => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    navigation.navigate("OnboardingCheckIn");
  }, [isValid, navigation]);

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[Tokens.cleanDesign.pink[50], Tokens.cleanDesign.pink[100], Tokens.neutral[0]]}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Tokens.spacing.md }]}>
        {/* Back Button */}
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={Tokens.neutral[700]} />
        </Pressable>

        {/* Progress Indicator */}
        <ProgressIndicator current={CURRENT_STEP} total={TOTAL_STEPS} />

        {/* Spacer for alignment */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        entering={FadeIn.delay(50).duration(300)}
      >
        {/* Title Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.titleSection}>
          <Text style={styles.title}>Como você está se sentindo nos últimos dias?</Text>
          <Text style={styles.subtitle}>Isso me ajuda a personalizar sua experiência</Text>
        </Animated.View>

        {/* Mood Cards Grid */}
        <View style={styles.cardsGrid}>
          {EMOTIONAL_STATE_OPTIONS.map((option, index) => (
            <MoodCard
              key={option.state}
              icon={option.icon}
              title={option.title}
              isSelected={emotionalState === option.state}
              onPress={() => handleSelectState(option.state)}
              index={index}
            />
          ))}
        </View>

        {/* Mensagem de encorajamento */}
        {encouragementMessage && (
          <Animated.View
            entering={FadeIn.delay(200).duration(400)}
            style={styles.encouragementContainer}
          >
            <Text style={styles.encouragementText}>{encouragementMessage}</Text>
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
            color={Tokens.neutral[400]}
            style={styles.microcopyIcon}
          />
          <Text style={styles.microcopy}>Confidencial. Sem julgamento.</Text>
        </Animated.View>
      </Animated.ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Tokens.spacing.lg }]}>
        <Button
          variant={isValid ? "accent" : "soft"}
          size="lg"
          fullWidth
          onPress={handleContinue}
          disabled={!isValid}
        >
          Continuar
        </Button>
      </View>
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.neutral[0],
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingBottom: Tokens.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Tokens.radius.full,
    backgroundColor: Tokens.neutral[0],
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  headerSpacer: {
    width: 40,
  },

  // Progress
  progressWrapper: {
    alignItems: "center",
    gap: Tokens.spacing.xs,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Tokens.neutral[200],
  },
  progressDotFilled: {
    backgroundColor: Tokens.cleanDesign.pink[300],
  },
  progressDotActive: {
    backgroundColor: Tokens.brand.accent[500],
    width: 24,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    fontFamily: Tokens.typography.fontFamily.medium,
    fontWeight: "600",
    color: Tokens.neutral[500],
    marginTop: 2,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.xl,
    paddingBottom: Tokens.spacing["4xl"],
  },

  // Title Section
  titleSection: {
    marginBottom: Tokens.spacing["2xl"],
  },
  title: {
    fontSize: 28,
    fontFamily: Tokens.typography.fontFamily.bold,
    fontWeight: "800",
    color: Tokens.neutral[900],
    lineHeight: 36,
    marginBottom: Tokens.spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Tokens.typography.fontFamily.base,
    color: Tokens.neutral[600],
    lineHeight: 24,
  },

  // Cards Grid
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Tokens.spacing.md,
    justifyContent: "space-between",
  },
  cardWrapper: {
    // width is set dynamically
  },
  card: {
    backgroundColor: Tokens.neutral[0],
    borderRadius: Tokens.radius["2xl"],
    padding: Tokens.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    borderWidth: 2,
    borderColor: Tokens.neutral[100],
    ...Tokens.shadows.flo.soft,
  },
  cardSelected: {
    borderColor: Tokens.brand.accent[400],
    backgroundColor: Tokens.brand.accent[50],
    borderWidth: 2.5,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: Tokens.radius.full,
    backgroundColor: Tokens.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Tokens.spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: Tokens.brand.accent[100],
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontWeight: "600",
    color: Tokens.neutral[700],
    textAlign: "center",
    lineHeight: 18,
  },
  cardTitleSelected: {
    color: Tokens.brand.accent[700],
    fontWeight: "700",
  },
  checkmark: {
    position: "absolute",
    top: Tokens.spacing.md,
    right: Tokens.spacing.md,
  },
  checkmarkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Tokens.brand.accent[500],
    justifyContent: "center",
    alignItems: "center",
  },

  // Encouragement message
  encouragementContainer: {
    marginTop: Tokens.spacing.xl,
    paddingHorizontal: Tokens.spacing.lg,
    paddingVertical: Tokens.spacing.md,
    backgroundColor: Tokens.brand.accent[50],
    borderRadius: Tokens.radius.xl,
    borderWidth: 1,
    borderColor: Tokens.brand.accent[200],
  },
  encouragementText: {
    fontSize: 15,
    fontFamily: Tokens.typography.fontFamily.medium,
    fontWeight: "600",
    color: Tokens.brand.accent[700],
    textAlign: "center",
    lineHeight: 22,
  },

  // Microcopy
  microcopyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Tokens.spacing["3xl"],
  },
  microcopyIcon: {
    marginRight: Tokens.spacing.xs,
  },
  microcopy: {
    fontSize: Tokens.typography.caption.fontSize,
    fontFamily: Tokens.typography.fontFamily.base,
    color: Tokens.neutral[400],
    textAlign: "center",
  },

  // Footer
  footer: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    backgroundColor: Tokens.neutral[0],
    borderTopWidth: 1,
    borderTopColor: Tokens.neutral[100],
  },
});
