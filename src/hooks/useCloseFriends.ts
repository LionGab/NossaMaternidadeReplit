/**
 * useCloseFriends Hook
 * Verifica se o usuário atual é "Close Friend" da Nath
 * 
 * Close Friends têm acesso a conteúdo exclusivo no MundodaNath
 */

import { useMemo } from "react";
import { useAppStore } from "../state/store";
import { useIsPremium, usePremiumStore } from "../state/premium-store";

interface UseCloseFriendsReturn {
  isCloseFriend: boolean;
  isLoading: boolean;
  closeFriendSince: Date | null;
}

/**
 * Hook para verificar se o usuário atual é Close Friend
 * 
 * Critérios para ser Close Friend:
 * 1. Ser assinante Premium ativo (acesso ao conteúdo exclusivo via RevenueCat)
 * 2. Estar autenticado no app
 * 
 * @example
 * const { isCloseFriend } = useCloseFriends();
 * if (isCloseFriend) {
 *   // Mostrar conteúdo exclusivo
 * }
 */
export function useCloseFriends(): UseCloseFriendsReturn {
  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isPremium = useIsPremium();
  const customerInfo = usePremiumStore((s) => s.customerInfo);

  const isCloseFriend = useMemo(() => {
    if (!isAuthenticated || !user) {
      return false;
    }
    return isPremium;
  }, [isAuthenticated, user, isPremium]);

  const isLoading = isAuthenticated && !user;

  const closeFriendSince = useMemo(() => {
    if (!isCloseFriend) {
      return null;
    }
    
    const activeEntitlements = customerInfo?.entitlements?.active;
    if (activeEntitlements) {
      const premiumEntitlement = activeEntitlements.premium || activeEntitlements.Pro;
      if (premiumEntitlement?.originalPurchaseDate) {
        return new Date(premiumEntitlement.originalPurchaseDate);
      }
    }
    
    return null;
  }, [isCloseFriend, customerInfo]);

  return {
    isCloseFriend,
    isLoading,
    closeFriendSince,
  };
}
