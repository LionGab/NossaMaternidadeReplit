/**
 * ThemeSelector - Theme selection component (light/dark/system)
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { typography, spacing, radius } from "@/theme/tokens";

interface ThemeSelectorProps {
  animationDelay?: number;
}

type ThemeOption = "light" | "dark" | "system";

interface ThemeButtonProps {
  value: ThemeOption;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
  textSecondary: string;
  colors: ReturnType<typeof useTheme>["colors"];
  isDark: boolean;
  position: "left" | "center" | "right";
}

function ThemeButton({
  value: _value,
  label,
  icon,
  selected,
  onPress,
  textSecondary,
  colors,
  isDark,
  position,
}: ThemeButtonProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const marginStyle =
    position === "left"
      ? { marginRight: spacing.sm }
      : position === "right"
        ? { marginLeft: spacing.sm }
        : { marginHorizontal: spacing.sm };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={`Tema ${label.toLowerCase()}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: selected
          ? isDark
            ? colors.primary[800]
            : colors.primary[50]
          : "transparent",
        borderRadius: radius.lg,
        paddingVertical: spacing.lg,
        ...marginStyle,
        borderWidth: 2,
        borderColor: selected ? colors.primary[500] : isDark ? colors.neutral[700] : "transparent",
      }}
    >
      <Ionicons name={icon} size={28} color={selected ? colors.primary[500] : textSecondary} />
      <Text
        style={{
          fontSize: typography.titleSmall.fontSize,
          fontWeight: "600",
          marginTop: spacing.sm,
          color: selected ? colors.primary[500] : textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ThemeSelector({ animationDelay = 300 }: ThemeSelectorProps) {
  const { colors, theme, setTheme, isDark, text } = useTheme();

  const textMain = text.primary;
  const textSecondary = text.secondary;

  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay).duration(600).springify()}
      style={{ paddingHorizontal: spacing["2xl"], marginBottom: spacing["3xl"] }}
    >
      <Text
        style={{
          color: textMain,
          fontSize: typography.titleMedium.fontSize,
          fontWeight: "600",
          marginBottom: spacing.lg,
        }}
      >
        Aparencia
      </Text>
      <View
        style={{
          backgroundColor: colors.background.card,
          borderRadius: radius["2xl"],
          padding: spacing.xl,
          shadowColor: colors.neutral[900],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemeButton
            value="light"
            label="Claro"
            icon="sunny"
            selected={theme === "light"}
            onPress={() => setTheme("light")}
            textSecondary={textSecondary}
            colors={colors}
            isDark={isDark}
            position="left"
          />
          <ThemeButton
            value="dark"
            label="Escuro"
            icon="moon"
            selected={theme === "dark"}
            onPress={() => setTheme("dark")}
            textSecondary={textSecondary}
            colors={colors}
            isDark={isDark}
            position="center"
          />
          <ThemeButton
            value="system"
            label="Sistema"
            icon="phone-portrait"
            selected={theme === "system"}
            onPress={() => setTheme("system")}
            textSecondary={textSecondary}
            colors={colors}
            isDark={isDark}
            position="right"
          />
        </View>
      </View>
    </Animated.View>
  );
}
