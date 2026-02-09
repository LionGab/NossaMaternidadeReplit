/**
 * CTAButton - Animated call-to-action button for premium screens
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  interpolate,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { premium, typography, overlay } from "../../theme/tokens";
import { useOptimizedAnimation } from "../../hooks/useOptimizedAnimation";

interface CTAButtonProps {
  label: string;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}

export const CTAButton: React.FC<CTAButtonProps> = React.memo(
  ({ label, onPress, loading, disabled }) => {
    const scale = useSharedValue(1);
    const glow = useSharedValue(0);
    const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

    useEffect(() => {
      if (!disabled && shouldAnimate && isActive) {
        glow.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          maxIterations,
          true
        );
      } else {
        cancelAnimation(glow);
        glow.value = 0;
      }
      return () => cancelAnimation(glow);
    }, [disabled, glow, shouldAnimate, isActive, maxIterations]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
      shadowOpacity: interpolate(glow.value, [0, 1], [0.3, 0.6]),
      shadowRadius: interpolate(glow.value, [0, 1], [12, 24]),
    }));

    const handlePress = async () => {
      if (disabled) return;
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scale.value = withSequence(
        withTiming(0.97, { duration: 80 }),
        withSpring(1, { damping: 12 })
      );
      onPress();
    };

    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || loading }}
      >
        <Animated.View style={[styles.ctaShadow, !disabled && glowStyle]}>
          <Animated.View style={animatedStyle}>
            <LinearGradient
              colors={
                disabled
                  ? [overlay.lightInvertedMedium, overlay.lightInverted]
                  : [premium.cta.start, premium.cta.end]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaButton}
            >
              {loading ? (
                <ActivityIndicator color={premium.text.primary} size="small" />
              ) : (
                <>
                  <Text style={[styles.ctaText, disabled && styles.ctaTextDisabled]}>{label}</Text>
                  <View style={styles.ctaArrow}>
                    <Ionicons name="arrow-forward" size={18} color={premium.text.primary} />
                  </View>
                </>
              )}
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </Pressable>
    );
  }
);

CTAButton.displayName = "CTAButton";

const styles = StyleSheet.create({
  ctaShadow: {
    shadowColor: premium.cta.start,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderRadius: 18,
  },
  ctaButton: {
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 24,
  },
  ctaText: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: premium.text.primary,
    letterSpacing: 0.3,
  },
  ctaTextDisabled: {
    color: premium.text.muted,
  },
  ctaArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: premium.glass.strong,
    alignItems: "center",
    justifyContent: "center",
  },
});
