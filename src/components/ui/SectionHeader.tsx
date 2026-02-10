import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/useTheme";
import { spacing, typography } from "../../theme/tokens";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  icon?: React.ReactNode;
  emoji?: string;
}

export function SectionHeader({ title, subtitle, action, icon, emoji }: SectionHeaderProps) {
  const { colors, isDark } = useTheme();

  const handleAction = async () => {
    if (action) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      action.onPress();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleArea}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        {icon && !emoji && icon}
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.title, { color: isDark ? colors.neutral[100] : colors.neutral[800] }]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? colors.neutral[400] : colors.neutral[500] },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {action && (
        <Pressable
          onPress={handleAction}
          style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.actionLabel, { color: colors.primary[500] }]}>{action.label}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary[500]} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  titleArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.base,
    marginTop: 2,
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
  },
});

export default SectionHeader;
