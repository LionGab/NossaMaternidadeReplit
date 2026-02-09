/**
 * Cycle Service - Cloud Sync para Ciclo Menstrual
 *
 * Sincronização bidirecional entre AsyncStorage local e Supabase
 * Estratégia: Offline-first com merge inteligente
 *
 * @module api/cycle-service
 */

import { supabase, type Database } from "./supabase";
import { logger } from "@/utils/logger";
import type { DailyLog } from "@/types/navigation";

// Type helper for Supabase insert compatibility
type DailyLogInsert = Database["public"]["Tables"]["daily_logs"]["Insert"];

// ============================================
// Types
// ============================================

export interface CycleSettings {
  id?: string;
  user_id?: string;
  cycle_length: number;
  period_length: number;
  last_period_start: string | null;
  updated_at?: string | null;
  created_at?: string | null;
}

export interface DailyLogDB {
  id: string;
  user_id: string;
  date: string;
  temperature?: number | null;
  sleep_hours?: number | null;
  water_ml?: number | null;
  exercise_minutes?: number | null;
  sex_activity?: "protected" | "unprotected" | "none" | null;
  symptoms?: string[] | null;
  moods?: string[] | null;
  discharge?: "none" | "light" | "medium" | "heavy" | "egg_white" | null;
  notes?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
}

// ============================================
// Cycle Settings API
// ============================================

/**
 * Busca configurações do ciclo do usuário
 */
export async function fetchCycleSettings(): Promise<{
  data: CycleSettings | null;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    const { data, error } = await supabase
      .from("cycle_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      // Se não existir configuração, retornar null (não é erro)
      if (error.code === "PGRST116") {
        logger.info("No cycle settings found - will create on first update", "cycle-service");
        return { data: null, error: null };
      }

      logger.error("Failed to fetch cycle settings", "cycle-service", error);
      return { data: null, error: new Error(error.message) };
    }

    logger.info("Cycle settings fetched successfully", "cycle-service");
    return {
      data: {
        id: data.id,
        user_id: data.user_id,
        cycle_length: data.cycle_length || 28,
        period_length: data.period_length || 5,
        last_period_start: data.last_period_start,
        updated_at: data.updated_at,
        created_at: data.created_at,
      },
      error: null,
    };
  } catch (error) {
    logger.error("Unexpected error fetching cycle settings", "cycle-service", error as Error);
    return { data: null, error: error as Error };
  }
}

/**
 * Salva/atualiza configurações do ciclo
 */
export async function saveCycleSettings(
  settings: Omit<CycleSettings, "id" | "user_id" | "created_at" | "updated_at">
): Promise<{
  data: CycleSettings | null;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    // Upsert - insere se não existir, atualiza se existir
    const { data, error } = await supabase
      .from("cycle_settings")
      .upsert({
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error("Failed to save cycle settings", "cycle-service", error);
      return { data: null, error: new Error(error.message) };
    }

    logger.info("Cycle settings saved successfully", "cycle-service");
    return {
      data: {
        id: data.id,
        user_id: data.user_id,
        cycle_length: data.cycle_length || 28,
        period_length: data.period_length || 5,
        last_period_start: data.last_period_start,
        updated_at: data.updated_at,
        created_at: data.created_at,
      },
      error: null,
    };
  } catch (error) {
    logger.error("Unexpected error saving cycle settings", "cycle-service", error as Error);
    return { data: null, error: error as Error };
  }
}

// ============================================
// Daily Logs API
// ============================================

/**
 * Busca daily logs do usuário (últimos N dias)
 */
export async function fetchDailyLogs(days: number = 90): Promise<{
  data: DailyLogDB[] | null;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("daily_logs")
      .select(
        "id, user_id, date, temperature, sleep_hours, water_ml, exercise_minutes, sex_activity, symptoms, moods, discharge, notes, updated_at, created_at"
      )
      .eq("user_id", user.id)
      .gte("date", sinceStr)
      .order("date", { ascending: false });

    if (error) {
      logger.error("Failed to fetch daily logs", "cycle-service", error);
      return { data: null, error: new Error(error.message) };
    }

    logger.info(`Fetched ${data?.length || 0} daily logs`, "cycle-service");
    return { data: data as DailyLogDB[], error: null };
  } catch (error) {
    logger.error("Unexpected error fetching daily logs", "cycle-service", error as Error);
    return { data: null, error: error as Error };
  }
}

/**
 * Salva/atualiza daily log
 */
