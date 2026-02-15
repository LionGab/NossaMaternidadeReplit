/**
 * CommunityScreen - Mães Valente (Comunidade)
 *
 * Refatorado para:
 * - FlashList (performance, virtualização)
 * - Pressable (não TouchableOpacity)
 * - Tokens (não cores hardcoded)
 * - Integração real com Supabase
 * - Sistema de moderação (posts vão para revisão)
 */

import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pencil, Search, Shield } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, RefreshControl, Share, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { CommunityPostCard } from "@/components/community/CommunityPostCard";
import { EmptyStateCommunity } from "@/components/community/EmptyStateCommunity";
import { NewPostModal } from "@/components/community/NewPostModal";
import { PostType } from "@/components/community/PostTypeSelector";
import { QuickComposerCard } from "@/components/community/QuickComposerCard";
import { WeeklyHighlights } from "@/components/community/WeeklyHighlights";
import { Body, Caption, ListSkeleton, NathButton, NathCard, Subtitle } from "@/components/ui";

// Hooks & State
import {
  useCommunityPosts,
  useCommunityStats,
  useCreatePost,
  useTogglePostLike,
} from "@/api/hooks";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/state";

// Theme
import { Tokens, brand, neutral, radius, spacing } from "@/theme/tokens";
import { shadowPresets } from "@/utils/shadow";

// Navigation
import { MainTabScreenProps } from "@/types/navigation";

// Types
import { CommunityPost, MediaType, PostStatus } from "@/types/community";
import type { Post } from "@/types/navigation";

// Utils
import { logger } from "@/utils/logger";

/**
 * Formata número com sufixo K/M para exibição compacta
 */
function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

// Imagens da Nath
const nathCommunityImage = require("../../../assets/images/nath-community-elegant.png");
// Exported for use in other components
export const nathAvatarImage = require("../../../assets/images/nathia-avatar.jpg");
export const nathMomBabyLogo = require("../../../assets/images/nath-mom-baby-logo.png");

type Props = MainTabScreenProps<"Community">;

/**
 * Adapter: Converte Post (API) para CommunityPost (componente)
 */
function adaptPostToCommunityPost(post: Post): CommunityPost {
  // Mapeia status da API para o status do CommunityPost
  const mapStatus = (status?: "pending" | "approved" | "rejected"): PostStatus => {
    switch (status) {
      case "pending":
        return "submitted";
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      default:
        return "approved";
    }
  };

  // Determina tipo de mídia
  const getMediaType = (): MediaType => {
    if (post.videoUrl) return "video";
    if (post.imageUrl) return "image";
    return "text";
  };

  return {
    id: post.id,
    author_id: post.authorId,
    text: post.content,
    media_path: post.imageUrl || post.videoUrl || null,
    media_type: getMediaType(),
    tags: null,
    status: mapStatus(post.status),
    review_reason: null,
    created_at: post.createdAt,
    published_at: post.status === "approved" ? post.createdAt : null,
    likes_count: post.likesCount,
    comments_count: post.commentsCount,
    profiles: {
      name: post.authorName,
      avatar_url: post.authorAvatar || "",
    },
    signed_media_url: post.imageUrl || post.videoUrl || null,
    isLiked: post.isLiked,
  };
}

