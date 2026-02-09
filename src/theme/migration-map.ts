/**
 * Migration Map - Design System Tokens
 *
 * Este arquivo mapeia valores hardcoded para tokens do design system.
 * Use como referência ao migrar componentes.
 *
 * @see src/theme/tokens.ts (fonte única de verdade)
 */

import { typography, spacing, radius, animation, micro } from "./tokens";

// ===========================================
// FONT SIZE MIGRATION
// ===========================================

/**
 * Mapeamento de fontSize hardcoded → token
 *
 * Uso:
 * // ANTES (❌)
 * fontSize: 24
 *
 * // DEPOIS (✅)
 * fontSize: typography.displayMedium.fontSize
 */
export const FONT_SIZE_MAP = {
  // Caption/Label
  10: typography.caption.fontSize, // Use caption (12) ou criar token
  11: typography.caption.fontSize, // Use caption (12)
  12: typography.caption.fontSize, // caption
  13: typography.labelMedium.fontSize, // labelMedium

  // Body
  14: typography.bodySmall.fontSize, // bodySmall
  15: typography.bodyMedium.fontSize, // bodyMedium (padrão)
  16: typography.bodyLarge.fontSize, // bodyLarge

  // Title
  17: typography.headlineSmall.fontSize, // Use headlineSmall (16)
  18: typography.headlineMedium.fontSize, // headlineMedium / titleLarge

  // Headline
  20: typography.titleLarge.fontSize, // titleLarge (18)
  22: typography.displaySmall.fontSize, // displaySmall / headlineLarge

  // Display
  24: typography.displayMedium.fontSize, // displayMedium
  26: typography.displayMedium.fontSize, // Use displayMedium (24)
  28: typography.displayLarge.fontSize, // displayLarge
  30: typography.displayLarge.fontSize, // Use displayLarge (28)
  32: typography.displayLarge.fontSize, // Use displayLarge (28)
  36: typography.displayLarge.fontSize, // Use displayLarge (28) + custom
  40: typography.displayLarge.fontSize, // Hero text - custom
  48: typography.displayLarge.fontSize, // Hero text - custom
} as const;

// ===========================================
// SPACING/PADDING MIGRATION
// ===========================================

/**
 * Mapeamento de padding/margin hardcoded → token
 *
 * Uso:
 * // ANTES (❌)
 * paddingHorizontal: 24
 *
 * // DEPOIS (✅)
 * paddingHorizontal: spacing["2xl"]
 */
export const SPACING_MAP = {
  2: spacing.xs / 2, // 2px (não tem token exato)
  4: spacing.xs, // xs
  6: spacing.sm - 2, // (não tem token exato, use sm)
  8: spacing.sm, // sm
  10: spacing.md - 2, // (não tem token exato, use md)
  12: spacing.md, // md
  14: spacing.lg - 2, // (não tem token exato, use lg)
  16: spacing.lg, // lg
  18: spacing.xl - 2, // (não tem token exato, use xl)
  20: spacing.xl, // xl
  24: spacing["2xl"], // 2xl
  28: spacing["2xl"] + 4, // (não tem token exato)
  32: spacing["3xl"], // 3xl
  36: spacing["3xl"] + 4, // (não tem token exato)
  40: spacing["4xl"], // 4xl
  48: spacing["5xl"], // 5xl
  56: spacing["5xl"] + 8, // (não tem token exato)
  64: spacing["6xl"], // 6xl
  80: spacing["7xl"], // 7xl
  96: spacing["8xl"], // 8xl
} as const;

// ===========================================
// BORDER RADIUS MIGRATION
// ===========================================

/**
 * Mapeamento de borderRadius hardcoded → token
 *
 * Uso:
 * // ANTES (❌)
 * borderRadius: 12
 *
 * // DEPOIS (✅)
 * borderRadius: radius.md
 */
export const RADIUS_MAP = {
  0: radius.none, // none
  2: radius.xs / 2, // (não tem token exato)
  4: radius.xs, // xs
  6: radius.sm - 2, // (não tem token exato, use sm)
  8: radius.sm, // sm
  10: radius.md - 2, // (não tem token exato, use md)
  12: radius.md, // md
  14: radius.lg - 2, // (não tem token exato)
  16: radius.lg, // lg
  18: radius.xl - 2, // (não tem token exato)
  20: radius.xl, // xl
  24: radius["2xl"], // 2xl
  28: radius["3xl"], // 3xl
  32: radius["3xl"] + 4, // (não tem token exato)
  9999: radius.full, // full (pill)
} as const;

// ===========================================
// FONT WEIGHT MIGRATION
// ===========================================

