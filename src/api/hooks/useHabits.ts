import { fetchHabits, toggleHabit, type ToggleHabitInput } from "@/api/habits";
import { habitsKeys } from "@/api/queryKeys";
import type { Habit } from "@/state/habits-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useHabits() {
  return useQuery<Habit[], Error>({
    queryKey: habitsKeys.list(),
    queryFn: fetchHabits,
  });
}

export function useToggleHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ToggleHabitInput) => toggleHabit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.all });
    },
  });
}

