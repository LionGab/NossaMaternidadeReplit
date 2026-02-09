/**
 * Calm FemTech Preset - Nossa Maternidade
 *
 * Design Philosophy:
 * - Azul domina (70-85%): calma, confiança, saúde
 * - Rosa pontual (5-12%): CTAs, warmth, momentos de alegria
 * - Contraste AAA: botão rosa usa texto navy (não branco)
 *
 * @see Apple HIG 2025
 * @see Material Design 3 Expressive
 */

// ===========================================
// BRAND COLORS - Importado de tokens.ts (fonte única de verdade)
// ===========================================

import { brand } from "../tokens";

// Re-export brand para compatibilidade
export { brand };

// ===========================================
// SURFACE COLORS
// ===========================================

export const surface = {
  light: {
    /** Canvas: off-white quente (nunca branco puro) */
    canvas: "#FFF8F3",
    /** Base: azul muito claro */
    base: "#F0F7FF",
    /** Card: azul claro */
    card: "#DCEBFA",
    /** Elevated: branco para cards elevados */
    elevated: "#FFFFFF",
    /** Tertiary: separadores */
    tertiary: "#E8F0F8",
    /** Overlay: modais */
    overlay: "rgba(45, 79, 120, 0.5)",
    /** Glass: blur effect */
    glass: "rgba(240, 247, 255, 0.85)",
  },
  dark: {
    canvas: "#0D1117",
    base: "#161B22",
    card: "#21262D",
    elevated: "#30363D",
    tertiary: "#3D444D",
    overlay: "rgba(0, 0, 0, 0.7)",
    glass: "rgba(22, 27, 34, 0.85)",
  },
} as const;

// ===========================================
// TEXT COLORS
// ===========================================

export const text = {
  light: {
    /** Primary: navy escuro para máximo contraste */
    primary: "#1A2A3A",
    /** Secondary: corpo de texto */
    secondary: "#4A5568",
    /** Tertiary: placeholders */
    tertiary: "#718096",
    /** Muted: desabilitado */
    muted: "#6A5450",
    /** Inverse: texto em fundo escuro */
    inverse: "#F7FAFC",
    /** Accent: texto rosa (links CTA) */
    accent: "#CC4A68",
    /** Link: texto azul (links normais) */
    link: "#4A7DB8",
    /** OnAccent: texto SOBRE botão rosa (navy escuro para AAA) */
    onAccent: "#1A2A3A",
  },
  dark: {
    primary: "#F7FAFC",
    secondary: "#A0AEC0",
    tertiary: "#718096",
    muted: "#4A5568",
    inverse: "#1A2A3A",
    accent: "#FFB3C4",
    link: "#9FC9F5",
    onAccent: "#1A2A3A",
  },
} as const;

// ===========================================
// SEMANTIC COLORS
// ===========================================

export const semantic = {
  light: {
    success: "#10B981",
    successLight: "#D1FAE5",
    successText: "#065F46",
    warning: "#F59E0B",
    warningLight: "#FEF3C7",
    warningText: "#92400E",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    errorText: "#B91C1C",
    info: "#6DA9E4",
    infoLight: "#DCEBFA",
    infoText: "#2D4F78",
  },
  dark: {
    success: "#34D399",
    successLight: "rgba(16, 185, 129, 0.15)",
    successText: "#A7F3D0",
    warning: "#FBBF24",
    warningLight: "rgba(245, 158, 11, 0.15)",
    warningText: "#FDE68A",
    error: "#F87171",
    errorLight: "rgba(239, 68, 68, 0.15)",
    errorText: "#FECACA",
    info: "#9FC9F5",
    infoLight: "rgba(109, 169, 228, 0.15)",
    infoText: "#DCEBFA",
  },
} as const;

// ===========================================
// BORDER COLORS
// ===========================================

export const border = {
  light: {
    subtle: "#E2E8F0",
    default: "#CBD5E0",
    strong: "#A0AEC0",
    accent: "#FF8BA3",
    primary: "#6DA9E4",
  },
  dark: {
    subtle: "#30363D",
    default: "#3D444D",
    strong: "#4D5666",
    accent: "#FF8BA3",
    primary: "#7DB9E8",
  },
} as const;

// ===========================================
// BUTTON STYLES
// ===========================================

