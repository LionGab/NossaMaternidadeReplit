/**
 * Nossa Maternidade - Analytics Edge Function
 *
 * Event tracking and analytics for app usage metrics
 *
 * Features:
 * - Event tracking (screen views, actions, conversions)
 * - Session management
 * - Funnel tracking
 * - Feature usage metrics
 * - Performance monitoring
 * - Privacy-first (no PII in events)
 * - Batch event ingestion
 * - CORS restrito
 *
 * PRIVACY:
 * - User IDs are hashed in storage
 * - No PII stored in events
 * - LGPD compliant (90 day retention)
 * - User can request deletion via /delete-account
 *
 * @version 1.0.0 - Initial (2025-01)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, handlePreflight } from "../_shared/cors.ts";

// =======================
// ENV & CONFIG
// =======================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Configuration
const CONFIG = {
  maxBatchSize: 100, // Max events per batch request
  maxEventsPerMinute: 500, // Rate limit per user
  sessionTimeoutMinutes: 30, // Session expires after inactivity
  retentionDays: 90, // LGPD compliance
};

// Predefined event categories
const EVENT_CATEGORIES = [
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

// Predefined conversion events (funnel tracking)
const CONVERSION_EVENTS = [
  "onboarding_started",
  "onboarding_completed",
  "first_check_in",
  "first_habit_completed",
  "first_affirmation_viewed",
  "first_ai_chat",
  "first_community_post",
  "first_community_comment",
  "notification_enabled",
  "profile_completed",
  "streak_7_days",
  "streak_30_days",
] as const;

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// =======================
// TYPES
// =======================

type EventCategory = (typeof EVENT_CATEGORIES)[number];
type ConversionEvent = (typeof CONVERSION_EVENTS)[number];

interface AnalyticsEvent {
  event_name: string;
  category: EventCategory;
  properties?: Record<string, unknown>;
  timestamp?: string; // ISO string, defaults to now
  session_id?: string;
  screen_name?: string;
  duration_ms?: number;
}

interface TrackEventRequest {
  events: AnalyticsEvent[];
  device_info?: {
    platform: "ios" | "android" | "web";
    os_version?: string;
    app_version?: string;
    device_model?: string;
    screen_width?: number;
    screen_height?: number;
    locale?: string;
    timezone?: string;
  };
  session_id?: string;
}

interface SessionInfo {
  session_id: string;
  started_at: string;
  last_activity_at: string;
  screen_count: number;
  event_count: number;
  duration_seconds: number;
}

interface AnalyticsStats {
  period: "day" | "week" | "month";
  total_events: number;
  unique_users: number;
  total_sessions: number;
  avg_session_duration: number;
  top_screens: { screen: string; views: number }[];
  top_events: { event: string; count: number }[];
  conversion_rates: { event: string; rate: number }[];
}

// =======================
// HELPERS
// =======================

function jsonResponse(data: unknown, status: number, requestObj: Request) {
  const headers = buildCorsHeaders(requestObj);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

/**
 * Hash user ID for privacy in analytics storage
 */
function hashUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `anon_${Math.abs(hash).toString(16)}`;
}

/**
 * Generate session ID
 */
function generateSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Check rate limit
 */
function checkRateLimit(userId: string, eventCount: number): boolean {
  const now = Date.now();
  const key = hashUserId(userId);
  const current = rateLimitMap.get(key);

  // Clean up expired entries
  if (current && current.resetAt < now) {
    rateLimitMap.delete(key);
  }

  const limit = rateLimitMap.get(key);

  if (!limit) {
    rateLimitMap.set(key, {
      count: eventCount,
      resetAt: now + 60000, // 1 minute window
    });
    return true;
  }

  if (limit.count + eventCount > CONFIG.maxEventsPerMinute) {
    return false;
  }

  limit.count += eventCount;
  return true;
}

/**
 * Validate event structure
 */
function validateEvent(event: AnalyticsEvent): { valid: boolean; error?: string } {
  if (!event.event_name || typeof event.event_name !== "string") {
    return { valid: false, error: "Missing or invalid event_name" };
  }

  if (event.event_name.length > 100) {
    return { valid: false, error: "event_name too long (max 100 chars)" };
  }

  if (!event.category || !EVENT_CATEGORIES.includes(event.category as EventCategory)) {
    return { valid: false, error: `Invalid category. Allowed: ${EVENT_CATEGORIES.join(", ")}` };
  }

  // Check properties size
  if (event.properties) {
    const propsString = JSON.stringify(event.properties);
    if (propsString.length > 5000) {
      return { valid: false, error: "properties too large (max 5KB)" };
    }
  }

  return { valid: true };
}

/**
 * Sanitize event properties to remove any PII
 */
