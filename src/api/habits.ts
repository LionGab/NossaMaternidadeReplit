import { useHabitsStore, type Habit } from "@/state/habits-store";

export interface ToggleHabitInput {
  date: string;
  habitId: string;
}

export async function fetchHabits(): Promise<Habit[]> {
  return useHabitsStore.getState().habits;
}

export async function toggleHabit(input: ToggleHabitInput): Promise<Habit[]> {
  useHabitsStore.getState().toggleHabit(input.habitId, input.date);
  return useHabitsStore.getState().habits;
}

