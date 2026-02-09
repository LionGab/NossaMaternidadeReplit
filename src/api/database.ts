import { SupabaseClient } from "@supabase/supabase-js";
import { Interest, PregnancyStage, UserProfile } from "../types/navigation";
import { logger } from "../utils/logger";
import {
  CommentInsert,
  Database,
  HabitInsert,
  HabitUpdate,
  PostInsert,
  UserInsert,
  UserUpdate,
  getSupabaseDiagnostics,
  supabase,
} from "./supabase";
import {
  habitSchema,
  habitUpdateSchema,
  userProfileSchema,
  userProfileUpdateSchema,
  validateWithSchema,
} from "../utils/validation";

/**
 * Type guard to ensure Supabase client is configured
 * @throws Error if Supabase is not initialized
 * @returns Typed Supabase client
 */
function checkSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    const diagnostics = getSupabaseDiagnostics();
    const errorMessage = [
      "Supabase is not configured.",
      "",
      "Missing environment variables:",
      diagnostics.url
        ? `  ✓ EXPO_PUBLIC_SUPABASE_URL: ${diagnostics.url.substring(0, 40)}...`
        : "  ✗ EXPO_PUBLIC_SUPABASE_URL: missing",
      diagnostics.hasKey
        ? "  ✓ EXPO_PUBLIC_SUPABASE_ANON_KEY: [set]"
        : "  ✗ EXPO_PUBLIC_SUPABASE_ANON_KEY: missing",
      "",
      "To fix:",
      "1. Create .env.local file in project root",
      "2. Add: EXPO_PUBLIC_SUPABASE_URL=... and EXPO_PUBLIC_SUPABASE_ANON_KEY=...",
      "3. Or configure in app.config.js → extra section",
      "4. Restart Expo dev server: npm start -- --clear",
    ].join("\n");

    logger.error("Supabase check failed", "Database", new Error(errorMessage));
    throw new Error(errorMessage);
  }
  return supabase;
}

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Create a new user profile
 *
 * @param userData - User profile data to insert
 * @returns Object with created profile data and error (if any)
 *
 * @example
 * ```ts
 * const result = await createUserProfile({
 *   id: "user-123",
 *   name: "Jane Doe",
 *   email: "jane@example.com"
 * });
 * ```
 */
