/**
 * ThemeSelector - Theme selection component (light/dark/system)
 *
 * Clean card with three toggle buttons.
 * Uses lucide-react-native icons for consistency.
 *
 * @version 2.0 - Feb 2026
 */

import * as Haptics from "expo-haptics";
import { Moon, Monitor, Sun } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme, type ThemeMode } from "@/hooks/useTheme";
import { typography, spacing, radius } from "@/theme/tokens";
import { shadowPresets } from "@/utils/shadow";

interface ThemeOptionConfig {
  value: ThemeMode;
  label: string;
  icon: LucideIcon;
}

const THEME_OPTIONS: ThemeOptionConfig[] = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

export function ThemeSelector() {
  const { colors, theme, setTheme, isDark, text } = useTheme();

  const textMain = text.primary;
  const textSecondary = text.secondary;

  return (
    <View>
      <Text
        style={[
          styles.title,
          {
            color: textMain,
            fontFamily: typography.fontFamily.semibold,
          },
        ]}
      >
        Aparencia
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.background.card,
            ...shadowPresets.sm,
          },
        ]}
      >
        <View style={styles.row}>
          {THEME_OPTIONS.map((option) => {
            const selected = theme === option.value;
            const Icon = option.icon;

            return (
              <Pressable
                key={option.value}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme(option.value);
                }}
                accessibilityLabel={`Tema ${option.label.toLowerCase()}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[
                  styles.option,
                  {
                    backgroundColor: selected
                      ? isDark
                        ? colors.primary[800]
                        : colors.primary[50]
                      : "transparent",
                    borderColor: selected
                      ? colors.primary[500]
                      : isDark
                        ? colors.neutral[700]
                        : "transparent",
                  },
                ]}
              >
                <Icon
                  size={24}
                  color={selected ? colors.primary[500] : textSecondary}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    {
                      color: selected ? colors.primary[500] : textSecondary,
                      fontFamily: typography.fontFamily.semibold,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.titleMedium.fontSize,
    marginBottom: spacing.md,
  },

  card: {
    borderRadius: radius["2xl"],
    padding: spacing.md,
  },

  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  option: {
    flex: 1,
    alignItems: "center",
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    borderWidth: 2,
  },

  optionLabel: {
    fontSize: typography.titleSmall.fontSize,
    marginTop: spacing.xs,
  },
});
