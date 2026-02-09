import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteAccount } from "@/api/auth";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/state/store";
import { usePrivacyStore } from "@/state/usePrivacyStore";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";
import { Tokens, typography, spacing, radius } from "@/theme/tokens";
import { getStageLabel } from "@/utils/formatters";
import { useAlertModal } from "@/components/ui/AlertModal";

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

/**
 * ProfileScreen - Grid 8pt compliant
 *
 * Esta tela já segue o sistema de Grid 8pt através de:
 * - Tailwind classes (px-6 = 24px, mb-8 = 32px, etc.)
 * - Hook useSpacing disponível para valores dinâmicos
 * - Todos os espaçamentos são múltiplos de 8px
 *
 * @see docs/8PT_GRID_SYSTEM.md
 */
export default function ProfileScreen({ navigation }: RootStackScreenProps<"EditProfile">) {
  const insets = useSafeAreaInsets();
  const { colors, theme, setTheme, isDark, text } = useTheme();
  const user = useAppStore((s) => s.user);

  // AI Consent State
  const aiConsentStatus = usePrivacyStore((s) => s.aiConsentStatus);
  const isAiEnabled = usePrivacyStore((s) => s.isAiEnabled);
  const setAiEnabled = usePrivacyStore((s) => s.setAiEnabled);

  // Cores dinâmicas do tema
  const textMain = text.primary;
  const textSecondary = text.secondary;
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1: warning, 2: confirmation, 3: processing
  const [deleteReason, setDeleteReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert modal for replacing native Alert.alert
  const alertModal = useAlertModal();

  const MENU_ITEMS: MenuItem[] = [
    { id: "edit", label: "Editar perfil", icon: "person-outline", color: Tokens.neutral[500] },
    {
      id: "notifications",
      label: "Notificações",
      icon: "notifications-outline",
      color: Tokens.neutral[500],
    },
    { id: "privacy", label: "Privacidade", icon: "shield-outline", color: Tokens.neutral[500] },
    {
      id: "help",
      label: "Ajuda e suporte",
      icon: "help-circle-outline",
      color: Tokens.neutral[500],
    },
    {
      id: "about",
      label: "Sobre o app",
      icon: "information-circle-outline",
      color: Tokens.neutral[500],
    },
  ];

  const handleLogout = () => {
    setOnboardingComplete(false);
  };

  const handleSettingsPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("NotificationPreferences");
  };

  const handleMenuItemPress = async (itemId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Navegação baseada no item do menu
    switch (itemId) {
      case "edit":
        navigation.navigate("EditProfile");
        break;
      case "notifications":
        navigation.navigate("NotificationPreferences");
        break;
      // ARCHIVED: Privacy/Legal screens moved to archive/privacy-support/
      // case "privacy":
      //   navigation.navigate("PrivacySettings");
      //   break;
      case "help":
        navigation.navigate("MainTabs", { screen: "Assistant" });
        break;
      // ARCHIVED: Privacy/Legal screens moved to archive/privacy-support/
      // case "about":
      //   navigation.navigate("Legal");
      //   break;
    }
  };

  const handleDeleteAccountPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteModal(true);
    setDeleteStep(1);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteStep(1);
    setDeleteReason("");
    setConfirmText("");
    setIsDeleting(false);
  };

  const handleNextStep = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDeleteStep(2);
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
      setDeleteStep(3);

      logger.info("Deleting account", "ProfileScreen", {
        reason: deleteReason || "No reason provided",
      });

      const result = await deleteAccount(deleteReason);

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
                handleCloseDeleteModal();
                setOnboardingComplete(false);
              },
            },
          ],
        });
      } else {
        throw new Error(result.error || "Erro ao deletar conta");
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      logger.error("Failed to delete account", "ProfileScreen", error as Error);

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
      setDeleteStep(2);
    }
  };

  // TODO: Export data feature - implementation available in /delete-account edge function
  // To enable: uncomment code and add "export" menu item

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <LinearGradient
        colors={
          isDark
            ? [colors.background.primary, colors.background.secondary, colors.background.tertiary]
            : [colors.primary[50], colors.secondary[50], colors.background.secondary]
        }
        locations={[0, 0.4, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 400 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={{
            paddingTop: insets.top + spacing.xl,
            paddingHorizontal: spacing["2xl"],
            paddingBottom: spacing["3xl"],
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: spacing["3xl"],
            }}
          >
            <Text
              style={{
                color: textMain,
                fontSize: typography.headlineLarge.fontSize,
                fontFamily: typography.fontFamily.display,
              }}
            >
              Perfil
            </Text>
            <Pressable
              onPress={handleSettingsPress}
              accessibilityLabel="Abrir configurações"
              accessibilityRole="button"
              style={{
                padding: spacing.sm,
                backgroundColor: colors.background.card,
                borderRadius: radius.md,
                shadowColor: colors.neutral[900],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
              }}
            >
              <Ionicons name="settings-outline" size={24} color={textSecondary} />
            </Pressable>
          </View>

          {/* Profile Card */}
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: spacing["3xl"],
              padding: spacing["3xl"],
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 24,
            }}
          >
            <View style={{ alignItems: "center" }}>
              {/* Avatar Container with Badge */}
              <View style={{ position: "relative", marginBottom: spacing.xl }}>
                <Pressable
                  onPress={() => navigation.navigate("EditProfile")}
                  accessibilityLabel="Foto de perfil"
                  accessibilityRole="button"
                  style={{
                    width: 112,
                    height: 112,
                    borderRadius: 56,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={require("../../../assets/images/profile-avatar.png")}
                    style={{
                      width: 112,
                      height: 112,
                      borderRadius: 56,
                    }}
                    resizeMode="cover"
                  />
                </Pressable>

                {/* Add Photo Badge */}
                <Pressable
                  onPress={() => navigation.navigate("EditProfile")}
                  accessibilityLabel="Adicionar foto"
                  accessibilityRole="button"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.primary[500],
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 3,
                    borderColor: colors.background.card,
                    shadowColor: colors.neutral[900],
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Ionicons name="camera" size={18} color={Tokens.neutral[0]} />
                </Pressable>
              </View>
              <Text
                style={{
                  color: textMain,
                  fontSize: typography.headlineSmall.fontSize,
                  fontFamily: typography.fontFamily.display,
                  marginBottom: spacing.md,
                }}
              >
                {user?.name || "Usuaria"}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.sm,
                    borderRadius: radius.full,
                    backgroundColor: isDark ? colors.primary[800] : colors.primary[50],
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary[500],
                      fontSize: typography.bodyLarge.fontSize,
                      fontWeight: "600",
                    }}
                  >
                    {getStageLabel(user?.stage)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View
              style={{
                flexDirection: "row",
                marginTop: spacing["3xl"],
                paddingTop: spacing["3xl"],
                borderTopWidth: 1,
                borderTopColor: borderColor,
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    color: textMain,
                    fontSize: typography.headlineSmall.fontSize,
                    fontWeight: "700",
                    marginBottom: spacing.xs,
                  }}
                >
                  0
                </Text>
                <Text style={{ color: textSecondary, fontSize: typography.titleSmall.fontSize }}>
                  Posts
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: borderColor }} />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    color: textMain,
                    fontSize: typography.headlineSmall.fontSize,
                    fontWeight: "700",
                    marginBottom: spacing.xs,
                  }}
                >
                  0
                </Text>
                <Text style={{ color: textSecondary, fontSize: typography.titleSmall.fontSize }}>
                  Grupos
                </Text>
              </View>
              <View style={{ width: 1, backgroundColor: borderColor }} />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    color: textMain,
                    fontSize: typography.headlineSmall.fontSize,
                    fontWeight: "700",
                    marginBottom: spacing.xs,
                  }}
                >
                  {user?.interests?.length || 0}
                </Text>
                <Text style={{ color: textSecondary, fontSize: typography.titleSmall.fontSize }}>
                  Interesses
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Interests */}
        {user?.interests && user.interests.length > 0 && (
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            style={{ paddingHorizontal: spacing["2xl"], marginBottom: spacing["3xl"] }}
          >
            <Text
              style={{
                color: textMain,
                fontSize: typography.titleMedium.fontSize,
                fontWeight: "600",
                marginBottom: spacing.lg,
              }}
            >
              Seus interesses
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {user.interests.map((interest, index) => (
                <Animated.View
                  key={interest}
                  entering={FadeInUp.delay(300 + index * 50)
                    .duration(600)
                    .springify()}
                >
                  <View
                    style={{
                      paddingHorizontal: spacing.xl,
                      paddingVertical: spacing.md,
                      marginRight: spacing.sm,
                      marginBottom: spacing.sm,
                      backgroundColor: colors.background.card,
                      borderRadius: radius.xl,
                      shadowColor: colors.neutral[900],
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.2 : 0.04,
                      shadowRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: textMain,
                        fontSize: typography.bodyMedium.fontSize,
                        textTransform: "capitalize",
                      }}
                    >
                      {interest.replace("_", " ")}
                    </Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Theme Selection */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(600).springify()}
          style={{ paddingHorizontal: spacing["2xl"], marginBottom: spacing["3xl"] }}
        >
          <Text
            style={{
              color: textMain,
              fontSize: typography.titleMedium.fontSize,
              fontWeight: "600",
              marginBottom: spacing.lg,
            }}
          >
            Aparencia
          </Text>
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: radius["2xl"],
              padding: spacing.xl,
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              {/* Light Theme */}
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme("light");
                }}
                accessibilityLabel="Tema claro"
                accessibilityRole="button"
                accessibilityState={{ selected: theme === "light" }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor:
                    theme === "light"
                      ? isDark
                        ? colors.primary[800]
                        : colors.primary[50]
                      : "transparent",
                  borderRadius: radius.lg,
                  paddingVertical: spacing.lg,
                  marginRight: spacing.sm,
                  borderWidth: 2,
                  borderColor:
                    theme === "light"
                      ? colors.primary[500]
                      : isDark
                        ? colors.neutral[700]
                        : "transparent",
                }}
              >
                <Ionicons
                  name="sunny"
                  size={28}
                  color={theme === "light" ? colors.primary[500] : textSecondary}
                />
                <Text
                  style={{
                    fontSize: typography.titleSmall.fontSize,
                    fontWeight: "600",
                    marginTop: spacing.sm,
                    color: theme === "light" ? colors.primary[500] : textSecondary,
                  }}
                >
                  Claro
                </Text>
              </Pressable>

              {/* Dark Theme */}
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme("dark");
                }}
                accessibilityLabel="Tema escuro"
                accessibilityRole="button"
                accessibilityState={{ selected: theme === "dark" }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor:
                    theme === "dark"
                      ? isDark
                        ? colors.primary[800]
                        : colors.primary[50]
                      : "transparent",
                  borderRadius: radius.lg,
                  paddingVertical: spacing.lg,
                  marginHorizontal: spacing.sm,
                  borderWidth: 2,
                  borderColor:
                    theme === "dark"
                      ? colors.primary[500]
                      : isDark
                        ? colors.neutral[700]
                        : "transparent",
                }}
              >
                <Ionicons
                  name="moon"
                  size={28}
                  color={theme === "dark" ? colors.primary[500] : textSecondary}
                />
                <Text
                  style={{
                    fontSize: typography.titleSmall.fontSize,
                    fontWeight: "600",
                    marginTop: spacing.sm,
                    color: theme === "dark" ? colors.primary[500] : textSecondary,
                  }}
                >
                  Escuro
                </Text>
              </Pressable>

              {/* System Theme */}
              <Pressable
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTheme("system");
                }}
                accessibilityLabel="Tema do sistema"
                accessibilityRole="button"
                accessibilityState={{ selected: theme === "system" }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor:
                    theme === "system"
                      ? isDark
                        ? colors.primary[800]
                        : colors.primary[50]
                      : "transparent",
                  borderRadius: radius.lg,
                  paddingVertical: spacing.lg,
                  marginLeft: spacing.sm,
                  borderWidth: 2,
                  borderColor:
                    theme === "system"
                      ? colors.primary[500]
                      : isDark
                        ? colors.neutral[700]
                        : "transparent",
                }}
              >
                <Ionicons
                  name="phone-portrait"
                  size={28}
                  color={theme === "system" ? colors.primary[500] : textSecondary}
                />
                <Text
                  style={{
                    fontSize: typography.titleSmall.fontSize,
                    fontWeight: "600",
                    marginTop: spacing.sm,
                    color: theme === "system" ? colors.primary[500] : textSecondary,
                  }}
                >
                  Sistema
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* AI Settings Section */}
        <Animated.View
          entering={FadeInUp.delay(350).duration(600).springify()}
          style={{ paddingHorizontal: spacing["2xl"], marginBottom: spacing["3xl"] }}
        >
          <Text
            style={{
              color: textMain,
              fontSize: typography.titleMedium.fontSize,
              fontWeight: "600",
              marginBottom: spacing.lg,
            }}
          >
            Personalização com IA
          </Text>
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: radius["2xl"],
              padding: spacing.xl,
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing.md,
              }}
            >
              <View style={{ flex: 1, marginRight: spacing.lg }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }}
                >
                  <Ionicons name="sparkles" size={20} color={colors.primary[500]} />
                  <Text
                    style={{
                      fontSize: typography.titleMedium.fontSize,
                      fontWeight: "600",
                      color: textMain,
                      marginLeft: spacing.sm,
                    }}
                  >
                    Usar IA da NathIA
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: typography.bodySmall.fontSize,
                    color: textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {aiConsentStatus === "accepted"
                    ? "Habilita respostas personalizadas com IA de terceiros"
                    : "Ative o consentimento primeiro para usar IA"}
                </Text>
              </View>
              <Switch
                value={aiConsentStatus === "accepted" && isAiEnabled}
                onValueChange={async (value) => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                  // If user hasn't accepted consent, navigate to NathIA tab (will show consent screen)
                  if (aiConsentStatus !== "accepted") {
                    navigation.navigate("MainTabs", { screen: "Assistant" });
                    return;
                  }

                  // Toggle AI enabled state
                  try {
                    await setAiEnabled(value);
                    logger.info(`AI ${value ? "enabled" : "disabled"}`, "ProfileScreen");
                  } catch (error) {
                    logger.error(
                      "Failed to toggle AI enabled state",
                      "ProfileScreen",
                      error instanceof Error ? error : new Error(String(error))
                    );
                  }
                }}
                disabled={aiConsentStatus !== "accepted"}
                trackColor={{
                  false: isDark ? colors.neutral[700] : colors.neutral[300],
                  true: colors.primary[500],
                }}
                thumbColor={Tokens.neutral[0]}
                accessibilityLabel="Alternar uso de IA da NathIA"
                accessibilityHint={
                  aiConsentStatus !== "accepted"
                    ? "Você precisa aceitar o consentimento primeiro"
                    : undefined
                }
              />
            </View>

            {aiConsentStatus !== "accepted" && (
              <View
                style={{
                  padding: spacing.md,
                  backgroundColor: isDark ? colors.primary[900] + "40" : colors.primary[50],
                  borderRadius: radius.md,
                  marginTop: spacing.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.bodySmall.fontSize,
                    color: textSecondary,
                    lineHeight: 20,
                  }}
                >
                  💡 Para ativar, primeiro aceite o consentimento de compartilhamento de dados na
                  tab NathIA
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600).springify()}
          style={{ paddingHorizontal: spacing["2xl"] }}
        >
          <Text
            style={{
              color: textMain,
              fontSize: typography.titleMedium.fontSize,
              fontWeight: "600",
              marginBottom: spacing.lg,
            }}
          >
            Configuracoes
          </Text>
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: radius["2xl"],
              overflow: "hidden",
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.2 : 0.04,
              shadowRadius: 12,
            }}
          >
            {MENU_ITEMS.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => handleMenuItemPress(item.id)}
                accessibilityLabel={`Menu: ${item.label}`}
                accessibilityRole="menuitem"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: spacing.xl,
                  paddingVertical: spacing.xl,
                  borderBottomWidth: index < MENU_ITEMS.length - 1 ? 1 : 0,
                  borderBottomColor: borderColor,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.xl,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: spacing.lg,
                    backgroundColor: colors.background.tertiary,
                  }}
                >
                  <Ionicons name={item.icon} size={22} color={textSecondary} />
                </View>
                <Text
                  style={{
                    flex: 1,
                    color: textMain,
                    fontSize: typography.bodyMedium.fontSize,
                    fontWeight: "500",
                  }}
                >
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={textSecondary} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={{ paddingHorizontal: spacing["2xl"], marginTop: spacing["2xl"] }}
        >
          <Pressable
            onPress={handleLogout}
            accessibilityLabel="Sair da conta"
            accessibilityRole="button"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.background.card,
              borderRadius: radius.xl,
              paddingVertical: spacing.lg,
              paddingHorizontal: spacing.xl,
              borderWidth: 1.5,
              borderColor: isDark ? colors.semantic.error : colors.primary[200],
            }}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.semantic.error} />
            <Text
              style={{
                color: colors.semantic.error,
                fontSize: typography.bodyMedium.fontSize,
                fontWeight: "600",
                marginLeft: spacing.sm,
              }}
            >
              Sair da conta
            </Text>
          </Pressable>
        </Animated.View>

        {/* Danger Zone - Delete Account */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600).springify()}
          style={{ paddingHorizontal: spacing["2xl"], marginTop: spacing["3xl"] }}
        >
          <Text
            style={{
              color: textSecondary,
              fontSize: typography.titleSmall.fontSize,
              fontWeight: "600",
              marginBottom: spacing.md,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Zona de Perigo
          </Text>
          <Pressable
            onPress={handleDeleteAccountPress}
            accessibilityLabel="Deletar minha conta permanentemente"
            accessibilityRole="button"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDark ? colors.neutral[900] : colors.neutral[50],
              borderRadius: radius.xl,
              paddingVertical: spacing.lg,
              paddingHorizontal: spacing.xl,
              borderWidth: 1.5,
              borderColor: colors.semantic.error,
            }}
          >
            <Ionicons name="trash-outline" size={22} color={colors.semantic.error} />
            <Text
              style={{
                color: colors.semantic.error,
                fontSize: typography.bodyMedium.fontSize,
                fontWeight: "600",
                marginLeft: spacing.sm,
              }}
            >
              Deletar minha conta
            </Text>
          </Pressable>
        </Animated.View>

        {/* App Info */}
        <View style={{ alignItems: "center", marginTop: spacing["4xl"] }}>
          <Text
            style={{
              color: textSecondary,
              fontSize: typography.bodyMedium.fontSize,
              fontWeight: "500",
            }}
          >
            Nossa Maternidade
          </Text>
          <Text
            style={{
              color: textSecondary,
              fontSize: typography.titleSmall.fontSize,
              marginTop: spacing.xs,
            }}
          >
            Por Nathalia
          </Text>
          <Text
            style={{
              color: isDark ? colors.neutral[600] : colors.neutral[400],
              fontSize: typography.caption.fontSize,
              marginTop: spacing.sm,
            }}
          >
            Versao 1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent
        onRequestClose={handleCloseDeleteModal}
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
            {deleteStep === 1 && (
              <>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: spacing["3xl"],
                    backgroundColor: isDark
                      ? colors.semantic.error + "20"
                      : colors.semantic.errorLight,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing.xl,
                    alignSelf: "center",
                  }}
                >
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
                  Esta acao e{" "}
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
                    O que sera deletado:
                  </Text>
                  <View style={{ gap: spacing.sm }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={colors.semantic.error}
                        style={{ marginRight: spacing.sm }}
                      />
                      <Text
                        style={{ color: textSecondary, fontSize: typography.bodyMedium.fontSize }}
                      >
                        Todos os seus posts e comentarios
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={colors.semantic.error}
                        style={{ marginRight: spacing.sm }}
                      />
                      <Text
                        style={{ color: textSecondary, fontSize: typography.bodyMedium.fontSize }}
                      >
                        Historico de ciclo e saude
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={colors.semantic.error}
                        style={{ marginRight: spacing.sm }}
                      />
                      <Text
                        style={{ color: textSecondary, fontSize: typography.bodyMedium.fontSize }}
                      >
                        Conversas com NathIA
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={colors.semantic.error}
                        style={{ marginRight: spacing.sm }}
                      />
                      <Text
                        style={{ color: textSecondary, fontSize: typography.bodyMedium.fontSize }}
                      >
                        Afirmacoes e habitos
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={colors.semantic.error}
                        style={{ marginRight: spacing.sm }}
                      />
                      <Text
                        style={{ color: textSecondary, fontSize: typography.bodyMedium.fontSize }}
                      >
                        Todas as suas preferencias
                      </Text>
                    </View>
                  </View>
                </View>

                <Text
                  style={{
                    color: textSecondary,
                    fontSize: typography.titleSmall.fontSize,
                    marginBottom: spacing.sm,
                  }}
                >
                  Por que voce quer sair? (opcional)
                </Text>
                <TextInput
                  value={deleteReason}
                  onChangeText={setDeleteReason}
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
                    onPress={handleCloseDeleteModal}
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
                    onPress={handleNextStep}
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
            )}

            {/* Step 2: Confirmation */}
            {deleteStep === 2 && (
              <>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: spacing["3xl"],
                    backgroundColor: isDark
                      ? colors.semantic.error + "20"
                      : colors.semantic.errorLight,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing.xl,
                    alignSelf: "center",
                  }}
                >
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
                  Confirmacao final
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
                  Digite{" "}
                  <Text style={{ fontWeight: "700", color: colors.semantic.error }}>DELETAR</Text>{" "}
                  para confirmar a exclusao permanente.
                </Text>

                <TextInput
                  value={confirmText}
                  onChangeText={setConfirmText}
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
                    borderColor:
                      confirmText.toUpperCase() === "DELETAR" ? colors.semantic.error : borderColor,
                  }}
                />

                <View style={{ flexDirection: "row", gap: spacing.md }}>
                  <Pressable
                    onPress={() => setDeleteStep(1)}
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
                    onPress={handleConfirmDelete}
                    disabled={isDeleting || confirmText.toUpperCase() !== "DELETAR"}
                    style={{
                      flex: 1,
                      backgroundColor:
                        confirmText.toUpperCase() === "DELETAR"
                          ? colors.semantic.error
                          : colors.neutral[400],
                      borderRadius: radius.lg,
                      paddingVertical: spacing.lg,
                      alignItems: "center",
                      opacity: confirmText.toUpperCase() === "DELETAR" ? 1 : 0.5,
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isDeleting ? "Deletando conta" : "Confirmar exclusao da conta"
                    }
                    accessibilityState={{
                      disabled: isDeleting || confirmText.toUpperCase() !== "DELETAR",
                    }}
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
            )}

            {/* Step 3: Processing */}
            {deleteStep === 3 && (
              <>
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
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Alert Modal for custom alerts */}
      <alertModal.AlertModal />
    </View>
  );
}
