/**
 * WeeklyHighlights - Destaques da Semana
 *
 * Premium carousel component showing top posts of the week
 * - Smooth horizontal scroll with snap
 * - Gradient backgrounds
 * - Animated entrance
 * - Premium card design with shadows and blur
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Crown, Flame, Heart, MessageCircle, Sparkles } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { CardSkeleton } from "@/components/ui";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { fetchWeeklyHighlights } from "@/api/highlights";
import { Body, Caption, Subtitle } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { brand, mockupColors, nathAccent, radius, shadows, spacing, Tokens } from "@/theme/tokens";
import type { Post } from "@/types/navigation";
import { formatTimeAgo } from "@/utils/formatters";
import { logger } from "@/utils/logger";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.78;
const CARD_MARGIN = spacing.md;

interface WeeklyHighlightsProps {
  onPostPress: (postId: string) => void;
  onLike: (postId: string) => void;
}

const HighlightCard = React.memo(
  ({
    post,
    index,
    onPress,
    onLike,
    isDark,
  }: {
    post: Post;
    index: number;
    onPress: () => void;
    onLike: () => void;
    isDark: boolean;
  }) => {
    const scale = useSharedValue(1);
    const likeScale = useSharedValue(1);

    const cardStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const likeStyle = useAnimatedStyle(() => ({
      transform: [{ scale: likeScale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.98, { damping: 15 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 10 });
    };

    const handleLike = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      likeScale.value = withSpring(1.3, { damping: 10 });
      setTimeout(() => {
        likeScale.value = withSpring(1, { damping: 10 });
      }, 150);
      onLike();
    };

    const bgCard = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
    const textPrimary = isDark ? Tokens.neutral[100] : Tokens.neutral[900];
    const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[600];

    const rankBadgeColors: readonly [string, string][] = [
      [nathAccent.rose, nathAccent.coral] as const,
      [brand.primary[400], brand.primary[500]] as const,
      [brand.teal[400], brand.teal[500]] as const,
      [brand.secondary[400], brand.secondary[500]] as const,
      [brand.accent[400], brand.accent[500]] as const,
    ];

    return (
      <Animated.View
        entering={FadeInRight.delay(index * 80)
          .duration(400)
          .springify()}
        style={[styles.cardContainer, { marginLeft: index === 0 ? spacing.lg : 0 }]}
      >
        <Animated.View style={cardStyle}>
          <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityRole="button"
            accessibilityLabel={`Post de ${post.authorName}`}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: bgCard,
                  ...shadows.lg,
                },
              ]}
            >
              {/* Rank Badge */}
              <LinearGradient
                colors={rankBadgeColors[index] || rankBadgeColors[0]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.rankBadge}
              >
                {index === 0 ? (
                  <Crown size={12} color={Tokens.neutral[0]} />
                ) : (
                  <Caption weight="bold" style={{ color: Tokens.neutral[0], fontSize: 10 }}>
                    #{index + 1}
                  </Caption>
                )}
              </LinearGradient>

              {/* Media Preview */}
              {post.imageUrl ? (
                <Image
                  source={{ uri: post.imageUrl }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={300}
                />
              ) : (
                <LinearGradient
                  colors={[
                    isDark ? Tokens.neutral[700] : mockupColors.rosa.blush,
                    isDark ? Tokens.neutral[600] : mockupColors.azul.sereno,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardImage}
                >
                  <Sparkles size={32} color={isDark ? Tokens.neutral[400] : brand.accent[400]} />
                </LinearGradient>
              )}

              {/* Content */}
              <View style={styles.cardContent}>
                {/* Author */}
                <View style={styles.authorRow}>
                  {post.authorAvatar ? (
                    <Image
                      source={{ uri: post.authorAvatar }}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                  ) : (
                    <LinearGradient
                      colors={[brand.accent[300], brand.primary[300]]}
                      style={styles.avatar}
                    >
                      <Ionicons name="person" size={14} color={Tokens.neutral[0]} />
                    </LinearGradient>
                  )}
                  <View style={{ flex: 1 }}>
                    <Body weight="semibold" style={{ color: textPrimary, fontSize: 13 }}>
                      {post.authorName}
                    </Body>
                    <Caption style={{ color: textSecondary, fontSize: 11 }}>
                      {formatTimeAgo(post.createdAt)}
                    </Caption>
                  </View>
                </View>

                {/* Text Preview */}
                <Body
                  numberOfLines={2}
                  style={{
                    color: textPrimary,
                    fontSize: 13,
                    lineHeight: 18,
                    marginTop: spacing.sm,
                  }}
                >
                  {post.content}
                </Body>

                {/* Actions */}
                <View style={styles.actions}>
                  <Pressable
                    onPress={handleLike}
                    style={styles.actionBtn}
                    accessibilityRole="button"
                    accessibilityLabel={post.isLiked ? "Descurtir post" : "Curtir post"}
                    accessibilityState={{ selected: post.isLiked }}
                  >
                    <Animated.View style={likeStyle}>
                      <Heart
                        size={18}
                        color={post.isLiked ? brand.accent[500] : textSecondary}
                        fill={post.isLiked ? brand.accent[500] : "transparent"}
                      />
                    </Animated.View>
                    <Caption style={{ color: textSecondary, marginLeft: 4 }}>
                      {post.likesCount}
                    </Caption>
                  </Pressable>

                  <View style={styles.actionBtn}>
                    <MessageCircle size={16} color={textSecondary} />
                    <Caption style={{ color: textSecondary, marginLeft: 4 }}>
                      {post.commentsCount}
                    </Caption>
                  </View>

                  {post.likesCount >= 10 && (
                    <View style={styles.trendingBadge}>
                      <Flame size={12} color={nathAccent.coral} />
                      <Caption style={{ color: nathAccent.coral, marginLeft: 2, fontSize: 10 }}>
                        Em alta
                      </Caption>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    );
  }
);

HighlightCard.displayName = "HighlightCard";

export const WeeklyHighlights: React.FC<WeeklyHighlightsProps> = ({ onPostPress, onLike }) => {
  const { isDark } = useTheme();
  const [highlights, setHighlights] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const textPrimary = isDark ? Tokens.neutral[100] : Tokens.neutral[900];

  const loadHighlights = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    try {
      const { data, error } = await fetchWeeklyHighlights(5);
      if (signal?.aborted) return;
      if (error) {
        logger.warn("Failed to load highlights", "WeeklyHighlights", { error: error.message });
        setHighlights([]);
      } else {
        setHighlights(data);
      }
    } catch (err) {
      if (signal?.aborted) return;
      logger.warn("Highlights fetch error", "WeeklyHighlights", {
        error: err instanceof Error ? err.message : String(err),
      });
      setHighlights([]);
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadHighlights(controller.signal);
    return () => controller.abort();
  }, [loadHighlights]);

  if (isLoading) {
    return (
      <Animated.View entering={FadeInDown.duration(300)} style={styles.container}>
        <View style={styles.header}>
          <LinearGradient
            colors={[brand.accent[400], nathAccent.rose]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerIcon}
          >
            <Sparkles size={16} color={Tokens.neutral[0]} />
          </LinearGradient>
          <Subtitle style={{ color: textPrimary }}>Destaques da Semana</Subtitle>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: spacing.md }}
        >
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </ScrollView>
      </Animated.View>
    );
  }

  if (highlights.length === 0) {
    return null;
  }

  return (
    <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[brand.accent[400], nathAccent.rose]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerIcon}
        >
          <Sparkles size={16} color={Tokens.neutral[0]} />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Subtitle style={{ color: textPrimary }}>Destaques da Semana</Subtitle>
          <Caption style={{ color: isDark ? Tokens.neutral[400] : Tokens.neutral[600] }}>
            Os posts mais queridos pela comunidade
          </Caption>
        </View>
      </View>

      {/* Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        snapToAlignment="start"
        contentContainerStyle={{ paddingRight: spacing.lg }}
      >
        {highlights.map((post, index) => (
          <HighlightCard
            key={post.id}
            post={post}
            index={index}
            onPress={() => onPostPress(post.id)}
            onLike={() => onLike(post.id)}
            isDark={isDark}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
  },
  card: {
    borderRadius: radius.xl,
    overflow: "hidden",
  },
  rankBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 10,
    width: 26,
    height: 26,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: "100%",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    padding: spacing.md,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: `${nathAccent.coral}15`,
  },
});

export default WeeklyHighlights;
