/**
 * SettingsSection - Grouped menu items in a card
 *
 * Clean card with grouped rows, chevrons, and icon containers.
 * Matches premium design of HomeScreen cards.
 *
 * @version 1.0 - Feb 2026
 */

import * as Haptics from "expo-haptics";
import { ChevronRight, type LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Tokens, typography, spacing, radius } from "@/theme/tokens";
import { shadowPresets } from "@/utils/shadow";

export interface SettingsItem {
  id: string;
  label: string;
  icon: LucideIcon;
  iconColor?: string;
  onPress: () => void;
  trailing?: React.ReactNode;
}

interface SettingsSectionProps {
  title: string;
  items: SettingsItem[];
}

export function SettingsSection({ title, items }: SettingsSectionProps) {
  const { colors, isDark, text } = useTheme();

  const textMain = text.primary;
  const textSecondary = text.secondary;
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

  return (
    <View>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: textMain,
            fontFamily: typography.fontFamily.semibold,
          },
        ]}
      >
        {title}
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
        {items.map((item, index) => {
          const Icon = item.icon;
          const iconColor = item.iconColor || colors.primary[500];

          return (
            <React.Fragment key={item.id}>
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  item.onPress();
                }}
                accessibilityLabel={item.label}
                accessibilityRole="menuitem"
                style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isDark ? `${iconColor}20` : `${iconColor}12`,
                    },
                  ]}
                >
                  <Icon size={20} color={iconColor} strokeWidth={2} />
                </View>
                <Text
                  style={[
                    styles.label,
                    {
                      color: textMain,
                      fontFamily: typography.fontFamily.medium,
                    },
                  ]}
                >
                  {item.label}
                </Text>
                {item.trailing ?? <ChevronRight size={18} color={textSecondary} strokeWidth={2} />}
              </Pressable>
              {index < items.length - 1 && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: borderColor, marginLeft: 44 + spacing.lg },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: typography.titleMedium.fontSize,
    marginBottom: spacing.md,
  },

  card: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
  },

  label: {
    flex: 1,
    fontSize: typography.bodyMedium.fontSize,
  },

  divider: {
    height: 1,
  },
});
