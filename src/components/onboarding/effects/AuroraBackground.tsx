/**
 * AuroraBackground - Premium Animated Background
 *
 * Conceito: "Aurora Maternal"
 * Background animado que simula aurora boreal com cores maternais.
 * Cores transitam suavemente: rosa → lavanda → dourado → rosa
 *
 * Features:
 * - Animação de gradiente fluido
 * - Partículas de luz flutuantes
 * - Ondas de luz suaves
 * - Respeita prefers-reduced-motion
 * - Performance otimizada com Reanimated worklets
 *
 * @example
 * ```tsx
 * <AuroraBackground intensity="high">
 *   <YourContent />
 * </AuroraBackground>
 * ```
 */

import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useOptimizedAnimation } from "@/hooks/useOptimizedAnimation";
import { Tokens } from "@/theme/tokens";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ===========================================
// TYPES
// ===========================================

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  /** Intensidade da animação: low, medium, high */
  intensity?: "low" | "medium" | "high";
  /** Cores customizadas para aurora */
  colors?: readonly string[];
  /** Estilo adicional do container */
  style?: ViewStyle;
  /** TestID para testes */
  testID?: string;
}

// ===========================================
// CONSTANTS - Aurora Color Palettes
// ===========================================

const AURORA_COLORS = {
  // Maternal Aurora (padrão)
  maternal: [
    Tokens.maternal.warmth.blush, // Rosa suave
    Tokens.maternal.calm.lavender, // Lavanda
    Tokens.maternal.warmth.honey, // Dourado suave
    Tokens.maternal.warmth.blush, // Volta ao rosa
  ],
  // Gradient base suave
  base: [
    Tokens.maternal.warmth.blush, // Rosa claro
    Tokens.maternal.calm.lavender, // Lavanda clara
    Tokens.maternal.warmth.honey, // Dourado claro
    Tokens.maternal.warmth.blush, // Rosa claro
  ],
} as const;

const INTENSITY_CONFIG = {
  low: {
    particleCount: 6,
    animDuration: 20000,
    particleOpacity: 0.15,
    waveOpacity: 0.08,
  },
  medium: {
    particleCount: 10,
    animDuration: 16000,
    particleOpacity: 0.25,
    waveOpacity: 0.12,
  },
  high: {
    particleCount: 15,
    animDuration: 12000,
    animDuration2: 14000,
    particleOpacity: 0.35,
    waveOpacity: 0.18,
  },
} as const;

// ===========================================
// SUB-COMPONENTS
// ===========================================

/**
 * Partícula de luz flutuante
 */
interface LightParticleProps {
  index: number;
  maxOpacity: number;
  maxIterations: number;
  isActive: boolean;
}

