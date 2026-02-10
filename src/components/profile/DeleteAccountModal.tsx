/**
 * DeleteAccountModal - Multi-step account deletion modal
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from "react-native";

import { deleteAccount } from "@/api/auth";
import { useTheme } from "@/hooks/useTheme";
import { Tokens, typography, spacing, radius } from "@/theme/tokens";
import { logger } from "@/utils/logger";
import { useAlertModal } from "@/components/ui/AlertModal";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onAccountDeleted: () => void;
}

export function DeleteAccountModal({
  visible,
  onClose,
  onAccountDeleted,
}: DeleteAccountModalProps) {
  const { colors, isDark, text } = useTheme();
  const alertModal = useAlertModal();

  const textMain = text.primary;
  const textSecondary = text.secondary;
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

  const [step, setStep] = useState(1);
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    setStep(1);
    setReason("");
    setConfirmText("");
    setIsDeleting(false);
    onClose();
  };

  const handleNextStep = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(2);
  };

  const handleConfirmDelete = async () => {
    if (confirmText.toUpperCase() !== "DELETAR") {
      alertModal.show({
        title: "Confirmação incorreta",
        message: 'Por favor, digite "DELETAR" para confirmar a exclusão permanente da sua conta.',
        icon: "warning",
        iconColor: colors.semantic.warning,
        buttons: [{ text: "OK", style: "default" }],
      });
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    try {
      setIsDeleting(true);
      setStep(3);

      logger.info("Deleting account", "DeleteAccountModal", {
        reason: reason || "No reason provided",
      });

      const result = await deleteAccount(reason);

      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        alertModal.show({
          title: "Conta deletada",
          message:
            "Sua conta e todos os dados foram permanentemente removidos. Sentiremos sua falta!",
          icon: "checkmark-circle",
          iconColor: colors.semantic.success,
          buttons: [
            {
              text: "OK",
              style: "default",
              onPress: () => {
                handleClose();
                onAccountDeleted();
              },
            },
          ],
        });
      } else {
        throw new Error(result.error || "Erro ao deletar conta");
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      logger.error("Failed to delete account", "DeleteAccountModal", error as Error);

      alertModal.show({
        title: "Erro ao deletar conta",
        message:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        icon: "alert-circle",
        iconColor: colors.semantic.error,
        buttons: [{ text: "OK", style: "default" }],
      });

      setIsDeleting(false);
      setStep(2);
    }
  };

  const iconContainerStyle = {
    width: 64,
    height: 64,
    borderRadius: spacing["3xl"],
    backgroundColor: isDark ? colors.semantic.error + "20" : colors.semantic.errorLight,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: spacing.xl,
    alignSelf: "center" as const,
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={handleClose}
        accessibilityViewIsModal={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: Tokens.overlay.dark,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing["2xl"],
          }}
          accessibilityViewIsModal={true}
        >
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: radius["2xl"],
              padding: spacing["3xl"],
              width: "100%",
              maxWidth: 420,
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.2,
              shadowRadius: 24,
            }}
          >
            {/* Step 1: Warning */}
            {step === 1 && (
              <Step1Warning
                reason={reason}
                onReasonChange={setReason}
                onCancel={handleClose}
                onNext={handleNextStep}
                colors={colors}
                isDark={isDark}
                textMain={textMain}
                textSecondary={textSecondary}
                borderColor={borderColor}
                iconContainerStyle={iconContainerStyle}
              />
            )}

            {/* Step 2: Confirmation */}
            {step === 2 && (
              <Step2Confirmation
                confirmText={confirmText}
                onConfirmTextChange={setConfirmText}
                isDeleting={isDeleting}
                onBack={() => setStep(1)}
                onConfirm={handleConfirmDelete}
                colors={colors}
                isDark={isDark}
                textMain={textMain}
                textSecondary={textSecondary}
                borderColor={borderColor}
                iconContainerStyle={iconContainerStyle}
              />
            )}

            {/* Step 3: Processing */}
            {step === 3 && (
              <Step3Processing colors={colors} textMain={textMain} textSecondary={textSecondary} />
            )}
          </View>
        </View>
      </Modal>

      <alertModal.AlertModal />
    </>
  );
}

