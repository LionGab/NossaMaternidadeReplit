/**
 * NathProgressBar Component
 * Barra de progresso animada para tracking de hábitos
 * Inspirado no design Nathia
 */

import { Tokens, radius } from "@/theme/tokens";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Cores do design Nathia
const nathColors = {
  rosa: {
    DEFAULT: Tokens.brand.accent[300],
    hover: Tokens.brand.accent[400],
  },
  azul: {
    DEFAULT: Tokens.brand.primary[200],
    dark: Tokens.brand.primary[300],
  },
  verde: {
    DEFAULT: Tokens.brand.teal[200],
    dark: Tokens.brand.teal[300],
  },
  laranja: {
    DEFAULT: Tokens.maternal.warmth.peach,
    dark: Tokens.brand.accent[300],
  },
  border: Tokens.neutral[200],
} as const;

type ProgressColor = "rosa" | "azul" | "verde" | "laranja" | "gradient";

interface NathProgressBarProps {
  progress: number; // 0 to 100
  color?: ProgressColor;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

const gradientMap: Record<ProgressColor, readonly [string, string]> = {
  rosa: [nathColors.rosa.DEFAULT, nathColors.rosa.hover] as const,
  azul: [nathColors.azul.DEFAULT, nathColors.azul.dark] as const,
  verde: [nathColors.verde.DEFAULT, nathColors.verde.dark] as const,
  laranja: [nathColors.laranja.DEFAULT, nathColors.laranja.dark] as const,
  gradient: [nathColors.rosa.DEFAULT, nathColors.azul.DEFAULT] as const,
};

export const NathProgressBar: React.FC<NathProgressBarProps> = ({
  progress,
  color = "rosa",
  height = 8,
  animated = true,
  style,
}) => {
  const progressValue = useSharedValue(0);

  useEffect(() => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    if (animated) {
      progressValue.value = withTiming(clampedProgress, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      progressValue.value = clampedProgress;
    }
  }, [progress, animated, progressValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  const gradientColors = gradientMap[color];

  return (
    <View style={[styles.container, { height }, style]}>
      <Animated.View style={[styles.progressWrapper, animatedStyle]}>
        <LinearGradient
          colors={gradientColors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progress, { borderRadius: height / 2 }]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: nathColors.border,
    borderRadius: radius.full,
    overflow: "hidden",
  },

  progressWrapper: {
    height: "100%",
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    width: "100%",
  },
});

export default NathProgressBar;
