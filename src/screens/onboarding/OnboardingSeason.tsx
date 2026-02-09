/**
 * Tela 6: OnboardingSeason - "Batize sua Jornada"
 *
 * Redesign usando componentes base unificados:
 * - OnboardingLayout para background e safe area
 * - OnboardingHeader para navegação e progresso
 * - OnboardingFooter para CTA
 *
 * Features:
 * - Presets de nomes de temporada
 * - Input customizado com contador de caracteres
 * - Preview do ShareableCard
 */

import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { OnboardingFooter } from "@/components/onboarding/layout/OnboardingFooter";
import { OnboardingHeader } from "@/components/onboarding/layout/OnboardingHeader";
import { OnboardingLayout } from "@/components/onboarding/layout/OnboardingLayout";
import { ShareableCard } from "@/components/onboarding/ShareableCard";

import { SEASON_PRESETS } from "@/config/nath-journey-onboarding-data";
import { useOnboardingResponsive } from "@/hooks/useOnboardingResponsive";
import { useTheme } from "@/hooks/useTheme";
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { Tokens } from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"OnboardingSeason">;

// ===========================================
// CONSTANTS
// ===========================================

const TOTAL_STEPS = 7;
const CURRENT_STEP = 6;
const MAX_CUSTOM_LENGTH = 40;

// ===========================================
// COMPONENT
// ===========================================

