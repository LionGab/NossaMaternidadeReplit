import { SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import { supabase, Database, getSupabaseDiagnostics } from "./supabase";
import { getSupabaseUrl } from "../config/env";
import { logger } from "../utils/logger";
import { signUpSchema, signInSchema, resetPasswordSchema, senhaSchema } from "../utils/validation";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

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

    logger.error("Supabase check failed", "Auth", new Error(errorMessage));
    throw new Error(errorMessage);
  }
  return supabase;
}

function getEmailRedirectUri(): string {
  if (Platform.OS === "web") {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/auth/callback`;
  }

  // Always use app scheme for native - Expo Go returns localhost which breaks magic link
  return "nossamaternidade://auth/callback";
}

/**
 * Sign up a new user with email and password
 *
 * @param email - User email address
 * @param password - User password (min 6 characters)
 * @param name - User display name
 * @returns Object with user data and error (if any)
 *
 * @example
 * ```ts
 * const result = await signUp("user@example.com", "password123", "John Doe");
 * if (result.user) {
 *   // User created successfully
 * }
 * ```
 */
export async function signUp(email: string, password: string, name: string) {
  try {
    // Validar inputs com Zod
    const validation = signUpSchema.safeParse({ email, password, name });
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      throw new Error(firstError.message);
    }

    const client = checkSupabase();
    const { data, error } = await client.auth.signUp({
      email: validation.data.email,
      password: validation.data.password,
      options: {
        data: {
          name: validation.data.name,
        },
      },
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error) {
    logger.error("Sign up error", "Auth", error as Error);
    return { user: null, error };
  }
}

/**
 * Sign in with email and password
 *
 * @param email - User email address
 * @param password - User password
 * @returns Object with user, session, and error (if any)
 *
 * @example
 * ```ts
 * const result = await signIn("user@example.com", "password123");
 * if (result.user) {
 *   // User signed in successfully
 * }
 * ```
 */
export async function signIn(email: string, password: string) {
  try {
    // Validar inputs com Zod
    const validation = signInSchema.safeParse({ email, password });
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      throw new Error(firstError.message);
    }

    const client = checkSupabase();
    const { data, error } = await client.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

    if (error) throw error;

    // Identify user in RevenueCat (with Expo Go fallback)
    if (data.user) {
      try {
        const revenuecat = await import("../services/revenuecat");
        await revenuecat.loginUser(data.user.id);
      } catch (err) {
        logger.warn("RevenueCat indisponível (provável Expo Go). Ignorando login.", "Auth", {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    logger.error("Sign in error", "Auth", error as Error);
    return { user: null, session: null, error };
  }
}

/**
 * Sign in with magic link (email OTP)
 *
 * Sends a one-time password to the user's email address.
 * User will receive an email with a link to complete authentication.
 *
 * @param email - User email address
 * @returns Object with error (if any)
 *
 * @example
 * ```ts
 * const result = await signInWithMagicLink("user@example.com");
 * if (!result.error) {
 *   // Magic link sent successfully
 * }
 * ```
 */
export async function signInWithMagicLink(email: string) {
  try {
    // Validar email com Zod
    const validation = resetPasswordSchema.safeParse({ email });
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      throw new Error(firstError.message);
    }

    const client = checkSupabase();
    const { error } = await client.auth.signInWithOtp({
      email: validation.data.email,
      options: {
        emailRedirectTo: getEmailRedirectUri(),
      },
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    logger.error("Magic link sign in error", "Auth", error as Error);
    return { error };
  }
}

/**
 * Sign out the current user
 *
 * Clears the current session and logs out from RevenueCat.
 *
 * @returns Object with error (if any)
 *
 * @example
 * ```ts
 * const result = await signOut();
 * if (!result.error) {
 *   // User signed out successfully
 * }
 * ```
 */
export async function signOut() {
  try {
    const client = checkSupabase();

    // Logout from RevenueCat first (with Expo Go fallback)
    try {
      const revenuecat = await import("../services/revenuecat");
      await revenuecat.logoutUser();
    } catch (err) {
      logger.warn("RevenueCat indisponível (provável Expo Go). Ignorando logout.", "Auth", {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    const { error } = await client.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    logger.error("Sign out error", "Auth", error as Error);
    return { error };
  }
}

/**
 * Get the current authenticated user
 *
 * @returns Object with user data and error (if any)
 *
 * @example
 * ```ts
 * const result = await getCurrentUser();
 * if (result.user) {
 *   logger.info("Current user loaded", "Auth", { email: result.user.email });
 * }
 * ```
 */
export async function getCurrentUser() {
  try {
    const client = checkSupabase();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    if (error) throw error;

    return { user, error: null };
  } catch (error) {
    logger.error("Get current user error", "Auth", error as Error);
    return { user: null, error };
  }
}

/**
 * Get the current session
 *
 * @returns Object with session data and error (if any)
 *
 * @example
 * ```ts
 * const result = await getSession();
 * if (result.session) {
 *   logger.info("Session loaded", "Auth");
 * }
 * ```
 */
export async function getSession() {
  try {
    const client = checkSupabase();
    const {
      data: { session },
      error,
    } = await client.auth.getSession();

    if (error) throw error;

    return { session, error: null };
  } catch (error) {
    logger.error("Get session error", "Auth", error as Error);
    return { session: null, error };
  }
}

/**
 * Send password reset email
 *
 * Sends a password reset link to the user's email address.
 *
 * @param email - User email address
 * @returns Object with error (if any)
 *
 * @example
 * ```ts
 * const result = await resetPassword("user@example.com");
 * if (!result.error) {
 *   // Password reset email sent
 * }
 * ```
 */
export async function resetPassword(email: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: "nossamaternidade://reset-password",
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    logger.error("Reset password error", "Auth", error as Error);
    return { error };
  }
}

/**
 * Update user password
 *
 * Updates the password for the currently authenticated user.
 *
 * @param newPassword - New password (min 6 characters)
 * @returns Object with error (if any)
 *
 * @example
 * ```ts
 * const result = await updatePassword("newPassword123");
 * if (!result.error) {
 *   // Password updated successfully
 * }
 * ```
 */
export async function updatePassword(newPassword: string) {
  try {
    // Validação de força da senha (mínimo 8 chars, maiúscula, minúscula, número, especial)
    const passwordValidation = senhaSchema.safeParse(newPassword);
    if (!passwordValidation.success) {
      const errorMessage = passwordValidation.error.issues[0]?.message || "Senha inválida";
      logger.warn("Password validation failed", "Auth", { error: errorMessage });
      return { error: new Error(errorMessage) };
    }

    const client = checkSupabase();
    const { error } = await client.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    logger.error("Update password error", "Auth", error as Error);
    return { error };
  }
}

/**
 * Listen to auth state changes
 *
 * Subscribes to authentication state changes (sign in, sign out, etc.).
 * Returns a subscription object that can be used to unsubscribe.
 *
 * @param callback - Function called when auth state changes
 * @returns Subscription object with remove() method
 *
 * @example
 * ```ts
 * const subscription = onAuthStateChange((user) => {
 *   if (user) {
 *     logger.info("User signed in", "Auth", { email: user.email });
 *   } else {
 *     logger.info("User signed out", "Auth");
 *   }
 * });
 *
 * // Later, unsubscribe
 * subscription.unsubscribe();
 * ```
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const client = checkSupabase();
  const {
    data: { subscription },
  } = client.auth.onAuthStateChange(async (event, session) => {
    // Sync RevenueCat with auth state (PR-D)
    try {
      const revenuecat = await import("../services/revenuecat");

      if (session?.user) {
        // User logged in - identify in RevenueCat
        await revenuecat.loginUser(session.user.id);
        logger.info("RevenueCat user synced on auth change", "Auth", {
          event,
          userId: session.user.id,
        });
      } else if (event === "SIGNED_OUT") {
        // User logged out - reset RevenueCat
        await revenuecat.logoutUser();
        logger.info("RevenueCat user logged out on auth change", "Auth");
      }
    } catch (err) {
      logger.warn("RevenueCat sync failed on auth change", "Auth", {
        error: err instanceof Error ? err.message : String(err),
        event,
      });
    }

    // Continue with original callback
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.user_metadata?.name,
      });
    } else {
      callback(null);
    }
  });

  return subscription;
}

// =======================
// ACCOUNT DELETION (LGPD)
// =======================

export interface DeleteAccountResult {
  success: boolean;
  message?: string;
  deletedTables?: string[];
  error?: string;
}

/**
 * Permanently delete user account and all associated data
 * Calls the delete-account Edge Function
 *
 * @param reason - Optional reason for deletion (for analytics)
 * @returns Result object with success status
 *
 * @example
 * const result = await deleteAccount("Não uso mais o app");
 * if (result.success) {
 *   // Redirect to login
 * }
 */
export async function deleteAccount(reason?: string): Promise<DeleteAccountResult> {
  try {
    const client = checkSupabase();

    // Get current session for auth token
    const {
      data: { session },
      error: sessionError,
    } = await client.auth.getSession();

    if (sessionError || !session) {
      return {
        success: false,
        error: "Você precisa estar logado para deletar sua conta",
      };
    }

    // Get Supabase URL from env
    const supabaseUrl = getSupabaseUrl();
    if (!supabaseUrl) {
      return {
        success: false,
        error: "Supabase não está configurado",
      };
    }

    // Call Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        confirmation: "DELETE",
        reason,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error("Delete account failed", "Auth", new Error(data.error || "Unknown error"));
      return {
        success: false,
        error: data.error || "Falha ao deletar conta",
      };
    }

    // Logout from RevenueCat (with Expo Go fallback)
    try {
      const revenuecat = await import("../services/revenuecat");
      await revenuecat.logoutUser();
    } catch (err) {
      logger.warn("RevenueCat indisponível. Ignorando logout.", "Auth", {
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // Clear local session
    await client.auth.signOut();

    logger.info("Account deleted successfully", "Auth", {
      deletedTables: data.deletedTables,
    });

    return {
      success: true,
      message: data.message,
      deletedTables: data.deletedTables,
    };
  } catch (error) {
    logger.error("Delete account error", "Auth", error as Error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
