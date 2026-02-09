/**
 * Stage Illustrations - Premium SVG Components
 *
 * Ilustrações minimalistas e elegantes para cada fase da jornada maternal.
 * Design inspirado em apps premium de bem-estar como Calm, Headspace.
 *
 * Cada ilustração transmite emoção e acolhimento:
 * - Tentando: Semente com esperança (germinating seed)
 * - Grávida T1: Lua crescente (new beginnings)
 * - Grávida T2: Borboleta emergindo (transformation)
 * - Grávida T3: Flor desabrochando (blooming)
 * - Puerpério: Abraço mãe-bebê (bonding)
 * - Mãe Recente: Corações conectados (love connection)
 * - General: Coração com asas (universal love)
 *
 * @example
 * ```tsx
 * <StageIllustration stage="TENTANTE" size={80} />
 * ```
 */

import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

import { useOptimizedAnimation } from "@/hooks/useOptimizedAnimation";
import { Tokens } from "@/theme/tokens";
import type { OnboardingStage } from "@/types/nath-journey-onboarding.types";

// ===========================================
// ANIMATED SVG COMPONENTS
// ===========================================

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

// ===========================================
// TYPES
// ===========================================

interface IllustrationProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  animated?: boolean;
}

interface StageIllustrationProps extends IllustrationProps {
  stage: OnboardingStage;
}

// ===========================================
// COLOR PALETTES
// ===========================================

const COLORS = {
  rose: Tokens.brand.accent[400],
  roseLight: Tokens.brand.accent[200],
  roseSoft: Tokens.brand.accent[100],
  lavender: Tokens.brand.secondary[400],
  lavenderLight: Tokens.brand.secondary[200],
  gold: Tokens.premium.special.gold,
  peach: Tokens.maternal.warmth.peach,
  mint: Tokens.brand.teal[200],
  mintLight: Tokens.brand.teal[50],
  coral: Tokens.brand.accent[400],
  coralLight: Tokens.brand.accent[100],
  sky: Tokens.brand.primary[400],
  skyLight: Tokens.brand.primary[200],
} as const;

// ===========================================
// ILUSTRAÇÃO: TENTANTE (Semente germinando)
// ===========================================

