/**
 * PremiumHeader - Header Premium da Home
 *
 * Features:
 * - Avatar premium com borda suave
 * - Saudação personalizada inline
 * - Design minimalista e elegante
 *
 * @version 3.0 - Clean Design Fevereiro 2026
 */

import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useAppStore } from "@/state";
import { maternal, neutral, spacing, text } from "@/theme/tokens";
import { shadowPresets } from "@/utils/shadow";

const PROFILE_AVATAR = require("../../../assets/images/profile-avatar.png");

const COLORS = {
  cream: maternal.warmth.cream,
  blush: maternal.warmth.blush,
  textPrimary: text.light.primary,
  white: neutral[0],
  border: maternal.warmth.peach,
} as const;

interface PremiumHeaderProps {
  greeting: { emoji: string; text: string };
  userName?: string;
}

export function PremiumHeader({ greeting, userName }: PremiumHeaderProps): React.JSX.Element {
  const displayName = userName?.split(" ")[0] || "Mamãe";
  const userPhoto = useAppStore((s) => s.user?.avatarUrl);

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarBorder}>
            <Image
              source={userPhoto ? { uri: userPhoto } : PROFILE_AVATAR}
              style={styles.avatarImage}
              contentFit="cover"
              accessibilityLabel={`Foto de ${displayName}`}
              transition={200}
            />
          </View>
        </View>

        <Text style={styles.greetingText}>
          {greeting.text}, <Text style={styles.userName}>{displayName}</Text>
        </Text>
      </View>
    </Animated.View>
  );
}

const AVATAR_SIZE = 48;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  avatarWrapper: {
    ...shadowPresets.sm,
  },

  avatarBorder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
    backgroundColor: COLORS.cream,
    borderWidth: 2,
    borderColor: COLORS.border,
  },

  avatarImage: {
    width: AVATAR_SIZE - 4,
    height: AVATAR_SIZE - 4,
    borderRadius: (AVATAR_SIZE - 4) / 2,
  },

  greetingText: {
    fontSize: 18,
    fontFamily: "Manrope_500Medium",
    color: COLORS.textPrimary,
    lineHeight: 24,
  },

  userName: {
    fontFamily: "Manrope_700Bold",
  },
});