/**
 * Mapeamento de fontWeight/fontFamily hardcoded → token
 *
 * Uso:
 * // ANTES (❌)
 * fontFamily: "Manrope_600SemiBold"
 * fontWeight: "600"
 *
 * // DEPOIS (✅)
 * fontFamily: typography.fontFamily.semibold
 * // (fontWeight geralmente não é necessário quando usando fontFamily)
 */
export const FONT_FAMILY_MAP = {
  // String literals → tokens
  Manrope_400Regular: "typography.fontFamily.base",
  Manrope_500Medium: "typography.fontFamily.medium",
  Manrope_600SemiBold: "typography.fontFamily.semibold",
  Manrope_700Bold: "typography.fontFamily.bold",
  Manrope_800ExtraBold: "typography.fontFamily.extrabold",
  DMSerifDisplay_400Regular: "typography.fontFamily.serif",

  // fontWeight → fontFamily token
  "400": "typography.fontFamily.base",
  "500": "typography.fontFamily.medium",
  "600": "typography.fontFamily.semibold",
  "700": "typography.fontFamily.bold",
  "800": "typography.fontFamily.extrabold",
} as const;

// ===========================================
// ANIMATION DURATION MIGRATION
// ===========================================

/**
 * Mapeamento de duration hardcoded → token
 *
 * Uso:
 * // ANTES (❌)
 * duration: 300
 *
 * // DEPOIS (✅)
 * duration: animation.duration.normal
 */
export const DURATION_MAP = {
  50: animation.duration.instant, // Use instant (80)
  80: animation.duration.instant, // instant
  100: animation.duration.fast, // Use fast (150)
  150: animation.duration.fast, // fast
  200: animation.duration.fast, // Use fast (150)
  250: animation.duration.normal, // Use normal (300)
  300: animation.duration.normal, // normal
  400: animation.duration.slow, // Use slow (500)
  500: animation.duration.slow, // slow
  600: animation.duration.slower, // Use slower (800)
  700: animation.duration.slower, // Use slower (800)
  800: animation.duration.slower, // slower
  1000: animation.duration.glow, // Use glow (1500)
  1500: animation.duration.glow, // glow
  2000: animation.duration.particle, // particle
} as const;

// ===========================================
// SCALE MIGRATION
// ===========================================

/**
 * Mapeamento de scale hardcoded → token
 *
 * Uso:
 * // ANTES (❌)
 * scale: 0.97
 *
 * // DEPOIS (✅)
 * scale: micro.pressScale
 */
export const SCALE_MAP = {
  0.95: micro.pressScale, // Use pressScale (0.97)
  0.96: micro.pressScale, // Use pressScale (0.97)
  0.97: micro.pressScale, // pressScale
  0.98: micro.pressScale, // Use pressScale (0.97)
  0.99: micro.pressScale, // Use pressScale (0.97)
  1.0: 1, // none
  1.02: micro.hoverScale, // hoverScale
  1.03: micro.hoverScale, // Use hoverScale (1.02)
  1.05: micro.hoverScale, // Use hoverScale (1.02)
  1.1: micro.popScale, // Use popScale (1.15)
  1.15: micro.popScale, // popScale
} as const;

// ===========================================
// QUICK REFERENCE - Typography Styles
// ===========================================

/**
 * Estilos de tipografia completos para copiar/colar
 *
 * Uso:
 * const style = {
 *   ...TYPOGRAPHY_STYLES.displayLarge,
 *   fontFamily: typography.fontFamily.serif,
 * }
 */
