/**
 * PaywallScreen - Premium Subscription Purchase Flow
 *
 * Tela de assinatura premium com:
 * - Listagem de packages (mensal, anual)
 * - Cálculo de savings
 * - Compra via RevenueCat
 * - Restore purchases
 * - Termos e condições
 *
 * @example
 * ```tsx
 * <PaywallScreen feature="ai_voice" onSuccess={() => navigation.goBack()} />
 * ```
 */

import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { PurchasesPackage } from "react-native-purchases";
import { usePremium } from "../../hooks/usePremium";
import { Tokens } from "../../theme/tokens";
import { cn } from "../../utils/cn";
import { logger } from "../../utils/logger";
import { PRICES_BRL, calculateSavingsPercent } from "../../services/revenuecat";

/**
 * Features premium (para exibir na tela)
 */
const PREMIUM_FEATURES = [
  {
    icon: "chatbubbles-outline" as const,
    title: "Chat Ilimitado",
    description: "Converse com NathIA sem limites",
  },
  {
    icon: "volume-high-outline" as const,
    title: "Áudio da NathIA",
    description: "Ouça respostas em voz alta",
  },
  {
    icon: "image-outline" as const,
    title: "Upload de Imagens",
    description: "Envie ultrassons e fotos",
  },
  {
    icon: "time-outline" as const,
    title: "Histórico Completo",
    description: "Acesso a todas conversas",
  },
  {
    icon: "heart-outline" as const,
    title: "Conteúdo Exclusivo",
    description: "Mundo Nath e afirmações",
  },
  {
    icon: "download-outline" as const,
    title: "Exportar Dados",
    description: "Baixe todo seu histórico",
  },
];

interface PaywallScreenProps {
  /** Feature que causou o paywall (para analytics) */
  feature?: string;

  /** Callback quando compra for bem-sucedida */
  onSuccess?: () => void;

  /** Callback para fechar o paywall */
  onClose?: () => void;

  /** Se deve mostrar botão de fechar (X) */
  showCloseButton?: boolean;
}

