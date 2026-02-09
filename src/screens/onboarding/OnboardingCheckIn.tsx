/**
 * Tela 5: OnboardingCheckIn - "Seu Ritual Diario"
 *
 * Flo Health Minimal Design:
 * - Subtle pink-to-white gradient background
 * - Clean selection cards with soft shadows
 * - Manrope typography throughout
 * - Progress indicator in header
 * - CTA button using OnboardingFooter
 * - Full dark mode support
 *
 * Features:
 * - Toggle para ativar check-in diario
 * - Time picker (aparece quando toggle ativo)
 * - Imagem da NathIA com overlay
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { TimeSelector } from "@/components/onboarding/inputs/TimeSelector";
import { OnboardingFooter } from "@/components/onboarding/layout/OnboardingFooter";
import { OnboardingHeader } from "@/components/onboarding/layout/OnboardingHeader";
import { OnboardingLayout } from "@/components/onboarding/layout/OnboardingLayout";

import { useOnboardingResponsive } from "@/hooks/useOnboardingResponsive";
import { useTheme } from "@/hooks/useTheme";
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { Tokens } from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";

// Imagem da NathIA
const CHECKIN_IMAGE = require("../../../assets/nathia-app.png");

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"OnboardingCheckIn">;

// ===========================================
// CONSTANTS
// ===========================================

const TOTAL_STEPS = 7;
const CURRENT_STEP = 5;

// ===========================================
// COMPONENT
// ===========================================

export default function OnboardingCheckIn({ navigation }: Props) {
  const theme = useTheme();
  const responsive = useOnboardingResponsive();
  const isDark = theme.isDark;

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

  // Progress
  const progress = useMemo(() => CURRENT_STEP / TOTAL_STEPS, []);

  // Flo Health Minimal gradient - subtle pink to white (dark mode aware)
  const backgroundGradient = useMemo(
    () =>
      isDark
        ? ([Tokens.neutral[900], Tokens.neutral[800]] as const)
        : ([Tokens.cleanDesign.pink[50], Tokens.neutral[0]] as const),
    [isDark]
  );

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggleCheckIn = useCallback(
    (enabled: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setDailyCheckIn(enabled);
      logger.info(`Daily check-in ${enabled ? "enabled" : "disabled"}`, "OnboardingCheckIn");
    },
    [setDailyCheckIn]
  );

  const handleTimeChange = useCallback(
    (hour: number) => {
      setCheckInHour(hour);
      logger.info(`Check-in hour set: ${hour}`, "OnboardingCheckIn");
    },
    [setCheckInHour]
  );

  const handleContinue = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    navigation.navigate("OnboardingSeason");
  }, [navigation]);

  // Dynamic colors for dark mode
  const cardBackground = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
  const cardBorderColor = isDark ? Tokens.neutral[700] : Tokens.cleanDesign.pink[100];
  const titleColor = isDark ? Tokens.neutral[50] : Tokens.neutral[900];
  const subtitleColor = isDark ? Tokens.neutral[400] : Tokens.neutral[600];
  const microcopyColor = isDark ? Tokens.neutral[500] : Tokens.neutral[400];

  return (
    <OnboardingLayout
      gradient={backgroundGradient}
      scrollable={true}
      testID="onboarding-checkin-screen"
    >
      {/* Header with progress */}
      <View style={[styles.headerContainer, { marginTop: responsive.headerMarginTop }]}>
        <OnboardingHeader progress={progress} onBack={handleBack} showProgress={true} />
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingHorizontal: responsive.paddingHorizontal }]}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          {/* NathIA Image Card - Flo Health Minimal style */}
          <View
            style={[
              styles.imageCard,
              {
                backgroundColor: cardBackground,
                borderColor: cardBorderColor,
              },
              isDark ? Tokens.shadows.md : Tokens.shadows.flo.soft,
            ]}
          >
            <Image
              source={CHECKIN_IMAGE}
              style={styles.image}
              contentFit="contain"
              accessibilityLabel="NathIA, sua companheira de maternidade"
            />
            <LinearGradient
              colors={
                isDark
                  ? ["transparent", Tokens.overlay.heavy]
                  : ["transparent", Tokens.glass.light.medium]
              }
              style={styles.imageOverlay}
            />
            {/* Floating icon indicator */}
            <View
              style={[
                styles.floatingIcon,
                { backgroundColor: isDark ? Tokens.brand.accent[600] : Tokens.brand.accent[400] },
              ]}
            >
              <Ionicons name="notifications" size={20} color={Tokens.neutral[0]} />
            </View>
          </View>

          {/* Title - Manrope Bold */}
          <Text
            style={[
              styles.title,
              {
                color: titleColor,
                fontFamily: Tokens.typography.fontFamily.bold,
              },
            ]}
          >
            Quer que eu te lembre de se escutar todo dia?
          </Text>

          {/* Subtitle - Manrope Regular */}
          <Text
            style={[
              styles.subtitle,
              {
                color: subtitleColor,
                fontFamily: Tokens.typography.fontFamily.base,
              },
            ]}
          >
            Todo dia às {formatCheckInTime(checkInHour)} eu posso te perguntar como você está se
            sentindo.
          </Text>

          {/* Toggle Card - Flo Health Minimal Clean Card */}
          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <View
              style={[
                styles.toggleCard,
                {
                  backgroundColor: cardBackground,
                  borderColor: dailyCheckIn
                    ? isDark
                      ? Tokens.brand.accent[400]
                      : Tokens.brand.accent[200]
                    : cardBorderColor,
                },
                isDark ? Tokens.shadows.md : Tokens.shadows.flo.soft,
              ]}
            >
              <View style={styles.toggleContent}>
                <View style={styles.toggleIconWrapper}>
                  <View
                    style={[
                      styles.toggleIconCircle,
                      {
                        backgroundColor: dailyCheckIn
                          ? isDark
                            ? Tokens.brand.accent[500]
                            : Tokens.brand.accent[100]
                          : isDark
                            ? Tokens.neutral[700]
                            : Tokens.neutral[100],
                      },
                    ]}
                  >
                    <Ionicons
                      name="sunny"
                      size={24}
                      color={
                        dailyCheckIn
                          ? isDark
                            ? Tokens.neutral[0]
                            : Tokens.brand.accent[500]
                          : isDark
                            ? Tokens.neutral[500]
                            : Tokens.neutral[400]
                      }
                    />
                  </View>
                </View>
                <View style={styles.toggleTextWrapper}>
                  <Text
                    style={[
                      styles.toggleLabel,
                      {
                        color: titleColor,
                        fontFamily: Tokens.typography.fontFamily.semibold,
                      },
                    ]}
                  >
                    Check-in diario
                  </Text>
                  <Text
                    style={[
                      styles.toggleDescription,
                      {
                        color: subtitleColor,
                        fontFamily: Tokens.typography.fontFamily.base,
                      },
                    ]}
                  >
                    Receber lembretes diarios da NathIA
                  </Text>
                </View>
              </View>
              <Switch
                value={dailyCheckIn}
                onValueChange={handleToggleCheckIn}
                trackColor={{
                  false: isDark ? Tokens.neutral[600] : Tokens.neutral[200],
                  true: isDark ? Tokens.brand.accent[600] : Tokens.brand.accent[200],
                }}
                thumbColor={
                  dailyCheckIn
                    ? isDark
                      ? Tokens.brand.accent[300]
                      : Tokens.brand.accent[500]
                    : isDark
                      ? Tokens.neutral[400]
                      : Tokens.neutral[0]
                }
                ios_backgroundColor={isDark ? Tokens.neutral[600] : Tokens.neutral[200]}
                accessibilityLabel="Ativar check-in diario"
                accessibilityRole="switch"
                accessibilityState={{ checked: dailyCheckIn }}
              />
            </View>
          </Animated.View>

          {/* Time Selector (when check-in enabled) */}
          {dailyCheckIn && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.timeContainer}>
              <View
                style={[
                  styles.timeCard,
                  {
                    backgroundColor: cardBackground,
                    borderColor: cardBorderColor,
                  },
                  isDark ? Tokens.shadows.md : Tokens.shadows.flo.soft,
                ]}
              >
                <TimeSelector
                  value={checkInHour}
                  onChange={handleTimeChange}
                  label="Horario do check-in"
                  formatTime={formatCheckInTime}
                  testID="checkin-time-selector"
                />
              </View>
            </Animated.View>
          )}

          {/* Microcopy - Flo Health Minimal style */}
          <Text
            style={[
              styles.microcopy,
              {
                color: microcopyColor,
                fontFamily: Tokens.typography.fontFamily.base,
              },
            ]}
          >
            Pode mudar depois no perfil, tranquilo
          </Text>
        </Animated.View>
      </View>

      {/* Footer CTA */}
      <OnboardingFooter label="Continuar" onPress={handleContinue} showGlow={true} />
    </OnboardingLayout>
  );
}

