/**
 * Vitest configuration for Supabase Edge Functions testing
 * Edge Functions run on Deno runtime, so we need special mocking
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["supabase/functions/__tests__/**/*.test.ts"],
    globals: true,
    environment: "node", // Simulate Deno in Node
    setupFiles: ["./supabase/functions/__tests__/setup.ts"],
    pool: "forks", // Force ESM compatibility
    singleFork: true, // Vitest 4+ moved poolOptions to top-level
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["supabase/functions/**/*.ts"],
      exclude: [
        "supabase/functions/__tests__/**",
        "supabase/functions/_shared/**", // Shared utils tested indirectly
      ],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
    // Increase timeout for edge function tests
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
