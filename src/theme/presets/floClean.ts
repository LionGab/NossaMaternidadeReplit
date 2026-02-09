/**
 * Flo Clean Preset - Nossa Maternidade
 *
 * Design Philosophy:
 * - Rosa pastel domina backgrounds (pink-blush gradient)
 * - Cards sempre brancos com sombras rosadas sutis
 * - CTAs rosa vibrante
 * - Turquesa para ovulação/fertilidade
 * - Bastante espaçamento, cantos bem arredondados
 *
 * Inspired by Flo Health app design language
 */

// ===========================================
// BRAND COLORS - Importado de tokens.ts (fonte única de verdade)
// ===========================================

import { brand } from "../tokens";

// Re-export brand para compatibilidade
export { brand };

// ===========================================
// FLO CLEAN PALETTE
// ===========================================

const floPalette = {
  // Backgrounds
  background: {
    primary: "#FFF5F7", // Rosa muito claro (fundo principal)
    secondary: "#FFE4EC", // Rosa claro (segundo stop do gradiente)
  },

  // Rosa (CTA)
  pink: {
    500: "#FF6B8A", // CTA principal
    600: "#E5526F", // CTA pressed/hover
    400: "#FF8FA8", // CTA light
    100: "#FFE4EC", // Rosa muito claro (borders, backgrounds sutis)
  },

  // Turquesa (ovulação/fertilidade)
  teal: {
    400: "#4ECDC4",
    500: "#26B8AD",
    100: "#D1FAF0",
  },

  // Text
  text: {
    primary: "#374151", // Cinza escuro (não preto puro)
    secondary: "#6B7280", // Cinza médio
    muted: "#9CA3AF", // Cinza claro
    inverse: "#FFFFFF",
  },

  // Cards
  card: {
    background: "#FFFFFF",
    border: "#FFE4EC", // Rosa sutil
  },
} as const;

// ===========================================
// SURFACE COLORS
// ===========================================

export const surface = {
  light: {
    /** Canvas: rosa muito claro */
    canvas: floPalette.background.primary,
    /** Base: rosa claro (segundo stop) */
    base: floPalette.background.secondary,
    /** Card: branco puro */
    card: floPalette.card.background,
    /** Elevated: branco para cards elevados */
    elevated: floPalette.card.background,
    /** Tertiary: separadores */
    tertiary: floPalette.pink[100],
    /** Overlay: modais */
    overlay: "rgba(55, 65, 81, 0.5)",
    /** Glass: blur effect */
    glass: "rgba(255, 245, 247, 0.85)",
  },
  dark: {
    // Dark mode leve (sem preto absoluto)
    // TODO: Refinar dark mode para floClean
    canvas: "#1A1A1D",
    base: "#242428",
    card: "#2D2D32",
    elevated: "#38383E",
    tertiary: "#3D3D44",
    overlay: "rgba(0, 0, 0, 0.7)",
    glass: "rgba(26, 26, 29, 0.85)",
  },
} as const;

// ===========================================
// TEXT COLORS
// ===========================================

export const text = {
  light: {
    /** Primary: cinza escuro para máximo contraste sem preto puro */
    primary: floPalette.text.primary,
    /** Secondary: corpo de texto */
    secondary: floPalette.text.secondary,
    /** Tertiary: placeholders */
    tertiary: floPalette.text.muted,
    /** Muted: desabilitado */
    muted: floPalette.text.muted,
    /** Inverse: texto em fundo escuro */
    inverse: floPalette.text.inverse,
    /** Accent: texto rosa (links CTA) */
    accent: floPalette.pink[600],
    /** Link: texto rosa */
    link: floPalette.pink[500],
    /** OnAccent: texto SOBRE botão rosa (branco para floClean) */
    onAccent: floPalette.text.inverse,
  },
  dark: {
    primary: "#F9FAFB",
    secondary: "#D1D5DB",
    tertiary: "#9CA3AF",
    muted: "#6B7280",
    inverse: floPalette.text.primary,
    accent: floPalette.pink[400],
    link: floPalette.pink[400],
    onAccent: floPalette.text.inverse,
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
    info: floPalette.teal[400],
    infoLight: floPalette.teal[100],
    infoText: floPalette.teal[500],
    // Fertility/Cycle specific
    fertility: floPalette.teal[400],
    fertilityLight: floPalette.teal[100],
    ovulation: floPalette.teal[500],
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
    info: floPalette.teal[400],
    infoLight: "rgba(78, 205, 196, 0.15)",
    infoText: floPalette.teal[100],
    // Fertility/Cycle specific
    fertility: floPalette.teal[400],
    fertilityLight: "rgba(78, 205, 196, 0.15)",
    ovulation: floPalette.teal[400],
  },
} as const;

