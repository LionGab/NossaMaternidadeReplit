/**
 * ReportModal - Modal para denúncia de conteúdo
 *
 * Modal com opções de motivo para denúncia.
 * Design seguindo Maternal Luxury aesthetic.
 *
 * @example
 * ```tsx
 * <ReportModal
 *   visible={showReport}
 *   onClose={() => setShowReport(false)}
 *   contentType="post"
 *   contentId={postId}
 *   onSuccess={() => toast.show('Denúncia enviada')}
 * />
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  moderationService,
  REPORT_REASONS,
  ContentType,
  ReportReason,
} from "../../services/moderation";
import { brand, neutral, semantic, spacing, radius, typography, Tokens } from "../../theme/tokens";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  contentType: ContentType;
  contentId: string;
  authorName?: string;
  onSuccess?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  contentType,
  contentId,
  authorName,
  onSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSelectReason = useCallback(async (reason: ReportReason) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedReason(reason);
    setError(null);
  }, []);

  // handleClose defined before handleSubmit to avoid temporal dead zone
  const handleClose = useCallback(() => {
    setSelectedReason(null);
    setDescription("");
    setError(null);
    setSuccess(false);
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    setError(null);

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const result = await moderationService.reportContent(
      contentType,
      contentId,
      selectedReason,
      description.trim() || undefined
    );

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1500);
    } else {
      setError(result.error || "Erro ao enviar denúncia");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [selectedReason, description, contentType, contentId, onSuccess, handleClose]);

  const getContentTypeLabel = () => {
    switch (contentType) {
      case "post":
        return "post";
      case "comment":
        return "comentário";
      case "profile":
        return "perfil";
      case "message":
        return "mensagem";
      default:
        return "conteúdo";
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Backdrop */}
        <AnimatedPressable
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.backdrop}
          onPress={handleClose}
        />

        {/* Modal Content */}
        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          exiting={SlideOutDown.springify().damping(20)}
          style={[styles.modal, { paddingBottom: insets.bottom + spacing.lg }]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="flag-outline" size={24} color={semantic.light.error} />
            </View>
            <Text style={styles.title}>Denunciar {getContentTypeLabel()}</Text>
            {authorName && <Text style={styles.subtitle}>De: {authorName}</Text>}
          </View>

          {/* Success State */}
          {success ? (
            <Animated.View entering={FadeIn.duration(300)} style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={64} color={semantic.light.success} />
              </View>
              <Text style={styles.successTitle}>Denúncia enviada</Text>
              <Text style={styles.successText}>
                Obrigada por nos ajudar a manter a comunidade segura. Vamos analisar e tomar as
                medidas necessárias.
              </Text>
            </Animated.View>
          ) : (
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Reasons */}
              <Text style={styles.sectionTitle}>Por que você está denunciando?</Text>

              <View style={styles.reasonsList}>
                {REPORT_REASONS.map((reason) => (
                  <Pressable
                    key={reason.value}
                    onPress={() => handleSelectReason(reason.value)}
                    style={({ pressed }) => [
                      styles.reasonItem,
                      selectedReason === reason.value && styles.reasonItemSelected,
                      pressed && styles.reasonItemPressed,
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: selectedReason === reason.value }}
                    accessibilityLabel={`${reason.label}: ${reason.description}`}
                  >
                    <View
                      style={[
                        styles.reasonIcon,
                        selectedReason === reason.value && styles.reasonIconSelected,
                      ]}
                    >
                      <Ionicons
                        name={reason.icon as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color={selectedReason === reason.value ? neutral[0] : neutral[500]}
                      />
                    </View>
                    <View style={styles.reasonText}>
                      <Text
                        style={[
                          styles.reasonLabel,
                          selectedReason === reason.value && styles.reasonLabelSelected,
                        ]}
                      >
                        {reason.label}
                      </Text>
                      <Text style={styles.reasonDescription}>{reason.description}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedReason === reason.value && styles.radioOuterSelected,
                      ]}
                    >
                      {selectedReason === reason.value && <View style={styles.radioInner} />}
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Additional Description */}
              {selectedReason && (
                <Animated.View entering={FadeIn.duration(200)} style={styles.descriptionContainer}>
                  <Text style={styles.sectionTitle}>
                    Detalhes adicionais <Text style={styles.optional}>(opcional)</Text>
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Conte mais sobre o problema..."
                    placeholderTextColor={neutral[400]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    maxLength={500}
                  />
                  <Text style={styles.charCount}>{description.length}/500</Text>
                </Animated.View>
              )}

              {/* Error */}
              {error && (
                <Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color={semantic.light.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              )}

              {/* Actions */}
              <View style={styles.actions}>
                <Pressable
                  onPress={handleClose}
                  style={styles.cancelButton}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar"
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>

                <Pressable
                  onPress={handleSubmit}
                  disabled={!selectedReason || isSubmitting}
                  style={[
                    styles.submitButton,
                    (!selectedReason || isSubmitting) && styles.submitButtonDisabled,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Enviar denúncia"
                  accessibilityState={{ disabled: !selectedReason || isSubmitting }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={neutral[0]} />
                  ) : (
                    <>
                      <Ionicons name="send-outline" size={18} color={neutral[0]} />
                      <Text style={styles.submitButtonText}>Enviar</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Tokens.overlay.mediumDark,
  },
  modal: {
    backgroundColor: neutral[0],
    borderTopLeftRadius: radius["2xl"],
    borderTopRightRadius: radius["2xl"],
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: neutral[200],
    borderRadius: 2,
    alignSelf: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: neutral[100],
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: semantic.light.errorLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: neutral[800],
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: neutral[500],
    marginTop: spacing.xs,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semibold,
    color: neutral[700],
    marginBottom: spacing.md,
  },
  optional: {
    fontFamily: typography.fontFamily.base,
    color: neutral[400],
    fontWeight: "400",
  },
  reasonsList: {
    gap: spacing.sm,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: neutral[50],
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: "transparent",
  },
  reasonItemSelected: {
    backgroundColor: brand.accent[50],
    borderColor: brand.accent[500],
  },
  reasonItemPressed: {
    opacity: 0.8,
  },
  reasonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: neutral[100],
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  reasonIconSelected: {
    backgroundColor: brand.accent[500],
  },
  reasonText: {
    flex: 1,
  },
  reasonLabel: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semibold,
    color: neutral[800],
    marginBottom: 2,
  },
  reasonLabelSelected: {
    color: brand.accent[700],
  },
  reasonDescription: {
    fontSize: 13,
    fontFamily: typography.fontFamily.base,
    color: neutral[500],
    lineHeight: 18,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: neutral[300],
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
  radioOuterSelected: {
    borderColor: brand.accent[500],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: brand.accent[500],
  },
  descriptionContainer: {
    marginTop: spacing.xl,
  },
  textInput: {
    backgroundColor: neutral[50],
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: 15,
    fontFamily: typography.fontFamily.base,
    color: neutral[800],
    minHeight: 100,
    borderWidth: 1,
    borderColor: neutral[200],
  },
  charCount: {
    fontSize: 12,
    fontFamily: typography.fontFamily.base,
    color: neutral[400],
    textAlign: "right",
    marginTop: spacing.xs,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: semantic.light.errorLight,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: semantic.light.error,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: neutral[100],
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semibold,
    color: neutral[600],
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: semantic.light.error,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: neutral[300],
  },
  submitButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semibold,
    color: neutral[0],
  },
  successContainer: {
    alignItems: "center",
    padding: spacing.xl,
    paddingBottom: spacing["2xl"],
  },
  successIcon: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: neutral[800],
    marginBottom: spacing.sm,
  },
  successText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.base,
    color: neutral[500],
    textAlign: "center",
    lineHeight: 22,
  },
});

export default ReportModal;
