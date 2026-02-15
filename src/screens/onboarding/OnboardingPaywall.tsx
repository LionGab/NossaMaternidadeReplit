/**
 * Tela 8: OnboardingPaywall - "Premium"
 *
 * Redesign usando componentes base unificados:
 * - OnboardingLayout para background e safe area
 * - OnboardingHeader para progresso (sem back button)
 *
 * Features:
 * - Paywall específico para onboarding com RevenueCat
 * - Banner especial se needsExtraCare = true
 * - Trial de 7 dias grátis
 * - Restaurar compras
 * - Continuar grátis (skip)
 *
 * Note: Footer customizado com múltiplos CTAs
 */

import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { PurchasesPackage } from "react-native-purchases";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OnboardingHeader } from "@/components/onboarding/layout/OnboardingHeader";
import { OnboardingLayout } from "@/components/onboarding/layout/OnboardingLayout";

import { useOnboardingResponsive } from "@/hooks/useOnboardingResponsive";
import { useTheme } from "@/hooks/useTheme";
import {
  getIsConfigured,
  getOfferings,
  purchasePackage,
  restorePurchases,
} from "@/services/revenuecat";
import { trackEvent, trackPaywallExposure, trackPaywallOutcome } from "@/services/analytics";
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { usePremiumStore } from "@/state/premium-store";
import { useAppStore } from "@/state";
import { Tokens } from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"OnboardingPaywall">;

// ===========================================
// CONSTANTS
// ===========================================

const TOTAL_STEPS = 8;
const CURRENT_STEP = 8;
const PAYWALL_IMAGE = require("../../../assets/onboarding/images/nath-profile-small.jpg");

const BENEFITS = [
  "Conversa ilimitada com NathIA",
  "Tracker personalizado",
  "Conteúdo exclusivo da Nath",
  'Comunidade "Mães Valente"',
  "Grupo VIP (se baixou no D1)",
];

const ONBOARDING_PAYWALL_EXPERIMENT = "paywall_onboarding_v1";
const ONBOARDING_PAYWALL_VARIANT = "legacy_primary";

// ===========================================
// COMPONENT
// ===========================================

