/**
 * ModerationInfoCard - Card informativo sobre moderação
 *
 * Exibe informações sobre o processo de moderação de posts:
 * - Tempo estimado de revisão
 * - Por que a moderação existe
 * - O que acontece após submissão
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { brand, neutral, typography, spacing, radius } from "../../theme/tokens";

interface ModerationInfoCardProps {
  variant?: "info" | "compact";
}

export const ModerationInfoCard: React.FC<ModerationInfoCardProps> = React.memo(
  ({ variant = "info" }) => {
    if (variant === "compact") {
      return (
        <View style={styles.compactContainer}>
          <Ionicons name="shield-checkmark-outline" size={14} color={brand.primary[600]} />
          <Text style={styles.compactText}>Post será revisado antes de ser publicado</Text>
        </View>
      );
    }

    return (
      <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={20} color={brand.primary[600]} />
          </View>
          <Text style={styles.title}>Sobre Moderação</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={neutral[500]} />
            <Text style={styles.infoText}>
              Revisão em até <Text style={styles.highlight}>24 horas</Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="eye-outline" size={16} color={neutral[500]} />
            <Text style={styles.infoText}>
              Nossa equipe analisa todos os posts para manter a comunidade segura
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="notifications-outline" size={16} color={neutral[500]} />
            <Text style={styles.infoText}>Você será notificada quando seu post for aprovado</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Ionicons name="heart-outline" size={14} color={brand.accent[600]} />
          <Text style={styles.footerText}>Juntas construímos um espaço acolhedor</Text>
        </View>
      </Animated.View>
    );
  }
);

ModerationInfoCard.displayName = "ModerationInfoCard";

const styles = StyleSheet.create({
  container: {
    backgroundColor: brand.primary[50],
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: brand.primary[100],
    padding: spacing.md,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: brand.primary[100],
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
    color: brand.primary[800],
  },
  content: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  infoText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: neutral[600],
    flex: 1,
    lineHeight: 18,
  },
  highlight: {
    fontFamily: typography.fontFamily.semibold,
    color: brand.primary[700],
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: brand.primary[100],
  },
  footerText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: brand.accent[600],
    fontStyle: "italic",
  },
  // Compact variant
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  compactText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: brand.primary[600],
  },
});
