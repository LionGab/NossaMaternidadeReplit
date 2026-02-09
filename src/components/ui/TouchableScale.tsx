/**
 * TouchableScale - Wrapper Pressable com animação de scale
 *
 * Componente reutilizável para adicionar feedback de scale
 * ao pressionar elementos interativos.
 *
 * Design System:
 * - Usa Pressable comum + Animated.View interno (não AnimatedPressable)
 * - className no Pressable para layout/positioning
 * - contentClassName no Animated.View para estilização do conteúdo
 * - Spring animation com damping/stiffness otimizado para UI
 *
 * @example
 * ```tsx
 * <TouchableScale
 *   onPress={handlePress}
 *   containerClassName="min-h-[44px] min-w-[44px] items-center justify-center"
 *   contentClassName="flex-row items-center gap-2"
 * >
 *   <Icon name="heart" />
 *   <Text>Favoritar</Text>
 * </TouchableScale>
 * ```
 */

import React, { useCallback } from "react";
import { Pressable, type PressableProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type TouchableScaleProps = Omit<PressableProps, "onPressIn" | "onPressOut"> & {
  /** Conteúdo a ser renderizado */
  children: React.ReactNode;

  /** Valor de scale ao pressionar (default: 0.96) */
  scaleTo?: number;

  /** className para o Pressable container */
  containerClassName?: string;

  /** className para o Animated.View interno */
  contentClassName?: string;

  /** Callback onPressIn customizado */
  onPressIn?: (event: unknown) => void;

  /** Callback onPressOut customizado */
  onPressOut?: (event: unknown) => void;
};

/**
 * Wrapper com animação de scale para feedback tátil
 *
 * IMPORTANTE:
 * - Sempre use min-h-[44px] min-w-[44px] no containerClassName
 *   para elementos interativos (WCAG AAA)
 * - scaleTo recomendado: 0.94-0.98 (bounce sutil)
 * - Combine com haptic feedback para experiência premium
 */
export function TouchableScale({
  children,
  scaleTo = 0.96,
  containerClassName,
  contentClassName,
  onPressIn,
  onPressOut,
  ...rest
}: TouchableScaleProps): React.JSX.Element {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(
    (e: unknown) => {
      // Spring snappy para feedback imediato
      scale.value = withSpring(scaleTo, {
        damping: 14,
        stiffness: 260,
      });

      onPressIn?.(e);
    },
    [onPressIn, scale, scaleTo]
  );

  const handlePressOut = useCallback(
    (e: unknown) => {
      // Rebound com mesma física
      scale.value = withSpring(1, {
        damping: 14,
        stiffness: 260,
      });

      onPressOut?.(e);
    },
    [onPressOut, scale]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={containerClassName}
    >
      <Animated.View style={animatedStyle} className={contentClassName}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
