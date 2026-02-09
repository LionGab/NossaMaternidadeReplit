/**
 * OnboardingCheckInNathia - Configuração de Check-in Diário
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Header com progress
 * - Imagem da NathIA com overlay
 * - Título + subtítulo
 * - Toggle card de check-in
 * - Time selector
 * - CTA continuar
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Body, Caption, NathCard, Title } from "@/components/ui";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
import type { RootStackScreenProps } from "@/types/navigation";

// Utils
import { logger } from "@/utils/logger";

// Imagem da NathIA
const CHECKIN_IMAGE = require("../../../assets/nathia-app.png");

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

type Props = RootStackScreenProps<"OnboardingCheckIn">;

// Time options
const TIME_OPTIONS = [
  { hour: 7, label: "7h" },
  { hour: 8, label: "8h" },
  { hour: 9, label: "9h" },
  { hour: 10, label: "10h" },
  { hour: 12, label: "12h" },
  { hour: 18, label: "18h" },
  { hour: 20, label: "20h" },
  { hour: 21, label: "21h" },
];

/**
 * TimeChip - Chip de seleção de horário
 */
const TimeChip = ({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.timeChip, isSelected && styles.timeChipSelected]}
    accessibilityRole="radio"
    accessibilityState={{ selected: isSelected }}
    accessibilityLabel={`Horário ${label}`}
  >
    <Caption
      weight={isSelected ? "bold" : "regular"}
      style={[styles.timeChipText, isSelected && styles.timeChipTextSelected]}
    >
      {label}
    </Caption>
  </Pressable>
);

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

