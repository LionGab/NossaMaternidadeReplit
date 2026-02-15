/**
 * Jest Setup File
 *
 * Mocks and configurations for React Native/Expo testing.
 * Uses require() to avoid jest.mock hoisting issues.
 */

// Disable __DEV__ to prevent dynamic imports in store.ts (Reactotron integration)
// This fixes "ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG" on Node.js v25+
global.__DEV__ = false;

// Silence act() warnings from React 19
global.IS_REACT_ACT_ENVIRONMENT = true;

// Mock AsyncStorage (used by zustand stores)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock expo-secure-store (used by Supabase auth storage in native)
jest.mock("expo-secure-store", () => {
  const store = new Map();
  return {
    // Constant used by the app
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: "WHEN_UNLOCKED_THIS_DEVICE_ONLY",

    getItemAsync: jest.fn(async (key) => (store.has(key) ? store.get(key) : null)),
    setItemAsync: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key) => {
      store.delete(key);
    }),
  };
});

// Mock react-native-mmkv (native module; not available in Jest)
jest.mock("react-native-mmkv", () => {
  class MMKV {
    constructor() {
      this._store = new Map();
    }
    getString(key) {
      return this._store.has(key) ? this._store.get(key) : undefined;
    }
    set(key, value) {
      this._store.set(key, value);
    }
    delete(key) {
      this._store.delete(key);
    }
  }
  return { MMKV };
});

// Mock @sentry/react-native (ESM module that Jest can't parse)
jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setTags: jest.fn(),
  setExtra: jest.fn(),
  setExtras: jest.fn(),
  setContext: jest.fn(),
  withScope: jest.fn((callback) => callback({ setExtra: jest.fn() })),
  Scope: jest.fn(),
  getCurrentScope: jest.fn(() => ({ setExtra: jest.fn() })),
  getGlobalScope: jest.fn(() => ({ setExtra: jest.fn() })),
  getIsolationScope: jest.fn(() => ({ setExtra: jest.fn() })),
  startSpan: jest.fn(),
  startInactiveSpan: jest.fn(),
  wrap: jest.fn((component) => component),
  ReactNativeTracing: jest.fn(),
  ReactNavigationInstrumentation: jest.fn(),
}));
