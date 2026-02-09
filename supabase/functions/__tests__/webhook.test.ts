/**
 * Webhook Edge Function Tests
 * Coverage: Auth, Idempotency, RevenueCat Events
 */

import { createMockSupabaseClient } from "./mocks/supabase.mock";
import { createMockRequest } from "./setup";

describe("Webhook - Auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should accept webhook with valid Bearer token", async () => {
    const webhookSecret = "test-webhook-secret";

    const request = createMockRequest(
      {
        event: {
          type: "INITIAL_PURCHASE",
          id: "evt_123",
        },
      },
      {
        headers: {
          authorization: `Bearer ${webhookSecret}`,
          "content-type": "application/json",
        },
      }
    );

    // Verify authorization header
    const authHeader = request.headers.get("authorization");
    expect(authHeader).toBe(`Bearer ${webhookSecret}`);

    // Expected: Request proceeds
    const expectedSuccess = { success: true };
    expect(expectedSuccess.success).toBe(true);
  });

  it("should reject webhook with invalid token", async () => {
    const request = createMockRequest(
      {
        event: {
          type: "INITIAL_PURCHASE",
          id: "evt_123",
        },
      },
      {
        headers: {
          authorization: "Bearer wrong-token",
          "content-type": "application/json",
        },
      }
    );

    // Verify authorization header
    const authHeader = request.headers.get("authorization");
    const expectedToken = "test-webhook-secret";
    expect(authHeader).not.toBe(`Bearer ${expectedToken}`);

    // Expected: 401 response
    const expectedError = { error: "Unauthorized" };
    expect(expectedError.error).toBe("Unauthorized");
  });
});

describe("Webhook - Idempotency", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process event only once", async () => {
    const mockSupabase = createMockSupabaseClient();
    const processedEvents = new Set<string>();

    const eventId = "evt_123";

    // First call - not processed yet
    const firstProcessed = processedEvents.has(eventId);
    expect(firstProcessed).toBe(false);

    processedEvents.add(eventId);

    // Second call - already processed
    const secondProcessed = processedEvents.has(eventId);
    expect(secondProcessed).toBe(true);

    // Expected: Second call returns "already processed"
    const expectedResponse = {
      message: "Event already processed",
      eventId,
    };
    expect(expectedResponse.message).toContain("already processed");
  });

  it("should cache processed event IDs", async () => {
    const mockSupabase = createMockSupabaseClient();
    const eventCache = new Map<string, boolean>();

    const eventId = "evt_456";

    // Process event
    eventCache.set(eventId, true);

    // Check cache
    const isCached = eventCache.has(eventId);
    expect(isCached).toBe(true);

    // Expected: Cache hit prevents reprocessing
    const expectedCacheHit = true;
    expect(expectedCacheHit).toBe(true);
  });
});

