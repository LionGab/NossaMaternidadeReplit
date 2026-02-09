/**
 * usePremium Hook
 *
 * Combines premium status checking with purchase functionality
 * Wrapper around RevenueCat service and premium store
 */

import { useState, useEffect, useCallback } from "react";
import type { PurchasesPackage, PurchasesOffering } from "react-native-purchases";
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  getIsConfigured,
} from "../services/revenuecat";
import { usePremiumStore } from "../state/premium-store";
import { logger } from "../utils/logger";

interface UsePremiumReturn {
  isPremium: boolean;
  offerings: PurchasesOffering | null;
  isLoading: boolean;
  offeringsError: string | null;
  purchase: (pkg: PurchasesPackage) => Promise<{ success: boolean; error?: string }>;
  restore: () => Promise<{ success: boolean; error?: string }>;
  refreshOfferings: () => Promise<void>;
}

/**
 * Hook for premium status and purchase operations
 *
 * Provides:
 * - isPremium: Current premium status from store
 * - offerings: Available RevenueCat packages
 * - purchase: Function to purchase a package
 * - restore: Function to restore purchases
 * - isLoading: Loading state for offerings
 */
export function usePremium(): UsePremiumReturn {
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [offeringsError, setOfferingsError] = useState<string | null>(null);

  // Get premium status from store
  const isPremium = usePremiumStore((s) => s.isPremium);
  const syncWithRevenueCat = usePremiumStore((s) => s.syncWithRevenueCat);

  // Function to load/refresh offerings
  const refreshOfferings = useCallback(async () => {
    try {
      setIsLoading(true);
      setOfferingsError(null);

      if (!getIsConfigured()) {
        logger.info("RevenueCat not configured (likely Expo Go)", "usePremium");
        setOfferingsError("not_configured");
        return;
      }

      const result = await getOfferings();
      setOfferings(result);

      if (!result || !result.availablePackages?.length) {
        setOfferingsError("no_packages");
        logger.warn("No packages available in offerings", "usePremium");
      } else {
        logger.info("Offerings loaded", "usePremium", {
          available: result.availablePackages.length,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      setOfferingsError(errorMsg);
      logger.error(
        "Failed to load offerings",
        "usePremium",
        error instanceof Error ? error : new Error(errorMsg)
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load offerings on mount
  useEffect(() => {
    refreshOfferings();
  }, [refreshOfferings]);

  // Purchase function
  const purchase = useCallback(
    async (pkg: PurchasesPackage): Promise<{ success: boolean; error?: string }> => {
      try {
        if (!getIsConfigured()) {
          return { success: false, error: "not_configured" };
        }

        const result = await purchasePackage(pkg);

        if (result.success) {
          // Sync premium status after successful purchase
          await syncWithRevenueCat();
          // Refresh offerings to update UI state
          await refreshOfferings();
        }

        return result;
      } catch (error) {
        logger.error(
          "Purchase failed",
          "usePremium",
          error instanceof Error ? error : new Error(String(error))
        );
        return { success: false, error: "unknown" };
      }
    },
    [syncWithRevenueCat, refreshOfferings]
  );

  // Restore function
  const restore = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!getIsConfigured()) {
        return { success: false, error: "not_configured" };
      }

      const result = await restorePurchases();

      if (result.success) {
        // Sync premium status after successful restore
        await syncWithRevenueCat();
      }

      return result;
    } catch (error) {
      logger.error(
        "Restore failed",
        "usePremium",
        error instanceof Error ? error : new Error(String(error))
      );
      return { success: false, error: "unknown" };
    }
  }, [syncWithRevenueCat]);

  return {
    isPremium,
    offerings,
    isLoading,
    offeringsError,
    purchase,
    restore,
    refreshOfferings,
  };
}
