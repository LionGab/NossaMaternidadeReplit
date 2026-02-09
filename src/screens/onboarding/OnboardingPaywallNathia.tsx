/**
 * OnboardingPaywallNathia - Premium Paywall
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Header com progress (sem back)
 * - Extra care banner
 * - Profile image
 * - Título + subtítulo empático
 * - Plan card com benefícios
 * - CTAs: Trial, Restore, Skip
 * - Legal links
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { PurchasesPackage } from "react-native-purchases";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Body, Caption, NathCard, Title } from "@/components/ui";

// Services
import {
  getIsConfigured,
  getOfferings,
  purchasePackage,
  restorePurchases,
} from "@/services/revenuecat";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { usePremiumStore } from "@/state/premium-store";
import { useAppStore } from "@/state/store";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
import type { RootStackScreenProps } from "@/types/navigation";

// Utils
import { logger } from "@/utils/logger";

// Imagem do perfil
const PAYWALL_IMAGE = require("../../../assets/onboarding/images/nath-profile-small.jpg");

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

type Props = RootStackScreenProps<"OnboardingPaywall">;

const BENEFITS = [
  { icon: "chatbubbles-outline", text: "Conversa ilimitada com NathIA" },
  { icon: "calendar-outline", text: "Tracker personalizado" },
  { icon: "sparkles-outline", text: "Conteúdo exclusivo da Nath" },
  { icon: "people-outline", text: 'Comunidade "Mães Valente"' },
  { icon: "star-outline", text: "Grupo VIP (se baixou no D1)" },
];

/**
 * BenefitItem - Item de benefício
 */
const BenefitItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.benefitItem}>
    <View style={styles.benefitIconContainer}>
      <Ionicons
        name={icon as React.ComponentProps<typeof Ionicons>["name"]}
        size={18}
        color={nathColors.rosa.DEFAULT}
      />
    </View>
    <Body style={styles.benefitText}>{text}</Body>
  </View>
);

/**
 * Progress Dots (final - todos preenchidos)
 */
const ProgressDots = () => (
  <View style={styles.progressDots}>
    {Array.from({ length: 5 }).map((_, index) => (
      <View key={index} style={[styles.dot, styles.dotFilled]} />
    ))}
  </View>
);

