/**
 * AIConsentScreen - Explicit AI Consent (Apple Guideline 5.1.2(i))
 *
 * CRITICAL: Required for App Store compliance (Nov 2025 guidelines).
 * Users MUST explicitly opt-in before NathIA can share data with third-party AI.
 *
 * Features:
 * - Checkbox opt-in (explicit action required)
 * - Clear disclosure of AI providers (Gemini, GPT, Claude)
 * - Lists what data is shared (messages + profile context)
 * - Link to full privacy policy
 * - Can decline and continue using app (degraded mode)
 *
 * @see docs/release/TESTFLIGHT_GATES_v1.md Gate G2.5
 */

import React, { useState } from "react";
import { Linking, ScrollView, Text, View, Pressable } from "react-native";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePrivacyStore } from "@/state/usePrivacyStore";
import { useTheme } from "@/hooks/useTheme";
import { Tokens, typography, spacing, radius } from "@/theme/tokens";
import { logger } from "@/utils/logger";

// IMPORTANT: This screen is part of a Stack Navigator (NathIAStackNavigator)
// Props will be provided by React Navigation
interface AIConsentScreenProps {
  navigation: {
    replace: (screen: string) => void;
  };
}

const PRIVACY_POLICY_URL = "https://nossamaternidade.app/privacidade";

