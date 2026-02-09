import { togglePostLike } from "@/api/community";
import { communityKeys } from "@/api/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await togglePostLike(postId);
      if (error) {
        throw error;
      }
      return postId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

