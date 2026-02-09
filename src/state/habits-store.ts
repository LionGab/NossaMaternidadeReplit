import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { COLORS } from "../theme/tokens";

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: "self-care" | "health" | "mindfulness" | "connection" | "growth";
  completed: boolean;
  streak: number;
  bestStreak: number;
  completedDates: string[];
}

interface HabitsState {
  habits: Habit[];
  weeklyCompletion: number[];
  totalStreak: number;

  toggleHabit: (id: string, date: string) => void;
  addHabit: (habit: Habit) => void;
  removeHabit: (id: string) => void;
  resetDailyHabits: () => void;
  getCompletedToday: () => number;
}

// Cuidados diários - linguagem fitness gentil, sem cobrança
// Inspirado no estilo saudável da Nathalia, mas acessível para todas
const DEFAULT_HABITS: Habit[] = [
  {
    id: "1",
    title: "Água no corpo",
    description: "Hidratação sustenta tudo: pele, energia, disposição",
    icon: "water",
    color: COLORS.secondary[400],
    category: "health",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "2",
    title: "Comida de verdade",
    description: "Comer bem é nutrir, não restringir",
    icon: "restaurant",
    color: COLORS.mood.sensitive,
    category: "health",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "3",
    title: "5 min só pra mim",
    description: "Skincare, banho, ou só fechar os olhos",
    icon: "sparkles",
    color: COLORS.mood.energetic,
    category: "self-care",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "4",
    title: "Um pouco de sol",
    description: "Luz natural acorda o corpo por dentro",
    icon: "sunny",
    color: COLORS.semantic.warning,
    category: "health",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "5",
    title: "Conversa adulta",
    description: "Falar com alguém que te ouve",
    icon: "chatbubbles",
    color: COLORS.mood.sensitive,
    category: "connection",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "6",
    title: "3 respirações",
    description: "Quando apertar, inspira fundo",
    icon: "leaf",
    color: COLORS.semantic.success,
    category: "mindfulness",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "7",
    title: "Foto do momento",
    description: "Registrar presença, não perfeição",
    icon: "camera",
    color: COLORS.mood.tired,
    category: "connection",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
  {
    id: "8",
    title: "Pedir ajuda",
    description: "Delegar é força, não fraqueza",
    icon: "hand-left",
    color: COLORS.accent[500],
    category: "self-care",
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  },
];

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: DEFAULT_HABITS,
      weeklyCompletion: [0, 0, 0, 0, 0, 0, 0],
      totalStreak: 0,

      toggleHabit: (id, date) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit;
            const isCompleting = !habit.completed;
            const newCompletedDates = isCompleting
              ? [...habit.completedDates, date]
              : habit.completedDates.filter((d) => d !== date);
            const newStreak = isCompleting ? habit.streak + 1 : Math.max(0, habit.streak - 1);
            return {
              ...habit,
              completed: isCompleting,
              streak: newStreak,
              bestStreak: Math.max(habit.bestStreak, newStreak),
              completedDates: newCompletedDates,
            };
          }),
        })),

      addHabit: (habit) =>
        set((state) => ({
          habits: [...state.habits, habit],
        })),

      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      resetDailyHabits: () =>
        set((state) => ({
          habits: state.habits.map((habit) => ({ ...habit, completed: false })),
        })),

      getCompletedToday: () => get().habits.filter((h) => h.completed).length,
    }),
    {
      name: "nossa-maternidade-habits",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
