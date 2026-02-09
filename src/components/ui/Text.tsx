import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface TextProps extends RNTextProps {
  /** Text variant (semantic typography scale) */
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "label";
  /** Font weight */
  weight?: "normal" | "medium" | "semibold" | "bold";
  /** Text color (semantic or custom hex) */
  color?: "primary" | "secondary" | "muted" | "disabled" | "error" | "success" | string;
  /** Center align text */
  center?: boolean;
  /** Text content */
  children: React.ReactNode;
}

const TYPOGRAPHY_SCALE = {
  h1: { fontSize: 32, lineHeight: 40, fontWeight: "700" as const },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: "600" as const },
  h3: { fontSize: 20, lineHeight: 28, fontWeight: "600" as const },
  h4: { fontSize: 18, lineHeight: 26, fontWeight: "600" as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "500" as const },
};

const FONT_WEIGHTS = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

/**
 * Design System Text Component
 *
 * Typography component with semantic variants, weights, and dark mode support.
 * Provides consistent text styling across the app.
 *
 * @example
 * ```tsx
 * <Text variant="h1">Page Title</Text>
 * <Text variant="body" color="muted">Description text</Text>
 * <Text variant="label" weight="semibold" color="error">Error message</Text>
 * <Text center>Centered text</Text>
 * ```
 */
export function Text({
  variant = "body",
  weight,
  color = "primary",
  center = false,
  children,
  style,
  ...props
}: TextProps) {
  const { colors } = useTheme();

  const typographyStyle = TYPOGRAPHY_SCALE[variant];

  // Resolve color
  const getColor = () => {
    if (color.startsWith("#")) return color; // Custom hex color

    const colorMap: Record<string, string> = {
      primary: colors.neutral[700],
      secondary: colors.neutral[600],
      muted: colors.neutral[500],
      disabled: colors.neutral[400],
      error: colors.semantic.error,
      success: colors.semantic.success,
    };

    return colorMap[color] || colors.neutral[700];
  };

  return (
    <RNText
      {...props}
      style={[
        {
          fontSize: typographyStyle.fontSize,
          lineHeight: typographyStyle.lineHeight,
          fontWeight: weight ? FONT_WEIGHTS[weight] : typographyStyle.fontWeight,
          color: getColor(),
          textAlign: center ? "center" : "left",
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

/** Legacy export for backward compatibility */
export default Text;
