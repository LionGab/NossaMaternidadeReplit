/**
 * ProgressRing - Ultra-Clean Progress Indicator (Flo + I Am inspired)
 *
 * Design Philosophy:
 * - Light blue gradient
 * - Smooth spring animation
 * - Clean, minimal appearance
 *
 * @version 5.0 - Clean Redesign
 */

import React, { useEffect } from "react";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { brand, neutral, animation } from "../../theme/tokens";

// Create animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  isDark: boolean;
  /** Delay before animation starts (ms) */
  animationDelay?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = React.memo(
  ({ progress, size, strokeWidth, isDark, animationDelay = 300 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Rosa accent quando completo (100%) - Flo-like celebration
    const isComplete = progress >= 1;

    // Animated progress value
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
      // Animate to target progress with spring physics
      animatedProgress.value = withDelay(
        animationDelay,
        withSpring(progress, {
          damping: animation.easing.spring.damping,
          stiffness: animation.easing.spring.stiffness,
        })
      );
    }, [progress, animatedProgress, animationDelay]);

    // Animated props for the progress circle
    const animatedProps = useAnimatedProps(() => {
      const strokeDashoffset = circumference * (1 - animatedProgress.value);
      return {
        strokeDashoffset,
      };
    });

    return (
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
        accessibilityLabel={`${Math.round(progress * 100)}% completo`}
        accessibilityRole="progressbar"
      >
        <Defs>
          {/* Rosa accent gradient when complete, blue otherwise - Flo-like */}
          <SvgGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={isComplete ? brand.accent[400] : brand.primary[400]} />
            <Stop offset="100%" stopColor={isComplete ? brand.accent[500] : brand.primary[500]} />
          </SvgGradient>
        </Defs>
        {/* Background circle - rosa when complete, blue otherwise */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? neutral[700] : isComplete ? brand.accent[100] : brand.primary[100]}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>
    );
  }
);

ProgressRing.displayName = "ProgressRing";
