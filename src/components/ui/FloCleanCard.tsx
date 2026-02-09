/**
 * FloCleanCard - Card branco com sombra rosada sutil
 * Estilo Flo Clean: cantos arredondados, bordas suaves, sombras rosadas
 */

import React, { ReactNode } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { cn } from "../../utils/cn";

interface FloCleanCardProps {
  children: ReactNode;
  onPress?: () => void;
  padding?: "sm" | "md" | "lg";
  className?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const paddingClasses = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function FloCleanCard({
  children,
  onPress,
  padding = "md",
  className,
  style,
  accessibilityLabel,
}: FloCleanCardProps) {
  const { preset, border } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
      opacity.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const cardStyle: ViewStyle = {
    backgroundColor: preset.surface.card,
    borderColor: border.subtle,
    borderWidth: 1,
    ...Tokens.shadows.floClean.card,
  };

  const content = (
    <View
      className={cn("rounded-3xl", paddingClasses[padding], className)}
      style={[cardStyle, style]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
}
