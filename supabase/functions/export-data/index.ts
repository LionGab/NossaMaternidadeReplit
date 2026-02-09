/**
 * Nossa Maternidade - Export Data Edge Function
 *
 * GDPR-compliant data export for users
 *
 * ENDPOINT:
 * - POST /export-data - Export all user data to JSON
 *
 * Features:
 * - JWT validation (only own data)
 * - Comprehensive data collection from all tables
 * - Structured JSON output
 * - Storage upload for large exports
 * - Privacy-safe (no other users' data)
 * - Anonymization of references
 *
 * @version 1.0.0
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, handlePreflight } from "../_shared/cors.ts";

// =======================
// ENV & CONFIG
// =======================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const MAX_INLINE_SIZE = 1_000_000; // 1MB - return inline if smaller

// =======================
// TYPES
// =======================

interface UserExportData {
  exported_at: string;
  export_version: string;
  user_id: string;
  data: {
    profile: unknown;
    posts?: unknown[];
    comments?: unknown[];
    post_likes?: unknown[];
    comment_likes?: unknown[];
    habits?: unknown[];
    habit_completions?: unknown[];
    daily_check_ins?: unknown[];
    cycle_logs?: unknown[];
    affirmations_favorites?: unknown[];
    chat_messages?: unknown[];
    notification_preferences?: unknown;
    push_tokens?: unknown[];
    notification_history?: unknown[];
    transactions?: unknown[];
    subscription_events?: unknown[];
    audit_logs?: unknown[];
    group_memberships?: unknown[];
  };
  metadata: {
    total_size_bytes: number;
    collection_time_ms: number;
    table_counts: Record<string, number>;
  };
}

// =======================
// HELPERS
// =======================

function jsonResponse(data: unknown, status = 200, requestObj?: Request): Response {
  const headers = requestObj ? buildCorsHeaders(requestObj) : new Headers();
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

function hashUserId(userId: string): string {
  return `user_${userId.substring(0, 8)}`;
}

/**
 * Generate a unique request ID for tracking
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `req_${timestamp}_${randomStr}`;
}

// =======================
// DATA COLLECTION
// =======================

/**
 * Export all user data from all tables
 */
async function exportUserData(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<UserExportData> {
  const startTime = Date.now();
  const exportData: UserExportData = {
    exported_at: new Date().toISOString(),
    export_version: "1.0.0",
    user_id: userId,
    data: {},
    metadata: {
      total_size_bytes: 0,
      collection_time_ms: 0,
      table_counts: {},
    },
  };

  console.log(`[EXPORT] Starting data export for ${hashUserId(userId)}`);

  try {
    // 1. Profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (profile) {
      exportData.data.profile = profile;
      exportData.metadata.table_counts.profile = 1;
    }

    // 2. Community Posts
    const { data: posts } = await supabase
      .from("community_posts")
      .select("*")
      .eq("author_id", userId)
      .order("created_at", { ascending: false });

    if (posts && posts.length > 0) {
      exportData.data.posts = posts;
      exportData.metadata.table_counts.posts = posts.length;
    }

    // 3. Comments
    const { data: comments } = await supabase
      .from("community_comments")
      .select("*")
      .eq("author_id", userId)
      .order("created_at", { ascending: false });

    if (comments && comments.length > 0) {
      exportData.data.comments = comments;
      exportData.metadata.table_counts.comments = comments.length;
    }

    // 4. Post Likes
    const { data: postLikes } = await supabase
      .from("post_likes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (postLikes && postLikes.length > 0) {
      exportData.data.post_likes = postLikes;
      exportData.metadata.table_counts.post_likes = postLikes.length;
    }

    // 5. Comment Likes
    const { data: commentLikes } = await supabase
      .from("comment_likes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (commentLikes && commentLikes.length > 0) {
      exportData.data.comment_likes = commentLikes;
      exportData.metadata.table_counts.comment_likes = commentLikes.length;
    }

    // 6. Habits
    const { data: habits } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (habits && habits.length > 0) {
      exportData.data.habits = habits;
      exportData.metadata.table_counts.habits = habits.length;
    }

    // 7. Habit Completions
    const { data: habitCompletions } = await supabase
      .from("habit_completions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (habitCompletions && habitCompletions.length > 0) {
      exportData.data.habit_completions = habitCompletions;
      exportData.metadata.table_counts.habit_completions = habitCompletions.length;
    }

    // 8. Daily Check-ins
    const { data: checkIns } = await supabase
      .from("daily_check_ins")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (checkIns && checkIns.length > 0) {
      exportData.data.daily_check_ins = checkIns;
      exportData.metadata.table_counts.daily_check_ins = checkIns.length;
    }

    // 9. Cycle Logs
    const { data: cycleLogs } = await supabase
      .from("cycle_logs")
      .select("*")
      .eq("user_id", userId)
      .order("log_date", { ascending: false });

    if (cycleLogs && cycleLogs.length > 0) {
      exportData.data.cycle_logs = cycleLogs;
      exportData.metadata.table_counts.cycle_logs = cycleLogs.length;
    }

    // 10. Affirmations Favorites
    const { data: affirmationsFavorites } = await supabase
      .from("affirmations_favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (affirmationsFavorites && affirmationsFavorites.length > 0) {
      exportData.data.affirmations_favorites = affirmationsFavorites;
      exportData.metadata.table_counts.affirmations_favorites = affirmationsFavorites.length;
    }

    // 11. Chat Messages (if table exists)
    const { data: chatMessages } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (chatMessages && chatMessages.length > 0) {
      exportData.data.chat_messages = chatMessages;
      exportData.metadata.table_counts.chat_messages = chatMessages.length;
    }

    // 12. Notification Preferences
    const { data: notificationPrefs } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (notificationPrefs) {
      exportData.data.notification_preferences = notificationPrefs;
      exportData.metadata.table_counts.notification_preferences = 1;
    }

    // 13. Push Tokens
    const { data: pushTokens } = await supabase
      .from("push_tokens")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (pushTokens && pushTokens.length > 0) {
      exportData.data.push_tokens = pushTokens;
      exportData.metadata.table_counts.push_tokens = pushTokens.length;
    }

    // 14. Notification History
    const { data: notificationHistory } = await supabase
      .from("notification_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1000); // Limit to last 1000

    if (notificationHistory && notificationHistory.length > 0) {
      exportData.data.notification_history = notificationHistory;
      exportData.metadata.table_counts.notification_history = notificationHistory.length;
    }

    // 15. Transactions (premium subscription)
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("occurred_at", { ascending: false });

    if (transactions && transactions.length > 0) {
      exportData.data.transactions = transactions;
      exportData.metadata.table_counts.transactions = transactions.length;
    }

    // 16. Subscription Events
    const { data: subscriptionEvents } = await supabase
      .from("subscription_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (subscriptionEvents && subscriptionEvents.length > 0) {
      exportData.data.subscription_events = subscriptionEvents;
      exportData.metadata.table_counts.subscription_events = subscriptionEvents.length;
    }

    // 17. Audit Logs
    const { data: auditLogs } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1000); // Limit to last 1000

    if (auditLogs && auditLogs.length > 0) {
      exportData.data.audit_logs = auditLogs;
      exportData.metadata.table_counts.audit_logs = auditLogs.length;
    }

    // 18. Group Memberships
    const { data: groupMemberships } = await supabase
      .from("group_members")
      .select(
        `
        *,
        community_groups (
          id,
          name,
          description,
          category
        )
      `
      )
      .eq("user_id", userId);

    if (groupMemberships && groupMemberships.length > 0) {
      exportData.data.group_memberships = groupMemberships;
      exportData.metadata.table_counts.group_memberships = groupMemberships.length;
    }

    // Calculate metadata
    const exportJson = JSON.stringify(exportData);
    exportData.metadata.total_size_bytes = new TextEncoder().encode(exportJson).length;
    exportData.metadata.collection_time_ms = Date.now() - startTime;

    console.log(
      `[EXPORT] Data collection complete for ${hashUserId(userId)}: ${
        exportData.metadata.total_size_bytes
      } bytes in ${exportData.metadata.collection_time_ms}ms`
    );

    return exportData;
  } catch (error) {
    console.error(`[EXPORT] Error collecting data for ${hashUserId(userId)}:`, error);
    throw error;
  }
}

