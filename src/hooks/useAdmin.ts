/**
 * useAdmin Hook
 * Verifica se o usuário atual é administrador
 */

import { useMemo } from "react";
import { useAppStore } from "../state";
import { isUserAdmin } from "../config/admin";

interface UseAdminReturn {
  isAdmin: boolean;
  isLoading: boolean;
}

/**
 * Hook para verificar se o usuário atual é admin
 *
 * @example
 * const { isAdmin } = useAdmin();
 * if (isAdmin) {
 *   // Mostrar botão de criar post
 * }
 */
export function useAdmin(): UseAdminReturn {
  const authUserId = useAppStore((s) => s.authUserId);
  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  const isAdmin = useMemo(() => {
    if (!isAuthenticated) {
      return false;
    }

    return isUserAdmin(authUserId, user?.email);
  }, [authUserId, user?.email, isAuthenticated]);

  // isLoading seria true enquanto carrega o perfil
  const isLoading = isAuthenticated && !user;

  return {
    isAdmin,
    isLoading,
  };
}
