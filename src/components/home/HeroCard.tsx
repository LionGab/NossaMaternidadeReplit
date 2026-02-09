/**
 * HeroCard - Clean Hero Card for NathIA Chat
 *
 * Design Philosophy:
 * - Avatar circular bem posicionado (não full-bleed)
 * - Gradiente suave de fundo
 * - CTA rosa vibrante
 * - Layout limpo e consistente com outras telas
 *
 * @version 6.0 - Clean Avatar Layout
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import type { ViewStyle } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  AnimatedStyle,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import {
  accessibility,
  ctaPrimary,
  neutral,
  radius,
  shadows,
  spacing,
  typography,
} from "../../theme/tokens";

interface HeroCardProps {
  motivationalMessage: string;
  onPress: () => void;
  scrollY: SharedValue<number>;
  ctaGlowStyle: AnimatedStyle<ViewStyle>;
}

export const HeroCard: React.FC<HeroCardProps> = React.memo(
  ({ motivationalMessage, onPress, scrollY, ctaGlowStyle }) => {
    const { isDark, surface, text, border, semantic, gradients } = useTheme();

    // Subtle scale animation on scroll
    const cardAnimatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(scrollY.value, [-50, 0, 100], [1.02, 1, 0.98], "clamp");
      return {
        transform: [{ scale }],
      };
    });

    const cardGradientColors = isDark
      ? ([surface.canvas, surface.base, surface.card] as const)
      : gradients.heroWarm;

    return (
      <Animated.View style={cardAnimatedStyle}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.heroCard,
            {
              borderColor: border.subtle,
              opacity: pressed ? 0.95 : 1,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            },
          ]}
          accessibilityLabel="Começar conversa com a NathIA agora"
          accessibilityRole="button"
          accessibilityHint="Toque para iniciar uma conversa"
        >
          {/* Gradient Background */}
          <LinearGradient
            colors={cardGradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Content Layout */}
          <View style={styles.heroContent}>
            {/* Left: Icon Circle */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarTop}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: surface.elevated,
                      borderColor: border.subtle,
                    },
                  ]}
                >
                  <Ionicons name="chatbubble-ellipses" size={36} color={ctaPrimary.main} />
                </View>
                {/* Online indicator */}
                <View
                  style={[
                    styles.onlineIndicator,
                    {
                      backgroundColor: semantic.success,
                      borderColor: surface.card,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.avatarMicroText,
                  {
                    color: text.secondary,
                  },
                ]}
                numberOfLines={2}
              >
                Sua companheira sempre disponível
              </Text>
            </View>

            {/* Right: Text + CTA */}
            <View style={styles.textContainer}>
              <Text style={[styles.heroTitle, { color: text.primary }]} numberOfLines={2}>
                Converse com a NathIA
              </Text>
              <Text style={[styles.heroPromise, { color: text.secondary }]} numberOfLines={2}>
                Orientação personalizada 24/7 baseada em sua fase maternal
              </Text>
              <Text style={[styles.heroMotivational, { color: text.secondary }]} numberOfLines={1}>
                {motivationalMessage}
              </Text>

              {/* CTA Button */}
              <Animated.View style={[styles.heroCTA, ctaGlowStyle]}>
                <LinearGradient
                  colors={[ctaPrimary.main, ctaPrimary.light]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.heroCTAGradient}
                >
                  <Ionicons name="chatbubble-ellipses" size={16} color={text.onAccent} />
                  <Text style={[styles.heroCTAText, { color: text.onAccent }]}>Começar agora</Text>
                </LinearGradient>
              </Animated.View>
            </View>
          </View>

          {/* Decorative sparkle */}
          <View style={styles.sparkleContainer}>
            <Ionicons name="sparkles" size={20} color={border.accent} />
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

HeroCard.displayName = "HeroCard";

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
    borderWidth: 1,
    ...shadows.md,
    shadowColor: neutral[900],
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.md,
  },
  avatarContainer: {
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarTop: {
    position: "relative",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  avatarMicroText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: typography.fontFamily.base,
    textAlign: "center",
    maxWidth: 108,
  },
  textContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -0.3,
  },
  heroPromise: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.fontFamily.medium,
    lineHeight: 20,
    opacity: 0.9,
  },
  heroMotivational: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: typography.fontFamily.base,
    lineHeight: 16,
    opacity: 0.9,
  },
  heroCTA: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    borderRadius: radius.full,
    overflow: "hidden",
    ...shadows.sm,
    shadowColor: neutral[900],
  },
  heroCTAGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: accessibility.minTapTarget,
  },
  heroCTAText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
  },
  sparkleContainer: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    opacity: 0.6,
  },
});
