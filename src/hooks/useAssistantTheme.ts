/**
 * useAssistantTheme - Theme hook for AssistantScreen
 * Extracts theme logic from main screen component
 */

import { useMemo } from "react";
import { useTheme } from "./useTheme";
import { brand, neutral, premium } from "../theme/tokens";

/**
 * Theme colors type for AssistantScreen
 */
export interface AssistantThemeColors {
  // Primary colors (Azul Pastel)
  primary: string;
  primaryLight: string;
  primaryLighter: string;
  primaryDark: string;

  // Accent color (Rosa) - for CTAs like send button
  accent: string;
  accentLight: string;

  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgSidebar: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;

  // Borders
  border: string;
  borderLight: string;

  // Message bubbles
  userBubble: string;
  aiBubble: string;

  // Premium: Glassmorphism
  glassBackground: string;
  glassBorder: string;

  // Premium: Accent glow
  accentGlow: string;
}

/**
 * Premium gradient colors for NathIA
 */
export const NATHIA_GRADIENTS = {
  // Background gradient (rosa → azul → branco)
  background: [brand.accent[50], brand.primary[50], neutral[50]] as const,
  // User bubble gradient (rosa coral → rosa vibrante)
  userBubble: [brand.accent[400], brand.accent[500]] as const,
  // AI bubble gradient (azul claro → branco)
  aiBubble: [brand.primary[50], neutral[0]] as const,
  // Header accent
  headerAccent: [brand.accent[100], "transparent"] as const,
} as const;

/**
 * Static theme for StyleSheet (light mode base)
 * Used where dynamic theme can't be applied
 */
export const ASSISTANT_THEME_STATIC = {
  primary: brand.primary[500],
  primaryLight: brand.primary[100],
  // Rosa accent for CTAs (Flo-like)
  accent: brand.accent[500],
  accentLight: brand.accent[100],
  bgPrimary: neutral[50],
  bgSecondary: neutral[100],
  bgTertiary: neutral[200],
  textPrimary: neutral[900],
  textSecondary: neutral[600],
  textMuted: neutral[400],
  border: brand.primary[200],
  borderLight: brand.primary[100],
  userBubble: brand.accent[500], // Rosa para bolhas do usuário
  aiBubble: neutral[100],
  // Premium
  glassBackground: premium.glass.background,
  glassBorder: premium.glass.border,
  accentGlow: brand.accent[400],
} as const;

/**
 * Generate theme colors based on dark mode state
 */
function getThemeColors(themeColors: ReturnType<typeof useTheme>["colors"]): AssistantThemeColors {
  return {
    // Primary colors (Azul Pastel)
    primary: brand.primary[500],
    primaryLight: brand.primary[100],
    primaryLighter: brand.primary[50],
    primaryDark: brand.primary[600],

    // Accent color (Rosa) - for CTAs like send button (Flo-like)
    accent: brand.accent[500],
    accentLight: brand.accent[100],

    // Backgrounds - from useTheme colors
    bgPrimary: themeColors.background.primary,
    bgSecondary: themeColors.background.secondary,
    bgTertiary: themeColors.background.tertiary,
    bgSidebar: themeColors.background.secondary,

    // Text - from useTheme colors
    textPrimary: themeColors.text.primary,
    textSecondary: themeColors.text.secondary,
    textTertiary: themeColors.text.tertiary,
    textMuted: themeColors.text.muted,

    // Borders
    border: brand.primary[200],
    borderLight: brand.primary[100],

    // Message bubbles - Rosa para usuário (Flo-like)
    userBubble: brand.accent[500],
    aiBubble: themeColors.background.secondary,

    // Premium: Glassmorphism
    glassBackground: premium.glass.background,
    glassBorder: premium.glass.border,

    // Premium: Accent glow
    accentGlow: brand.accent[400],
  };
}

/**
 * Hook for AssistantScreen theme management
 */
export function useAssistantTheme() {
  const { isDark, colors: themeColors } = useTheme();

  const theme = useMemo(() => getThemeColors(themeColors), [themeColors]);

  const messageBubbleTheme = useMemo(
    () => ({
      userBubble: theme.userBubble,
      aiBubble: theme.aiBubble,
      textPrimary: theme.textPrimary,
      borderLight: theme.borderLight,
      primary: theme.primary,
    }),
    [theme]
  );

  return {
    isDark,
    theme,
    messageBubbleTheme,
  };
}
