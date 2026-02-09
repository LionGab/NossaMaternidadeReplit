/**
 * AuthContext - React Context para Autenticação
 *
 * Context Provider que expõe estado de autenticação para toda a árvore de componentes
 * Usa useAuth hook internamente para gerenciar estado
 *
 * @module context/AuthContext
 */

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth, type UseAuthReturn } from "@/hooks/useAuth";

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Provider do contexto de autenticação
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Hook para acessar o contexto de autenticação
 *
 * @throws Error se usado fora do AuthProvider
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, signIn, signOut } = useAuthContext();
 * ```
 */
export function useAuthContext(): UseAuthReturn {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}

/**
 * Hook opcional que retorna null se não estiver dentro do provider
 * Útil para componentes que podem ou não estar dentro do AuthProvider
 */
export function useAuthContextOptional(): UseAuthReturn | null {
  const context = useContext(AuthContext);
  return context ?? null;
}
