import { reportContent } from "@/api/community";
import { communityKeys } from "@/api/queryKeys";
import type { ReportReason } from "@/types/community";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReportPostInput {
  description?: string;
  postId: string;
  reason: ReportReason;
}

export function useReportPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ description, postId, reason }: ReportPostInput) => {
      const { error, reportId } = await reportContent("post", postId, reason, description);
      if (error) {
        throw error;
      }
      return reportId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

