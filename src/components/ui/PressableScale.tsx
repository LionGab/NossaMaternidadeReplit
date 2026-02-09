/**
 * PressableScale - Componente Universal de Press Animado
 *
 * Adiciona feel premium a qualquer elemento pressionável:
 * - Animação de escala suave no press
 * - Feedback háptico configurável
 * - Spring animation com rebound natural
 *
 * @example
 * ```tsx
 * <PressableScale onPress={handleTap}>
 *   <Card>...</Card>
 * </PressableScale>
 *
 * <PressableScale onPress={handleTap} scale={0.95} haptic="medium">
 *   <Button>Tap me</Button>
 * </PressableScale>
 * ```
 */

import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { Pressable, PressableProps, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

// Spring configs para diferentes feels
const SPRING_CONFIGS = {
  // Suave e elegante - padrão
  gentle: { damping: 15, stiffness: 150, mass: 1 },
  // Rápido e responsivo
  snappy: { damping: 12, stiffness: 200, mass: 0.8 },
  // Divertido com bounce
  bouncy: { damping: 8, stiffness: 180, mass: 1 },
} as const;

type HapticType = "none" | "light" | "medium" | "heavy" | "selection" | "success" | "error";
type SpringType = keyof typeof SPRING_CONFIGS;

interface PressableScaleProps extends Omit<PressableProps, "style"> {
  /** Escala quando pressionado (0-1). Padrão: 0.97 */
  scale?: number;
  /** Tipo de feedback háptico. Padrão: "light" */
  haptic?: HapticType;
  /** Tipo de animação spring. Padrão: "gentle" */
  spring?: SpringType;
  /** Estilos do container */
  style?: ViewStyle;
  /** Conteúdo */
  children: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({
  children,
  onPress,
  onPressIn,
  onPressOut,
  scale = 0.97,
  haptic = "light",
  spring = "gentle",
  disabled,
  style,
  ...props
}: PressableScaleProps) {
  const scaleValue = useSharedValue(1);
  const springConfig = SPRING_CONFIGS[spring];

  // Trigger haptic feedback
  const triggerHaptic = useCallback(async () => {
    if (haptic === "none" || disabled) return;

    try {
      switch (haptic) {
        case "light":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "medium":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "heavy":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case "selection":
          await Haptics.selectionAsync();
          break;
        case "success":
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case "error":
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch {
      // Haptics não disponível (web, simulador antigo)
    }
  }, [haptic, disabled]);

  // Handlers
  const handlePressIn = useCallback(
    (event: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]) => {
      scaleValue.value = withSpring(scale, springConfig);
      triggerHaptic();
      onPressIn?.(event);
    },
    [scale, springConfig, triggerHaptic, onPressIn, scaleValue]
  );

  const handlePressOut = useCallback(
    (event: Parameters<NonNullable<PressableProps["onPressOut"]>>[0]) => {
      scaleValue.value = withSpring(1, springConfig);
      onPressOut?.(event);
    },
    [springConfig, onPressOut, scaleValue]
  );

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}

export default PressableScale;
