/**
 * Store Zustand para o onboarding "Jornada da Nath"
 * Gerencia estado local durante o fluxo de onboarding
 * Com sync checkpoint strategy para Supabase
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SEASON_KEY_BY_LABEL, SEASON_PRESET_BY_KEY } from "../config/nath-journey-onboarding-data";
import { DEFAULT_CHECKIN_TIME } from "../theme/tokens";
import {
  EmotionalState,
  ExpandedMaternityStage,
  LifeGoal,
  LifeJourney,
  OnboardingConcern,
  OnboardingData,
  OnboardingScreen,
  OnboardingStage,
} from "../types/nath-journey-onboarding.types";
import { logger } from "../utils/logger";

// ===========================================
// STATE INTERFACE
// ===========================================

interface NathJourneyOnboardingState {
  // Dados do onboarding
  data: OnboardingData;

  // Estado do fluxo
  currentScreen: OnboardingScreen;
  isComplete: boolean;
  welcomeSkipped: boolean;

  // Actions - Movimento Valente (Janeiro 2026)
  setJourney: (journey: LifeJourney) => void;
  setWelcomeSkipped: (skipped: boolean) => void;
  setMaternityStage: (stage: ExpandedMaternityStage) => void;
  setGoals: (goals: LifeGoal[]) => void;
  toggleGoal: (goal: LifeGoal) => void;

  // Actions - Data updates (original)
  setStage: (stage: OnboardingStage) => void;
  setDate: (kind: OnboardingData["dateKind"], iso: string | null) => void;
  setConcerns: (concerns: OnboardingConcern[]) => void;
  toggleConcern: (concern: OnboardingConcern) => void;
  setEmotionalState: (state: EmotionalState) => void;
  setDailyCheckIn: (enabled: boolean) => void;
  setCheckInHour: (hour: number) => void;
  formatCheckInTime: (hour: number) => string;
  getCheckInTime: () => string | null;
  setSeasonKey: (key: OnboardingData["seasonKey"]) => void;
  setSeasonCustomName: (name: string | null) => void;
  getSeasonName: () => string | null;

  // Actions - Flow control
  setCurrentScreen: (screen: OnboardingScreen) => void;
  nextScreen: () => void;
  prevScreen: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Computed
  canProceed: () => boolean;
  getProgress: () => number;
  needsExtraCare: () => boolean;
}

// ===========================================
// CONSTANTS
// ===========================================

/**
 * Ordem das telas do onboarding Movimento Valente
 * NOTA: O fluxo é dinâmico - algumas telas são condicionais:
 * - OnboardingMaternityStage só aparece se journey === "MATERNIDADE"
 * - OnboardingStage é legacy, pode ser pulado no novo fluxo
 */
const SCREENS_ORDER: OnboardingScreen[] = [
  "OnboardingWelcome",
  "OnboardingJourneySelect",
  "OnboardingMaternityStage", // Condicional: só se journey === "MATERNIDADE"
  "OnboardingStage", // Legacy: mantido para compatibilidade
  "OnboardingDate",
  "OnboardingConcerns",
  "OnboardingEmotionalState",
  "OnboardingCheckIn",
  "OnboardingSeason",
  "OnboardingSummary",
  "OnboardingPaywall",
];

const DEFAULT_CHECKIN_HOUR = Number.parseInt(DEFAULT_CHECKIN_TIME.split(":")[0] ?? "21", 10);

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
 * Validate stage value against database constraint
 */
function isValidStage(stage: unknown): stage is OnboardingStage {
  return typeof stage === "string" && VALID_STAGES.includes(stage as OnboardingStage);
}

function getDateKindForStage(stage: OnboardingStage): OnboardingData["dateKind"] {
  if (stage === "GENERAL" || stage === "TENTANTE") return "none";
  if (stage.startsWith("GRAVIDA")) return "due_date";
  if (stage === "PUERPERIO_0_40D" || stage === "MAE_RECENTE_ATE_1ANO") return "baby_birth";
  return "none";
}

function isValidHour(hour: number): boolean {
  return Number.isInteger(hour) && hour >= 0 && hour <= 23;
}

function formatHourToTime(hour: number): string {
  const safeHour = isValidHour(hour) ? hour : DEFAULT_CHECKIN_HOUR;
  return `${String(safeHour).padStart(2, "0")}:00`;
}

function formatHourToUi(hour: number): string {
  const safeHour = isValidHour(hour) ? hour : DEFAULT_CHECKIN_HOUR;
  return `${safeHour}h`;
}