function sanitizeProperties(properties?: Record<string, unknown>): Record<string, unknown> {
  if (!properties) return {};

  const sanitized: Record<string, unknown> = {};
  const piiFields = ["email", "phone", "name", "address", "ip", "user_id", "password"];

  for (const [key, value] of Object.entries(properties)) {
    const lowerKey = key.toLowerCase();

    // Skip PII fields
    if (piiFields.some((pii) => lowerKey.includes(pii))) {
      continue;
    }

    // Truncate long strings
    if (typeof value === "string" && value.length > 500) {
      sanitized[key] = value.substring(0, 500) + "...";
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// =======================
// MAIN HANDLERS
// =======================

/**
 * Track events (batch)
 */
async function handleTrackEvents(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  request: TrackEventRequest
): Promise<{ success: boolean; tracked: number; errors: string[] }> {
  const { events, device_info, session_id } = request;

  if (!events || !Array.isArray(events) || events.length === 0) {
    return { success: false, tracked: 0, errors: ["No events provided"] };
  }

  if (events.length > CONFIG.maxBatchSize) {
    return {
      success: false,
      tracked: 0,
      errors: [`Batch size exceeds limit of ${CONFIG.maxBatchSize} events`],
    };
  }

  const userIdHash = hashUserId(userId);
  const currentSessionId = session_id || generateSessionId();
  const errors: string[] = [];
  const validEvents: Record<string, unknown>[] = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const validation = validateEvent(event);

    if (!validation.valid) {
      errors.push(`Event ${i}: ${validation.error}`);
      continue;
    }

    validEvents.push({
      user_id_hash: userIdHash,
      session_id: currentSessionId,
      event_name: event.event_name,
      category: event.category,
      properties: sanitizeProperties(event.properties),
      screen_name: event.screen_name,
      duration_ms: event.duration_ms,
      device_platform: device_info?.platform,
      device_model: device_info?.device_model,
      app_version: device_info?.app_version,
      os_version: device_info?.os_version,
      locale: device_info?.locale,
      timezone: device_info?.timezone,
      created_at: event.timestamp || new Date().toISOString(),
    });
  }

  if (validEvents.length === 0) {
    return { success: false, tracked: 0, errors };
  }

  // Insert events
  const { error: insertError } = await supabase.from("analytics_events").insert(validEvents);

  if (insertError) {
    console.error("[ANALYTICS] Insert error:", insertError);
    return {
      success: false,
      tracked: 0,
      errors: [...errors, `Database error: ${insertError.message}`],
    };
  }

  // Update session info
  await supabase.rpc("update_analytics_session", {
    p_session_id: currentSessionId,
    p_user_id_hash: userIdHash,
    p_event_count: validEvents.length,
    p_screen_count: validEvents.filter((e) => e.category === "screen_view").length,
  });

  console.log(`[ANALYTICS] Tracked ${validEvents.length} events for ${userIdHash}`);

  return {
    success: true,
    tracked: validEvents.length,
    errors: errors.length > 0 ? errors : [],
  };
}

/**
 * Track conversion event
 */
async function handleTrackConversion(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  conversionEvent: ConversionEvent,
  properties?: Record<string, unknown>
): Promise<{ success: boolean; firstTime: boolean }> {
  const userIdHash = hashUserId(userId);

  // Check if this conversion was already tracked
  const { data: existing } = await supabase
    .from("analytics_conversions")
    .select("id")
    .eq("user_id_hash", userIdHash)
    .eq("conversion_event", conversionEvent)
    .single();

  const isFirstTime = !existing;

  // Insert conversion
  await supabase.from("analytics_conversions").insert({
    user_id_hash: userIdHash,
    conversion_event: conversionEvent,
    properties: sanitizeProperties(properties),
    is_first_time: isFirstTime,
    created_at: new Date().toISOString(),
  });

  // Also track as regular event
  await supabase.from("analytics_events").insert({
    user_id_hash: userIdHash,
    event_name: conversionEvent,
    category: "conversion",
    properties: { ...sanitizeProperties(properties), is_first_time: isFirstTime },
    created_at: new Date().toISOString(),
  });

  console.log(`[ANALYTICS] Conversion: ${conversionEvent} (first: ${isFirstTime})`);

  return { success: true, firstTime: isFirstTime };
}

/**
 * Get analytics summary (admin only in production)
 */
async function handleGetStats(
  supabase: ReturnType<typeof createClient>,
  period: "day" | "week" | "month" = "week"
): Promise<AnalyticsStats> {
  const periodDays = period === "day" ? 1 : period === "week" ? 7 : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);
  const startDateStr = startDate.toISOString();

  // Get basic stats
  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_name, category, user_id_hash, screen_name")
    .gte("created_at", startDateStr);

  const { data: sessions } = await supabase
    .from("analytics_sessions")
    .select("duration_seconds")
    .gte("started_at", startDateStr);

  if (!events) {
    return {
      period,
      total_events: 0,
      unique_users: 0,
      total_sessions: 0,
      avg_session_duration: 0,
      top_screens: [],
      top_events: [],
      conversion_rates: [],
    };
  }

  // Calculate unique users
  const uniqueUsers = new Set(events.map((e) => e.user_id_hash)).size;

  // Calculate screen views
  const screenCounts = new Map<string, number>();
  events
    .filter((e) => e.category === "screen_view" && e.screen_name)
    .forEach((e) => {
      const count = screenCounts.get(e.screen_name!) || 0;
      screenCounts.set(e.screen_name!, count + 1);
    });

  const topScreens = Array.from(screenCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([screen, views]) => ({ screen, views }));

  // Calculate event counts
  const eventCounts = new Map<string, number>();
  events.forEach((e) => {
    const count = eventCounts.get(e.event_name) || 0;
    eventCounts.set(e.event_name, count + 1);
  });

  const topEvents = Array.from(eventCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([event, count]) => ({ event, count }));

  // Calculate session stats
  const totalSessions = sessions?.length || 0;
  const avgSessionDuration =
    sessions && sessions.length > 0
      ? sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length
      : 0;

  // Get conversion rates
  const { data: conversions } = await supabase
    .from("analytics_conversions")
    .select("conversion_event, is_first_time")
    .gte("created_at", startDateStr);

  const conversionCounts = new Map<string, number>();
  conversions?.forEach((c) => {
    if (c.is_first_time) {
      const count = conversionCounts.get(c.conversion_event) || 0;
      conversionCounts.set(c.conversion_event, count + 1);
    }
  });

  const conversionRates = CONVERSION_EVENTS.map((event) => ({
    event,
    rate: uniqueUsers > 0 ? ((conversionCounts.get(event) || 0) / uniqueUsers) * 100 : 0,
  })).filter((c) => c.rate > 0);

  return {
    period,
    total_events: events.length,
    unique_users: uniqueUsers,
    total_sessions: totalSessions,
    avg_session_duration: Math.round(avgSessionDuration),
    top_screens: topScreens,
    top_events: topEvents,
    conversion_rates: conversionRates,
  };
}

// =======================
// MAIN HANDLER
// =======================

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop() || "";

  // CORS preflight
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Routes that don't require auth (for anonymous tracking)
    if (path === "track" && req.method === "POST") {
      // For track endpoint, auth is optional (supports anonymous users)
      const authHeader = req.headers.get("Authorization");
      let userId = `anonymous_${Date.now()}`;

      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const {
          data: { user },
        } = await supabaseAdmin.auth.getUser(token);
        if (user) {
          userId = user.id;
        }
      }

      // Rate limiting
      const body = (await req.json()) as TrackEventRequest;
      const eventCount = body.events?.length || 0;

      if (!checkRateLimit(userId, eventCount)) {
        return jsonResponse({ error: "Rate limit exceeded", retryAfter: 60 }, 429, req);
      }

      const result = await handleTrackEvents(supabaseAdmin, userId, body);
      return jsonResponse(result, result.success ? 200 : 400, req);
    }

    // Routes that require auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing authorization header" }, 401, req);
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: "Invalid or expired token" }, 401, req);
    }

    switch (path) {
      case "conversion": {
        if (req.method !== "POST") {
          return jsonResponse({ error: "Method not allowed" }, 405, req);
        }

        const body = await req.json();
        const { event, properties } = body;

        if (!event || !CONVERSION_EVENTS.includes(event)) {
          return jsonResponse(
            { error: `Invalid conversion event. Allowed: ${CONVERSION_EVENTS.join(", ")}` },
            400,
            req
          );
        }

        const result = await handleTrackConversion(
          supabaseAdmin,
          user.id,
          event as ConversionEvent,
          properties
        );

        return jsonResponse(result, 200, req);
      }

      case "stats": {
        if (req.method !== "GET") {
          return jsonResponse({ error: "Method not allowed" }, 405, req);
        }

        // In production, you'd want to restrict this to admin users
        const period = (url.searchParams.get("period") || "week") as "day" | "week" | "month";
        const stats = await handleGetStats(supabaseAdmin, period);

        return jsonResponse(stats, 200, req);
      }

      case "session": {
        // Start new session
        if (req.method !== "POST") {
          return jsonResponse({ error: "Method not allowed" }, 405, req);
        }

        const sessionId = generateSessionId();
        const userIdHash = hashUserId(user.id);

        await supabaseAdmin.from("analytics_sessions").insert({
          session_id: sessionId,
          user_id_hash: userIdHash,
          started_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        });

        return jsonResponse({ session_id: sessionId }, 200, req);
      }

      default:
        return jsonResponse({ error: "Not found", path }, 404, req);
    }
  } catch (error) {
    console.error("[ANALYTICS] Error:", error);
    return jsonResponse(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
      req
    );
  }
});
