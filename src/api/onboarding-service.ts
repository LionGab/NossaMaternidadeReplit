/**
 * Onboarding Service
 * Integração real com Supabase para tabela user_onboarding
 */

import {
  EmotionalState,
  OnboardingConcern,
  OnboardingStage,
} from "../types/nath-journey-onboarding.types";
import { logger } from "../utils/logger";
import { supabase } from "./supabase";

/**
 * Valid stage values that match database constraint
 */
const VALID_STAGES: readonly OnboardingStage[] = [
  "GENERAL",
  "TENTANTE",
  "GRAVIDA_T1",
  "GRAVIDA_T2",
  "GRAVIDA_T3",
  "PUERPERIO_0_40D",
  "MAE_RECENTE_ATE_1ANO",
] as const;

/**
 * Valid emotional state values that match database constraint
 */
const VALID_EMOTIONAL_STATES: readonly EmotionalState[] = [
  "BEM_EQUILIBRADA",
  "UM_POUCO_ANSIOSA",
  "MUITO_ANSIOSA",
  "TRISTE_ESGOTADA",
  "PREFIRO_NAO_RESPONDER",
] as const;

/**
 * Validate stage value against database constraint
 */
function isValidStage(stage: unknown): stage is OnboardingStage {
  return typeof stage === "string" && VALID_STAGES.includes(stage as OnboardingStage);
}

/**
 * Validate emotional state value against database constraint
 */
function isValidEmotionalState(state: unknown): state is EmotionalState {
  return typeof state === "string" && VALID_EMOTIONAL_STATES.includes(state as EmotionalState);
}

export interface OnboardingData {
  stage: OnboardingStage;
  date?: string | null;
  concerns: OnboardingConcern[];
  emotionalState?: EmotionalState | null;
  dailyCheckIn?: boolean;
  checkInTime?: string | null;
  seasonName?: string | null;
  needsExtraCare?: boolean;
}

/**
 * Map stage to date field name
 * Maternidade-first: GENERAL e TENTANTE não usam data
 */
function getDateFieldForStage(stage: OnboardingStage): "due_date" | "birth_date" | null {
  // GENERAL e TENTANTE não usam campo de data (maternidade-first)
  if (stage === "GENERAL" || stage === "TENTANTE") {
    return null;
  }
  if (stage.startsWith("GRAVIDA")) {
    return "due_date";
  }
  if (stage === "PUERPERIO_0_40D" || stage === "MAE_RECENTE_ATE_1ANO") {
    return "birth_date";
  }
  return null;
}

/**
 * Check if user is a founder (completed onboarding during launch window: Jan 6-8, 2026)
 */
function checkIsFounder(): boolean {
  const now = new Date();
  const launchStart = new Date("2026-01-06T00:00:00");
  const launchEnd = new Date("2026-01-08T23:59:59");
  return now >= launchStart && now <= launchEnd;
}

/**
 * Save onboarding data to Supabase
 */
export async function saveOnboardingData(
  userId: string,
  data: OnboardingData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) {
      logger.warn("Supabase not configured, skipping save", "OnboardingService");
      return { success: true };
    }

    // Validate stage before sending to database
    if (!isValidStage(data.stage)) {
      const errorMsg = `Invalid stage value: "${data.stage}". Valid values: ${VALID_STAGES.join(", ")}`;
      logger.error("Invalid stage in onboarding data", "OnboardingService", new Error(errorMsg), {
        providedStage: data.stage,
        stageType: typeof data.stage,
        validStages: VALID_STAGES,
      });
      return { success: false, error: errorMsg };
    }

    // Additional safety check: ensure stage is not null before proceeding
    if (data.stage === null || data.stage === undefined) {
      const errorMsg = "Stage cannot be null or undefined";
      logger.error("Stage is null/undefined", "OnboardingService", new Error(errorMsg), {
        stage: data.stage,
        stageType: typeof data.stage,
      });
      return { success: false, error: errorMsg };
    }

    // Validate emotional state if provided
    if (data.emotionalState && !isValidEmotionalState(data.emotionalState)) {
      logger.warn("Invalid emotional state, using default", "OnboardingService", {
        provided: data.emotionalState,
      });
      data.emotionalState = "PREFIRO_NAO_RESPONDER";
    }

    // Build the date field based on stage (null for GENERAL)
    const dateField = getDateFieldForStage(data.stage);
    const dateValue = data.date ? new Date(data.date).toISOString().split("T")[0] : null;

    // Build insert/upsert payload with base fields
    // Maternidade-first: não usa last_menstruation
    const basePayload = {
      user_id: userId,
      stage: data.stage,
      concerns: data.concerns,
      emotional_state: data.emotionalState || "PREFIRO_NAO_RESPONDER",
      daily_check_in: data.dailyCheckIn ?? false,
      check_in_time: data.checkInTime || null,
      season_name: data.seasonName || "Minha Jornada",
      needs_extra_care: data.needsExtraCare ?? false,
      is_founder: checkIsFounder(),
      completed_at: new Date().toISOString(),
      // Initialize date fields as null (GENERAL/TENTANTE case)
      due_date: null as string | null,
      birth_date: null as string | null,
    };

    // Adiciona campo de data apenas para GRAVIDA e MAE
    if (dateField && dateValue) {
      basePayload[dateField] = dateValue;
    }

    logger.info("Saving onboarding data", "OnboardingService", {
      userId,
      stage: data.stage,
      stageType: typeof data.stage,
      payloadStage: basePayload.stage,
      payloadKeys: Object.keys(basePayload),
    });

    // Upsert to handle both insert and update (user can only have one onboarding)
    const { error } = await supabase
      .from("user_onboarding")
      .upsert(basePayload, { onConflict: "user_id" });

    if (error) {
      logger.error("Failed to save onboarding data", "OnboardingService", new Error(error.message));
      return { success: false, error: error.message };
    }

    logger.info("Onboarding data saved successfully", "OnboardingService");
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to save onboarding data", "OnboardingService", new Error(errorMessage));
    return { success: false, error: errorMessage };
  }
}

/**
 * Get onboarding data from Supabase
 */
export async function getOnboardingData(
  userId: string
): Promise<{ data: OnboardingData | null; error?: string }> {
  try {
    if (!supabase) {
      logger.warn("Supabase not configured", "OnboardingService");
      return { data: null };
    }

    logger.info("Getting onboarding data", "OnboardingService", { userId });

    const { data: row, error } = await supabase
      .from("user_onboarding")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      // PGRST116 = no rows found (not an error, just no data)
      if (error.code === "PGRST116") {
        return { data: null };
      }
      logger.error("Failed to get onboarding data", "OnboardingService", new Error(error.message));
      return { data: null, error: error.message };
    }

    if (!row) {
      return { data: null };
    }

    // Map row to OnboardingData (GENERAL/TENTANTE não têm campo de data)
    const dateField = getDateFieldForStage(row.stage as OnboardingStage);
    const date = dateField ? (row[dateField] as string | null) : null;

    const onboardingData: OnboardingData = {
      stage: row.stage as OnboardingStage,
      date,
      concerns: (row.concerns || []) as OnboardingConcern[],
      emotionalState: row.emotional_state as EmotionalState | null,
      dailyCheckIn: row.daily_check_in ?? false,
      checkInTime: row.check_in_time,
      seasonName: row.season_name,
      needsExtraCare: row.needs_extra_care ?? false,
    };

    return { data: onboardingData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to get onboarding data", "OnboardingService", new Error(errorMessage));
    return { data: null, error: errorMessage };
  }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const { data } = await getOnboardingData(userId);
  return data !== null;
}
