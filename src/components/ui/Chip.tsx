import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/useTheme";

interface ChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
  variant?: "default" | "outline" | "soft";
  color?: string;
  size?: "sm" | "md";
}

export default function Chip({
  label,
  onPress,
  selected = false,
  icon,
  emoji,
  variant = "default",
  color,
  size = "md",
}: ChipProps) {
  const { colors } = useTheme();

  const handlePress = async () => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeStyles = {
    sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 13, iconSize: 14 },
    md: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, iconSize: 16 },
  };

  const currentSize = sizeStyles[size];

  const getStyles = () => {
    if (selected) {
      return {
        bg: color || colors.primary[500],
        text: colors.neutral[0],
        border: color || colors.primary[500],
      };
    }

    switch (variant) {
      case "outline":
        return {
          bg: "transparent",
          text: color || colors.neutral[900],
          border: colors.neutral[200],
        };
      case "soft":
        return {
          bg: colors.background.tertiary,
          text: color || colors.neutral[900],
          border: "transparent",
        };
      default:
        return {
          bg: colors.background.secondary,
          text: colors.neutral[900],
          border: colors.neutral[200],
        };
    }
  };

  const styles = getStyles();

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: styles.bg,
        borderWidth: styles.border !== "transparent" ? 1 : 0,
        borderColor: styles.border,
        borderRadius: 20,
        paddingVertical: currentSize.paddingVertical,
        paddingHorizontal: currentSize.paddingHorizontal,
      }}
    >
      {emoji && <Text style={{ fontSize: currentSize.iconSize, marginRight: 6 }}>{emoji}</Text>}
      {icon && !emoji && (
        <Ionicons
          name={icon}
          size={currentSize.iconSize}
          color={styles.text}
          style={{ marginRight: 6 }}
        />
      )}
      <Text
        style={{
          color: styles.text,
          fontSize: currentSize.fontSize,
          fontWeight: selected ? "600" : "500",
        }}
      >
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          minHeight: 44, // WCAG AAA: minimum tap target
        })}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected }}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
