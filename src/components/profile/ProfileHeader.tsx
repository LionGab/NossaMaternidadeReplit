/**
 * ProfileHeader - Profile card with avatar, name, and stats
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/hooks/useTheme";
import { Tokens, typography, spacing, radius } from "@/theme/tokens";
import { getStageLabel } from "@/utils/formatters";
import type { UserProfile } from "@/types/navigation";

interface ProfileHeaderProps {
  user: UserProfile | null;
  onEditPress: () => void;
  onSettingsPress: () => void;
}

export function ProfileHeader({ user, onEditPress, onSettingsPress }: ProfileHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark, text } = useTheme();

  const textMain = text.primary;
  const textSecondary = text.secondary;
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

  const handleSettingsPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSettingsPress();
  };

  const handleAvatarPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEditPress();
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={{
        paddingTop: insets.top + spacing.xl,
        paddingHorizontal: spacing["2xl"],
        paddingBottom: spacing["3xl"],
      }}
    >
      {/* Title Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: spacing["3xl"],
        }}
      >
        <Text
          style={{
            color: textMain,
            fontSize: typography.headlineLarge.fontSize,
            fontFamily: typography.fontFamily.display,
          }}
        >
          Perfil
        </Text>
        <Pressable
          onPress={handleSettingsPress}
          accessibilityLabel="Abrir configurações"
          accessibilityRole="button"
          style={{
            padding: spacing.sm,
            backgroundColor: colors.background.card,
            borderRadius: radius.md,
            shadowColor: colors.neutral[900],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
          }}
        >
          <Ionicons name="settings-outline" size={24} color={textSecondary} />
        </Pressable>
      </View>

      {/* Profile Card */}
      <View
        style={{
          backgroundColor: colors.background.card,
          borderRadius: spacing["3xl"],
          padding: spacing["3xl"],
          shadowColor: colors.neutral[900],
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 24,
        }}
      >
        <View style={{ alignItems: "center" }}>
          {/* Avatar Container with Badge */}
          <View style={{ position: "relative", marginBottom: spacing.xl }}>
            <Pressable
              onPress={handleAvatarPress}
              accessibilityLabel="Adicionar foto de perfil"
              accessibilityRole="button"
              style={{
                width: 112,
                height: 112,
                borderRadius: 56,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDark ? colors.primary[800] : colors.primary[100],
              }}
            >
              <Ionicons name="person" size={52} color={textSecondary} />
            </Pressable>

            {/* Add Photo Badge */}
            <Pressable
              onPress={handleAvatarPress}
              accessibilityLabel="Adicionar foto"
              accessibilityRole="button"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.primary[500],
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 3,
                borderColor: colors.background.card,
                shadowColor: colors.neutral[900],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="camera" size={18} color={Tokens.neutral[0]} />
            </Pressable>
          </View>

          {/* Name */}
          <Text
            style={{
              color: textMain,
              fontSize: typography.headlineSmall.fontSize,
              fontFamily: typography.fontFamily.display,
              marginBottom: spacing.md,
            }}
          >
            {user?.name || "Usuaria"}
          </Text>

          {/* Stage Badge */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                borderRadius: radius.full,
                backgroundColor: isDark ? colors.primary[800] : colors.primary[50],
              }}
            >
              <Text
                style={{
                  color: colors.primary[500],
                  fontSize: typography.bodyLarge.fontSize,
                  fontWeight: "600",
                }}
              >
                {getStageLabel(user?.stage)}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View
          style={{
            flexDirection: "row",
            marginTop: spacing["3xl"],
            paddingTop: spacing["3xl"],
            borderTopWidth: 1,
            borderTopColor: borderColor,
          }}
        >
          <StatItem label="Posts" value={0} textMain={textMain} textSecondary={textSecondary} />
          <View style={{ width: 1, backgroundColor: borderColor }} />
          <StatItem label="Grupos" value={0} textMain={textMain} textSecondary={textSecondary} />
          <View style={{ width: 1, backgroundColor: borderColor }} />
          <StatItem
            label="Interesses"
            value={user?.interests?.length || 0}
            textMain={textMain}
            textSecondary={textSecondary}
          />
        </View>
      </View>
    </Animated.View>
  );
}

interface StatItemProps {
  label: string;
  value: number;
  textMain: string;
  textSecondary: string;
}

function StatItem({ label, value, textMain, textSecondary }: StatItemProps) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text
        style={{
          color: textMain,
          fontSize: typography.headlineSmall.fontSize,
          fontWeight: "700",
          marginBottom: spacing.xs,
        }}
      >
        {value}
      </Text>
      <Text style={{ color: textSecondary, fontSize: typography.titleSmall.fontSize }}>
        {label}
      </Text>
    </View>
  );
}
