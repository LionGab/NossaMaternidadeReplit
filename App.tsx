import { NavigationContainer } from "@react-navigation/native";
import { useFonts, Poppins_500Medium, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { supabase } from "./src/api/supabase";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { OfflineBanner } from "./src/components/OfflineBanner";
import { ToastProvider } from "./src/context/ToastContext";
import { useDeepLinking } from "./src/hooks/useDeepLinking";
import { useNetworkStatus } from "./src/hooks/useNetworkStatus";
import { useNotifications } from "./src/hooks/useNotifications";
import { usePremiumForegroundRefresh } from "./src/hooks/usePremiumForegroundRefresh";
import { usePremiumListener } from "./src/hooks/usePremiumListener";
import { useTheme } from "./src/hooks/useTheme";
import { navigationRef } from "./src/navigation/navigationRef";
import RootNavigator from "./src/navigation/RootNavigator";
import { QueryProvider } from "./src/providers/QueryProvider";
import { usePremiumStore } from "./src/state/premium-store";
import { validateCriticalEnv } from "./src/config/env";
import { startSession, trackEvent } from "./src/services/analytics";
import { isExpoGo } from "./src/utils/expo";
import { logger } from "./src/utils/logger";

// Initialize Reactotron for debugging (development only)
if (__DEV__) {
  import("./src/config/reactotron").then(() => {
    logger.debug("Reactotron initialized", "App");

    // Initialize fetch interceptor for network tracking
    import("./src/utils/fetch-interceptor").then(({ initializeFetchInterceptor }) => {
      initializeFetchInterceptor();
    });
  });
}

// Validate critical env vars at startup (skipped in test)
validateCriticalEnv();

// Initialize Sentry for error tracking (production only)
const sentryDsn =
  Constants.expoConfig?.extra?.sentryDsn ||
  Constants.expoConfig?.extra?.sentry?.dsn ||
  process.env.EXPO_PUBLIC_SENTRY_DSN;
if (sentryDsn && !__DEV__) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.APP_ENV || "production",
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    tracesSampleRate: 0.2, // 20% of transactions for performance monitoring
    debug: false,
    beforeSend(event) {
      // Filter out non-critical errors in production
      if (event.exception?.values?.[0]?.type === "NetworkError") {
        return null; // Don't send network errors
      }
      return event;
    },
  });
  logger.info("Sentry initialized", "App");
}

// Hold native splash until fonts are loaded or timeout fires.
// This MUST be called before the first render (module scope).
SplashScreen.preventAutoHideAsync().catch(() => {});

function AppRuntimeEffects() {
  // Runtime effects - future hooks can be added here
  return null;
}

/*
Environment variables are accessed via process.env.EXPO_PUBLIC_*
Example: process.env.EXPO_PUBLIC_SUPABASE_URL
*/

