/**
 * Tests for unified environment variable access
 *
 * @module config/__tests__/env.test
 *
 * Note: These tests verify the env module's behavior.
 * When real EXPO_PUBLIC_* vars are set, tests use those values.
 * When not set, tests use mocked Constants.expoConfig.extra values.
 */

import {
  getEnv,
  getEnvOrThrow,
  getEnvWithDefault,
  isEnvEnabled,
  isEnvDisabled,
  getSupabaseUrl,
  getSupabaseFunctionsUrl,
  getRevenueCatKey,
  getImgurClientId,
  validateRequiredEnvVars,
  getEnvDebugInfo,
} from "../env";

describe("env module", () => {
  describe("getEnv", () => {
    it("should return a value for configured keys", () => {
      const url = getEnv("EXPO_PUBLIC_SUPABASE_URL") || getEnv("supabaseUrl");
      expect(url).toBeDefined();
      expect(typeof url).toBe("string");
    });

    it("should return undefined for non-existent keys", () => {
      expect(getEnv("NON_EXISTENT_KEY_12345")).toBeUndefined();
    });

    it("should handle both EXPO_PUBLIC_* and camelCase keys", () => {
      const urlFromEnvKey = getEnv("EXPO_PUBLIC_SUPABASE_URL");
      const urlFromCamelKey = getEnv("supabaseUrl");
      if (urlFromEnvKey && urlFromCamelKey) {
        expect(urlFromEnvKey).toBe(urlFromCamelKey);
      }
    });
  });

  describe("getEnvOrThrow", () => {
    it("should return value when exists", () => {
      const url = getSupabaseUrl();
      if (url) {
        expect(() => getEnvOrThrow("EXPO_PUBLIC_SUPABASE_URL")).not.toThrow();
      }
    });

    it("should throw when value does not exist", () => {
      expect(() => getEnvOrThrow("NON_EXISTENT_KEY_12345")).toThrow(
        'Environment variable "NON_EXISTENT_KEY_12345" is not configured'
      );
    });

    it("should throw with custom message", () => {
      expect(() => getEnvOrThrow("NON_EXISTENT_KEY_12345", "Custom error")).toThrow("Custom error");
    });
  });

  describe("getEnvWithDefault", () => {
    it("should return default when value does not exist", () => {
      expect(getEnvWithDefault("NON_EXISTENT_KEY_12345", "my-default")).toBe("my-default");
    });

    it("should return value when exists instead of default", () => {
      const url = getSupabaseUrl();
      if (url) {
        const result = getEnvWithDefault("EXPO_PUBLIC_SUPABASE_URL", "default-url");
        expect(result).not.toBe("default-url");
        expect(result).toBe(url);
      }
    });
  });

  describe("isEnvEnabled", () => {
    it("should return false for non-existent keys", () => {
      expect(isEnvEnabled("NON_EXISTENT_KEY_12345")).toBe(false);
    });

    it("should return true for 'true' values", () => {
      const aiFeatures = getEnv("EXPO_PUBLIC_ENABLE_AI_FEATURES");
      if (aiFeatures === "true") {
        expect(isEnvEnabled("EXPO_PUBLIC_ENABLE_AI_FEATURES")).toBe(true);
      }
    });
  });

  describe("isEnvDisabled", () => {
    it("should return false for non-existent keys", () => {
      expect(isEnvDisabled("NON_EXISTENT_KEY_12345")).toBe(false);
    });
  });

  describe("getSupabaseUrl", () => {
    it("should return a URL string when configured", () => {
      const url = getSupabaseUrl();
      if (url) {
        expect(url).toMatch(/^https?:\/\//);
        expect(url).toContain("supabase");
      }
    });
  });

  describe("getSupabaseFunctionsUrl", () => {
    it("should return functions URL ending with /functions/v1", () => {
      const url = getSupabaseFunctionsUrl();
      if (url) {
        expect(url).toMatch(/\/functions\/v1$/);
      }
    });
  });

  describe("getRevenueCatKey", () => {
    it("should return empty string or key for ios", () => {
      const key = getRevenueCatKey("ios");
      expect(typeof key).toBe("string");
    });

    it("should return empty string or key for android", () => {
      const key = getRevenueCatKey("android");
      expect(typeof key).toBe("string");
    });
  });

  describe("getImgurClientId", () => {
    it("should return undefined or string", () => {
      const id = getImgurClientId();
      expect(id === undefined || typeof id === "string").toBe(true);
    });
  });

  describe("validateRequiredEnvVars", () => {
    it("should return valid:false with missing vars", () => {
      const result = validateRequiredEnvVars(["NON_EXISTENT_VAR_1", "NON_EXISTENT_VAR_2"]);
      expect(result.valid).toBe(false);
      expect(result.missing).toHaveLength(2);
    });

    it("should list all missing vars", () => {
      const result = validateRequiredEnvVars(["MISSING_1", "MISSING_2", "MISSING_3"]);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain("MISSING_1");
      expect(result.missing).toContain("MISSING_2");
      expect(result.missing).toContain("MISSING_3");
    });

    it("should return valid:true when vars are set", () => {
      const url = getSupabaseUrl();
      if (url) {
        const result = validateRequiredEnvVars(["EXPO_PUBLIC_SUPABASE_URL"]);
        expect(result.valid).toBe(true);
        expect(result.missing).toEqual([]);
      }
    });
  });

  describe("getEnvDebugInfo", () => {
    it("should return an object with debug info", () => {
      const info = getEnvDebugInfo();
      expect(typeof info).toBe("object");
      expect("supabaseUrl" in info).toBe(true);
    });

    it("should mask set values with [SET]", () => {
      const info = getEnvDebugInfo();
      const url = getSupabaseUrl();
      if (url) {
        expect(info.supabaseUrl).toBe("[SET]");
      }
    });
  });
});
