/**
 * PremiumBadge - Animated crown/diamond badge for premium screens
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { Tokens, premium } from "../../theme/tokens";
import { useOptimizedAnimation } from "../../hooks/useOptimizedAnimation";

interface PremiumBadgeProps {
  goldColor?: string;
  accentColor?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = React.memo(
  ({ goldColor = premium.special.gold, accentColor = premium.text.accent }) => {
    const scale = useSharedValue(1);
    const rotate = useSharedValue(0);
    const glow = useSharedValue(0);
    const float = useSharedValue(0);
    const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

    useEffect(() => {
      if (!shouldAnimate || !isActive) {
        cancelAnimation(scale);
        cancelAnimation(rotate);
        cancelAnimation(glow);
        cancelAnimation(float);
        scale.value = 1;
        rotate.value = 0;
        glow.value = 0;
        float.value = 0;
        return;
      }

      // Gentle pulse
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        maxIterations,
        true
      );

      // Subtle rotation
      rotate.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        maxIterations,
        true
      );

      // Glow pulse
      glow.value = withRepeat(
        withSequence(withTiming(1, { duration: 1200 }), withTiming(0.5, { duration: 1200 })),
        maxIterations,
        true
      );

      // Float animation - premium levitating effect
      float.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        maxIterations,
        true
      );

      return () => {
        cancelAnimation(scale);
        cancelAnimation(rotate);
        cancelAnimation(glow);
        cancelAnimation(float);
      };
    }, [scale, rotate, glow, float, shouldAnimate, isActive, maxIterations]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: float.value },
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
      shadowOpacity: interpolate(glow.value, [0, 1], [0.3, 0.8]),
      shadowRadius: interpolate(glow.value, [0, 1], [20, 40]),
    }));

    return (
      <Animated.View style={[styles.badgeContainer, glowStyle]}>
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={[goldColor, Tokens.semantic.light.warning, Tokens.premium.special.goldDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
          >
            <Ionicons name="diamond" size={40} color={Tokens.neutral[50]} />
          </LinearGradient>
        </Animated.View>

        {/* Sparkle effects */}
        <View style={[styles.sparkle, { top: -8, right: -8 }]}>
          <Ionicons name="sparkles" size={16} color={goldColor} />
        </View>
        <View style={[styles.sparkle, { bottom: -4, left: -8 }]}>
          <Ionicons name="star" size={12} color={accentColor} />
        </View>
      </Animated.View>
    );
  }
);

PremiumBadge.displayName = "PremiumBadge";

const styles = StyleSheet.create({
  badgeContainer: {
    shadowColor: premium.special.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 24,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    position: "absolute",
  },
});