export default function CommunityScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const user = useAppStore((s) => s.user);

  // TanStack Query hooks (server state)
  const { data: posts = [], isLoading, isRefetching, refetch } = useCommunityPosts();
  const { data: stats } = useCommunityStats();
  const createPostMutation = useCreatePost();
  const toggleLikeMutation = useTogglePostLike();
  const isCreating = createPostMutation.isPending;
  const error = createPostMutation.error?.message ?? null;

  // Local state
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Theme colors
  const bgColor = isDark ? Tokens.neutral[900] : Tokens.neutral[50];
  const headerBg = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];
  const textMuted = isDark ? Tokens.neutral[400] : Tokens.neutral[500];

  // Nathia design colors
  const nathColors = useMemo(
    () => ({
      rosa: brand.accent[400],
      azul: brand.primary[400],
      verde: brand.teal[400],
      laranja: brand.secondary[400], // Using secondary purple as warm accent
    }),
    []
  );

  // Handlers
  const handleCreatePost = useCallback(
    async (
      content: string,
      mediaUri?: string,
      _mediaType?: "image" | "video",
      _postType?: PostType
    ) => {
      try {
        await createPostMutation.mutateAsync({ content, imageUrl: mediaUri });
        setShowNewPostModal(false);
      } catch {
        // Error handled by TanStack Query (onError in mutation config)
      }
    },
    [createPostMutation]
  );

  const handleLike = useCallback(
    (postId: string) => {
      toggleLikeMutation.mutate(postId);
    },
    [toggleLikeMutation]
  );

  const handleComment = useCallback(
    (postId: string) => {
      navigation.navigate("PostDetail", { postId });
    },
    [navigation]
  );

  const handleShare = useCallback(async (post: CommunityPost) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `${post.profiles?.name || "Uma mãe"} compartilhou na comunidade Mães Valente:\n\n"${post.text}"\n\nBaixe o app Nossa Maternidade!`,
      });
    } catch (err) {
      logger.error(
        "Erro ao compartilhar",
        "CommunityScreen",
        err instanceof Error ? err : new Error(String(err))
      );
    }
  }, []);

  const handlePostPress = useCallback(
    (postId: string) => {
      navigation.navigate("PostDetail", { postId });
    },
    [navigation]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleOpenComposer = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowNewPostModal(true);
  }, []);

  // Render item
  const renderItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => {
      const communityPost = adaptPostToCommunityPost(item);
      const isOwnPost = user?.id === item.authorId;

      return (
        <CommunityPostCard
          post={communityPost}
          index={index}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onPress={handlePostPress}
          isOwnPost={isOwnPost}
          currentUserId={user?.id}
          showStatus={isOwnPost && item.status === "pending"}
        />
      );
    },
    [user?.id, handleLike, handleComment, handleShare, handlePostPress]
  );

  // Header component (StatsCard + QuickComposer)
  const ListHeaderComponent = useCallback(
    () => (
      <View style={styles.headerContainer}>
        {/* Welcome Card - Comunidade Moderada */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <View style={styles.welcomeCard}>
            <LinearGradient
              colors={[Tokens.maternal.warmth.blush, Tokens.maternal.calm.lavender]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeGradient}
            >
              <View style={styles.welcomeContent}>
                <View style={styles.welcomeTextArea}>
                  <View style={styles.moderatedBadge}>
                    <Shield size={12} color={Tokens.brand.teal[600]} />
                    <Caption style={styles.moderatedText}>Comunidade Moderada</Caption>
                  </View>
                  <Subtitle style={styles.welcomeTitle}>Um espaço seguro para mães</Subtitle>
                  <Body style={styles.welcomeSubtitle}>
                    Compartilhe, desabafe e celebre cada momento da sua jornada
                  </Body>
                </View>
                <Image
                  source={nathCommunityImage}
                  style={styles.welcomeImage}
                  contentFit="contain"
                  transition={300}
                />
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Community Stats */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={[styles.statsCard, { backgroundColor: isDark ? neutral[800] : neutral[0] }]}>
            <View style={styles.statItem}>
              <Subtitle>{formatCompactNumber(stats?.members ?? 0)}</Subtitle>
              <Caption style={[styles.statLabel, { color: isDark ? neutral[400] : neutral[500] }]}>
                Mulheres
              </Caption>
            </View>

            <View
              style={[
                styles.statDivider,
                { backgroundColor: isDark ? neutral[700] : neutral[100] },
              ]}
            />

            <View style={styles.statItem}>
              <Subtitle>{formatCompactNumber(stats?.posts ?? 0)}</Subtitle>
              <Caption style={[styles.statLabel, { color: isDark ? neutral[400] : neutral[500] }]}>
                Postagens
              </Caption>
            </View>

            <View
              style={[
                styles.statDivider,
                { backgroundColor: isDark ? neutral[700] : neutral[100] },
              ]}
            />

            <View style={styles.statItem}>
              <Subtitle style={{ color: nathColors.verde }}>{stats?.engagement ?? 0}%</Subtitle>
              <Caption style={[styles.statLabel, { color: isDark ? neutral[400] : neutral[500] }]}>
                Engajamento
              </Caption>
            </View>
          </View>
        </Animated.View>

        {/* Quick Composer */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <QuickComposerCard
            onPress={handleOpenComposer}
            onPhotoPress={handleOpenComposer}
            disabled={isCreating}
          />
        </Animated.View>

        {/* Weekly Highlights */}
        <WeeklyHighlights onPostPress={handlePostPress} onLike={handleLike} />
      </View>
    ),
    [isDark, nathColors, handleOpenComposer, isCreating, handlePostPress, handleLike, stats]
  );

  // Footer component (ChallengeCard + spacing)
  const ListFooterComponent = useCallback(
    () => (
      <View style={styles.footerContainer}>
        {/* Challenge Card */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <NathCard variant="outlined" style={styles.challengeCard} padding="none">
            <LinearGradient
              colors={[nathColors.verde, nathColors.azul]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.challengeHeader}
            >
              <Body weight="bold" style={{ color: Tokens.neutral[0] }}>
                #DesafioMães
              </Body>
            </LinearGradient>

            <View style={{ padding: spacing.lg }}>
              <Body style={{ marginBottom: spacing.md }}>
                Semana 3 do desafio - Compartilhe sua foto de autocuidado!
              </Body>

              <View style={styles.challengeFooter}>
                <View style={styles.participants}>
                  <View style={styles.participantAvatars}>
                    {[nathColors.rosa, nathColors.azul, nathColors.verde, nathColors.laranja].map(
                      (color, i) => (
                        <View
                          key={i}
                          style={[
                            styles.participantDot,
                            { backgroundColor: color, marginLeft: i > 0 ? -6 : 0 },
                          ]}
                        />
                      )
                    )}
                    <View
                      style={[styles.participantDot, styles.participantMore, { marginLeft: -6 }]}
                    >
                      <Caption style={{ fontSize: 8 }}>+12</Caption>
                    </View>
                  </View>
                  <Caption>participando</Caption>
                </View>

                <NathButton variant="secondary" size="sm" onPress={() => {}}>
                  Participar
                </NathButton>
              </View>
            </View>
          </NathCard>
        </Animated.View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 120 }} />
      </View>
    ),
    [nathColors]
  );

  // Empty state
  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ListSkeleton type="post" count={3} />
        </View>
      );
    }

    if (error) {
      return <EmptyStateCommunity variant="error" onRetry={() => refetch()} />;
    }

    return (
      <EmptyStateCommunity
        variant="no_posts"
        onAction={handleOpenComposer}
        onTemplatePress={(_template) => {
          setShowNewPostModal(true);
          // TODO: Preencher modal com template
        }}
      />
    );
  }, [isLoading, error, refetch, handleOpenComposer]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={[styles.header, { backgroundColor: headerBg, borderBottomColor: borderColor }]}
      >
        <Subtitle>Mães Valente</Subtitle>
        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: isDark ? Tokens.neutral[700] : Tokens.neutral[100],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={handleOpenComposer}
            accessibilityLabel="Criar novo post"
            accessibilityRole="button"
          >
            <Pencil size={14} color={textMuted} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: isDark ? Tokens.neutral[700] : Tokens.neutral[100],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={() => {
              // TODO: Implementar busca
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            accessibilityLabel="Buscar na comunidade"
            accessibilityRole="button"
          >
            <Search size={16} color={textMuted} />
          </Pressable>
        </View>
      </Animated.View>

      {/* Feed */}
      <FlashList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={posts.length > 0 ? ListFooterComponent : null}
        ListEmptyComponent={ListEmptyComponent}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={brand.accent[500]}
            colors={[brand.accent[500]]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* New Post Modal */}
      <NewPostModal
        visible={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        onSubmit={handleCreatePost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  actionButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },

  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },

  headerContainer: {
    marginBottom: spacing.md,
  },

  welcomeCard: {
    borderRadius: radius["2xl"],
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadowPresets.sm,
  },

  welcomeGradient: {
    padding: spacing.lg,
  },

  welcomeContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  welcomeTextArea: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  moderatedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },

  moderatedText: {
    color: Tokens.brand.teal[600],
    fontWeight: "600",
    fontSize: 11,
  },

  welcomeTitle: {
    marginBottom: spacing.xs,
    fontSize: 16,
  },

  welcomeSubtitle: {
    fontSize: 13,
    color: Tokens.neutral[700],
    lineHeight: 18,
  },

  welcomeImage: {
    width: 80,
    height: 110,
  },

  statsCard: {
    flexDirection: "row",
    borderRadius: radius["2xl"],
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadowPresets.sm,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statLabel: {
    textAlign: "center",
    marginTop: 2,
    fontSize: 10,
    lineHeight: 14,
  },

  statDivider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: spacing.xs,
  },

  footerContainer: {
    paddingHorizontal: spacing.xs,
  },

  challengeCard: {
    marginBottom: spacing.md,
    overflow: "hidden",
  },

  challengeHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },

  challengeFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  participants: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  participantAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },

  participantDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Tokens.neutral[0],
  },

  participantMore: {
    backgroundColor: Tokens.neutral[100],
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["3xl"],
  },
});
