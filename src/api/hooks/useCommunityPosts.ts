import { fetchPosts } from "@/api/community";
import { communityKeys } from "@/api/queryKeys";
import type { Post } from "@/types/navigation";
import { useQuery } from "@tanstack/react-query";

export function useCommunityPosts(limit: number = 20, offset: number = 0) {
  return useQuery<Post[], Error>({
    queryKey: communityKeys.posts({ limit, offset }),
    queryFn: async () => {
      const { data, error } = await fetchPosts(limit, offset);
      if (error) {
        throw error;
      }
      return data;
    },
  });
}

