/**
 * DEV BYPASS Configuration
 *
 * ⚠️ FOR LOCAL TESTING ONLY - NEVER COMMIT WITH BYPASS ENABLED
 *
 * This file allows you to bypass authentication/onboarding to quickly test app screens.
 *
 * Usage:
 * 1. Set ENABLE_DEV_BYPASS = true
 * 2. Restart Expo server (npm start)
 * 3. App will skip login and go straight to MainTabs
 *
 * Remember to set back to false before committing!
 */

export const DEV_CONFIG = {
  // Master switch - must be true for any bypass to work
  // ⚠️ PRODUCTION/TESTFLIGHT: Keep false for real user testing
  ENABLE_DEV_BYPASS: false,

  // Mock user data when bypass is enabled
  MOCK_USER: {
    id: "dev-test-user-001",
    name: "Mamãe",
    email: "teste@nossamaternidade.com",
    pregnancyStage: "pregnant" as const,
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    interests: ["exercise", "nutrition", "mindfulness"] as const,
    createdAt: new Date().toISOString(),
  },

  // Granular bypass flags - set individually to test specific flows
  // ⚠️ PRODUCTION/TESTFLIGHT: All should be false for real user flow
  BYPASS_LOGIN: false,
  BYPASS_NOTIFICATION_PERMISSION: false,
  BYPASS_ONBOARDING: false,
};

/**
 * Check if full bypass is active (skips ALL flows to MainApp)
 * Returns true only if ALL bypass flags are enabled
 */
export const isDevBypassActive = () => {
  const isDev = __DEV__;
  if (!isDev || !DEV_CONFIG.ENABLE_DEV_BYPASS) return false;

  // Only full bypass if ALL individual bypasses are true
  return (
    DEV_CONFIG.BYPASS_LOGIN &&
    DEV_CONFIG.BYPASS_NOTIFICATION_PERMISSION &&
    DEV_CONFIG.BYPASS_ONBOARDING
  );
};

/**
 * Check if login bypass is active
 */
export const isLoginBypassActive = () => {
  const isDev = __DEV__;
  return isDev && DEV_CONFIG.ENABLE_DEV_BYPASS && DEV_CONFIG.BYPASS_LOGIN;
};

/**
 * Check if notification permission bypass is active
 */
export const isNotificationBypassActive = () => {
  const isDev = __DEV__;
  return isDev && DEV_CONFIG.ENABLE_DEV_BYPASS && DEV_CONFIG.BYPASS_NOTIFICATION_PERMISSION;
};

/**
 * Check if onboarding bypass is active
 */
export const isOnboardingBypassActive = () => {
  const isDev = __DEV__;
  return isDev && DEV_CONFIG.ENABLE_DEV_BYPASS && DEV_CONFIG.BYPASS_ONBOARDING;
};
