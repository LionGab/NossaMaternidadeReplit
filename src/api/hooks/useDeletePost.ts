import { deletePost } from "@/api/community";
import { communityKeys, userKeys } from "@/api/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data, error } = await deletePost(postId);
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.myPosts() });
    },
  });
}
