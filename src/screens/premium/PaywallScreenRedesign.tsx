/**
 * PaywallScreen Redesign - Flo Health Minimal Style
 *
 * Design Principles:
 * - Clean, professional layout that converts
 * - Feature list with checkmark icons
 * - Pricing cards with subtle borders
 * - Prominent but not aggressive CTA
 * - Subtle gradient background with premium feel
 * - Minimal trust badges and guarantees
 * - Full dark mode support
 *
 * @example
 * ```tsx
 * <PaywallScreenRedesign feature="ai_voice" onSuccess={() => navigation.goBack()} />
 * ```
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { PurchasesPackage } from "react-native-purchases";
import { usePremium } from "../../hooks/usePremium";
import {
  trackEvent,
  trackPaywallExposure,
  trackPaywallOutcome,
} from "../../services/analytics";
import { Tokens } from "../../theme/tokens";
import { logger } from "../../utils/logger";
import { PRICES_BRL, calculateSavingsPercent } from "../../services/revenuecat";

/**
 * Theme-aware color tokens
 */
const getColors = (isDark: boolean) => ({
  // Backgrounds
  background: isDark ? Tokens.surface.dark.base : Tokens.surface.light.base,
  backgroundGradient: isDark
    ? ([Tokens.surface.dark.base, Tokens.surface.dark.card, Tokens.surface.dark.elevated] as const)
    : ([Tokens.surface.light.base, Tokens.neutral[50], Tokens.surface.light.card] as const),

  // Cards
  cardBackground: isDark ? Tokens.surface.dark.card : Tokens.surface.light.card,
  cardBorder: isDark ? Tokens.border.dark.subtle : Tokens.border.light.subtle,
  cardBorderSelected: isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500],

  // Text
  textPrimary: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
  textSecondary: isDark ? Tokens.text.dark.secondary : Tokens.text.light.secondary,
  textTertiary: isDark ? Tokens.text.dark.tertiary : Tokens.text.light.tertiary,
  textAccent: isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500],

  // CTA
  ctaBackground: Tokens.brand.accent[500],
  ctaText: Tokens.neutral[0],

  // Accents
  checkmark: isDark ? Tokens.semantic.dark.success : Tokens.semantic.light.success,
  badge: isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500],

  // Overlay
  closeButtonBg: isDark ? Tokens.premium.glass.light : Tokens.overlay.cardHighlight,
});

/**
 * Premium features with minimal descriptions
 */
const PREMIUM_FEATURES = [
  {
    icon: "chatbubbles-outline" as const,
    title: "Conversas Ilimitadas",
    description: "Converse com NathIA sem limites",
  },
  {
    icon: "mic-outline" as const,
    title: "Respostas em Voz",
    description: "Ouqa NathIA falar com voce",
  },
  {
    icon: "images-outline" as const,
    title: "Envio de Imagens",
    description: "Compartilhe ultrassons e fotos",
  },
  {
    icon: "time-outline" as const,
    title: "Historico Completo",
    description: "Acesse todas as conversas",
  },
  {
    icon: "sparkles-outline" as const,
    title: "Afirmacoes Diarias",
    description: "Mensagens personalizadas",
  },
  {
    icon: "heart-outline" as const,
    title: "Conteudo Exclusivo",
    description: "Acesso ao Mundo da Nath",
  },
];

interface PaywallScreenRedesignProps {
  feature?: string;
  onSuccess?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  variant?: string;
  sourceCampaign?: string;
}

