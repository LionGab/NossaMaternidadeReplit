/**
 * Nossa Maternidade - RevenueCat Service
 * Service layer para integração com RevenueCat SDK
 *
 * @module revenuecat
 */

import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
  PurchasesError,
} from "react-native-purchases";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRevenueCatKey } from "../config/env";
import { logger } from "../utils/logger";
import { isExpoGo } from "../utils/expo";
import { withTimeout, TimeoutError } from "../utils/withTimeout";
import { bootLogger } from "../utils/bootLogger";

// Entitlement ID - must match RevenueCat dashboard
export const PREMIUM_ENTITLEMENT = "premium";

// Product identifiers (must match App Store Connect + Google Play Console + RevenueCat)
export const PRODUCT_IDS = {
  MONTHLY: "nossa_maternidade_monthly",
  YEARLY: "nossa_maternidade_yearly",
  // Legacy IDs (for backwards compatibility)
  MONTHLY_LEGACY: "com.nossamaternidade.subscription.monthly",
  YEARLY_LEGACY: "com.nossamaternidade.subscription.annual",
} as const;

// Preços em BRL (para referência)
export const PRICES_BRL = {
  MONTHLY: 19.99,
  YEARLY: 79.99,
  YEARLY_MONTHLY_EQUIVALENT: 6.67, // R$79.99 / 12
  SAVINGS_PERCENT: 67, // (19.99 - 6.67) / 19.99 * 100
} as const;

// Flag para rastrear se RevenueCat foi configurado
let isConfigured = false;

// Premium status cache configuration
const PREMIUM_CACHE_KEY = "premium_status_cache_v1";
const PREMIUM_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

interface PremiumCache {
  isPremium: boolean;
  updatedAt: number;
}

/**
 * Read premium status from local cache
 * @returns Promise<PremiumCache | null>
 */
async function readPremiumCache(): Promise<PremiumCache | null> {
  try {
    const raw = await AsyncStorage.getItem(PREMIUM_CACHE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    // Type guard for cache structure
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as PremiumCache).isPremium !== "boolean" ||
      typeof (parsed as PremiumCache).updatedAt !== "number"
    ) {
      return null;
    }

    const cache = parsed as PremiumCache;
    const age = Date.now() - cache.updatedAt;

    // Return null if cache is expired
    if (age > PREMIUM_CACHE_TTL_MS) {
      return null;
    }

    return cache;
  } catch {
    return null;
  }
}

/**
 * Write premium status to local cache
 * @param isPremium - Current premium status
 */
async function writePremiumCache(isPremium: boolean): Promise<void> {
  try {
    const value: PremiumCache = { isPremium, updatedAt: Date.now() };
    await AsyncStorage.setItem(PREMIUM_CACHE_KEY, JSON.stringify(value));
  } catch (error) {
    logger.warn("Failed to write premium cache", "RevenueCat", { error });
  }
}

/**
 * Type guard to check if error is from RevenueCat
 */
function isPurchasesError(error: unknown): error is PurchasesError {
  return typeof error === "object" && error !== null && "userCancelled" in error;
}

/**
 * Get error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (isPurchasesError(error)) {
    return error.message || "Purchase error";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

/**
 * Initialize RevenueCat
 * @param userId - Optional user ID to identify user in RevenueCat
 * @returns Promise<void>
 */
