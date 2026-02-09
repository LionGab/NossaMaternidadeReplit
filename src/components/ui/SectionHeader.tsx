import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/useTheme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  action,
  icon,
  emoji,
}: SectionHeaderProps) {
  const { colors, isDark } = useTheme();

  const handleAction = async () => {
    if (action) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      action.onPress();
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {emoji && <Text style={{ fontSize: 20, marginRight: 10 }}>{emoji}</Text>}
        {icon && !emoji && (
          <Ionicons
            name={icon}
            size={20}
            color={isDark ? colors.neutral[300] : colors.neutral[600]}
            style={{ marginRight: 10 }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: isDark ? colors.neutral[100] : colors.neutral[800],
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                color: isDark ? colors.neutral[400] : colors.neutral[500],
                fontSize: 13,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {action && (
        <Pressable
          onPress={handleAction}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            style={{
              color: colors.primary[500],
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            {action.label}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.primary[500]}
            style={{ marginLeft: 2 }}
          />
        </Pressable>
      )}
    </View>
  );
}
