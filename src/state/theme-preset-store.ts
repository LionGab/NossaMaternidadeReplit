/**
 * Store para seleção de preset de tema
 * Permite alternar entre calmFemtech e floClean
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PresetMode = "calmFemtech" | "floClean";

interface ThemePresetState {
  presetMode: PresetMode;
  setPresetMode: (mode: PresetMode) => void;
  togglePreset: () => void;
}

export const useThemePresetStore = create<ThemePresetState>()(
  persist(
    (set, get) => ({
      // Default: calmFemtech (atual)
      presetMode: "calmFemtech",

      setPresetMode: (mode: PresetMode) => set({ presetMode: mode }),

      togglePreset: () => {
        const current = get().presetMode;
        set({ presetMode: current === "calmFemtech" ? "floClean" : "calmFemtech" });
      },
    }),
    {
      name: "theme-preset-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
