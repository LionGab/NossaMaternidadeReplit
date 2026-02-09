/**
 * Paywall Gate Component
 *
 * Wrapper que mostra paywall se usuário não é premium
 * Usa usePremiumStatus hook para verificar status
 *
 * @module components/premium/PaywallGate
 */

import React from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { Tokens } from "@/theme/tokens";
import { cn } from "@/utils/cn";

interface PaywallGateProps {
  children: React.ReactNode;
  /** Mensagem customizada do paywall */
  message?: string;
  /** Título customizado do paywall */
  title?: string;
  /** Se deve mostrar loading spinner enquanto verifica status */
  showLoading?: boolean;
  /** Callback quando usuário clica em "Upgrade" */
  onUpgradePress?: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * PaywallGate - Gating component para features premium
 *
 * @example
 * ```tsx
 * <PaywallGate
 *   title="Feature Premium"
 *   message="Você precisa ser premium para acessar esta funcionalidade"
 * >
 *   <PremiumFeature />
 * </PaywallGate>
 * ```
 */
export function PaywallGate({
  children,
  message = "Esta funcionalidade é exclusiva para usuárias premium",
  title = "Premium Necessário",
  showLoading = true,
  onUpgradePress,
}: PaywallGateProps): React.JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const { isPremium, isLoading } = usePremiumStatus();

  const handleUpgradePress = (): void => {
    if (onUpgradePress) {
      onUpgradePress();
    } else {
      // Navegar para tela de paywall
      navigation.navigate("Paywall", { source: "paywall-gate" });
    }
  };

  // Loading state
  if (isLoading && showLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color={Tokens.brand.primary[500]} />
        <Text
          className="mt-4 text-sm text-neutral-600 dark:text-neutral-400"
          style={{ fontFamily: Tokens.typography.fontFamily.base }}
        >
          Verificando acesso...
        </Text>
      </View>
    );
  }

  // Premium: Mostrar conteúdo
  if (isPremium) {
    return <>{children}</>;
  }

  // Não premium: Mostrar paywall
  return (
    <View className="flex-1 items-center justify-center px-6 bg-neutral-50 dark:bg-neutral-900">
      {/* Ícone */}
      <View
        className="mb-6 h-24 w-24 items-center justify-center rounded-full"
        style={{ backgroundColor: Tokens.premium.gradient.accent }}
      >
        <Ionicons name="lock-closed" size={48} color={Tokens.premium.special.gold} />
      </View>

      {/* Título */}
      <Text
        className="mb-3 text-center text-2xl font-bold text-neutral-900 dark:text-neutral-50"
        style={{ fontFamily: Tokens.typography.fontFamily.bold }}
      >
        {title}
      </Text>

      {/* Mensagem */}
      <Text
        className="mb-8 text-center text-base text-neutral-600 dark:text-neutral-400"
        style={{ fontFamily: Tokens.typography.fontFamily.base }}
      >
        {message}
      </Text>

      {/* Botão Upgrade */}
      <Pressable
        onPress={handleUpgradePress}
        className={cn(
          "w-full max-w-sm rounded-2xl py-4 px-6",
          "active:scale-95 transition-transform"
        )}
        style={{ backgroundColor: Tokens.brand.accent[500] }}
        accessibilityRole="button"
        accessibilityLabel={`Fazer upgrade para premium`}
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="star" size={20} color={Tokens.neutral[0]} style={{ marginRight: 8 }} />
          <Text
            className="text-center text-base font-semibold"
            style={{
              fontFamily: Tokens.typography.fontFamily.semibold,
              color: Tokens.neutral[0],
            }}
          >
            Fazer Upgrade para Premium
          </Text>
        </View>
      </Pressable>

      {/* Benefícios */}
      <View className="mt-8 w-full max-w-sm">
        <Text
          className="mb-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300"
          style={{ fontFamily: Tokens.typography.fontFamily.semibold }}
        >
          Com o Premium você tem:
        </Text>

        {[
          "Conversas ilimitadas com a NathIA",
          "Acesso ao Mundo Nath exclusivo",
          "Suporte prioritário",
          "Novos recursos em primeira mão",
        ].map((benefit, index) => (
          <View key={index} className="mb-2 flex-row items-start">
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Tokens.brand.accent[500]}
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <Text
              className="flex-1 text-sm text-neutral-600 dark:text-neutral-400"
              style={{ fontFamily: Tokens.typography.fontFamily.base }}
            >
              {benefit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * PaywallGateInline - Versão inline para uso dentro de outras telas
 *
 * @example
 * ```tsx
 * <PaywallGateInline onUpgradePress={() => navigation.navigate("Paywall")}>
 *   <PremiumFeature />
 * </PaywallGateInline>
 * ```
 */
export function PaywallGateInline({
  children,
  message = "Upgrade para acessar",
  onUpgradePress,
}: {
  children: React.ReactNode;
  message?: string;
  onUpgradePress?: () => void;
}): React.JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const { isPremium } = usePremiumStatus({ autoRefresh: false });

  if (isPremium) {
    return <>{children}</>;
  }

  const handlePress = (): void => {
    if (onUpgradePress) {
      onUpgradePress();
    } else {
      navigation.navigate("Paywall", { source: "paywall-gate-inline" });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="items-center justify-center rounded-2xl border-2 py-6 px-4"
      style={{
        borderColor: Tokens.premium.special.gold,
        backgroundColor: Tokens.overlay.light,
      }}
      accessibilityRole="button"
      accessibilityLabel="Fazer upgrade para premium"
    >
      <Ionicons name="lock-closed" size={32} color={Tokens.premium.special.gold} />
      <Text
        className="mt-2 text-center text-sm font-medium text-neutral-700 dark:text-neutral-300"
        style={{ fontFamily: Tokens.typography.fontFamily.medium }}
      >
        {message}
      </Text>
    </Pressable>
  );
}
