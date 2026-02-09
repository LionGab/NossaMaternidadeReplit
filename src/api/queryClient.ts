/**
 * TanStack Query Client Configuration
 *
 * Central query client with optimized defaults for mobile app:
 * - Stale time: 5 minutes (reduce network requests)
 * - GC time: 30 minutes (keep data in cache longer)
 * - Retry: 2 attempts with exponential backoff
 * - Refetch on window focus: disabled (mobile apps don't have window focus)
 */

import { QueryClient } from "@tanstack/react-query";
import { logger } from "@/utils/logger";

/**
 * Create QueryClient with mobile-optimized defaults
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Keep data in cache for 30 minutes
        gcTime: 30 * 60 * 1000,
        // Retry failed requests twice with exponential backoff
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Disable refetch on window focus (not applicable for mobile)
        refetchOnWindowFocus: false,
        // Don't refetch on mount if data is fresh
        refetchOnMount: "always",
        // Don't refetch on reconnect by default
        refetchOnReconnect: "always",
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        // Log mutation errors
        onError: (error) => {
          logger.error(
            "Mutation error",
            "QueryClient",
            error instanceof Error ? error : new Error(String(error))
          );
        },
      },
    },
  });
}

/**
 * Singleton query client instance
 */
export const queryClient = createQueryClient();
