/**
 * Testes para rate-limiter.ts
 * Valida limites de requisições e proteção anti-spam
 */

import { rateLimiter } from "../rate-limiter";

describe("RateLimiter", () => {
  beforeEach(() => {
    // Reset limiter state before each test
    rateLimiter.reset("nathia");
    rateLimiter.reset("nathia-burst");
  });

  describe("canProceed", () => {
    it("should allow first request", () => {
      const result = rateLimiter.canProceed("nathia");
      expect(result).toBe(true);
    });

    it("should allow requests within limit", () => {
      // Limite: 20 requests/min para nathia
      for (let i = 0; i < 20; i++) {
        expect(rateLimiter.canProceed("nathia")).toBe(true);
      }
    });

    it("should block requests exceeding limit", () => {
      // Limite: 20 requests/min
      for (let i = 0; i < 20; i++) {
        rateLimiter.canProceed("nathia");
      }

      expect(rateLimiter.canProceed("nathia")).toBe(false);
    });

    it("should allow burst protection to block spam", () => {
      // Limite burst: 5 requests/10s
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.canProceed("nathia-burst")).toBe(true);
      }

      expect(rateLimiter.canProceed("nathia-burst")).toBe(false);
    });

    it("should allow unknown keys (no config)", () => {
      const result = rateLimiter.canProceed("unknown-key");
      expect(result).toBe(true);
    });

    it("should clean old requests from window", async () => {
      // Configurar limiter com janela curta
      rateLimiter.setConfig("test-short", {
        maxRequests: 2,
        windowMs: 100, // 100ms window
      });

      // Fazer 2 requests (limite)
      expect(rateLimiter.canProceed("test-short")).toBe(true);
      expect(rateLimiter.canProceed("test-short")).toBe(true);
      expect(rateLimiter.canProceed("test-short")).toBe(false);

      // Aguardar janela expirar
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Deve permitir novamente
      expect(rateLimiter.canProceed("test-short")).toBe(true);
    });
  });

  describe("getRemainingRequests", () => {
    it("should return max requests when no requests made", () => {
      const remaining = rateLimiter.getRemainingRequests("nathia");
      expect(remaining).toBe(20);
    });

    it("should return correct remaining count", () => {
      rateLimiter.canProceed("nathia");
      rateLimiter.canProceed("nathia");
      rateLimiter.canProceed("nathia");

      const remaining = rateLimiter.getRemainingRequests("nathia");
      expect(remaining).toBe(17);
    });

    it("should return 0 when limit exceeded", () => {
      for (let i = 0; i < 21; i++) {
        rateLimiter.canProceed("nathia");
      }

      const remaining = rateLimiter.getRemainingRequests("nathia");
      expect(remaining).toBe(0);
    });

    it("should return undefined for unknown keys", () => {
      const remaining = rateLimiter.getRemainingRequests("unknown");
      expect(remaining).toBeUndefined();
    });
  });

  describe("getResetTime", () => {
    it("should return reset time after first request", () => {
      rateLimiter.canProceed("nathia");
      const resetTime = rateLimiter.getResetTime("nathia");

      expect(resetTime).toBeGreaterThan(0);
      expect(resetTime).toBeLessThanOrEqual(60000); // Max 60s (window)
    });

    it("should return 0 for keys with no state", () => {
      const resetTime = rateLimiter.getResetTime("nathia");
      expect(resetTime).toBe(0);
    });
  });

  describe("reset", () => {
    it("should reset limiter state", () => {
      rateLimiter.canProceed("nathia");
      rateLimiter.canProceed("nathia");

      rateLimiter.reset("nathia");

      const remaining = rateLimiter.getRemainingRequests("nathia");
      expect(remaining).toBe(20); // Back to max
    });
  });

  describe("setConfig", () => {
    it("should allow custom config", () => {
      rateLimiter.setConfig("custom", {
        maxRequests: 3,
        windowMs: 1000,
      });

      expect(rateLimiter.canProceed("custom")).toBe(true);
      expect(rateLimiter.canProceed("custom")).toBe(true);
      expect(rateLimiter.canProceed("custom")).toBe(true);
      expect(rateLimiter.canProceed("custom")).toBe(false);
    });

    it("should update existing config", () => {
      rateLimiter.setConfig("nathia", {
        maxRequests: 5,
        windowMs: 10000,
      });

      const remaining = rateLimiter.getRemainingRequests("nathia");
      expect(remaining).toBe(5);
    });
  });
});