function App() {
  // ── Font Loading with Hard Timeout ──
  // Loads ONLY Poppins (2 weights) for display/brand text.
  // Body/UI uses system font — does NOT depend on font loading.
  // If Poppins fails or times out, UI remains legible with system fallback;
  // display/label degrade gracefully to system font.
  const [fontsLoaded, fontError] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [fontTimedOut, setFontTimedOut] = useState(false);

  // Hard timeout: 3s max for font loading. Prevents infinite splash in production.
  useEffect(() => {
    const timer = setTimeout(() => {
      setFontTimedOut(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // App is ready when fonts load, font loading errors out, or timeout fires.
  const isAppReady = fontsLoaded || !!fontError || fontTimedOut;

  // Hide native splash screen once ready.
  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isAppReady]);

  // Log font status for diagnostics.
  useEffect(() => {
    if (fontError) {
      logger.warn("Poppins font loading failed, using system fallback", "App", {
        error: fontError.message,
      });
    }
    if (fontTimedOut && !fontsLoaded) {
      logger.warn("Font loading timed out after 3s, proceeding with system fallback", "App");
    }
    if (fontsLoaded) {
      logger.debug("Poppins fonts loaded successfully", "App");
    }
  }, [fontsLoaded, fontError, fontTimedOut]);

  // ── Analytics bootstrap (fire-and-forget, never blocks startup) ──
  useEffect(() => {
    const bootstrapAnalytics = async () => {
      try {
        await startSession();
        await trackEvent({
          eventName: "app_opened",
          category: "engagement",
          properties: {
            platform: Platform.OS,
            app_version: Constants.expoConfig?.version ?? "unknown",
          },
        });
      } catch (error) {
        logger.warn("Analytics bootstrap failed", "App", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

    bootstrapAnalytics().catch(() => {
      // Intentionally ignored: analytics must never block app startup.
    });
  }, []);

  // Monitor network status for offline banner
  const { isOffline, isChecking, retry } = useNetworkStatus();

  // Theme management
  const { isDark, colors } = useTheme();

  // Deep linking
  useDeepLinking();

  // Push notifications
  useNotifications();

  // Premium/IAP: Real-time listener + foreground refresh
  usePremiumListener();
  usePremiumForegroundRefresh();

  // Premium/IAP initialization
  const syncWithRevenueCat = usePremiumStore((s) => s.syncWithRevenueCat);

  useEffect(() => {
    // Initialize RevenueCat on app startup (with Expo Go fallback)
    // CRITICAL: Fire-and-forget (non-blocking) to prevent TestFlight hang
    // Boot sequence: fonts → splash finish → navigate (NOT waiting for IAP)
    const initPremium = async () => {
      try {
        // Expo Go não suporta IAP real. Evita inicialização para não gerar erro/ruído em runtime.
        if (isExpoGo()) {
          logger.info(
            "Expo Go detectado: RevenueCat desabilitado (use Dev Client para IAP).",
            "App"
          );
          return;
        }

        const revenuecat = await import("./src/services/revenuecat");
        const { bootLogger } = await import("./src/utils/bootLogger");

        bootLogger.markStageStart("revenuecat_init");
        await revenuecat.initializePurchases();

        // Validação: verificar se RevenueCat foi configurado
        const isConfigured = revenuecat.getIsConfigured();
        logger.info(`RevenueCat isConfigured: ${isConfigured}`, "App", {
          platform: Platform.OS,
        });

        bootLogger.markStageStart("revenuecat_sync");
        await syncWithRevenueCat("startup");
        bootLogger.markStageEnd("revenuecat_sync", { success: true });
      } catch (err) {
        logger.warn("RevenueCat indisponível (provável Expo Go). App rodando como free.", "App", {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };

    // IMPORTANT: Don't await initPremium! Fire-and-forget pattern
    // This allows app boot to proceed immediately without waiting for RevenueCat
    initPremium().catch((err) => {
      logger.error(
        "Premium initialization failed",
        "App",
        err instanceof Error ? err : new Error(String(err))
      );
    });

    // Web: Detectar callback OAuth na URL inicial (apenas uma vez)
    // O useDeepLinking já processa callbacks, então apenas logamos aqui
    if (Platform.OS === "web" && supabase && typeof window !== "undefined") {
      const url = window.location.href;
      const hasCallback =
        url.includes("/auth/callback") ||
        url.includes("?code=") ||
        url.includes("#access_token=") ||
        url.includes("token_hash=");

      if (hasCallback) {
        logger.info("Callback OAuth detectado na URL inicial (web)", "App", { url });
        // O Supabase com detectSessionInUrl: true processa automaticamente
        // O useDeepLinking também processa via handleInitialURL
        // Não precisamos fazer nada aqui, apenas logar
      }
    }
  }, [syncWithRevenueCat]);

  // Gate: keep native splash visible until fonts load or timeout.
  // Returns null so React renders nothing — the native splash covers this period.
  if (!isAppReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background.primary }}>
          <SafeAreaProvider>
            <ToastProvider>
              <AppRuntimeEffects />
              {/* Offline Banner - appears on top when no connection */}
              {isOffline && <OfflineBanner onRetry={retry} isRetrying={isChecking} />}
              <NavigationContainer ref={navigationRef}>
                <StatusBar style={isDark ? "light" : "dark"} />
                <RootNavigator />
              </NavigationContainer>
            </ToastProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryProvider>
    </ErrorBoundary>
  );
}

// Em DEV (inclui Expo Go), não envolver com Sentry para evitar warning de init.
export default __DEV__ ? App : Sentry.wrap(App);
