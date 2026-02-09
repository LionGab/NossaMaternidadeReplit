/**
 * FloatingOrb - Atmospheric floating orb effect for premium screens
 */

import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
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
import { useOptimizedAnimation } from "../../hooks/useOptimizedAnimation";

interface FloatingOrbProps {
  size: number;
  color: string;
  initialX: number;
  initialY: number;
  delay: number;
}

export const FloatingOrb: React.FC<FloatingOrbProps> = React.memo(
  ({ size, color, initialX, initialY, delay }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.5);
    const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

    useEffect(() => {
      if (!shouldAnimate || !isActive) {
        cancelAnimation(translateY);
        cancelAnimation(opacity);
        translateY.value = 0;
        opacity.value = 0.5;
        return;
      }

      translateY.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-30, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
          ),
          maxIterations,
          true
        )
      );

      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(withTiming(0.8, { duration: 3000 }), withTiming(0.4, { duration: 3000 })),
          maxIterations,
          true
        )
      );

      return () => {
        cancelAnimation(translateY);
        cancelAnimation(opacity);
      };
    }, [translateY, opacity, delay, shouldAnimate, isActive, maxIterations]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    }));

    return (
      <Animated.View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            left: initialX,
            top: initialY,
          },
          animatedStyle,
        ]}
      />
    );
  }
);

FloatingOrb.displayName = "FloatingOrb";

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
  },
});