// ===========================================
// BORDER COLORS
// ===========================================

export const border = {
  light: {
    subtle: floPalette.card.border, // Rosa sutil #FFE4EC
    default: floPalette.pink[100],
    strong: floPalette.pink[400],
    accent: floPalette.pink[500],
    primary: floPalette.pink[500],
  },
  dark: {
    subtle: "#38383E",
    default: "#4B4B52",
    strong: "#5E5E66",
    accent: floPalette.pink[400],
    primary: floPalette.pink[400],
  },
} as const;

// ===========================================
// BUTTON STYLES
// ===========================================

export const button = {
  /**
   * Primary: Rosa vibrante com texto branco
   */
  primary: {
    light: {
      background: floPalette.pink[500],
      text: text.light.onAccent,
      border: "transparent",
      backgroundPressed: floPalette.pink[600],
      backgroundDisabled: "#E5E7EB",
      textDisabled: "#9CA3AF",
    },
    dark: {
      background: floPalette.pink[500],
      text: text.dark.onAccent,
      border: "transparent",
      backgroundPressed: floPalette.pink[400],
      backgroundDisabled: "#38383E",
      textDisabled: "#6B7280",
    },
  },

  /**
   * Secondary: Outline rosa
   */
  secondary: {
    light: {
      background: "transparent",
      text: floPalette.pink[500],
      border: floPalette.pink[500],
      backgroundPressed: floPalette.pink[100],
      backgroundDisabled: "transparent",
      textDisabled: "#9CA3AF",
    },
    dark: {
      background: "transparent",
      text: floPalette.pink[400],
      border: floPalette.pink[400],
      backgroundPressed: "rgba(255, 107, 138, 0.15)",
      backgroundDisabled: "transparent",
      textDisabled: "#6B7280",
    },
  },

  /**
   * Ghost: Sem fundo
   */
  ghost: {
    light: {
      background: "transparent",
      text: floPalette.pink[500],
      border: "transparent",
      backgroundPressed: floPalette.pink[100],
      backgroundDisabled: "transparent",
      textDisabled: "#9CA3AF",
    },
    dark: {
      background: "transparent",
      text: floPalette.pink[400],
      border: "transparent",
      backgroundPressed: "rgba(255, 107, 138, 0.1)",
      backgroundDisabled: "transparent",
      textDisabled: "#6B7280",
    },
  },

  /**
   * Soft: Fundo rosa claro
   */
  soft: {
    light: {
      background: floPalette.pink[100],
      text: floPalette.pink[600],
      border: "transparent",
      backgroundPressed: floPalette.background.secondary,
      backgroundDisabled: "#F3F4F6",
      textDisabled: "#9CA3AF",
    },
    dark: {
      background: "rgba(255, 107, 138, 0.15)",
      text: floPalette.pink[400],
      border: "transparent",
      backgroundPressed: "rgba(255, 107, 138, 0.25)",
      backgroundDisabled: "#2D2D32",
      textDisabled: "#6B7280",
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
      border: border.light.subtle,
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
  // Screen background (principal do floClean)
  screen: [floPalette.background.primary, floPalette.background.secondary] as const,

  // Brand
  primary: [floPalette.pink[400], floPalette.pink[500]] as const,
  primarySoft: [floPalette.pink[100], floPalette.background.secondary] as const,
  accent: [floPalette.pink[400], floPalette.pink[600]] as const,
  accentSoft: [floPalette.background.primary, floPalette.pink[100]] as const,

  // Hero backgrounds
  heroLight: [
    floPalette.background.primary,
    floPalette.background.secondary,
    floPalette.card.background,
  ] as const,
  heroWarm: [
    floPalette.background.primary,
    floPalette.pink[100],
    floPalette.background.secondary,
  ] as const,
  heroCool: [
    floPalette.background.primary,
    floPalette.teal[100],
    floPalette.card.background,
  ] as const,

  // Utility
  glass: ["rgba(255,255,255,0.85)", "rgba(255,245,247,0.6)"] as const,
  overlay: ["rgba(55,65,81,0.6)", "rgba(55,65,81,0.3)"] as const,
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
