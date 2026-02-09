/**
 * PostStatusBadge - Badge de status de moderação do post
 *
 * Status:
 * - pending: "Em revisão" (azul) - post aguardando moderação
 * - approved: não mostra badge - post aprovado e visível
 * - rejected: "Rejeitado" (vermelho) - post rejeitado
 * - needs_changes: "Precisa edição" (amarelo) - precisa de alterações
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { brand, semantic, typography, spacing, radius } from "../../theme/tokens";

export type PostStatus = "pending" | "approved" | "rejected" | "needs_changes";

interface PostStatusBadgeProps {
  status: PostStatus;
  size?: "small" | "medium";
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<
  PostStatus,
  {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  pending: {
    label: "Em revisão",
    icon: "time-outline",
    bgColor: brand.primary[100],
    textColor: brand.primary[700],
    borderColor: brand.primary[200],
  },
  approved: {
    label: "Aprovado",
    icon: "checkmark-circle-outline",
    bgColor: semantic.light.successLight,
    textColor: semantic.light.successText,
    borderColor: semantic.light.success,
  },
  rejected: {
    label: "Rejeitado",
    icon: "close-circle-outline",
    bgColor: semantic.light.errorLight,
    textColor: semantic.light.errorText,
    borderColor: semantic.light.error,
  },
  needs_changes: {
    label: "Precisa edição",
    icon: "alert-circle-outline",
    bgColor: semantic.light.warningLight,
    textColor: semantic.light.warningText,
    borderColor: semantic.light.warning,
  },
};

export const PostStatusBadge: React.FC<PostStatusBadgeProps> = React.memo(
  ({ status, size = "medium", showIcon = true }) => {
    // Don't render badge for approved posts
    if (status === "approved") {
      return null;
    }

    const config = STATUS_CONFIG[status];
    const isSmall = size === "small";

    return (
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[
          styles.badge,
          {
            backgroundColor: config.bgColor,
            borderColor: config.borderColor,
            paddingVertical: isSmall ? spacing.xs / 2 : spacing.xs,
            paddingHorizontal: isSmall ? spacing.sm : spacing.md,
          },
        ]}
      >
        {showIcon && (
          <Ionicons
            name={config.icon}
            size={isSmall ? 12 : 14}
            color={config.textColor}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.text,
            {
              color: config.textColor,
              fontSize: isSmall ? 10 : 12,
            },
          ]}
        >
          {config.label}
        </Text>
      </Animated.View>
    );
  }
);

PostStatusBadge.displayName = "PostStatusBadge";

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontFamily: typography.fontFamily.semibold,
    letterSpacing: 0.2,
  },
});