export const TYPOGRAPHY_STYLES = {
  // Display (hero text, títulos principais)
  displayLarge: {
    fontSize: typography.displayLarge.fontSize,
    lineHeight: typography.displayLarge.lineHeight,
    fontWeight: typography.displayLarge.fontWeight,
  },
  displayMedium: {
    fontSize: typography.displayMedium.fontSize,
    lineHeight: typography.displayMedium.lineHeight,
    fontWeight: typography.displayMedium.fontWeight,
  },
  displaySmall: {
    fontSize: typography.displaySmall.fontSize,
    lineHeight: typography.displaySmall.lineHeight,
    fontWeight: typography.displaySmall.fontWeight,
  },

  // Headline (seções, h1/h2/h3)
  headlineLarge: {
    fontSize: typography.headlineLarge.fontSize,
    lineHeight: typography.headlineLarge.lineHeight,
    fontWeight: typography.headlineLarge.fontWeight,
  },
  headlineMedium: {
    fontSize: typography.headlineMedium.fontSize,
    lineHeight: typography.headlineMedium.lineHeight,
    fontWeight: typography.headlineMedium.fontWeight,
  },
  headlineSmall: {
    fontSize: typography.headlineSmall.fontSize,
    lineHeight: typography.headlineSmall.lineHeight,
    fontWeight: typography.headlineSmall.fontWeight,
  },

  // Title (cards, subtítulos)
  titleLarge: {
    fontSize: typography.titleLarge.fontSize,
    lineHeight: typography.titleLarge.lineHeight,
    fontWeight: typography.titleLarge.fontWeight,
  },
  titleMedium: {
    fontSize: typography.titleMedium.fontSize,
    lineHeight: typography.titleMedium.lineHeight,
    fontWeight: typography.titleMedium.fontWeight,
  },
  titleSmall: {
    fontSize: typography.titleSmall.fontSize,
    lineHeight: typography.titleSmall.lineHeight,
    fontWeight: typography.titleSmall.fontWeight,
  },

  // Body (texto corrido)
  bodyLarge: {
    fontSize: typography.bodyLarge.fontSize,
    lineHeight: typography.bodyLarge.lineHeight,
    fontWeight: typography.bodyLarge.fontWeight,
  },
  bodyMedium: {
    fontSize: typography.bodyMedium.fontSize,
    lineHeight: typography.bodyMedium.lineHeight,
    fontWeight: typography.bodyMedium.fontWeight,
  },
  bodySmall: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    fontWeight: typography.bodySmall.fontWeight,
  },

  // Label (botões, tags)
  labelLarge: {
    fontSize: typography.labelLarge.fontSize,
    lineHeight: typography.labelLarge.lineHeight,
    fontWeight: typography.labelLarge.fontWeight,
  },
  labelMedium: {
    fontSize: typography.labelMedium.fontSize,
    lineHeight: typography.labelMedium.lineHeight,
    fontWeight: typography.labelMedium.fontWeight,
  },
  labelSmall: {
    fontSize: typography.labelSmall.fontSize,
    lineHeight: typography.labelSmall.lineHeight,
    fontWeight: typography.labelSmall.fontWeight,
  },

  // Caption (legendas, hints)
  caption: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: typography.caption.fontWeight,
  },
} as const;

// ===========================================
// MIGRATION HELPER FUNCTIONS
// ===========================================

/**
 * Retorna o token de fontSize mais próximo
 */
export function getFontSizeToken(hardcodedSize: number): string {
  const sizes = Object.keys(FONT_SIZE_MAP).map(Number);
  const closest = sizes.reduce((prev, curr) =>
    Math.abs(curr - hardcodedSize) < Math.abs(prev - hardcodedSize) ? curr : prev
  );
  return `typography.${getTypographyStyleForSize(closest)}.fontSize`;
}

/**
 * Retorna o estilo de tipografia para um tamanho
 */
function getTypographyStyleForSize(size: number): string {
  if (size <= 12) return "caption";
  if (size <= 13) return "labelMedium";
  if (size <= 14) return "bodySmall";
  if (size <= 15) return "bodyMedium";
  if (size <= 16) return "bodyLarge";
  if (size <= 18) return "headlineMedium";
  if (size <= 22) return "displaySmall";
  if (size <= 24) return "displayMedium";
  return "displayLarge";
}

/**
 * Retorna o token de spacing mais próximo
 */
export function getSpacingToken(hardcodedSpacing: number): string {
  if (hardcodedSpacing <= 4) return "spacing.xs";
  if (hardcodedSpacing <= 8) return "spacing.sm";
  if (hardcodedSpacing <= 12) return "spacing.md";
  if (hardcodedSpacing <= 16) return "spacing.lg";
  if (hardcodedSpacing <= 20) return "spacing.xl";
  if (hardcodedSpacing <= 24) return 'spacing["2xl"]';
  if (hardcodedSpacing <= 32) return 'spacing["3xl"]';
  if (hardcodedSpacing <= 40) return 'spacing["4xl"]';
  if (hardcodedSpacing <= 48) return 'spacing["5xl"]';
  if (hardcodedSpacing <= 64) return 'spacing["6xl"]';
  if (hardcodedSpacing <= 80) return 'spacing["7xl"]';
  return 'spacing["8xl"]';
}

/**
 * Retorna o token de radius mais próximo
 */
export function getRadiusToken(hardcodedRadius: number): string {
  if (hardcodedRadius === 0) return "radius.none";
  if (hardcodedRadius <= 4) return "radius.xs";
  if (hardcodedRadius <= 8) return "radius.sm";
  if (hardcodedRadius <= 12) return "radius.md";
  if (hardcodedRadius <= 16) return "radius.lg";
  if (hardcodedRadius <= 20) return "radius.xl";
  if (hardcodedRadius <= 24) return 'radius["2xl"]';
  if (hardcodedRadius <= 28) return 'radius["3xl"]';
  if (hardcodedRadius >= 9999) return "radius.full";
  return 'radius["2xl"]';
}