// Step 1 Component
interface Step1Props {
  reason: string;
  onReasonChange: (text: string) => void;
  onCancel: () => void;
  onNext: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
  isDark: boolean;
  textMain: string;
  textSecondary: string;
  borderColor: string;
  iconContainerStyle: Record<string, unknown>;
}

function Step1Warning({
  reason,
  onReasonChange,
  onCancel,
  onNext,
  colors,
  isDark,
  textMain,
  textSecondary,
  borderColor,
  iconContainerStyle,
}: Step1Props) {
  const deletionItems = [
    "Todos os seus posts e comentários",
    "Histórico de ciclo e saúde",
    "Conversas com NathIA",
    "Afirmações e hábitos",
    "Todas as suas preferências",
  ];

  return (
    <>
      <View style={iconContainerStyle}>
        <Ionicons name="warning" size={32} color={colors.semantic.error} />
      </View>

      <Text
        style={{
          color: textMain,
          fontSize: typography.headlineSmall.fontSize,
          fontFamily: typography.fontFamily.display,
          textAlign: "center",
          marginBottom: spacing.md,
        }}
      >
        Deletar sua conta?
      </Text>

      <Text
        style={{
          color: textSecondary,
          fontSize: typography.bodyMedium.fontSize,
          lineHeight: 24,
          textAlign: "center",
          marginBottom: spacing["2xl"],
        }}
      >
        Esta ação é{" "}
        <Text style={{ fontWeight: "700", color: colors.semantic.error }}>
          permanente e irreversivel
        </Text>
        .
      </Text>

      <View
        style={{
          backgroundColor: isDark ? colors.neutral[800] : colors.neutral[100],
          borderRadius: radius.lg,
          padding: spacing.xl,
          marginBottom: spacing["2xl"],
        }}
      >
        <Text
          style={{
            color: textMain,
            fontSize: typography.bodyMedium.fontSize,
            fontWeight: "600",
            marginBottom: spacing.md,
          }}
        >
          O que será deletado:
        </Text>
        <View style={{ gap: spacing.sm }}>
          {deletionItems.map((item) => (
            <View key={item} style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.semantic.error}
                style={{ marginRight: spacing.sm }}
              />
              <Text style={{ color: textSecondary, fontSize: typography.bodyMedium.fontSize }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Text
        style={{
          color: textSecondary,
          fontSize: typography.titleSmall.fontSize,
          marginBottom: spacing.sm,
        }}
      >
        Por que você quer sair? (opcional)
      </Text>
      <TextInput
        value={reason}
        onChangeText={onReasonChange}
        placeholder="Ex: Não uso mais o app, mudei de plataforma..."
        placeholderTextColor={isDark ? colors.neutral[600] : colors.neutral[400]}
        multiline
        numberOfLines={3}
        accessibilityLabel="Motivo para deletar a conta (opcional)"
        accessibilityHint="Campo opcional para nos ajudar a melhorar"
        style={{
          backgroundColor: colors.background.primary,
          borderRadius: radius.md,
          padding: spacing.lg,
          color: textMain,
          fontSize: typography.bodyMedium.fontSize,
          textAlignVertical: "top",
          marginBottom: spacing["2xl"],
          borderWidth: 1,
          borderColor: borderColor,
        }}
      />

      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <Pressable
          onPress={onCancel}
          style={{
            flex: 1,
            backgroundColor: colors.background.tertiary,
            borderRadius: radius.lg,
            paddingVertical: spacing.lg,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: textMain,
              fontSize: typography.bodyMedium.fontSize,
              fontWeight: "600",
            }}
          >
            Cancelar
          </Text>
        </Pressable>
        <Pressable
          onPress={onNext}
          style={{
            flex: 1,
            backgroundColor: colors.semantic.error,
            borderRadius: radius.lg,
            paddingVertical: spacing.lg,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.text.inverse,
              fontSize: typography.bodyMedium.fontSize,
              fontWeight: "600",
            }}
          >
            Continuar
          </Text>
        </Pressable>
      </View>
    </>
  );
}

// Step 2 Component
interface Step2Props {
  confirmText: string;
  onConfirmTextChange: (text: string) => void;
  isDeleting: boolean;
  onBack: () => void;
  onConfirm: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
  isDark: boolean;
  textMain: string;
  textSecondary: string;
  borderColor: string;
  iconContainerStyle: Record<string, unknown>;
}

function Step2Confirmation({
  confirmText,
  onConfirmTextChange,
  isDeleting,
  onBack,
  onConfirm,
  colors,
  isDark,
  textMain,
  textSecondary,
  borderColor,
  iconContainerStyle,
}: Step2Props) {
  const isConfirmValid = confirmText.toUpperCase() === "DELETAR";

  return (
    <>
      <View style={iconContainerStyle}>
        <Ionicons name="shield-checkmark" size={32} color={colors.semantic.error} />
      </View>

      <Text
        style={{
          color: textMain,
          fontSize: typography.headlineSmall.fontSize,
          fontFamily: typography.fontFamily.display,
          textAlign: "center",
          marginBottom: spacing.md,
        }}
      >
        Confirmação final
      </Text>

      <Text
        style={{
          color: textSecondary,
          fontSize: typography.bodyMedium.fontSize,
          lineHeight: 24,
          textAlign: "center",
          marginBottom: spacing["2xl"],
        }}
      >
        Digite <Text style={{ fontWeight: "700", color: colors.semantic.error }}>DELETAR</Text> para
        confirmar a exclusão permanente.
      </Text>

      <TextInput
        value={confirmText}
        onChangeText={onConfirmTextChange}
        placeholder="Digite DELETAR"
        placeholderTextColor={isDark ? colors.neutral[600] : colors.neutral[400]}
        autoCapitalize="characters"
        accessibilityLabel="Digite DELETAR para confirmar exclusão da conta"
        accessibilityHint="Este campo exige a palavra DELETAR em maiúsculas para prosseguir"
        style={{
          backgroundColor: colors.background.primary,
          borderRadius: radius.md,
          padding: spacing.lg,
          color: textMain,
          fontSize: typography.headlineMedium.fontSize,
          fontWeight: "600",
          textAlign: "center",
          marginBottom: spacing["2xl"],
          borderWidth: 2,
          borderColor: isConfirmValid ? colors.semantic.error : borderColor,
        }}
      />

      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <Pressable
          onPress={onBack}
          style={{
            flex: 1,
            backgroundColor: colors.background.tertiary,
            borderRadius: radius.lg,
            paddingVertical: spacing.lg,
            alignItems: "center",
          }}
          accessibilityRole="button"
          accessibilityLabel="Voltar para o passo anterior"
        >
          <Text
            style={{
              color: textMain,
              fontSize: typography.bodyMedium.fontSize,
              fontWeight: "600",
            }}
          >
            Voltar
          </Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          disabled={isDeleting || !isConfirmValid}
          style={{
            flex: 1,
            backgroundColor: isConfirmValid ? colors.semantic.error : colors.neutral[400],
            borderRadius: radius.lg,
            paddingVertical: spacing.lg,
            alignItems: "center",
            opacity: isConfirmValid ? 1 : 0.5,
          }}
          accessibilityRole="button"
          accessibilityLabel={isDeleting ? "Deletando conta" : "Confirmar exclusão da conta"}
          accessibilityState={{ disabled: isDeleting || !isConfirmValid }}
        >
          <Text
            style={{
              color: colors.text.inverse,
              fontSize: typography.bodyMedium.fontSize,
              fontWeight: "600",
            }}
          >
            {isDeleting ? "Deletando..." : "Deletar conta"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

// Step 3 Component
interface Step3Props {
  colors: ReturnType<typeof useTheme>["colors"];
  textMain: string;
  textSecondary: string;
}

function Step3Processing({ colors, textMain, textSecondary }: Step3Props) {
  return (
    <View style={{ alignItems: "center", paddingVertical: spacing["4xl"] }}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text
        style={{
          color: textMain,
          fontSize: typography.headlineMedium.fontSize,
          fontWeight: "600",
          marginTop: spacing["2xl"],
        }}
      >
        Deletando sua conta...
      </Text>
      <Text
        style={{
          color: textSecondary,
          fontSize: typography.bodyMedium.fontSize,
          marginTop: spacing.sm,
          textAlign: "center",
        }}
      >
        Isso pode levar alguns instantes
      </Text>
    </View>
  );
}
