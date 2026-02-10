/**
 * Apple Foundation Models (Apple Intelligence) provider integration.
 *
 * This is iOS-only and gated by env flag + runtime availability.
 *
 * Implementation notes:
 * - Uses a native Expo module (`expo-apple-foundation-models`) that bridges
 *   Apple's FoundationModels framework when available.
 * - Must always be optional; app should work on Android and on iOS devices
 *   without Apple Intelligence support.
 */

import { Platform } from "react-native";
import { isEnvEnabled } from "../config/env";
import { logger } from "../utils/logger";
import type { AIMessage } from "../types/ai";
import * as AppleFoundationModels from "expo-apple-foundation-models";

const ENV_FLAG = "EXPO_PUBLIC_ENABLE_APPLE_FOUNDATION_MODELS";

export function isAppleFoundationModelsEnabled(): boolean {
  return Platform.OS === "ios" && isEnvEnabled(ENV_FLAG);
}

export function isAppleFoundationModelsAvailable(): boolean {
  return isAppleFoundationModelsEnabled() && AppleFoundationModels.isAvailable();
}

export async function generateWithAppleFoundationModels(messages: AIMessage[]): Promise<string> {
  if (!isAppleFoundationModelsAvailable()) {
    throw new Error("Apple Foundation Models not available");
  }

  const start = Date.now();
  try {
    return await AppleFoundationModels.generate(messages);
  } finally {
    logger.info("Apple Foundation Models generate finished", "AppleFM", {
      latencyMs: Date.now() - start,
      messageCount: messages.length,
    });
  }
}