export async function initializePurchases(userId?: string): Promise<void> {
  // RevenueCat não funciona no web
  if (Platform.OS === "web") {
    logger.debug("RevenueCat skipped on web platform", "RevenueCat");
    isConfigured = false;
    return;
  }

  // Expo Go não suporta IAP real (módulo nativo). Use Dev Client.
  if (isExpoGo()) {
    logger.info(
      "Expo Go detectado: RevenueCat desabilitado (use Dev Client para IAP).",
      "RevenueCat"
    );
    isConfigured = false;
    return;
  }

  const apiKey = getRevenueCatKey(Platform.OS === "ios" ? "ios" : "android");

  if (!apiKey || apiKey.trim() === "") {
    logger.warn(`No API key configured for ${Platform.OS}`, "RevenueCat", {
      keyLength: apiKey?.length || 0,
      platform: Platform.OS,
    });
    isConfigured = false;
    return;
  }

  try {
    bootLogger.markStageStart("revenuecat_configure");
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    // Configure is synchronous in RevenueCat SDK v5+
    // No need to wrap in Promise - just call it directly
    if (userId) {
      Purchases.configure({ apiKey, appUserID: userId });
    } else {
      Purchases.configure({ apiKey });
    }

    isConfigured = true;
    bootLogger.markStageEnd("revenuecat_configure", { success: true });
    logger.info("RevenueCat initialized successfully", "RevenueCat", {
      platform: Platform.OS,
      userId: userId || "anonymous",
    });
  } catch (error) {
    isConfigured = false;
    bootLogger.markStageEnd("revenuecat_configure", {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
    logger.error(
      "Failed to initialize RevenueCat",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
}

/**
 * Check if RevenueCat is configured
 * @returns boolean
 */
export function getIsConfigured(): boolean {
  return isConfigured;
}

/**
 * Get current offerings (available subscription packages)
 * @returns Promise<PurchasesOffering | null>
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  if (!isConfigured) {
    logger.warn("RevenueCat not configured. Call initializePurchases() first.", "RevenueCat");
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    logger.error(
      "Failed to get offerings",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    return null;
  }
}

/**
 * Get all available packages
 * @returns Promise<PurchasesPackage[]>
 */
export async function getPackages(): Promise<PurchasesPackage[]> {
  try {
    const offering = await getOfferings();
    return offering?.availablePackages || [];
  } catch (error) {
    logger.error(
      "Failed to get packages",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    return [];
  }
}

/**
 * Purchase a package
 * @param pkg - Package to purchase
 * @returns Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }>
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  if (!isConfigured) {
    return { success: false, error: "RevenueCat not configured" };
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

    return {
      success: isPremium,
      customerInfo,
    };
  } catch (error) {
    // User cancelled
    if (isPurchasesError(error) && error.userCancelled) {
      return { success: false, error: "cancelled" };
    }

    logger.error(
      "Purchase failed",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Restore purchases
 * @returns Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }>
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  if (!isConfigured) {
    return { success: false, error: "RevenueCat not configured" };
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

    return {
      success: isPremium,
      customerInfo,
    };
  } catch (error) {
    logger.error(
      "Restore failed",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Check if user has premium access
 * Uses local cache as fallback when network request fails
 * @returns Promise<boolean>
 */
export async function checkPremiumStatus(): Promise<boolean> {
  if (!isConfigured) {
    // Even if not configured, check cache for offline support
    const cached = await readPremiumCache();
    return cached?.isPremium ?? false;
  }

  try {
    bootLogger.markStageStart("premium_status_check");

    // Timeout: 5s to prevent hangs
    const customerInfo = await withTimeout(Purchases.getCustomerInfo(), 5000, "getCustomerInfo");
    const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

    // Update cache on successful fetch
    await writePremiumCache(isPremium);
    bootLogger.markStageEnd("premium_status_check", { success: true, isPremium });

    return isPremium;
  } catch (error) {
    const isTimeoutError = error instanceof TimeoutError;

    if (isTimeoutError) {
      bootLogger.record("premium_status_check_timeout");
      logger.warn("Premium status check timed out (5s). Using cache.", "RevenueCat");
    } else {
      bootLogger.markStageEnd("premium_status_check", {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      logger.warn("Failed to check premium status, using cache", "RevenueCat", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Fallback to cached value on network error or timeout
    const cached = await readPremiumCache();
    if (cached !== null) {
      logger.info("Using cached premium status", "RevenueCat", {
        isPremium: cached.isPremium,
        cacheAge: Math.round((Date.now() - cached.updatedAt) / 1000 / 60) + " minutes",
      });
      return cached.isPremium;
    }

    // No cache available, return false as last resort
    return false;
  }
}

/**
 * Get customer info
 * @returns Promise<CustomerInfo | null>
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isConfigured) {
    return null;
  }

  try {
    bootLogger.markStageStart("get_customer_info");

    // Timeout: 5s to prevent hangs
    const customerInfo = await withTimeout(Purchases.getCustomerInfo(), 5000, "getCustomerInfo");

    bootLogger.markStageEnd("get_customer_info", { success: true });
    return customerInfo;
  } catch (error) {
    const isTimeoutError = error instanceof TimeoutError;

    if (isTimeoutError) {
      bootLogger.record("get_customer_info_timeout");
      logger.warn("Get customer info timed out (5s)", "RevenueCat");
    } else {
      bootLogger.markStageEnd("get_customer_info", {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
      logger.error(
        "Failed to get customer info",
        "RevenueCat",
        error instanceof Error ? error : new Error(String(error))
      );
    }

    return null;
  }
}

/**
 * Login user to RevenueCat
 * @param userId - User ID to login
 * @returns Promise<void>
 */
export async function loginUser(userId: string): Promise<void> {
  if (!isConfigured) {
    logger.warn("RevenueCat not configured. Call initializePurchases() first.", "RevenueCat");
    return;
  }

  try {
    await Purchases.logIn(userId);
    logger.info(`User logged in: ${userId}`, "RevenueCat");
  } catch (error) {
    logger.error(
      "Failed to login user",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Logout user from RevenueCat
 * @returns Promise<void>
 */
export async function logoutUser(): Promise<void> {
  if (!isConfigured) {
    return;
  }

  try {
    await Purchases.logOut();
    logger.info("User logged out", "RevenueCat");
  } catch (error) {
    logger.error(
      "Failed to logout user",
      "RevenueCat",
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Format price for display
 * @param priceString - Price string from RevenueCat
 * @returns string
 */
export function formatPrice(priceString: string): string {
  return priceString;
}

/**
 * Calculate monthly equivalent for yearly price
 * @param yearlyPrice - Yearly price
 * @returns number
 */
export function calculateMonthlyEquivalent(yearlyPrice: number): number {
  return Math.round((yearlyPrice / 12) * 100) / 100;
}

/**
 * Calculate savings percentage
 * @param monthlyPrice - Monthly price
 * @param yearlyPrice - Yearly price
 * @returns number
 */
export function calculateSavingsPercent(monthlyPrice: number, yearlyPrice: number): number {
  const yearlyMonthlyEquivalent = yearlyPrice / 12;
  const savings = ((monthlyPrice - yearlyMonthlyEquivalent) / monthlyPrice) * 100;
  return Math.round(savings);
}

/**
 * Get trial info from package
 * @param pkg - Package to check
 * @returns { hasTrialPeriod: boolean; trialDays: number }
 */
export function getTrialInfo(pkg: PurchasesPackage): {
  hasTrialPeriod: boolean;
  trialDays: number;
} {
  const intro = pkg.product.introPrice;

  if (intro && intro.price === 0) {
    // Parse trial period (e.g., "P7D" = 7 days, "P1W" = 1 week)
    const periodUnit = intro.periodUnit;
    const periodNumber = intro.periodNumberOfUnits;

    let trialDays = 0;
    if (periodUnit === "DAY") {
      trialDays = periodNumber;
    } else if (periodUnit === "WEEK") {
      trialDays = periodNumber * 7;
    } else if (periodUnit === "MONTH") {
      trialDays = periodNumber * 30;
    }

    return { hasTrialPeriod: true, trialDays };
  }

  return { hasTrialPeriod: false, trialDays: 0 };
}