export function PaywallScreen({
  feature,
  onSuccess,
  onClose,
  showCloseButton = true,
}: PaywallScreenProps) {
  const insets = useSafeAreaInsets();

  // Cores usando Design Tokens (maternal clean style)
  const colors = {
    background: Tokens.cleanDesign.pink[50],
    card: Tokens.neutral[0],
    text: Tokens.text.light.primary,
    textSecondary: Tokens.text.light.secondary,
    textTertiary: Tokens.text.light.tertiary,
    primary: Tokens.cleanDesign.pink[500],
    primaryLight: Tokens.cleanDesign.pink[100],
    border: Tokens.cleanDesign.card.border,
    success: Tokens.semantic.light.success,
    successLight: Tokens.semantic.light.successLight,
    error: Tokens.semantic.light.error,
  };

  const { offerings, purchase, restore, isLoading: premiumLoading } = usePremium();
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Packages disponíveis (mensal, anual)
  const packages = offerings?.availablePackages || [];
  const monthlyPackage = packages.find((p: PurchasesPackage) => p.identifier?.includes("monthly"));
  const yearlyPackage = packages.find((p: PurchasesPackage) => p.identifier?.includes("yearly"));

  // Auto-select yearly (melhor custo-benefício)
  React.useEffect(() => {
    if (yearlyPackage && !selectedPackage) {
      setSelectedPackage(yearlyPackage);
    }
  }, [yearlyPackage, selectedPackage]);

  /**
   * Handle purchase
   */
  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert("Erro", "Selecione um plano para continuar");
      return;
    }

    setIsPurchasing(true);
    logger.info(`Attempting purchase: ${selectedPackage.identifier}`, "PaywallScreen", {
      feature,
    });

    try {
      const result = await purchase(selectedPackage);

      if (result.success) {
        Alert.alert(
          "Bem-vinda ao Premium! 🎉",
          "Agora você tem acesso a todos os recursos exclusivos.",
          [
            {
              text: "Continuar",
              onPress: () => {
                onSuccess?.();
              },
            },
          ]
        );
      } else if (result.error !== "cancelled") {
        Alert.alert("Erro na compra", result.error || "Tente novamente");
      }
    } catch (err) {
      logger.error("Purchase error", "PaywallScreen", err as Error);
      Alert.alert("Erro", "Não conseguimos processar sua compra. Tente novamente.");
    } finally {
      setIsPurchasing(false);
    }
  };

  /**
   * Handle restore
   */
  const handleRestore = async () => {
    setIsRestoring(true);
    logger.info("Restoring purchases", "PaywallScreen");

    try {
      const result = await restore();

      if (result.success) {
        Alert.alert("Compras restauradas!", "Seu acesso premium foi restaurado com sucesso.", [
          {
            text: "Continuar",
            onPress: () => {
              onSuccess?.();
            },
          },
        ]);
      } else {
        Alert.alert("Nenhuma compra encontrada", "Não encontramos compras anteriores nesta conta.");
      }
    } catch (err) {
      logger.error("Restore error", "PaywallScreen", err as Error);
      Alert.alert("Erro", "Não conseguimos restaurar suas compras. Tente novamente.");
    } finally {
      setIsRestoring(false);
    }
  };

  // Loading state
  if (premiumLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // No packages available (RevenueCat not configured)
  if (!offerings || packages.length === 0) {
    return (
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: colors.background }}
      >
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text className="mt-4 text-center text-lg font-medium" style={{ color: colors.text }}>
          Assinaturas indisponíveis
        </Text>
        <Text className="mt-2 text-center" style={{ color: colors.textSecondary }}>
          Não conseguimos carregar os planos. Tente novamente mais tarde.
        </Text>
        {showCloseButton && onClose && (
          <Pressable
            onPress={onClose}
            className="mt-6 rounded-full px-6 py-3"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="font-semibold" style={{ color: colors.card }}>
              Fechar
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 20 }}
    >
      {/* Header */}
      <View className="px-6 pt-4">
        {showCloseButton && onClose && (
          <Pressable
            onPress={onClose}
            className="self-end"
            accessibilityLabel="Fechar"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={28} color={colors.text} />
          </Pressable>
        )}

        <Text className="mt-4 text-3xl font-bold" style={{ color: colors.text }}>
          Seja Premium
        </Text>
        <Text className="mt-2 text-base" style={{ color: colors.textSecondary }}>
          Tenha acesso completo a todos os recursos
        </Text>
      </View>

      {/* Features List */}
      <View className="mt-8 px-6">
        {PREMIUM_FEATURES.map((feat, idx) => (
          <View key={idx} className="mb-4 flex-row items-start">
            <View
              className="mr-3 h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.primaryLight }}
            >
              <Ionicons name={feat.icon} size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="font-semibold" style={{ color: colors.text }}>
                {feat.title}
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {feat.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Package Selection */}
      <View className="mt-8 px-6">
        <Text className="mb-4 text-lg font-bold" style={{ color: colors.text }}>
          Escolha seu plano
        </Text>

        {/* Yearly Package */}
        {yearlyPackage && (
          <Pressable
            onPress={() => setSelectedPackage(yearlyPackage)}
            className={cn(
              "mb-3 rounded-2xl border-2 p-4",
              selectedPackage?.identifier === yearlyPackage.identifier ? "" : "border-transparent"
            )}
            style={{
              backgroundColor: colors.card,
              borderColor:
                selectedPackage?.identifier === yearlyPackage.identifier
                  ? Tokens.brand.accent[500]
                  : "transparent",
            }}
            accessibilityLabel={`Plano anual, ${yearlyPackage.product.priceString}`}
            accessibilityRole="radio"
            accessibilityState={{
              selected: selectedPackage?.identifier === yearlyPackage.identifier,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-lg font-bold" style={{ color: colors.text }}>
                    Anual
                  </Text>
                  <View
                    className="ml-2 rounded-full px-2 py-1"
                    style={{ backgroundColor: colors.successLight }}
                  >
                    <Text className="text-xs font-semibold" style={{ color: colors.success }}>
                      Economize {calculateSavingsPercent(PRICES_BRL.MONTHLY, PRICES_BRL.YEARLY)}%
                    </Text>
                  </View>
                </View>
                <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
                  R$ {PRICES_BRL.YEARLY_MONTHLY_EQUIVALENT}/mês
                </Text>
              </View>
              <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                {yearlyPackage.product.priceString}
              </Text>
            </View>
          </Pressable>
        )}

        {/* Monthly Package */}
        {monthlyPackage && (
          <Pressable
            onPress={() => setSelectedPackage(monthlyPackage)}
            className={cn(
              "rounded-2xl border-2 p-4",
              selectedPackage?.identifier === monthlyPackage.identifier ? "" : "border-transparent"
            )}
            style={{
              backgroundColor: colors.card,
              borderColor:
                selectedPackage?.identifier === monthlyPackage.identifier
                  ? Tokens.brand.accent[500]
                  : "transparent",
            }}
            accessibilityLabel={`Plano mensal, ${monthlyPackage.product.priceString}`}
            accessibilityRole="radio"
            accessibilityState={{
              selected: selectedPackage?.identifier === monthlyPackage.identifier,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold" style={{ color: colors.text }}>
                  Mensal
                </Text>
                <Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
                  Renovação automática
                </Text>
              </View>
              <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                {monthlyPackage.product.priceString}
              </Text>
            </View>
          </Pressable>
        )}
      </View>

      {/* Purchase Button */}
      <View className="mt-8 px-6">
        <Pressable
          onPress={handlePurchase}
          disabled={!selectedPackage || isPurchasing}
          className={cn("rounded-full py-4", !selectedPackage || isPurchasing ? "opacity-50" : "")}
          style={{ backgroundColor: colors.primary }}
          accessibilityLabel={isPurchasing ? "Processando assinatura" : "Assinar agora"}
          accessibilityRole="button"
          accessibilityState={{ disabled: !selectedPackage || isPurchasing }}
        >
          {isPurchasing ? (
            <ActivityIndicator color={colors.card} />
          ) : (
            <Text className="text-center text-lg font-bold" style={{ color: colors.card }}>
              Assinar Agora
            </Text>
          )}
        </Pressable>

        {/* Restore Button */}
        <Pressable
          onPress={handleRestore}
          disabled={isRestoring}
          className="mt-4 py-2"
          accessibilityLabel={isRestoring ? "Restaurando compras" : "Restaurar compras anteriores"}
          accessibilityRole="button"
          accessibilityState={{ disabled: isRestoring }}
        >
          {isRestoring ? (
            <ActivityIndicator color={colors.textSecondary} size="small" />
          ) : (
            <Text className="text-center font-medium" style={{ color: colors.textSecondary }}>
              Restaurar compras
            </Text>
          )}
        </Pressable>
      </View>

      {/* Legal */}
      <View className="mt-6 px-6">
        <Text className="text-center text-xs" style={{ color: colors.textTertiary }}>
          Assinatura com renovação automática. Cancele a qualquer momento.{"\n"}
          Termos de uso e política de privacidade aplicam-se.
        </Text>
      </View>
    </ScrollView>
  );
}
