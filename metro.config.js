const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withNativeWind } = require("nativewind/metro");

const path = require("node:path");
const os = require("node:os");

/** @type {import('expo/metro-config').MetroConfig} */
// Use Sentry's Expo config instead of default for source map upload support
const config = getSentryExpoConfig(__dirname);

// Dynamic worker allocation based on CPU cores
// For Ryzen 5 7600X (6 cores): uses 4-5 workers (75% of cores)
const cpuCores = os.cpus().length;
const optimalWorkers = Math.max(2, Math.floor(cpuCores * 0.75));
config.maxWorkers = parseInt(process.env.METRO_MAX_WORKERS || optimalWorkers, 10);

console.log(`[Metro] Using ${config.maxWorkers} workers (CPU cores: ${cpuCores})`);

// Enable Watchman for file watching (muito mais rápido que polling em Windows + SSD)
// IMPORTANTE: Instalar Watchman primeiro: choco install watchman
config.resolver.useWatchman = true;

// Fix for import.meta errors - disable package exports to avoid ESM issues
config.resolver.unstable_enablePackageExports = false;

// Resolve react-native-web for web platform
config.resolver.platforms = ["native", "web", "ios", "android"];
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Auto-resolve react-native to react-native-web on web platform
  if (platform === "web" && moduleName === "react-native") {
    return {
      filePath: require.resolve("react-native-web"),
      type: "sourceFile",
    };
  }
  // Use default resolution for other modules
  return context.resolveRequest(context, moduleName, platform);
};

// Get environment variables for Metro cache configuration.
// Auto-versioning: invalidates cache on package.json version bump
const packageJson = require("./package.json");
const metroCacheVersion = process.env.METRO_CACHE_VERSION || packageJson.version || "1";
const metroCacheHttpEndpoint = process.env.METRO_CACHE_HTTP_ENDPOINT;
const metroCacheDir = process.env.METRO_CACHE_DIR || path.join(os.homedir(), ".metro-cache");

console.log(`[Metro] Cache version: ${metroCacheVersion}`);

// Configure Metro's cache stores.
config.cacheStores = ({ FileStore, HttpStore }) => {
  const stores = [new FileStore({ root: metroCacheDir })];

  if (metroCacheHttpEndpoint) {
    // Create HttpStore with timeout and wrap to make failures non-fatal
    const httpStore = new HttpStore({
      endpoint: metroCacheHttpEndpoint,
      timeout: 10000, // 10 seconds (better to fail quickly and not cache than to hang)
    });

    // Wrap HttpStore methods to catch and log errors without failing
    const wrappedHttpStore = {
      get: async (...args) => {
        try {
          return await httpStore.get(...args);
        } catch (error) {
          console.warn("[Metro Cache] HttpStore get failed:", error.message);
          return null;
        }
      },
      set: async (...args) => {
        try {
          return await httpStore.set(...args);
        } catch (error) {
          console.warn("[Metro Cache] HttpStore set failed:", error.message);
        }
      },
      clear: async (...args) => {
        try {
          return await httpStore.clear(...args);
        } catch (error) {
          console.warn("[Metro Cache] HttpStore clear failed:", error.message);
        }
      },
    };

    stores.push(wrappedHttpStore);
  }
  return stores;
};

// Set the cache version for Metro, which can be incremented
// to invalidate existing caches.
config.cacheVersion = metroCacheVersion;

// Configure server to bind to 0.0.0.0 for Replit compatibility
config.server = {
  ...config.server,
  port: 5000,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "*");
      return middleware(req, res, next);
    };
  },
};

// Integrate NativeWind with the Metro configuration.
module.exports = withNativeWind(config, { input: "./global.css" });
