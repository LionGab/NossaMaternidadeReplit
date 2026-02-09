import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getUserProfile } from "../api/database";
import { Interest, OnboardingStep, PregnancyStage, UserProfile } from "../types/navigation";
import { logger } from "../utils/logger";

export interface AppState {
  // User & Auth
  user: UserProfile | null;
  authUserId: string | null;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  currentOnboardingStep: OnboardingStep;

  // Theme
  theme: "light" | "dark" | "system";
  isDarkMode: boolean;

  // User Actions
  setUser: (user: UserProfile | null) => void;
  setAuthUserId: (userId: string | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  loadUserProfile: (userId: string) => Promise<void>;
  clearUser: () => void;

  // Theme Actions
  setTheme: (theme: "light" | "dark" | "system") => void;
  setIsDarkMode: (isDark: boolean) => void;

  // Onboarding Draft
  onboardingDraft: {
    name: string;
    stage: PregnancyStage | null;
    dueDate: string | null;
    interests: Interest[];
  };
  updateOnboardingDraft: (updates: Partial<AppState["onboardingDraft"]>) => void;
  clearOnboardingDraft: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      authUserId: null,
      isAuthenticated: false,
      isOnboardingComplete: false,
      currentOnboardingStep: "welcome",
      theme: "light",
      isDarkMode: false,

      onboardingDraft: {
        name: "",
        stage: null,
        dueDate: null,
        interests: [],
      },

      setUser: (user) => set({ user }),
      setAuthUserId: (userId) => set({ authUserId: userId }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      setOnboardingComplete: (complete) => set({ isOnboardingComplete: complete }),
      setOnboardingStep: (step) => set({ currentOnboardingStep: step }),

      loadUserProfile: async (userId: string) => {
        try {
          const { data, error } = await getUserProfile(userId);
          if (error) {
            const errorObj = error instanceof Error ? error : new Error(String(error));
            logger.error("Failed to load user profile", "AppStore", errorObj);
            return;
          }
          if (data) {
            set({ user: data as UserProfile });
          }
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          logger.error("Unexpected error loading user profile", "AppStore", errorObj);
        }
      },

      clearUser: () =>
        set({
          user: null,
          authUserId: null,
          isAuthenticated: false,
          isOnboardingComplete: false,
        }),

      setTheme: (theme) => set({ theme }),
      setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),

      updateOnboardingDraft: (updates) =>
        set((state) => ({
          onboardingDraft: { ...state.onboardingDraft, ...updates },
        })),
      clearOnboardingDraft: () =>
        set({
          onboardingDraft: {
            name: "",
            stage: null,
            dueDate: null,
            interests: [],
          },
        }),
    }),
    {
      name: "nossa-maternidade-app",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        authUserId: state.authUserId,
        isAuthenticated: state.isAuthenticated,
        isOnboardingComplete: state.isOnboardingComplete,
        theme: state.theme,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
