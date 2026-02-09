/**
 * @file EmotionalStateCard.tsx
 * @description Card componentizado e otimizado para seleção de estado emocional
 *
 * Melhorias vs versão anterior:
 * - Feedback visual mais rico (pulse subtle ao selecionar)
 * - Mensagem de encorajamento context-aware
 * - Melhor separação de concerns
 * - Memoização para performance
 */

import { Tokens } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// ===========================================
// TYPES
// ===========================================

export interface EmotionalStateCardProps {
  /** Ionicon name */
  icon: string;
  /** Card title (ex: "Bem, em equilíbrio") */
  title: string;
  /** Selection state */
  isSelected: boolean;
  /** Press handler */
  onPress: () => void;
  /** Index for staggered animation */
  index: number;
  /** Card width (responsive) */
  width?: number;
  /** Optional test ID */
  testID?: string;
}

// ===========================================
// COMPONENT
// ===========================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const EmotionalStateCard = React.memo<EmotionalStateCardProps>(
  ({ icon, title, isSelected, onPress, index, width, testID }) => {
    // Animated values
    const scale = useSharedValue(1);
    const iconScale = useSharedValue(1);
    const borderWidth = useSharedValue(2);

    // Press handlers with enhanced feedback
    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }, [scale]);

    const handlePress = useCallback(() => {
      // Haptic feedback diferenciado por plataforma
      Haptics.impactAsync(
        isSelected ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium
      ).catch(() => {});

      // Animação de "celebração" sutil ao selecionar
      if (!isSelected) {
        iconScale.value = withSequence(
          withTiming(1.2, { duration: 150 }),
          withSpring(1, { damping: 10, stiffness: 200 })
        );
        borderWidth.value = withTiming(2.5, { duration: 200 });
      } else {
        borderWidth.value = withTiming(2, { duration: 200 });
      }

      onPress();
    }, [isSelected, onPress, iconScale, borderWidth]);

    // Animated styles
    const cardAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const iconAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: iconScale.value }],
    }));

    const borderAnimatedStyle = useAnimatedStyle(() => ({
      borderWidth: borderWidth.value,
    }));

    // Accessibility label dinâmico
    const accessibilityLabel = useMemo(
      () => `${title}${isSelected ? ", selecionado" : ""}`,
      [title, isSelected]
    );

    return (
      <Animated.View
        entering={FadeInDown.delay(100 + index * 60)
          .duration(400)
          .springify()}
        style={[styles.cardWrapper, width && { width }]}
      >
        <AnimatedPressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[cardAnimatedStyle]}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="radio"
          accessibilityState={{ selected: isSelected, checked: isSelected }}
          accessibilityHint="Toque para selecionar como você está se sentindo"
          testID={testID}
        >
          <Animated.View
            style={[styles.card, borderAnimatedStyle, isSelected && styles.cardSelected]}
          >
            {/* Icon Container with subtle animation */}
            <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
              <Animated.View style={iconAnimatedStyle}>
                <Ionicons
                  name={icon as React.ComponentProps<typeof Ionicons>["name"]}
                  size={28}
                  color={isSelected ? Tokens.brand.accent[500] : Tokens.neutral[500]}
                />
              </Animated.View>
            </View>

            {/* Title with better typographic hierarchy */}
            <Text
              style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.9}
            >
              {title}
            </Text>

            {/* Checkmark with celebratory animation */}
            {isSelected && (
              <Animated.View entering={FadeIn.duration(200)} style={styles.checkmark}>
                <View style={styles.checkmarkCircle}>
                  <Ionicons name="checkmark" size={14} color={Tokens.neutral[0]} />
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </AnimatedPressable>
      </Animated.View>
    );
  }
);

EmotionalStateCard.displayName = "EmotionalStateCard";

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  cardWrapper: {
    // width set dynamically
  },
  card: {
    backgroundColor: Tokens.neutral[0],
    borderRadius: Tokens.radius["2xl"],
    padding: Tokens.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    borderWidth: 2,
    borderColor: Tokens.neutral[100],
    ...Tokens.shadows.flo.soft,
  },
  cardSelected: {
    borderColor: Tokens.brand.accent[400],
    backgroundColor: Tokens.brand.accent[50],
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: Tokens.radius.full,
    backgroundColor: Tokens.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Tokens.spacing.lg,
  },
  iconContainerSelected: {
    backgroundColor: Tokens.brand.accent[100],
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontWeight: "600",
    color: Tokens.neutral[700],
    textAlign: "center",
    lineHeight: 22,
  },
  cardTitleSelected: {
    color: Tokens.brand.accent[700],
    fontWeight: "700",
  },
  checkmark: {
    position: "absolute",
    top: Tokens.spacing.md,
    right: Tokens.spacing.md,
  },
  checkmarkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Tokens.brand.accent[500],
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.md,
  },
});
