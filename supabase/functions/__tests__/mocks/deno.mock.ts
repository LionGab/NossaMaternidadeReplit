/**
 * Mock Deno runtime APIs
 * Edge Functions run on Deno, but tests run in Node
 */

// Jest is available globally in test environment

export const mockDenoEnv = {
  get: jest.fn((key: string) => {
    const env: Record<string, string> = {
      SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
      SUPABASE_ANON_KEY: "test-anon-key",
      OPENAI_API_KEY: "test-openai-key",
      ANTHROPIC_API_KEY: "test-anthropic-key",
      GEMINI_API_KEY: "test-gemini-key",
      UPSTASH_REDIS_REST_URL: "https://test-redis.upstash.io",
      UPSTASH_REDIS_REST_TOKEN: "test-redis-token",
      REVENUECAT_WEBHOOK_SECRET: "test-webhook-secret",
      ALLOWED_ORIGINS: "http://localhost:3000,https://app.nossamaternidade.app",
    };
    return env[key];
  }),
  toObject: jest.fn(() => ({})),
};

export const mockDenoServe = jest.fn((handler: Function) => {
  // Mock Deno.serve - in tests we call the handler directly
  return {
    finished: Promise.resolve(),
  };
});

export function setupDenoMocks() {
  (global as any).Deno = {
    env: mockDenoEnv,
    serve: mockDenoServe,
    readTextFile: jest.fn(),
    errors: {
      NotFound: class NotFound extends Error {},
    },
  };
}
