/**
 * ProfileScreen - Design Flo Health Minimal 2025
 *
 * Design Concept: "Suas Configurações Pessoais"
 * - Layout clean e minimalista
 * - Avatar centralizado com estilo elegante
 * - Menu items como cards sutis
 * - Toggle de tema integrado
 * - Zona de perigo clara mas não intrusiva
 *
 * @example
 * ```tsx
 * <ProfileScreenRedesign navigation={navigation} />
 * ```
 *
 * ARCHIVED: This redesign was not selected. ProfileScreen is the active version.
 * Kept for reference and potential future design iterations.
 */

import { deleteAccount } from "@/api/auth";
import { FloActionCard, FloHeader, FloScreenWrapper, FloSectionTitle } from "@/components/ui";
import { useAlertModal } from "@/components/ui/AlertModal";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/state/store";
import { Tokens, shadows, spacing, surface, typography } from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";
import { getStageLabel } from "@/utils/formatters";
import { logger } from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

/**
 * Menu Items Configuration
 */
interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "edit",
    label: "Editar Perfil",
    subtitle: "Atualize suas informações",
    icon: "person-outline",
    route: "EditProfile",
  },
  {
    id: "notifications",
    label: "Notificações",
    subtitle: "Gerencie seus lembretes",
    icon: "notifications-outline",
    route: "NotificationPreferences",
  },
  {
    id: "help",
    label: "Ajuda e Suporte",
    subtitle: "Converse com NathIA",
    icon: "help-circle-outline",
  },
];

