import { NativeModules, Platform } from "react-native";
import type { StoreApi } from "zustand";

type ReactotronType = typeof import("reactotron-react-native").default;

// Only configure Reactotron on native platforms during development
const isReactotronEnabled = __DEV__ && Platform.OS !== "web";

const zustandStores: { name: string; store: StoreApi<unknown> }[] = [];
let Reactotron: ReactotronType | null = null;

if (isReactotronEnabled) {
  Reactotron = require("reactotron-react-native").default as ReactotronType;
  const reactotronZustand = require("reactotron-plugin-zustand").default;

  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  const scriptHostname = scriptURL?.split("://")[1]?.split(":")[0];

  if (Reactotron) {
    Reactotron.configure({
      name: "Nossa Maternidade",
      host: scriptHostname || "localhost",
    })
      .use(
        reactotronZustand({
          stores: zustandStores,
        })
      )
      .useReactNative({
        asyncStorage: {
          ignore: ["secret", "password", "token"],
        },
        networking: {
          ignoreUrls: /symbolicate|logs/,
        },
        editor: false,
        errors: { veto: () => false },
        overlay: false,
      })
      .connect();

    (console as { tron?: typeof Reactotron }).tron = Reactotron;

    Reactotron.clear?.();
    Reactotron.log?.("🚀 Reactotron connected!");
  }
}

/**
 * Register Zustand stores for tracking in Reactotron
 */
export function registerZustandStores(stores: Record<string, StoreApi<unknown>>): void {
  if (!Reactotron) return;

  Object.entries(stores).forEach(([name, store]) => {
    zustandStores.push({ name, store });
  });

  Reactotron.log?.("📦 Registered Zustand stores:", Object.keys(stores));
}

export default Reactotron;
