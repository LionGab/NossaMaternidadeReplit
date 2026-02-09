/**
 * CloseFriendsSection - Seção de conteúdo exclusivo Close Friends
 * 
 * Mostra conteúdo exclusivo da Nath para assinantes Premium
 * Similar ao Instagram Close Friends - conteúdo especial e privado
 */

import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Crown, Heart, Lock, Sparkles, Star, Users } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { useCloseFriends } from "@/hooks/useCloseFriends";
import { useAdmin } from "@/hooks/useAdmin";
import { maternal, nathAccent, neutral, spacing, radius, typography } from "@/theme/tokens";

const NATH_AVATAR = "https://i.imgur.com/2Lv2Ihq.png";

interface CloseFriendsSectionProps {
  onUpgrade?: () => void;
  onViewContent?: () => void;
}

export function CloseFriendsSection({ onUpgrade, onViewContent }: CloseFriendsSectionProps) {
  const { isCloseFriend, isLoading } = useCloseFriends();
  const { isAdmin } = useAdmin();

  const sparkleOpacity = useSharedValue(0.6);

  React.useEffect(() => {
    sparkleOpacity.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, [sparkleOpacity]);

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  if (isLoading) {
    return null;
  }

  if (isCloseFriend || isAdmin) {
    return (
      <Animated.View entering={FadeInUp.duration(500).delay(100)}>
        <LinearGradient
          colors={[maternal.warmth.blush, nathAccent.closeFriends.purpleLight, maternal.calm.lavender]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.closeFriendsCard}
        >
          <View style={styles.closeFriendsHeader}>
            <View style={styles.closeFriendsIconContainer}>
              <LinearGradient
                colors={[nathAccent.closeFriends.purple, nathAccent.closeFriends.purpleGradient]}
                style={styles.closeFriendsIcon}
              >
                <Star size={20} color={neutral[0]} fill={neutral[0]} />
              </LinearGradient>
            </View>
            
            <View style={styles.closeFriendsInfo}>
              <View style={styles.closeFriendsTitle}>
                <Text style={styles.closeFriendsTitleText}>Close Friends</Text>
                <Animated.View style={sparkleStyle}>
                  <Sparkles size={16} color={nathAccent.closeFriends.purple} />
                </Animated.View>
              </View>
              <Text style={styles.closeFriendsSubtitle}>
                Conteúdo exclusivo desbloqueado
              </Text>
            </View>
          </View>

          <View style={styles.closeFriendsContent}>
            <View style={styles.exclusivePost}>
              <Image
                source={{ uri: NATH_AVATAR }}
                style={styles.exclusiveAvatar}
                contentFit="cover"
              />
              <View style={styles.exclusiveTextContainer}>
                <View style={styles.exclusiveBadge}>
                  <Crown size={10} color={nathAccent.closeFriends.purple} />
                  <Text style={styles.exclusiveBadgeText}>Novo</Text>
                </View>
                <Text style={styles.exclusiveTitle}>
                  Diário da Nath 📖
                </Text>
                <Text style={styles.exclusiveDescription}>
                  "Hoje acordei pensando em como a maternidade..."
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.viewContentButton,
              { opacity: pressed ? 0.9 : 1 }
            ]}
            onPress={onViewContent}
          >
            <Text style={styles.viewContentText}>Ver conteúdo exclusivo</Text>
            <Heart size={16} color={neutral[0]} />
          </Pressable>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(500).delay(100)}>
      <LinearGradient
        colors={[maternal.calm.lavender, maternal.bond.together, nathAccent.closeFriends.purpleLight]}
        style={styles.lockedCard}
      >
        <View style={styles.lockedContent}>
          <View style={styles.lockedIconContainer}>
            <LinearGradient
              colors={[nathAccent.closeFriends.purple, nathAccent.closeFriends.purpleGradient]}
              style={styles.lockedIcon}
            >
              <Lock size={24} color={neutral[0]} />
            </LinearGradient>
          </View>
          
          <Text style={styles.lockedTitle}>Close Friends</Text>
          <Text style={styles.lockedDescription}>
            Desbloqueie conteúdo exclusivo da Nath
          </Text>
          
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Star
                size={14}
                color={nathAccent.closeFriends.purple}
                fill={nathAccent.closeFriends.purple}
              />
              <Text style={styles.benefitText}>Diário pessoal da Nath</Text>
            </View>
            <View style={styles.benefitItem}>
              <Heart
                size={14}
                color={nathAccent.closeFriends.purple}
                fill={nathAccent.closeFriends.purple}
              />
              <Text style={styles.benefitText}>Mensagens exclusivas</Text>
            </View>
            <View style={styles.benefitItem}>
              <Users size={14} color={nathAccent.closeFriends.purple} />
              <Text style={styles.benefitText}>Lives privadas</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.upgradeButton,
              { opacity: pressed ? 0.9 : 1 }
            ]}
            onPress={onUpgrade}
          >
            <LinearGradient
              colors={[nathAccent.closeFriends.purple, nathAccent.closeFriends.purpleGradient]}
              style={styles.upgradeGradient}
            >
              <Crown size={18} color={neutral[0]} />
              <Text style={styles.upgradeText}>Tornar-se Close Friend</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  closeFriendsCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    shadowColor: nathAccent.closeFriends.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  closeFriendsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  closeFriendsIconContainer: {
    marginRight: spacing.md,
  },

  closeFriendsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: nathAccent.closeFriends.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  closeFriendsInfo: {
    flex: 1,
  },

  closeFriendsTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  closeFriendsTitleText: {
    fontSize: 18,
    fontWeight: "700",
    color: nathAccent.closeFriends.purpleDark,
    fontFamily: typography.fontFamily.bold,
  },

  closeFriendsSubtitle: {
    fontSize: 13,
    color: nathAccent.closeFriends.purpleMuted,
    marginTop: 2,
    fontFamily: typography.fontFamily.base,
  },

  closeFriendsContent: {
    marginBottom: spacing.lg,
  },

  exclusivePost: {
    flexDirection: "row",
    backgroundColor: nathAccent.closeFriends.panelGlass,
    borderRadius: radius.xl,
    padding: spacing.md,
  },

  exclusiveAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: nathAccent.closeFriends.purple,
  },

  exclusiveTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },

  exclusiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: nathAccent.closeFriends.badge,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: 4,
    marginBottom: 4,
  },

  exclusiveBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: nathAccent.closeFriends.purple,
    textTransform: "uppercase",
  },

  exclusiveTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: nathAccent.closeFriends.purpleDark,
    marginBottom: 2,
  },

  exclusiveDescription: {
    fontSize: 13,
    color: nathAccent.closeFriends.purpleMuted,
    lineHeight: 18,
  },

  viewContentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nathAccent.closeFriends.purple,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    gap: spacing.sm,
    shadowColor: nathAccent.closeFriends.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  viewContentText: {
    fontSize: 15,
    fontWeight: "700",
    color: neutral[0],
    fontFamily: typography.fontFamily.bold,
  },

  lockedCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: nathAccent.closeFriends.border,
  },

  lockedContent: {
    alignItems: "center",
  },

  lockedIconContainer: {
    marginBottom: spacing.lg,
  },

  lockedIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: nathAccent.closeFriends.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  lockedTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: nathAccent.closeFriends.purpleDark,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.bold,
  },

  lockedDescription: {
    fontSize: 14,
    color: nathAccent.closeFriends.purpleMuted,
    textAlign: "center",
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.base,
  },

  benefitsList: {
    alignSelf: "stretch",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },

  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  benefitText: {
    fontSize: 14,
    color: nathAccent.closeFriends.purpleGray,
    fontFamily: typography.fontFamily.base,
  },

  upgradeButton: {
    alignSelf: "stretch",
    borderRadius: radius.xl,
    overflow: "hidden",
    shadowColor: nathAccent.closeFriends.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  upgradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },

  upgradeText: {
    fontSize: 15,
    fontWeight: "700",
    color: neutral[0],
    fontFamily: typography.fontFamily.bold,
  },
});
