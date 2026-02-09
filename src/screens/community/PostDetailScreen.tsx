import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Share,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { RootStackScreenProps } from "@/types/navigation";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";
import { usePost, useComments, useCreateComment, useTogglePostLike } from "@/api/hooks";
import { formatTimeAgo } from "@/utils/formatters";
import { Tokens } from "@/theme/tokens";

export default function PostDetailScreen({
  route,
  navigation,
}: RootStackScreenProps<"PostDetail">) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { postId } = route.params;
  const scrollRef = useRef<ScrollView>(null);

  const [comment, setComment] = useState("");

  // TanStack Query hooks (server state)
  const { data: post, isLoading: isLoadingPost } = usePost(postId);
  const { data: comments = [] } = useComments(postId);
  const toggleLikeMutation = useTogglePostLike();
  const createCommentMutation = useCreateComment();
  const isLoading = isLoadingPost;
  const isSending = createCommentMutation.isPending;

  const bgCard = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
  const textPrimary = isDark ? Tokens.neutral[100] : Tokens.neutral[900];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[600];
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];
  const bgInput = isDark ? Tokens.neutral[800] : Tokens.neutral[50];

  const handleLike = async () => {
    if (!post) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleLikeMutation.mutate(postId);
  };

  const handleShare = async () => {
    if (!post) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `${post.content.substring(0, 200)}${post.content.length > 200 ? "..." : ""} - via Nossa Maternidade`,
      });
    } catch {
      // Handle error silently
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim() || isSending) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: comment.trim(),
      });
      setComment("");
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch {
      // Error handled by TanStack Query mutation config
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: bgCard }}>
        <ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
        <Text style={{ color: textSecondary, marginTop: 12 }}>Carregando...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: bgCard }}>
        <Ionicons name="alert-circle-outline" size={48} color={textSecondary} />
        <Text style={{ color: textSecondary, marginTop: 12 }}>Post não encontrado</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          className="mt-4 px-6 py-3 rounded-full"
          style={{ backgroundColor: Tokens.brand.accent[500] }}
        >
          <Text style={{ color: Tokens.neutral[0] }}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View className="flex-1" style={{ backgroundColor: isDark ? Tokens.neutral[900] : Tokens.neutral[50] }}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
        >
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: bgCard, borderWidth: 1, borderColor }}
          >
            <View className="flex-row items-center mb-4">
              {post.authorAvatar ? (
                <Image
                  source={{ uri: post.authorAvatar }}
                  className="w-12 h-12 rounded-full mr-3"
                  contentFit="cover"
                />
              ) : (
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: Tokens.brand.primary[200] }}
                >
                  <Ionicons name="person" size={24} color={Tokens.brand.primary[600]} />
                </View>
              )}
              <View className="flex-1">
                <Text style={{ color: textPrimary }} className="text-base font-semibold">
                  {post.authorName}
                </Text>
                <Text style={{ color: textSecondary }} className="text-sm">
                  {formatTimeAgo(post.createdAt)}
                </Text>
              </View>
            </View>

            {post.imageUrl && (
              <Image
                source={{ uri: post.imageUrl }}
                className="w-full h-64 rounded-xl mb-4"
                contentFit="cover"
              />
            )}

            <Text style={{ color: textPrimary }} className="text-base leading-6 mb-4">
              {post.content}
            </Text>

            <View
              className="flex-row items-center pt-4"
              style={{ borderTopWidth: 1, borderTopColor: borderColor }}
            >
              <Pressable
                onPress={handleLike}
                disabled={toggleLikeMutation.isPending}
                className="flex-row items-center mr-6"
                accessibilityRole="button"
                accessibilityLabel={post.isLiked ? "Descurtir post" : "Curtir post"}
                accessibilityState={{ selected: post.isLiked }}
              >
                <Ionicons
                  name={post.isLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={post.isLiked ? Tokens.brand.primary[500] : textSecondary}
                />
                <Text style={{ color: textSecondary }} className="ml-2 text-sm font-medium">
                  {post.likesCount}
                </Text>
              </Pressable>
              <Pressable className="flex-row items-center mr-6" accessibilityRole="button">
                <Ionicons name="chatbubble-outline" size={22} color={textSecondary} />
                <Text style={{ color: textSecondary }} className="ml-2 text-sm font-medium">
                  {post.commentsCount}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleShare}
                className="flex-row items-center"
                accessibilityRole="button"
                accessibilityLabel="Compartilhar post"
              >
                <Ionicons name="share-outline" size={22} color={textSecondary} />
              </Pressable>
            </View>
          </View>

          <View className="mt-6">
            <Text style={{ color: textPrimary }} className="text-lg font-semibold mb-4">
              Comentários ({comments.length})
            </Text>

            {comments.length === 0 ? (
              <View
                className="rounded-xl p-6 items-center"
                style={{ backgroundColor: bgCard, borderWidth: 1, borderColor }}
              >
                <Ionicons name="chatbubbles-outline" size={40} color={textSecondary} />
                <Text style={{ color: textSecondary }} className="mt-3 text-center">
                  Seja a primeira a comentar!
                </Text>
              </View>
            ) : (
              comments.map((c) => (
                <View
                  key={c.id}
                  className="rounded-xl p-4 mb-3"
                  style={{ backgroundColor: bgCard, borderWidth: 1, borderColor }}
                >
                  <View className="flex-row items-start">
                    {c.authorAvatar ? (
                      <Image
                        source={{ uri: c.authorAvatar }}
                        className="w-9 h-9 rounded-full mr-3"
                        contentFit="cover"
                      />
                    ) : (
                      <View
                        className="w-9 h-9 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: Tokens.brand.secondary[200] }}
                      >
                        <Ionicons name="person" size={18} color={Tokens.brand.secondary[600]} />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text style={{ color: textPrimary }} className="text-sm font-semibold">
                        {c.authorName}
                      </Text>
                      <Text style={{ color: textPrimary }} className="text-sm mt-1 leading-5">
                        {c.content}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <Text style={{ color: textSecondary }} className="text-xs">
                          {formatTimeAgo(c.createdAt)}
                        </Text>
                        <Pressable className="flex-row items-center ml-4">
                          <Ionicons
                            name={c.isLiked ? "heart" : "heart-outline"}
                            size={14}
                            color={c.isLiked ? Tokens.brand.primary[500] : textSecondary}
                          />
                          <Text style={{ color: textSecondary }} className="ml-1 text-xs">
                            {c.likesCount}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <View
          className="absolute bottom-0 left-0 right-0 px-4 pt-3"
          style={{
            backgroundColor: bgCard,
            borderTopWidth: 1,
            borderTopColor: borderColor,
            paddingBottom: insets.bottom + 8,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="flex-1 rounded-2xl px-4 py-3 mr-2"
              style={{ backgroundColor: bgInput, borderWidth: 1, borderColor }}
            >
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Escreva um comentário..."
                placeholderTextColor={textSecondary}
                style={{ color: textPrimary, fontSize: 15 }}
                accessibilityLabel="Campo de comentário"
                accessibilityHint="Digite seu comentário para este post"
                editable={!isSending}
              />
            </View>
            <Pressable
              onPress={handleSendComment}
              disabled={!comment.trim() || isSending}
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{
                backgroundColor: Tokens.brand.accent[500],
                opacity: comment.trim() && !isSending ? 1 : 0.5,
              }}
              accessibilityRole="button"
              accessibilityLabel="Enviar comentário"
              accessibilityState={{ disabled: !comment.trim() || isSending }}
            >
              {isSending ? (
                <ActivityIndicator size="small" color={Tokens.neutral[0]} />
              ) : (
                <Ionicons name="send" size={20} color={Tokens.neutral[0]} />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
