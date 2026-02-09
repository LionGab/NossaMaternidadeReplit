import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DailyLog } from "../types/navigation";
import { debounce } from "../utils/debounce";
import { logger } from "../utils/logger";
import { useAppStore } from "./app-store";

interface CycleState {
  lastPeriodStart: string | null;
  cycleLength: number;
  periodLength: number;
  dailyLogs: DailyLog[];
  isSyncing: boolean;
  lastSyncAt: string | null;

  setLastPeriodStart: (date: string) => void;
  setCycleLength: (length: number) => void;
  setPeriodLength: (length: number) => void;
  addDailyLog: (log: DailyLog) => void;
  updateDailyLog: (id: string, updates: Partial<DailyLog>) => void;
  getDailyLog: (date: string) => DailyLog | undefined;

  // Cloud sync
  syncFromCloud: () => Promise<{ error: Error | null }>;
  syncToCloud: () => Promise<{ error: Error | null }>;
  syncCycleSettings: () => Promise<{ error: Error | null }>;
}

export const useCycleStore = create<CycleState>()(
  persist(
    (set, get) => {
      // Auto-save debounced functions (2 segundos de delay)
      const autoSaveDailyLogs = debounce(async () => {
        const state = get();
        const { authUserId } = useAppStore.getState();
        if (!authUserId) {
          logger.debug("Skipping auto-save: user not authenticated", "CycleStore");
          return;
        }

        if (state.isSyncing) {
          logger.debug("Skipping auto-save: already syncing", "CycleStore");
          return;
        }

        try {
          const { batchSaveDailyLogs, mapDailyLogToDB } = await import("@/api/cycle-service");
          const logsToSync = state.dailyLogs.map(mapDailyLogToDB);
          const { error } = await batchSaveDailyLogs(logsToSync);

          if (error) {
            logger.warn("Auto-save daily logs failed", "CycleStore", { error: error.message });
          } else {
            set({ lastSyncAt: new Date().toISOString() });
            logger.debug("Auto-saved daily logs", "CycleStore", { count: logsToSync.length });
          }
        } catch (error) {
          logger.warn("Auto-save daily logs error", "CycleStore", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }, 2000);

      const autoSaveCycleSettings = debounce(async () => {
        const state = get();
        const { authUserId } = useAppStore.getState();
        if (!authUserId) {
          logger.debug("Skipping auto-save: user not authenticated", "CycleStore");
          return;
        }

        if (state.isSyncing) {
          logger.debug("Skipping auto-save: already syncing", "CycleStore");
          return;
        }

        try {
          const { saveCycleSettings } = await import("@/api/cycle-service");
          const { error } = await saveCycleSettings({
            cycle_length: state.cycleLength,
            period_length: state.periodLength,
            last_period_start: state.lastPeriodStart,
          });

          if (error) {
            logger.warn("Auto-save cycle settings failed", "CycleStore", { error: error.message });
          } else {
            set({ lastSyncAt: new Date().toISOString() });
            logger.debug("Auto-saved cycle settings", "CycleStore");
          }
        } catch (error) {
          logger.warn("Auto-save cycle settings error", "CycleStore", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }, 2000);

      return {
        lastPeriodStart: null,
        cycleLength: 28,
        periodLength: 5,
        dailyLogs: [],
        isSyncing: false,
        lastSyncAt: null,

        setLastPeriodStart: (date) => {
          set({ lastPeriodStart: date });
          autoSaveCycleSettings();
        },
        setCycleLength: (length) => {
          set({ cycleLength: length });
          autoSaveCycleSettings();
        },
        setPeriodLength: (length) => {
          set({ periodLength: length });
          autoSaveCycleSettings();
        },
        addDailyLog: (log) => {
          set((state) => ({
            dailyLogs: [...state.dailyLogs.filter((l) => l.date !== log.date), log],
          }));
          autoSaveDailyLogs();
        },
        updateDailyLog: (id, updates) => {
          set((state) => ({
            dailyLogs: state.dailyLogs.map((log) => (log.id === id ? { ...log, ...updates } : log)),
          }));
          autoSaveDailyLogs();
        },
        getDailyLog: (date) => get().dailyLogs.find((log) => log.date === date),

        // Cloud sync: Pull data from Supabase
        syncFromCloud: async () => {
          set({ isSyncing: true });

          try {
            const { fetchCycleSettings, fetchDailyLogs, mapDailyLogFromDB } =
              await import("@/api/cycle-service");

            const { data: settings, error: settingsError } = await fetchCycleSettings();
            if (settingsError) {
              set({ isSyncing: false });
              return { error: settingsError };
            }

            const { data: logs, error: logsError } = await fetchDailyLogs(90);
            if (logsError) {
              set({ isSyncing: false });
              return { error: logsError };
            }

            const remoteLogs = (logs || []).map(mapDailyLogFromDB);

            set({
              lastPeriodStart: settings?.last_period_start || get().lastPeriodStart,
              cycleLength: settings?.cycle_length || get().cycleLength,
              periodLength: settings?.period_length || get().periodLength,
              dailyLogs: remoteLogs,
              lastSyncAt: new Date().toISOString(),
              isSyncing: false,
            });

            return { error: null };
          } catch (error) {
            set({ isSyncing: false });
            return { error: error as Error };
          }
        },

        // Cloud sync: Push data to Supabase
        syncToCloud: async () => {
          set({ isSyncing: true });

          try {
            const { batchSaveDailyLogs, mapDailyLogToDB } = await import("@/api/cycle-service");

            const state = get();
            const logsToSync = state.dailyLogs.map(mapDailyLogToDB);

            const { error: logsError } = await batchSaveDailyLogs(logsToSync);
            if (logsError) {
              set({ isSyncing: false });
              return { error: logsError };
            }

            set({
              lastSyncAt: new Date().toISOString(),
              isSyncing: false,
            });

            return { error: null };
          } catch (error) {
            set({ isSyncing: false });
            return { error: error as Error };
          }
        },

        // Sync cycle settings only
        syncCycleSettings: async () => {
          set({ isSyncing: true });

          try {
            const { saveCycleSettings } = await import("@/api/cycle-service");

            const state = get();
            const { error } = await saveCycleSettings({
              cycle_length: state.cycleLength,
              period_length: state.periodLength,
              last_period_start: state.lastPeriodStart,
            });

            if (error) {
              set({ isSyncing: false });
              return { error };
            }

            set({
              lastSyncAt: new Date().toISOString(),
              isSyncing: false,
            });

            return { error: null };
          } catch (error) {
            set({ isSyncing: false });
            return { error: error as Error };
          }
        },
      };
    },
    {
      name: "nossa-maternidade-cycle",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
