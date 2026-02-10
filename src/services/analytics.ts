import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { supabase } from "@/api/supabase";
import { getEnv, getSupabaseFunctionsUrl } from "@/config/env";
import type {
  AnalyticsEventInput,
  AttributionContext,
  ConversionEventName,
  PaywallExposureInput,
  PaywallOutcomeInput,
  SetAttributionContextOptions,
  StartSessionOptions,
} from "@/types/analytics";
import { logger } from "@/utils/logger";

const SESSION_STORAGE_KEY = "@analytics_session_id_v1";
const ATTRIBUTION_STORAGE_KEY = "@analytics_attribution_context_v1";
const FALLBACK_SOURCE = "unknown";

let sessionIdCache: string | null = null;
let attributionCache: AttributionContext | null = null;

interface AnalyticsTrackPayload {
  events: Array<{
    event_name: string;
    category: string;
    properties?: Record<string, unknown>;
    session_id: string;
    screen_name?: string;
    duration_ms?: number;
    timestamp: string;
  }>;
  session_id: string;
  device_info: {
    platform: "ios" | "android" | "web";
    app_version: string;
    locale: string;
  };
}

function getPlatform(): "ios" | "android" | "web" {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  return "web";
}

function createLocalSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function getAppVersion(): string {
  const version = Constants.expoConfig?.version;
  if (typeof version === "string" && version.length > 0) {
    return version;
  }
  return "unknown";
}

function getFunctionsBaseUrl(): string | null {
  const url = getSupabaseFunctionsUrl();
  if (!url) {
    logger.warn("Supabase Functions URL not configured", "AnalyticsService");
    return null;
  }
  return url;
}

async function getAccessToken(): Promise<string | null> {
  if (!supabase) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}

function getAuthorizationHeaders(
  token: string | null,
  requireAuthFallback?: boolean
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  if (requireAuthFallback) {
    const anonKey = getEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY");
    if (anonKey) {
      headers.Authorization = `Bearer ${anonKey}`;
      headers.ApiKey = anonKey;
      return headers;
    }
    logger.warn("Supabase anon key missing, cannot send fallback auth header", "AnalyticsService");
  }

  return headers;
}

