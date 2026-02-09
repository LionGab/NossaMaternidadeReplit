/**
 * NathIADisabledScreen - Degraded Mode (AI Declined)
 *
 * Shown when user declines AI consent or disables AI in settings.
 * App remains functional - this is NOT a blocker screen.
 *
 * Features:
 * - Friendly message (no shaming for declining)
 * - CTA to enable AI (goes back to consent screen)
 * - Secondary CTA to return to Home
 *
 * @see docs/release/TESTFLIGHT_GATES_v1.md Gate G2.5
 */

import React from "react";
import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { Tokens, typography, spacing, radius } from "@/theme/tokens";

// IMPORTANT: This screen is part of a Stack Navigator (NathIAStackNavigator)
// Props will be provided by React Navigation
interface NathIADisabledScreenProps {
  navigation: {
    replace: (screen: string) => void;
    getParent: () => {
      navigate: (screen: string) => void;
    } | null;
  };
}

export function NathIADisabledScreen({ navigation }: NathIADisabledScreenProps) {
  const { colors, isDark, text } = useTheme();

  const handleEnableAI = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Go back to consent screen
    navigation.replace("AIConsent");
  };

  const handleGoHome = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to Home tab (exit NathIA tab)
    const parent = navigation.getParent();
    parent?.navigate("Home");
  };

  const textMain = text.primary;
  const textSecondary = text.secondary;
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }} edges={["top"]}>
      <View
        style={{
          flex: 1,
          padding: spacing["2xl"],
          justifyContent: "center",
        }}
      >
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={{ alignItems: "center" }}
        >
          {/* Icon */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: isDark ? colors.neutral[800] : colors.neutral[100],
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing["2xl"],
            }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={56} color={textSecondary} />
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: typography.headlineLarge.fontSize,
              fontFamily: typography.fontFamily.display,
              color: textMain,
              textAlign: "center",
              marginBottom: spacing.md,
            }}
          >
            NathIA sem IA{"\n"}(por enquanto)
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: typography.bodyLarge.fontSize,
              color: textSecondary,
              textAlign: "center",
              lineHeight: 24,
              marginBottom: spacing["3xl"],
              maxWidth: 320,
            }}
          >
            Você optou por não usar IA de terceiros. Tudo bem — o app continua funcionando
            normalmente.
          </Text>

          {/* Info Card */}
          <View
            style={{
              backgroundColor: colors.background.card,
              borderRadius: radius["2xl"],
              padding: spacing.xl,
              borderWidth: 1,
              borderColor: borderColor,
              marginBottom: spacing["2xl"],
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary[500]} />
              <Text
                style={{
                  fontSize: typography.titleMedium.fontSize,
                  fontWeight: "600",
                  color: textMain,
                  marginLeft: spacing.sm,
                }}
              >
                O que você ainda pode fazer
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
                  Acessar todo o conteúdo do app
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
                  Rastrear seu ciclo e hábitos
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
                  Participar da comunidade
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: spacing.md, width: "100%" }}>
            <Pressable
              onPress={handleEnableAI}
              accessibilityRole="button"
              accessibilityLabel="Ativar IA da NathIA"
              style={{
                backgroundColor: colors.primary[500],
                borderRadius: radius.xl,
                paddingVertical: spacing.lg,
                paddingHorizontal: spacing.xl,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Ionicons name="sparkles" size={20} color={Tokens.neutral[0]} />
                <Text
                  style={{
                    fontSize: typography.bodyLarge.fontSize,
                    fontWeight: "700",
                    color: Tokens.neutral[0],
                  }}
                >
                  Ativar IA
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleGoHome}
              accessibilityRole="button"
              accessibilityLabel="Voltar para a tela inicial"
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
                Voltar para Home
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
