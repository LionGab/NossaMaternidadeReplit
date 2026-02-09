/**
 * EmojiSelector - Componente de seleção de estados emocionais
 *
 * Features:
 * - Grid 2x2 com cards animados
 * - Gradiente e ícone por opção
 * - Checkmark animado no selecionado
 * - Haptic feedback
 * - Staggered animations
 */

import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { Tokens } from "@/theme/tokens";
import { useTheme } from "@/hooks/useTheme";
import { logger } from "@/utils/logger";

// ===========================================
// TYPES
// ===========================================

export interface EmojiOption {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  gradient: readonly [string, string] | [string, string];
  iconColor: string;
}

export interface EmojiSelectorProps {
  options: EmojiOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  testID?: string;
}

// ===========================================
// COMPONENT
// ===========================================

export function EmojiSelector({ options, selected, onSelect, testID }: EmojiSelectorProps) {
  const theme = useTheme();

  const handleSelect = useCallback(
    (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      onSelect(id);
      logger.info(`Emoji selected: ${id}`, "EmojiSelector");
    },
    [onSelect]
  );

  return (
    <View style={styles.grid} testID={testID}>
      {options.map((option, index) => {
        const isSelected = selected === option.id;

        return (
          <Animated.View
            key={option.id}
            entering={FadeInDown.delay(index * 80).duration(300)}
            style={styles.cardWrapper}
          >
            <Pressable
              onPress={() => handleSelect(option.id)}
              style={({ pressed }) => [
                styles.card,
                {
                  borderColor: isSelected ? Tokens.brand.accent[300] : theme.colors.border.subtle,
                  backgroundColor: theme.surface.card,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
                isSelected && styles.cardSelected,
              ]}
              accessibilityLabel={`${option.title}. ${option.subtitle ?? ""}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              {/* Gradient Header */}
              <View style={styles.gradientContainer}>
                <LinearGradient
                  colors={[option.gradient[0], option.gradient[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradient}
                />

                {/* Icon */}
                <View style={styles.iconWrapper}>
                  <View style={[styles.iconCircle, { backgroundColor: `${option.iconColor}20` }]}>
                    <Ionicons
                      name={option.icon as React.ComponentProps<typeof Ionicons>["name"]}
                      size={32}
                      color={option.iconColor}
                    />
                  </View>
                </View>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={[styles.title, { color: theme.text.primary }]} numberOfLines={1}>
                  {option.title}
                </Text>
                {option.subtitle && (
                  <Text
                    style={[styles.subtitle, { color: theme.text.secondary }]}
                    numberOfLines={2}
                  >
                    {option.subtitle}
                  </Text>
                )}
              </View>

              {/* Checkmark */}
              {isSelected && (
                <View style={styles.checkmark}>
                  <LinearGradient
                    colors={[Tokens.brand.accent[300], Tokens.brand.accent[400]]}
                    style={styles.checkmarkGradient}
                  >
                    <Ionicons name="checkmark" size={16} color={Tokens.neutral[0]} />
                  </LinearGradient>
                </View>
              )}
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Tokens.spacing.lg,
  },
  cardWrapper: {
    width: "47.5%",
  },
  card: {
    borderRadius: Tokens.radius["2xl"],
    borderWidth: 1.5,
    overflow: "hidden",
    position: "relative",
    ...Tokens.shadows.md,
  },
  cardSelected: {
    borderWidth: 2.5,
  },
  gradientContainer: {
    width: "100%",
    height: 90,
    position: "relative",
  },
  gradient: {
    flex: 1,
  },
  iconWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  content: {
    padding: Tokens.spacing.md,
    alignItems: "center",
    gap: Tokens.spacing.xs,
  },
  title: {
    fontSize: Tokens.typography.titleSmall.fontSize,
    fontWeight: Tokens.typography.titleSmall.fontWeight,
    fontFamily: Tokens.typography.fontFamily.semibold,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Tokens.typography.caption.fontSize,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: Tokens.typography.caption.lineHeight * 1.2,
  },
  checkmark: {
    position: "absolute",
    top: Tokens.spacing.sm,
    right: Tokens.spacing.sm,
  },
  checkmarkGradient: {
    width: 28,
    height: 28,
    borderRadius: Tokens.radius.full,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
});
