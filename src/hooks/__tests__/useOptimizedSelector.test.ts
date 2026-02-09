/**
 * Tests for useOptimizedSelector hooks
 *
 * @module hooks/__tests__/useOptimizedSelector.test
 */

import { describe, it, expect } from "@jest/globals";
import TestRenderer, { act } from "react-test-renderer";
import { jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { create, type StoreApi } from "zustand";
import {
  useMultipleSelectors,
  useOptimizedSelector,
  useMemoizedSelector,
} from "../useOptimizedSelector";

// Helper to render hooks
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
    rerender: () => {
      act(() => {
        root?.update(jsx(TestComponent, {}));
      });
    },
    unmount: () => root?.unmount(),
  };
}

// Test store type
interface TestState {
  name: string;
  email: string;
  age: number;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setAge: (age: number) => void;
}

// Create a fresh test store for each test
function createTestStore() {
  return create<TestState>((set) => ({
    name: "Test User",
    email: "test@example.com",
    age: 25,
    setName: (name) => set({ name }),
    setEmail: (email) => set({ email }),
    setAge: (age) => set({ age }),
  }));
}

describe("useOptimizedSelector", () => {
  it("should return selected value from store", () => {
    const store = createTestStore();

    const { result } = renderHook(() => useOptimizedSelector(store, (state) => state.name));

    expect(result.current).toBe("Test User");
  });

  it("should update when selected value changes", () => {
    const store = createTestStore();

    const { result, rerender } = renderHook(() =>
      useOptimizedSelector(store, (state) => state.name)
    );

    expect(result.current).toBe("Test User");

    act(() => {
      store.getState().setName("New Name");
    });

    rerender();
    expect(result.current).toBe("New Name");
  });
});

describe("useMultipleSelectors", () => {
  it("should return multiple values from store", () => {
    const store = createTestStore();
    const KEYS = ["name", "email"] as const;

    const { result } = renderHook(() =>
      useMultipleSelectors(
        store as unknown as StoreApi<Record<string, unknown>>,
        KEYS as readonly (keyof Record<string, unknown>)[]
      )
    );

    expect(result.current).toEqual({
      name: "Test User",
      email: "test@example.com",
    });
  });

  it("should update when any selected value changes", () => {
    const store = createTestStore();
    const KEYS = ["name", "age"] as const;

    const { result, rerender } = renderHook(() =>
      useMultipleSelectors(
        store as unknown as StoreApi<Record<string, unknown>>,
        KEYS as readonly (keyof Record<string, unknown>)[]
      )
    );

    expect(result.current).toEqual({
      name: "Test User",
      age: 25,
    });

    act(() => {
      store.getState().setAge(30);
    });

    rerender();
    expect(result.current).toEqual({
      name: "Test User",
      age: 30,
    });
  });

  it("should work with memoized selector array", () => {
    const store = createTestStore();

    const { result } = renderHook(() => {
      const keys = useMemo(() => ["name", "email"] as const, []);
      return useMultipleSelectors(
        store as unknown as StoreApi<Record<string, unknown>>,
        keys as readonly (keyof Record<string, unknown>)[]
      );
    });

    expect(result.current).toEqual({
      name: "Test User",
      email: "test@example.com",
    });
  });

  it("should return empty object for empty selectors array", () => {
    const store = createTestStore();
    const KEYS: (keyof TestState)[] = [];

    const { result } = renderHook(() =>
      useMultipleSelectors(
        store as unknown as StoreApi<Record<string, unknown>>,
        KEYS as readonly (keyof Record<string, unknown>)[]
      )
    );

    expect(result.current).toEqual({});
  });

  it("should handle single selector", () => {
    const store = createTestStore();
    const KEYS = ["name"] as const;

    const { result } = renderHook(() =>
      useMultipleSelectors(
        store as unknown as StoreApi<Record<string, unknown>>,
        KEYS as readonly (keyof Record<string, unknown>)[]
      )
    );

    expect(result.current).toEqual({
      name: "Test User",
    });
  });
});

describe("useMemoizedSelector", () => {
  it("should return selected value from store", () => {
    const store = createTestStore();

    const { result } = renderHook(() => useMemoizedSelector(store, (state) => state.name));

    expect(result.current).toBe("Test User");
  });

  it("should update when selected value changes", () => {
    const store = createTestStore();

    const { result, rerender } = renderHook(() =>
      useMemoizedSelector(store, (state) => state.email)
    );

    expect(result.current).toBe("test@example.com");

    act(() => {
      store.getState().setEmail("new@example.com");
    });

    rerender();
    expect(result.current).toBe("new@example.com");
  });
});
