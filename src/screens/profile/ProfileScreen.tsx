/**
 * ProfileScreen - Premium Profile & Settings
 *
 * Design: Card-based layout with staggered animations,
 * matching the premium quality of HomeScreen.
 *
 * Components:
 * - ProfileHeader: Avatar with gradient ring, name, stats
 * - ThemeSelector: Light/Dark/System toggle
 * - SettingsSection: Grouped menu items
 * - DeleteAccountModal: Multi-step deletion flow
 *
 * @version 3.0 - Premium Redesign Feb 2026
 */

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, HelpCircle, Info, LogOut, Sparkles, Trash2, User } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, Switch, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  DeleteAccountModal,
  ProfileHeader,
  SettingsSection,
  ThemeSelector,
  type SettingsItem,
} from "@/components/profile";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/state";
import { usePrivacyStore } from "@/state/usePrivacyStore";
import { brand, maternal, neutral, Tokens, typography, spacing, radius } from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";
import { staggeredFadeUp } from "@/utils/animations";
import { logger } from "@/utils/logger";
import { shadowPresets } from "@/utils/shadow";

export default function ProfileScreen({ navigation }: RootStackScreenProps<"EditProfile">) {
  const { isDark, colors, text } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAppStore((s) => s.user);
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);

  // AI Consent
  const aiConsentStatus = usePrivacyStore((s) => s.aiConsentStatus);
  const isAiEnabled = usePrivacyStore((s) => s.isAiEnabled);
  const setAiEnabled = usePrivacyStore((s) => s.setAiEnabled);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tabBarHeight = useBottomTabBarHeight();

  const textMain = text.primary;
  const textSecondary = text.secondary;

  // Menu items
  const settingsItems: SettingsItem[] = useMemo(
    () => [
      {
        id: "edit",
        label: "Editar perfil",
        icon: User,
        onPress: () => navigation.navigate("EditProfile"),
      },
      {
        id: "notifications",
        label: "Notificacoes",
        icon: Bell,
        onPress: () => navigation.navigate("NotificationPreferences"),
      },
      {
        id: "help",
        label: "Ajuda e suporte",
        icon: HelpCircle,
        onPress: () => navigation.navigate("MainTabs", { screen: "Assistant" }),
      },
      {
        id: "about",
        label: "Sobre o app",
        icon: Info,
        onPress: () => {},
      },
    ],
    [navigation]
  );

  const handleLogout = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setOnboardingComplete(false);
  }, [setOnboardingComplete]);

  const handleDeletePress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteModal(true);
  }, []);

  const handleAiToggle = useCallback(
    async (value: boolean) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (aiConsentStatus !== "accepted") {
        navigation.navigate("MainTabs", { screen: "Assistant" });
        return;
      }

      try {
        await setAiEnabled(value);
        logger.info(`AI ${value ? "enabled" : "disabled"}`, "ProfileScreen");
      } catch (error) {
        logger.error(
          "Failed to toggle AI",
          "ProfileScreen",
          error instanceof Error ? error : new Error(String(error))
        );
      }
    },
    [aiConsentStatus, navigation, setAiEnabled]
  );

  const gradientColors: readonly [string, string, string] = isDark
    ? [neutral[900], neutral[800], neutral[900]]
    : [maternal.warmth.blush, maternal.warmth.cream, brand.primary[50]];

  return (
    <LinearGradient colors={gradientColors} style={styles.container} locations={[0, 0.3, 1]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: tabBarHeight + spacing["3xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Animated.View entering={staggeredFadeUp(0)} style={styles.section}>
          <Text
            style={[
              styles.pageTitle,
              {
                color: textMain,
                fontFamily: typography.fontFamily.display,
              },
            ]}
          >
            Perfil
          </Text>
        </Animated.View>

        {/* Profile Header Card */}
        <Animated.View entering={staggeredFadeUp(1)} style={styles.section}>
          <ProfileHeader user={user} onEditPress={() => navigation.navigate("EditProfile")} />
        </Animated.View>

        {/* Interests */}
        {user?.interests && user.interests.length > 0 && (
          <Animated.View entering={staggeredFadeUp(2)} style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: textMain,
                  fontFamily: typography.fontFamily.semibold,
                },
              ]}
            >
              Seus interesses
            </Text>
            <View style={styles.interestsWrap}>
              {user.interests.map((interest) => (
                <View
                  key={interest}
                  style={[
                    styles.interestChip,
                    {
                      backgroundColor: colors.background.card,
                      ...shadowPresets.sm,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.interestText,
                      {
                        color: textMain,
                        fontFamily: typography.fontFamily.medium,
                      },
                    ]}
                  >
                    {interest.replace("_", " ")}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Theme Selector */}
        <Animated.View entering={staggeredFadeUp(3)} style={styles.section}>
          <ThemeSelector />
        </Animated.View>

        {/* AI Settings */}
        <Animated.View entering={staggeredFadeUp(4)} style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: textMain,
                fontFamily: typography.fontFamily.semibold,
              },
            ]}
          >
            Personalizacao com IA
          </Text>
          <View
            style={[
              styles.aiCard,
              {
                backgroundColor: colors.background.card,
                ...shadowPresets.sm,
              },
            ]}
          >
            <View style={styles.aiRow}>
              <View
                style={[
                  styles.aiIconContainer,
                  {
                    backgroundColor: isDark ? `${brand.accent[500]}20` : `${brand.accent[500]}12`,
                  },
                ]}
              >
                <Sparkles size={20} color={brand.accent[500]} strokeWidth={2} />
              </View>
              <View style={styles.aiTextSection}>
                <Text
                  style={[
                    styles.aiTitle,
                    {
                      color: textMain,
                      fontFamily: typography.fontFamily.semibold,
                    },
                  ]}
                >
                  NathIA
                </Text>
                <Text
                  style={[
                    styles.aiDescription,
                    {
                      color: textSecondary,
                      fontFamily: typography.fontFamily.base,
                    },
                  ]}
                >
                  {aiConsentStatus === "accepted"
                    ? "Respostas personalizadas com IA"
                    : "Ative o consentimento primeiro"}
                </Text>
              </View>
              <Switch
                value={aiConsentStatus === "accepted" && isAiEnabled}
                onValueChange={handleAiToggle}
                disabled={aiConsentStatus !== "accepted"}
                trackColor={{
                  false: isDark ? Tokens.neutral[700] : Tokens.neutral[300],
                  true: brand.accent[500],
                }}
                thumbColor={Tokens.neutral[0]}
                accessibilityLabel="Alternar uso de IA da NathIA"
              />
            </View>

            {aiConsentStatus !== "accepted" && (
              <View
                style={[
                  styles.aiHint,
                  {
                    backgroundColor: isDark ? `${brand.primary[500]}15` : brand.primary[50],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.aiHintText,
                    {
                      color: textSecondary,
                      fontFamily: typography.fontFamily.base,
                    },
                  ]}
                >
                  Para ativar, primeiro aceite o consentimento na tab NathIA
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Settings Menu */}
        <Animated.View entering={staggeredFadeUp(5)} style={styles.section}>
          <SettingsSection title="Configuracoes" items={settingsItems} />
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={staggeredFadeUp(6)} style={styles.section}>
          <Pressable
            onPress={handleLogout}
            accessibilityLabel="Sair da conta"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.logoutButton,
              {
                backgroundColor: colors.background.card,
                borderColor: isDark ? colors.semantic.error : brand.accent[200],
                ...shadowPresets.sm,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <LogOut size={20} color={colors.semantic.error} strokeWidth={2} />
            <Text
              style={[
                styles.logoutText,
                {
                  color: colors.semantic.error,
                  fontFamily: typography.fontFamily.semibold,
                },
              ]}
            >
              Sair da conta
            </Text>
          </Pressable>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View entering={staggeredFadeUp(7)} style={styles.section}>
          <Text
            style={[
              styles.dangerTitle,
              {
                color: textSecondary,
                fontFamily: typography.fontFamily.semibold,
              },
            ]}
          >
            ZONA DE PERIGO
          </Text>
          <Pressable
            onPress={handleDeletePress}
            accessibilityLabel="Deletar minha conta permanentemente"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.deleteButton,
              {
                backgroundColor: isDark ? neutral[900] : neutral[50],
                borderColor: colors.semantic.error,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Trash2 size={20} color={colors.semantic.error} strokeWidth={2} />
            <Text
              style={[
                styles.deleteText,
                {
                  color: colors.semantic.error,
                  fontFamily: typography.fontFamily.semibold,
                },
              ]}
            >
              Deletar minha conta
            </Text>
          </Pressable>
        </Animated.View>

        {/* App Info Footer */}
        <Animated.View entering={staggeredFadeUp(8)} style={styles.footer}>
          <Text
            style={[
              styles.footerName,
              {
                color: textSecondary,
                fontFamily: typography.fontFamily.semibold,
              },
            ]}
          >
            Nossa Maternidade
          </Text>
          <Text
            style={[
              styles.footerBy,
              {
                color: textSecondary,
                fontFamily: typography.fontFamily.base,
              },
            ]}
          >
            Por Nathalia
          </Text>
          <Text
            style={[
              styles.footerVersion,
              {
                color: isDark ? Tokens.neutral[600] : Tokens.neutral[400],
                fontFamily: typography.fontFamily.base,
              },
            ]}
          >
            Versao 1.0.0
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onAccountDeleted={() => setOnboardingComplete(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    gap: spacing.xl,
  },

  section: {
    paddingHorizontal: spacing.xl,
  },

  pageTitle: {
    fontSize: typography.displayMedium.fontSize,
    lineHeight: typography.displayMedium.lineHeight,
  },

  sectionTitle: {
    fontSize: typography.titleMedium.fontSize,
    marginBottom: spacing.md,
  },

  // Interests
  interestsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  interestChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },

  interestText: {
    fontSize: typography.bodySmall.fontSize,
    textTransform: "capitalize",
  },

  // AI Settings
  aiCard: {
    borderRadius: radius["2xl"],
    padding: spacing.xl,
  },

  aiRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  aiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  aiTextSection: {
    flex: 1,
    marginRight: spacing.md,
  },

  aiTitle: {
    fontSize: typography.titleSmall.fontSize,
    marginBottom: 2,
  },

  aiDescription: {
    fontSize: typography.caption.fontSize,
    lineHeight: 18,
  },

  aiHint: {
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },

  aiHintText: {
    fontSize: typography.caption.fontSize,
    lineHeight: 18,
  },

  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderWidth: 1.5,
    gap: spacing.sm,
  },

  logoutText: {
    fontSize: typography.bodyMedium.fontSize,
  },

  // Danger Zone
  dangerTitle: {
    fontSize: typography.caption.fontSize,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderWidth: 1.5,
    gap: spacing.sm,
  },

  deleteText: {
    fontSize: typography.bodyMedium.fontSize,
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingTop: spacing.xl,
  },

  footerName: {
    fontSize: typography.bodyMedium.fontSize,
  },

  footerBy: {
    fontSize: typography.titleSmall.fontSize,
    marginTop: spacing.xs,
  },

  footerVersion: {
    fontSize: typography.caption.fontSize,
    marginTop: spacing.sm,
  },
});
