/**
 * useAuth Hook - Centralized Authentication
 *
 * Hook unificado para gerenciar autenticação no app
 * Integra Supabase Auth + RevenueCat + estado reativo
 *
 * @module hooks/useAuth
 */

import { useEffect, useState, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/api/supabase";
import * as authApi from "@/api/auth";
import * as socialAuthApi from "@/api/social-auth";
import { logger } from "@/utils/logger";
import { isExpoGo } from "@/utils/expo";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface UseAuthReturn {
  // State
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Methods
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithApple: () => Promise<{ error: Error | null }>;
  refresh: () => Promise<void>;
}

const CONTEXT = "useAuth";

/**
 * Hook centralizado de autenticação
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, signIn, signOut } = useAuth();
 *
 * if (!isAuthenticated) {
 *   return <LoginScreen onSignIn={signIn} />;
 * }
 *
 * return <MainApp user={user} />;
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = user !== null && session !== null;

  /**
   * Map Supabase User to AuthUser
   */
  const mapUser = useCallback((supabaseUser: User | null): AuthUser | null => {
    if (!supabaseUser) return null;

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name,
    };
  }, []);

  /**
   * Refresh auth state from Supabase
   */
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!supabase) {
        logger.warn("Supabase not initialized", CONTEXT);
        setUser(null);
        setSession(null);
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        logger.error("Failed to get session", CONTEXT, sessionError);
        setUser(null);
        setSession(null);
        return;
      }

      if (sessionData.session) {
        setSession(sessionData.session);
        setUser(mapUser(sessionData.session.user));
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      logger.error("Unexpected error refreshing auth", CONTEXT, error as Error);
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [mapUser]);

  /**
   * Initialize auth state and subscribe to changes
   */
  useEffect(() => {
    // Initial load
    refresh().catch((error) => {
      logger.error("Failed to refresh auth on mount", CONTEXT, error as Error);
    });

    // Subscribe to auth state changes
    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      logger.info("Auth state changed", CONTEXT, { event });

      if (newSession) {
        setSession(newSession);
        setUser(mapUser(newSession.user));

        // Sync RevenueCat on login
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          try {
            if (!isExpoGo()) {
              const revenuecat = await import("@/services/revenuecat");
              await revenuecat.loginUser(newSession.user.id);
            }
          } catch (err) {
            logger.warn("RevenueCat sync failed", CONTEXT, {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
      } else {
        setSession(null);
        setUser(null);

        // Sync RevenueCat on logout
        if (event === "SIGNED_OUT") {
          try {
            if (!isExpoGo()) {
              const revenuecat = await import("@/services/revenuecat");
              await revenuecat.logoutUser();
            }
          } catch (err) {
            logger.warn("RevenueCat logout failed", CONTEXT, {
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refresh, mapUser]);

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: Error | null }> => {
      try {
        setIsLoading(true);
        const result = await authApi.signIn(email, password);

        if (result.error) {
          return { error: result.error as Error };
        }

        // State will be updated by auth state change listener
        return { error: null };
      } catch (error) {
        logger.error("Sign in failed", CONTEXT, error as Error);
        return { error: error as Error };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(
    async (email: string, password: string, name: string): Promise<{ error: Error | null }> => {
      try {
        setIsLoading(true);
        const result = await authApi.signUp(email, password, name);

        if (result.error) {
          return { error: result.error as Error };
        }

        // State will be updated by auth state change listener
        return { error: null };
      } catch (error) {
        logger.error("Sign up failed", CONTEXT, error as Error);
        return { error: error as Error };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Sign out
   */
  const signOut = useCallback(async (): Promise<{ error: Error | null }> => {
    try {
      setIsLoading(true);
      const result = await authApi.signOut();

      if (result.error) {
        return { error: result.error as Error };
      }

      // State will be updated by auth state change listener
      return { error: null };
    } catch (error) {
      logger.error("Sign out failed", CONTEXT, error as Error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign in with Google
   */
  const signInWithGoogle = useCallback(async (): Promise<{ error: Error | null }> => {
    try {
      setIsLoading(true);
      const result = await socialAuthApi.signInWithGoogle();

      if (!result.success) {
        return { error: new Error(result.error || "Google sign in failed") };
      }

      // State will be updated by auth state change listener
      return { error: null };
    } catch (error) {
      logger.error("Google sign in failed", CONTEXT, error as Error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign in with Apple
   */
  const signInWithApple = useCallback(async (): Promise<{ error: Error | null }> => {
    try {
      setIsLoading(true);
      const result = await socialAuthApi.signInWithApple();

      if (!result.success) {
        return { error: new Error(result.error || "Apple sign in failed") };
      }

      // State will be updated by auth state change listener
      return { error: null };
    } catch (error) {
      logger.error("Apple sign in failed", CONTEXT, error as Error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    user,
    session,
    isLoading,
    isAuthenticated,

    // Methods
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
    refresh,
  };
}
