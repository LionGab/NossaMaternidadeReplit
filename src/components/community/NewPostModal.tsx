/**
 * NewPostModal - Modal para criar novo post
 *
 * Redesign com:
 * - Seletor de tipo de post
 * - Card de info sobre moderação
 * - Preview de mídia melhorado
 * - Animações suaves
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../hooks/useTheme";
import { useAppStore } from "../../state";
import { brand, neutral, typography, spacing, radius, shadows, Tokens } from "../../theme/tokens";
import { logger } from "../../utils/logger";
import { Avatar } from "../ui";
import { ModerationInfoCard } from "./ModerationInfoCard";
import { PostTypeSelector, PostType } from "./PostTypeSelector";

interface NewPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (
    content: string,
    mediaUri?: string,
    mediaType?: "image" | "video",
    postType?: PostType
  ) => void | Promise<void>;
}

export const NewPostModal: React.FC<NewPostModalProps> = ({ visible, onClose, onSubmit }) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { showError, showSuccess } = useToast();
  const user = useAppStore((s) => s.user);

  const [content, setContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [postType, setPostType] = useState<PostType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitScale = useSharedValue(1);

  // Theme colors
  const textPrimary = isDark ? neutral[100] : neutral[800];
  const textSecondary = isDark ? neutral[400] : neutral[500];
  const borderColor = isDark ? neutral[700] : neutral[200];
  const bgColor = isDark ? neutral[900] : neutral[0];
  const inputBg = isDark ? neutral[800] : neutral[50];

  const handlePickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError("Precisamos de acesso à sua galeria para adicionar fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia(result.assets[0].uri);
        setMediaType("image");
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      logger.error("Image picker error", "NewPostModal", errorObj);
      showError("Não foi possível selecionar a imagem.");
    }
  }, [showError]);

  const handlePickVideo = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError("Precisamos de acesso à sua galeria para adicionar vídeos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "videos",
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia(result.assets[0].uri);
        setMediaType("video");
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      logger.error("Video picker error", "NewPostModal", errorObj);
      showError("Não foi possível selecionar o vídeo.");
    }
  }, [showError]);

  const handleRemoveMedia = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMedia(null);
    setMediaType(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!content.trim() && !selectedMedia) return;

    setIsSubmitting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await onSubmit(
        content.trim(),
        selectedMedia ?? undefined,
        mediaType ?? undefined,
        postType ?? undefined
      );
      setContent("");
      setSelectedMedia(null);
      setMediaType(null);
      setPostType(null);
      showSuccess("Post enviado para revisão! Você será notificada quando for aprovado.");
      onClose();
    } catch {
      // Error handling is done by the mutation in the parent
    } finally {
      setIsSubmitting(false);
    }
  }, [content, selectedMedia, mediaType, postType, onSubmit, onClose, showSuccess]);

  const handleClose = useCallback(() => {
    setContent("");
    setSelectedMedia(null);
    setMediaType(null);
    setPostType(null);
    onClose();
  }, [onClose]);

  const submitAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitScale.value }],
  }));

  const handleSubmitPressIn = useCallback(() => {
    submitScale.value = withSpring(0.95, { damping: 15 });
  }, [submitScale]);

  const handleSubmitPressOut = useCallback(() => {
    submitScale.value = withSpring(1, { damping: 12 });
  }, [submitScale]);

  const canSubmit = (content.trim() || selectedMedia) && !isSubmitting;
  const charCount = content.length;
  const maxChars = 1000;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
      accessibilityViewIsModal={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: bgColor }]}
        accessibilityViewIsModal={true}
        accessibilityLabel="Criar novo post na comunidade"
      >
        {/* Header */}
        <Animated.View
          entering={FadeIn.duration(200)}
          style={[
            styles.header,
            {
              paddingTop: insets.top + spacing.md,
              borderBottomColor: borderColor,
            },
          ]}
        >
          <Pressable
            onPress={handleClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
          >
            <Ionicons name="close" size={24} color={textSecondary} />
          </Pressable>

          <Text style={[styles.title, { color: textPrimary }]}>Novo Post</Text>

          <Animated.View style={submitAnimatedStyle}>
            <Pressable
              onPress={handleSubmit}
              onPressIn={handleSubmitPressIn}
              onPressOut={handleSubmitPressOut}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityLabel="Publicar post"
              style={[
                styles.submitButton,
                { backgroundColor: canSubmit ? brand.accent[500] : neutral[300] },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={neutral[0]} />
              ) : (
                <Text style={styles.submitText}>Publicar</Text>
              )}
            </Pressable>
          </Animated.View>
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* User Info */}
          <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.userRow}>
            <Avatar
              size={48}
              source={user?.avatarUrl ? { uri: user.avatarUrl } : null}
              fallbackIcon="person"
              fallbackColor={brand.primary[500]}
              fallbackBgColor={brand.primary[100]}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: textPrimary }]}>{user?.name || "Você"}</Text>
              <Text style={[styles.userHint, { color: textSecondary }]}>
                Compartilhe com a comunidade Mães Valente
              </Text>
            </View>
          </Animated.View>

          {/* Post Type Selector */}
          <Animated.View entering={FadeInDown.delay(150).duration(300)}>
            <PostTypeSelector
              selectedType={postType}
              onSelectType={setPostType}
              disabled={isSubmitting}
            />
          </Animated.View>

          {/* Text Input */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(300)}
            style={[styles.inputContainer, { backgroundColor: inputBg, borderColor }]}
          >
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="O que você gostaria de compartilhar?"
              placeholderTextColor={neutral[400]}
              multiline
              autoFocus
              maxLength={maxChars}
              style={[styles.input, { color: textPrimary }]}
              accessibilityLabel="Conteúdo do post"
            />
            <Text
              style={[
                styles.charCount,
                { color: charCount > maxChars * 0.9 ? brand.accent[600] : textSecondary },
              ]}
            >
              {charCount}/{maxChars}
            </Text>
          </Animated.View>

          {/* Media Preview */}
          {selectedMedia && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.mediaPreview}>
              {mediaType === "image" ? (
                <Image
                  source={{ uri: selectedMedia }}
                  style={styles.mediaImage}
                  contentFit="cover"
                  accessibilityLabel="Pre-visualizacao da imagem selecionada"
                />
              ) : (
                <View style={[styles.videoPlaceholder, { backgroundColor: neutral[200] }]}>
                  <Ionicons name="videocam" size={48} color={neutral[500]} />
                  <Text style={[styles.videoText, { color: neutral[500] }]}>Vídeo selecionado</Text>
                </View>
              )}
              <Pressable
                onPress={handleRemoveMedia}
                accessibilityRole="button"
                accessibilityLabel="Remover mídia"
                style={styles.removeMedia}
              >
                <Ionicons name="close" size={20} color={neutral[0]} />
              </Pressable>
            </Animated.View>
          )}

          {/* Media Buttons */}
          <Animated.View entering={FadeInDown.delay(250).duration(300)} style={styles.mediaButtons}>
            <Pressable
              onPress={handlePickImage}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Adicionar foto"
              style={[styles.mediaButton, { backgroundColor: inputBg, borderColor }]}
            >
              <Ionicons name="image-outline" size={22} color={brand.accent[500]} />
              <Text style={[styles.mediaButtonText, { color: brand.accent[600] }]}>Foto</Text>
            </Pressable>

            <Pressable
              onPress={handlePickVideo}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Adicionar vídeo"
              style={[styles.mediaButton, { backgroundColor: inputBg, borderColor }]}
            >
              <Ionicons name="videocam-outline" size={22} color={brand.primary[500]} />
              <Text style={[styles.mediaButtonText, { color: brand.primary[600] }]}>Vídeo</Text>
            </Pressable>
          </Animated.View>

          {/* Moderation Info */}
          <ModerationInfoCard />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
  },
  submitButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    minWidth: 80,
    alignItems: "center",
    ...shadows.sm,
  },
  submitText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
    color: neutral[0],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing["3xl"],
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: 2,
  },
  userHint: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
  inputContainer: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  mediaPreview: {
    marginBottom: spacing.md,
    position: "relative",
  },
  mediaImage: {
    width: "100%",
    height: 200,
    borderRadius: radius.xl,
    backgroundColor: neutral[200],
  },
  videoPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  videoText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    marginTop: spacing.sm,
  },
  removeMedia: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: Tokens.overlay.dark,
    borderRadius: radius.full,
    padding: spacing.sm,
  },
  mediaButtons: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  mediaButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  mediaButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
  },
});