export function PaywallScreenRedesign({
  feature,
  onSuccess,
  onClose,
  showCloseButton = true,
  variant = "control",
  sourceCampaign,
}: PaywallScreenRedesignProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = useMemo(() => getColors(isDark), [isDark]);

  const { offerings, purchase, restore, isLoading: premiumLoading } = usePremium();
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Packages
  const packages = offerings?.availablePackages || [];
  const monthlyPackage = packages.find((p: PurchasesPackage) => p.identifier?.includes("monthly"));
  const yearlyPackage = packages.find((p: PurchasesPackage) => p.identifier?.includes("yearly"));

  // Auto-select yearly package
  useEffect(() => {
    if (yearlyPackage && !selectedPackage) {
      setSelectedPackage(yearlyPackage);
    }
  }, [yearlyPackage, selectedPackage]);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    trackPaywallExposure({
      experimentName: "paywall_in_app_v1",
      variant,
      screenName: "PaywallScreenRedesign",
      source: sourceCampaign || undefined,
      campaign: sourceCampaign || undefined,
      metadata: {
        feature: feature || "unknown",
        packages_count: packages.length,
      },
    }).catch(() => {
      // Exposure telemetry should never block the paywall render.
    });
  }, [feature, packages.length, sourceCampaign, variant]);

  const handleClose = useCallback(() => {
    trackPaywallOutcome({
      experimentName: "paywall_in_app_v1",
      variant,
      outcomeType: "dismissed",
      source: sourceCampaign || undefined,
      campaign: sourceCampaign || undefined,
      metadata: { feature: feature || "unknown" },
    }).catch(() => {
      // Close telemetry must remain fire-and-forget.
    });

    onClose?.();
  }, [feature, onClose, sourceCampaign, variant]);

  /**
   * Handle purchase
   */
  const handlePurchase = useCallback(async () => {
    if (!selectedPackage) {
      Alert.alert("Selecione um plano", "Escolha entre mensal ou anual para continuar");
      return;
    }

    setIsPurchasing(true);
    await trackEvent({
      eventName: "paywall_cta_tapped",
      category: "conversion",
      screenName: "PaywallScreenRedesign",
      properties: {
        experiment_name: "paywall_in_app_v1",
        variant,
        feature: feature || "unknown",
        package_identifier: selectedPackage.identifier,
      },
    });

    logger.info(`Attempting purchase: ${selectedPackage.identifier}`, "PaywallScreenRedesign", {
      feature,
    });

    try {
      const result = await purchase(selectedPackage);

      if (result.success) {
        await trackPaywallOutcome({
          experimentName: "paywall_in_app_v1",
          variant,
          outcomeType: "purchase_success",
          source: sourceCampaign || undefined,
          campaign: sourceCampaign || undefined,
          metadata: {
            feature: feature || "unknown",
            package_identifier: selectedPackage.identifier,
            price_string: selectedPackage.product.priceString,
          },
        });
        Alert.alert("Bem-vinda ao Premium", "Aproveite todos os recursos exclusivos.", [
          {
            text: "Continuar",
            onPress: () => onSuccess?.(),
          },
        ]);
      } else if (result.error !== "cancelled") {
        await trackPaywallOutcome({
          experimentName: "paywall_in_app_v1",
          variant,
          outcomeType: "purchase_failed",
          source: sourceCampaign || undefined,
          campaign: sourceCampaign || undefined,
          metadata: {
            feature: feature || "unknown",
            package_identifier: selectedPackage.identifier,
            error: result.error || "unknown_error",
          },
        });
        Alert.alert("Erro", result.error || "Tente novamente em instantes");
      }
    } catch (err) {
      logger.error("Purchase error", "PaywallScreenRedesign", err as Error);
      await trackPaywallOutcome({
        experimentName: "paywall_in_app_v1",
        variant,
        outcomeType: "purchase_failed",
        source: sourceCampaign || undefined,
        campaign: sourceCampaign || undefined,
        metadata: {
          feature: feature || "unknown",
          package_identifier: selectedPackage.identifier,
          error: err instanceof Error ? err.message : String(err),
        },
      });
      Alert.alert("Erro", "Tente novamente em alguns instantes.");
    } finally {
      setIsPurchasing(false);
    }
  }, [selectedPackage, purchase, variant, feature, sourceCampaign, onSuccess]);

  /**
   * Handle restore
   */
  const handleRestore = useCallback(async () => {
    setIsRestoring(true);
    logger.info("Restoring purchases", "PaywallScreenRedesign");

    try {
      const result = await restore();

      if (result.success) {
        await trackPaywallOutcome({
          experimentName: "paywall_in_app_v1",
          variant,
          outcomeType: "restore_success",
          source: sourceCampaign || undefined,
          campaign: sourceCampaign || undefined,
          metadata: { feature: feature || "unknown" },
        });
        Alert.alert("Compras restauradas", "Seu acesso premium foi restaurado.", [
          {
            text: "Continuar",
            onPress: () => onSuccess?.(),
          },
        ]);
      } else {
        await trackPaywallOutcome({
          experimentName: "paywall_in_app_v1",
          variant,
          outcomeType: "restore_failed",
          source: sourceCampaign || undefined,
          campaign: sourceCampaign || undefined,
          metadata: {
            feature: feature || "unknown",
            error: result.error || "restore_not_found",
          },
        });
        Alert.alert(
          "Nenhuma compra encontrada",
          "Nao encontramos assinaturas anteriores nesta conta."
        );
      }
    } catch (err) {
      logger.error("Restore error", "PaywallScreenRedesign", err as Error);
      await trackPaywallOutcome({
        experimentName: "paywall_in_app_v1",
        variant,
        outcomeType: "restore_failed",
        source: sourceCampaign || undefined,
        campaign: sourceCampaign || undefined,
        metadata: {
          feature: feature || "unknown",
          error: err instanceof Error ? err.message : String(err),
        },
      });
      Alert.alert("Erro", "Tente novamente em alguns instantes.");
    } finally {
      setIsRestoring(false);
    }
  }, [restore, variant, sourceCampaign, feature, onSuccess]);

  // Loading state
  if (premiumLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.textAccent} />
      </View>
    );
  }

  // No packages available
  if (!offerings || packages.length === 0) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} />
        <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>Planos indisponiveis</Text>
        <Text style={[styles.errorDescription, { color: colors.textSecondary }]}>
          Tente novamente em instantes.
        </Text>
        {showCloseButton && onClose && (
          <Pressable
            onPress={handleClose}
            style={[styles.errorButton, { backgroundColor: colors.ctaBackground }]}
            accessibilityLabel="Fechar"
            accessibilityRole="button"
          >
            <Text style={[styles.errorButtonText, { color: colors.ctaText }]}>Fechar</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const savingsPercent = calculateSavingsPercent(PRICES_BRL.MONTHLY, PRICES_BRL.YEARLY);

  return (
    <LinearGradient colors={colors.backgroundGradient} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Close Button */}
        {showCloseButton && onClose && (
          <Pressable
            onPress={handleClose}
            style={[styles.closeButton, { top: insets.top + 16 }]}
            accessibilityLabel="Fechar"
            accessibilityRole="button"
          >
            <View style={[styles.closeButtonInner, { backgroundColor: colors.closeButtonBg }]}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </View>
          </Pressable>
        )}

        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Desbloqueie o Premium
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Tenha acesso completo a todos os recursos
          </Text>
        </Animated.View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {PREMIUM_FEATURES.map((feat, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.featureRow,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View
                style={[styles.checkmarkContainer, { backgroundColor: `${colors.checkmark}15` }]}
              >
                <Ionicons name="checkmark" size={16} color={colors.checkmark} />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                  {feat.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feat.description}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingContainer}>
          {/* Yearly Package - Featured */}
          {yearlyPackage && (
            <Pressable
              onPress={() => setSelectedPackage(yearlyPackage)}
              style={[
                styles.pricingCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor:
                    selectedPackage?.identifier === yearlyPackage.identifier
                      ? colors.cardBorderSelected
                      : colors.cardBorder,
                  borderWidth: selectedPackage?.identifier === yearlyPackage.identifier ? 2 : 1,
                },
              ]}
              accessibilityLabel={`Plano anual: ${yearlyPackage.product.priceString} por ano, economize ${savingsPercent}%`}
              accessibilityRole="button"
            >
              {/* Best Value Badge */}
              <View style={[styles.badge, { backgroundColor: colors.badge }]}>
                <Text style={[styles.badgeText, { color: colors.ctaText }]}>MELHOR OFERTA</Text>
              </View>

              <View style={styles.pricingCardContent}>
                <View style={styles.pricingLeft}>
                  <Text style={[styles.planName, { color: colors.textPrimary }]}>Anual</Text>
                  <Text style={[styles.planSavings, { color: colors.textAccent }]}>
                    Economize {savingsPercent}%
                  </Text>
                </View>
                <View style={styles.pricingRight}>
                  <Text style={[styles.priceEquivalent, { color: colors.textSecondary }]}>
                    R$ {PRICES_BRL.YEARLY_MONTHLY_EQUIVALENT}/mes
                  </Text>
                  <Text style={[styles.priceTotal, { color: colors.textPrimary }]}>
                    {yearlyPackage.product.priceString}/ano
                  </Text>
                </View>
              </View>

              {/* Selection Indicator */}
              {selectedPackage?.identifier === yearlyPackage.identifier && (
                <View
                  style={[styles.selectedIndicator, { backgroundColor: colors.cardBorderSelected }]}
                >
                  <Ionicons name="checkmark" size={14} color={colors.ctaText} />
                </View>
              )}
            </Pressable>
          )}

          {/* Monthly Package */}
          {monthlyPackage && (
            <Pressable
              onPress={() => setSelectedPackage(monthlyPackage)}
              style={[
                styles.pricingCard,
                styles.pricingCardMonthly,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor:
                    selectedPackage?.identifier === monthlyPackage.identifier
                      ? colors.cardBorderSelected
                      : colors.cardBorder,
                  borderWidth: selectedPackage?.identifier === monthlyPackage.identifier ? 2 : 1,
                },
              ]}
              accessibilityLabel={`Plano mensal: ${monthlyPackage.product.priceString} por mes`}
              accessibilityRole="button"
            >
              <View style={styles.pricingCardContent}>
                <View style={styles.pricingLeft}>
                  <Text style={[styles.planName, { color: colors.textPrimary }]}>Mensal</Text>
                  <Text style={[styles.planSavings, { color: colors.textSecondary }]}>
                    Renovacao automatica
                  </Text>
                </View>
                <View style={styles.pricingRight}>
                  <Text style={[styles.priceTotal, { color: colors.textPrimary }]}>
                    {monthlyPackage.product.priceString}/mes
                  </Text>
                </View>
              </View>

              {/* Selection Indicator */}
              {selectedPackage?.identifier === monthlyPackage.identifier && (
                <View
                  style={[styles.selectedIndicator, { backgroundColor: colors.cardBorderSelected }]}
                >
                  <Ionicons name="checkmark" size={14} color={colors.ctaText} />
                </View>
              )}
            </Pressable>
          )}
        </View>

        {/* CTA Button */}
        <Pressable
          onPress={handlePurchase}
          disabled={!selectedPackage || isPurchasing}
          style={({ pressed }) => [
            styles.ctaButton,
            {
              backgroundColor: colors.ctaBackground,
              opacity: !selectedPackage || isPurchasing ? 0.6 : pressed ? 0.9 : 1,
            },
          ]}
          accessibilityLabel={isPurchasing ? "Processando" : "Assinar agora"}
          accessibilityRole="button"
        >
          {isPurchasing ? (
            <ActivityIndicator color={colors.ctaText} size="small" />
          ) : (
            <Text style={[styles.ctaButtonText, { color: colors.ctaText }]}>Assinar Agora</Text>
          )}
        </Pressable>

        {/* Restore Link */}
        <Pressable
          onPress={handleRestore}
          disabled={isRestoring}
          style={styles.restoreButton}
          accessibilityLabel={isRestoring ? "Restaurando" : "Restaurar compras"}
          accessibilityRole="button"
        >
          {isRestoring ? (
            <ActivityIndicator color={colors.textSecondary} size="small" />
          ) : (
            <Text style={[styles.restoreButtonText, { color: colors.textSecondary }]}>
              Ja sou assinante
            </Text>
          )}
        </Pressable>

        {/* Trust Badge - Minimal */}
        <View style={styles.trustContainer}>
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.trustText, { color: colors.textTertiary }]}>Pagamento seguro</Text>
        </View>

        {/* Legal Text */}
        <Text style={[styles.legalText, { color: colors.textTertiary }]}>
          Renovacao automatica. Cancele quando quiser nas configuracoes da loja. Ao continuar, voce
          concorda com nossos Termos de Uso e Politica de Privacidade.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Tokens.spacing["2xl"],
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing["3xl"],
  },
  errorTitle: {
    fontSize: Tokens.typography.headlineMedium.fontSize,
    fontWeight: "600",
    marginTop: Tokens.spacing.lg,
    fontFamily: Tokens.typography.fontFamily.semibold,
  },
  errorDescription: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    marginTop: Tokens.spacing.sm,
    textAlign: "center",
    fontFamily: Tokens.typography.fontFamily.base,
  },
  errorButton: {
    marginTop: Tokens.spacing["2xl"],
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing["3xl"],
    borderRadius: Tokens.radius.lg,
  },
  errorButtonText: {
    fontSize: Tokens.typography.labelLarge.fontSize,
    fontWeight: "600",
    fontFamily: Tokens.typography.fontFamily.semibold,
  },
  closeButton: {
    position: "absolute",
    right: Tokens.spacing["2xl"],
    zIndex: 10,
  },
  closeButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginTop: Tokens.spacing["5xl"],
    marginBottom: Tokens.spacing["3xl"],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: Tokens.typography.fontFamily.bold,
  },
  headerSubtitle: {
    fontSize: Tokens.typography.bodyLarge.fontSize,
    textAlign: "center",
    marginTop: Tokens.spacing.sm,
    fontFamily: Tokens.typography.fontFamily.base,
  },
  featuresContainer: {
    marginBottom: Tokens.spacing["3xl"],
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Tokens.spacing.lg,
  },
  checkmarkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Tokens.spacing.lg,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    fontWeight: "600",
    fontFamily: Tokens.typography.fontFamily.semibold,
  },
  featureDescription: {
    fontSize: Tokens.typography.bodySmall.fontSize,
    marginTop: 2,
    fontFamily: Tokens.typography.fontFamily.base,
  },
  pricingContainer: {
    marginBottom: Tokens.spacing["2xl"],
  },
  pricingCard: {
    borderRadius: Tokens.radius.xl,
    padding: Tokens.spacing.xl,
    marginBottom: Tokens.spacing.md,
    position: "relative",
    overflow: "hidden",
  },
  pricingCardMonthly: {
    paddingTop: Tokens.spacing.xl,
  },
  pricingCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pricingLeft: {
    flex: 1,
  },
  pricingRight: {
    alignItems: "flex-end",
  },
  planName: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: "600",
    fontFamily: Tokens.typography.fontFamily.semibold,
  },
  planSavings: {
    fontSize: Tokens.typography.bodySmall.fontSize,
    marginTop: 2,
    fontFamily: Tokens.typography.fontFamily.medium,
  },
  priceEquivalent: {
    fontSize: Tokens.typography.bodySmall.fontSize,
    fontFamily: Tokens.typography.fontFamily.base,
  },
  priceTotal: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: "600",
    fontFamily: Tokens.typography.fontFamily.semibold,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingVertical: Tokens.spacing.xs,
    paddingHorizontal: Tokens.spacing.md,
    borderBottomLeftRadius: Tokens.radius.md,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: Tokens.typography.fontFamily.bold,
  },
  selectedIndicator: {
    position: "absolute",
    bottom: Tokens.spacing.md,
    right: Tokens.spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButton: {
    paddingVertical: Tokens.spacing.lg + 2,
    borderRadius: Tokens.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Tokens.spacing.lg,
    ...Tokens.shadows.md,
  },
  ctaButtonText: {
    fontSize: Tokens.typography.labelLarge.fontSize,
    fontWeight: "600",
    fontFamily: Tokens.typography.fontFamily.semibold,
  },
  restoreButton: {
    paddingVertical: Tokens.spacing.md,
    alignItems: "center",
    marginBottom: Tokens.spacing.lg,
  },
  restoreButtonText: {
    fontSize: Tokens.typography.bodySmall.fontSize,
    fontFamily: Tokens.typography.fontFamily.medium,
  },
  trustContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Tokens.spacing.md,
  },
  trustText: {
    fontSize: Tokens.typography.caption.fontSize,
    marginLeft: Tokens.spacing.xs,
    fontFamily: Tokens.typography.fontFamily.base,
  },
  legalText: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: Tokens.spacing.lg,
    fontFamily: Tokens.typography.fontFamily.base,
  },
});

export default PaywallScreenRedesign;
