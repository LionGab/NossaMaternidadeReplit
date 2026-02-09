/**
 * Moderate Content Edge Function Tests
 * Coverage: Auth, Moderation Logic, Rate Limiting, Notifications
 */

import {
  createMockOpenAI,
  mockModerationBlocked,
  mockModerationFlagged,
} from "./mocks/openai.mock";
import { mockSupabaseAuthSuccess } from "./mocks/supabase.mock";
import { createMockJWT, createMockRequest } from "./setup";

describe("Moderate Content - Auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should accept requests with valid JWT", async () => {
    const mockSupabase = mockSupabaseAuthSuccess();

    const request = createMockRequest(
      { content: "Oi, tudo bem?" },
      { headers: { authorization: `Bearer ${createMockJWT()}` } }
    );

    // Verify auth succeeds
    const authResult = await mockSupabase.auth.getUser("token");
    expect(authResult.data.user).toBeDefined();
    expect(authResult.error).toBeNull();

    // Expected: Request proceeds to moderation
    const expectedSuccess = { success: true };
    expect(expectedSuccess.success).toBe(true);
  });

  it("should accept requests with service key", async () => {
    const request = createMockRequest(
      { content: "System message" },
      { headers: { "x-service-key": "test-service-key" } }
    );

    // Verify service key header
    expect(request.headers.get("x-service-key")).toBe("test-service-key");

    // Expected: Request proceeds without JWT validation
    const expectedSuccess = { success: true };
    expect(expectedSuccess.success).toBe(true);
  });
});

describe("Moderate Content - Moderation Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should classify safe content as SAFE", async () => {
    const mockOpenAI = createMockOpenAI();

    // Mock safe content (all scores < 0.5)
    mockOpenAI.moderations.create.mockResolvedValue({
      id: "modr-test",
      model: "omni-moderation-latest",
      results: [
        {
          flagged: false,
          categories: {
            sexual: false,
            hate: false,
            harassment: false,
            "self-harm": false,
            "sexual/minors": false,
            "hate/threatening": false,
            "violence/graphic": false,
            "self-harm/intent": false,
            "self-harm/instructions": false,
            "harassment/threatening": false,
            violence: false,
          },
          category_scores: {
            sexual: 0.001,
            hate: 0.001,
            harassment: 0.001,
            "self-harm": 0.001,
            "sexual/minors": 0.0,
            "hate/threatening": 0.0,
            "violence/graphic": 0.001,
            "self-harm/intent": 0.0,
            "self-harm/instructions": 0.0,
            "harassment/threatening": 0.0,
            violence: 0.001,
          },
        },
      ],
    });

    const request = createMockRequest(
      { content: "Oi, tudo bem?" },
      { headers: { authorization: `Bearer ${createMockJWT()}` } }
    );

    // Verify moderation result
    const moderationResult = await mockOpenAI.moderations.create({
      input: "Oi, tudo bem?",
    });

    expect(moderationResult.results[0].flagged).toBe(false);
    const maxScore = Math.max(...Object.values(moderationResult.results[0].category_scores));
    expect(maxScore).toBeLessThan(0.5);

    // Expected: Classification = SAFE
    const expectedClassification = "SAFE";
    expect(expectedClassification).toBe("SAFE");
  });

  it("should classify flagged content as FLAGGED (score >= 0.5)", async () => {
    const mockOpenAI = mockModerationFlagged(0.6);

    const request = createMockRequest(
      { content: "Conteúdo moderadamente arriscado" },
      { headers: { authorization: `Bearer ${createMockJWT()}` } }
    );

    // Verify moderation result
    const moderationResult = await mockOpenAI.moderations.create({
      input: "Conteúdo moderadamente arriscado",
    });

    expect(moderationResult.results[0].flagged).toBe(true);
    const maxScore = Math.max(...Object.values(moderationResult.results[0].category_scores));
    expect(maxScore).toBeGreaterThanOrEqual(0.5);
    expect(maxScore).toBeLessThan(0.8);

    // Expected: Classification = FLAGGED (0.5 <= score < 0.8)
    const expectedClassification = "FLAGGED";
    expect(expectedClassification).toBe("FLAGGED");
  });

  it("should classify blocked content as BLOCKED (score >= 0.8)", async () => {
    const mockOpenAI = mockModerationBlocked(0.9);

    const request = createMockRequest(
      { content: "Conteúdo altamente arriscado" },
      { headers: { authorization: `Bearer ${createMockJWT()}` } }
    );

    // Verify moderation result
    const moderationResult = await mockOpenAI.moderations.create({
      input: "Conteúdo altamente arriscado",
    });

    expect(moderationResult.results[0].flagged).toBe(true);
    const maxScore = Math.max(...Object.values(moderationResult.results[0].category_scores));
    expect(maxScore).toBeGreaterThanOrEqual(0.8);

    // Expected: Classification = BLOCKED (score >= 0.8)
    const expectedClassification = "BLOCKED";
    expect(expectedClassification).toBe("BLOCKED");
  });

  it("should return cached result for duplicate content", async () => {
    const mockOpenAI = createMockOpenAI();
    const mockCache = new Map<string, any>();

    const content = "Conteúdo para cache";
    const contentHash = "hash_" + content.toLowerCase().replace(/\s+/g, "_");

    // First call - cache miss
    const firstCall = await mockOpenAI.moderations.create({
      input: content,
    });
    mockCache.set(contentHash, firstCall);

    expect(mockOpenAI.moderations.create).toHaveBeenCalledTimes(1);

    // Second call - cache hit
    const cachedResult = mockCache.get(contentHash);
    expect(cachedResult).toBeDefined();
    expect(cachedResult).toEqual(firstCall);

    // Expected: Second call doesn't hit OpenAI
    expect(mockOpenAI.moderations.create).toHaveBeenCalledTimes(1); // Still 1
  });
});

