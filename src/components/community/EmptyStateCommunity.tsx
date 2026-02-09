/**
 * EmptyStateCommunity - Estados vazios da comunidade
 *
 * Variantes:
 * - no_posts: Nenhum post na comunidade (incentiva criar)
 * - no_results: Busca sem resultados
 * - error: Erro ao carregar
 * - my_posts_empty: Nenhum post do usuário
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { brand, neutral, semantic, typography, spacing, radius } from "../../theme/tokens";

export type EmptyStateVariant = "no_posts" | "no_results" | "error" | "my_posts_empty";

interface EmptyStateCommunityProps {
  variant: EmptyStateVariant;
  onAction?: () => void;
  onRetry?: () => void;
  searchQuery?: string;
  /** Template prompts for quick post creation */
  onTemplatePress?: (template: string) => void;
}

// Post templates for guided empty state
const POST_TEMPLATES = [
  {
    icon: "💬",
    text: "Como está sua semana?",
    value: "Olá, mães! Como está sendo a semana de vocês?",
  },
  {
    icon: "📸",
    text: "Compartilhe um momento",
    value: "Quero compartilhar um momento especial...",
  },
  { icon: "❓", text: "Tire uma dúvida", value: "Alguém pode me ajudar? Minha dúvida é..." },
] as const;

interface VariantConfig {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  actionLabel?: string;
}

const getVariantConfig = (variant: EmptyStateVariant, searchQuery?: string): VariantConfig => {
  switch (variant) {
    case "no_posts":
      return {
        icon: "people-outline",
        iconColor: brand.accent[600],
        iconBg: brand.accent[50],
        title: "Seja a Primeira!",
        description:
          "A comunidade Mães Valente está esperando sua história. Compartilhe e inspire outras mães.",
        actionLabel: "Criar Primeiro Post",
      };
    case "no_results":
      return {
        icon: "search-outline",
        iconColor: neutral[500],
        iconBg: neutral[100],
        title: "Nenhum resultado",
        description: searchQuery
          ? `Não encontramos posts para "${searchQuery}". Tente outros termos.`
          : "Não encontramos posts com esses filtros.",
        actionLabel: "Limpar busca",
      };
    case "error":
      return {
        icon: "cloud-offline-outline",
        iconColor: semantic.light.error,
        iconBg: semantic.light.errorLight,
        title: "Ops! Algo deu errado",
        description: "Não conseguimos carregar os posts. Verifique sua conexão e tente novamente.",
        actionLabel: "Tentar novamente",
      };
    case "my_posts_empty":
      return {
        icon: "document-text-outline",
        iconColor: brand.primary[600],
        iconBg: brand.primary[50],
        title: "Nenhum post ainda",
        description:
          "Você ainda não criou nenhum post. Compartilhe sua experiência com a comunidade!",
        actionLabel: "Criar meu primeiro post",
      };
  }
};

export const EmptyStateCommunity: React.FC<EmptyStateCommunityProps> = React.memo(
  ({ variant, onAction, onRetry, searchQuery, onTemplatePress }) => {
    const config = getVariantConfig(variant, searchQuery);
    const scale = useSharedValue(1);

    const animatedButtonStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = useCallback(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (variant === "error") {
        onRetry?.();
      } else {
        onAction?.();
      }
    }, [variant, onAction, onRetry]);

    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.95, { damping: 15 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 12 });
    }, [scale]);

    return (
      <Animated.View entering={FadeInUp.duration(400).springify()} style={styles.container}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
          <Ionicons name={config.icon} size={48} color={config.iconColor} />
        </View>

        {/* Text */}
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.description}>{config.description}</Text>

        {/* Action Button */}
        {config.actionLabel && (onAction || onRetry) && (
          <Animated.View style={animatedButtonStyle}>
            <Pressable
              onPress={handlePress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              accessibilityRole="button"
              accessibilityLabel={config.actionLabel}
              style={[styles.actionButton, variant === "error" && styles.actionButtonError]}
            >
              {variant === "error" && (
                <Ionicons name="refresh-outline" size={18} color={neutral[0]} />
              )}
              {variant === "no_posts" || variant === "my_posts_empty" ? (
                <Ionicons name="add-outline" size={18} color={neutral[0]} />
              ) : null}
              <Text style={styles.actionButtonText}>{config.actionLabel}</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Quick Templates for "no_posts" variant */}
        {variant === "no_posts" && onTemplatePress && (
          <Animated.View
            entering={FadeInUp.delay(200).duration(400)}
            style={styles.templatesContainer}
          >
            <Text style={styles.templatesTitle}>Ou escolha um início:</Text>
            <View style={styles.templatesList}>
              {POST_TEMPLATES.map((template, index) => (
                <Pressable
                  key={index}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onTemplatePress(template.value);
                  }}
                  style={({ pressed }) => [
                    styles.templateButton,
                    pressed && styles.templateButtonPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={template.text}
                >
                  <Text style={styles.templateEmoji}>{template.icon}</Text>
                  <Text style={styles.templateText}>{template.text}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  }
);

EmptyStateCommunity.displayName = "EmptyStateCommunity";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing["2xl"],
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: neutral[800],
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    color: neutral[500],
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.lg,
    maxWidth: 280,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: brand.accent[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    shadowColor: brand.accent[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonError: {
    backgroundColor: semantic.light.error,
    shadowColor: semantic.light.error,
  },
  actionButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semibold,
    color: neutral[0],
  },
  // Template styles
  templatesContainer: {
    marginTop: spacing.xl,
    alignItems: "center",
    width: "100%",
  },
  templatesTitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: neutral[400],
    marginBottom: spacing.md,
  },
  templatesList: {
    width: "100%",
    gap: spacing.sm,
  },
  templateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: neutral[50],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: neutral[200],
  },
  templateButtonPressed: {
    backgroundColor: brand.accent[50],
    borderColor: brand.accent[200],
  },
  templateEmoji: {
    fontSize: 18,
  },
  templateText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: neutral[700],
  },
});
