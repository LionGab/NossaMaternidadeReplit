/**
 * ChatEmptyState - Premium Empty State for NathIA Chat
 *
 * Design: Flo/I Am inspired with:
 * - Large avatar with rosa glow
 * - Glassmorphism suggestion cards
 * - Staggered animations
 * - Premium typography
 *
 * @version 2.0 - Premium Redesign
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

// Avatar da NathIA
const NATHIA_AVATAR = require("../../../assets/nathia-app.png");
import { useTheme } from "../../hooks/useTheme";
import {
  brand,
  neutral,
  COLORS,
  COLORS_DARK,
  spacing,
  radius,
  shadows,
  premium,
  typography,
  Tokens,
} from "../../theme/tokens";

interface SuggestedPrompt {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    icon: "nutrition-outline",
    title: "Alimentação",
    subtitle: "O que posso comer na gravidez?",
  },
  {
    icon: "fitness-outline",
    title: "Exercícios",
    subtitle: "Atividades seguras para gestantes",
  },
  {
    icon: "medical-outline",
    title: "Sintomas",
    subtitle: "Quando devo procurar um médico?",
  },
  {
    icon: "heart-outline",
    title: "Bem-estar",
    subtitle: "Dicas para aliviar enjoos",
  },
];

interface ChatEmptyStateProps {
  onSuggestedPrompt: (text: string) => void;
  screenWidth?: number;
  horizontalPadding?: number;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  onSuggestedPrompt,
  screenWidth = 375,
  horizontalPadding = 16,
}) => {
  const { isDark } = useTheme();
  const palette = isDark ? COLORS_DARK : COLORS;
  const textPrimary = palette.text.primary;
  // Use darker color for better contrast (WCAG AA compliance)
  const textSecondary = isDark ? neutral[300] : neutral[600];

  // Responsive values
  const isTablet = screenWidth >= 768;
  const maxContentWidth = isTablet ? 500 : screenWidth - horizontalPadding * 2;
  const avatarSize = isTablet ? 90 : 70;

  // Haptic feedback handler for prompt cards
  const handlePromptPress = useCallback(
    async (subtitle: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSuggestedPrompt(subtitle);
    },
    [onSuggestedPrompt]
  );

  return (
    <View style={[styles.container, { maxWidth: maxContentWidth, width: "100%" }]}>
      {/* Welcome Card with Avatar */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.welcomeCard}>
        <LinearGradient
          colors={[brand.accent[50], Tokens.brand.accent[100]]}
          style={styles.welcomeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Avatar inside card */}
          <View style={styles.avatarInCard}>
            <View
              style={[styles.avatarGlowInCard, { width: avatarSize + 16, height: avatarSize + 16 }]}
            >
              <View
                style={[styles.avatarContainerInCard, { width: avatarSize, height: avatarSize }]}
              >
                <Image
                  source={NATHIA_AVATAR}
                  style={[
                    styles.avatarInCardImage,
                    { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
                  ]}
                  contentFit="cover"
                  transition={200}
                  accessibilityLabel="Avatar da NathIA"
                />
                {/* Online indicator */}
                <View style={styles.onlineIndicatorInCard} />
              </View>
            </View>
          </View>

          {/* Title and Message */}
          <View style={styles.welcomeContent}>
            <Text style={[styles.welcomeTitle, { color: textPrimary }]}>Olá! Sou a NathIA</Text>
            <Text style={[styles.welcomeSubtitle, { color: brand.accent[500] }]}>
              Sua assistente de maternidade 24h
            </Text>
            <View style={styles.welcomeMessageRow}>
              <View style={styles.welcomeIconContainer}>
                <Ionicons name="sparkles" size={20} color={brand.accent[500]} />
              </View>
              <Text style={[styles.welcomeText, { color: textSecondary }]}>
                Estou aqui para tirar suas dúvidas, te acalmar e conversar sobre essa fase incrível.
                O que você gostaria de saber hoje?
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Suggested Prompts - Glassmorphism Cards */}
      <View style={styles.promptsContainer}>
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(500 + index * 80).springify()}
            style={styles.promptItem}
          >
            <Pressable
              onPress={() => handlePromptPress(prompt.subtitle)}
              style={({ pressed }) => [
                styles.promptButton,
                {
                  backgroundColor: pressed ? brand.accent[50] : premium.glass.background,
                  borderColor: pressed ? brand.accent[400] : premium.glass.border,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.95 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Perguntar sobre ${prompt.title}`}
              accessibilityHint={`Toque para perguntar: ${prompt.subtitle}`}
            >
              {/* Icon */}
              <View style={[styles.promptIconContainer, { backgroundColor: brand.accent[100] }]}>
                <Ionicons name={prompt.icon} size={24} color={brand.accent[500]} />
              </View>

              {/* Text */}
              <View style={styles.promptTextContainer}>
                <Text style={[styles.promptTitle, { color: textPrimary }]}>{prompt.title}</Text>
                <Text style={[styles.promptSubtitle, { color: textSecondary }]} numberOfLines={1}>
                  {prompt.subtitle}
                </Text>
              </View>

              {/* Chevron */}
              <Ionicons name="chevron-forward" size={18} color={brand.accent[400]} />
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    paddingTop: spacing.xl,
    paddingHorizontal: 0, // padding já vem do ScrollView pai
    overflow: "hidden",
  },
  // Welcome Card
  welcomeCard: {
    alignSelf: "stretch",
    borderRadius: radius.xl,
    overflow: "hidden",
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  welcomeGradient: {
    padding: spacing.xl,
    alignItems: "center",
  },
  // Avatar inside card
  avatarInCard: {
    marginBottom: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarGlowInCard: {
    borderRadius: 100,
    backgroundColor: brand.accent[100],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: brand.accent[400],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainerInCard: {
    position: "relative",
  },
  avatarInCardImage: {
    borderWidth: 3,
    borderColor: brand.accent[400],
  },
  onlineIndicatorInCard: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: brand.teal[500],
    borderWidth: 2.5,
    borderColor: neutral[0],
  },
  // Welcome content
  welcomeContent: {
    alignItems: "center",
    width: "100%",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  welcomeMessageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    width: "100%",
  },
  welcomeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: neutral[0],
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
    flexShrink: 0,
  },
  welcomeText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    fontFamily: typography.fontFamily.base,
    letterSpacing: 0.1,
  },
  // Prompts
  promptsContainer: {
    alignSelf: "stretch",
    gap: spacing.md,
  },
  promptItem: {
    alignSelf: "stretch",
  },
  promptButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    minHeight: 72,
    gap: spacing.md,
    // Glassmorphism with subtle shadow
    ...shadows.sm,
  },
  promptIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    // Subtle shadow on icon container
    shadowColor: brand.accent[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  promptTextContainer: {
    flex: 1,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  promptSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: typography.fontFamily.base,
    lineHeight: 20,
  },
});