export default function OnboardingPaywall({ navigation: _navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const responsive = useOnboardingResponsive();

  // Store selectors
  const data = useNathJourneyOnboardingStore((s) => s.data);
  const completeOnboarding = useNathJourneyOnboardingStore((s) => s.completeOnboarding);
  const needsExtraCare = useNathJourneyOnboardingStore((s) => s.needsExtraCare);
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);
  const authUserId = useAppStore((s) => s.authUserId);

  // Premium store
  const isPurchasing = usePremiumStore((s) => s.isPurchasing);
  const setPurchasing = usePremiumStore((s) => s.setPurchasing);
  const setPremiumStatus = usePremiumStore((s) => s.setPremiumStatus);

  // Local state
  const [isSaving, setIsSaving] = useState(false);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [yearlyPackage, setYearlyPackage] = useState<PurchasesPackage | null>(null);
  const [selectedPackage] = useState<"monthly" | "yearly">("monthly");

  const hasTrackedPaywallExposure = useRef(false);
  const monthlyPackageId = monthlyPackage?.identifier ?? null;
  const hasMonthlyPackage = !!monthlyPackageId;

  const needsExtraCareFlag = needsExtraCare();
  const progress = CURRENT_STEP / TOTAL_STEPS;

  // Load RevenueCat offerings
  useEffect(() => {
    async function loadOfferings() {
      try {
        if (!getIsConfigured()) {
          logger.info("RevenueCat not configured (likely Expo Go)", "OnboardingPaywall");
          return;
        }

        const offerings = await getOfferings();
        if (offerings?.availablePackages) {
          const monthly = offerings.availablePackages.find(
            (pkg) => pkg.packageType === "MONTHLY" || pkg.identifier.includes("monthly")
          );
          const yearly = offerings.availablePackages.find(
            (pkg) => pkg.packageType === "ANNUAL" || pkg.identifier.includes("yearly")
          );

          setMonthlyPackage(monthly || null);
          setYearlyPackage(yearly || null);

          logger.info("Offerings loaded", "OnboardingPaywall", {
            monthly: monthly?.identifier,
            yearly: yearly?.identifier,
          });
        }
      } catch (error) {
        logger.error(
          "Failed to load offerings",
          "OnboardingPaywall",
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }

    loadOfferings();
  }, []);

  useEffect(() => {
    setCurrentScreen("OnboardingPaywall");
  }, [setCurrentScreen]);

  useEffect(() => {
    if (hasTrackedPaywallExposure.current) return;
    hasTrackedPaywallExposure.current = true;

    trackPaywallExposure({
      experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
      variant: ONBOARDING_PAYWALL_VARIANT,
      screenName: "OnboardingPaywall",
      metadata: {
        needs_extra_care: needsExtraCareFlag,
        selected_package: selectedPackage,
        has_monthly_package: hasMonthlyPackage,
      },
    }).catch(() => {
      // Exposure telemetry should never block onboarding.
    });
  }, [needsExtraCareFlag, hasMonthlyPackage, selectedPackage]);

  // Get display price
  const getMonthlyPrice = useCallback(() => {
    return monthlyPackage?.product?.priceString ?? "R$ 34,90";
  }, [monthlyPackage]);

  // Silence unused yearlyPackage warning (UI not yet implemented)
  void yearlyPackage;

  // Complete onboarding handler
  const handleComplete = useCallback(async () => {
    try {
      setIsSaving(true);

      if (!data.stage) {
        logger.error("No stage set, cannot complete onboarding", "OnboardingPaywall");
        Alert.alert(
          "Erro",
          "Por favor, volte e selecione seu momento de vida antes de continuar.",
          [{ text: "OK" }]
        );
        return;
      }

      completeOnboarding();
      await trackEvent({
        eventName: "onboarding_completed",
        category: "conversion",
        screenName: "OnboardingPaywall",
        properties: {
          needs_extra_care: needsExtraCareFlag,
          selected_package: selectedPackage,
        },
      });
      logger.info("Onboarding completed", "OnboardingPaywall", { userId: authUserId ?? null });

      // CRITICAL: Reset navigation stack before state change propagates
      // Prevents React Navigation from entering broken state when onboarding screens disappear
      _navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error) {
      logger.error(
        "Error completing onboarding",
        "OnboardingPaywall",
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    authUserId,
    data.stage,
    needsExtraCareFlag,
    selectedPackage,
    completeOnboarding,
    _navigation,
  ]);

  // Start trial / purchase handler
  const handleStartTrial = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      await trackEvent({
        eventName: "paywall_cta_tapped",
        category: "conversion",
        screenName: "OnboardingPaywall",
        properties: {
          experiment_name: ONBOARDING_PAYWALL_EXPERIMENT,
          variant: ONBOARDING_PAYWALL_VARIANT,
          cta: "start_trial",
          selected_package: selectedPackage,
        },
      });

      // Skip paywall for extra care users
      if (needsExtraCareFlag) {
        await trackPaywallOutcome({
          experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
          variant: ONBOARDING_PAYWALL_VARIANT,
          outcomeType: "skip_free",
          metadata: { reason: "needs_extra_care" },
        });
        logger.info("Skipping paywall for extra care user", "OnboardingPaywall");
        await handleComplete();
        return;
      }

      const packageToPurchase = selectedPackage === "yearly" ? yearlyPackage : monthlyPackage;

      // Complete without purchase if RevenueCat unavailable
      if (!getIsConfigured() || !packageToPurchase) {
        await trackPaywallOutcome({
          experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
          variant: ONBOARDING_PAYWALL_VARIANT,
          outcomeType: "skip_free",
          metadata: { reason: "revenuecat_unavailable" },
        });
        logger.info("RevenueCat not available, completing without purchase", "OnboardingPaywall");
        await handleComplete();
        return;
      }

      setPurchasing(true);
      logger.info("Starting purchase", "OnboardingPaywall", {
        package: packageToPurchase.identifier,
      });

      const result = await purchasePackage(packageToPurchase);

      if (result.success) {
        await trackPaywallOutcome({
          experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
          variant: ONBOARDING_PAYWALL_VARIANT,
          outcomeType: "trial_started",
          metadata: {
            package_identifier: packageToPurchase.identifier,
            price_string: packageToPurchase.product.priceString,
          },
        });
        logger.info("Purchase successful", "OnboardingPaywall");
        setPremiumStatus(true);
        await handleComplete();
      } else if (result.error === "cancelled") {
        await trackPaywallOutcome({
          experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
          variant: ONBOARDING_PAYWALL_VARIANT,
          outcomeType: "dismissed",
          metadata: {
            reason: "purchase_cancelled",
            package_identifier: packageToPurchase.identifier,
          },
        });
        logger.info("Purchase cancelled by user", "OnboardingPaywall");
      } else {
        await trackPaywallOutcome({
          experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
          variant: ONBOARDING_PAYWALL_VARIANT,
          outcomeType: "purchase_failed",
          metadata: {
            package_identifier: packageToPurchase.identifier,
            error: result.error || "unknown_purchase_error",
          },
        });
        logger.error(
          "Purchase failed",
          "OnboardingPaywall",
          new Error(result.error || "Unknown error")
        );
        Alert.alert(
          "Erro na compra",
          "Não foi possível processar sua compra. Você pode tentar novamente ou continuar sem assinatura.",
          [
            { text: "Tentar novamente", onPress: handleStartTrial },
            { text: "Continuar grátis", onPress: handleComplete },
          ]
        );
      }
    } catch (error) {
      logger.error(
        "Error starting trial",
        "OnboardingPaywall",
        error instanceof Error ? error : new Error(String(error))
      );
      await trackPaywallOutcome({
        experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
        variant: ONBOARDING_PAYWALL_VARIANT,
        outcomeType: "purchase_failed",
        metadata: { error: error instanceof Error ? error.message : String(error) },
      });
      await handleComplete();
    } finally {
      setPurchasing(false);
    }
  }, [
    needsExtraCareFlag,
    selectedPackage,
    monthlyPackage,
    yearlyPackage,
    setPurchasing,
    setPremiumStatus,
    handleComplete,
  ]);

  // Restore purchases handler
  const handleRestore = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setPurchasing(true);

      await trackEvent({
        eventName: "paywall_cta_tapped",
        category: "conversion",
        screenName: "OnboardingPaywall",
        properties: {
          experiment_name: ONBOARDING_PAYWALL_EXPERIMENT,
          variant: ONBOARDING_PAYWALL_VARIANT,
          cta: "restore",
        },
      });

      const result = await restorePurchases();

      if (result.success) {
        await trackPaywallOutcome({
          experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
          variant: ONBOARDING_PAYWALL_VARIANT,
          outcomeType: "restore_success",
          metadata: { source: "onboarding_restore" },
        });
        logger.info("Restore successful", "OnboardingPaywall");
        setPremiumStatus(true);
        Alert.alert("Sucesso!", "Sua assinatura foi restaurada.", [
          { text: "Continuar", onPress: handleComplete },
        ]);
      } else {
        await trackPaywallOutcome({
          experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
          variant: ONBOARDING_PAYWALL_VARIANT,
          outcomeType: "restore_failed",
          metadata: { reason: "no_subscription_found" },
        });
        Alert.alert(
          "Nenhuma assinatura encontrada",
          "Não encontramos uma assinatura ativa para restaurar."
        );
      }
    } catch (error) {
      logger.error(
        "Restore failed",
        "OnboardingPaywall",
        error instanceof Error ? error : new Error(String(error))
      );
      await trackPaywallOutcome({
        experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
        variant: ONBOARDING_PAYWALL_VARIANT,
        outcomeType: "restore_failed",
        metadata: { error: error instanceof Error ? error.message : String(error) },
      });
      Alert.alert("Erro", "Não foi possível restaurar sua assinatura.");
    } finally {
      setPurchasing(false);
    }
  }, [setPurchasing, setPremiumStatus, handleComplete]);

  const handleTerms = () => Linking.openURL("https://nossamaternidade.app/termos");
  const handlePrivacy = () => Linking.openURL("https://nossamaternidade.app/privacidade");
  const handleSkipFree = useCallback(async () => {
    try {
      await trackPaywallOutcome({
        experimentName: ONBOARDING_PAYWALL_EXPERIMENT,
        variant: ONBOARDING_PAYWALL_VARIANT,
        outcomeType: "skip_free",
        metadata: { reason: "manual_skip" },
      });
    } catch (error) {
      logger.error(
        "skip free outcome tracking failed",
        "OnboardingPaywall",
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      await handleComplete();
    }
  }, [handleComplete]);

  const isLoading = isSaving || isPurchasing;

  return (
    <OnboardingLayout
      gradient={[Tokens.brand.primary[50], Tokens.neutral[0]]}
      scrollable={true}
      testID="onboarding-paywall-screen"
    >
      {/* Header with progress (no back button on paywall) */}
      <View style={[styles.headerContainer, { marginTop: responsive.headerMarginTop }]}>
        <OnboardingHeader progress={progress} showProgress={true} />
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingHorizontal: responsive.paddingHorizontal }]}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          {/* Extra Care Banner */}
          {needsExtraCareFlag && (
            <View
              style={[
                styles.extraCareBanner,
                { backgroundColor: theme.semantic.infoLight, borderColor: theme.semantic.info },
              ]}
            >
              <Text style={styles.extraCareEmoji}>💜</Text>
              <Text style={[styles.extraCareText, { color: theme.text.primary }]}>
                Seus primeiros 7 dias são por minha conta. Primeiro, cuida de você.
              </Text>
            </View>
          )}

          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <Image
              source={PAYWALL_IMAGE}
              style={styles.paywallImage}
              contentFit="cover"
              accessibilityLabel="Nathalia Valente - Nossa Maternidade Premium"
            />
          </View>

          {/* Title & Subtitle */}
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Olha, eu queria fazer esse app de graça pra TODAS.
          </Text>

          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            Mas preciso pagar a equipe, servidor... 7 DIAS GRÁTIS pra você testar tudo. Depois,{" "}
            {getMonthlyPrice()}/mês - menos que um lanche no shopping. E parte do lucro vai pro
            projeto Zuzu em Angola.
          </Text>

          {/* Plan Card */}
          <View
            style={[
              styles.planCard,
              { backgroundColor: theme.surface.card, borderColor: theme.colors.border.subtle },
            ]}
          >
            <View style={styles.planHeader}>
              <Text style={[styles.planTitle, { color: theme.text.primary }]}>7 DIAS GRÁTIS</Text>
              <Text style={[styles.planSubtitle, { color: theme.text.secondary }]}>
                Depois {getMonthlyPrice()}/mês
              </Text>
            </View>

            <View style={styles.benefitsContainer}>
              {BENEFITS.map((benefit) => (
                <Text key={benefit} style={[styles.benefit, { color: theme.text.primary }]}>
                  ✓ {benefit}
                </Text>
              ))}
            </View>

            <Text style={[styles.planNote, { color: theme.text.tertiary }]}>
              Cancele quando quiser
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Custom Footer (multiple CTAs) */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Tokens.spacing.lg }]}>
        {/* Primary CTA */}
        <Pressable
          onPress={handleStartTrial}
          disabled={isLoading}
          style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
          accessibilityLabel="Começar 7 dias grátis"
          accessibilityRole="button"
          accessibilityState={{ disabled: isLoading }}
        >
          <LinearGradient
            colors={Tokens.gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            {isLoading ? (
              <ActivityIndicator color={Tokens.neutral[0]} />
            ) : (
              <Text style={styles.primaryButtonText}>Começar 7 dias grátis</Text>
            )}
          </LinearGradient>
        </Pressable>

        {/* Restore */}
        <Pressable
          onPress={handleRestore}
          disabled={isPurchasing}
          style={styles.secondaryButton}
          accessibilityLabel="Restaurar compras anteriores"
          accessibilityRole="button"
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text.secondary }]}>
            Já sou assinante
          </Text>
        </Pressable>

        {/* Skip */}
        <Pressable
          onPress={handleSkipFree}
          style={styles.skipButton}
          accessibilityLabel="Continuar sem assinatura"
          accessibilityRole="button"
        >
          <Text style={[styles.skipText, { color: theme.text.tertiary }]}>Continuar grátis</Text>
        </Pressable>

        {/* Legal Links */}
        <View style={styles.legalLinks}>
          <Pressable onPress={handleTerms} style={styles.termsButton}>
            <Text style={[styles.termsText, { color: theme.text.tertiary }]}>Termos de uso</Text>
          </Pressable>
          <Text style={[styles.termsText, { color: theme.text.tertiary }]}> • </Text>
          <Pressable onPress={handlePrivacy} style={styles.termsButton}>
            <Text style={[styles.termsText, { color: theme.text.tertiary }]}>Privacidade</Text>
          </Pressable>
        </View>
      </View>
    </OnboardingLayout>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  headerContainer: {
    // marginTop is set dynamically via responsive hook
  },
  content: {
    flex: 1,
    paddingTop: Tokens.spacing.md,
  },
  extraCareBanner: {
    padding: Tokens.spacing.lg,
    borderRadius: Tokens.radius.xl,
    borderWidth: 1.5,
    marginBottom: Tokens.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.md,
  },
  extraCareEmoji: {
    fontSize: 28,
  },
  extraCareText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Tokens.typography.fontFamily.semibold,
    lineHeight: 20,
  },
  imageContainer: {
    width: "100%",
    height: 80,
    borderRadius: Tokens.radius.xl,
    overflow: "hidden",
    marginBottom: Tokens.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  paywallImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Tokens.neutral[0],
  },
  title: {
    fontSize: 20,
    fontFamily: Tokens.typography.fontFamily.bold,
    fontWeight: "800",
    lineHeight: 26,
    marginBottom: Tokens.spacing.sm,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Tokens.typography.fontFamily.base,
    lineHeight: 21,
    marginBottom: Tokens.spacing.lg,
    opacity: 0.85,
  },
  planCard: {
    padding: Tokens.spacing.lg,
    borderRadius: Tokens.radius.xl,
    borderWidth: 1.5,
    marginBottom: Tokens.spacing.lg,
    ...Tokens.shadows.md,
  },
  planHeader: {
    alignItems: "center",
    marginBottom: Tokens.spacing.md,
    paddingBottom: Tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Tokens.neutral[100],
  },
  planTitle: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: Tokens.typography.fontFamily.bold,
    marginBottom: Tokens.spacing.xs,
    letterSpacing: -0.4,
  },
  planSubtitle: {
    fontSize: 13,
    fontFamily: Tokens.typography.fontFamily.base,
    opacity: 0.7,
  },
  benefitsContainer: {
    gap: Tokens.spacing.sm,
    marginBottom: Tokens.spacing.md,
  },
  benefit: {
    fontSize: 14,
    fontFamily: Tokens.typography.fontFamily.base,
    lineHeight: 22,
  },
  planNote: {
    fontSize: 12,
    fontFamily: Tokens.typography.fontFamily.base,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.6,
  },
  footer: {
    paddingHorizontal: Tokens.spacing.xl,
    paddingTop: Tokens.spacing.md,
    gap: Tokens.spacing.sm,
  },
  primaryButton: {
    borderRadius: Tokens.radius.xl,
    overflow: "hidden",
    ...Tokens.shadows.md,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonGradient: {
    paddingVertical: Tokens.spacing.md,
    paddingHorizontal: Tokens.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  primaryButtonText: {
    color: Tokens.neutral[0],
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Tokens.typography.fontFamily.semibold,
    letterSpacing: -0.2,
  },
  secondaryButton: {
    paddingVertical: Tokens.spacing.sm,
    alignItems: "center",
    minHeight: 40,
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Tokens.typography.fontFamily.semibold,
  },
  skipButton: {
    paddingVertical: Tokens.spacing.xs,
    alignItems: "center",
    minHeight: 36,
    justifyContent: "center",
  },
  skipText: {
    fontSize: 13,
    fontFamily: Tokens.typography.fontFamily.base,
    opacity: 0.7,
  },
  legalLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Tokens.spacing.xs,
  },
  termsButton: {
    paddingVertical: Tokens.spacing.xs,
    alignItems: "center",
    minHeight: 28,
    justifyContent: "center",
  },
  termsText: {
    fontSize: 11,
    fontFamily: Tokens.typography.fontFamily.base,
    textDecorationLine: "underline",
    opacity: 0.6,
  },
});
