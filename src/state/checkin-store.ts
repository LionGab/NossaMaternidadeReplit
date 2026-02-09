import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface DailyCheckIn {
  date: string;
  mood: number | null; // 1-5 scale
  energy: number | null; // 1-5 scale
  sleep: number | null; // 1-5 scale
  note?: string;
}

interface CheckInState {
  checkIns: DailyCheckIn[];
  todayCheckIn: DailyCheckIn | null;
  streak: number;

  setTodayMood: (mood: number) => void;
  setTodayEnergy: (energy: number) => void;
  setTodaySleep: (sleep: number) => void;
  setTodayNote: (note: string) => void;
  getTodayCheckIn: () => DailyCheckIn | null;
  isCheckInComplete: () => boolean;
}

export const useCheckInStore = create<CheckInState>()(
  persist(
    (set, get) => ({
      checkIns: [],
      todayCheckIn: null,
      streak: 0,

      setTodayMood: (mood) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          const existing = state.checkIns.find((c) => c.date === today);
          if (existing) {
            return {
              checkIns: state.checkIns.map((c) => (c.date === today ? { ...c, mood } : c)),
              todayCheckIn: { ...existing, mood },
            };
          }
          const newCheckIn: DailyCheckIn = {
            date: today,
            mood,
            energy: null,
            sleep: null,
          };
          return {
            checkIns: [newCheckIn, ...state.checkIns],
            todayCheckIn: newCheckIn,
          };
        });
      },

      setTodayEnergy: (energy) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          const existing = state.checkIns.find((c) => c.date === today);
          if (existing) {
            return {
              checkIns: state.checkIns.map((c) => (c.date === today ? { ...c, energy } : c)),
              todayCheckIn: { ...existing, energy },
            };
          }
          const newCheckIn: DailyCheckIn = {
            date: today,
            mood: null,
            energy,
            sleep: null,
          };
          return {
            checkIns: [newCheckIn, ...state.checkIns],
            todayCheckIn: newCheckIn,
          };
        });
      },

      setTodaySleep: (sleep) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          const existing = state.checkIns.find((c) => c.date === today);
          if (existing) {
            return {
              checkIns: state.checkIns.map((c) => (c.date === today ? { ...c, sleep } : c)),
              todayCheckIn: { ...existing, sleep },
            };
          }
          const newCheckIn: DailyCheckIn = {
            date: today,
            mood: null,
            energy: null,
            sleep,
          };
          return {
            checkIns: [newCheckIn, ...state.checkIns],
            todayCheckIn: newCheckIn,
          };
        });
      },

      setTodayNote: (note) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          const existing = state.checkIns.find((c) => c.date === today);
          if (existing) {
            return {
              checkIns: state.checkIns.map((c) => (c.date === today ? { ...c, note } : c)),
              todayCheckIn: { ...existing, note },
            };
          }
          return state;
        });
      },

      getTodayCheckIn: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().checkIns.find((c) => c.date === today) || null;
      },

      isCheckInComplete: () => {
        const today = new Date().toISOString().split("T")[0];
        const checkIn = get().checkIns.find((c) => c.date === today);
        return checkIn
          ? checkIn.mood !== null && checkIn.energy !== null && checkIn.sleep !== null
          : false;
      },
    }),
    {
      name: "nossa-maternidade-checkin",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