export async function saveDailyLog(
  log: Omit<DailyLogDB, "user_id" | "created_at" | "updated_at">
): Promise<{
  data: DailyLogDB | null;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    // Upsert usando id ou (user_id + date) como unique constraint
    const payload = {
      ...log,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("daily_logs")
      .upsert(payload as DailyLogInsert)
      .select(
        "id, user_id, date, temperature, sleep_hours, water_ml, exercise_minutes, sex_activity, symptoms, moods, discharge, notes, updated_at, created_at"
      )
      .single();

    if (error) {
      logger.error("Failed to save daily log", "cycle-service", error, { date: log.date });
      return { data: null, error: new Error(error.message) };
    }

    logger.info("Daily log saved successfully", "cycle-service", { date: log.date });
    return { data: data as DailyLogDB, error: null };
  } catch (error) {
    logger.error("Unexpected error saving daily log", "cycle-service", error as Error);
    return { data: null, error: error as Error };
  }
}

/**
 * Deleta daily log
 */
export async function deleteDailyLog(logId: string): Promise<{
  data: boolean;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: false, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: false, error: new Error("User not authenticated") };
    }

    const { error } = await supabase
      .from("daily_logs")
      .delete()
      .eq("id", logId)
      .eq("user_id", user.id); // Garante que só deleta do próprio usuário

    if (error) {
      logger.error("Failed to delete daily log", "cycle-service", error, { logId });
      return { data: false, error: new Error(error.message) };
    }

    logger.info("Daily log deleted successfully", "cycle-service", { logId });
    return { data: true, error: null };
  } catch (error) {
    logger.error("Unexpected error deleting daily log", "cycle-service", error as Error);
    return { data: false, error: error as Error };
  }
}

// ============================================
// Batch Sync API
// ============================================

/**
 * Salva múltiplos daily logs de uma vez (batch upsert)
 * Usado para sync inicial ou offline sync
 */
export async function batchSaveDailyLogs(
  logs: Omit<DailyLogDB, "user_id" | "created_at" | "updated_at">[]
): Promise<{
  data: DailyLogDB[] | null;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    if (logs.length === 0) {
      return { data: [], error: null };
    }

    const logsWithUserId = logs.map((log) => ({
      ...log,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("daily_logs")
      .upsert(logsWithUserId as DailyLogInsert[])
      .select(
        "id, user_id, date, temperature, sleep_hours, water_ml, exercise_minutes, sex_activity, symptoms, moods, discharge, notes, updated_at, created_at"
      );

    if (error) {
      logger.error("Failed to batch save daily logs", "cycle-service", error, {
        count: logs.length,
      });
      return { data: null, error: new Error(error.message) };
    }

    logger.info(`Batch saved ${data?.length || 0} daily logs`, "cycle-service");
    return { data: data as DailyLogDB[], error: null };
  } catch (error) {
    logger.error("Unexpected error batch saving daily logs", "cycle-service", error as Error);
    return { data: null, error: error as Error };
  }
}

// ============================================
// Sync Helpers
// ============================================

/**
 * Mapeia DailyLog do client para DailyLogDB
 */
export function mapDailyLogToDB(
  log: DailyLog
): Omit<DailyLogDB, "user_id" | "created_at" | "updated_at"> {
  return {
    id: log.id,
    date: log.date,
    temperature: log.temperature ?? null,
    sleep_hours: log.sleep ?? null,
    water_ml: log.water ?? null,
    exercise_minutes: log.exercise ? 30 : null, // Assumir 30min se marcou
    sex_activity: log.sexActivity ?? null,
    symptoms: log.symptoms ?? null,
    moods: log.mood ?? null,
    discharge: (log.discharge as DailyLogDB["discharge"]) ?? null,
    notes: log.notes ?? null,
  };
}

/**
 * Mapeia DailyLogDB para DailyLog do client
 */
export function mapDailyLogFromDB(log: DailyLogDB): DailyLog {
  return {
    id: log.id,
    date: log.date,
    temperature: log.temperature ?? undefined,
    sleep: log.sleep_hours ?? undefined,
    water: log.water_ml ?? undefined,
    exercise: (log.exercise_minutes ?? 0) > 0,
    sexActivity: log.sex_activity ?? undefined,
    symptoms: log.symptoms ?? [],
    mood: log.moods ?? [],
    discharge: log.discharge as DailyLog["discharge"],
    notes: log.notes ?? undefined,
  };
}
