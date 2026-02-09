/**
 * NathIA Onboarding Store
 * Local-first, works offline, persisted with AsyncStorage
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NathIAOnboardingProfile,
  DEFAULT_NATHIA_PROFILE,
  LifeStage,
  StageDetail,
  InterestOption,
  MoodToday,
  SensitiveTopic,
  TonePreference,
  NotificationPref,
  NathIAOnboardingStep,
} from "../types/nathia-onboarding";

interface NathIAOnboardingState {
  // Profile data
  profile: NathIAOnboardingProfile;

  // Flow state
  currentStep: NathIAOnboardingStep;
  isComplete: boolean;

  // Actions - Profile updates
  setNickname: (nickname: string | null) => void;
  setLifeStage: (stage: LifeStage) => void;
  setStageDetail: (detail: Partial<StageDetail>) => void;
  setInterests: (interests: InterestOption[]) => void;
  toggleInterest: (interest: InterestOption) => void;
  setMoodToday: (mood: MoodToday) => void;
  setMoodNote: (note: string | null) => void;
  setSensitiveTopics: (topics: SensitiveTopic[]) => void;
  toggleSensitiveTopic: (topic: SensitiveTopic) => void;
  setTonePreference: (tone: TonePreference) => void;
  setAllowBrandRecos: (allow: boolean) => void;
  setNotificationsPref: (pref: NotificationPref) => void;
  setHealthConnectInterest: (interest: boolean) => void;

  // Actions - Flow control
  setCurrentStep: (step: NathIAOnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Computed
  canProceed: () => boolean;
  getProgress: () => number;
}

const STEPS_ORDER: NathIAOnboardingStep[] = [
  "phase",
  "context",
  "interests",
  "mood",
  "preferences",
];

export const useNathIAOnboardingStore = create<NathIAOnboardingState>()(
  persist(
    (set, get) => ({
      profile: { ...DEFAULT_NATHIA_PROFILE },
      currentStep: "phase",
      isComplete: false,

      // Profile setters
      setNickname: (nickname) =>
        set((state) => ({
          profile: { ...state.profile, nickname },
        })),

      setLifeStage: (life_stage) =>
        set((state) => ({
          profile: {
            ...state.profile,
            life_stage,
            // Reset stage_detail when changing life stage
            stage_detail: {},
          },
        })),

      setStageDetail: (detail) =>
        set((state) => ({
          profile: {
            ...state.profile,
            stage_detail: { ...state.profile.stage_detail, ...detail },
          },
        })),

      setInterests: (interests) =>
        set((state) => ({
          profile: { ...state.profile, interests },
        })),

      toggleInterest: (interest) =>
        set((state) => {
          const current = state.profile.interests;

          // If selecting "basic", clear all others
          if (interest === "basic") {
            return {
              profile: {
                ...state.profile,
                interests: current.includes("basic") ? [] : ["basic"],
              },
            };
          }

          // If selecting something else and "basic" is selected, remove "basic"
          const withoutBasic = current.filter((i) => i !== "basic");
          const newInterests = withoutBasic.includes(interest)
            ? withoutBasic.filter((i) => i !== interest)
            : [...withoutBasic, interest];

          return {
            profile: { ...state.profile, interests: newInterests },
          };
        }),

      setMoodToday: (mood_today) =>
        set((state) => ({
          profile: { ...state.profile, mood_today },
        })),

      setMoodNote: (mood_note) =>
        set((state) => ({
          profile: { ...state.profile, mood_note },
        })),

      setSensitiveTopics: (sensitive_topics) =>
        set((state) => {
          // Calculate body_safe_mode
          const body_safe_mode =
            sensitive_topics.includes("body_comparison") ||
            sensitive_topics.includes("weight_diet");

          return {
            profile: { ...state.profile, sensitive_topics, body_safe_mode },
          };
        }),

      toggleSensitiveTopic: (topic) =>
        set((state) => {
          const current = state.profile.sensitive_topics;

          // If selecting "none", clear all others
          if (topic === "none") {
            return {
              profile: {
                ...state.profile,
                sensitive_topics: current.includes("none") ? [] : ["none"],
                body_safe_mode: false,
              },
            };
          }

          // If selecting something else and "none" is selected, remove "none"
          const withoutNone = current.filter((t) => t !== "none");
          const newTopics = withoutNone.includes(topic)
            ? withoutNone.filter((t) => t !== topic)
            : [...withoutNone, topic];

          // Calculate body_safe_mode
          const body_safe_mode =
            newTopics.includes("body_comparison") || newTopics.includes("weight_diet");

          return {
            profile: {
              ...state.profile,
              sensitive_topics: newTopics,
              body_safe_mode,
            },
          };
        }),

      setTonePreference: (tone_pref) =>
        set((state) => ({
          profile: { ...state.profile, tone_pref },
        })),

      setAllowBrandRecos: (allow_brand_recos) =>
        set((state) => ({
          profile: { ...state.profile, allow_brand_recos },
        })),

      setNotificationsPref: (notifications_pref) =>
        set((state) => ({
          profile: { ...state.profile, notifications_pref },
        })),

      setHealthConnectInterest: (health_connect_interest) =>
        set((state) => ({
          profile: { ...state.profile, health_connect_interest },
        })),

      // Flow control
      setCurrentStep: (currentStep) => set({ currentStep }),

      nextStep: () =>
        set((state) => {
          const currentIndex = STEPS_ORDER.indexOf(state.currentStep);
          if (currentIndex < STEPS_ORDER.length - 1) {
            return { currentStep: STEPS_ORDER[currentIndex + 1] };
          }
          return state;
        }),

      prevStep: () =>
        set((state) => {
          const currentIndex = STEPS_ORDER.indexOf(state.currentStep);
          if (currentIndex > 0) {
            return { currentStep: STEPS_ORDER[currentIndex - 1] };
          }
          return state;
        }),

      completeOnboarding: () =>
        set((state) => ({
          isComplete: true,
          profile: {
            ...state.profile,
            onboarding_completed_at: new Date().toISOString(),
          },
        })),

      resetOnboarding: () =>
        set({
          profile: { ...DEFAULT_NATHIA_PROFILE },
          currentStep: "phase",
          isComplete: false,
        }),

      // Computed
      canProceed: () => {
        const { profile, currentStep } = get();

        switch (currentStep) {
          case "phase":
            // Must select a life stage
            return profile.life_stage !== undefined;

          case "context":
            // Context is required but validation depends on life_stage
            const { life_stage, stage_detail } = profile;
            switch (life_stage) {
              case "trying":
                return stage_detail.trying_focus !== undefined;
              case "pregnant":
                return stage_detail.trimester !== undefined;
              case "postpartum":
                return stage_detail.baby_age_bucket !== undefined;
              case "lifestyle":
                return true; // Age range is optional
              default:
                return false;
            }

          case "interests":
            // Interests are recommended but can skip
            return true;

          case "mood":
            // Mood is recommended but can skip
            return true;

          case "preferences":
            // Preferences are optional
            return true;

          default:
            return true;
        }
      },

      getProgress: () => {
        const { currentStep } = get();
        const currentIndex = STEPS_ORDER.indexOf(currentStep);
        return ((currentIndex + 1) / STEPS_ORDER.length) * 100;
      },
    }),
    {
      name: "nathia-onboarding-profile",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        isComplete: state.isComplete,
        currentStep: state.currentStep,
      }),
    }
  )
);
