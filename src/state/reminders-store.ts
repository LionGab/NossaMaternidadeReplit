/**
 * reminders-store.ts - Store para lembretes diários
 *
 * Gerencia lembretes configurados pelo usuário para
 * aumentar engajamento e retorno ao app.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// ============================================================================
// TYPES
// ============================================================================

export interface Reminder {
  id: string;
  title: string;
  icon: string;
  time: string; // formato "HH:mm"
  enabled: boolean;
  days: number[]; // 0=Dom, 1=Seg, ..., 6=Sáb
  completedToday: boolean;
}

interface RemindersState {
  reminders: Reminder[];

  // Actions
  addReminder: (reminder: Omit<Reminder, "id" | "completedToday">) => void;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  completeReminder: (id: string) => void;
  resetDailyCompletion: () => void;

  // Selectors
  getUpcomingReminders: (limit?: number) => Reminder[];
  getEnabledReminders: () => Reminder[];
}

// ============================================================================
// DEFAULT DATA
// ============================================================================

const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: "1",
    title: "Check-in emocional",
    icon: "heart-outline",
    time: "09:00",
    enabled: true,
    days: [1, 2, 3, 4, 5], // Seg-Sex
    completedToday: false,
  },
  {
    id: "2",
    title: "Momento de autocuidado",
    icon: "sparkles-outline",
    time: "20:00",
    enabled: true,
    days: [0, 1, 2, 3, 4, 5, 6], // Todos os dias
    completedToday: false,
  },
  {
    id: "3",
    title: "Hidratação",
    icon: "water-outline",
    time: "14:00",
    enabled: true,
    days: [1, 2, 3, 4, 5],
    completedToday: false,
  },
];

// ============================================================================
// STORE
// ============================================================================

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set, get) => ({
      reminders: DEFAULT_REMINDERS,

      addReminder: (reminder) => {
        const newReminder: Reminder = {
          ...reminder,
          id: Date.now().toString(),
          completedToday: false,
        };
        set((state) => ({
          reminders: [...state.reminders, newReminder],
        }));
      },

      removeReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },

      toggleReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
        }));
      },

      updateReminder: (id, updates) => {
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      },

      completeReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, completedToday: true } : r)),
        }));
      },

      resetDailyCompletion: () => {
        set((state) => ({
          reminders: state.reminders.map((r) => ({
            ...r,
            completedToday: false,
          })),
        }));
      },

      getUpcomingReminders: (limit = 2) => {
        const { reminders } = get();
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        return reminders
          .filter((r) => {
            if (!r.enabled || r.completedToday) return false;
            if (!r.days.includes(currentDay)) return false;

            const [hours, minutes] = r.time.split(":").map(Number);
            const reminderTime = hours * 60 + minutes;

            // Só mostrar lembretes que ainda não passaram
            return reminderTime >= currentTime;
          })
          .sort((a, b) => {
            const [aH, aM] = a.time.split(":").map(Number);
            const [bH, bM] = b.time.split(":").map(Number);
            return aH * 60 + aM - (bH * 60 + bM);
          })
          .slice(0, limit);
      },

      getEnabledReminders: () => {
        return get().reminders.filter((r) => r.enabled);
      },
    }),
    {
      name: "reminders-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useRemindersStore;
