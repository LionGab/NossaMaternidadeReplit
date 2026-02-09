import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";

interface GradientBackgroundProps {
  children?: ReactNode;
  style?: ViewStyle;
  variant?: "screen" | "card" | "clean" | "maternal" | "flo";
  withSafeAreaPadding?: boolean;
  animated?: boolean;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function GradientBackground({
  children,
  style,
  variant = "screen",
  withSafeAreaPadding = false,
  animated = false,
}: GradientBackgroundProps) {
  const insets = useSafeAreaInsets();
  const { gradients } = useTheme();

  const gradientConfig = {
    screen: {
      colors: [Tokens.brand.primary[50], Tokens.neutral[0], Tokens.brand.secondary[50]] as const,
      locations: [0, 0.4, 1] as const,
    },
    card: {
      colors: [Tokens.brand.primary[100], Tokens.neutral[0], Tokens.brand.secondary[100]] as const,
      locations: [0, 0.5, 1] as const,
    },
    clean: {
      colors: [Tokens.neutral[0], Tokens.brand.secondary[50]] as const,
      locations: [0, 1] as const,
    },
    maternal: {
      colors: [Tokens.brand.accent[50], Tokens.neutral[0], Tokens.brand.secondary[100]] as const,
      locations: [0, 0.4, 1] as const,
    },
    // Flo Clean: pink pastel gradient (uses preset.gradients.screen)
    flo: {
      // Garantir que sempre temos 2 cores para 2 locations
      colors: (Array.isArray(gradients.screen) && gradients.screen.length >= 2
        ? [gradients.screen[0], gradients.screen[1]]
        : [Tokens.brand.primary[50], Tokens.brand.secondary[50]]) as readonly [string, string],
      locations: [0, 1] as const,
    },
  };

  const config = gradientConfig[variant];
  const GradientComponent = animated ? AnimatedLinearGradient : LinearGradient;
  const animationProps = animated ? { entering: FadeIn.duration(600) } : {};

  return (
    <GradientComponent
      colors={config.colors}
      locations={config.locations}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        withSafeAreaPadding ? { paddingTop: insets.top, paddingBottom: insets.bottom } : undefined,
        style,
      ]}
      {...animationProps}
    >
      {children}
    </GradientComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
