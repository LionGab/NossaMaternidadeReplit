/**
 * OnboardingSeasonNathia - Batize sua Jornada
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Header com progress
 * - Título + subtítulo
 * - Presets de nomes
 * - Input customizado
 * - Preview card
 * - CTA continuar
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
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
import { Body, Caption, NathCard, Title } from "@/components/ui";

// Config
import { SEASON_PRESETS } from "@/config/nath-journey-onboarding-data";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
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

type Props = RootStackScreenProps<"OnboardingSeason">;

const MAX_CUSTOM_LENGTH = 40;

/**
 * PresetButton - Botão de preset de temporada
 */
const PresetButton = ({
  label,
  isSelected,
  onPress,
  index,
}: {
  label: string;
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
      entering={FadeInDown.delay(150 + index * 50).duration(300)}
      style={animatedStyle}
    >
      <Pressable
        onPress={handlePress}
        style={[styles.presetButton, isSelected && styles.presetButtonSelected]}
        accessibilityLabel={`Selecionar: ${label}`}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
      >
        <Body
          weight={isSelected ? "bold" : "regular"}
          style={[styles.presetText, isSelected && styles.presetTextSelected]}
        >
          {label}
        </Body>
        {isSelected && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.presetCheck}>
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

/**
 * Preview Card
 */
const SeasonPreviewCard = ({ seasonName }: { seasonName: string }) => (
  <Animated.View entering={FadeInDown.duration(300)}>
    <NathCard variant="elevated" style={styles.previewCard} padding="lg">
      <LinearGradient
        colors={[nathColors.rosa.light, nathColors.azul.light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.previewGradient}
      >
        <View style={styles.previewContent}>
          <Caption style={styles.previewLabel}>Sua temporada</Caption>
          <Title style={styles.previewSeasonName}>"{seasonName}"</Title>
          <View style={styles.previewDecoration}>
            <View style={styles.decorationDot} />
            <View style={[styles.decorationDot, { backgroundColor: nathColors.azul.DEFAULT }]} />
            <View style={[styles.decorationDot, { backgroundColor: nathColors.verde.DEFAULT }]} />
          </View>
        </View>
      </LinearGradient>
    </NathCard>
  </Animated.View>
);

export default function OnboardingSeasonNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // Store selectors
  const seasonKey = useNathJourneyOnboardingStore((s) => s.data.seasonKey);
  const seasonCustomName = useNathJourneyOnboardingStore((s) => s.data.seasonCustomName);
  const setSeasonKey = useNathJourneyOnboardingStore((s) => s.setSeasonKey);
  const setSeasonCustomName = useNathJourneyOnboardingStore((s) => s.setSeasonCustomName);
  const canProceed = useNathJourneyOnboardingStore((s) => s.canProceed);
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);
  const getSeasonName = useNathJourneyOnboardingStore((s) => s.getSeasonName);

  // Set current screen on mount
  useEffect(() => {
    setCurrentScreen("OnboardingSeason");
  }, [setCurrentScreen]);

  // Local state
  const [customSeason, setCustomSeason] = useState(() => {
    if (seasonKey === "custom" && seasonCustomName) {
      return seasonCustomName;
    }
    return "";
  });

  const [selectedPreset, setSelectedPreset] = useState<
    (typeof SEASON_PRESETS)[number]["key"] | null
  >(() => {
    if (seasonKey && seasonKey !== "custom") return seasonKey;
    return null;
  });

  // Validation
  const isValid = useMemo(() => canProceed(), [canProceed]);

  // Get display name
  const seasonName = getSeasonName();

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectPreset = useCallback(
    (presetKey: (typeof SEASON_PRESETS)[number]["key"]) => {
      setSelectedPreset(presetKey);
      setCustomSeason("");
      setSeasonCustomName(null);
      setSeasonKey(presetKey);
      logger.info(`Season preset selected: ${presetKey}`, "OnboardingSeasonNathia");
    },
    [setSeasonKey, setSeasonCustomName]
  );

  const handleCustomChange = useCallback(
    (text: string) => {
      if (text.length <= MAX_CUSTOM_LENGTH) {
        setCustomSeason(text);
        setSelectedPreset(null);
        setSeasonCustomName(text.length > 0 ? text : null);
      }
    },
    [setSeasonCustomName]
  );

  const handleContinue = useCallback(async () => {
    if (!isValid) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("OnboardingSummary");
  }, [isValid, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Background Gradient */}
        <LinearGradient
          colors={[nathColors.verde.light, nathColors.cream]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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

          <ProgressDots current={5} total={5} />

          <View style={styles.backButton} />
        </Animated.View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Section */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.titleSection}>
            <Title style={styles.title}>Dê um nome pra sua temporada</Title>
            <Body style={styles.subtitle}>
              Esse nome vai te acompanhar ao longo da sua jornada.
            </Body>
          </Animated.View>

          {/* Preset Options */}
          <View style={styles.presetsContainer}>
            {SEASON_PRESETS.map((preset, index) => (
              <PresetButton
                key={preset.key}
                label={preset.label}
                isSelected={selectedPreset === preset.key}
                onPress={() => handleSelectPreset(preset.key)}
                index={index}
              />
            ))}
          </View>

          {/* Custom Input */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={styles.customContainer}
          >
            <Caption style={styles.customLabel}>
              Ou escreve a sua (até {MAX_CUSTOM_LENGTH} caracteres)
            </Caption>
            <TextInput
              value={customSeason}
              onChangeText={handleCustomChange}
              placeholder="Ex: Recomeçando com gentileza"
              placeholderTextColor={nathColors.text.muted}
              maxLength={MAX_CUSTOM_LENGTH}
              style={styles.customInput}
              accessibilityLabel="Campo para escrever nome da temporada"
            />
            {customSeason.length > 0 && (
              <Caption style={styles.charCount}>
                {customSeason.length}/{MAX_CUSTOM_LENGTH}
              </Caption>
            )}
          </Animated.View>

          {/* Preview Card */}
          {(seasonName || customSeason) && (
            <View style={styles.previewContainer}>
              <Caption style={styles.previewSectionLabel}>Preview do seu card:</Caption>
              <SeasonPreviewCard seasonName={seasonName || customSeason} />
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={[styles.bottomContainer, { paddingBottom: insets.bottom + spacing.md }]}
        >
          <Pressable
            onPress={handleContinue}
            disabled={!isValid}
            style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Começar minha temporada"
            accessibilityState={{ disabled: !isValid }}
          >
            <LinearGradient
              colors={
                isValid
                  ? [nathColors.rosa.DEFAULT, nathColors.azul.DEFAULT]
                  : [nathColors.input, nathColors.input]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButtonGradient}
            >
              <Body
                weight="bold"
                style={[styles.continueButtonText, !isValid && styles.continueButtonTextDisabled]}
              >
                Começar minha temporada
              </Body>
              <Ionicons
                name="sparkles"
                size={20}
                color={!isValid ? nathColors.text.muted : nathColors.white}
              />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

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
    marginBottom: spacing.md,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: nathColors.text.muted,
  },

  presetsContainer: {
    gap: spacing.md,
    marginBottom: spacing["2xl"],
  },

  presetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing["2xl"],
    borderRadius: radius["2xl"],
    borderWidth: 1.5,
    borderColor: nathColors.border,
    backgroundColor: nathColors.white,
    minHeight: 60,
    ...shadows.sm,
  },

  presetButtonSelected: {
    borderColor: nathColors.rosa.DEFAULT,
    backgroundColor: nathColors.rosa.light,
    borderWidth: 2,
    ...shadows.md,
  },

  presetText: {
    fontSize: 16,
    color: nathColors.text.DEFAULT,
    textAlign: "center",
  },

  presetTextSelected: {
    color: nathColors.text.DEFAULT,
  },

  presetCheck: {
    position: "absolute",
    right: spacing.lg,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: nathColors.rosa.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },

  customContainer: {
    marginBottom: spacing["2xl"],
  },

  customLabel: {
    fontSize: 15,
    color: nathColors.text.muted,
    marginBottom: spacing.md,
  },

  customInput: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderRadius: radius["2xl"],
    borderWidth: 1.5,
    borderColor: nathColors.border,
    backgroundColor: nathColors.white,
    fontSize: 16,
    color: nathColors.text.DEFAULT,
    minHeight: 60,
  },

  charCount: {
    fontSize: 13,
    color: nathColors.text.muted,
    textAlign: "right",
    marginTop: spacing.sm,
  },

  previewContainer: {
    marginTop: spacing.lg,
  },

  previewSectionLabel: {
    fontSize: 15,
    color: nathColors.text.muted,
    marginBottom: spacing.lg,
    textAlign: "center",
  },

  previewCard: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
    borderColor: nathColors.rosa.light,
  },

  previewGradient: {
    padding: spacing["2xl"],
  },

  previewContent: {
    alignItems: "center",
  },

  previewLabel: {
    fontSize: 12,
    color: nathColors.text.muted,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  previewSeasonName: {
    fontSize: 20,
    color: nathColors.text.DEFAULT,
    textAlign: "center",
    fontStyle: "italic",
  },

  previewDecoration: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  decorationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: nathColors.rosa.DEFAULT,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: "transparent",
  },

  continueButton: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
    ...shadows.lg,
  },

  continueButtonDisabled: {
    ...shadows.sm,
  },

  continueButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing["2xl"],
  },

  continueButtonText: {
    fontSize: 16,
    color: nathColors.white,
  },

  continueButtonTextDisabled: {
    color: nathColors.text.muted,
  },
});
