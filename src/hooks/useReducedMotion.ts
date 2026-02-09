/**
 * useReducedMotion - Hook for respecting user's Reduce Motion preference
 *
 * WCAG AAA Compliance: Provides users who are sensitive to motion
 * the ability to disable or reduce animations throughout the app.
 *
 * Usage:
 * const { reduceMotion, shouldAnimate } = useReducedMotion();
 *
 * // In animation config:
 * const animatedStyle = useAnimatedStyle(() => ({
 *   opacity: shouldAnimate ? withTiming(1) : 1,
 *   transform: shouldAnimate
 *     ? [{ translateY: withSpring(0) }]
 *     : [{ translateY: 0 }],
 * }));
 *
 * @see https://reactnative.dev/docs/accessibilityinfo
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { AccessibilityInfo } from "react-native";

interface UseReducedMotionResult {
  /** Whether the user has enabled Reduce Motion in system settings */
  reduceMotion: boolean;
  /** Convenience flag: true = animations allowed, false = skip animations */
  shouldAnimate: boolean;
  /** Get animation duration based on preference (0 if reduceMotion) */
  getAnimationDuration: (normalDuration: number) => number;
  /** Get animation config for react-native-reanimated */
  getAnimationConfig: (config: AnimationConfig) => AnimationConfig;
}

interface AnimationConfig {
  duration?: number;
  delay?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}

/**
 * Hook that respects the user's Reduce Motion accessibility preference
 *
 * @returns Object with reduceMotion flag and helper functions
 */
export function useReducedMotion(): UseReducedMotionResult {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkReduceMotion = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setReduceMotion(isEnabled);
      } catch (_error) {
        // Default to animations enabled if check fails
        // This can happen on some platforms/simulators - not critical
        setReduceMotion(false);
      }
    };

    checkReduceMotion();

    // Subscribe to changes
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (isEnabled: boolean) => {
        setReduceMotion(isEnabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const shouldAnimate = !reduceMotion;

  const getAnimationDuration = useCallback(
    (normalDuration: number): number => {
      return reduceMotion ? 0 : normalDuration;
    },
    [reduceMotion]
  );

  const getAnimationConfig = useCallback(
    (config: AnimationConfig): AnimationConfig => {
      if (reduceMotion) {
        return {
          ...config,
          duration: 0,
          delay: 0,
        };
      }
      return config;
    },
    [reduceMotion]
  );

  return useMemo(
    () => ({
      reduceMotion,
      shouldAnimate,
      getAnimationDuration,
      getAnimationConfig,
    }),
    [reduceMotion, shouldAnimate, getAnimationDuration, getAnimationConfig]
  );
}

/**
 * Static helper for components that can't use hooks
 * @deprecated Prefer useReducedMotion hook
 */
export async function checkReduceMotionEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isReduceMotionEnabled();
  } catch (_error) {
    // This can fail on some platforms - not critical
    return false;
  }
}
