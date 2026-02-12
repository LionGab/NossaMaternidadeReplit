/**
 * NathTypography Components
 * Componentes de texto padronizados seguindo o design system 2026.
 *
 * Sistema tipografico:
 * - Display/Brand (h1, h2, button): Poppins SemiBold/Medium
 * - Body/UI (body, caption, label): System font (melhor legibilidade nativa)
 * - Data (data): System font + fontVariant tabular-nums
 *
 * Variantes:
 * - h1: Titulo principal (28px, Poppins SemiBold)
 * - h2: Titulo de secao (22px, Poppins SemiBold)
 * - title: Titulo de card (18px, Poppins SemiBold)
 * - subtitle: Subtitulo (16px, Poppins Medium)
 * - body: Corpo de texto (15px, System)
 * - caption: Textos pequenos (12px, System)
 * - label: Labels de formularios (13px, Poppins Medium)
 * - data: Metricas/numeros (16px, System + tabular-nums)
 * - button: Labels de botao (14px, Poppins Medium)
 */

import { Tokens, typography } from "@/theme/tokens";
import React from "react";
import {
  Platform,
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  StyleSheet,
  TextStyle,
} from "react-native";

const nathColors = {
  text: {
    DEFAULT: Tokens.neutral[800],
    muted: Tokens.neutral[500],
    light: Tokens.neutral[600],
  },
} as const;

type TypographyVariant =
  | "h1"
  | "h2"
  | "title"
  | "subtitle"
  | "body"
  | "caption"
  | "label"
  | "data"
  | "button";

interface NathTextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: "DEFAULT" | "muted" | "light" | string;
  weight?: "regular" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  style?: StyleProp<TextStyle>;
}

/**
 * Resolve fontFamily por variante.
 * Display variants usam Poppins; body/caption usam system font.
 */
function getFontFamilyForVariant(variant: TypographyVariant): string | undefined {
  switch (variant) {
    case "h1":
    case "h2":
    case "title":
      return typography.fontFamily.poppinsDisplay;
    case "subtitle":
    case "label":
    case "button":
      return typography.fontFamily.poppinsLabel;
    case "body":
    case "caption":
    case "data":
      // System font: undefined on iOS (uses SF Pro), sans-serif on Android
      return typography.fontFamily.system;
    default:
      return typography.fontFamily.system;
  }
}

export const NathText: React.FC<NathTextProps> = ({
  children,
  variant = "body",
  color = "DEFAULT",
  weight,
  align = "left",
  style,
  ...props
}) => {
  const textColor =
    color in nathColors.text ? nathColors.text[color as keyof typeof nathColors.text] : color;

  const fontWeightMap = {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  };

  const weightFontFamilyMap: Record<string, string | undefined> = {
    regular: typography.fontFamily.system,
    medium: typography.fontFamily.systemMedium,
    semibold: typography.fontFamily.poppinsDisplay,
    bold: typography.fontFamily.poppinsDisplay,
  };

  const baseStyles: StyleProp<TextStyle> = [
    styles[variant],
    {
      color: textColor,
      textAlign: align,
      fontFamily: getFontFamilyForVariant(variant),
    },
    // Data variant gets tabular-nums for aligned numbers
    variant === "data" && { fontVariant: ["tabular-nums"] },
    // Weight override
    weight && {
      fontWeight: fontWeightMap[weight],
      fontFamily: weightFontFamilyMap[weight],
    },
    style,
  ];

  return (
    <RNText style={baseStyles} {...props}>
      {children}
    </RNText>
  );
};

// Convenience components
export const Title: React.FC<Omit<NathTextProps, "variant">> = (props) => (
  <NathText variant="title" {...props} />
);

export const Subtitle: React.FC<Omit<NathTextProps, "variant">> = (props) => (
  <NathText variant="subtitle" {...props} />
);

export const Body: React.FC<Omit<NathTextProps, "variant">> = (props) => (
  <NathText variant="body" {...props} />
);

export const Caption: React.FC<Omit<NathTextProps, "variant">> = (props) => (
  <NathText variant="caption" {...props} />
);

export const Label: React.FC<Omit<NathTextProps, "variant">> = (props) => (
  <NathText variant="label" {...props} />
);

export const DataText: React.FC<Omit<NathTextProps, "variant">> = (props) => (
  <NathText variant="data" {...props} />
);

/** Alias for the primary typography component */
export const Typography = NathText;

const tightLetterSpacing = Platform.select({ ios: -0.5, default: -0.2 });
const wideLetterSpacing = Platform.select({ ios: 0.3, default: 0.5 });

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 34,
    letterSpacing: tightLetterSpacing,
    color: nathColors.text.DEFAULT,
  },

  h2: {
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: tightLetterSpacing,
    color: nathColors.text.DEFAULT,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: tightLetterSpacing,
    color: nathColors.text.DEFAULT,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    color: nathColors.text.DEFAULT,
  },

  body: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
    color: nathColors.text.DEFAULT,
  },

  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: nathColors.text.muted,
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    letterSpacing: wideLetterSpacing,
    color: nathColors.text.DEFAULT,
  },

  data: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    color: nathColors.text.DEFAULT,
  },

  button: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: wideLetterSpacing,
    color: nathColors.text.DEFAULT,
  },
});

export default NathText;
