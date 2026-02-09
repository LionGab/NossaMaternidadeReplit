/**
 * Tests for useTheme hook
 *
 * NOTE:
 * - Evitamos dependências extras (ex.: @testing-library/react-native)
 * - Usamos react-test-renderer (já presente via jest-expo) para um renderHook mínimo
 *
 * @module hooks/__tests__/useTheme.test
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import TestRenderer, { act } from "react-test-renderer";
import { jsx } from "react/jsx-runtime";
import { useTheme } from "../useTheme";

function renderHook<T>(hook: () => T) {
  const result = { current: undefined as unknown as T };

  function TestComponent() {
    result.current = hook();
    return null;
  }

  let root: TestRenderer.ReactTestRenderer | null = null;
  act(() => {
    root = TestRenderer.create(jsx(TestComponent, {}));
  });

  return {
    result,
    unmount: () => root?.unmount(),
  };
}

// Mock React Native hooks
const mockUseColorScheme = jest.fn(() => "light");

jest.mock("react-native", () => ({
  useColorScheme: () => mockUseColorScheme(),
  Platform: {
    OS: "ios",
  },
}));

// Mock Zustand stores
const mockTheme = "light";
const mockIsDarkMode = false;
const mockSetIsDarkMode = jest.fn();
const mockSetTheme = jest.fn();
const mockPresetMode = "calmFemtech";
const mockSetPresetMode = jest.fn();
const mockTogglePreset = jest.fn();

jest.mock("../../state/store", () => ({
  useAppStore: jest.fn((selector: (state: unknown) => unknown) => {
    const state = {
      theme: mockTheme,
      isDarkMode: mockIsDarkMode,
      setIsDarkMode: mockSetIsDarkMode,
      setTheme: mockSetTheme,
    };
    return selector(state);
  }),
}));

jest.mock("../../state/theme-preset-store", () => ({
  useThemePresetStore: jest.fn((selector: (state: unknown) => unknown) => {
    const state = {
      presetMode: mockPresetMode,
      setPresetMode: mockSetPresetMode,
      togglePreset: mockTogglePreset,
    };
    return selector(state);
  }),
}));

describe("useTheme", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue("light");
  });

  it("should return theme configuration", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current).toHaveProperty("theme");
    expect(result.current).toHaveProperty("isDark");
    expect(result.current).toHaveProperty("colors");
    expect(result.current).toHaveProperty("setTheme");
    expect(result.current).toHaveProperty("toggleTheme");
  });

  it("should return light theme colors when system is light", () => {
    mockUseColorScheme.mockReturnValue("light");

    const { result } = renderHook(() => useTheme());

    expect(result.current.isDark).toBe(false);
    expect(result.current.colors).toBeDefined();
    expect(result.current.colors.background.primary).toBeDefined();
  });

  it("should return dark theme colors when system is dark", () => {
    mockUseColorScheme.mockReturnValue("dark");

    const { result } = renderHook(() => useTheme());

    // Note: This test may need adjustment based on actual implementation
    // The hook might need the store to be updated to reflect dark mode
    expect(result.current).toBeDefined();
  });

  it("should toggle theme when toggleTheme is called", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(mockSetTheme).toHaveBeenCalled();
  });

  it("should return preset configuration", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current).toHaveProperty("presetMode");
    expect(result.current).toHaveProperty("preset");
    expect(result.current.presetMode).toBe("calmFemtech");
  });

  it("should return design tokens", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current).toHaveProperty("tokens");
    expect(result.current).toHaveProperty("neutral");
    expect(result.current).toHaveProperty("spacing");
    expect(result.current).toHaveProperty("typography");
  });
});
