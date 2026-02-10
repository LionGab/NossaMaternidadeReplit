/**
 * Stub for expo-apple-foundation-models (web / non-iOS).
 * Used by Metro resolver when platform is "web" so the native package is never loaded.
 * Same interface as the real module; all methods are no-ops / disabled.
 */

export function isAvailable(): boolean {
  return false;
}

export function generate(_messages: unknown): Promise<string> {
  return Promise.reject(new Error("Apple Foundation Models not available"));
}
