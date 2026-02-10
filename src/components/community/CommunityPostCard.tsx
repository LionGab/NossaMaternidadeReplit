/**
 * CommunityPostCard - Card de post da comunidade (Mães Valente)
 *
 * Adaptado para Fase 2:
 * - Usa CommunityPost type
 * - Suporta Signed URLs
 * - Badge de status para Meus Posts
 * - Menu de contexto com Report/Block
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, ActionSheetIOS, Platform, Alert } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { moderationService } from "../../services/moderation";
import { Tokens, radius, spacing } from "../../theme/tokens";
import { CommunityPost } from "../../types/community";
import { formatTimeAgo } from "../../utils/formatters";
import { shadowPresets } from "../../utils/shadow";
import { PostStatusBadge, PostStatus } from "./PostStatusBadge";
import { ReportModal } from "./ReportModal";
import { PressableScale } from "../ui/PressableScale";

interface PostCardProps {
  post: CommunityPost;
  index: number;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (post: CommunityPost) => void;
  onPress: (id: string) => void;
  showStatus?: boolean; // Se true, mostra badge de status (para Meus Posts)
  isOwnPost?: boolean; // Se true, não mostra opções de report/block
  currentUserId?: string; // ID do usuário atual
  onReport?: (postId: string, authorId: string, authorName: string) => void;
  onBlock?: (userId: string, userName: string) => void;
  onReportSuccess?: () => void;
  onBlockSuccess?: () => void;
}

export const CommunityPostCard: React.FC<PostCardProps> = React.memo(
  ({
    post,
    index,
    onLike,
    onComment,
    onShare,
    onPress,
    showStatus,
    isOwnPost,
    currentUserId,
    onReportSuccess,
    onBlockSuccess,
  }) => {
    const { isDark } = useTheme();

    // Modal states
    const [showReportModal, setShowReportModal] = useState(false);

    // Check if this is user's own post
    const isOwn = isOwnPost || (currentUserId && post.author_id === currentUserId);
    const authorName = post.profiles?.name || "Usuária";
    const authorId = post.author_id;

    const handleLikePress = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onLike(post.id);
    };

    // Theme colors
    const bgCard = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
    const textPrimary = isDark ? Tokens.neutral[100] : Tokens.text.light.primary;
    const textSecondary = isDark ? Tokens.neutral[400] : Tokens.text.light.secondary;
    const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

    // Map CommunityPost status to PostStatus
    const getPostStatus = (): PostStatus => {
      switch (post.status) {
        case "submitted":
          return "pending";
        case "approved":
          return "approved";
        case "rejected":
          return "rejected";
        case "needs_changes":
          return "needs_changes";
        default:
          return "pending";
      }
    };

    const postStatus = getPostStatus();

    const likesCount = post.likes_count ?? 0;
    const commentsCount = post.comments_count ?? 0;
    const isLiked = post.isLiked ?? false;

    // Handle block user (defined before handleMorePress to avoid temporal dead zone)
    const handleBlockUser = useCallback(async () => {
      Alert.alert(
        "Bloquear usuária",
        `Tem certeza que deseja bloquear ${authorName}? Você não verá mais os posts dela.`,
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Bloquear",
            style: "destructive",
            onPress: async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              const result = await moderationService.blockUser(authorId);

              if (result.success) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert(
                  "Usuária bloqueada",
                  `${authorName} foi bloqueada. Você não verá mais os posts dela.`
                );
                onBlockSuccess?.();
              } else {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Alert.alert("Erro", result.error || "Não foi possível bloquear a usuária.");
              }
            },
          },
        ]
      );
    }, [authorId, authorName, onBlockSuccess]);

    // Handle context menu (more options)
    const handleMorePress = useCallback(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Se for próprio post, só mostra opção de detalhes
      if (isOwn) {
        onPress(post.id);
        return;
      }

      const options = ["Denunciar", "Bloquear usuária", "Cancelar"];
      const destructiveButtonIndex = 1; // Block is destructive
      const cancelButtonIndex = 2;

      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            destructiveButtonIndex,
            cancelButtonIndex,
            title: `Opções para post de ${authorName}`,
          },
          (buttonIndex) => {
            if (buttonIndex === 0) {
              // Denunciar
              setShowReportModal(true);
            } else if (buttonIndex === 1) {
              // Bloquear
              handleBlockUser();
            }
          }
        );
      } else {
        // Android: usar Alert como fallback
        Alert.alert(
          "Opções",
          `Post de ${authorName}`,
          [
            {
              text: "Denunciar",
              onPress: () => setShowReportModal(true),
            },
            {
              text: "Bloquear usuária",
              style: "destructive",
              onPress: handleBlockUser,
            },
            {
              text: "Cancelar",
              style: "cancel",
            },
          ],
          { cancelable: true }
        );
      }
    }, [isOwn, post.id, authorName, onPress, handleBlockUser]);

    // Handle report success
    const handleReportSuccess = useCallback(() => {
      setShowReportModal(false);
      onReportSuccess?.();
    }, [onReportSuccess]);

    return (
      <Animated.View entering={FadeInUp.delay(index * 60).duration(450)} style={styles.container}>
        <PressableScale
          onPress={() => onPress(post.id)}
          spring="snappy"
          scale={0.98}
          haptic="light"
          style={[
            styles.card,
            {
              backgroundColor: bgCard,
              borderColor: borderColor,
            },
          ]}
        >
          {/* Status Badge (Meus Posts) */}
          {showStatus && (
            <View style={styles.statusBadgeContainer}>
              <PostStatusBadge status={postStatus} size="medium" />
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
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
                  accessibilityLabel={`Foto de perfil de ${post.profiles?.name || "usuaria"}`}
                />
              ) : (
                <Ionicons name="person" size={18} color={Tokens.brand.primary[500]} />
              )}
            </View>

            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: textPrimary }]}>
                {post.profiles?.name || "Mãe Anônima"}
              </Text>
              <Text style={[styles.timeAgo, { color: textSecondary }]}>
                {formatTimeAgo(post.created_at)}
              </Text>
            </View>

            {/* Context Menu (Report/Block) */}
            <Pressable
              style={({ pressed }) => [styles.moreButton, { opacity: pressed ? 0.6 : 1 }]}
              onPress={handleMorePress}
              accessibilityLabel={
                isOwn ? "Ver detalhes do post" : "Mais opções: denunciar ou bloquear"
              }
              accessibilityRole="button"
              accessibilityHint={isOwn ? undefined : "Abre menu com opções de denúncia e bloqueio"}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={textSecondary} />
            </Pressable>
          </View>

          {/* Content */}
          {post.text && (
            <View style={styles.contentWrapper}>
              <Text numberOfLines={3} style={[styles.content, { color: textPrimary }]}>
                {post.text}
              </Text>
            </View>
          )}

          {/* Media */}
          {post.signed_media_url && (
            <View style={styles.imageWrapper}>
              {post.media_type === "video" ? (
                <View
                  style={[
                    styles.image,
                    {
                      backgroundColor: Tokens.neutral[900],
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Ionicons name="play-circle-outline" size={48} color={Tokens.neutral[0]} />
                </View>
              ) : (
                <Image
                  source={{ uri: post.signed_media_url }}
                  style={[
                    styles.image,
                    { backgroundColor: isDark ? Tokens.neutral[700] : Tokens.neutral[200] },
                  ]}
                  contentFit="cover"
                  accessibilityLabel="Imagem compartilhada no post"
                />
              )}
            </View>
          )}

          {/* Actions */}
          <View style={[styles.actionsWrapper, { borderTopColor: borderColor }]}>
            <View style={styles.actionsRow}>
              {/* Like */}
              <Pressable
                onPress={handleLikePress}
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
                accessibilityLabel={`Curtir. ${likesCount} curtidas`}
                accessibilityRole="button"
                accessibilityState={{ selected: isLiked }}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={isLiked ? Tokens.brand.accent[500] : textSecondary}
                />
                <Text
                  style={[
                    styles.actionText,
                    { color: isLiked ? Tokens.brand.accent[500] : textSecondary },
                  ]}
                >
                  {likesCount}
                </Text>
              </Pressable>

              {/* Comment */}
              <Pressable
                onPress={() => onComment(post.id)}
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
                accessibilityLabel={`Comentar. ${commentsCount} comentários`}
                accessibilityRole="button"
              >
                <Ionicons name="chatbubble-outline" size={18} color={textSecondary} />
                <Text style={[styles.actionText, { color: textSecondary }]}>{commentsCount}</Text>
              </Pressable>

              {/* Share */}
              <Pressable
                onPress={() => onShare(post)}
                style={({ pressed }) => [styles.shareButton, { opacity: pressed ? 0.7 : 1 }]}
                accessibilityLabel="Compartilhar post"
                accessibilityRole="button"
              >
                <Ionicons name="share-outline" size={18} color={textSecondary} />
              </Pressable>
            </View>
          </View>
        </PressableScale>

        {/* Report Modal */}
        <ReportModal
          visible={showReportModal}
          onClose={() => setShowReportModal(false)}
          contentType="post"
          contentId={post.id}
          authorName={authorName}
          onSuccess={handleReportSuccess}
        />
      </Animated.View>
    );
  }
);

CommunityPostCard.displayName = "CommunityPostCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: radius["2xl"],
    borderWidth: 1,
    ...shadowPresets.sm,
    overflow: "hidden",
  },
  statusBadgeContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: -0.3,
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    marginTop: 1,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrapper: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Manrope_500Medium",
    letterSpacing: -0.2,
  },
  imageWrapper: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: radius.xl,
  },
  actionsWrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingRight: spacing.xl,
    gap: spacing.xs,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    letterSpacing: -0.2,
  },
  shareButton: {
    marginLeft: "auto",
    padding: spacing.xs,
  },
});