export default function OnboardingSeason({ navigation }: Props) {
  const theme = useTheme();
  const responsive = useOnboardingResponsive();

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

  // Progress
  const progress = useMemo(() => CURRENT_STEP / TOTAL_STEPS, []);

  // Can proceed validation
  const isValid = useMemo(() => canProceed(), [canProceed]);

  // Get display name
  const seasonName = getSeasonName();

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectPreset = useCallback(
    (presetKey: (typeof SEASON_PRESETS)[number]["key"]) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setSelectedPreset(presetKey);
      setCustomSeason("");
      setSeasonCustomName(null);
      setSeasonKey(presetKey);
      logger.info(`Season preset selected: ${presetKey}`, "OnboardingSeason");
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

  const handleContinue = useCallback(() => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    navigation.navigate("OnboardingSummary");
  }, [isValid, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <OnboardingLayout
        gradient={[Tokens.brand.primary[50], Tokens.neutral[0]]}
        scrollable={true}
        testID="onboarding-season-screen"
      >
        {/* Header with progress */}
        <View style={[styles.headerContainer, { marginTop: responsive.headerMarginTop }]}>
          <OnboardingHeader progress={progress} onBack={handleBack} showProgress={true} />
        </View>

        {/* Content */}
        <View style={[styles.content, { paddingHorizontal: responsive.paddingHorizontal }]}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text
              style={[
                styles.title,
                { fontSize: responsive.titleFontSize, lineHeight: responsive.titleLineHeight },
              ]}
            >
              Dê um nome pra sua temporada
            </Text>

            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Esse nome vai te acompanhar ao longo da sua jornada.
            </Text>

            {/* Preset Options */}
            <View style={styles.presetsContainer}>
              {SEASON_PRESETS.map((preset, index) => {
                const isSelected = selectedPreset === preset.key;
                return (
                  <Animated.View
                    key={preset.key}
                    entering={FadeInDown.delay(150 + index * 50).duration(300)}
                  >
                    <Pressable
                      onPress={() => handleSelectPreset(preset.key)}
                      style={({ pressed }) => [
                        styles.presetButton,
                        {
                          borderColor: isSelected
                            ? Tokens.brand.accent[500]
                            : theme.colors.border.subtle,
                          backgroundColor: theme.surface.card,
                          transform: [{ scale: pressed ? 0.98 : 1 }],
                        },
                        isSelected && styles.presetButtonSelected,
                      ]}
                      accessibilityLabel={`Selecionar: ${preset.label}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text style={[styles.presetText, { color: theme.text.primary }]}>
                        {preset.label}
                      </Text>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>

            {/* Custom Input */}
            <View style={styles.customContainer}>
              <Text style={[styles.customLabel, { color: theme.text.secondary }]}>
                Ou escreve a sua (até {MAX_CUSTOM_LENGTH} caracteres)
              </Text>
              <TextInput
                value={customSeason}
                onChangeText={handleCustomChange}
                placeholder="Ex: Recomeçando com gentileza"
                placeholderTextColor={theme.text.tertiary}
                maxLength={MAX_CUSTOM_LENGTH}
                style={[
                  styles.customInput,
                  {
                    backgroundColor: theme.surface.card,
                    borderColor: theme.colors.border.subtle,
                    color: theme.text.primary,
                  },
                ]}
                accessibilityLabel="Campo para escrever nome da temporada"
              />
              {customSeason.length > 0 && (
                <Text style={[styles.charCount, { color: theme.text.tertiary }]}>
                  {customSeason.length}/{MAX_CUSTOM_LENGTH}
                </Text>
              )}
            </View>

            {/* Preview Card */}
            {(seasonName || customSeason) && (
              <Animated.View entering={FadeInDown.duration(300)} style={styles.previewContainer}>
                <Text style={[styles.previewLabel, { color: theme.text.secondary }]}>
                  Preview do seu card:
                </Text>
                <ShareableCard seasonName={seasonName || customSeason} />
              </Animated.View>
            )}
          </Animated.View>
        </View>

        {/* Footer CTA */}
        <OnboardingFooter
          label="Começar minha temporada"
          onPress={handleContinue}
          disabled={!isValid}
          showGlow={isValid}
        />
      </OnboardingLayout>
    </KeyboardAvoidingView>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  headerContainer: {
    // marginTop is set dynamically via responsive hook
  },
  content: {
    flex: 1,
    // paddingHorizontal is set dynamically via responsive hook
    paddingTop: Tokens.spacing["2xl"],
  },
  title: {
    fontSize: 28,
    fontFamily: Tokens.typography.fontFamily.bold,
    fontWeight: "800",
    color: Tokens.neutral[900],
    lineHeight: 36,
    marginBottom: Tokens.spacing.lg,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: Tokens.typography.fontFamily.base,
    lineHeight: 22,
    marginBottom: Tokens.spacing["3xl"],
    opacity: 0.8,
  },
  presetsContainer: {
    gap: Tokens.spacing.md,
    marginBottom: Tokens.spacing["3xl"],
  },
  presetButton: {
    paddingVertical: Tokens.spacing.xl,
    paddingHorizontal: Tokens.spacing["2xl"],
    borderRadius: Tokens.radius["2xl"],
    borderWidth: 1.5,
    alignItems: "center",
    minHeight: 60,
    justifyContent: "center",
  },
  presetButtonSelected: {
    borderWidth: 2.5,
    ...Tokens.shadows.lg,
  },
  presetText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Tokens.typography.fontFamily.semibold,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  customContainer: {
    marginBottom: Tokens.spacing["3xl"],
  },
  customLabel: {
    fontSize: 15,
    fontFamily: Tokens.typography.fontFamily.medium,
    marginBottom: Tokens.spacing.md,
    opacity: 0.8,
  },
  customInput: {
    paddingVertical: Tokens.spacing.xl,
    paddingHorizontal: Tokens.spacing.xl,
    borderRadius: Tokens.radius["2xl"],
    borderWidth: 1.5,
    fontSize: 16,
    fontFamily: Tokens.typography.fontFamily.base,
    minHeight: 60,
  },
  charCount: {
    fontSize: 13,
    fontFamily: Tokens.typography.fontFamily.base,
    textAlign: "right",
    marginTop: Tokens.spacing.sm,
    opacity: 0.6,
  },
  previewContainer: {
    marginTop: Tokens.spacing["2xl"],
    paddingBottom: Tokens.spacing["4xl"],
  },
  previewLabel: {
    fontSize: 15,
    fontFamily: Tokens.typography.fontFamily.medium,
    marginBottom: Tokens.spacing.lg,
    textAlign: "center",
    opacity: 0.7,
  },
});
