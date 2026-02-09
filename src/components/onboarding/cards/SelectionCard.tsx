/**
 * SelectionCard - Card genérico para seleções no onboarding
 *
 * Features:
 * - Animações de seleção com Reanimated v4
 * - Glow effect quando selecionado
 * - Haptic feedback
 * - Suporte a ícone, emoji ou imagem
 * - Variantes: large (full row), compact (grid), chip (small)
 * - Acessibilidade completa
 *
 * @example
 * <SelectionCard
 *   selected={isSelected}
 *   onPress={() => setSelected(true)}
 *   icon="heart-outline"
 *   label="Opção 1"
 *   subtitle="Descrição curta"
 *   variant="large"
 * />
 */

import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Tokens } from "@/theme/tokens";

// ===========================================
// TYPES
// ===========================================

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export type SelectionCardVariant = "large" | "compact" | "chip";

export interface SelectionCardProps {
  /** Whether the card is selected */
  selected: boolean;
  /** Callback when card is pressed */
  onPress: () => void;
  /** Icon name from Ionicons */
  icon?: IoniconName;
  /** Emoji to display instead of icon */
  emoji?: string;
  /** Primary label text */
  label: string;
  /** Secondary subtitle text (not shown in chip variant) */
  subtitle?: string;
  /** Card variant */
  variant?: SelectionCardVariant;
  /** Whether card is disabled */
  disabled?: boolean;
  /** Additional style */
  style?: ViewStyle;
  /** Test ID for e2e testing */
  testID?: string;
}

// ===========================================
// CONSTANTS
// ===========================================

const GLASS = Tokens.premium.glass;

const ICON_SIZES: Record<SelectionCardVariant, number> = {
  large: 28,
  compact: 24,
  chip: 18,
};

const CONTAINER_SIZES: Record<SelectionCardVariant, { width: number; height: number }> = {
  large: { width: 48, height: 48 },
  compact: { width: 40, height: 40 },
  chip: { width: 32, height: 32 },
};

// ===========================================
// COMPONENT
// ===========================================

export const SelectionCard = React.memo(function SelectionCard({
  selected,
  onPress,
  icon,
  emoji,
  label,
  subtitle,
  variant = "large",
  disabled = false,
  style,
  testID,
}: SelectionCardProps) {
  // Animation values
  const scale = useSharedValue(1);
  const glow = useSharedValue(selected ? 1 : 0);

  // Animate glow on selection change
  useEffect(() => {
    glow.value = withSpring(selected ? 1 : 0, { damping: 15 });
  }, [selected, glow]);

  // Scale animation style
  const scaleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Glow animation style
  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0, 0.5]),
    transform: [{ scale: interpolate(glow.value, [0, 1], [0.85, 1.08]) }],
  }));

  const handlePress = useCallback(() => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    // Bounce animation
    scale.value = withSequence(withTiming(0.95, { duration: 80 }), withSpring(1, { damping: 12 }));

    onPress();
  }, [disabled, onPress, scale]);

  // Get variant-specific styles
  const containerStyles = getContainerStyles(variant, selected);
  const iconContainerSize = CONTAINER_SIZES[variant];
  const iconSize = ICON_SIZES[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${label}. ${subtitle}` : label}
      accessibilityHint={selected ? "Selecionado. Toque para desmarcar" : "Toque para selecionar"}
      accessibilityState={{ selected, disabled }}
      testID={testID}
    >
      <Animated.View style={[scaleAnimatedStyle, style]}>
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            glowAnimatedStyle,
            { borderRadius: (containerStyles.borderRadius as number) + 4 },
          ]}
        />

        {/* Card content */}
        <View style={[styles.card, containerStyles, disabled && styles.cardDisabled]}>
          {/* Icon/Emoji container */}
          {(icon || emoji) && (
            <View
              style={[
                styles.iconContainer,
                {
                  width: iconContainerSize.width,
                  height: iconContainerSize.height,
                  borderRadius: iconContainerSize.width / 4,
                },
              ]}
            >
              {emoji ? (
                <Text style={[styles.emoji, { fontSize: iconSize }]}>{emoji}</Text>
              ) : icon ? (
                <Ionicons
                  name={icon}
                  size={iconSize}
                  color={selected ? Tokens.brand.accent[400] : Tokens.neutral[700]}
                />
              ) : null}
            </View>
          )}

          {/* Text content */}
          <View style={variant === "chip" ? styles.contentChip : styles.content}>
            <Text
              style={[styles.label, getLabelStyle(variant), selected && styles.labelSelected]}
              numberOfLines={variant === "chip" ? 1 : 2}
            >
              {label}
            </Text>

            {subtitle && variant !== "chip" && (
              <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Checkmark for selected state */}
          {selected && variant !== "chip" && (
            <View style={styles.checkmark}>
              <Ionicons name="checkmark" size={16} color={Tokens.neutral[0]} />
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
});

// ===========================================
// STYLE HELPERS
// ===========================================

function getContainerStyles(variant: SelectionCardVariant, selected: boolean): ViewStyle {
  const base: ViewStyle = {
    flexDirection: variant === "chip" ? "row" : "row",
    alignItems: "center",
    backgroundColor: selected ? Tokens.brand.accent[50] : GLASS.light,
    borderWidth: 2,
    borderColor: selected ? Tokens.brand.accent[400] : "transparent",
  };

  switch (variant) {
    case "large":
      return {
        ...base,
        padding: Tokens.spacing.lg,
        borderRadius: Tokens.radius["2xl"],
        minHeight: 80,
      };
    case "compact":
      return {
        ...base,
        padding: Tokens.spacing.md,
        borderRadius: Tokens.radius.xl,
        minHeight: 64,
      };
    case "chip":
      return {
        ...base,
        paddingVertical: Tokens.spacing.sm,
        paddingHorizontal: Tokens.spacing.md,
        borderRadius: Tokens.radius.full,
        minHeight: Tokens.accessibility.minTapTarget,
      };
  }
}

function getLabelStyle(variant: SelectionCardVariant) {
  switch (variant) {
    case "large":
      return styles.labelLarge;
    case "compact":
      return styles.labelCompact;
    case "chip":
      return styles.labelChip;
  }
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: Tokens.brand.accent[400],
  },
  card: {
    position: "relative",
    zIndex: 1,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    backgroundColor: Tokens.neutral[100],
    alignItems: "center",
    justifyContent: "center",
    marginRight: Tokens.spacing.md,
  },
  emoji: {
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  contentChip: {
    flex: 0,
  },
  label: {
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontWeight: "600",
    color: Tokens.neutral[800],
  },
  labelLarge: {
    fontSize: 17,
    lineHeight: 22,
  },
  labelCompact: {
    fontSize: 15,
    lineHeight: 20,
  },
  labelChip: {
    fontSize: 14,
    lineHeight: 18,
  },
  labelSelected: {
    color: Tokens.brand.accent[600],
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Tokens.typography.fontFamily.base,
    fontWeight: "400",
    color: Tokens.neutral[500],
    marginTop: 2,
    lineHeight: 18,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Tokens.brand.accent[500],
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Tokens.spacing.sm,
  },
});

// ===========================================
// EXPORTS
// ===========================================

export default SelectionCard;
