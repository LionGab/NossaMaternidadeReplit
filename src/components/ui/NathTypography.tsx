/**
 * NathTypography Components
 * Componentes de texto padronizados seguindo o design Nathia
 *
 * Uso:
 * - Title: Títulos principais (24px, bold)
 * - Subtitle: Subtítulos (18px, bold)
 * - Body: Corpo de texto (14px, regular/medium)
 * - Caption: Textos pequenos (12px, regular)
 * - Label: Labels de formulários (12px, semibold)
 */

import { Tokens, typography } from "@/theme/tokens";
import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  StyleSheet,
  TextStyle,
} from "react-native";

// Cores do design Nathia
const nathColors = {
  text: {
    DEFAULT: Tokens.neutral[800],
    muted: Tokens.neutral[500],
    light: Tokens.neutral[600],
  },
} as const;

interface NathTextProps extends RNTextProps {
  variant?: "title" | "subtitle" | "body" | "caption" | "label";
  color?: "DEFAULT" | "muted" | "light" | string;
  weight?: "regular" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  style?: StyleProp<TextStyle>;
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

  const fontFamilyMap = {
    regular: typography.fontFamily.base,
    medium: typography.fontFamily.medium,
    semibold: typography.fontFamily.semibold,
    bold: typography.fontFamily.bold,
  };

  const baseStyles: StyleProp<TextStyle> = [
    styles[variant],
    { color: textColor, textAlign: align },
    weight && {
      fontWeight: fontWeightMap[weight],
      fontFamily: fontFamilyMap[weight],
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

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 24 * 1.1,
    color: nathColors.text.DEFAULT,
  },

  subtitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 18 * 1.25,
    color: nathColors.text.DEFAULT,
  },

  body: {
    fontFamily: typography.fontFamily.base,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 14 * 1.625,
    color: nathColors.text.DEFAULT,
  },

  caption: {
    fontFamily: typography.fontFamily.base,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 12 * 1.5,
    color: nathColors.text.muted,
  },

  label: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 12 * 1.5,
    color: nathColors.text.DEFAULT,
  },
});

export default NathText;
