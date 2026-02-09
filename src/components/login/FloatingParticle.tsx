/**
 * FloatingParticle - Atmospheric particle effect for login screens
 */

import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { Tokens } from "../../theme/tokens";
import { useOptimizedAnimation } from "../../hooks/useOptimizedAnimation";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

export const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT * 0.6,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.6 + 0.2,
    delay: Math.random() * 2000,
  }));
};

interface FloatingParticleProps {
  particle: Particle;
}

export const FloatingParticle: React.FC<FloatingParticleProps> = React.memo(({ particle }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(particle.opacity);
  const scale = useSharedValue(1);
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

  useEffect(() => {
    if (!shouldAnimate || !isActive) {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      cancelAnimation(scale);
      translateY.value = 0;
      opacity.value = particle.opacity;
      scale.value = 1;
      return;
    }

    // Gentle floating animation
    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        maxIterations,
        true
      )
    );

    // Gentle pulsing
    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(particle.opacity * 1.5, { duration: 2000 }),
          withTiming(particle.opacity * 0.5, { duration: 2000 })
        ),
        maxIterations,
        true
      )
    );

    // Subtle scale
    scale.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(withTiming(1.2, { duration: 2500 }), withTiming(0.8, { duration: 2500 })),
        maxIterations,
        true
      )
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      cancelAnimation(scale);
    };
  }, [translateY, opacity, scale, particle, shouldAnimate, isActive, maxIterations]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
        },
        animatedStyle,
      ]}
    />
  );
});

FloatingParticle.displayName = "FloatingParticle";

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    backgroundColor: Tokens.neutral[0],
    borderRadius: 100,
  },
});
