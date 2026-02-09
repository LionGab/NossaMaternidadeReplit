/**
 * Analytics and Growth Attribution Types
 *
 * Shared contracts used by analytics tracking, attribution context,
 * and paywall experiment instrumentation.
 */

export const ANALYTICS_CATEGORIES = [
  "screen_view",
  "user_action",
  "feature_use",
  "navigation",
  "conversion",
  "error",
  "performance",
  "engagement",
  "onboarding",
  "ai_interaction",
  "community",
  "health_tracking",
] as const;

export type AnalyticsCategory = (typeof ANALYTICS_CATEGORIES)[number];

export const ANALYTICS_EVENTS = [
  "app_opened",
  "app_session_started",
  "deep_link_opened",
  "creator_attribution_captured",
  "onboarding_started",
  "onboarding_completed",
  "paywall_view",
  "paywall_cta_tapped",
  "trial_started",
  "purchase_success",
  "purchase_failed",
  "restore_success",
  "restore_failed",
  "subscription_billing_issue",
  "subscription_winback_started",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export const CONVERSION_EVENTS = [
  "onboarding_started",
  "onboarding_completed",
  "first_ai_chat",
  "notification_enabled",
  "trial_started",
  "purchase_success",
] as const;

export type ConversionEventName = (typeof CONVERSION_EVENTS)[number];

export interface AttributionContext {
  source: string;
  medium?: string;
  campaign?: string;
  contentId?: string;
  creatorCtaId?: string;
  referrerUrl?: string;
  landingPath?: string;
  platform?: "ios" | "android" | "web";
  capturedAt?: string;
}

export interface AnalyticsEventInput {
  eventName: AnalyticsEventName | string;
  category: AnalyticsCategory;
  screenName?: string;
  durationMs?: number;
  properties?: Record<string, unknown>;
}

export interface StartSessionOptions {
  forceNew?: boolean;
}

export interface SetAttributionContextOptions {
  persist?: boolean;
  touchRemote?: boolean;
  track?: boolean;
}

export interface PaywallExposureInput {
  experimentName: string;
  variant: string;
  screenName: string;
  source?: string;
  campaign?: string;
  contentId?: string;
  creatorCtaId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export const PAYWALL_OUTCOME_TYPES = [
  "trial_started",
  "purchase_success",
  "purchase_failed",
  "restore_success",
  "restore_failed",
  "dismissed",
  "skip_free",
] as const;

export type PaywallOutcomeType = (typeof PAYWALL_OUTCOME_TYPES)[number];

export interface PaywallOutcomeInput {
  experimentName: string;
  variant: string;
  outcomeType: PaywallOutcomeType;
  sessionId?: string;
  source?: string;
  campaign?: string;
  contentId?: string;
  creatorCtaId?: string;
  metadata?: Record<string, unknown>;
}