export default function OnboardingCheckInNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [showTimeSelector, setShowTimeSelector] = useState(false);

  // Store selectors
  const dailyCheckIn = useNathJourneyOnboardingStore((s) => s.data.dailyCheckIn);
  const checkInHour = useNathJourneyOnboardingStore((s) => s.data.checkInHour);
  const setDailyCheckIn = useNathJourneyOnboardingStore((s) => s.setDailyCheckIn);
  const setCheckInHour = useNathJourneyOnboardingStore((s) => s.setCheckInHour);
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);
  const formatCheckInTime = useNathJourneyOnboardingStore((s) => s.formatCheckInTime);

  // Set current screen on mount
  useEffect(() => {
    setCurrentScreen("OnboardingCheckIn");
  }, [setCurrentScreen]);

  // Show time selector when check-in is enabled
  useEffect(() => {
    if (dailyCheckIn) {
      setShowTimeSelector(true);
    }
  }, [dailyCheckIn]);

  // Formatted time
  const formattedTime = useMemo(
    () => formatCheckInTime(checkInHour),
    [formatCheckInTime, checkInHour]
  );

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggleCheckIn = useCallback(
    (enabled: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setDailyCheckIn(enabled);
      setShowTimeSelector(enabled);
      logger.info(`Daily check-in ${enabled ? "enabled" : "disabled"}`, "OnboardingCheckInNathia");
    },
    [setDailyCheckIn]
  );

  const handleTimeChange = useCallback(
    (hour: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setCheckInHour(hour);
      logger.info(`Check-in hour set: ${hour}`, "OnboardingCheckInNathia");
    },
    [setCheckInHour]
  );

  const handleContinue = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("OnboardingSeason");
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[nathColors.azul.light, nathColors.cream]}
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

        <ProgressDots current={4} total={5} />

        <View style={styles.backButton} />
      </Animated.View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* NathIA Image Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <NathCard variant="elevated" style={styles.imageCard} padding="none">
            <Image
              source={CHECKIN_IMAGE}
              style={styles.image}
              contentFit="cover"
              contentPosition="top"
              accessibilityLabel="NathIA, sua companheira de maternidade"
            />
            <LinearGradient
              colors={["transparent", Tokens.glass.light.strong]}
              style={styles.imageOverlay}
            />
            <View style={styles.floatingIcon}>
              <Ionicons name="notifications" size={20} color={nathColors.white} />
            </View>
          </NathCard>
        </Animated.View>

        {/* Title Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.titleSection}>
          <Title style={styles.title}>Quer que eu te lembre de se escutar todo dia?</Title>
          <Body style={styles.subtitle}>
            Todo dia às {formattedTime} eu posso te perguntar como você está se sentindo.
          </Body>
        </Animated.View>

        {/* Toggle Card */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <NathCard
            variant={dailyCheckIn ? "elevated" : "outlined"}
            style={[styles.toggleCard, dailyCheckIn && styles.toggleCardActive]}
            padding="lg"
          >
            <View style={styles.toggleContent}>
              <View
                style={[styles.toggleIconCircle, dailyCheckIn && styles.toggleIconCircleActive]}
              >
                <Ionicons
                  name="sunny"
                  size={24}
                  color={dailyCheckIn ? nathColors.rosa.DEFAULT : nathColors.text.muted}
                />
              </View>
              <View style={styles.toggleTextWrapper}>
                <Body weight="bold" style={styles.toggleLabel}>
                  Check-in diário
                </Body>
                <Caption style={styles.toggleDescription}>
                  Receber lembretes diários da NathIA
                </Caption>
              </View>
              <Switch
                value={dailyCheckIn}
                onValueChange={handleToggleCheckIn}
                trackColor={{
                  false: nathColors.border,
                  true: nathColors.rosa.light,
                }}
                thumbColor={dailyCheckIn ? nathColors.rosa.DEFAULT : nathColors.white}
                ios_backgroundColor={nathColors.border}
                accessibilityLabel="Ativar check-in diário"
                accessibilityRole="switch"
                accessibilityState={{ checked: dailyCheckIn }}
              />
            </View>
          </NathCard>
        </Animated.View>

        {/* Time Selector */}
        {showTimeSelector && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.timeSelectorContainer}>
            <NathCard variant="outlined" style={styles.timeCard} padding="lg">
              <Body weight="bold" style={styles.timeLabel}>
                Escolha o melhor horário
              </Body>
              <View style={styles.timeChipsContainer}>
                {TIME_OPTIONS.map((option) => (
                  <TimeChip
                    key={option.hour}
                    label={option.label}
                    isSelected={checkInHour === option.hour}
                    onPress={() => handleTimeChange(option.hour)}
                  />
                ))}
              </View>
            </NathCard>
          </Animated.View>
        )}

        {/* Microcopy */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.microcopyContainer}
        >
          <Caption style={styles.microcopy}>Pode mudar depois no perfil, tranquilo</Caption>
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(400)}
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <Pressable
          onPress={handleContinue}
          style={styles.continueButton}
          accessibilityRole="button"
          accessibilityLabel="Continuar"
        >
          <LinearGradient
            colors={[nathColors.rosa.DEFAULT, nathColors.azul.DEFAULT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <Body weight="bold" style={styles.continueButtonText}>
              Continuar
            </Body>
            <Ionicons name="arrow-forward" size={20} color={nathColors.white} />
          </LinearGradient>
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

  imageCard: {
    width: "100%",
    height: 160,
    borderRadius: radius["2xl"],
    overflow: "hidden",
    marginBottom: spacing.xl,
    position: "relative",
    borderColor: nathColors.rosa.light,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  floatingIcon: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: nathColors.rosa.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
  },

  titleSection: {
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.4,
    color: nathColors.text.DEFAULT,
    marginBottom: spacing.md,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: nathColors.text.muted,
  },

  toggleCard: {
    backgroundColor: nathColors.white,
    borderColor: nathColors.border,
  },

  toggleCardActive: {
    backgroundColor: nathColors.rosa.light,
    borderColor: nathColors.rosa.DEFAULT,
  },

  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  toggleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: nathColors.input,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },

  toggleIconCircleActive: {
    backgroundColor: nathColors.white,
  },

  toggleTextWrapper: {
    flex: 1,
  },

  toggleLabel: {
    fontSize: 16,
    color: nathColors.text.DEFAULT,
    marginBottom: spacing.xs,
  },

  toggleDescription: {
    fontSize: 14,
    color: nathColors.text.muted,
    lineHeight: 20,
  },

  timeSelectorContainer: {
    marginTop: spacing.lg,
  },

  timeCard: {
    backgroundColor: nathColors.white,
    borderColor: nathColors.border,
  },

  timeLabel: {
    fontSize: 16,
    color: nathColors.text.DEFAULT,
    marginBottom: spacing.lg,
  },

  timeChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  timeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: nathColors.input,
    borderWidth: 1,
    borderColor: nathColors.border,
  },

  timeChipSelected: {
    backgroundColor: nathColors.rosa.light,
    borderColor: nathColors.rosa.DEFAULT,
  },

  timeChipText: {
    fontSize: 14,
    color: nathColors.text.DEFAULT,
  },

  timeChipTextSelected: {
    color: nathColors.rosa.DEFAULT,
  },

  microcopyContainer: {
    marginTop: spacing["2xl"],
    alignItems: "center",
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
    backgroundColor: "transparent",
  },

  continueButton: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
    ...shadows.lg,
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
});
