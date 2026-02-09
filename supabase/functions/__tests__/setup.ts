/**
 * Global test setup for Edge Functions
 * Configures Deno globals, environment variables, and fetch mocks
 */

// Jest is available globally in test environment

// ============================================
// MOCK DENO GLOBALS
// ============================================

// Edge Functions run on Deno runtime, but we're testing in Node
// We need to mock Deno APIs
(global as any).Deno = {
  env: {
    get: jest.fn((key: string) => {
      // Return test environment variables
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
  },
  serve: jest.fn(),
  readTextFile: jest.fn(),
  errors: {
    NotFound: class NotFound extends Error {},
  },
};

// ============================================
// MOCK FETCH API
// ============================================

// Global fetch mock (can be overridden per test)
global.fetch = jest.fn();

// ============================================
// MOCK CONSOLE (prevent noise in test output)
// ============================================

// Suppress console.log in tests (keep errors visible)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  // Keep warn and error for debugging
};

// ============================================
// TEST UTILITIES
// ============================================

/**
 * Create a mock JWT token for testing
 */
export function createMockJWT(userId = "test-user-id"): string {
  // Simple base64-encoded JWT-like string for testing
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp: Date.now() + 3600000 })).toString(
    "base64"
  );
  const signature = "mock-signature";
  return `${header}.${payload}.${signature}`;
}

/**
 * Create mock headers for Edge Function requests
 */
export function createMockHeaders(overrides?: Record<string, string>): Headers {
  const headers = new Headers({
    "content-type": "application/json",
    authorization: `Bearer ${createMockJWT()}`,
    ...overrides,
  });
  return headers;
}

/**
 * Create a mock Request object
 */
export function createMockRequest(
  body?: any,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    url?: string;
  }
): Request {
  const url = options?.url || "https://test.supabase.co/functions/v1/test";
  const method = options?.method || "POST";
  const headers = createMockHeaders(options?.headers);

  return new Request(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Reset all mocks between tests
 */
export function resetAllMocks() {
  jest.clearAllMocks();
  (global.fetch as any).mockReset();
}

// ============================================
// GLOBAL SETUP/TEARDOWN
// ============================================

// Reset mocks before each test
beforeEach(() => {
  resetAllMocks();
});