function SeedIllustration({
  size = 80,
  primaryColor = COLORS.mint,
  secondaryColor = COLORS.mintLight,
  animated = true,
}: IllustrationProps) {
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();
  const sproutScale = useSharedValue(0.95);

  useEffect(() => {
    if (!shouldAnimate || !isActive || !animated) {
      cancelAnimation(sproutScale);
      sproutScale.value = 1;
      return;
    }

    sproutScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    return () => cancelAnimation(sproutScale);
  }, [sproutScale, shouldAnimate, isActive, animated, maxIterations]);

  const animatedProps = useAnimatedProps(() => ({
    transform: [{ scale: sproutScale.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <SvgLinearGradient id="seedGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor={primaryColor} />
            <Stop offset="100%" stopColor={secondaryColor} />
          </SvgLinearGradient>
        </Defs>

        {/* Soil/Ground */}
        <Ellipse cx="40" cy="65" rx="25" ry="8" fill={COLORS.peach} opacity={0.5} />

        {/* Seed */}
        <Ellipse cx="40" cy="55" rx="8" ry="6" fill={COLORS.rose} />

        {/* Sprout */}
        <AnimatedG animatedProps={animatedProps} origin="40, 55">
          {/* Stem */}
          <Path
            d="M40 55 C40 45, 40 40, 40 35"
            stroke="url(#seedGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left leaf */}
          <Path d="M40 40 C35 35, 30 33, 28 30 C28 37, 33 42, 40 40" fill={primaryColor} />
          {/* Right leaf */}
          <Path d="M40 40 C45 35, 50 33, 52 30 C52 37, 47 42, 40 40" fill={primaryColor} />
          {/* Sparkle */}
          <Circle cx="52" cy="25" r="2" fill={COLORS.gold} opacity={0.8} />
        </AnimatedG>
      </Svg>
    </View>
  );
}

// ===========================================
// ILUSTRAÇÃO: GRÁVIDA T1 (Lua crescente)
// ===========================================

function MoonIllustration({
  size = 80,
  primaryColor = COLORS.lavender,
  secondaryColor = COLORS.lavenderLight,
  animated = true,
}: IllustrationProps) {
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (!shouldAnimate || !isActive || !animated) {
      cancelAnimation(glowOpacity);
      glowOpacity.value = 0.5;
      return;
    }

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    return () => cancelAnimation(glowOpacity);
  }, [glowOpacity, shouldAnimate, isActive, animated, maxIterations]);

  const animatedGlowProps = useAnimatedProps(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <SvgLinearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={secondaryColor} />
            <Stop offset="100%" stopColor={primaryColor} />
          </SvgLinearGradient>
        </Defs>

        {/* Glow */}
        <AnimatedCircle
          cx="40"
          cy="40"
          r="32"
          fill={primaryColor}
          animatedProps={animatedGlowProps}
        />

        {/* Moon */}
        <Path
          d="M55 25 C55 25, 65 35, 65 50 C65 65, 50 75, 35 70 C45 65, 50 55, 50 45 C50 35, 45 28, 35 25 C45 22, 55 22, 55 25"
          fill="url(#moonGrad)"
        />

        {/* Stars */}
        <Circle cx="25" cy="20" r="2" fill={COLORS.gold} />
        <Circle cx="18" cy="35" r="1.5" fill={COLORS.gold} opacity={0.7} />
        <Circle cx="22" cy="55" r="1" fill={COLORS.gold} opacity={0.5} />
      </Svg>
    </View>
  );
}

// ===========================================
// ILUSTRAÇÃO: GRÁVIDA T2 (Borboleta)
// ===========================================

function ButterflyIllustration({
  size = 80,
  primaryColor = COLORS.rose,
  secondaryColor = COLORS.roseLight,
  animated = true,
}: IllustrationProps) {
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();
  const wingRotation = useSharedValue(0);

  useEffect(() => {
    if (!shouldAnimate || !isActive || !animated) {
      cancelAnimation(wingRotation);
      wingRotation.value = 0;
      return;
    }

    wingRotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    return () => cancelAnimation(wingRotation);
  }, [wingRotation, shouldAnimate, isActive, animated, maxIterations]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <SvgLinearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={primaryColor} />
            <Stop offset="100%" stopColor={secondaryColor} />
          </SvgLinearGradient>
        </Defs>

        {/* Left wing */}
        <Path
          d="M40 40 C30 25, 15 20, 12 30 C10 40, 20 55, 40 45"
          fill="url(#wingGrad)"
          opacity={0.9}
        />
        <Path
          d="M40 45 C25 50, 15 60, 18 68 C22 75, 35 70, 40 55"
          fill={secondaryColor}
          opacity={0.8}
        />

        {/* Right wing */}
        <Path
          d="M40 40 C50 25, 65 20, 68 30 C70 40, 60 55, 40 45"
          fill="url(#wingGrad)"
          opacity={0.9}
        />
        <Path
          d="M40 45 C55 50, 65 60, 62 68 C58 75, 45 70, 40 55"
          fill={secondaryColor}
          opacity={0.8}
        />

        {/* Body */}
        <Ellipse cx="40" cy="47" rx="3" ry="15" fill={COLORS.lavender} />

        {/* Antennae */}
        <Path
          d="M38 33 C36 28, 32 25, 30 22"
          stroke={COLORS.lavender}
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d="M42 33 C44 28, 48 25, 50 22"
          stroke={COLORS.lavender}
          strokeWidth="1.5"
          fill="none"
        />
        <Circle cx="30" cy="22" r="2" fill={COLORS.gold} />
        <Circle cx="50" cy="22" r="2" fill={COLORS.gold} />
      </Svg>
    </View>
  );
}

// ===========================================
// ILUSTRAÇÃO: GRÁVIDA T3 (Flor desabrochando)
// ===========================================

function FlowerIllustration({
  size = 80,
  primaryColor = COLORS.rose,
  secondaryColor = COLORS.roseSoft,
  animated = true,
}: IllustrationProps) {
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();
  const petalScale = useSharedValue(0.95);

  useEffect(() => {
    if (!shouldAnimate || !isActive || !animated) {
      cancelAnimation(petalScale);
      petalScale.value = 1;
      return;
    }

    petalScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    return () => cancelAnimation(petalScale);
  }, [petalScale, shouldAnimate, isActive, animated, maxIterations]);

  const animatedProps = useAnimatedProps(() => ({
    transform: [{ scale: petalScale.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <SvgLinearGradient id="petalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={primaryColor} />
            <Stop offset="100%" stopColor={secondaryColor} />
          </SvgLinearGradient>
        </Defs>

        {/* Stem */}
        <Path
          d="M40 50 C40 60, 40 70, 40 75"
          stroke={COLORS.mint}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Leaf */}
        <Path d="M40 65 C45 60, 55 58, 58 55 C55 62, 48 68, 40 65" fill={COLORS.mint} />

        {/* Petals */}
        <AnimatedG animatedProps={animatedProps} origin="40, 35">
          {/* Top petal */}
          <Ellipse cx="40" cy="20" rx="10" ry="15" fill="url(#petalGrad)" />
          {/* Top-right petal */}
          <Ellipse
            cx="52"
            cy="28"
            rx="10"
            ry="13"
            fill={secondaryColor}
            transform="rotate(40, 52, 28)"
          />
          {/* Bottom-right petal */}
          <Ellipse
            cx="52"
            cy="42"
            rx="10"
            ry="13"
            fill="url(#petalGrad)"
            transform="rotate(80, 52, 42)"
          />
          {/* Bottom-left petal */}
          <Ellipse
            cx="28"
            cy="42"
            rx="10"
            ry="13"
            fill={secondaryColor}
            transform="rotate(-80, 28, 42)"
          />
          {/* Top-left petal */}
          <Ellipse
            cx="28"
            cy="28"
            rx="10"
            ry="13"
            fill="url(#petalGrad)"
            transform="rotate(-40, 28, 28)"
          />
        </AnimatedG>

        {/* Center */}
        <Circle cx="40" cy="35" r="8" fill={COLORS.gold} />
        <Circle cx="40" cy="35" r="5" fill={COLORS.peach} />
      </Svg>
    </View>
  );
}

// ===========================================
// ILUSTRAÇÃO: PUERPÉRIO (Abraço mãe-bebê)
// ===========================================

function HugIllustration({
  size = 80,
  primaryColor = COLORS.rose,
  secondaryColor = COLORS.peach,
  animated = true,
}: IllustrationProps) {
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();
  const heartScale = useSharedValue(1);

  useEffect(() => {
    if (!shouldAnimate || !isActive || !animated) {
      cancelAnimation(heartScale);
      heartScale.value = 1;
      return;
    }

    heartScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    return () => cancelAnimation(heartScale);
  }, [heartScale, shouldAnimate, isActive, animated, maxIterations]);

  const animatedProps = useAnimatedProps(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <SvgLinearGradient id="hugGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={secondaryColor} />
            <Stop offset="100%" stopColor={primaryColor} />
          </SvgLinearGradient>
        </Defs>

        {/* Mother silhouette */}
        <Path
          d="M30 70 C25 60, 22 50, 25 40 C28 30, 35 25, 40 25 C45 25, 50 28, 52 35 C54 42, 52 50, 50 60 C48 70, 45 75, 40 75 C35 75, 32 72, 30 70"
          fill="url(#hugGrad)"
        />

        {/* Baby silhouette */}
        <Circle cx="40" cy="50" r="12" fill={secondaryColor} />
        <Circle cx="40" cy="42" r="8" fill={secondaryColor} />

        {/* Embracing arms */}
        <Path
          d="M28 45 C22 42, 20 48, 25 55 C30 62, 38 60, 40 55"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M52 45 C58 42, 60 48, 55 55 C50 62, 42 60, 40 55"
          stroke={primaryColor}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Heart */}
        <AnimatedG animatedProps={animatedProps} origin="40, 28">
          <Path
            d="M40 32 C40 28, 35 24, 32 24 C28 24, 25 28, 25 32 C25 38, 40 48, 40 48 C40 48, 55 38, 55 32 C55 28, 52 24, 48 24 C45 24, 40 28, 40 32"
            fill={COLORS.coral}
            scale={0.4}
            translateX={16}
            translateY={5}
          />
        </AnimatedG>
      </Svg>
    </View>
  );
}

// ===========================================
// ILUSTRAÇÃO: MÃE RECENTE (Corações conectados)
// ===========================================

function ConnectedHeartsIllustration({
  size = 80,
  primaryColor = COLORS.rose,
  secondaryColor = COLORS.coral,
  animated = true,
}: IllustrationProps) {
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (!shouldAnimate || !isActive || !animated) {
      cancelAnimation(pulseScale);
      pulseScale.value = 1;
      return;
    }

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    return () => cancelAnimation(pulseScale);
  }, [pulseScale, shouldAnimate, isActive, animated, maxIterations]);

  const animatedProps = useAnimatedProps(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        {/* Connection line */}
        <Path
          d="M28 40 C35 35, 45 35, 52 40"
          stroke={COLORS.gold}
          strokeWidth="2"
          strokeDasharray="4 2"
          fill="none"
        />

        {/* Large heart (mother) */}
        <AnimatedG animatedProps={animatedProps} origin="25, 38">
          <Path
            d="M25 38 C25 32, 18 28, 14 28 C8 28, 4 34, 4 40 C4 52, 25 65, 25 65 C25 65, 46 52, 46 40 C46 34, 42 28, 36 28 C32 28, 25 32, 25 38"
            fill={primaryColor}
            scale={0.55}
            translateX={4}
            translateY={8}
          />
        </AnimatedG>

        {/* Small heart (baby) */}
        <AnimatedG animatedProps={animatedProps} origin="58, 42">
          <Path
            d="M25 38 C25 32, 18 28, 14 28 C8 28, 4 34, 4 40 C4 52, 25 65, 25 65 C25 65, 46 52, 46 40 C46 34, 42 28, 36 28 C32 28, 25 32, 25 38"
            fill={secondaryColor}
            scale={0.4}
            translateX={38}
            translateY={18}
          />
        </AnimatedG>

        {/* Sparkles */}
        <Circle cx="40" cy="25" r="2" fill={COLORS.gold} />
        <Circle cx="32" cy="60" r="1.5" fill={COLORS.gold} opacity={0.7} />
        <Circle cx="55" cy="55" r="1.5" fill={COLORS.gold} opacity={0.7} />
      </Svg>
    </View>
  );
}

// ===========================================
// ILUSTRAÇÃO: GENERAL (Coração com asas)
// ===========================================

function WingedHeartIllustration({
  size = 80,
  primaryColor = COLORS.rose,
  secondaryColor = COLORS.roseLight,
  animated = true,
}: IllustrationProps) {
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();
  const wingFlap = useSharedValue(0);

  useEffect(() => {
    if (!shouldAnimate || !isActive || !animated) {
      cancelAnimation(wingFlap);
      wingFlap.value = 0;
      return;
    }

    wingFlap.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-8, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    return () => cancelAnimation(wingFlap);
  }, [wingFlap, shouldAnimate, isActive, animated, maxIterations]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        <Defs>
          <SvgLinearGradient id="heartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={primaryColor} />
            <Stop offset="100%" stopColor={secondaryColor} />
          </SvgLinearGradient>
        </Defs>

        {/* Left wing */}
        <Path
          d="M30 40 C20 35, 10 30, 5 35 C0 40, 5 50, 15 50 C22 50, 28 45, 30 40"
          fill={secondaryColor}
          opacity={0.8}
        />
        <Path
          d="M28 38 C18 33, 12 30, 8 33 C4 38, 8 45, 15 46 C20 47, 26 43, 28 38"
          fill={COLORS.sky}
          opacity={0.5}
        />

        {/* Right wing */}
        <Path
          d="M50 40 C60 35, 70 30, 75 35 C80 40, 75 50, 65 50 C58 50, 52 45, 50 40"
          fill={secondaryColor}
          opacity={0.8}
        />
        <Path
          d="M52 38 C62 33, 68 30, 72 33 C76 38, 72 45, 65 46 C60 47, 54 43, 52 38"
          fill={COLORS.sky}
          opacity={0.5}
        />

        {/* Heart */}
        <Path
          d="M40 55 C40 55, 20 42, 20 32 C20 25, 27 20, 33 20 C37 20, 40 23, 40 28 C40 23, 43 20, 47 20 C53 20, 60 25, 60 32 C60 42, 40 55, 40 55"
          fill="url(#heartGrad)"
        />

        {/* Highlight */}
        <Circle cx="32" cy="30" r="3" fill="white" opacity={0.4} />
      </Svg>
    </View>
  );
}

// ===========================================
// MAIN EXPORT
// ===========================================

export function StageIllustration({
  stage,
  size = 80,
  primaryColor,
  secondaryColor,
  animated = true,
}: StageIllustrationProps) {
  const props = { size, primaryColor, secondaryColor, animated };

  switch (stage) {
    case "TENTANTE":
      return <SeedIllustration {...props} />;
    case "GRAVIDA_T1":
      return <MoonIllustration {...props} />;
    case "GRAVIDA_T2":
      return <ButterflyIllustration {...props} />;
    case "GRAVIDA_T3":
      return <FlowerIllustration {...props} />;
    case "PUERPERIO_0_40D":
      return <HugIllustration {...props} />;
    case "MAE_RECENTE_ATE_1ANO":
      return <ConnectedHeartsIllustration {...props} />;
    case "GENERAL":
    default:
      return <WingedHeartIllustration {...props} />;
  }
}

// Export individual illustrations for direct use
export {
  ButterflyIllustration,
  ConnectedHeartsIllustration,
  FlowerIllustration,
  HugIllustration,
  MoonIllustration,
  SeedIllustration,
  WingedHeartIllustration,
};

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