// ===========================================
// STYLES - Flo Health Minimal Design
// ===========================================

const styles = StyleSheet.create({
  headerContainer: {
    // marginTop is set dynamically via responsive hook
  },
  content: {
    flex: 1,
    paddingTop: Tokens.spacing.md,
  },
  imageCard: {
    width: "100%",
    height: 140,
    borderRadius: Tokens.radius["2xl"],
    overflow: "hidden",
    marginBottom: Tokens.spacing.lg,
    borderWidth: 1,
    position: "relative",
    backgroundColor: Tokens.cleanDesign.pink[50],
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
    bottom: Tokens.spacing.lg,
    right: Tokens.spacing.lg,
    width: 48,
    height: 48,
    borderRadius: Tokens.radius.full,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 28,
    marginBottom: Tokens.spacing.lg,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Tokens.spacing.sm,
    opacity: 0.85,
  },
  question: {
    marginBottom: Tokens.spacing.xl,
    fontWeight: "700",
    opacity: 1,
  },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Tokens.spacing.lg,
    borderRadius: Tokens.radius["2xl"],
    borderWidth: 1.5,
    marginBottom: Tokens.spacing.lg,
    minHeight: 76,
  },
  toggleContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: Tokens.spacing.lg,
  },
  toggleIconWrapper: {
    marginRight: Tokens.spacing.lg,
  },
  toggleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Tokens.radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleTextWrapper: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: Tokens.spacing.xs,
  },
  toggleDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.75,
  },
  timeContainer: {
    marginBottom: Tokens.spacing.xl,
  },
  timeCard: {
    borderRadius: Tokens.radius["2xl"],
    borderWidth: 1.5,
    padding: Tokens.spacing.xl,
  },
  microcopy: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginTop: Tokens.spacing.lg,
    marginBottom: Tokens.spacing["3xl"],
    opacity: 0.6,
  },
});
