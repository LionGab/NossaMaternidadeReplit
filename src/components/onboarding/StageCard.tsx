/**
 * StageCard V2 - Premium Glassmorphism Card
 *
 * Design atualizado com:
 * - Ilustrações SVG animadas (não mais ícones genéricos)
 * - Glassmorphism background
 * - Glow effect premium quando selecionado
 * - Micro-animações suaves
 * - Haptic feedback rico
 *
 * @example
 * ```tsx
 * <StageCard data={stageData} isSelected={true} onPress={handleSelect} />
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Tokens } from "@/theme/tokens";
import { StageCardData } from "@/types/nath-journey-onboarding.types";
import { StageIllustration } from "./illustrations/StageIllustrations";

// ===========================================
// TYPES
// ===========================================

interface StageCardProps {
  data: StageCardData;
  isSelected: boolean;
  onPress: () => void;
}

// ===========================================
// CONSTANTS
// ===========================================

const COLORS = {
  white: Tokens.neutral[0],
  glassWhite: "rgba(255, 255, 255, 0.9)",
  glassBorder: "rgba(255, 255, 255, 0.6)",
  selectedBorder: Tokens.brand.accent[400],
  selectedGlow: Tokens.brand.accent[200],
  checkGradient: [Tokens.brand.accent[400], Tokens.brand.accent[500]] as const,
  gold: Tokens.premium.special.gold,
} as const;

// ===========================================
// COMPONENT
// ===========================================

function StageCardComponent({ data, isSelected, onPress }: StageCardProps) {
  const theme = useTheme();

  // Animation values
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const borderWidth = useSharedValue(1);
  const checkScale = useSharedValue(0);
  const illustrationScale = useSharedValue(1);

  // Update animations on selection change
  useEffect(() => {
    if (isSelected) {
      glowOpacity.value = withSpring(0.6, { damping: 15 });
      borderWidth.value = withSpring(2.5, { damping: 20 });
      checkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      illustrationScale.value = withSequence(
        withTiming(1.1, { duration: 150 }),
        withSpring(1.05, { damping: 10, stiffness: 200 })
      );
    } else {
      glowOpacity.value = withTiming(0, { duration: 200 });
      borderWidth.value = withSpring(1, { damping: 20 });
      checkScale.value = withSpring(0, { damping: 12, stiffness: 200 });
      illustrationScale.value = withSpring(1, { damping: 15 });
    }
  }, [isSelected, glowOpacity, borderWidth, checkScale, illustrationScale]);

  // Press handlers
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (!isSelected) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    onPress();
  }, [isSelected, onPress]);

  // Animated styles
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderWidth: borderWidth.value,
    borderColor: interpolateColor(
      borderWidth.value,
      [1, 2.5],
      [COLORS.glassBorder, COLORS.selectedBorder]
    ),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const illustrationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: illustrationScale.value }],
  }));

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressable}
      accessibilityLabel={`${data.title}. ${data.quote}. ${isSelected ? "Selecionado" : "Não selecionado"}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Animated.View style={[styles.card, cardStyle, borderStyle]}>
        {/* Outer Glow Effect */}
        <Animated.View style={[styles.glowContainer, glowStyle]} pointerEvents="none">
          <LinearGradient
            colors={[`${COLORS.selectedGlow}40`, "transparent"]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </Animated.View>

        {/* Illustration Section */}
        <View style={styles.illustrationSection}>
          <LinearGradient
            colors={[data.gradient[0], data.gradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          />

          {/* SVG Illustration */}
          <Animated.View style={[styles.illustrationWrapper, illustrationStyle]}>
            <StageIllustration stage={data.stage} size={70} animated={isSelected} />
          </Animated.View>

          {/* Checkmark Badge */}
          <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
            <LinearGradient colors={COLORS.checkGradient} style={styles.checkmarkBadge}>
              <Ionicons name="checkmark" size={16} color={COLORS.white} />
            </LinearGradient>
          </Animated.View>

          {/* Sparkle when selected */}
          {isSelected && (
            <View style={styles.sparkleContainer} pointerEvents="none">
              <View style={[styles.sparkle, { top: 15, right: 35 }]} />
              <View style={[styles.sparkle, { bottom: 20, left: 25, width: 4, height: 4 }]} />
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={[styles.contentSection, { backgroundColor: theme.surface.card }]}>
          {/* Glass overlay for premium feel */}
          {Platform.OS === "ios" && (
            <BlurView intensity={20} tint="light" style={styles.glassOverlay} />
          )}

          <Text
            style={[styles.title, { color: theme.text.primary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {data.title}
          </Text>

          <Text style={[styles.quote, { color: theme.text.secondary }]} numberOfLines={2}>
            "{data.quote}"
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const StageCard = memo(StageCardComponent);

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    minHeight: 44,
  },
  card: {
    flex: 1,
    height: 220,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: COLORS.glassWhite,
    ...Tokens.shadows.md,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  illustrationSection: {
    height: 130,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  illustrationWrapper: {
    zIndex: 1,
  },
  checkmarkContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
  },
  checkmarkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    ...Tokens.shadows.sm,
  },
  sparkleContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  sparkle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
    opacity: 0.8,
  },
  contentSection: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    gap: 4,
    position: "relative",
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
  quote: {
    fontSize: 12,
    fontStyle: "italic",
    lineHeight: 16,
    opacity: 0.85,
  },
});