export default function OnboardingPaywallNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();

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

  const needsExtraCareFlag = needsExtraCare();

  // Load RevenueCat offerings
  useEffect(() => {
    async function loadOfferings() {
      try {
        if (!getIsConfigured()) {
          logger.info("RevenueCat not configured (likely Expo Go)", "OnboardingPaywallNathia");
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

          logger.info("Offerings loaded", "OnboardingPaywallNathia", {
            monthly: monthly?.identifier,
            yearly: yearly?.identifier,
          });
        }
      } catch (error) {
        logger.error(
          "Failed to load offerings",
          "OnboardingPaywallNathia",
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }

    loadOfferings();
  }, []);

  useEffect(() => {
    setCurrentScreen("OnboardingPaywall");
  }, [setCurrentScreen]);

  // Get display price
  const getMonthlyPrice = useCallback(() => {
    return monthlyPackage?.product?.priceString ?? "R$ 34,90";
  }, [monthlyPackage]);

  // Silence unused yearlyPackage warning
  void yearlyPackage;

  // Complete onboarding handler
  const handleComplete = useCallback(async () => {
    try {
      setIsSaving(true);

      // Só exigir stage se a jornada for MATERNIDADE
      const isMaternityJourney = data.journey === "MATERNIDADE";
      if (isMaternityJourney && !data.stage && !data.maternityStage) {
        logger.error("No stage set for maternity journey", "OnboardingPaywallNathia");
        Alert.alert(
          "Erro",
          "Por favor, volte e selecione seu momento de vida antes de continuar.",
          [{ text: "OK" }]
        );
        return;
      }

      completeOnboarding();
      logger.info("Onboarding completed", "OnboardingPaywallNathia", {
        userId: authUserId ?? null,
        journey: data.journey,
      });

      // Reset navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error) {
      logger.error(
        "Error completing onboarding",
        "OnboardingPaywallNathia",
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      setIsSaving(false);
    }
  }, [authUserId, data.journey, data.stage, data.maternityStage, completeOnboarding, navigation]);

  // Start trial / purchase handler
  const handleStartTrial = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      // Skip paywall for extra care users
      if (needsExtraCareFlag) {
        logger.info("Skipping paywall for extra care user", "OnboardingPaywallNathia");
        await handleComplete();
        return;
      }

      // Complete without purchase if RevenueCat unavailable
      if (!getIsConfigured() || !monthlyPackage) {
        logger.info(
          "RevenueCat not available, completing without purchase",
          "OnboardingPaywallNathia"
        );
        await handleComplete();
        return;
      }

      setPurchasing(true);
      logger.info("Starting purchase", "OnboardingPaywallNathia", {
        package: monthlyPackage.identifier,
      });

      const result = await purchasePackage(monthlyPackage);

      if (result.success) {
        logger.info("Purchase successful", "OnboardingPaywallNathia");
        setPremiumStatus(true);
        await handleComplete();
      } else if (result.error === "cancelled") {
        logger.info("Purchase cancelled by user", "OnboardingPaywallNathia");
      } else {
        logger.error(
          "Purchase failed",
          "OnboardingPaywallNathia",
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
        "OnboardingPaywallNathia",
        error instanceof Error ? error : new Error(String(error))
      );
      await handleComplete();
    } finally {
      setPurchasing(false);
    }
  }, [needsExtraCareFlag, monthlyPackage, setPurchasing, setPremiumStatus, handleComplete]);

  // Restore purchases handler
  const handleRestore = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setPurchasing(true);

      const result = await restorePurchases();

      if (result.success) {
        logger.info("Restore successful", "OnboardingPaywallNathia");
        setPremiumStatus(true);
        Alert.alert("Sucesso!", "Sua assinatura foi restaurada.", [
          { text: "Continuar", onPress: handleComplete },
        ]);
      } else {
        Alert.alert(
          "Nenhuma assinatura encontrada",
          "Não encontramos uma assinatura ativa para restaurar."
        );
      }
    } catch (error) {
      logger.error(
        "Restore failed",
        "OnboardingPaywallNathia",
        error instanceof Error ? error : new Error(String(error))
      );
      Alert.alert("Erro", "Não foi possível restaurar sua assinatura.");
    } finally {
      setPurchasing(false);
    }
  }, [setPurchasing, setPremiumStatus, handleComplete]);

  const handleTerms = () => Linking.openURL("https://nossamaternidade.app/termos");
  const handlePrivacy = () => Linking.openURL("https://nossamaternidade.app/privacidade");

  const isLoading = isSaving || isPurchasing;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[nathColors.rosa.light, nathColors.cream]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <View style={styles.backButton} />
        <ProgressDots />
        <View style={styles.backButton} />
      </Animated.View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Extra Care Banner */}
        {needsExtraCareFlag && (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <NathCard variant="elevated" style={styles.extraCareBanner} padding="lg">
              <View style={styles.extraCareContent}>
                <Body style={styles.extraCareEmoji}>💜</Body>
                <Body weight="bold" style={styles.extraCareText}>
                  Seus primeiros 7 dias são por minha conta. Primeiro, cuida de você.
                </Body>
              </View>
            </NathCard>
          </Animated.View>
        )}

        {/* Profile Image */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={PAYWALL_IMAGE}
              style={styles.paywallImage}
              contentFit="cover"
              accessibilityLabel="Nathalia Valente - Nossa Maternidade Premium"
            />
          </View>
        </Animated.View>

        {/* Title & Subtitle */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.titleSection}>
          <Title style={styles.title}>Olha, eu queria fazer esse app de graça pra TODAS.</Title>
          <Body style={styles.subtitle}>
            Mas preciso pagar a equipe, servidor... 7 DIAS GRÁTIS pra você testar tudo. Depois,{" "}
            {getMonthlyPrice()}/mês - menos que um lanche no shopping. E parte do lucro vai pro
            projeto Zuzu em Angola.
          </Body>
        </Animated.View>

        {/* Plan Card */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <NathCard variant="elevated" style={styles.planCard} padding="xl">
            <View style={styles.planHeader}>
              <Title style={styles.planTitle}>7 DIAS GRÁTIS</Title>
              <Caption style={styles.planSubtitle}>Depois {getMonthlyPrice()}/mês</Caption>
            </View>

            <View style={styles.benefitsContainer}>
              {BENEFITS.map((benefit) => (
                <BenefitItem key={benefit.text} icon={benefit.icon} text={benefit.text} />
              ))}
            </View>

            <Caption style={styles.planNote}>Cancele quando quiser</Caption>
          </NathCard>
        </Animated.View>

        {/* CTAs */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.ctaContainer}>
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
              colors={[nathColors.rosa.DEFAULT, nathColors.azul.DEFAULT]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color={nathColors.white} />
              ) : (
                <>
                  <Body weight="bold" style={styles.primaryButtonText}>
                    Começar 7 dias grátis
                  </Body>
                  <Ionicons name="sparkles" size={20} color={nathColors.white} />
                </>
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
            <Caption style={styles.secondaryButtonText}>Já sou assinante</Caption>
          </Pressable>

          {/* Skip */}
          <Pressable
            onPress={handleComplete}
            style={styles.skipButton}
            accessibilityLabel="Continuar sem assinatura"
            accessibilityRole="button"
          >
            <Caption style={styles.skipText}>Continuar grátis</Caption>
          </Pressable>

          {/* Legal Links */}
          <View style={styles.legalLinks}>
            <Pressable onPress={handleTerms} style={styles.legalButton}>
              <Caption style={styles.legalText}>Termos de uso</Caption>
            </Pressable>
            <Caption style={styles.legalText}> • </Caption>
            <Pressable onPress={handlePrivacy} style={styles.legalButton}>
              <Caption style={styles.legalText}>Privacidade</Caption>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
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
    backgroundColor: nathColors.rosa.DEFAULT,
  },

  scrollContent: {
    paddingHorizontal: spacing.xl,
  },

  extraCareBanner: {
    backgroundColor: nathColors.azul.light,
    borderColor: nathColors.azul.DEFAULT,
    marginBottom: spacing.xl,
  },

  extraCareContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },

  extraCareEmoji: {
    fontSize: 32,
  },

  extraCareText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: nathColors.text.DEFAULT,
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: nathColors.rosa.DEFAULT,
    ...shadows.lg,
  },

  paywallImage: {
    width: "100%",
    height: "100%",
  },

  titleSection: {
    marginBottom: spacing.xl,
  },

  title: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.4,
    color: nathColors.text.DEFAULT,
    marginBottom: spacing.md,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: nathColors.text.muted,
  },

  planCard: {
    backgroundColor: nathColors.white,
    borderColor: nathColors.rosa.light,
    marginBottom: spacing.xl,
  },

  planHeader: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: nathColors.border,
  },

  planTitle: {
    fontSize: 28,
    letterSpacing: -0.5,
    color: nathColors.text.DEFAULT,
    marginBottom: spacing.xs,
  },

  planSubtitle: {
    fontSize: 15,
    color: nathColors.text.muted,
  },

  benefitsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  benefitIconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: nathColors.rosa.light,
    alignItems: "center",
    justifyContent: "center",
  },

  benefitText: {
    flex: 1,
    fontSize: 15,
    color: nathColors.text.DEFAULT,
    lineHeight: 22,
  },

  planNote: {
    fontSize: 13,
    color: nathColors.text.muted,
    textAlign: "center",
    fontStyle: "italic",
  },

  ctaContainer: {
    gap: spacing.md,
  },

  primaryButton: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
    ...shadows.lg,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  primaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing["2xl"],
    minHeight: 56,
  },

  primaryButtonText: {
    fontSize: 17,
    color: nathColors.white,
  },

  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: nathColors.text.muted,
  },

  skipButton: {
    paddingVertical: spacing.sm,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },

  skipText: {
    fontSize: 14,
    color: nathColors.text.muted,
  },

  legalLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.md,
  },

  legalButton: {
    paddingVertical: spacing.sm,
    alignItems: "center",
  },

  legalText: {
    fontSize: 12,
    color: nathColors.text.muted,
    textDecorationLine: "underline",
  },
});
