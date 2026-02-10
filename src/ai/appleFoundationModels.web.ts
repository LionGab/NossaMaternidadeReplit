/**
 * Apple Foundation Models - Web stub
 *
 * expo-apple-foundation-models is iOS-only and not available on web.
 * This file is used by Metro when building for web (platform-specific extension).
 * All exports are no-ops / disabled so the app works without the native module.
 */

import type { AIMessage } from "../types/ai";

export function isAppleFoundationModelsEnabled(): boolean {
  return false;
}

export function isAppleFoundationModelsAvailable(): boolean {
  return false;
}

export async function generateWithAppleFoundationModels(_messages: AIMessage[]): Promise<string> {
  throw new Error("Apple Foundation Models not available");
}
