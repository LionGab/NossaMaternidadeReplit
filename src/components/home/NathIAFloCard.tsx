/**
 * NathIAFloCard - Flo-inspired NathIA Chat Card
 *
 * Gradient card with chat icon for quick NathIA access.
 * More compact and visually appealing than standard hero card.
 *
 * @version 1.0 - Flo Clean Design
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import {
  accessibility,
  brand,
  neutral,
  overlay,
  premium,
  radius,
  shadows,
  spacing,
  typography,
} from "../../theme/tokens";

interface NathIAFloCardProps {
  onPress: () => void;
}

export const NathIAFloCard: React.FC<NathIAFloCardProps> = React.memo(({ onPress }) => {
  const { isDark } = useTheme();

  const handlePress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [onPress]);

  // Gradient colors - purple to pink (Flo-inspired)
  const gradientColors = isDark
    ? ([brand.secondary[700], brand.accent[700], brand.accent[600]] as const)
    : ([brand.secondary[500], brand.accent[400], brand.accent[500]] as const);

  return (
    <Animated.View entering={FadeInUp.delay(150).duration(500)}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          shadows.flo.elevated,
          {
            opacity: pressed ? 0.95 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        accessibilityLabel="Falar com a NathIA"
        accessibilityRole="button"
        accessibilityHint="Toque para iniciar uma conversa com sua assistente"
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.content}>
          {/* Icon container */}
          <View style={styles.iconContainer}>
            <View style={styles.iconInner}>
              <Ionicons name="chatbubble-ellipses" size={24} color={brand.secondary[500]} />
            </View>
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Falar com a Nath</Text>
              <Ionicons name="sparkles" size={16} color={premium.special.gold} />
            </View>
            <Text style={styles.subtitle}>Tire dúvidas, desabafe, peça dicas</Text>
          </View>

          {/* Arrow */}
          <Ionicons name="arrow-forward" size={24} color={neutral[0]} />
        </View>
      </Pressable>
    </Animated.View>
  );
});

NathIAFloCard.displayName = "NathIAFloCard";

const styles = StyleSheet.create({
  card: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
    minHeight: accessibility.minTapTarget,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: overlay.lightInvertedMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  iconInner: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: neutral[0],
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.titleLarge.fontSize,
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
    color: neutral[0],
  },
  subtitle: {
    fontSize: typography.bodySmall.fontSize,
    fontFamily: typography.fontFamily.base,
    color: premium.text.secondary,
  },
});
