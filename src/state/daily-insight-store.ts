// src/state/daily-insight-store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DailyInsightCache {
  lastShownDate: string | null; // YYYY-MM-DD
  lastInsightId: string | null;
  lastJourney: string | null;
  setDailyInsightCache: (payload: { date: string; insightId: string; journey: string }) => void;
  resetDailyInsightCache: () => void;
}

export const useDailyInsightStore = create<DailyInsightCache>()(
  persist(
    (set) => ({
      lastShownDate: null,
      lastInsightId: null,
      lastJourney: null,
      setDailyInsightCache: ({ date, insightId, journey }) =>
        set({ lastShownDate: date, lastInsightId: insightId, lastJourney: journey }),
      resetDailyInsightCache: () => set({ lastShownDate: null, lastInsightId: null, lastJourney: null }),
    }),
    {
      name: 'daily-insight-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