export async function createUserProfile(userData: UserInsert) {
  try {
    // Validação com Zod
    const validation = validateWithSchema(userProfileSchema, userData);
    if (!validation.success) {
      const errorMessage = validation.errors.join(", ");
      logger.error("User profile validation failed", "Database", new Error(errorMessage));
      return { data: null, error: new Error(errorMessage) };
    }

    const client = checkSupabase();
    const { data, error } = await client.from("profiles").insert(userData).select().single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Create user profile error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Get user profile by ID
 *
 * @param userId - User ID to fetch profile for
 * @returns Object with user profile data (mapped to UserProfile type) and error (if any)
 *
 * @example
 * ```ts
 * const result = await getUserProfile("user-123");
 * if (result.data) {
 *   logger.info("User profile loaded", "Database", { name: result.data.name });
 * }
 * ```
 */
export async function getUserProfile(userId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client.from("profiles").select("*").eq("id", userId).single();

    if (error) throw error;

    // Map Supabase profile to UserProfile type
    if (data) {
      const mapped: UserProfile = {
        id: data.id,
        name: data.name || "",
        email: data.email || undefined,
        avatarUrl: data.avatar_url || undefined,
        stage: (data.stage as PregnancyStage) || "pregnant",
        dueDate: data.due_date || undefined,
        babyBirthDate: data.baby_birth_date || undefined,
        interests: (data.interests || []) as Interest[],
        createdAt: data.created_at || new Date().toISOString(),
        hasCompletedOnboarding: data.has_completed_onboarding || false,
      };
      return { data: mapped, error: null };
    }

    return { data: null, error: null };
  } catch (error) {
    logger.error("Get user profile error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Update user profile
 *
 * @param userId - User ID to update
 * @param updates - Partial user profile data to update
 * @returns Object with updated profile data and error (if any)
 *
 * @example
 * ```ts
 * const result = await updateUserProfile("user-123", {
 *   name: "Jane Smith",
 *   stage: "postpartum"
 * });
 * ```
 */
export async function updateUserProfile(userId: string, updates: UserUpdate) {
  try {
    // Validação com Zod
    const validation = validateWithSchema(userProfileUpdateSchema, updates);
    if (!validation.success) {
      const errorMessage = validation.errors.join(", ");
      logger.error("User profile update validation failed", "Database", new Error(errorMessage));
      return { data: null, error: new Error(errorMessage) };
    }

    const client = checkSupabase();
    const { data, error } = await client
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Update user profile error", "Database", error as Error);
    return { data: null, error };
  }
}

// ============================================
// POST OPERATIONS
// ============================================

/**
 * Create a new community post
 *
 * @param postData - Post data to insert
 * @returns Object with created post data and error (if any)
 *
 * @example
 * ```ts
 * const result = await createPost({
 *   user_id: "user-123",
 *   title: "My first post",
 *   content: "Hello community!",
 *   category: "general"
 * });
 * ```
 */
export async function createPost(postData: PostInsert) {
  try {
    const client = checkSupabase();
    const { data, error } = await client.from("community_posts").insert(postData).select().single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Create post error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Get community posts
 *
 * @param category - Optional category filter (e.g., "general", "questions")
 * @returns Object with array of posts and error (if any)
 *
 * @example
 * ```ts
 * // Get all posts
 * const allPosts = await getPosts();
 *
 * // Get posts by category
 * const questions = await getPosts("questions");
 * ```
 */
export async function getPosts(category?: string) {
  try {
    const client = checkSupabase();
    let query = client
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get posts error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Get a single community post by ID
 *
 * @param postId - Post ID to fetch
 * @returns Object with post data and error (if any)
 *
 * @example
 * ```ts
 * const result = await getPost("post-123");
 * if (result.data) {
 *   logger.info("Post loaded", "Database", { title: result.data.title });
 * }
 * ```
 */
export async function getPost(postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("community_posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get post error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Delete a community post
 *
 * @param postId - Post ID to delete
 * @returns Object with error (if any)
 *
 * @example
 * ```ts
 * const result = await deletePost("post-123");
 * if (!result.error) {
 *   logger.info("Post deleted successfully", "Database");
 * }
 * ```
 */
export async function deletePost(postId: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.from("community_posts").delete().eq("id", postId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    logger.error("Delete post error", "Database", error as Error);
    return { error };
  }
}

// ============================================
// COMMENT OPERATIONS
// ============================================

/**
 * Create a new comment on a community post
 *
 * @param commentData - Comment data to insert
 * @returns Object with created comment data and error (if any)
 *
 * @example
 * ```ts
 * const result = await createComment({
 *   user_id: "user-123",
 *   post_id: "post-456",
 *   content: "Great post!"
 * });
 * ```
 */
export async function createComment(commentData: CommentInsert) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("community_comments")
      .insert(commentData)
      .select()
      .single();

    if (error) throw error;

    // Note: increment_comments_count RPC function removed from schema
    // Comment count now managed by database triggers or application logic

    return { data, error: null };
  } catch (error) {
    logger.error("Create comment error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Get all comments for a specific post
 *
 * @param postId - Post ID to fetch comments for
 * @returns Object with array of comments and error (if any)
 *
 * @example
 * ```ts
 * const result = await getPostComments("post-123");
 * if (result.data) {
 *   logger.info("Comments loaded", "Database", { count: result.data.length });
 * }
 * ```
 */
export async function getPostComments(postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get comments error", "Database", error as Error);
    return { data: null, error };
  }
}

// ============================================
// LIKE OPERATIONS
// ============================================

/**
 * Like a community post
 *
 * @param userId - User ID who is liking the post
 * @param postId - Post ID to like
 * @returns Object with like data and error (if any)
 *
 * @example
 * ```ts
 * const result = await likePost("user-123", "post-456");
 * if (!result.error) {
 *   logger.info("Post liked successfully", "Database");
 * }
 * ```
 */
export async function likePost(userId: string, postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("post_likes")
      .insert({ user_id: userId, post_id: postId })
      .select()
      .single();

    if (error) throw error;

    // Note: increment_likes_count RPC function removed from schema
    // Like count now managed by database triggers or application logic

    return { data, error: null };
  } catch (error) {
    logger.error("Like post error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Remove a like from a community post
 *
 * @param userId - User ID who is unliking the post
 * @param postId - Post ID to unlike
 * @returns Object with error (if any)
 *
 * @example
 * ```ts
 * const result = await unlikePost("user-123", "post-456");
 * if (!result.error) {
 *   logger.info("Post unliked successfully", "Database");
 * }
 * ```
 */
export async function unlikePost(userId: string, postId: string) {
  try {
    const client = checkSupabase();
    const { error } = await client
      .from("post_likes")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) throw error;

    // Note: decrement_likes_count RPC function removed from schema
    // Like count now managed by database triggers or application logic

    return { error: null };
  } catch (error) {
    logger.error("Unlike post error", "Database", error as Error);
    return { error };
  }
}

/**
 * Check if a user has liked a specific post
 *
 * @param userId - User ID to check
 * @param postId - Post ID to check
 * @returns Object with liked boolean and error (if any)
 *
 * @example
 * ```ts
 * const result = await checkIfUserLikedPost("user-123", "post-456");
 * if (result.liked) {
 *   logger.info("User liked this post", "Database");
 * }
 * ```
 */
export async function checkIfUserLikedPost(userId: string, postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("post_likes")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return { liked: !!data, error: null };
  } catch (error) {
    logger.error("Check like error", "Database", error as Error);
    return { liked: false, error };
  }
}

// ============================================
// HABIT OPERATIONS
// ============================================

/**
 * Create a new habit
 *
 * @param habitData - Habit data to insert
 * @returns Object with created habit data and error (if any)
 *
 * @example
 * ```ts
 * const result = await createHabit({
 *   user_id: "user-123",
 *   name: "Drink water",
 *   description: "Drink 8 glasses of water daily"
 * });
 * ```
 */
export async function createHabit(habitData: HabitInsert) {
  try {
    // Validação com Zod (CRÍTICO: dados de saúde)
    const validation = validateWithSchema(habitSchema, habitData);
    if (!validation.success) {
      const errorMessage = validation.errors.join(", ");
      logger.error("Habit validation failed", "Database", new Error(errorMessage));
      return { data: null, error: new Error(errorMessage) };
    }

    const client = checkSupabase();
    const { data, error } = await client.from("habits").insert(habitData).select().single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Create habit error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Get all habits for a user
 *
 * @param userId - User ID to fetch habits for
 * @returns Object with array of habits and error (if any)
 *
 * @example
 * ```ts
 * const result = await getUserHabits("user-123");
 * if (result.data) {
 *   logger.info("Habits loaded", "Database", { count: result.data.length });
 * }
 * ```
 */
export async function getUserHabits(userId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get habits error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Update an existing habit
 *
 * @param habitId - Habit ID to update
 * @param updates - Partial habit data to update
 * @returns Object with updated habit data and error (if any)
 *
 * @example
 * ```ts
 * const result = await updateHabit("habit-123", {
 *   name: "Drink more water",
 *   description: "Drink 10 glasses daily"
 * });
 * ```
 */
export async function updateHabit(habitId: string, updates: HabitUpdate) {
  try {
    // Validação com Zod
    const validation = validateWithSchema(habitUpdateSchema, updates);
    if (!validation.success) {
      const errorMessage = validation.errors.join(", ");
      logger.error("Habit update validation failed", "Database", new Error(errorMessage));
      return { data: null, error: new Error(errorMessage) };
    }

    const client = checkSupabase();
    const { data, error } = await client
      .from("habits")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", habitId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Update habit error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Delete a habit
 *
 * @param habitId - Habit ID to delete
 * @returns Object with error (if any)
 *
 * @example
 * ```ts
 * const result = await deleteHabit("habit-123");
 * if (!result.error) {
 *   logger.info("Habit deleted successfully", "Database");
 * }
 * ```
 */
export async function deleteHabit(habitId: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.from("habits").delete().eq("id", habitId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    logger.error("Delete habit error", "Database", error as Error);
    return { error };
  }
}

/**
 * Mark a habit as completed for a specific date
 *
 * @param habitId - Habit ID to complete
 * @param userId - User ID who completed the habit
 * @param completedDate - Date string (ISO format) when habit was completed
 * @returns Object with completion data and error (if any)
 *
 * @example
 * ```ts
 * const result = await completeHabit(
 *   "habit-123",
 *   "user-123",
 *   "2025-01-06"
 * );
 * ```
 */
export async function completeHabit(habitId: string, userId: string, completedDate: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habit_completions")
      .insert({
        habit_id: habitId,
        user_id: userId,
        date: completedDate,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Complete habit error", "Database", error as Error);
    return { data: null, error };
  }
}

/**
 * Remove habit completion for a specific date
 *
 * @param habitId - Habit ID to uncomplete
 * @param completedDate - Date string (ISO format) to remove completion for
 * @returns Object with error (if any)
 *
 * @example
 * ```ts
 * const result = await uncompleteHabit("habit-123", "2025-01-06");
 * if (!result.error) {
 *   logger.info("Habit completion removed", "Database");
 * }
 * ```
 */
export async function uncompleteHabit(habitId: string, completedDate: string) {
  try {
    const client = checkSupabase();
    const { error } = await client
      .from("habit_completions")
      .delete()
      .eq("habit_id", habitId)
      .eq("date", completedDate);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    logger.error("Uncomplete habit error", "Database", error as Error);
    return { error };
  }
}

/**
 * Get all completions for a specific habit
 *
 * @param habitId - Habit ID to fetch completions for
 * @returns Object with array of completions and error (if any)
 *
 * @example
 * ```ts
 * const result = await getHabitCompletions("habit-123");
 * if (result.data) {
 *   logger.info("Habit completions loaded", "Database", { days: result.data.length });
 * }
 * ```
 */
export async function getHabitCompletions(habitId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habit_completions")
      .select("*")
      .eq("habit_id", habitId)
      .order("date", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    logger.error("Get habit completions error", "Database", error as Error);
    return { data: null, error };
  }
}
