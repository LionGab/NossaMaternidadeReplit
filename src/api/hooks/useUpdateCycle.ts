import {
  updateCycleSettings,
  upsertDailyLog,
  type UpdateCycleSettingsInput,
} from "@/api/cycle";
import { cycleKeys } from "@/api/queryKeys";
import type { DailyLog } from "@/types/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCycleSettingsInput) => updateCycleSettings(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cycleKeys.all });
    },
  });
}

export function useSaveCycleDailyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (log: DailyLog) => upsertDailyLog(log),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cycleKeys.all });
    },
  });
}

