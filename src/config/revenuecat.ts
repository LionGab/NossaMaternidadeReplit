/**
 * RevenueCat Configuration
 * Central configuration for RevenueCat entitlement IDs
 */

/**
 * Premium entitlement identifier
 * Uses environment variable with fallback to 'premium'
 * Must match the entitlement ID configured in RevenueCat dashboard
 */
export const RC_ENTITLEMENT_PREMIUM: string =
  process.env.EXPO_PUBLIC_RC_ENTITLEMENT_PREMIUM?.trim() || "premium";
