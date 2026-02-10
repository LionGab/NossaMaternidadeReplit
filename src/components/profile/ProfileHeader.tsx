/**
 * ProfileHeader - Premium profile card with gradient avatar ring
 *
 * Design: Flo Health inspired, card-based with refined shadows
 * - Gradient ring around avatar (brand accent -> primary)
 * - Stage badge with subtle background
 * - Stats row with clean dividers
 *
 * @version 2.0 - Premium Redesign Feb 2026
 */

import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Camera, Crown } from "lucide-react-native";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { useIsPremium } from "@/state/premium-store";
import { brand, Tokens, typography, spacing, radius } from "@/theme/tokens";
import { shadowPresets } from "@/utils/shadow";
import { getStageLabel } from "@/utils/formatters";
import type { UserProfile } from "@/types/navigation";

interface ProfileHeaderProps {
  user: UserProfile | null;
  onEditPress: () => void;
}

export function ProfileHeader({ user, onEditPress }: ProfileHeaderProps) {
  const { colors, isDark, text } = useTheme();
  const isPremium = useIsPremium();

  const textMain = text.primary;
  const textSecondary = text.secondary;
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

  const handleAvatarPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEditPress();
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background.card,
          ...shadowPresets.md,
        },
      ]}
    >
      <View style={styles.topSection}>
        {/* Avatar with Gradient Ring */}
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[brand.accent[400], brand.primary[400], brand.secondary[400]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <Pressable
              onPress={handleAvatarPress}
              accessibilityLabel="Foto de perfil"
              accessibilityRole="button"
              style={[styles.avatarInner, { backgroundColor: colors.background.card }]}
            >
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    {
                      backgroundColor: isDark ? colors.primary[800] : colors.primary[50],
                    },
                  ]}
                >
                  <Text style={styles.avatarInitial}>
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </Pressable>
          </LinearGradient>

          {/* Camera Badge */}
          <Pressable
            onPress={handleAvatarPress}
            accessibilityLabel="Editar foto"
            accessibilityRole="button"
            style={[
              styles.cameraBadge,
              {
                backgroundColor: brand.accent[500],
                borderColor: colors.background.card,
              },
            ]}
          >
            <Camera size={14} color={Tokens.neutral[0]} strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Name + Stage */}
        <View style={styles.nameSection}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.name,
                {
                  color: textMain,
                  fontFamily: typography.fontFamily.bold,
                },
              ]}
              numberOfLines={1}
            >
              {user?.name || "Usuaria"}
            </Text>
            {isPremium && (
              <View
                style={[
                  styles.premiumBadge,
                  {
                    backgroundColor: isDark ? brand.accent[900] : brand.accent[50],
                  },
                ]}
              >
                <Crown size={12} color={brand.accent[500]} strokeWidth={2.5} />
                <Text style={[styles.premiumText, { color: brand.accent[500] }]}>PRO</Text>
              </View>
            )}
          </View>

          <View
            style={[
              styles.stageBadge,
              {
                backgroundColor: isDark ? colors.primary[800] : colors.primary[50],
              },
            ]}
          >
            <Text style={[styles.stageText, { color: colors.primary[500] }]}>
              {getStageLabel(user?.stage)}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={[styles.statsRow, { borderTopColor: borderColor }]}>
        <StatItem label="Posts" value={0} textMain={textMain} textSecondary={textSecondary} />
        <View style={[styles.statDivider, { backgroundColor: borderColor }]} />
        <StatItem label="Grupos" value={0} textMain={textMain} textSecondary={textSecondary} />
        <View style={[styles.statDivider, { backgroundColor: borderColor }]} />
        <StatItem
          label="Interesses"
          value={user?.interests?.length || 0}
          textMain={textMain}
          textSecondary={textSecondary}
        />
      </View>
    </View>
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
    <View style={styles.statItem}>
      <Text
        style={[
          styles.statValue,
          {
            color: textMain,
            fontFamily: typography.fontFamily.bold,
          },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.statLabel,
          {
            color: textSecondary,
            fontFamily: typography.fontFamily.base,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const AVATAR_SIZE = 96;
const RING_SIZE = AVATAR_SIZE + 8;

const styles = StyleSheet.create({
  card: {
    borderRadius: radius["2xl"],
    padding: spacing.xl,
  },

  topSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarContainer: {
    position: "relative",
  },

  avatarRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInner: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
  },

  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },

  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInitial: {
    fontSize: 36,
    fontFamily: typography.fontFamily.bold,
    color: brand.primary[400],
  },

  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
  },

  nameSection: {
    flex: 1,
    marginLeft: spacing.xl,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  name: {
    fontSize: typography.headlineMedium.fontSize,
    lineHeight: typography.headlineMedium.lineHeight,
    flexShrink: 1,
  },

  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },

  premiumText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },

  stageBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  stageText: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: typography.fontFamily.semibold,
  },

  statsRow: {
    flexDirection: "row",
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: typography.headlineSmall.fontSize,
    marginBottom: 2,
  },

  statLabel: {
    fontSize: typography.caption.fontSize,
  },

  statDivider: {
    width: 1,
  },
});
