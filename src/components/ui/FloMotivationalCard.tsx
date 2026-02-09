/**
 * FloMotivationalCard - Card de mensagem motivacional estilo Flo Health
 *
 * Design Flo Health Minimal:
 * - Tipografia serif elegante para mensagens emocionais
 * - Gradiente rosa muito sutil
 * - Assinatura da Nathalia Valente
 * - Ícone de coração
 *
 * @example
 * ```tsx
 * <FloMotivationalCard
 *   message="Cada passo que você dá conta. Continue assim."
 *   author="Nathalia Valente"
 * />
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, Text, View, ViewStyle } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Tokens, shadows, spacing, typography } from "../../theme/tokens";

interface FloMotivationalCardProps {
  /** Motivational message */
  message: string;
  /** Author name */
  author?: string;
  /** Show author icon */
  showIcon?: boolean;
  /** Card variant */
  variant?: "default" | "featured" | "minimal";
  /** Animation delay */
  animationDelay?: number;
  /** Custom style */
  style?: ViewStyle;
}

export function FloMotivationalCard({
  message,
  author = "Nathalia Valente",
  showIcon = true,
  variant = "default",
  animationDelay = 100,
  style,
}: FloMotivationalCardProps) {
  const { isDark } = useTheme();

  // Colors
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const accentColor = Tokens.brand.accent[400];
  const borderColor = isDark ? Tokens.glass.dark.medium : Tokens.accent.dark.blackSoft;

  // Gradient based on variant
  const gradientColors = isDark
    ? ([Tokens.accent.dark.subtle, Tokens.overlay.accentVeryLight] as const)
    : ([Tokens.brand.accent[50], Tokens.maternal.warmth.blush, Tokens.neutral[0]] as const);

  // Serif font for emotional content
  const serifFont = Platform.OS === "ios" ? "Georgia" : "serif";

  if (variant === "minimal") {
    return (
      <Animated.View
        entering={FadeInUp.delay(animationDelay).duration(400)}
        style={[
          {
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.md,
          },
          style,
        ]}
      >
        <Text
          style={{
            fontSize: 18,
            lineHeight: 26,
            fontFamily: serifFont,
            fontStyle: "italic",
            color: textSecondary,
            textAlign: "center",
          }}
        >
          "{message}"
        </Text>
        {author && (
          <Text
            style={{
              fontSize: 12,
              fontFamily: typography.fontFamily.medium,
              color: accentColor,
              textAlign: "center",
              marginTop: spacing.sm,
            }}
          >
            — {author}
          </Text>
        )}
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.delay(animationDelay).duration(400)}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            borderRadius: 20,
            borderWidth: 1,
            borderColor,
            borderLeftWidth: 4, // borda esquerda de destaque
            borderLeftColor: accentColor, // cor de accent
            padding: spacing["2xl"], // 24px (era 20px) - mais respiração
            ...(!isDark && shadows.flo.soft),
          },
          style,
        ]}
      >
        {/* Aspas decorativas opcionais */}
        <Text
          style={{
            fontSize: 32,
            lineHeight: 32,
            fontFamily: serifFont,
            color: `${accentColor}30`, // cor suave de fundo
            marginBottom: -spacing.sm, // sobrepõe levemente o texto
            marginTop: -spacing.sm,
          }}
        >
          "
        </Text>

        <Text
          style={{
            fontSize: variant === "featured" ? 22 : 19, // 19px (era 18px)
            lineHeight: variant === "featured" ? 32 : 30, // 30px (era 28px)
            fontFamily: serifFont,
            color: textPrimary,
            marginBottom: spacing.xl, // 20px (era 16px)
            fontWeight: "500", // medium weight para mais presença
          }}
        >
          {message}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {showIcon && (
            <View
              style={{
                width: 36, // 36px (era 32px)
                height: 36,
                borderRadius: 18,
                backgroundColor: isDark ? Tokens.glass.dark.strong : `${accentColor}15`, // usando cor de accent
                alignItems: "center",
                justifyContent: "center",
                marginRight: spacing.md, // 12px (era 8px)
              }}
            >
              <Ionicons name="heart" size={18} color={accentColor} />
            </View>
          )}

          <Text
            style={{
              fontSize: 14, // 14px (era 13px)
              fontFamily: typography.fontFamily.semibold, // semibold (era medium)
              color: accentColor, // cor de accent ao invés de secundário
            }}
          >
            — {author}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

export default FloMotivationalCard;
