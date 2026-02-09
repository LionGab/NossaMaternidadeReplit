/**
 * Tailwind Bridge - Nossa Maternidade 2025
 *
 * ⚠️  SINCRONIZADO COM tokens.ts - NÃO EDITAR MANUALMENTE
 *
 * Exporta cores do tokens.ts para uso no tailwind.config.js
 * Fonte única de verdade: src/theme/tokens.ts
 *
 * Uso:
 * const colors = require('./src/theme/tailwind-bridge.cjs');
 * module.exports = { theme: { extend: { colors } } }
 */

// ===========================================
// BRAND COLORS (synced with tokens.ts)
// ===========================================

const brand = {
  primary: {
    DEFAULT: "#0EA5E9", // Sky blue vibrante
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: "#0EA5E9",
    600: "#0284C7",
    700: "#0369A1",
    800: "#075985",
    900: "#0C4A6E",
  },
  accent: {
    DEFAULT: "#F43F68", // Rosa vibrante
    50: "#FFF1F3",
    100: "#FFE4E9",
    200: "#FECDD6",
    300: "#FDA4B8",
    400: "#FB7196",
    500: "#F43F68",
    600: "#E11D50",
    700: "#BE123C",
    800: "#9F1239",
    900: "#881337",
  },
  secondary: {
    DEFAULT: "#A855F7",
    50: "#FAF5FF",
    100: "#F3E8FF",
    200: "#E9D5FF",
    300: "#D8B4FE",
    400: "#C084FC",
    500: "#A855F7",
    600: "#9333EA",
    700: "#7C3AED",
    800: "#6B21A8",
    900: "#581C87",
  },
  teal: {
    DEFAULT: "#14B8A6",
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
  },
};

// ===========================================
// SURFACE & BACKGROUND (synced with tokens.ts)
// ===========================================

const surface = {
  canvas: "#F8FCFF",
  base: "#F8FCFF",
  card: "#FFFFFF",
  elevated: "#FFFFFF",
  tertiary: "#F0F9FF",
  soft: "#F0F9FF",
};

const background = {
  DEFAULT: "#F8FCFF",
  primary: "#F8FCFF",
  secondary: "#FFFFFF",
  tertiary: "#F0F9FF",
  elevated: "#FFFFFF",
  card: "#FFFFFF",
};

// ===========================================
// TEXT COLORS (synced with tokens.ts)
// ===========================================

const text = {
  dark: "#1F2937",
  DEFAULT: "#1F2937",
  light: "#6B7280",
  muted: "#9CA3AF",
  tertiary: "#9CA3AF",
  accent: "#F43F68",
  link: "#0EA5E9",
  onAccent: "#FFFFFF",
};

// ===========================================
// BORDER COLORS
// ===========================================

const border = {
  subtle: "#E5E7EB",
  DEFAULT: "#D1D5DB",
  strong: "#9CA3AF",
  accent: "#F43F68",
  primary: "#0EA5E9",
};

// ===========================================
// SEMANTIC COLORS (synced with tokens.ts)
// ===========================================

const semantic = {
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  info: "#3B82F6",
  infoLight: "#DBEAFE",
};

// ===========================================
// FEELING COLORS (synced with tokens.ts)
// ===========================================

const feeling = {
  bem: {
    DEFAULT: "#FFE4B5",
    light: "#FFEFC7",
  },
  cansada: {
    DEFAULT: "#BAE6FD",
    light: "#D4E9FD",
  },
  indisposta: {
    DEFAULT: "#DDD6FE",
    light: "#EDE9FE",
  },
  amada: {
    DEFAULT: "#FFD0E0",
    light: "#FFE5ED",
  },
  ansiosa: {
    DEFAULT: "#FED7AA",
    light: "#FFE4C7",
  },
};

// ===========================================
// NEUTRAL COLORS (synced with tokens.ts)
// ===========================================

const neutral = {
  0: "#FFFFFF",
  50: "#F9FAFB",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D1D5DB",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#1F2937",
  900: "#111827",
};

// ===========================================
// DARK MODE COLORS (synced with tokens.ts)
// ===========================================

const dark = {
  primary: {
    DEFAULT: "#38BDF8",
    50: "#0A1520",
    100: "#0F1E2D",
    200: "#15283A",
    300: "#1F3A4F",
    400: "#38BDF8",
    500: "#0EA5E9",
    600: "#0284C7",
    700: "#0369A1",
    800: "#075985",
    900: "#0C4A6E",
  },
  accent: {
    DEFAULT: "#FB7196",
    50: "#1A0A0F",
    100: "#2D1018",
    200: "#4D1A28",
    300: "#6D2438",
    400: "#FB7196",
    500: "#F43F68",
    600: "#E11D50",
    700: "#BE123C",
    800: "#9F1239",
    900: "#881337",
  },
  text: {
    dark: "#F3F5F7",
    DEFAULT: "#F3F5F7",
    light: "#9DA8B4",
    muted: "#7D8B99",
    accent: "#FF7AA8",
    link: "#4AC8FF",
    onAccent: "#1F2937",
  },
  background: {
    DEFAULT: "#0A1520",
    primary: "#0A1520",
    secondary: "#0F1E2D",
    tertiary: "#15283A",
    elevated: "#15283A",
  },
  neutral: {
    0: "#0A1520",
    50: "#0F1E2D",
    100: "#15283A",
    200: "#1F3A4F",
    300: "#2A4A60",
    400: "#4A6A80",
    500: "#6A8A9F",
    600: "#8AAABF",
    700: "#AACADE",
    800: "#D0EAFF",
    900: "#F0FAFF",
  },
};

// ===========================================
// TYPOGRAPHY (Manrope + DMSerifDisplay)
// ===========================================

const fontFamily = {
  sans: ["Manrope_400Regular"],
  medium: ["Manrope_500Medium"],
  semibold: ["Manrope_600SemiBold"],
  bold: ["Manrope_700Bold"],
  extrabold: ["Manrope_800ExtraBold"],
  serif: ["DMSerifDisplay_400Regular"],
  display: ["DMSerifDisplay_400Regular"],
};

// ===========================================
// EXPORTS
// ===========================================

module.exports = {
  // Light mode colors
  primary: brand.primary,
  accent: brand.accent,
  secondary: brand.secondary,
  teal: brand.teal,
  rose: brand.accent, // Legacy alias
  surface,
  background,
  text,
  border,
  semantic,
  feeling,
  neutral,

  // Dark mode override
  dark,

  // Typography
  fontFamily,

  // Legacy compat (deprecated - use primary/accent)
  blush: brand.accent,
  cream: {
    50: "#FFFBF5",
    100: "#FFF4E6",
    200: "#FFE4D6",
    300: "#FFD4B0",
    400: "#FFC48A",
    500: "#E8B88C",
    600: "#C9956A",
    700: "#A67548",
    800: "#7D5632",
    900: "#5C4228",
  },
  sage: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
  },
  warmGray: neutral,
};