export const button = {
  /**
   * Primary: Rosa accent com texto navy
   * IMPORTANTE: Garante AAA contrast (texto escuro em rosa)
   */
  primary: {
    light: {
      background: brand.accent[400],
      text: text.light.onAccent,
      border: "transparent",
      backgroundPressed: brand.accent[500],
      backgroundDisabled: "#E2E8F0",
      textDisabled: "#A0AEC0",
    },
    dark: {
      background: brand.accent[400],
      text: text.dark.onAccent,
      border: "transparent",
      backgroundPressed: brand.accent[300],
      backgroundDisabled: "#30363D",
      textDisabled: "#4D5666",
    },
  },

  /**
   * Secondary: Outline azul
   */
  secondary: {
    light: {
      background: "transparent",
      text: brand.primary[700],
      border: brand.primary[500],
      backgroundPressed: brand.primary[50],
      backgroundDisabled: "transparent",
      textDisabled: "#A0AEC0",
    },
    dark: {
      background: "transparent",
      text: brand.primary[300],
      border: brand.primary[400],
      backgroundPressed: "rgba(109, 169, 228, 0.15)",
      backgroundDisabled: "transparent",
      textDisabled: "#4D5666",
    },
  },

  /**
   * Ghost: Sem fundo
   */
  ghost: {
    light: {
      background: "transparent",
      text: brand.primary[700],
      border: "transparent",
      backgroundPressed: brand.primary[50],
      backgroundDisabled: "transparent",
      textDisabled: "#A0AEC0",
    },
    dark: {
      background: "transparent",
      text: brand.primary[300],
      border: "transparent",
      backgroundPressed: "rgba(109, 169, 228, 0.1)",
      backgroundDisabled: "transparent",
      textDisabled: "#4D5666",
    },
  },

  /**
   * Soft: Fundo suave azul
   */
  soft: {
    light: {
      background: brand.primary[50],
      text: brand.primary[700],
      border: "transparent",
      backgroundPressed: brand.primary[100],
      backgroundDisabled: "#F7FAFC",
      textDisabled: "#A0AEC0",
    },
    dark: {
      background: "rgba(109, 169, 228, 0.15)",
      text: brand.primary[300],
      border: "transparent",
      backgroundPressed: "rgba(109, 169, 228, 0.25)",
      backgroundDisabled: "#21262D",
      textDisabled: "#4D5666",
    },
  },
} as const;

// ===========================================
// CARD STYLES
// ===========================================

export const card = {
  base: {
    light: {
      background: surface.light.card,
      border: border.light.subtle,
    },
    dark: {
      background: surface.dark.card,
      border: border.dark.subtle,
    },
  },
  elevated: {
    light: {
      background: surface.light.elevated,
      border: "transparent",
    },
    dark: {
      background: surface.dark.elevated,
      border: "transparent",
    },
  },
  outlined: {
    light: {
      background: surface.light.elevated,
      border: border.light.default,
    },
    dark: {
      background: surface.dark.card,
      border: border.dark.default,
    },
  },
} as const;

// ===========================================
// GRADIENTS
// ===========================================

export const gradients = {
  // Screen background (main gradient for variant="flo" in GradientBackground)
  screen: [surface.light.canvas, surface.light.base] as const,

  // Brand
  primary: [brand.primary[400], brand.primary[600]] as const,
  primarySoft: [brand.primary[50], brand.primary[100]] as const,
  accent: [brand.accent[300], brand.accent[500]] as const,
  accentSoft: [brand.accent[50], brand.accent[100]] as const,

  // Hero backgrounds
  heroLight: [surface.light.canvas, surface.light.base, "#FFFFFF"] as const,
  heroWarm: [brand.accent[50], surface.light.canvas, surface.light.base] as const,
  heroCool: [surface.light.base, brand.primary[50], "#FFFFFF"] as const,

  // Utility
  glass: ["rgba(255,255,255,0.85)", "rgba(240,247,255,0.6)"] as const,
  overlay: ["rgba(26,42,58,0.6)", "rgba(26,42,58,0.3)"] as const,
} as const;

// ===========================================
// THEME RESOLVER
// ===========================================

export type ThemeMode = "light" | "dark";

export const getPresetTokens = (mode: ThemeMode) => ({
  brand,
  surface: surface[mode],
  text: text[mode],
  semantic: semantic[mode],
  border: border[mode],
  button: {
    primary: button.primary[mode],
    secondary: button.secondary[mode],
    ghost: button.ghost[mode],
    soft: button.soft[mode],
  },
  card: {
    base: card.base[mode],
    elevated: card.elevated[mode],
    outlined: card.outlined[mode],
  },
  gradients,
});

// ===========================================
// EXPORTS FOR COMPATIBILITY
// ===========================================

export default {
  brand,
  surface,
  text,
  semantic,
  border,
  button,
  card,
  gradients,
  getPresetTokens,
};
