/**
 * Nossa Maternidade - Content Moderation Edge Function
 *
 * Automatic content moderation using OpenAI Moderation API
 *
 * Features:
 * - JWT validation (authenticated users or service key)
 * - OpenAI Moderation API integration
 * - Content classification: SAFE / FLAGGED / BLOCKED
 * - Automatic logging of all decisions
 * - Admin notifications for flagged content
 * - Rate limiting (50 requests/min)
 * - CORS restrito
 *
 * @version 1.0.0 - Initial (2025-01)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.89.0";
import { buildCorsHeaders, handlePreflight } from "../_shared/cors.ts";

// =======================
// ENV & CONFIG
// =======================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")!;

// Rate limiting
const RATE_LIMIT = {
  maxRequestsPerMinute: 50,
  windowMs: 60_000, // 1 minuto
};

// Moderation thresholds (0.0 to 1.0)
const THRESHOLDS = {
  block: 0.8, // Auto-block if any category >= 0.8
  flag: 0.5, // Flag for review if any category >= 0.5
  // Categories below 0.5 are considered safe
};

const openai = new OpenAI({ apiKey: OPENAI_KEY });

// =======================
// TYPES
// =======================

type ContentType = "post" | "comment" | "profile" | "message";
type ModerationStatus = "safe" | "flagged" | "blocked";
type ModerationAction = "published" | "quarantined" | "rejected";

interface ModerationRequest {
  content: string;
  type: ContentType;
  author_id: string;
  content_id?: string; // Optional if content already exists in DB
}

interface ModerationResult {
  status: ModerationStatus;
  reasons: string[];
  confidence: number;
  action_taken: ModerationAction;
  details?: {
    categories: Record<string, number>;
    category_scores: Record<string, number>;
  };
}

interface OpenAIModerationResponse {
  id: string;
  model: string;
  results: Array<{
    flagged: boolean;
    categories: Record<string, boolean>;
    category_scores: Record<string, number>;
  }>;
}

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// In-memory result cache (same content = same decision)
const moderationCache = new Map<string, { result: ModerationResult; expiresAt: number }>();
const CACHE_TTL_MS = 3600_000; // 1 hour

// =======================
// HELPERS
// =======================

function jsonResponse(data: unknown, status: number, requestObj: Request) {
  const headers = buildCorsHeaders(requestObj);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

function hashUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `user_${Math.abs(hash).toString(16).substring(0, 8)}`;
}

/**
 * Generate cache key from content
 */
function generateCacheKey(content: string): string {
  // Simple hash for cache key
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `content_${Math.abs(hash).toString(16)}`;
}

/**
 * Check rate limit
 */
function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  // Clean up expired entries
  if (userLimit && userLimit.resetAt < now) {
    rateLimitMap.delete(userId);
  }

  const current = rateLimitMap.get(userId);

  if (!current) {
    rateLimitMap.set(userId, {
      count: 1,
      resetAt: now + RATE_LIMIT.windowMs,
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT.maxRequestsPerMinute - 1,
      resetIn: RATE_LIMIT.windowMs,
    };
  }

  if (current.count >= RATE_LIMIT.maxRequestsPerMinute) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: current.resetAt - now,
    };
  }

  current.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT.maxRequestsPerMinute - current.count,
    resetIn: current.resetAt - now,
  };
}

// =======================
// MODERATION LOGIC
// =======================

/**
 * Call OpenAI Moderation API
 */
