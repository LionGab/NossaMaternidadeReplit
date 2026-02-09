/**
 * Social Authentication Service
 * Integração com Google e Apple Sign In via Supabase
 *
 * Referências de UX dos melhores apps femininos (Flo, Clue, Ovia):
 * - Login social deve ser simples e direto
 * - Priorizar Apple (iOS) e Google (Android/Web)
 *
 * Implementação:
 * - Apple Sign In: Nativo no iOS (sheet do sistema), OAuth no Android/Web
 * - Google: OAuth em todas as plataformas
 */

import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { logger } from "../utils/logger";
import { isExpoGo } from "../utils/expo";
import { supabase, getSupabaseDiagnostics } from "./supabase";

// Permitir que o browser feche corretamente após OAuth
WebBrowser.maybeCompleteAuthSession();

// Tipos
export type SocialProvider = "google" | "apple";

export interface SocialAuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
  error?: string;
}

// URLs de redirect - Tratamento especial para Web
function getRedirectUri(): string {
  // Na web, usar a URL atual como base
  if (Platform.OS === "web") {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/auth/callback`;
  }

  // Native: usar o scheme do app (deve corresponder ao app.config.js)
  // CRÍTICO: O formato deve ser exatamente: scheme://path
  // IMPORTANTE: Usar mesmo path que auth.ts para consistência
  const uri = AuthSession.makeRedirectUri({
    scheme: "nossamaternidade",
    path: "auth/callback",
  });

  // Log para debug
  const finalUri = uri || "nossamaternidade://auth/callback";
  logger.info("Redirect URI gerado", "SocialAuth", { uri: finalUri, platform: Platform.OS });

  return finalUri;
}

const REDIRECT_URI = getRedirectUri();

/**
 * Verifica se o Supabase está configurado
 */
function checkSupabase() {
  if (!supabase) {
    const diagnostics = getSupabaseDiagnostics();
    const errorMessage = [
      "Supabase não está configurado.",
      "",
      "Variáveis de ambiente faltando:",
      diagnostics.url
        ? `  ✓ EXPO_PUBLIC_SUPABASE_URL: ${diagnostics.url.substring(0, 40)}...`
        : "  ✗ EXPO_PUBLIC_SUPABASE_URL: faltando",
      diagnostics.hasKey
        ? "  ✓ EXPO_PUBLIC_SUPABASE_ANON_KEY: [configurado]"
        : "  ✗ EXPO_PUBLIC_SUPABASE_ANON_KEY: faltando",
      "",
      "Para corrigir:",
      "1. Crie arquivo .env.local na raiz do projeto",
      "2. Adicione: EXPO_PUBLIC_SUPABASE_URL=... e EXPO_PUBLIC_SUPABASE_ANON_KEY=...",
      "3. Ou configure em app.config.js → seção extra",
      "4. Reinicie o servidor Expo: npm start -- --clear",
    ].join("\n");

    logger.error("Verificação do Supabase falhou", "SocialAuth", new Error(errorMessage));
    throw new Error(errorMessage);
  }
  return supabase;
}

/**
 * Cria sessão a partir da URL de redirect do OAuth
 * Suporta tanto PKCE (code) quanto implicit flow (access_token/refresh_token)
 *
 * Baseado no padrão oficial do Supabase para Expo:
 * https://supabase.com/docs/guides/auth/social-login/auth-google#expo
 */
async function createSessionFromRedirect(url: string) {
  const client = checkSupabase();

  try {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) {
      throw new Error(`OAuth error: ${errorCode}`);
    }

    // 1) PKCE flow (vem code=...)
    if (params?.code) {
      logger.info("Processando PKCE flow (code)", "SocialAuth");
      const { data, error } = await client.auth.exchangeCodeForSession(params.code as string);

      if (error) {
        logger.error("Erro ao trocar code por sessão", "SocialAuth", error);
        throw error;
      }

      return data.session;
    }

    // 2) Implicit flow (vem access_token/refresh_token)
    const access_token = params?.access_token as string | undefined;
    const refresh_token = params?.refresh_token as string | undefined;

    if (!access_token || !refresh_token) {
      logger.warn("Tokens não encontrados na URL", "SocialAuth", { url });
      return null;
    }

    logger.info("Processando implicit flow (tokens)", "SocialAuth");
    const { data, error } = await client.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      logger.error("Erro ao definir sessão", "SocialAuth", error);
      throw error;
    }

    return data.session;
  } catch (error) {
    logger.error(
      "Erro ao criar sessão do redirect",
      "SocialAuth",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
}

/**
 * Detecta se o erro é causado por provider OAuth não configurado
 */
function isOAuthNotConfiguredError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = String(error).toLowerCase();

  // Padrões de erro quando provider não está configurado
  const patterns = [
    "provider is not enabled",
    "oauth provider not configured",
    "provider not found",
    "invalid provider",
    "cannot read property 'replace'",
    "replace is not a function",
    "malformed",
    "invalid response",
  ];

  return patterns.some(
    (pattern) => errorMessage.toLowerCase().includes(pattern) || errorString.includes(pattern)
  );
}

/**
 * Login com Google usando Supabase OAuth
 *
 * Baseado nos padrões do Flo e Clue que priorizam Google no Android
 */
export async function signInWithGoogle(): Promise<SocialAuthResult> {
  try {
    const client = checkSupabase();

    logger.info("Iniciando login com Google", "SocialAuth", {
      redirectUri: REDIRECT_URI,
      platform: Platform.OS,
    });

    // Web: usar redirect direto (não skipBrowserRedirect)
    if (Platform.OS === "web") {
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : REDIRECT_URI,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        logger.error("Erro no OAuth Google (web)", "SocialAuth", error);
        if (isOAuthNotConfiguredError(error) || error.message?.includes("not enabled")) {
          return {
            success: false,
            error:
              "Google OAuth não está habilitado no Supabase. Configure em: Dashboard → Authentication → Providers → Google. Veja docs/SUPABASE_OAUTH_SETUP.md",
          };
        }
        return {
          success: false,
          error: error.message || "Erro ao iniciar login com Google",
        };
      }

      // No web, o redirect acontece automaticamente
      // O callback será tratado pelo Supabase automaticamente via detectSessionInUrl
      return {
        success: true,
        // O usuário será redirecionado, então não retornamos user aqui
      };
    }

    // Native: usar WebBrowser com fluxo PKCE
    let data: { provider: string; url: string | null } | null = null;
    let error: unknown = null;

    try {
      // CRÍTICO: Usar fluxo PKCE (padrão Supabase para mobile)
      // Não passar queryParams que podem causar erro 400
      const result = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: REDIRECT_URI,
          skipBrowserRedirect: true,
          // PKCE é habilitado automaticamente pelo Supabase quando skipBrowserRedirect: true
        },
      });

      data = result.data;
      error = result.error;
    } catch (err) {
      // Captura erros de parsing (ex: .replace() em undefined)
      error = err;
      logger.error("Exceção ao chamar signInWithOAuth (Google)", "SocialAuth", err as Error);
    }

    if (error) {
      logger.error("Erro no OAuth Google", "SocialAuth", error as Error, {
        redirectUri: REDIRECT_URI,
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      // Verificar se é erro 400 (Bad Request) - geralmente redirect URI não autorizado
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("400") ||
        errorMessage.includes("bad request") ||
        errorMessage.includes("redirect_uri")
      ) {
        return {
          success: false,
          error: `Erro 400: Redirect URI não autorizado. Adicione "${REDIRECT_URI}" em Supabase Dashboard → Authentication → URL Configuration → Additional Redirect URLs`,
        };
      }

      // Verificar se é erro de provider não configurado
      if (isOAuthNotConfiguredError(error) || String(error).includes("not enabled")) {
        return {
          success: false,
          error:
            "Google OAuth não está habilitado no Supabase. Configure em: Dashboard → Authentication → Providers → Google. Veja docs/SUPABASE_OAUTH_SETUP.md",
        };
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    if (!data || !data.url) {
      return {
        success: false,
        error:
          "URL de autenticação não gerada. Verifique se o provider Google está habilitado no Supabase Dashboard.",
      };
    }

    // Abrir browser para autenticação
    let browserResult;
    try {
      browserResult = await WebBrowser.openAuthSessionAsync(data.url, REDIRECT_URI, {
        showInRecents: true,
      });
    } catch (err) {
      logger.error("Erro ao abrir browser para OAuth", "SocialAuth", err as Error);
      return {
        success: false,
        error: "Erro ao abrir navegador para autenticação",
      };
    }

    if (browserResult.type === "success" && browserResult.url) {
      // Criar sessão usando o padrão correto do Supabase
      try {
        const session = await createSessionFromRedirect(browserResult.url);

        if (!session) {
          return {
            success: false,
            error: "Não foi possível criar sessão a partir do redirect",
          };
        }

        // Obter dados do usuário atualizado
        const {
          data: { user },
          error: userError,
        } = await client.auth.getUser();

        if (userError || !user) {
          return {
            success: false,
            error: userError?.message || "Usuário não encontrado após autenticação",
          };
        }

        logger.info("Login Google bem sucedido", "SocialAuth", {
          userId: user.id,
        });

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email || "",
            name: user.user_metadata?.full_name || user.user_metadata?.name,
            avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          },
        };
      } catch (error) {
        logger.error(
          "Erro ao processar redirect do Google",
          "SocialAuth",
          error instanceof Error ? error : new Error(String(error))
        );
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Erro ao processar resposta de autenticação",
        };
      }
    }

    if (browserResult.type === "cancel") {
      return {
        success: false,
        error: "Login cancelado",
      };
    }

    return {
      success: false,
      error: "Falha na autenticação",
    };
  } catch (error) {
    logger.error("Exceção no login Google", "SocialAuth", error as Error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Login com Apple usando autenticação nativa (iOS) ou OAuth (Android/Web)
 *
 * Apple Sign In é obrigatório para apps iOS que oferecem login social
 * Baseado no padrão do Flo que usa Apple como primeira opção no iOS
 */
export async function signInWithApple(): Promise<SocialAuthResult> {
  try {
    const client = checkSupabase();

    // iOS: Usar autenticação nativa (exceto Expo Go - audience mismatch)
    if (Platform.OS === "ios" && !isExpoGo()) {
      return await signInWithAppleNative(client);
    }

    // Expo Go no iOS: Avisar que native não funciona e usar OAuth
    if (Platform.OS === "ios" && isExpoGo()) {
      logger.warn(
        "Apple Sign In nativo não funciona no Expo Go (audience mismatch). Usando OAuth.",
        "SocialAuth"
      );
    }

    // Android/Web/Expo Go: Usar OAuth
    return await signInWithAppleOAuth(client);
  } catch (error) {
    logger.error("Exceção no login Apple", "SocialAuth", error as Error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

/**
 * Apple Sign In nativo para iOS
 */
async function signInWithAppleNative(
  client: ReturnType<typeof checkSupabase>
): Promise<SocialAuthResult> {
  try {
    // Verificar se Apple Sign In está disponível
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: "Apple Sign In não está disponível neste dispositivo",
      };
    }

    logger.info("Iniciando Apple Sign In nativo", "SocialAuth");

    // Solicitar credenciais
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return {
        success: false,
        error: "Token de identidade não recebido",
      };
    }

    // Autenticar com Supabase usando o token
    const { data, error } = await client.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
    });

    if (error) {
      logger.error("Erro ao autenticar com Supabase", "SocialAuth", error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (data.user) {
      // Apple pode não retornar nome em logins subsequentes
      const fullName = credential.fullName
        ? `${credential.fullName.givenName || ""} ${credential.fullName.familyName || ""}`.trim()
        : undefined;

      logger.info("Login Apple bem sucedido", "SocialAuth", {
        userId: data.user.id,
      });

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || credential.email || "",
          name: fullName || data.user.user_metadata?.full_name,
          avatarUrl: data.user.user_metadata?.avatar_url,
        },
      };
    }

    return {
      success: false,
      error: "Usuário não retornado",
    };
  } catch (error) {
    // Usuário cancelou
    if (error instanceof Error && error.message.includes("ERR_REQUEST_CANCELED")) {
      return {
        success: false,
        error: "Login cancelado",
      };
    }

    throw error;
  }
}

/**
 * Apple Sign In via OAuth para Android/Web
 */
async function signInWithAppleOAuth(
  client: ReturnType<typeof checkSupabase>
): Promise<SocialAuthResult> {
  logger.info("Iniciando Apple Sign In via OAuth", "SocialAuth", {
    redirectUri: REDIRECT_URI,
    platform: Platform.OS,
  });

  // Web: usar redirect direto
  if (Platform.OS === "web") {
    const { error } = await client.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : REDIRECT_URI,
      },
    });

    if (error) {
      logger.error("Erro no OAuth Apple (web)", "SocialAuth", error);
      if (isOAuthNotConfiguredError(error) || error.message?.includes("not enabled")) {
        return {
          success: false,
          error:
            "Apple OAuth não está habilitado no Supabase. Configure em: Dashboard → Authentication → Providers → Apple. Veja docs/SUPABASE_OAUTH_SETUP.md",
        };
      }
      return {
        success: false,
        error: error.message || "Erro ao iniciar login com Apple",
      };
    }

    return {
      success: true,
    };
  }

  // Native: usar WebBrowser com fluxo PKCE
  let data: { provider: string; url: string | null } | null = null;
  let error: unknown = null;

  try {
    // CRÍTICO: Usar fluxo PKCE (padrão Supabase para mobile)
    const result = await client.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: REDIRECT_URI,
        skipBrowserRedirect: true,
        // PKCE é habilitado automaticamente pelo Supabase quando skipBrowserRedirect: true
      },
    });

    data = result.data;
    error = result.error;
  } catch (err) {
    // Captura erros de parsing (ex: .replace() em undefined)
    error = err;
    logger.error("Exceção ao chamar signInWithOAuth (Apple)", "SocialAuth", err as Error);
  }

  if (error) {
    logger.error("Erro no OAuth Apple", "SocialAuth", error as Error, {
      redirectUri: REDIRECT_URI,
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    // Verificar se é erro 400 (Bad Request) - geralmente redirect URI não autorizado
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("400") ||
      errorMessage.includes("bad request") ||
      errorMessage.includes("redirect_uri")
    ) {
      return {
        success: false,
        error: `Erro 400: Redirect URI não autorizado. Adicione "${REDIRECT_URI}" em Supabase Dashboard → Authentication → URL Configuration → Additional Redirect URLs`,
      };
    }

    // Verificar se é erro de provider não configurado
    if (isOAuthNotConfiguredError(error) || String(error).includes("not enabled")) {
      return {
        success: false,
        error:
          "Apple OAuth não está habilitado no Supabase. Configure em: Dashboard → Authentication → Providers → Apple. Veja docs/SUPABASE_OAUTH_SETUP.md",
      };
    }

    return {
      success: false,
      error: errorMessage,
    };
  }

  if (!data || !data.url) {
    return {
      success: false,
      error:
        "URL de autenticação não gerada. Verifique se o provider Apple está habilitado no Supabase Dashboard.",
    };
  }

  let browserResult;
  try {
    browserResult = await WebBrowser.openAuthSessionAsync(data.url, REDIRECT_URI, {
      showInRecents: true,
    });
  } catch (err) {
    logger.error("Erro ao abrir browser para OAuth (Apple)", "SocialAuth", err as Error);
    return {
      success: false,
      error: "Erro ao abrir navegador para autenticação",
    };
  }

  if (browserResult.type === "success" && browserResult.url) {
    // Criar sessão usando o padrão correto do Supabase
    try {
      const session = await createSessionFromRedirect(browserResult.url);

      if (!session) {
        return {
          success: false,
          error: "Não foi possível criar sessão a partir do redirect",
        };
      }

      // Obter dados do usuário atualizado
      const {
        data: { user },
        error: userError,
      } = await client.auth.getUser();

      if (userError || !user) {
        return {
          success: false,
          error: userError?.message || "Usuário não encontrado após autenticação",
        };
      }

      logger.info("Login Apple OAuth bem sucedido", "SocialAuth", {
        userId: user.id,
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email || "",
          name: user.user_metadata?.full_name,
          avatarUrl: user.user_metadata?.avatar_url,
        },
      };
    } catch (error) {
      logger.error(
        "Erro ao processar redirect do Apple",
        "SocialAuth",
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao processar resposta de autenticação",
      };
    }
  }

  if (browserResult.type === "cancel") {
    return {
      success: false,
      error: "Login cancelado",
    };
  }

  return {
    success: false,
    error: "Falha na autenticação",
  };
}

/**
 * Verifica se Apple Sign In está disponível no dispositivo
 */
export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== "ios") {
    return true; // OAuth funciona em qualquer plataforma
  }

  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Helper para obter o nome do provedor em português
 */
export function getProviderDisplayName(provider: SocialProvider): string {
  const names: Record<SocialProvider, string> = {
    google: "Google",
    apple: "Apple",
  };
  return names[provider];
}
