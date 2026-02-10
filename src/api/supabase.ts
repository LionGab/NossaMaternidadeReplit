import type { Database } from "@/types/database.types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import { getEnv } from "../config/env";
import { logger } from "../utils/logger";
import { createSupabaseAuthStorage } from "./supabaseAuthStorage";

// Re-export Database type for backward compatibility
export type { Database } from "@/types/database.types";

// Re-export convenience types
export type {
  Comment,
  CommentInsert,
  CommentUpdate,
  Habit,
  HabitCompletion,
  HabitCompletionInsert,
  HabitInsert,
  HabitUpdate,
  Like,
  LikeInsert,
  Post,
  PostInsert,
  PostUpdate,
  Tables,
  TablesInsert,
  TablesUpdate,
  User,
  UserInsert,
  UserUpdate,
} from "@/types/database.types";

// CRÍTICO: Sem valores padrão hardcoded para evitar exposição de credenciais
// O app DEVE ter .env.local configurado corretamente para funcionar
const supabaseUrl = getEnv("EXPO_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY");

// Make Supabase optional - only initialize if credentials are provided
let supabase: SupabaseClient<Database> | null = null;

// Log diagnóstico de configuração (apenas em dev)
if (__DEV__) {
  logger.debug("Supabase initialization check", "Supabase", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "missing",
    keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "missing",
  });
}

// CRÍTICO: Validação rigorosa de credenciais - NUNCA usar fallbacks hardcoded
if (!supabaseUrl || !supabaseAnonKey) {
  logger.error(
    "CRITICAL: Supabase credentials missing. Configure .env.local with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY",
    "Supabase",
    new Error(`Missing credentials - URL: ${!!supabaseUrl}, KEY: ${!!supabaseAnonKey}`)
  );
  supabase = null;
} else {
  try {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        // SEGURANÇA: Storage customizado com SecureStore (chave) + MMKV (sessão criptografada)
        // Implementa compactação LGPD e migração automática do AsyncStorage
        storage: createSupabaseAuthStorage(),
        autoRefreshToken: true,
        persistSession: true,
        // CRÍTICO: No web, habilitar detectSessionInUrl para processar callbacks OAuth automaticamente
        // No native, manter false e usar fluxo manual via createSessionFromRedirect()
        detectSessionInUrl: Platform.OS === "web",
      },
    });
    logger.info("Supabase client initialized with secure storage", "Supabase", {
      url: supabaseUrl.substring(0, 40) + "...",
    });
  } catch (error) {
    logger.error("Failed to initialize Supabase client", "Supabase", error as Error);
    supabase = null;
  }
}

/**
 * Check if Supabase is configured and initialized
 * @returns true if Supabase client is available, false otherwise
 */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

/**
 * Get diagnostic information about Supabase configuration
 * Useful for debugging configuration issues
 */
export function getSupabaseDiagnostics(): {
  configured: boolean;
  url: string | undefined;
  hasKey: boolean;
  keyPreview: string | undefined;
} {
  return {
    configured: supabase !== null,
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : undefined,
  };
}

/**
 * Access a table not present in generated Database types.
 * Centralizes the single type assertion needed for untyped tables
 * (e.g. community_likes, moderation_queue) so consumer code stays clean.
 */
export function untypedFrom(client: SupabaseClient<Database>, table: string) {
  // Supabase types only allow `.from()` with tables present in the generated Database type.
  // For operational tables not modeled in `database.types.ts`, we intentionally drop typing.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (client as any).from(table);
}

export { supabase };