async function moderateContent(content: string): Promise<ModerationResult> {
  try {
    // Check cache first
    const cacheKey = generateCacheKey(content);
    const cached = moderationCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      console.log("[MODERATION] Cache hit");
      return cached.result;
    }

    // Call OpenAI Moderation API
    const response = await openai.moderations.create({
      model: "omni-moderation-latest", // Latest moderation model
      input: content,
    });

    const result = response.results[0];
    const scores = result.category_scores;

    // Find highest scoring category
    let maxScore = 0;
    const flaggedReasons: string[] = [];

    for (const [category, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
      }
      if (score >= THRESHOLDS.flag) {
        flaggedReasons.push(category);
      }
    }

    // Determine status and action
    let status: ModerationStatus;
    let action: ModerationAction;

    if (maxScore >= THRESHOLDS.block) {
      status = "blocked";
      action = "rejected";
    } else if (maxScore >= THRESHOLDS.flag) {
      status = "flagged";
      action = "quarantined";
    } else {
      status = "safe";
      action = "published";
    }

    const moderationResult: ModerationResult = {
      status,
      reasons: flaggedReasons,
      confidence: maxScore,
      action_taken: action,
      details: {
        categories: result.categories,
        category_scores: scores,
      },
    };

    // Cache result
    moderationCache.set(cacheKey, {
      result: moderationResult,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return moderationResult;
  } catch (error) {
    console.error("[MODERATION] OpenAI API error:", error);
    // On error, default to flagged for manual review
    return {
      status: "flagged",
      reasons: ["api_error"],
      confidence: 0.5,
      action_taken: "quarantined",
    };
  }
}

/**
 * Log moderation decision to database
 */
async function logModerationDecision(
  supabase: ReturnType<typeof createClient>,
  request: ModerationRequest,
  result: ModerationResult
): Promise<void> {
  try {
    await supabase.from("moderation_logs").insert({
      content_type: request.type,
      content_id: request.content_id || null,
      author_id: request.author_id,
      status: result.status,
      confidence: result.confidence,
      reasons: result.reasons,
      action_taken: result.action_taken,
      details: result.details,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[MODERATION] Failed to log decision:", error);
    // Don't throw - logging failure shouldn't block moderation
  }
}

/**
 * Notify admins for flagged content
 */
async function notifyAdmins(
  supabase: ReturnType<typeof createClient>,
  request: ModerationRequest,
  result: ModerationResult
): Promise<void> {
  try {
    // Get admin users (assuming there's an admin role or flag)
    const { data: admins } = await supabase.from("profiles").select("user_id").eq("is_admin", true);

    if (!admins || admins.length === 0) {
      console.log("[MODERATION] No admins to notify");
      return;
    }

    // Queue notification for each admin
    const notifications = admins.map((admin) => ({
      user_id: admin.user_id,
      notification_type: "moderation_alert",
      title: "Conteúdo sinalizado para revisão",
      body: `Conteúdo de ${hashUserId(request.author_id)} foi sinalizado: ${result.reasons.join(", ")}`,
      data: {
        content_id: request.content_id,
        content_type: request.type,
        author_id: request.author_id,
        status: result.status,
        reasons: result.reasons,
      },
      status: "pending",
      scheduled_for: new Date().toISOString(),
      priority: "high",
    }));

    await supabase.from("notification_queue").insert(notifications);
    console.log(`[MODERATION] Queued notifications for ${admins.length} admins`);
  } catch (error) {
    console.error("[MODERATION] Failed to notify admins:", error);
    // Don't throw - notification failure shouldn't block moderation
  }
}

/**
 * Handle moderation request
 */
async function handleModerateContent(
  supabase: ReturnType<typeof createClient>,
  request: ModerationRequest
): Promise<ModerationResult> {
  // Validate content
  if (!request.content || request.content.trim().length === 0) {
    throw new Error("Content is required");
  }

  if (request.content.length > 10000) {
    throw new Error("Content too long (max 10000 characters)");
  }

  // Moderate content
  const result = await moderateContent(request.content);

  // Log decision
  await logModerationDecision(supabase, request, result);

  // Notify admins if flagged
  if (result.status === "flagged") {
    await notifyAdmins(supabase, request, result);
  }

  console.log(
    `[MODERATION] ${request.type} by ${hashUserId(request.author_id)}: ${result.status} (${result.confidence.toFixed(2)})`
  );

  return result;
}

// =======================
// MAIN HANDLER
// =======================

Deno.serve(async (req) => {
  // CORS preflight
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  // Only allow POST
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, req);
  }

  try {
    // Authentication: JWT or service key
    const authHeader = req.headers.get("Authorization");
    const serviceKey = req.headers.get("x-service-key");

    const isServiceCall = serviceKey === SUPABASE_SERVICE_KEY;

    if (!authHeader && !isServiceCall) {
      return jsonResponse({ error: "Missing authorization" }, 401, req);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    let userId = "system";

    // Validate JWT if not service call
    if (!isServiceCall) {
      const token = authHeader!.replace("Bearer ", "");
      const {
        data: { user },
        error: authError,
      } = await supabaseAdmin.auth.getUser(token);

      if (authError || !user) {
        return jsonResponse({ error: "Invalid or expired token" }, 401, req);
      }

      userId = user.id;

      // Rate limiting for user requests (service calls are unlimited)
      const rateLimit = checkRateLimit(userId);
      if (!rateLimit.allowed) {
        return jsonResponse(
          {
            error: "Rate limit exceeded",
            retryAfter: Math.ceil(rateLimit.resetIn / 1000),
          },
          429,
          req
        );
      }
    }

    // Parse request body
    let body: ModerationRequest;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, req);
    }

    // Validate request
    if (!body.content || !body.type || !body.author_id) {
      return jsonResponse({ error: "Missing required fields: content, type, author_id" }, 400, req);
    }

    // Moderate content
    const result = await handleModerateContent(supabaseAdmin, body);

    return jsonResponse(result, 200, req);
  } catch (error) {
    console.error("[MODERATION] Error:", error);
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
