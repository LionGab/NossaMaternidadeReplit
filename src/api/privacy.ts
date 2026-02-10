import { supabase } from "@/api/supabase";
import { logger } from "@/utils/logger";

const CONTEXT = "PrivacyAPI";

export async function updateUserAiMetadata(data: Record<string, unknown>): Promise<void> {
  if (!supabase) {
    logger.warn("Supabase not configured - skipping AI metadata sync", CONTEXT);
    return;
  }

  const { error } = await supabase.auth.updateUser({ data });

  if (error) {
    logger.error("Failed to sync AI metadata to Supabase", CONTEXT, error);
    throw error;
  }

  logger.info("AI metadata synced to Supabase", CONTEXT, data);
}
