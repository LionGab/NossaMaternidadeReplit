/**
 * useOptimizedAnimation - Performance-optimized animation hook
 *
 * Combines:
 * - useReducedMotion (accessibility)
 * - AppState detection (pause in background)
 * - Controlled iterations (no infinite loops by default)
 *
 * @example
 * ```tsx
 * const { shouldAnimate, maxIterations, isActive } = useOptimizedAnimation();
 *
 * useEffect(() => {
 *   if (!shouldAnimate || !isActive) return;
 *
 *   scale.value = withRepeat(
 *     withTiming(1.2, { duration: 600 }),
 *     maxIterations,
 *     true
 *   );
 * }, [shouldAnimate, isActive]);
 * ```
 */

import { useEffect, useState, useMemo } from "react";
import { AppState, AppStateStatus } from "react-native";
import { cancelAnimation, SharedValue } from "react-native-reanimated";
import { useReducedMotion } from "./useReducedMotion";

interface UseOptimizedAnimationResult {
  /** Whether animations should play (reduceMotion OFF + app ACTIVE) */
  shouldAnimate: boolean;
  /** Whether reduced motion is enabled by user */
  reduceMotion: boolean;
  /** Whether app is in foreground (active state) */
  isActive: boolean;
  /** Max iterations for withRepeat (0 if reduceMotion, 3 default) */
  maxIterations: number;
  /** Current app state */
  appState: AppStateStatus;
  /** Helper to get animation duration (0 if reduceMotion) */
  getAnimationDuration: (normalDuration: number) => number;
}

interface UseOptimizedAnimationOptions {
  /** Default max iterations (default: 3) */
  defaultIterations?: number;
  /** Allow infinite loop for loading indicators (default: false) */
  allowInfinite?: boolean;
}

/**
 * Hook that provides optimized animation settings
 * respecting accessibility and background state
 */
export function useOptimizedAnimation(
  options: UseOptimizedAnimationOptions = {}
): UseOptimizedAnimationResult {
  const { defaultIterations = 3, allowInfinite = false } = options;

  const { reduceMotion, getAnimationDuration } = useReducedMotion();
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      setAppState(nextState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const isActive = appState === "active";
  const shouldAnimate = !reduceMotion && isActive;

  const maxIterations = useMemo(() => {
    if (reduceMotion) return 0;
    if (allowInfinite) return -1; // Only for loading indicators
    return defaultIterations;
  }, [reduceMotion, allowInfinite, defaultIterations]);

  return {
    shouldAnimate,
    reduceMotion,
    isActive,
    maxIterations,
    appState,
    getAnimationDuration,
  };
}

/**
 * Hook to cancel animations when app goes to background
 *
 * @param sharedValues - Array of shared values to cancel
 *
 * @example
 * ```tsx
 * const scale = useSharedValue(1);
 * const opacity = useSharedValue(1);
 *
 * useAppStatePause([scale, opacity]);
 * ```
 */
export function useAppStatePause(sharedValues: SharedValue<number>[]): void {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") {
        // Cancel all animations when going to background
        sharedValues.forEach((sv) => {
          cancelAnimation(sv);
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [sharedValues]);
}

/**
 * Hook specifically for loading indicators
 * Allows infinite loop but respects reduceMotion and pauses in background
 *
 * @example
 * ```tsx
 * const { shouldAnimate, iterations } = useLoadingAnimation();
 *
 * // iterations will be -1 (infinite) if allowed, 0 if reduceMotion
 * scale.value = withRepeat(withTiming(1.2), iterations, true);
 * ```
 */
export function useLoadingAnimation() {
  return useOptimizedAnimation({ allowInfinite: true });
}