const initialData: OnboardingData = {
  // Movimento Valente (Janeiro 2026)
  journey: null,
  maternityStage: null,
  goals: [],

  // Campos originais
  journeyType: "maternity",
  stage: null,
  dateKind: "none",
  dateIso: null,
  concerns: [],
  emotionalState: null,
  dailyCheckIn: false,
  checkInHour: DEFAULT_CHECKIN_HOUR,
  seasonKey: null,
  seasonCustomName: null,
  completedAt: null,
  isFounder: false,
  needsExtraCare: false,
};

// ===========================================
// HELPERS
// ===========================================

/**
 * Verifica se o usuário completou onboarding no período founder (06-08/jan/2026)
 */
function checkIfFounder(): boolean {
  const now = new Date();
  const founderStart = new Date("2026-01-06T00:00:00Z");
  const founderEnd = new Date("2026-01-08T23:59:59Z");
  return now >= founderStart && now <= founderEnd;
}

// ===========================================
// STORE
// ===========================================

export const useNathJourneyOnboardingStore = create<NathJourneyOnboardingState>()(
  persist(
    (set, get) => ({
      data: initialData,
      currentScreen: "OnboardingWelcome",
      isComplete: false,
      welcomeSkipped: false,

      // ===========================================
      // MOVIMENTO VALENTE - Novos Setters (Janeiro 2026)
      // ===========================================

      setWelcomeSkipped: (skipped) => set({ welcomeSkipped: skipped }),

      setJourney: (journey) =>
        set((state) => ({
          data: {
            ...state.data,
            journey,
            // Auto-update journeyType para compatibilidade
            journeyType: journey === "MATERNIDADE" ? "maternity" : "maternity",
          },
        })),

      setMaternityStage: (maternityStage) =>
        set((state) => ({
          data: {
            ...state.data,
            maternityStage,
            // Sync com stage legacy para compatibilidade
            // Mapeia: TENTANTE → TENTANTE, GRAVIDA_T1 → GRAVIDA_T1, etc.
            stage:
              maternityStage === "PUERPERIO"
                ? "PUERPERIO_0_40D"
                : maternityStage === "MAE_RECENTE"
                  ? "MAE_RECENTE_ATE_1ANO"
                  : (maternityStage as OnboardingStage | null),
            dateKind: maternityStage
              ? getDateKindForStage(
                  maternityStage === "PUERPERIO"
                    ? "PUERPERIO_0_40D"
                    : maternityStage === "MAE_RECENTE"
                      ? "MAE_RECENTE_ATE_1ANO"
                      : (maternityStage as OnboardingStage)
                )
              : "none",
          },
        })),

      setGoals: (goals) => {
        if (goals.length > 3) {
          logger.warn("Tentativa de selecionar mais de 3 goals", "OnboardingStore");
          return;
        }
        set((state) => ({
          data: { ...state.data, goals },
        }));
      },

      toggleGoal: (goal) => {
        const { data } = get();
        const currentGoals = data.goals;
        const isSelected = currentGoals.includes(goal);

        if (isSelected) {
          set((state) => ({
            data: {
              ...state.data,
              goals: currentGoals.filter((g) => g !== goal),
            },
          }));
        } else {
          if (currentGoals.length >= 3) {
            logger.warn("Máximo de 3 goals permitidos", "OnboardingStore");
            return;
          }
          set((state) => ({
            data: {
              ...state.data,
              goals: [...currentGoals, goal],
            },
          }));
        }
      },

      // ===========================================
      // DATA UPDATES (Original)
      // ===========================================

      setStage: (stage) =>
        set((state) => ({
          data: {
            ...state.data,
            journeyType: "maternity",
            stage,
            dateKind: getDateKindForStage(stage),
            dateIso: getDateKindForStage(stage) === state.data.dateKind ? state.data.dateIso : null,
          },
        })),

      setDate: (dateKind, dateIso) =>
        set((state) => ({
          data: { ...state.data, dateKind, dateIso },
        })),

      setConcerns: (concerns) => {
        if (concerns.length > 3) {
          logger.warn("Tentativa de selecionar mais de 3 concerns", "OnboardingStore");
          return;
        }
        set((state) => ({
          data: { ...state.data, concerns },
        }));
      },

      toggleConcern: (concern) => {
        const { data } = get();
        const currentConcerns = data.concerns;
        const isSelected = currentConcerns.includes(concern);

        if (isSelected) {
          set((state) => ({
            data: {
              ...state.data,
              concerns: currentConcerns.filter((c) => c !== concern),
            },
          }));
        } else {
          if (currentConcerns.length >= 3) {
            logger.warn("Máximo de 3 concerns permitidos", "OnboardingStore");
            return;
          }
          set((state) => ({
            data: {
              ...state.data,
              concerns: [...currentConcerns, concern],
            },
          }));
        }
      },

      setEmotionalState: (emotionalState) => {
        const needsExtraCare =
          emotionalState === "MUITO_ANSIOSA" || emotionalState === "TRISTE_ESGOTADA";
        set((state) => ({
          data: {
            ...state.data,
            emotionalState,
            needsExtraCare,
          },
        }));
      },

      setDailyCheckIn: (enabled) =>
        set((state) => ({
          data: { ...state.data, dailyCheckIn: enabled },
        })),

      setCheckInHour: (hour) =>
        set((state) => ({
          data: { ...state.data, checkInHour: isValidHour(hour) ? hour : DEFAULT_CHECKIN_HOUR },
        })),

      formatCheckInTime: (hour) => formatHourToUi(hour),

      getCheckInTime: () => {
        const { data } = get();
        return data.dailyCheckIn ? formatHourToTime(data.checkInHour) : null;
      },

      setSeasonKey: (key) =>
        set((state) => ({
          data: {
            ...state.data,
            seasonKey: key,
            seasonCustomName: key === "custom" ? state.data.seasonCustomName : null,
          },
        })),

      setSeasonCustomName: (name) => {
        if (name && name.length > 40) {
          logger.warn("Season custom name excede 40 caracteres", "OnboardingStore");
          return;
        }
        set((state) => ({
          data: {
            ...state.data,
            seasonKey: name ? "custom" : state.data.seasonKey,
            seasonCustomName: name,
          },
        }));
      },

      getSeasonName: () => {
        const { data } = get();
        if (!data.seasonKey) return null;
        if (data.seasonKey === "custom") return data.seasonCustomName ?? null;
        return SEASON_PRESET_BY_KEY[data.seasonKey] ?? null;
      },

      // ===========================================
      // FLOW CONTROL
      // ===========================================

      setCurrentScreen: (screen) => set({ currentScreen: screen }),

      nextScreen: () => {
        const { currentScreen } = get();
        const currentIndex = SCREENS_ORDER.indexOf(currentScreen);
        if (currentIndex < SCREENS_ORDER.length - 1) {
          const nextScreen = SCREENS_ORDER[currentIndex + 1];
          set({ currentScreen: nextScreen });
        }
      },

      prevScreen: () => {
        const { currentScreen } = get();
        const currentIndex = SCREENS_ORDER.indexOf(currentScreen);
        if (currentIndex > 0) {
          const prevScreen = SCREENS_ORDER[currentIndex - 1];
          set({ currentScreen: prevScreen });
        }
      },

      completeOnboarding: () => {
        set((state) => ({
          isComplete: true,
          data: {
            ...state.data,
            completedAt: new Date().toISOString(),
            isFounder: checkIfFounder(),
          },
        }));
      },

      resetOnboarding: () =>
        set({
          data: initialData,
          currentScreen: "OnboardingWelcome",
          isComplete: false,
        }),

      // ===========================================
      // COMPUTED
      // ===========================================

      canProceed: () => {
        const { data, currentScreen } = get();

        switch (currentScreen) {
          // Movimento Valente - Novas telas
          case "OnboardingWelcome":
            return true;
          case "OnboardingJourneySelect":
            return data.journey !== null;
          case "OnboardingMaternityStage":
            // Só requerido se journey === "MATERNIDADE"
            return data.journey !== "MATERNIDADE" || data.maternityStage !== null;

          // Telas originais
          case "OnboardingStage":
            return data.stage !== null;
          case "OnboardingDate":
            return data.dateKind === "due_date" ? Boolean(data.dateIso) : true;
          case "OnboardingConcerns":
            return data.concerns.length <= 3;
          case "OnboardingEmotionalState":
            return true;
          case "OnboardingCheckIn":
            return true;
          case "OnboardingSeason":
            return true;
          case "OnboardingSummary":
            return true;
          case "OnboardingPaywall":
            return true;
          default:
            return false;
        }
      },

      getProgress: () => {
        const { currentScreen } = get();
        const currentIndex = SCREENS_ORDER.indexOf(currentScreen);
        if (currentScreen === "OnboardingWelcome") return 0;
        if (currentScreen === "OnboardingPaywall") return 100;
        return Math.round(((currentIndex - 1) / 7) * 100);
      },

      needsExtraCare: () => {
        const { data } = get();
        return data.needsExtraCare;
      },
    }),
    {
      name: "nath-journey-onboarding",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState, version) => {
        // v0 -> v1: migrate para SSOT (journeyType/dateKind+dateIso/checkInHour/seasonKey)
        if (version !== 0) return persistedState;

        const isRecord = (v: unknown): v is Record<string, unknown> =>
          typeof v === "object" && v !== null;

        if (!isRecord(persistedState)) return persistedState;

        const oldData = isRecord(persistedState.data) ? persistedState.data : {};

        // Validate stage against database constraint to prevent constraint violations
        const rawStage = typeof oldData.stage === "string" ? oldData.stage : null;
        const stage = rawStage && isValidStage(rawStage) ? rawStage : null;

        const dueDate = typeof oldData.dueDate === "string" ? oldData.dueDate : null;
        const birthDate = typeof oldData.birthDate === "string" ? oldData.birthDate : null;

        const dateKind = stage ? getDateKindForStage(stage) : "none";
        const dateIso =
          dateKind === "due_date" ? dueDate : dateKind === "baby_birth" ? birthDate : null;

        const checkInTime = typeof oldData.checkInTime === "string" ? oldData.checkInTime : null;
        const checkInHourFromOld = (() => {
          if (!checkInTime) return DEFAULT_CHECKIN_HOUR;
          const [h] = checkInTime.split(":");
          const parsed = Number.parseInt(h ?? "", 10);
          return isValidHour(parsed) ? parsed : DEFAULT_CHECKIN_HOUR;
        })();

        const seasonName = typeof oldData.seasonName === "string" ? oldData.seasonName : null;
        const seasonKey = seasonName
          ? (SEASON_KEY_BY_LABEL[seasonName] ?? "custom")
          : (null as OnboardingData["seasonKey"]);
        const seasonCustomName =
          seasonName && seasonKey === "custom" ? seasonName : (null as string | null);

        const concerns = Array.isArray(oldData.concerns)
          ? (oldData.concerns.filter((c) => typeof c === "string") as OnboardingConcern[])
          : [];

        const emotionalState =
          typeof oldData.emotionalState === "string"
            ? (oldData.emotionalState as EmotionalState)
            : null;

        const dailyCheckIn =
          typeof oldData.dailyCheckIn === "boolean" ? oldData.dailyCheckIn : false;

        const completedAt = typeof oldData.completedAt === "string" ? oldData.completedAt : null;
        const isFounder = typeof oldData.isFounder === "boolean" ? oldData.isFounder : false;
        const needsExtraCare =
          typeof oldData.needsExtraCare === "boolean" ? oldData.needsExtraCare : false;

        // Migrar journey/maternityStage/goals se existirem
        const journey =
          typeof oldData.journey === "string"
            ? (oldData.journey as OnboardingData["journey"])
            : null;
        const maternityStage =
          typeof oldData.maternityStage === "string"
            ? (oldData.maternityStage as OnboardingData["maternityStage"])
            : null;
        const goals = Array.isArray(oldData.goals)
          ? (oldData.goals.filter((g) => typeof g === "string") as OnboardingData["goals"])
          : [];

        return {
          currentScreen:
            typeof persistedState.currentScreen === "string"
              ? (persistedState.currentScreen as OnboardingScreen)
              : "OnboardingWelcome",
          isComplete:
            typeof persistedState.isComplete === "boolean" ? persistedState.isComplete : false,
          data: {
            // Movimento Valente (Janeiro 2026)
            journey,
            maternityStage,
            goals,
            // Campos originais
            journeyType: "maternity",
            stage,
            dateKind,
            dateIso,
            concerns,
            emotionalState,
            dailyCheckIn,
            checkInHour: checkInHourFromOld,
            seasonKey,
            seasonCustomName,
            completedAt,
            isFounder,
            needsExtraCare,
          } satisfies OnboardingData,
        } satisfies Pick<NathJourneyOnboardingState, "data" | "currentScreen" | "isComplete">;
      },
      partialize: (state) => ({
        data: state.data,
        currentScreen: state.currentScreen,
        isComplete: state.isComplete,
      }),
    }
  )
);