/**
 * Upload export data to storage bucket
 */
async function uploadToStorage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  data: UserExportData
): Promise<string> {
  const fileName = `export_${userId}_${Date.now()}.json`;
  const bucket = "user-exports";

  // Ensure bucket exists (should be created in migration)
  const { error: bucketError } = await supabase.storage.getBucket(bucket);

  if (bucketError && bucketError.message.includes("not found")) {
    console.log("[EXPORT] Creating user-exports bucket");
    await supabase.storage.createBucket(bucket, {
      public: false,
      fileSizeLimit: 10_000_000, // 10MB
    });
  }

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, JSON.stringify(data, null, 2), {
      contentType: "application/json",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload to storage: ${uploadError.message}`);
  }

  // Get signed URL (expires in 7 days)
  const { data: signedUrl, error: urlError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(fileName, 7 * 24 * 60 * 60); // 7 days

  if (urlError || !signedUrl) {
    throw new Error(`Failed to create signed URL: ${urlError?.message}`);
  }

  console.log(`[EXPORT] Uploaded to storage: ${fileName}`);

  return signedUrl.signedUrl;
}

// =======================
// MAIN HANDLER
// =======================

Deno.serve(async (req: Request) => {
  const requestId = generateRequestId();

  console.log(`[EXPORT] ${requestId} ${req.method} ${req.url}`);

  // CORS preflight
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  // Only allow POST
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, req);
  }

  try {
    // Verify JWT and get user ID
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return jsonResponse({ error: "Missing or invalid authorization header" }, 401, req);
    }

    const token = authHeader.replace("Bearer ", "");

    // Create Supabase client with user's token
    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Verify user
    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser(token);

    if (authError || !user) {
      console.error(`[EXPORT] ${requestId} Auth error:`, authError);
      return jsonResponse({ error: "Unauthorized" }, 401, req);
    }

    const userId = user.id;
    console.log(`[EXPORT] ${requestId} Exporting data for ${hashUserId(userId)}`);

    // Create service role client for data access
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Export all user data
    const exportData = await exportUserData(supabaseAdmin, userId);

    // Check size and decide inline vs storage
    if (exportData.metadata.total_size_bytes <= MAX_INLINE_SIZE) {
      // Return inline
      console.log(
        `[EXPORT] ${requestId} Returning inline (${exportData.metadata.total_size_bytes} bytes)`
      );
      return jsonResponse(
        {
          success: true,
          delivery_method: "inline",
          data: exportData,
        },
        200,
        req
      );
    } else {
      // Upload to storage and return URL
      const downloadUrl = await uploadToStorage(supabaseAdmin, userId, exportData);

      console.log(`[EXPORT] ${requestId} Uploaded to storage, URL expires in 7 days`);

      return jsonResponse(
        {
          success: true,
          delivery_method: "storage",
          download_url: downloadUrl,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: exportData.metadata,
        },
        200,
        req
      );
    }
  } catch (error) {
    console.error(`[EXPORT] ${requestId} Error:`, error);

    return jsonResponse(
      {
        error: "Data export failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
      req
    );
  }
});
