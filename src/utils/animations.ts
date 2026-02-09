/**
 * Animations - Configurações de Animação Padronizadas
 *
 * Centraliza todas as configs de animação para consistência visual.
 * Usa react-native-reanimated v4 internamente.
 *
 * @example
 * ```tsx
 * import { SPRING, TIMING, ENTER, EXIT } from '@/utils/animations';
 *
 * // Spring animation
 * scale.value = withSpring(1, SPRING.gentle);
 *
 * // Timing animation
 * opacity.value = withTiming(1, TIMING.normal);
 *
 * // Entry animation
 * <Animated.View entering={ENTER.fadeUp} />
 * ```
 */

import {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";

// ===========================================
// SPRING CONFIGS
// ===========================================

/**
 * Configurações de spring animation para diferentes feels
 * Premium Design: Animações mais suaves e elegantes
 */
export const SPRING = {
  /** Suave e elegante - padrão para a maioria das animações */
  gentle: {
    damping: 18,
    stiffness: 120,
    mass: 1,
  } as WithSpringConfig,

  /** Rápido e responsivo - para feedback de UI */
  snappy: {
    damping: 14,
    stiffness: 180,
    mass: 0.9,
  } as WithSpringConfig,

  /** Divertido com bounce - para celebrações e destaque */
  bouncy: {
    damping: 10,
    stiffness: 160,
    mass: 1,
  } as WithSpringConfig,

  /** Muito bouncy - para confetti e badges */
  wobbly: {
    damping: 8,
    stiffness: 100,
    mass: 1,
  } as WithSpringConfig,

  /** Rígido - para snap e posicionamento preciso */
  stiff: {
    damping: 22,
    stiffness: 280,
    mass: 0.9,
  } as WithSpringConfig,

  /** Premium - para transições de tela e modais (ultra suave) */
  premium: {
    damping: 20,
    stiffness: 100,
    mass: 1.1,
  } as WithSpringConfig,

  /** Silk - para animações de scroll e parallax (sedoso) */
  silk: {
    damping: 25,
    stiffness: 90,
    mass: 1.2,
  } as WithSpringConfig,
} as const;

// ===========================================
// TIMING CONFIGS
// ===========================================

/**
 * Configurações de timing animation
 */
export const TIMING = {
  /** Instantâneo - micro-feedback */
  instant: {
    duration: 80,
    easing: Easing.out(Easing.ease),
  } as WithTimingConfig,

  /** Rápido - feedback de UI */
  fast: {
    duration: 150,
    easing: Easing.out(Easing.ease),
  } as WithTimingConfig,

  /** Normal - transições padrão */
  normal: {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  } as WithTimingConfig,

  /** Lento - transições com ênfase */
  slow: {
    duration: 500,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  } as WithTimingConfig,

  /** Muito lento - storytelling */
  slower: {
    duration: 800,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  } as WithTimingConfig,

  /** Glow pulse - para CTAs */
  glow: {
    duration: 1500,
    easing: Easing.inOut(Easing.ease),
  } as WithTimingConfig,
} as const;

// ===========================================
// DURATIONS (valores diretos)
// ===========================================

/**
 * Durações em ms para uso direto
 */
export const DURATION = {
  instant: 80,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 800,
  glow: 1500,
  particle: 2000,
} as const;

// ===========================================
// MICRO-INTERACTION VALUES
// ===========================================

/**
 * Valores de micro-interação
 * Premium Design: Valores mais sutis e elegantes
 */
export const MICRO = {
  /** Escala quando pressionado - mais sutil para premium */
  pressScale: 0.98,
  /** Escala no hover (web) */
  hoverScale: 1.015,
  /** Escala para badges/badges */
  popScale: 1.1,
  /** Distância de float para partículas */
  floatDistance: 8,
  /** Rotação sutil */
  tiltAngle: 2,
  /** Opacidade mínima de glow */
  glowMin: 0.2,
  /** Opacidade máxima de glow */
  glowMax: 0.5,
  /** Escala premium para CTAs */
  ctaScale: 0.985,
  /** Blur para efeitos de foco */
  focusBlur: 8,
} as const;

// ===========================================
// ENTERING ANIMATIONS (Layout Animations)
// ===========================================

/**
 * Animações de entrada pré-configuradas
 */
export const ENTER = {
  /** Fade simples */
  fade: FadeIn.duration(DURATION.normal),

  /** Fade de baixo para cima */
  fadeUp: FadeInUp.duration(DURATION.normal).springify().damping(15),

  /** Fade de cima para baixo */
  fadeDown: FadeInDown.duration(DURATION.normal).springify().damping(15),

  /** Slide de baixo */
  slideUp: SlideInUp.duration(DURATION.slow).springify().damping(15),

  /** Slide de cima */
  slideDown: SlideInDown.duration(DURATION.slow).springify().damping(15),

  /** Zoom com bounce */
  zoom: ZoomIn.duration(DURATION.normal).springify().damping(12),

  /** Fade rápido */
  quick: FadeIn.duration(DURATION.fast),
} as const;

/**
 * Factory para criar entering com delay (stagger)
 */
export const enterWithDelay = (baseAnimation: typeof ENTER.fadeUp, delayMs: number) => {
  return baseAnimation.delay(delayMs);
};

/**
 * Cria animações staggered para listas
 * @param index - índice do item na lista
 * @param baseDelay - delay base entre itens (default: 50ms)
 */
export const staggeredFadeUp = (index: number, baseDelay = 50) => {
  return FadeInUp.delay(index * baseDelay)
    .duration(DURATION.normal)
    .springify()
    .damping(15);
};

// ===========================================
// EXITING ANIMATIONS
// ===========================================

/**
 * Animações de saída pré-configuradas
 */
export const EXIT = {
  /** Fade simples */
  fade: FadeOut.duration(DURATION.fast),

  /** Fade para cima */
  fadeUp: FadeOutUp.duration(DURATION.fast),

  /** Fade para baixo */
  fadeDown: FadeOutDown.duration(DURATION.fast),

  /** Slide para baixo */
  slideDown: SlideOutDown.duration(DURATION.normal),

  /** Slide para cima */
  slideUp: SlideOutUp.duration(DURATION.normal),

  /** Zoom out */
  zoom: ZoomOut.duration(DURATION.fast),
} as const;

// ===========================================
// EASING CURVES
// ===========================================

/**
 * Curvas de easing comuns
 */
export const EASING = {
  /** Ease out padrão */
  out: Easing.out(Easing.ease),

  /** Ease in-out suave */
  inOut: Easing.inOut(Easing.ease),

  /** Bezier premium (Material Design 3) */
  emphasized: Easing.bezier(0.2, 0, 0, 1),

  /** Bezier para entrada */
  decelerate: Easing.bezier(0, 0, 0.2, 1),

  /** Bezier para saída */
  accelerate: Easing.bezier(0.3, 0, 1, 1),

  /** Bounce */
  bounce: Easing.bounce,

  /** Elastic */
  elastic: Easing.elastic(1),
} as const;

export default {
  SPRING,
  TIMING,
  DURATION,
  MICRO,
  ENTER,
  EXIT,
  EASING,
  staggeredFadeUp,
  enterWithDelay,
};
