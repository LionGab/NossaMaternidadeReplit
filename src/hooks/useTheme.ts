/**
 * Hook para gerenciar tema (light/dark)
 * Integra com useAppStore para persistência
 *
 * Suporta múltiplos presets: calmFemtech (default) e floClean
 */

import React, { useMemo } from "react";
import { useColorScheme } from "react-native";
import { useAppStore } from "../state";
import { useThemePresetStore } from "../state/theme-preset-store";
import {
  neutral,
  feeling,
  typography,
  spacing,
  radius,
  shadows,
  components,
  layout,
  getThemeTokens,
  brand,
} from "../theme/tokens";
// NOTE: border tokens are accessed via presetTokens.border (preset-specific)
// or directly via: import { border } from '@/theme/tokens' (base tokens)
import {
  getPresetTokens as getCalmFemtechTokens,
  border as presetBorder,
  surface as presetSurface,
  text as presetText,
  semantic as presetSemantic,
} from "../theme/presets/calmFemtech";
import { getPresetTokens as getFloCleanTokens } from "../theme/presets/floClean";

// Cores derivadas de tokens para compatibilidade
const COLORS = {
  primary: brand.primary,
  secondary: brand.secondary,
  accent: brand.accent,
  neutral: neutral,
  background: {
    primary: neutral[50],
    secondary: neutral[100],
    tertiary: neutral[200],
    card: presetSurface.light.card,
    canvas: presetSurface.light.canvas,
    elevated: presetSurface.light.elevated,
  },
  text: {
    primary: neutral[900],
    secondary: neutral[600],
    tertiary: neutral[500],
    muted: neutral[400],
    inverse: presetText.light.inverse,
  },
  border: presetBorder.light,
  semantic: {
    // Nested for backward compat
    light: presetSemantic.light,
    dark: presetSemantic.dark,
    // Flat access for convenience
    ...presetSemantic.light,
  },
  legacyAccent: {
    sky: brand.primary[200],
    lavender: brand.secondary[200],
    peach: brand.accent[200],
  },
};

const COLORS_DARK = {
  primary: brand.primary,
  secondary: brand.secondary,
  accent: brand.accent,
  neutral: neutral,
  background: {
    primary: neutral[900],
    secondary: neutral[800],
    tertiary: neutral[700],
    card: presetSurface.dark.card,
    canvas: presetSurface.dark.canvas,
    elevated: presetSurface.dark.elevated,
  },
  text: {
    primary: neutral[100],
    secondary: neutral[400],
    tertiary: neutral[500],
    muted: neutral[600],
    inverse: presetText.dark.inverse,
  },
  border: presetBorder.dark,
  semantic: {
    // Nested for backward compat
    light: presetSemantic.light,
    dark: presetSemantic.dark,
    // Flat access for convenience
    ...presetSemantic.dark,
  },
  legacyAccent: {
    sky: brand.primary[200],
    lavender: brand.secondary[200],
    peach: brand.accent[200],
  },
};

export type ThemeMode = "light" | "dark" | "system";

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const theme = useAppStore((s) => s.theme);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const setIsDarkMode = useAppStore((s) => s.setIsDarkMode);
  const setTheme = useAppStore((s) => s.setTheme);

  // Preset selection (calmFemtech or floClean)
  const presetMode = useThemePresetStore((s) => s.presetMode);
  const setPresetMode = useThemePresetStore((s) => s.setPresetMode);
  const togglePreset = useThemePresetStore((s) => s.togglePreset);

  // Determina se deve usar dark mode baseado no tema escolhido
  const shouldUseDark = theme === "dark" || (theme === "system" && systemColorScheme === "dark");

  // Atualiza isDarkMode quando necessário
  React.useEffect(() => {
    if (shouldUseDark !== isDarkMode) {
      setIsDarkMode(shouldUseDark);
    }
  }, [shouldUseDark, isDarkMode, setIsDarkMode]);

  // Retorna as cores baseadas no tema (usando design-system.ts para compat)
  const colors = shouldUseDark ? COLORS_DARK : COLORS;

  // Tokens legados (compatibilidade)
  const legacyTokens = useMemo(
    () => getThemeTokens(shouldUseDark ? "dark" : "light"),
    [shouldUseDark]
  );

  // Preset tokens baseado no presetMode selecionado
  const mode = shouldUseDark ? "dark" : "light";
  const presetTokens = useMemo(() => {
    if (presetMode === "floClean") {
      return getFloCleanTokens(mode);
    }
    return getCalmFemtechTokens(mode);
  }, [mode, presetMode]);

  return {
    // Compat com código existente
    theme,
    isDark: shouldUseDark,
    colors,
    setTheme,
    toggleTheme: () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
    },

    // =========================================
    // Preset Selection (calmFemtech or floClean)
    // =========================================
    presetMode,
    setPresetMode,
    togglePreset,

    // =========================================
    // Current Preset Tokens (usar esta API)
    // =========================================
    preset: presetTokens,
    brand,
    surface: presetTokens.surface,
    text: presetTokens.text,
    semantic: presetTokens.semantic,
    border: presetTokens.border,
    button: presetTokens.button,
    card: presetTokens.card,
    gradients: presetTokens.gradients,

    // =========================================
    // Tokens legados (compatibilidade)
    // =========================================
    tokens: legacyTokens,
    neutral,
    feeling,
    typography,
    spacing,
    radius,
    shadows,
    components,
    layout,
  };
}