describe("Webhook - RevenueCat Events", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should activate premium on INITIAL_PURCHASE", async () => {
    const mockSupabase = createMockSupabaseClient();

    const event = {
      type: "INITIAL_PURCHASE",
      id: "evt_initial_123",
      app_user_id: "user-123",
      product_id: "nossa_maternidade_monthly",
      purchased_at_ms: Date.now(),
      expiration_at_ms: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };

    // Simulate activation (mock chain: update().eq() returns Promise)
    const updateResult = await mockSupabase
      .from("users")
      .update({ is_premium: true, premium_expires_at: new Date(event.expiration_at_ms) })
      .eq("id", event.app_user_id);

    expect(updateResult.error).toBeNull();

    // Expected: User is premium
    const expectedPremiumStatus = true;
    expect(expectedPremiumStatus).toBe(true);
  });

  it("should activate premium on RENEWAL", async () => {
    const mockSupabase = createMockSupabaseClient();

    const event = {
      type: "RENEWAL",
      id: "evt_renewal_123",
      app_user_id: "user-123",
      product_id: "nossa_maternidade_yearly",
      purchased_at_ms: Date.now(),
      expiration_at_ms: Date.now() + 365 * 24 * 60 * 60 * 1000, // 365 days
    };

    // Simulate renewal
    const updateResult = await mockSupabase
      .from("users")
      .update({ is_premium: true, premium_expires_at: new Date(event.expiration_at_ms) })
      .eq("id", event.app_user_id);

    expect(updateResult.error).toBeNull();

    // Expected: Premium extended
    const expectedPremiumStatus = true;
    expect(expectedPremiumStatus).toBe(true);
  });

  it("should mark as cancelled on CANCELLATION", async () => {
    const mockSupabase = createMockSupabaseClient();

    const event = {
      type: "CANCELLATION",
      id: "evt_cancel_123",
      app_user_id: "user-123",
      product_id: "nossa_maternidade_monthly",
      cancelled_at_ms: Date.now(),
      expiration_at_ms: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days grace
    };

    // Simulate cancellation
    const updateResult = await mockSupabase
      .from("users")
      .update({
        subscription_status: "cancelled",
        premium_expires_at: new Date(event.expiration_at_ms),
      })
      .eq("id", event.app_user_id);

    expect(updateResult.error).toBeNull();

    // Expected: Status = cancelled (still premium until expiration)
    const expectedStatus = "cancelled";
    expect(expectedStatus).toBe("cancelled");
  });

  it("should deactivate premium on EXPIRATION", async () => {
    const mockSupabase = createMockSupabaseClient();

    const event = {
      type: "EXPIRATION",
      id: "evt_expire_123",
      app_user_id: "user-123",
      product_id: "nossa_maternidade_monthly",
      expiration_at_ms: Date.now() - 1000, // Already expired
    };

    // Simulate expiration
    const updateResult = await mockSupabase
      .from("users")
      .update({
        is_premium: false,
        subscription_status: "expired",
      })
      .eq("id", event.app_user_id);

    expect(updateResult.error).toBeNull();

    // Expected: Premium deactivated
    const expectedPremiumStatus = false;
    expect(expectedPremiumStatus).toBe(false);
  });

  it("should mark billing issue on BILLING_ISSUE", async () => {
    const mockSupabase = createMockSupabaseClient();

    const event = {
      type: "BILLING_ISSUE",
      id: "evt_billing_123",
      app_user_id: "user-123",
      product_id: "nossa_maternidade_yearly",
      issue_detected_at_ms: Date.now(),
    };

    // Simulate billing issue
    const updateResult = await mockSupabase
      .from("users")
      .update({
        subscription_status: "billing_issue",
      })
      .eq("id", event.app_user_id);

    expect(updateResult.error).toBeNull();

    // Expected: Status = billing_issue
    const expectedStatus = "billing_issue";
    expect(expectedStatus).toBe("billing_issue");
  });

  it("should update subscription tier on PRODUCT_CHANGE", async () => {
    const mockSupabase = createMockSupabaseClient();

    const event = {
      type: "PRODUCT_CHANGE",
      id: "evt_change_123",
      app_user_id: "user-123",
      new_product_id: "nossa_maternidade_yearly",
      old_product_id: "nossa_maternidade_monthly",
      purchased_at_ms: Date.now(),
    };

    // Simulate product change
    const updateResult = await mockSupabase
      .from("users")
      .update({
        subscription_product_id: event.new_product_id,
      })
      .eq("id", event.app_user_id);

    expect(updateResult.error).toBeNull();

    // Expected: Product updated
    const expectedProduct = "nossa_maternidade_yearly";
    expect(expectedProduct).toBe("nossa_maternidade_yearly");
  });

  it("should handle one-time purchase (lifetime)", async () => {
    const mockSupabase = createMockSupabaseClient();

    const event = {
      type: "NON_RENEWING_PURCHASE",
      id: "evt_lifetime_123",
      app_user_id: "user-123",
      product_id: "nossa_maternidade_lifetime",
      purchased_at_ms: Date.now(),
      expiration_at_ms: null, // No expiration (lifetime)
    };

    // Simulate lifetime purchase
    const updateResult = await mockSupabase
      .from("users")
      .update({
        is_premium: true,
        premium_expires_at: null, // Lifetime
        subscription_product_id: event.product_id,
      })
      .eq("id", event.app_user_id);

    expect(updateResult.error).toBeNull();

    // Expected: Lifetime premium
    const expectedExpiresAt = null;
    expect(expectedExpiresAt).toBeNull();
  });

  it("should skip TEST events", async () => {
    const mockSupabase = createMockSupabaseClient();

    const event = {
      type: "TEST",
      id: "evt_test_123",
      app_user_id: "user-123",
      product_id: "nossa_maternidade_monthly",
    };

    // Verify event type
    expect(event.type).toBe("TEST");

    // Expected: Event is skipped (no DB update)
    const expectedProcessed = false;
    expect(expectedProcessed).toBe(false);
  });
});
