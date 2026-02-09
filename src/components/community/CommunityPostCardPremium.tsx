/**
 * CommunityPostCardPremium - Card de post estilo "cinema" premium
 *
 * Mobile-First: iOS + Android (App Store / Google Play)
 *
 * Features:
 * - Avatar com glow rosa suave
 * - Hero image 4:3 com radius elegante
 * - Like micro-animação (scale + rotation) com haptics
 * - Sombras premium com feeling rosa (iOS) / elevation (Android)
 * - Typography refinada com Manrope
 * - Acessibilidade WCAG AAA (tap targets 44px+)
 *
 * Performance:
 * - React.memo para evitar re-renders
 * - useCallback para handlers estáveis
 * - Reanimated v4 para animações 60fps
 * - expo-image com cache otimizado
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { CommunityPost } from "../../types/community";
import { formatTimeAgo } from "../../utils/formatters";

interface CommunityPostCardPremiumProps {
  post: CommunityPost;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onMore?: () => void;
}

export const CommunityPostCardPremium: React.FC<CommunityPostCardPremiumProps> = React.memo(
  ({ post, onLike, onComment, onShare, onMore }) => {
    const { isDark } = useTheme();

    // Like animation values (Reanimated v4)
    const likeScale = useSharedValue(1);
    const likeRotation = useSharedValue(0);

    // Local like state (visual only - backend não tem likes ainda)
    const [liked, setLiked] = useState(false);

    // Theme colors usando Tokens
    const bgCard = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
    const textPrimary = isDark ? Tokens.neutral[100] : Tokens.neutral[900];
    const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[700];
    const textMuted = isDark ? Tokens.neutral[500] : Tokens.neutral[500];

    // Animated like style
    const likeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: likeScale.value }, { rotate: `${likeRotation.value}deg` }],
    }));

    // Handle like with premium animation + haptics
    const handleLike = useCallback(() => {
      // Haptic feedback (Medium para ação intencional)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      // Animate: scale 1 -> 1.2 -> 1, rotation 0 -> 15 -> 0
      likeScale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );
      likeRotation.value = withSequence(
        withTiming(15, { duration: 150 }),
        withSpring(0, { damping: 10, stiffness: 150 })
      );

      setLiked((prev) => !prev);
      onLike();
    }, [likeScale, likeRotation, onLike]);

    // Handle comment with haptic
    const handleComment = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      onComment();
    }, [onComment]);

    // Handle share with haptic
    const handleShare = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      onShare();
    }, [onShare]);

    // Handle more options with haptic
    const handleMore = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      onMore?.();
    }, [onMore]);

    // Premium shadow with pink feeling
    // iOS: shadowColor com rosa, Android: elevation padrão
    const premiumShadow = {
      ...Tokens.shadows.md,
      shadowColor: Tokens.brand.accent[300],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: Platform.OS === "android" ? 4 : undefined,
    };

    // Avatar glow shadow (mais sutil no Android)
    const avatarGlowShadow = {
      shadowColor: Tokens.brand.accent[400],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: Platform.OS === "ios" ? 0.4 : 0.25,
      shadowRadius: 8,
      elevation: Platform.OS === "android" ? 3 : undefined,
    };

    return (
      <Animated.View
        entering={FadeInUp.duration(500).springify()}
        style={[styles.container, premiumShadow, { backgroundColor: bgCard }]}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Avatar with glow */}
          <View style={[styles.avatarGlowContainer, avatarGlowShadow]}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: isDark ? Tokens.brand.primary[900] : Tokens.brand.primary[100],
                },
              ]}
            >
              {post.profiles?.avatar_url ? (
                <Image
                  source={{ uri: post.profiles.avatar_url }}
                  style={styles.avatarImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={200}
                  accessibilityLabel={`Foto de perfil de ${post.profiles?.name || "usuaria"}`}
                />
              ) : (
                <Ionicons name="person" size={24} color={Tokens.brand.primary[500]} />
              )}
            </View>
          </View>

          {/* Author info */}
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: textPrimary }]}>
              {post.profiles?.name || "Mãe Anônima"}
            </Text>
            <Text style={[styles.timeAgo, { color: textMuted }]}>
              {formatTimeAgo(post.created_at)}
            </Text>
          </View>

          {/* More options button */}
          {onMore && (
            <Pressable
              onPress={handleMore}
              style={styles.moreButton}
              accessibilityLabel="Mais opcoes do post"
              accessibilityRole="button"
              accessibilityHint="Abre menu com opcoes de denuncia e bloqueio"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={Tokens.neutral[500]} />
            </Pressable>
          )}
        </View>

        {/* Content text */}
        {post.text && <Text style={[styles.content, { color: textSecondary }]}>{post.text}</Text>}

        {/* Hero image 4:3 */}
        {post.signed_media_url && post.media_type === "image" && (
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: post.signed_media_url }}
              style={styles.heroImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={300}
              placeholder={isDark ? Tokens.neutral[700] : Tokens.neutral[200]}
              accessibilityLabel="Imagem compartilhada no post"
            />
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsRow}>
          {/* Like */}
          <Pressable
            onPress={handleLike}
            style={styles.actionButton}
            accessibilityLabel="Curtir post"
            accessibilityRole="button"
            accessibilityState={{ selected: liked }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Animated.View style={likeAnimatedStyle}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={24}
                color={liked ? Tokens.brand.accent[500] : Tokens.neutral[500]}
              />
            </Animated.View>
          </Pressable>

          {/* Comment */}
          <Pressable
            onPress={handleComment}
            style={styles.actionButton}
            accessibilityLabel="Comentar post"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chatbubble-outline" size={22} color={Tokens.neutral[500]} />
          </Pressable>

          {/* Share */}
          <Pressable
            onPress={handleShare}
            style={styles.shareButton}
            accessibilityLabel="Compartilhar post"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="share-outline" size={22} color={Tokens.neutral[500]} />
          </Pressable>
        </View>
      </Animated.View>
    );
  }
);

CommunityPostCardPremium.displayName = "CommunityPostCardPremium";

const styles = StyleSheet.create({
  container: {
    borderRadius: Tokens.radius["2xl"], // 24
    padding: Tokens.spacing.xl, // 20
    marginBottom: Tokens.spacing["3xl"], // 32
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Tokens.spacing.lg, // 16
  },
  avatarGlowContainer: {
    borderRadius: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  authorInfo: {
    flex: 1,
    marginLeft: Tokens.spacing.md, // 12
  },
  moreButton: {
    width: Tokens.accessibility.minTapTarget, // 44
    height: Tokens.accessibility.minTapTarget, // 44
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Tokens.spacing.sm,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.3,
  },
  timeAgo: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "Manrope_500Medium",
    letterSpacing: -0.2,
    marginBottom: Tokens.spacing.lg, // 16
  },
  heroImageContainer: {
    marginBottom: Tokens.spacing.lg, // 16
    borderRadius: Tokens.radius.xl, // 20
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 280,
    borderRadius: Tokens.radius.xl, // 20
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.lg, // 16
  },
  actionButton: {
    width: Tokens.accessibility.minTapTarget, // 44
    height: Tokens.accessibility.minTapTarget, // 44
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton: {
    width: Tokens.accessibility.minTapTarget, // 44
    height: Tokens.accessibility.minTapTarget, // 44
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
});
