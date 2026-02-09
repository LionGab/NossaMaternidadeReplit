/**
 * CRM Lifecycle Edge Function
 *
 * Endpoints:
 * - POST /attribution-touch
 * - POST /paywall-exposure
 * - POST /paywall-outcome
 * - POST /enqueue-journey
 * - GET  /health
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, handlePreflight } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type JourneyType = "trial" | "churn_risk" | "winback" | "billing_issue";
type TouchType = "impression" | "click" | "install" | "trial" | "paid";
type PaywallOutcomeType =
  | "trial_started"
  | "purchase_success"
  | "purchase_failed"
  | "restore_success"
  | "restore_failed"
  | "dismissed"
  | "skip_free";

interface AttributionTouchRequest {
  source: string;
  medium?: string;
  campaign?: string;
  content_id?: string;
  creator_cta_id?: string;
  referrer_url?: string;
  landing_path?: string;
  platform?: "ios" | "android" | "web" | "unknown";
  touch_type?: TouchType;
  metadata?: Record<string, unknown>;
}

interface PaywallExposureRequest {
  experiment_name: string;
  variant: string;
  session_id?: string;
  source?: string;
  campaign?: string;
  content_id?: string;
  creator_cta_id?: string;
  screen_name?: string;
  metadata?: Record<string, unknown>;
}

interface PaywallOutcomeRequest {
  experiment_name: string;
  variant: string;
  outcome_type: PaywallOutcomeType;
  session_id?: string;
  source?: string;
  campaign?: string;
  content_id?: string;
  creator_cta_id?: string;
  outcome_value_cents?: number;
  metadata?: Record<string, unknown>;
}

interface EnqueueJourneyRequest {
  journey_type: JourneyType;
  user_id: string;
  scheduled_for?: string;
  metadata?: Record<string, unknown>;
}

function jsonResponse(data: unknown, status: number, req: Request): Response {
  const headers = buildCorsHeaders(req);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

function sanitizeText(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function sanitizeMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") return {};
  return value as Record<string, unknown>;
}

async function getAuthenticatedUserId(
  req: Request,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  if (!token) return null;

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user.id;
}

function isServiceCall(req: Request): boolean {
  const serviceKeyHeader =
    req.headers.get("x-service-key") || req.headers.get("Authorization")?.replace("Bearer ", "");
  return serviceKeyHeader === SUPABASE_SERVICE_KEY;
}

function resolveTouchCounters(touchType: TouchType): {
  impressions: number;
  clicks: number;
  installs: number;
  trials: number;
  paid_conversions: number;
  revenue_cents: number;
} {
  if (touchType === "impression") {
    return { impressions: 1, clicks: 0, installs: 0, trials: 0, paid_conversions: 0, revenue_cents: 0 };
  }
  if (touchType === "install") {
    return { impressions: 0, clicks: 0, installs: 1, trials: 0, paid_conversions: 0, revenue_cents: 0 };
  }
  if (touchType === "trial") {
    return { impressions: 0, clicks: 0, installs: 0, trials: 1, paid_conversions: 0, revenue_cents: 0 };
  }
  if (touchType === "paid") {
    return { impressions: 0, clicks: 0, installs: 0, trials: 0, paid_conversions: 1, revenue_cents: 0 };
  }
  return { impressions: 0, clicks: 1, installs: 0, trials: 0, paid_conversions: 0, revenue_cents: 0 };
}

async function incrementCreatorPerformance(
  supabaseAdmin: ReturnType<typeof createClient>,
  payload: {
    source: string;
    campaign: string;
    contentId: string;
    creatorCtaId: string;
    metadata: Record<string, unknown>;
    counters: {
      impressions: number;
      clicks: number;
      installs: number;
      trials: number;
      paid_conversions: number;
      revenue_cents: number;
    };
  }
): Promise<void> {
  const dayDate = new Date().toISOString().slice(0, 10);

  const { data: existing } = await supabaseAdmin
    .from("creator_content_performance")
    .select(
      "id, impressions, clicks, installs, trials, paid_conversions, revenue_cents, metadata"
    )
    .eq("day_date", dayDate)
    .eq("source", payload.source)
    .eq("campaign", payload.campaign)
    .eq("content_id", payload.contentId)
    .eq("creator_cta_id", payload.creatorCtaId)
    .maybeSingle();

  if (!existing) {
    await supabaseAdmin.from("creator_content_performance").insert({
      day_date: dayDate,
      source: payload.source,
      campaign: payload.campaign,
      content_id: payload.contentId,
      creator_cta_id: payload.creatorCtaId,
      impressions: payload.counters.impressions,
      clicks: payload.counters.clicks,
      installs: payload.counters.installs,
      trials: payload.counters.trials,
      paid_conversions: payload.counters.paid_conversions,
      revenue_cents: payload.counters.revenue_cents,
      metadata: payload.metadata,
    });
    return;
  }

  const currentMetadata =
    existing.metadata && typeof existing.metadata === "object"
      ? (existing.metadata as Record<string, unknown>)
      : {};

  await supabaseAdmin
    .from("creator_content_performance")
    .update({
      impressions: (existing.impressions || 0) + payload.counters.impressions,
      clicks: (existing.clicks || 0) + payload.counters.clicks,
      installs: (existing.installs || 0) + payload.counters.installs,
      trials: (existing.trials || 0) + payload.counters.trials,
      paid_conversions: (existing.paid_conversions || 0) + payload.counters.paid_conversions,
      revenue_cents: (existing.revenue_cents || 0) + payload.counters.revenue_cents,
      metadata: { ...currentMetadata, ...payload.metadata },
    })
    .eq("id", existing.id);
}

async function handleAttributionTouch(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string,
  body: AttributionTouchRequest
): Promise<void> {
  const source = sanitizeText(body.source, "unknown");
  const medium = sanitizeText(body.medium, "");
  const campaign = sanitizeText(body.campaign, "");
  const contentId = sanitizeText(body.content_id, "");
  const creatorCtaId = sanitizeText(body.creator_cta_id, "");
  const referrerUrl = sanitizeText(body.referrer_url, "");
  const landingPath = sanitizeText(body.landing_path, "");
  const platform = sanitizeText(body.platform, "unknown");
  const metadata = sanitizeMetadata(body.metadata);
  const touchType = (body.touch_type || "click") as TouchType;

  const touchPayload = {
    source,
    medium,
    campaign,
    content_id: contentId,
    creator_cta_id: creatorCtaId,
    referrer_url: referrerUrl,
    landing_path: landingPath,
    platform,
    touch_type: touchType,
    metadata,
    touched_at: new Date().toISOString(),
  };

  const { data: existing } = await supabaseAdmin
    .from("user_attribution")
    .select("id, first_touch_at")
    .eq("user_id", userId)
    .eq("source", source)
    .eq("campaign", campaign)
    .eq("content_id", contentId)
    .eq("creator_cta_id", creatorCtaId)
    .maybeSingle();

  if (!existing) {
    await supabaseAdmin.from("user_attribution").insert({
      user_id: userId,
      source,
      medium,
      campaign,
      content_id: contentId,
      creator_cta_id: creatorCtaId,
      referrer_url: referrerUrl,
      landing_path: landingPath,
      platform,
      first_touch_payload: touchPayload,
      last_touch_payload: touchPayload,
    });
  } else {
    await supabaseAdmin
      .from("user_attribution")
      .update({
        medium,
        referrer_url: referrerUrl,
        landing_path: landingPath,
        platform,
        last_touch_at: new Date().toISOString(),
        last_touch_payload: touchPayload,
      })
      .eq("id", existing.id);
  }

  await incrementCreatorPerformance(supabaseAdmin, {
    source,
    campaign,
    contentId,
    creatorCtaId,
    metadata,
    counters: resolveTouchCounters(touchType),
  });
}

async function handlePaywallExposure(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string,
  body: PaywallExposureRequest
): Promise<void> {
  const source = sanitizeText(body.source, "unknown");
  const campaign = sanitizeText(body.campaign, "");
  const contentId = sanitizeText(body.content_id, "");
  const creatorCtaId = sanitizeText(body.creator_cta_id, "");
  const metadata = sanitizeMetadata(body.metadata);

  await supabaseAdmin.from("paywall_exposures").insert({
    user_id: userId,
    session_id: sanitizeText(body.session_id, ""),
    experiment_name: sanitizeText(body.experiment_name, "paywall_creator_v1"),
    variant: sanitizeText(body.variant, "control"),
    source,
    campaign,
    content_id: contentId,
    creator_cta_id: creatorCtaId,
    screen_name: sanitizeText(body.screen_name, ""),
    metadata,
  });

  await incrementCreatorPerformance(supabaseAdmin, {
    source,
    campaign,
    contentId,
    creatorCtaId,
    metadata: { ...metadata, paywall_exposure: true },
    counters: resolveTouchCounters("impression"),
  });
}

async function handlePaywallOutcome(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string,
  body: PaywallOutcomeRequest
): Promise<void> {
  const source = sanitizeText(body.source, "unknown");
  const campaign = sanitizeText(body.campaign, "");
  const contentId = sanitizeText(body.content_id, "");
  const creatorCtaId = sanitizeText(body.creator_cta_id, "");
  const metadata = sanitizeMetadata(body.metadata);
  const outcomeType = sanitizeText(body.outcome_type, "dismissed") as PaywallOutcomeType;
  const valueCents =
    typeof body.outcome_value_cents === "number" && body.outcome_value_cents > 0
      ? Math.floor(body.outcome_value_cents)
      : 0;

  await supabaseAdmin.from("paywall_outcomes").insert({
    user_id: userId,
    session_id: sanitizeText(body.session_id, ""),
    experiment_name: sanitizeText(body.experiment_name, "paywall_creator_v1"),
    variant: sanitizeText(body.variant, "control"),
    outcome_type: outcomeType,
    source,
    campaign,
    content_id: contentId,
    creator_cta_id: creatorCtaId,
    outcome_value_cents: valueCents,
    metadata,
  });

  const counters = resolveTouchCounters(
    outcomeType === "trial_started"
      ? "trial"
      : outcomeType === "purchase_success"
        ? "paid"
        : "click"
  );
  counters.revenue_cents = outcomeType === "purchase_success" ? valueCents : 0;

  await incrementCreatorPerformance(supabaseAdmin, {
    source,
    campaign,
    contentId,
    creatorCtaId,
    metadata: { ...metadata, paywall_outcome: outcomeType },
    counters,
  });
}

async function resolveProfileId(
  supabaseAdmin: ReturnType<typeof createClient>,
  authUserId: string
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("user_id", authUserId)
    .maybeSingle();

  return data?.id ?? null;
}

function getJourneyMessage(
  journeyType: JourneyType
): { notificationType: string; title: string; body: string; priority: number } {
  if (journeyType === "trial") {
    return {
      notificationType: "custom",
      title: "Seu período grátis está ativo",
      body: "Aproveite os recursos premium da NathIA hoje e veja seu progresso completo.",
      priority: 7,
    };
  }

  if (journeyType === "churn_risk") {
    return {
      notificationType: "custom",
      title: "Sentimos sua falta por aqui",
      body: "Volte para continuar sua jornada com a NathIA e seus cuidados personalizados.",
      priority: 8,
    };
  }

  if (journeyType === "billing_issue") {
    return {
      notificationType: "custom",
      title: "Problema no pagamento da assinatura",
      body: "Atualize seu método de pagamento para manter o acesso premium sem interrupções.",
      priority: 9,
    };
  }

  return {
    notificationType: "custom",
    title: "Tem novidade pra você",
    body: "Seu plano premium pode ser reativado com benefícios exclusivos hoje.",
    priority: 8,
  };
}

async function handleEnqueueJourney(
  supabaseAdmin: ReturnType<typeof createClient>,
  body: EnqueueJourneyRequest
): Promise<void> {
  const journeyType = sanitizeText(body.journey_type, "winback") as JourneyType;
  const profileId = await resolveProfileId(supabaseAdmin, sanitizeText(body.user_id));
  if (!profileId) {
    throw new Error("Profile not found for provided user_id");
  }

  const scheduleAt = sanitizeText(body.scheduled_for)
    ? new Date(sanitizeText(body.scheduled_for)).toISOString()
    : new Date().toISOString();

  const template = getJourneyMessage(journeyType);
  const metadata = sanitizeMetadata(body.metadata);

  await supabaseAdmin.from("notification_queue").insert({
    user_id: profileId,
    notification_type: template.notificationType,
    title: template.title,
    body: template.body,
    data: {
      source: "crm_lifecycle",
      journey_type: journeyType,
      ...metadata,
    },
    status: "pending",
    scheduled_for: scheduleAt,
    priority: template.priority,
    ttl_seconds: 86400,
    collapse_key: `crm_${journeyType}_${profileId}`,
  });
}

Deno.serve(async (req) => {
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  const path = new URL(req.url).pathname.split("/").pop() || "";

  if (req.method === "GET" && path === "health") {
    return jsonResponse({ ok: true, service: "crm-lifecycle" }, 200, req);
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, req);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    if (path === "enqueue-journey") {
      if (!isServiceCall(req)) {
        return jsonResponse({ error: "Unauthorized" }, 403, req);
      }

      const body = (await req.json()) as EnqueueJourneyRequest;
      await handleEnqueueJourney(supabaseAdmin, body);
      return jsonResponse({ success: true }, 200, req);
    }

    const userId = await getAuthenticatedUserId(req, supabaseAdmin);
    if (!userId) {
      return jsonResponse({ error: "Invalid or missing auth token" }, 401, req);
    }

    if (path === "attribution-touch") {
      const body = (await req.json()) as AttributionTouchRequest;
      await handleAttributionTouch(supabaseAdmin, userId, body);
      return jsonResponse({ success: true }, 200, req);
    }

    if (path === "paywall-exposure") {
      const body = (await req.json()) as PaywallExposureRequest;
      await handlePaywallExposure(supabaseAdmin, userId, body);
      return jsonResponse({ success: true }, 200, req);
    }

    if (path === "paywall-outcome") {
      const body = (await req.json()) as PaywallOutcomeRequest;
      await handlePaywallOutcome(supabaseAdmin, userId, body);
      return jsonResponse({ success: true }, 200, req);
    }

    return jsonResponse({ error: "Unknown route", path }, 404, req);
  } catch (error) {
    return jsonResponse(
      {
        error: "CRM lifecycle processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
      req
    );
  }
});