export function AIConsentScreen({ navigation }: AIConsentScreenProps) {
  const { colors, isDark, text } = useTheme();
  const acceptAiConsent = usePrivacyStore((s) => s.acceptAiConsent);
  const declineAiConsent = usePrivacyStore((s) => s.declineAiConsent);

  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!checked || isSubmitting) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    try {
      await acceptAiConsent();
      logger.info("AI consent accepted", "AIConsentScreen");

      // Navigate to Assistant (user can now use AI)
      navigation.replace("Assistant");
    } catch (error) {
      logger.error(
        "Failed to accept AI consent",
        "AIConsentScreen",
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (isSubmitting) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSubmitting(true);

    try {
      await declineAiConsent();
      logger.info("AI consent declined", "AIConsentScreen");

      // Navigate to NathIADisabled (degraded mode)
      navigation.replace("NathIADisabled");
    } catch (error) {
      logger.error(
        "Failed to decline AI consent",
        "AIConsentScreen",
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPrivacyPolicy = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Linking.openURL(PRIVACY_POLICY_URL);
    } catch (error) {
      logger.warn("Failed to open privacy policy", "AIConsentScreen", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const textMain = text.primary;
  const textSecondary = text.secondary;
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: spacing["2xl"],
          paddingBottom: spacing["4xl"],
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600).springify()} style={{ gap: spacing.xl }}>
          {/* Icon Header */}
          <View style={{ alignItems: "center", marginTop: spacing["2xl"] }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: isDark ? colors.primary[800] : colors.primary[100],
                alignItems: "center",
                justifyContent: "center",
                marginBottom: spacing.lg,
              }}
            >
              <Ionicons name="sparkles" size={40} color={colors.primary[500]} />
            </View>
            <Text
              style={{
                fontSize: typography.headlineLarge.fontSize,
                fontFamily: typography.fontFamily.display,
                color: textMain,
                textAlign: "center",
                marginBottom: spacing.md,
              }}
            >
              Personalização com IA
            </Text>
            <Text
              style={{
                fontSize: typography.bodyLarge.fontSize,
                color: textSecondary,
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              A NathIA usa serviços de IA de terceiros para criar respostas personalizadas para você
            </Text>
          </View>

          {/* What's Shared Card */}
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: radius["2xl"],
              padding: spacing.xl,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary[500]} />
              <Text
                style={{
                  fontSize: typography.titleMedium.fontSize,
                  fontWeight: "600",
                  color: textMain,
                  marginLeft: spacing.sm,
                }}
              >
                O que pode ser compartilhado
              </Text>
            </View>
            <View style={{ gap: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.primary[500]}
                  style={{ marginRight: spacing.sm, marginTop: 2 }}
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: typography.bodyMedium.fontSize,
                    color: textSecondary,
                    lineHeight: 22,
                  }}
                >
                  Suas mensagens e perguntas no chat
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.primary[500]}
                  style={{ marginRight: spacing.sm, marginTop: 2 }}
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: typography.bodyMedium.fontSize,
                    color: textSecondary,
                    lineHeight: 22,
                  }}
                >
                  Contexto do app para personalizar respostas (preferências, informações
                  cadastradas)
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: spacing.lg,
                padding: spacing.md,
                backgroundColor: isDark ? colors.neutral[800] : colors.primary[50],
                borderRadius: radius.md,
              }}
            >
              <Text
                style={{
                  fontSize: typography.bodySmall.fontSize,
                  color: textSecondary,
                  lineHeight: 20,
                }}
              >
                Você pode desativar a IA a qualquer momento em Configurações → Perfil
              </Text>
            </View>
          </View>

          {/* Consent Checkbox */}
          <View
            style={{
              backgroundColor: isDark ? colors.primary[900] + "40" : colors.primary[50],
              borderRadius: radius["2xl"],
              padding: spacing.xl,
              borderWidth: 2,
              borderColor: checked ? colors.primary[500] : borderColor,
            }}
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setChecked(!checked);
              }}
              style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.md }}
              accessibilityLabel="Concordo com o compartilhamento de dados para personalização com IA"
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
            >
              <Checkbox
                value={checked}
                onValueChange={setChecked}
                color={checked ? colors.primary[500] : undefined}
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.bodyMedium.fontSize,
                    fontWeight: "600",
                    color: textMain,
                    lineHeight: 22,
                  }}
                >
                  Eu autorizo o compartilhamento dos dados acima com provedores de IA de terceiros
                </Text>
                <Text
                  style={{
                    fontSize: typography.bodySmall.fontSize,
                    color: textSecondary,
                    marginTop: spacing.xs,
                    lineHeight: 20,
                  }}
                >
                  Essa permissão é necessária para usar a NathIA com inteligência artificial
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={openPrivacyPolicy}
              style={{ marginTop: spacing.md, flexDirection: "row", alignItems: "center" }}
              accessibilityLabel="Abrir política de privacidade"
              accessibilityRole="link"
            >
              <Ionicons name="document-text-outline" size={16} color={colors.primary[500]} />
              <Text
                style={{
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.primary[500],
                  textDecorationLine: "underline",
                  marginLeft: spacing.xs,
                }}
              >
                Ler política de privacidade completa
              </Text>
            </Pressable>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            <Pressable
              onPress={handleAccept}
              disabled={!checked || isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Aceitar e usar IA"
              accessibilityState={{ disabled: !checked || isSubmitting }}
              style={{
                backgroundColor: checked ? colors.primary[500] : colors.neutral[300],
                borderRadius: radius.xl,
                paddingVertical: spacing.lg,
                paddingHorizontal: spacing.xl,
                alignItems: "center",
                opacity: checked ? 1 : 0.5,
              }}
            >
              <Text
                style={{
                  fontSize: typography.bodyLarge.fontSize,
                  fontWeight: "700",
                  color: Tokens.neutral[0],
                }}
              >
                {isSubmitting ? "Salvando..." : "Aceitar e usar IA"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDecline}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Continuar sem IA"
              accessibilityState={{ disabled: isSubmitting }}
              style={{
                backgroundColor: colors.background.card,
                borderRadius: radius.xl,
                paddingVertical: spacing.lg,
                paddingHorizontal: spacing.xl,
                alignItems: "center",
                borderWidth: 1.5,
                borderColor: borderColor,
              }}
            >
              <Text
                style={{
                  fontSize: typography.bodyMedium.fontSize,
                  fontWeight: "600",
                  color: textMain,
                }}
              >
                Continuar sem IA
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
