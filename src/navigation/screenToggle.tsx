import React from "react";
import type { ComponentType, FC } from "react";
import { FEATURE_FLAGS } from "@/config/featureFlags";

/**
 * Maps string flag keys to feature flag values
 * Example: "redesign.home" → FEATURE_FLAGS.REDESIGN_HOME
 */
function getFlagValue(flagKey: string): boolean {
  // Normalize key: "redesign.home" → "REDESIGN_HOME"
  const normalizedKey = flagKey.replace(/^redesign\./, "").toUpperCase();

  // Look up in FEATURE_FLAGS
  const flagName = `REDESIGN_${normalizedKey}` as keyof typeof FEATURE_FLAGS;
  const flag = FEATURE_FLAGS[flagName];

  if (typeof flag === "boolean") {
    return flag;
  }

  // Fallback: return true (new screen) if flag not found
  // This maintains backward compatibility if flag is undefined
  return true;
}

/**
 * Returns a component that selects between a redesign and legacy
 * implementation based on a feature flag string.
 *
 * Usage:
 * ```ts
 * component={screenToggle("redesign.home", HomeScreenRedesign, HomeScreen)}
 * ```
 *
 * @param flag - Flag key like "redesign.home", "redesign.paywall", etc.
 * @param NewScreen - Redesigned component (shown when flag = 1)
 * @param OldScreen - Legacy component (shown when flag = 0)
 * @returns Component that renders based on feature flag state
 */
export function screenToggle<P extends object>(
  flag: string,
  NewScreen: ComponentType<P>,
  OldScreen: ComponentType<P>
): ComponentType<P> {
  const isEnabled = getFlagValue(flag);

  const Toggled: FC<P> = (props) => {
    if (isEnabled) {
      return <NewScreen {...props} />;
    }
    return <OldScreen {...props} />;
  };

  Toggled.displayName = `Toggled(${flag}:${isEnabled ? "new" : "old"})`;
  return Toggled;
}