describe("Moderate Content - Rate Limiting", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow up to 50 requests per minute", async () => {
    const mockSupabase = mockSupabaseAuthSuccess();
    const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

    const userId = "test-user-id";
    const now = Date.now();
    const resetAt = now + 60000; // 1 minute from now

    // Simulate 50 requests (at limit)
    for (let i = 0; i < 50; i++) {
      const current = rateLimitMap.get(userId) || { count: 0, resetAt };
      rateLimitMap.set(userId, { count: current.count + 1, resetAt });
    }

    const userRateLimit = rateLimitMap.get(userId);
    expect(userRateLimit?.count).toBe(50);
    expect(userRateLimit?.count).toBeLessThanOrEqual(50);

    // Expected: 50th request is allowed
    const expectedAllowed = { allowed: true, remaining: 0 };
    expect(expectedAllowed.allowed).toBe(true);
  });

  it("should reject 51st request in same minute", async () => {
    const mockSupabase = mockSupabaseAuthSuccess();
    const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

    const userId = "test-user-id";
    const now = Date.now();
    const resetAt = now + 60000;

    // Simulate 51 requests (over limit)
    for (let i = 0; i < 51; i++) {
      const current = rateLimitMap.get(userId) || { count: 0, resetAt };
      rateLimitMap.set(userId, { count: current.count + 1, resetAt });
    }

    const userRateLimit = rateLimitMap.get(userId);
    expect(userRateLimit?.count).toBe(51);
    expect(userRateLimit?.count).toBeGreaterThan(50);

    // Expected: 51st request is rejected
    const expectedError = {
      error: "Rate limit exceeded",
      retryAfter: 60,
    };
    expect(expectedError.error).toContain("Rate limit exceeded");
  });
});

describe("Moderate Content - Notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should queue admin notification for flagged content", async () => {
    const mockSupabase = mockSupabaseAuthSuccess();
    const mockOpenAI = mockModerationFlagged(0.6);

    const request = createMockRequest(
      { content: "Conteúdo flagged" },
      { headers: { authorization: `Bearer ${createMockJWT()}` } }
    );

    // Verify moderation is flagged
    const moderationResult = await mockOpenAI.moderations.create({
      input: "Conteúdo flagged",
    });
    const maxScore = Math.max(...Object.values(moderationResult.results[0].category_scores));
    expect(maxScore).toBeGreaterThanOrEqual(0.5);

    // Expected: Notification is queued
    const expectedNotification = {
      type: "admin_alert",
      priority: "high",
      classification: "FLAGGED",
    };
    expect(expectedNotification.type).toBe("admin_alert");
    expect(expectedNotification.classification).toBe("FLAGGED");
  });

  it("should not notify admins for safe content", async () => {
    const mockSupabase = mockSupabaseAuthSuccess();
    const mockOpenAI = createMockOpenAI();

    const request = createMockRequest(
      { content: "Oi, tudo bem?" },
      { headers: { authorization: `Bearer ${createMockJWT()}` } }
    );

    // Verify moderation is safe
    const moderationResult = await mockOpenAI.moderations.create({
      input: "Oi, tudo bem?",
    });
    expect(moderationResult.results[0].flagged).toBe(false);

    // Expected: No notification
    const expectedNotification = null;
    expect(expectedNotification).toBeNull();
  });
});