export default function ProfileScreenRedesign({ navigation }: RootStackScreenProps<"EditProfile">) {
  const { isDark, setTheme } = useTheme();
  const user = useAppStore((s) => s.user);
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteReason, setDeleteReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [, setIsDeleting] = useState(false);

  const alertModal = useAlertModal();

  // Colors
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const cardBg = isDark ? surface.dark.cardAlpha : Tokens.neutral[0];
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[100];
  const accentColor = Tokens.brand.accent[500];
  const dangerColor = Tokens.semantic.light.error;

  const handleLogout = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logger.info("Logout pressed", "ProfileScreen");
    setOnboardingComplete(false);
  }, [setOnboardingComplete]);

  const handleMenuItemPress = useCallback(
    async (item: MenuItem) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      logger.info(`Menu item pressed: ${item.id}`, "ProfileScreen");

      switch (item.id) {
        case "help":
          navigation.navigate("MainTabs", { screen: "Assistant" });
          break;
        default:
          if (item.route) {
            (navigation.navigate as (screen: string) => void)(item.route);
          }
      }
    },
    [navigation]
  );

  const handleThemeToggle = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logger.info(`Theme toggled to: ${isDark ? "light" : "dark"}`, "ProfileScreen");
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  const handleDeleteAccountPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteModal(true);
    setDeleteStep(1);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteStep(1);
    setDeleteReason("");
    setConfirmText("");
    setIsDeleting(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (confirmText.toUpperCase() !== "DELETAR") {
      alertModal.show({
        title: "Confirmação incorreta",
        message: 'Por favor, digite "DELETAR" para confirmar.',
        icon: "warning",
        buttons: [{ text: "OK", style: "default" }],
      });
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    try {
      setIsDeleting(true);
      setDeleteStep(3);

      const result = await deleteAccount(deleteReason);

      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        handleCloseDeleteModal();
        setOnboardingComplete(false);
      } else {
        throw new Error(result.error || "Erro ao deletar conta");
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      logger.error("Failed to delete account", "ProfileScreen", error as Error);
      setIsDeleting(false);
      setDeleteStep(2);
    }
  }, [confirmText, deleteReason, alertModal, handleCloseDeleteModal, setOnboardingComplete]);

  return (
    <FloScreenWrapper scrollable paddingBottom={120}>
      {/* Header */}
      <FloHeader title="Seu Perfil" showBack onBack={() => navigation.goBack()} variant="default" />

      {/* Profile Hero Card */}
      <Animated.View entering={FadeInUp.delay(100).duration(400)} style={{ marginBottom: 32 }}>
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            borderWidth: 1,
            borderColor,
            padding: spacing["2xl"],
            alignItems: "center",
            ...(!isDark && shadows.flo.soft),
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: Tokens.brand.accent[50],
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.lg,
              borderWidth: 3,
              borderColor: Tokens.brand.accent[200],
            }}
          >
            <Ionicons name="person" size={40} color={accentColor} />
          </View>

          {/* Name */}
          <Text
            style={{
              fontSize: 22,
              fontFamily: typography.fontFamily.bold,
              color: textPrimary,
              marginBottom: spacing.sm,
            }}
          >
            {user?.name || "Querida"}
          </Text>

          {/* Stage Badge */}
          <View
            style={{
              backgroundColor: accentColor,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: typography.fontFamily.bold,
                color: Tokens.neutral[0],
                letterSpacing: 0.5,
              }}
            >
              {getStageLabel(user?.stage)}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Menu Items */}
      <FloSectionTitle title="Configurações" size="md" animationDelay={150} />

      <View style={{ gap: 12, marginBottom: 32 }}>
        {MENU_ITEMS.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInUp.delay(200 + index * 50).duration(400)}>
            <FloActionCard
              icon={item.icon}
              title={item.label}
              subtitle={item.subtitle}
              onPress={() => handleMenuItemPress(item)}
            />
          </Animated.View>
        ))}
      </View>

      {/* Theme Toggle */}
      <Animated.View entering={FadeInUp.delay(400).duration(400)}>
        <Pressable
          onPress={handleThemeToggle}
          accessibilityRole="button"
          accessibilityLabel={`Tema ${isDark ? "escuro" : "claro"}. Toque para alternar`}
        >
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 16,
              borderWidth: 1,
              borderColor,
              padding: spacing.lg,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 32,
              ...(!isDark && shadows.flo.minimal),
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? Tokens.neutral[700] : Tokens.brand.secondary[50],
                alignItems: "center",
                justifyContent: "center",
                marginRight: spacing.lg,
              }}
            >
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={22}
                color={Tokens.brand.secondary[500]}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: typography.fontFamily.semibold,
                  color: textPrimary,
                  marginBottom: 2,
                }}
              >
                Tema {isDark ? "Escuro" : "Claro"}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: typography.fontFamily.medium,
                  color: textSecondary,
                }}
              >
                Toque para alternar
              </Text>
            </View>

            <View
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                backgroundColor: isDark ? accentColor : Tokens.neutral[200],
                justifyContent: "center",
                paddingHorizontal: 2,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: Tokens.neutral[0],
                  marginLeft: isDark ? "auto" : 0,
                }}
              />
            </View>
          </View>
        </Pressable>
      </Animated.View>

      {/* Logout Button */}
      <Animated.View entering={FadeInUp.delay(450).duration(400)}>
        <Pressable
          onPress={handleLogout}
          style={{
            borderRadius: 16,
            padding: spacing.lg,
            alignItems: "center",
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: accentColor,
            marginBottom: 24,
          }}
          accessibilityLabel="Sair da conta"
          accessibilityRole="button"
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: typography.fontFamily.bold,
              color: accentColor,
            }}
          >
            Sair da Conta
          </Text>
        </Pressable>
      </Animated.View>

      {/* Danger Zone */}
      <Animated.View entering={FadeInUp.delay(500).duration(400)}>
        <View
          style={{
            backgroundColor: isDark
              ? Tokens.semantic.dark.errorLight
              : Tokens.semantic.light.errorLight,
            borderRadius: 16,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: isDark
              ? Tokens.semantic.dark.errorBorder
              : Tokens.semantic.light.errorLight,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: typography.fontFamily.bold,
              color: dangerColor,
              marginBottom: spacing.sm,
              letterSpacing: 0.5,
            }}
          >
            ZONA DE PERIGO
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: typography.fontFamily.medium,
              color: textSecondary,
              marginBottom: spacing.lg,
              lineHeight: 18,
            }}
          >
            Esta ação é irreversível e apagará todos os seus dados permanentemente.
          </Text>
          <Pressable
            onPress={handleDeleteAccountPress}
            style={{
              backgroundColor: dangerColor,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: spacing.lg,
              alignItems: "center",
            }}
            accessibilityLabel="Deletar conta permanentemente"
            accessibilityRole="button"
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: typography.fontFamily.bold,
                color: Tokens.neutral[0],
              }}
            >
              Deletar Conta
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Delete Account Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: surface.light.overlay,
            alignItems: "center",
            justifyContent: "center",
            padding: spacing.xl,
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? surface.dark.elevated : Tokens.neutral[0],
              borderRadius: 24,
              padding: spacing["2xl"],
              width: "100%",
              maxWidth: 400,
            }}
          >
            {deleteStep === 1 && (
              <>
                <Ionicons
                  name="alert-circle"
                  size={56}
                  color={dangerColor}
                  style={{ alignSelf: "center", marginBottom: spacing.lg }}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: typography.fontFamily.bold,
                    color: textPrimary,
                    textAlign: "center",
                    marginBottom: spacing.md,
                  }}
                >
                  Deletar sua conta?
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: typography.fontFamily.medium,
                    color: textSecondary,
                    textAlign: "center",
                    lineHeight: 20,
                    marginBottom: spacing.xl,
                  }}
                >
                  Todos os seus dados serão permanentemente removidos e não poderão ser recuperados.
                </Text>

                <TextInput
                  value={deleteReason}
                  onChangeText={setDeleteReason}
                  placeholder="Motivo (opcional)"
                  placeholderTextColor={textSecondary}
                  multiline
                  style={{
                    borderWidth: 1,
                    borderColor,
                    borderRadius: 12,
                    padding: spacing.lg,
                    fontSize: 14,
                    fontFamily: typography.fontFamily.medium,
                    color: textPrimary,
                    marginBottom: spacing.lg,
                    minHeight: 80,
                    backgroundColor: isDark ? Tokens.neutral[800] : Tokens.neutral[0],
                  }}
                />

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Pressable
                    onPress={handleCloseDeleteModal}
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      paddingVertical: 14,
                      backgroundColor: isDark ? Tokens.neutral[700] : Tokens.neutral[100],
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: typography.fontFamily.bold,
                        color: textPrimary,
                      }}
                    >
                      Cancelar
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setDeleteStep(2)}
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      paddingVertical: 14,
                      backgroundColor: dangerColor,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: typography.fontFamily.bold,
                        color: Tokens.neutral[0],
                      }}
                    >
                      Continuar
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {deleteStep === 2 && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: typography.fontFamily.bold,
                    color: textPrimary,
                    marginBottom: spacing.lg,
                  }}
                >
                  Confirme digitando "DELETAR"
                </Text>
                <TextInput
                  value={confirmText}
                  onChangeText={setConfirmText}
                  placeholder="Digite DELETAR"
                  placeholderTextColor={textSecondary}
                  autoCapitalize="characters"
                  style={{
                    borderWidth: 2,
                    borderColor: dangerColor,
                    borderRadius: 12,
                    padding: spacing.lg,
                    fontSize: 15,
                    fontFamily: typography.fontFamily.medium,
                    color: textPrimary,
                    marginBottom: spacing.lg,
                    backgroundColor: isDark ? "rgba(255,255,255,0.05)" : Tokens.neutral[0],
                  }}
                />
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Pressable
                    onPress={() => setDeleteStep(1)}
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      paddingVertical: 14,
                      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : Tokens.neutral[100],
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: typography.fontFamily.bold,
                        color: textPrimary,
                      }}
                    >
                      Voltar
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleConfirmDelete}
                    style={{
                      flex: 1,
                      borderRadius: 12,
                      paddingVertical: 14,
                      backgroundColor: dangerColor,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: typography.fontFamily.bold,
                        color: Tokens.neutral[0],
                      }}
                    >
                      Deletar
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {deleteStep === 3 && (
              <View style={{ alignItems: "center", paddingVertical: spacing["2xl"] }}>
                <ActivityIndicator size="large" color={dangerColor} />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: typography.fontFamily.medium,
                    color: textSecondary,
                    marginTop: spacing.lg,
                  }}
                >
                  Deletando sua conta...
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </FloScreenWrapper>
  );
}
