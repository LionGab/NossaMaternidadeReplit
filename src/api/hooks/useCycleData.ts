import { fetchCycleData, type CycleData } from "@/api/cycle";
import { cycleKeys } from "@/api/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useCycleData() {
  return useQuery<CycleData, Error>({
    queryKey: cycleKeys.data(),
    queryFn: fetchCycleData,
  });
}
