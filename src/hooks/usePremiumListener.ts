/**
 * Hook que escuta mudanças no entitlement premium em real-time
 * Deve ser usado no App.tsx (uma vez, global)
 *
 * PR-D: Real-time subscription updates via RevenueCat listener
 */
import { useEffect } from "react";
import { Platform } from "react-native";
import Purchases, { CustomerInfo, CustomerInfoUpdateListener } from "react-native-purchases";
import { usePremiumStore } from "../state/premium-store";
import { PREMIUM_ENTITLEMENT, getIsConfigured } from "../services/revenuecat";
import { isExpoGo } from "../utils/expo";
import { logger } from "../utils/logger";

export function usePremiumListener() {
  const setPremiumStatus = usePremiumStore((s) => s.setPremiumStatus);
  const setCustomerInfo = usePremiumStore((s) => s.setCustomerInfo);

  useEffect(() => {
    // Skip on web or Expo Go
    if (Platform.OS === "web" || isExpoGo()) {
      return;
    }

    // Wait for RevenueCat to be configured
    if (!getIsConfigured()) {
      logger.debug("RevenueCat not configured, skipping listener", "PremiumListener");
      return;
    }

    // Define listener function to enable proper cleanup
    const listener: CustomerInfoUpdateListener = (info: CustomerInfo) => {
      const isPremium = info.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

      logger.info("CustomerInfo updated (real-time)", "PremiumListener", {
        isPremium,
        activeEntitlements: Object.keys(info.entitlements.active),
      });

      setPremiumStatus(isPremium);
      setCustomerInfo(info, "listener");
    };

    // Register listener for real-time premium status updates
    Purchases.addCustomerInfoUpdateListener(listener);

    logger.debug("Premium listener registered", "PremiumListener");

    // Cleanup: remove listener when component unmounts
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
      logger.debug("Premium listener removed", "PremiumListener");
    };
  }, [setPremiumStatus, setCustomerInfo]);
}
