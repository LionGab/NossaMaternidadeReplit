/**
 * Reactotron Configuration
 * Visual debugging tool for React Native
 * ONLY runs in development mode (__DEV__)
 */

import { NativeModules } from "react-native";
import Reactotron from "reactotron-react-native";
import reactotronZustand from "reactotron-plugin-zustand";
import type { StoreApi } from "zustand";

// Type declaration for console.tron
declare global {
  interface Console {
    tron?: typeof Reactotron;
  }
}

// Store references for Zustand plugin (populated later to avoid circular deps)
const zustandStores: { name: string; store: StoreApi<unknown> }[] = [];

// Only configure Reactotron in development
if (__DEV__) {
  // Get localhost for Android emulator or physical device
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  const scriptHostname = scriptURL?.split("://")[1]?.split(":")?.[0];

  Reactotron.configure({
    name: "Nossa Maternidade",
    host: scriptHostname || "localhost", // Use device IP for physical devices
  })
    .use(
      reactotronZustand({
        stores: zustandStores, // Will be populated by registerZustandStores()
      })
    )
    .useReactNative({
      asyncStorage: {
        ignore: ["secret", "password", "token"], // Don't track sensitive data
      },
      networking: {
        ignoreUrls: /symbolicate|logs/, // Ignore Metro bundler requests
      },
      editor: false, // Disable editor integration (not needed)
      errors: { veto: () => false }, // Track all errors
      overlay: false, // Disable in-app overlay (use desktop app)
    })
    .connect();

  // Make Reactotron available globally for manual logging
  (console as { tron?: typeof Reactotron }).tron = Reactotron;

  // Clear on every refresh in development for clean slate
  Reactotron.clear?.();

  // Log that Reactotron is connected
  Reactotron.log?.("🚀 Reactotron connected!");
}

/**
 * Register Zustand stores for tracking in Reactotron
 * Called from store.ts after all stores are created
 */
export function registerZustandStores(stores: Record<string, StoreApi<unknown>>): void {
  if (!__DEV__) return;

  // Add stores to the array (passed by reference to reactotron plugin)
  Object.entries(stores).forEach(([name, store]) => {
    zustandStores.push({ name, store });
  });

  Reactotron.log?.("📦 Registered Zustand stores:", Object.keys(stores));
}

export default Reactotron;