function LightParticle({ index, maxOpacity, maxIterations, isActive }: LightParticleProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(maxOpacity * 0.5);
  const scale = useSharedValue(1);

  // Posição inicial baseada no índice (distribuída pela tela)
  const initialPosition = useMemo(() => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      top: (row * SCREEN_HEIGHT) / 5 + Math.random() * 100,
      left: (col * SCREEN_WIDTH) / 3 + Math.random() * 80,
      size: 60 + Math.random() * 100,
    };
  }, [index]);

  // Animações orgânicas
  useEffect(() => {
    if (!isActive) {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(opacity);
      cancelAnimation(scale);
      return;
    }

    // Movimento vertical flutuante
    const yDuration = 6000 + index * 800;
    const yDistance = 30 + Math.random() * 40;
    translateY.value = withRepeat(
      withSequence(
        withTiming(yDistance, { duration: yDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-yDistance * 0.6, {
          duration: yDuration * 0.8,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, { duration: yDuration * 0.5, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      false
    );

    // Movimento horizontal suave
    const xDuration = 8000 + index * 600;
    const xDistance = 15 + Math.random() * 25;
    translateX.value = withRepeat(
      withSequence(
        withTiming(xDistance, { duration: xDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(-xDistance, { duration: xDuration, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    // Pulsação de opacidade (respiração)
    const opacityDuration = 4000 + index * 500;
    opacity.value = withRepeat(
      withSequence(
        withTiming(maxOpacity, { duration: opacityDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(maxOpacity * 0.3, {
          duration: opacityDuration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      maxIterations,
      true
    );

    // Pulsação de escala sutil
    const scaleDuration = 5000 + index * 400;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: scaleDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: scaleDuration, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(opacity);
      cancelAnimation(scale);
    };
  }, [translateY, translateX, opacity, scale, index, maxOpacity, maxIterations, isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  // Cor baseada na posição (gradiente visual)
  const particleColor = useMemo(() => {
    const colors = [
      Tokens.brand.accent[200], // Rosa suave
      Tokens.brand.secondary[200], // Lavanda
      Tokens.maternal.warmth.peach, // Pêssego
      Tokens.brand.primary[200], // Azul suave
    ];
    return colors[index % colors.length];
  }, [index]);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: initialPosition.top,
          left: initialPosition.left,
          width: initialPosition.size,
          height: initialPosition.size,
          borderRadius: initialPosition.size / 2,
          backgroundColor: particleColor,
        },
        animatedStyle,
      ]}
    />
  );
}

/**
 * Onda de luz animada
 */
interface LightWaveProps {
  index: number;
  maxOpacity: number;
  maxIterations: number;
  isActive: boolean;
}

function LightWave({ index, maxOpacity, maxIterations, isActive }: LightWaveProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scaleX = useSharedValue(1);

  const wavePosition = useMemo(() => {
    return {
      top: SCREEN_HEIGHT * 0.2 + index * (SCREEN_HEIGHT * 0.25),
      height: 80 + index * 20,
    };
  }, [index]);

  useEffect(() => {
    if (!isActive) {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      cancelAnimation(scaleX);
      return;
    }

    const duration = 10000 + index * 2000;

    // Movimento vertical ondulante
    translateY.value = withRepeat(
      withSequence(
        withTiming(40, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(-40, { duration, easing: Easing.inOut(Easing.sin) })
      ),
      maxIterations,
      true
    );

    // Opacidade pulsante
    opacity.value = withRepeat(
      withSequence(
        withTiming(maxOpacity, { duration: duration * 0.5, easing: Easing.inOut(Easing.ease) }),
        withTiming(maxOpacity * 0.2, {
          duration: duration * 0.5,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      maxIterations,
      true
    );

    // Expansão/contração horizontal
    scaleX.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: duration * 0.7, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: duration * 0.7, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      cancelAnimation(scaleX);
    };
  }, [translateY, opacity, scaleX, index, maxOpacity, maxIterations, isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scaleX: scaleX.value }],
    opacity: opacity.value,
  }));

  const waveColors = useMemo(() => {
    const colorSets = [
      [Tokens.brand.accent[100], "transparent"] as const,
      [Tokens.brand.secondary[100], "transparent"] as const,
      [Tokens.maternal.warmth.blush, "transparent"] as const,
    ];
    return colorSets[index % colorSets.length];
  }, [index]);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: wavePosition.top,
          left: -SCREEN_WIDTH * 0.2,
          width: SCREEN_WIDTH * 1.4,
          height: wavePosition.height,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={waveColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ width: "100%", height: "100%" }}
      />
    </Animated.View>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export function AuroraBackground({
  children,
  intensity = "medium",
  colors,
  style,
  testID = "aurora-background",
}: AuroraBackgroundProps) {
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();
  const config = INTENSITY_CONFIG[intensity];
  const auroraColors = colors || AURORA_COLORS.base;

  // Animação principal de cor do gradiente
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    if (!shouldAnimate || !isActive) {
      cancelAnimation(colorProgress);
      colorProgress.value = 0;
      return;
    }

    colorProgress.value = withRepeat(
      withSequence(
        withTiming(0.33, { duration: config.animDuration / 4, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.66, { duration: config.animDuration / 4, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: config.animDuration / 4, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: config.animDuration / 4, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      false
    );

    return () => {
      cancelAnimation(colorProgress);
    };
  }, [colorProgress, shouldAnimate, isActive, maxIterations, config.animDuration]);

  // Estilo animado para overlay de cor
  const colorOverlayStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 0.33, 0.66, 1],
      auroraColors as unknown as string[]
    );
    const overlayOpacity = interpolate(colorProgress.value, [0, 0.5, 1], [0.15, 0.25, 0.15]);

    return {
      backgroundColor,
      opacity: overlayOpacity,
    };
  });

  // Gerar partículas
  const particles = useMemo(() => {
    if (!shouldAnimate) return null;
    return Array.from({ length: config.particleCount }, (_, i) => (
      <LightParticle
        key={`particle-${i}`}
        index={i}
        maxOpacity={config.particleOpacity}
        maxIterations={maxIterations}
        isActive={isActive}
      />
    ));
  }, [shouldAnimate, config.particleCount, config.particleOpacity, maxIterations, isActive]);

  // Gerar ondas
  const waves = useMemo(() => {
    if (!shouldAnimate) return null;
    return Array.from({ length: 3 }, (_, i) => (
      <LightWave
        key={`wave-${i}`}
        index={i}
        maxOpacity={config.waveOpacity}
        maxIterations={maxIterations}
        isActive={isActive}
      />
    ));
  }, [shouldAnimate, config.waveOpacity, maxIterations, isActive]);

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Base gradient */}
      <LinearGradient
        colors={[
          Tokens.maternal.warmth.blush,
          Tokens.brand.accent[50],
          Tokens.maternal.calm.lavender,
          Tokens.maternal.warmth.cream,
        ]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated color overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, colorOverlayStyle]}
        pointerEvents="none"
      />

      {/* Light waves */}
      <View style={styles.wavesContainer} pointerEvents="none">
        {waves}
      </View>

      {/* Light particles */}
      <View style={styles.particlesContainer} pointerEvents="none">
        {particles}
      </View>

      {/* Content */}
      {children}
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  wavesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
});

export default AuroraBackground;
