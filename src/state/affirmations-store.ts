import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Affirmation } from "../types/navigation";

interface AffirmationsState {
  todayAffirmation: Affirmation | null;
  favoriteAffirmations: Affirmation[];
  lastShownDate: string | null;

  setTodayAffirmation: (affirmation: Affirmation) => void;
  addToFavorites: (affirmation: Affirmation) => void;
  removeFromFavorites: (id: string) => void;
  setLastShownDate: (date: string) => void;
}

export const useAffirmationsStore = create<AffirmationsState>()(
  persist(
    (set) => ({
      todayAffirmation: null,
      favoriteAffirmations: [],
      lastShownDate: null,

      setTodayAffirmation: (affirmation) => set({ todayAffirmation: affirmation }),
      addToFavorites: (affirmation) =>
        set((state) => ({
          favoriteAffirmations: [...state.favoriteAffirmations, affirmation],
        })),
      removeFromFavorites: (id) =>
        set((state) => ({
          favoriteAffirmations: state.favoriteAffirmations.filter((a) => a.id !== id),
        })),
      setLastShownDate: (date) => set({ lastShownDate: date }),
    }),
    {
      name: "nossa-maternidade-affirmations",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
