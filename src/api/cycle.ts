import {
  fetchCycleSettings,
  fetchDailyLogs,
  mapDailyLogFromDB,
  mapDailyLogToDB,
  saveCycleSettings,
  saveDailyLog,
  type CycleSettings,
} from "@/api/cycle-service";
import type { DailyLog } from "@/types/navigation";

export interface CycleData {
  logs: DailyLog[];
  settings: CycleSettings | null;
}

export interface UpdateCycleSettingsInput {
  cycle_length: number;
  last_period_start: string | null;
  period_length: number;
}

export async function fetchCycleData(): Promise<CycleData> {
  const [{ data: settings, error: settingsError }, { data: logs, error: logsError }] =
    await Promise.all([fetchCycleSettings(), fetchDailyLogs(120)]);

  if (settingsError) {
    throw settingsError;
  }

  if (logsError) {
    throw logsError;
  }

  return {
    settings,
    logs: (logs ?? []).map(mapDailyLogFromDB),
  };
}

export async function updateCycleSettings(
  input: UpdateCycleSettingsInput
): Promise<CycleSettings> {
  const { data, error } = await saveCycleSettings(input);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Cycle settings not returned");
  }

  return data;
}

export async function upsertDailyLog(log: DailyLog): Promise<DailyLog> {
  const { data, error } = await saveDailyLog(mapDailyLogToDB(log));

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Daily log not returned");
  }

  return mapDailyLogFromDB(data);
}

