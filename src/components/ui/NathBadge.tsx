/**
 * NathBadge Component
 *
 * Tags e badges com:
 * - Design system tokens
 * - Dark mode support
 * - Variantes semânticas
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { spacing, radius, typography, brand, semantic, neutral } from "@/theme/tokens";
import { useTheme } from "@/hooks/useTheme";

export type BadgeVariant =
  | "rosa"
  | "azul"
  | "verde"
  | "laranja"
  | "muted"
  | "success"
  | "error"
  | "warning";
type BadgeSize = "sm" | "md";

interface NathBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Accessibility label override */
  accessibilityLabel?: string;
  /** Test ID para e2e testing */
  testID?: string;
}

export const NathBadge: React.FC<NathBadgeProps> = ({
  children,
  variant = "rosa",
  size = "md",
  icon,
  style,
  accessibilityLabel,
  testID,
}) => {
  const { isDark } = useTheme();

  // Cores por variante usando design system tokens
  const variantStyles = useMemo(() => {
    const colors = {
      rosa: {
        bg: isDark ? `${brand.accent[400]}33` : brand.accent[100],
        text: isDark ? brand.accent[300] : brand.accent[600],
      },
      azul: {
        bg: isDark ? `${brand.primary[400]}33` : brand.primary[100],
        text: isDark ? brand.primary[300] : brand.primary[600],
      },
      verde: {
        bg: isDark ? `${semantic.light.success}22` : semantic.light.successLight,
        text: isDark ? semantic.dark.success : semantic.light.successText,
      },
      laranja: {
        bg: isDark ? `${semantic.light.warning}22` : semantic.light.warningLight,
        text: isDark ? semantic.dark.warning : semantic.light.warningText,
      },
      muted: {
        bg: isDark ? neutral[800] : neutral[100],
        text: isDark ? neutral[400] : neutral[500],
      },
      success: {
        bg: isDark ? `${semantic.light.success}22` : semantic.light.successLight,
        text: isDark ? semantic.dark.success : semantic.light.successText,
      },
      error: {
        bg: isDark ? `${semantic.light.error}22` : semantic.light.errorLight,
        text: isDark ? semantic.dark.error : semantic.light.errorText,
      },
      warning: {
        bg: isDark ? `${semantic.light.warning}22` : semantic.light.warningLight,
        text: isDark ? semantic.dark.warning : semantic.light.warningText,
      },
    };

    return colors[variant];
  }, [variant, isDark]);

  const badgeStyles: StyleProp<ViewStyle> = [
    styles.base,
    styles[`${size}Size` as keyof typeof styles] as ViewStyle,
    { backgroundColor: variantStyles.bg },
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text` as keyof typeof styles],
    { color: variantStyles.text },
  ];

  // Accessibility label
  const computedLabel = accessibilityLabel || (typeof children === "string" ? children : undefined);

  return (
    <View
      style={badgeStyles}
      accessibilityRole="text"
      accessibilityLabel={computedLabel}
      testID={testID}
    >
      {icon && (
        <View style={styles.icon} accessibilityElementsHidden>
          {icon}
        </View>
      )}
      <Text style={textStyles} accessibilityElementsHidden={!!accessibilityLabel}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
  },

  smSize: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },

  mdSize: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  text: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: "700",
  },

  smText: {
    fontSize: 9,
  },

  mdText: {
    fontSize: 10,
  },

  icon: {
    marginRight: 4,
  },
});

export default NathBadge;
