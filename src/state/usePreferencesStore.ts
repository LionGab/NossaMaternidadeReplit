import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PreferencesState {
  aiOptIn: boolean;
  aiConsentSeen: boolean;
  ttsEnabled: boolean;
  analyticsOptIn: boolean;
  communityAnonymousDefault: boolean;
  healthSyncOptIn: boolean;

  setAiOptIn: (value: boolean) => void;
  setAiConsentSeen: (value: boolean) => void;
  setAiConsent: (allowed: boolean) => void;
  setTtsEnabled: (value: boolean) => void;
  setAnalyticsOptIn: (value: boolean) => void;
  setCommunityAnonymousDefault: (value: boolean) => void;
  setHealthSyncOptIn: (value: boolean) => void;
  resetPreferences: () => void;
}

const DEFAULTS = {
  aiOptIn: false,
  aiConsentSeen: false,
  ttsEnabled: false,
  analyticsOptIn: false,
  communityAnonymousDefault: true,
  healthSyncOptIn: false,
} as const;

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setAiOptIn: (aiOptIn) => set({ aiOptIn }),
      setAiConsentSeen: (aiConsentSeen) => set({ aiConsentSeen }),
      setAiConsent: (allowed) => set({ aiOptIn: allowed, aiConsentSeen: true }),
      setTtsEnabled: (ttsEnabled) => set({ ttsEnabled }),
      setAnalyticsOptIn: (analyticsOptIn) => set({ analyticsOptIn }),
      setCommunityAnonymousDefault: (communityAnonymousDefault) =>
        set({ communityAnonymousDefault }),
      setHealthSyncOptIn: (healthSyncOptIn) => set({ healthSyncOptIn }),
      resetPreferences: () => set({ ...DEFAULTS }),
    }),
    {
      name: "nm:preferences",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persisted: unknown) => {
        if (!persisted || typeof persisted !== "object") return { ...DEFAULTS };
        const p = persisted as Partial<PreferencesState>;
        return { ...DEFAULTS, ...p };
      },
    }
  )
);
