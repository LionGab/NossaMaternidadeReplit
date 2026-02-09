import { Dimensions, Platform, useWindowDimensions } from "react-native";

// Static dimensions (for backward compatibility, but prefer useDimensions hook)
let SCREEN_WIDTH = Dimensions.get("window").width;
let SCREEN_HEIGHT = Dimensions.get("window").height;

// Update static dimensions on web when window resizes
if (Platform.OS === "web" && typeof window !== "undefined") {
  const updateDimensions = () => {
    const dims = Dimensions.get("window");
    SCREEN_WIDTH = dims.width;
    SCREEN_HEIGHT = dims.height;
  };

  // Listen to Dimensions changes
  Dimensions.addEventListener("change", updateDimensions);

  // Also listen to window resize for immediate updates on web
  window.addEventListener("resize", () => {
    // Force Dimensions to update by getting fresh values
    updateDimensions();
  });
}

// Base dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;

/**
 * Calculates responsive width based on screen width
 */
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

/**
 * Calculates responsive height based on screen height
 */
export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Calculates font size based on screen width
 */
export const fs = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Get responsive padding for container
 */
export const getContainerPadding = (): number => {
  if (SCREEN_WIDTH < 375) return 16; // Small phones
  if (SCREEN_WIDTH < 414) return 20; // Medium phones
  return 24; // Large phones
};

/**
 * Get responsive card spacing
 */
export const getCardSpacing = (): number => {
  if (SCREEN_WIDTH < 375) return 12;
  return 16;
};

/**
 * Hook for responsive dimensions (RECOMMENDED)
 * Updates automatically on resize, works correctly on web
 *
 * @example
 * ```tsx
 * const { width, height } = useDimensions();
 * const padding = width < 375 ? 16 : 24;
 * ```
 */
export function useDimensions() {
  const { width, height } = useWindowDimensions();
  return { width, height };
}

/**
 * Hook-based responsive width percentage
 */
export function useWp(percentage: number): number {
  const { width } = useDimensions();
  return (width * percentage) / 100;
}

/**
 * Hook-based responsive height percentage
 */
export function useHp(percentage: number): number {
  const { height } = useDimensions();
  return (height * percentage) / 100;
}

/**
 * Hook-based responsive font size
 */
export function useFs(size: number): number {
  const { width } = useDimensions();
  const BASE_WIDTH = 375;
  return (width / BASE_WIDTH) * size;
}

/**
 * Hook-based responsive container padding
 */
export function useContainerPadding(): number {
  const { width } = useDimensions();
  if (width < 375) return 16; // Small phones
  if (width < 414) return 20; // Medium phones
  return 24; // Large phones
}

/**
 * Hook-based responsive card spacing
 */
export function useCardSpacing(): number {
  const { width } = useDimensions();
  if (width < 375) return 12;
  return 16;
}

// Export static values for backward compatibility (deprecated, use useDimensions hook)
export { SCREEN_HEIGHT, SCREEN_WIDTH };
