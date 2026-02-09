/**
 * Premium Subscription Types
 * Tipos para gerenciamento de assinaturas premium
 */

import type { CustomerInfo } from "react-native-purchases";
import { brand, semantic } from "../theme/tokens";

// Tiers de assinatura
export type SubscriptionTier = "free" | "premium";

// Periodos de assinatura
export type SubscriptionPeriod = "monthly" | "yearly";

// Fonte de sincronização do estado premium
export type PremiumSyncSource = "startup" | "listener" | "appstate" | "manual";

// Estado da assinatura
export interface SubscriptionDetails {
  tier: SubscriptionTier;
  period: SubscriptionPeriod | null;
  expirationDate: string | null;
  isTrialing: boolean;
  trialEndDate: string | null;
  willRenew: boolean;
  productId: string | null;
}

// Estado completo do premium
export interface PremiumState {
  // Status principal
  isPremium: boolean;
  subscription: SubscriptionDetails;

  // Feature flags
  hasVoiceAccess: boolean;
  hasPremiumScreensAccess: boolean;
  hasUnlimitedChat: boolean;

  // Loading states
  isLoading: boolean;
  isRestoring: boolean;
  isPurchasing: boolean;

  // Error
  error: string | null;

  // Customer info do RevenueCat
  customerInfo: CustomerInfo | null;

  // Sync metadata (PR-D: Real-time updates tracking)
  lastSyncedAtIso: string | null;
  lastSource: PremiumSyncSource | null;

  // Actions
  setPremiumStatus: (isPremium: boolean) => void;
  setSubscriptionDetails: (details: Partial<SubscriptionDetails>) => void;
  setCustomerInfo: (info: CustomerInfo | null, source?: PremiumSyncSource) => void;
  setLoading: (loading: boolean) => void;
  setRestoring: (restoring: boolean) => void;
  setPurchasing: (purchasing: boolean) => void;
  setError: (error: string | null) => void;
  checkPremiumStatus: () => Promise<boolean>;
  syncWithRevenueCat: (source?: PremiumSyncSource) => Promise<void>;
  reset: () => void;

  // Debug (apenas desenvolvimento)
  debugTogglePremium: () => void;
}

// Configuracao de precos
export interface PricingConfig {
  monthly: {
    productId: string;
    price: number;
    priceString: string;
    currency: string;
    period: string;
  };
  yearly: {
    productId: string;
    price: number;
    priceString: string;
    currency: string;
    period: string;
    savingsPercent: number;
    monthlyEquivalent: number;
  };
  trialDays: number;
}

// Features premium
export interface PremiumFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color?: string;
}

// Resultado de compra
export interface PurchaseResult {
  success: boolean;
  error?: "cancelled" | "error" | "already_purchased" | "network";
  customerInfo?: CustomerInfo;
  message?: string;
}

// Props do paywall
export interface PaywallProps {
  onClose?: () => void;
  onSuccess?: () => void;
  source?: string; // Para analytics - de onde veio
}

// Constantes de product IDs (must match App Store Connect + Google Play Console + RevenueCat)
// ⚠️ CRÍTICO: Estes IDs devem ser EXATAMENTE iguais nas lojas (iOS e Android)
export const PRODUCT_IDS = {
  MONTHLY: "nossa_maternidade_monthly",
  YEARLY: "nossa_maternidade_yearly",
  // Legacy IDs (mantidos para compatibilidade, mas não devem ser usados)
  MONTHLY_LEGACY: "com.nossamaternidade.subscription.monthly",
  YEARLY_LEGACY: "com.nossamaternidade.subscription.annual",
} as const;

// Constantes de entitlements
export const ENTITLEMENTS = {
  PREMIUM: "premium",
} as const;

// Features premium padrao
export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: "voice",
    icon: "mic-outline",
    title: "Voz da NathIA",
    description: "Ouca as respostas com a voz carinhosa da NathIA",
    color: brand.accent[500],
  },
  {
    id: "sounds",
    icon: "moon-outline",
    title: "Sons para Relaxar",
    description: "Meditacoes e sons da natureza ilimitados",
    color: brand.secondary[500],
  },
  {
    id: "breathing",
    icon: "leaf-outline",
    title: "Respiracao Guiada",
    description: "Exercicios de respiracao personalizados",
    color: semantic.light.success,
  },
  {
    id: "exclusive",
    icon: "sparkles-outline",
    title: "Conteudo Exclusivo",
    description: "Acesso antecipado a novos recursos",
    color: semantic.light.warning,
  },
];

// Precos padrao (fallback se API falhar)
// NOTA: Preços reais vêm do RevenueCat/stores. Estes são apenas fallback visual.
// Valores alinhados com PRICES_BRL em src/services/revenuecat.ts
export const DEFAULT_PRICING: PricingConfig = {
  monthly: {
    productId: PRODUCT_IDS.MONTHLY,
    price: 19.99,
    priceString: "R$ 19,99",
    currency: "BRL",
    period: "mês",
  },
  yearly: {
    productId: PRODUCT_IDS.YEARLY,
    price: 79.99,
    priceString: "R$ 79,99",
    currency: "BRL",
    period: "ano",
    savingsPercent: 67, // R$6,67/mês vs R$19,99/mês
    monthlyEquivalent: 6.67,
  },
  trialDays: 7,
};