async function postToEdgeFunction(
  endpointPath: string,
  payload: unknown,
  options: { requireAuth: boolean; requireAuthFallback?: boolean }
): Promise<{ ok: boolean; data?: unknown }> {
  const baseUrl = getFunctionsBaseUrl();
  if (!baseUrl) {
    return { ok: false };
  }

  const token = await getAccessToken();
  if (options.requireAuth && !token) {
    return { ok: false };
  }

  try {
    const response = await fetch(`${baseUrl}/${endpointPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthorizationHeaders(token, options.requireAuthFallback),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseText = await response.text();
      logger.warn("Edge function request failed", "AnalyticsService", {
        endpointPath,
        status: response.status,
        responseText,
      });
      return { ok: false };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    logger.warn("Edge function request error", "AnalyticsService", {
      endpointPath,
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false };
  }
}

function isAttributionContext(value: unknown): value is AttributionContext {
  if (!value || typeof value !== "object") return false;

  const source = (value as { source?: unknown }).source;
  return typeof source === "string" && source.trim().length > 0;
}

async function readAttributionContextFromStorage(): Promise<AttributionContext | null> {
  try {
    const serialized = await AsyncStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!serialized) return null;

    const parsed: unknown = JSON.parse(serialized);
    if (!isAttributionContext(parsed)) return null;
    return parsed;
  } catch (error) {
    logger.warn("Failed to read attribution context from storage", "AnalyticsService", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

function normalizeContextInput(context: AttributionContext): AttributionContext {
  return {
    source: context.source?.trim() || FALLBACK_SOURCE,
    medium: context.medium?.trim() || undefined,
    campaign: context.campaign?.trim() || undefined,
    contentId: context.contentId?.trim() || undefined,
    creatorCtaId: context.creatorCtaId?.trim() || undefined,
    referrerUrl: context.referrerUrl?.trim() || undefined,
    landingPath: context.landingPath?.trim() || undefined,
    platform: context.platform ?? getPlatform(),
    capturedAt: context.capturedAt ?? new Date().toISOString(),
  };
}

function attributionToProperties(context: AttributionContext | null): Record<string, unknown> {
  if (!context) return {};

  return {
    source: context.source,
    medium: context.medium ?? null,
    campaign: context.campaign ?? null,
    content_id: context.contentId ?? null,
    creator_cta_id: context.creatorCtaId ?? null,
    referrer_url: context.referrerUrl ?? null,
    landing_path: context.landingPath ?? null,
    attribution_platform: context.platform ?? null,
    attribution_captured_at: context.capturedAt ?? null,
  };
}

export async function getAttributionContext(): Promise<AttributionContext | null> {
  if (attributionCache) {
    return attributionCache;
  }

  const context = await readAttributionContextFromStorage();
  attributionCache = context;
  return context;
}

export async function startSession(options: StartSessionOptions = {}): Promise<string> {
  if (!options.forceNew && sessionIdCache) {
    return sessionIdCache;
  }

  if (!options.forceNew) {
    const existing = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      sessionIdCache = existing;
      return existing;
    }
  }

  const localSessionId = createLocalSessionId();
  sessionIdCache = localSessionId;
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, localSessionId);

  const response = await postToEdgeFunction("analytics/session", {}, { requireAuth: true });
  const sessionPayload = response.data as { session_id?: unknown } | undefined;
  const remoteSessionId = sessionPayload?.session_id;

  if (response.ok && typeof remoteSessionId === "string" && remoteSessionId.length > 0) {
    sessionIdCache = remoteSessionId;
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, remoteSessionId);
    return remoteSessionId;
  }

  return localSessionId;
}

export async function trackEvent(event: AnalyticsEventInput): Promise<void> {
  const sessionId = await startSession();
  const attribution = await getAttributionContext();

  const payload: AnalyticsTrackPayload = {
    events: [
      {
        event_name: event.eventName,
        category: event.category,
        session_id: sessionId,
        screen_name: event.screenName,
        duration_ms: event.durationMs,
        properties: {
          ...(event.properties ?? {}),
          ...attributionToProperties(attribution),
        },
        timestamp: new Date().toISOString(),
      },
    ],
    session_id: sessionId,
    device_info: {
      platform: getPlatform(),
      app_version: getAppVersion(),
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
    },
  };

  await postToEdgeFunction("analytics/track", payload, {
    requireAuth: false,
    requireAuthFallback: true,
  });
}

export async function trackConversion(
  conversionEvent: ConversionEventName,
  properties?: Record<string, unknown>
): Promise<void> {
  const attribution = await getAttributionContext();
  const mergedProperties = {
    ...(properties ?? {}),
    ...attributionToProperties(attribution),
  };

  const conversionResponse = await postToEdgeFunction(
    "analytics/conversion",
    {
      event: conversionEvent,
      properties: mergedProperties,
    },
    { requireAuth: true }
  );

  if (!conversionResponse.ok) {
    await trackEvent({
      eventName: conversionEvent,
      category: "conversion",
      properties: mergedProperties,
    });
  }
}

export async function setAttributionContext(
  incomingContext: AttributionContext,
  options: SetAttributionContextOptions = {}
): Promise<AttributionContext> {
  const normalized = normalizeContextInput(incomingContext);
  attributionCache = normalized;

  if (options.persist !== false) {
    await AsyncStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(normalized));
  }

  if (options.touchRemote !== false) {
    await postToEdgeFunction(
      "crm-lifecycle/attribution-touch",
      {
        source: normalized.source,
        medium: normalized.medium ?? "",
        campaign: normalized.campaign ?? "",
        content_id: normalized.contentId ?? "",
        creator_cta_id: normalized.creatorCtaId ?? "",
        referrer_url: normalized.referrerUrl ?? "",
        landing_path: normalized.landingPath ?? "",
        platform: normalized.platform ?? getPlatform(),
        touch_type: "click",
      },
      { requireAuth: true }
    );
  }

  if (options.track !== false) {
    await trackEvent({
      eventName: "creator_attribution_captured",
      category: "conversion",
      properties: attributionToProperties(normalized),
    });
  }

  return normalized;
}

export async function trackPaywallExposure(input: PaywallExposureInput): Promise<void> {
  const sessionId = input.sessionId ?? (await startSession());
  const attribution = await getAttributionContext();
  const source = input.source ?? attribution?.source ?? FALLBACK_SOURCE;
  const campaign = input.campaign ?? attribution?.campaign ?? "";
  const contentId = input.contentId ?? attribution?.contentId ?? "";
  const creatorCtaId = input.creatorCtaId ?? attribution?.creatorCtaId ?? "";

  await postToEdgeFunction(
    "crm-lifecycle/paywall-exposure",
    {
      experiment_name: input.experimentName,
      variant: input.variant,
      screen_name: input.screenName,
      session_id: sessionId,
      source,
      campaign,
      content_id: contentId,
      creator_cta_id: creatorCtaId,
      metadata: input.metadata ?? {},
    },
    { requireAuth: true }
  );

  await trackEvent({
    eventName: "paywall_view",
    category: "conversion",
    screenName: input.screenName,
    properties: {
      experiment_name: input.experimentName,
      variant: input.variant,
      session_id: sessionId,
      source,
      campaign,
      content_id: contentId,
      creator_cta_id: creatorCtaId,
      ...(input.metadata ?? {}),
    },
  });
}

export async function trackPaywallOutcome(input: PaywallOutcomeInput): Promise<void> {
  const sessionId = input.sessionId ?? (await startSession());
  const attribution = await getAttributionContext();
  const source = input.source ?? attribution?.source ?? FALLBACK_SOURCE;
  const campaign = input.campaign ?? attribution?.campaign ?? "";
  const contentId = input.contentId ?? attribution?.contentId ?? "";
  const creatorCtaId = input.creatorCtaId ?? attribution?.creatorCtaId ?? "";

  await postToEdgeFunction(
    "crm-lifecycle/paywall-outcome",
    {
      experiment_name: input.experimentName,
      variant: input.variant,
      outcome_type: input.outcomeType,
      session_id: sessionId,
      source,
      campaign,
      content_id: contentId,
      creator_cta_id: creatorCtaId,
      metadata: input.metadata ?? {},
    },
    { requireAuth: true }
  );

  const eventNameByOutcome: Record<string, string> = {
    trial_started: "trial_started",
    purchase_success: "purchase_success",
    purchase_failed: "purchase_failed",
    restore_success: "restore_success",
    restore_failed: "restore_failed",
    dismissed: "paywall_cta_tapped",
    skip_free: "paywall_cta_tapped",
  };

  await trackEvent({
    eventName: eventNameByOutcome[input.outcomeType] ?? "paywall_cta_tapped",
    category: "conversion",
    properties: {
      experiment_name: input.experimentName,
      variant: input.variant,
      outcome_type: input.outcomeType,
      session_id: sessionId,
      source,
      campaign,
      content_id: contentId,
      creator_cta_id: creatorCtaId,
      ...(input.metadata ?? {}),
    },
  });
}
