import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { neutral, spacing, text } from "@/theme/tokens";

const COLORS = {
  textPrimary: text.light.primary,
  textMuted: neutral[500],
} as const;

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

export function SectionHeader({ title, icon, subtitle }: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: COLORS.textPrimary,
    lineHeight: 24,
  },

  sectionSubtitle: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: COLORS.textMuted,
    lineHeight: 18,
  },
});
