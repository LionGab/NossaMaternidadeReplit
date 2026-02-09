/**
 * AnimatedSplashScreenNathia - Design Nathia 2026
 * Pastel + Clean + Acolhedor
 *
 * Animation Sequence:
 * 1. Soft pastel gradient fade-in
 * 2. NathIA avatar scales up with glow pulse
 * 3. Brand name letter reveal
 * 4. Tagline slides up
 * 5. Loading bar with rosa gradient
 * 6. Smooth transition to app
 */

import { Tokens } from "@/theme/tokens";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Image, Platform, StyleSheet, View, ViewStyle, TextStyle } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { logger } from "../utils/logger";

// NathIA avatar image
const NATHIA_AVATAR = require("../../assets/nathia-app.png");

interface AnimatedSplashScreenNathiaProps {
  isReady: boolean;
  onFinish: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Nathia Design 2026 colors
const nathColors = {
  rosa: {
    DEFAULT: Tokens.brand.accent[300],
    light: Tokens.brand.accent[100],
    dark: Tokens.brand.accent[400],
  },
  azul: {
    DEFAULT: Tokens.brand.primary[200],
    light: Tokens.brand.primary[50],
    dark: Tokens.brand.primary[300],
  },
  verde: {
    DEFAULT: Tokens.brand.teal[200],
    light: Tokens.brand.teal[50],
    dark: Tokens.brand.teal[300],
  },
  laranja: {
    DEFAULT: Tokens.maternal.warmth.peach,
    light: Tokens.maternal.warmth.honey,
  },
  cream: Tokens.maternal.warmth.cream,
  white: Tokens.neutral[0],
  text: { DEFAULT: Tokens.neutral[800], muted: Tokens.neutral[500] },
};

// Keep splash screen visible until app is ready
SplashScreen.preventAutoHideAsync();

// ============================================
// NATHIA AVATAR WITH GLOW
// ============================================

interface NathiaLogoProps {
  size?: number;
  glowOpacity: SharedValue<number>;
}

function NathiaLogo({ size = 180, glowOpacity }: NathiaLogoProps) {
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Outer glow - rosa */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: size * 0.75,
            backgroundColor: nathColors.rosa.light,
          },
          glowStyle,
        ]}
      />

      {/* Inner glow - azul */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 1.2,
            height: size * 1.2,
            borderRadius: size * 0.6,
            backgroundColor: nathColors.azul.light,
          },
          glowStyle,
          { opacity: 0.5 },
        ]}
      />

      {/* Avatar container with border */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: nathColors.white,
          borderWidth: 4,
          borderColor: nathColors.rosa.DEFAULT,
          overflow: "hidden",
          shadowColor: nathColors.rosa.DEFAULT,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <Image
          source={NATHIA_AVATAR}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

// ============================================
// ANIMATED TEXT WITH LETTER REVEAL
// ============================================

interface AnimatedTextProps {
  text: string;
  delay: number;
  style?: ViewStyle | TextStyle;
  letterDelay?: number;
}

function AnimatedText({ text, delay, style, letterDelay = 50 }: AnimatedTextProps) {
  const letters = text.split("");
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setVisibleCount(count);
        if (count >= letters.length) {
          clearInterval(interval);
        }
      }, letterDelay);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [delay, letters.length, letterDelay]);

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
      {letters.map((letter, index) => (
        <Animated.Text
          key={index}
          style={[
            style,
            {
              opacity: index < visibleCount ? 1 : 0,
              transform: [{ translateY: index < visibleCount ? 0 : 10 }],
            },
          ]}
        >
          {letter}
        </Animated.Text>
      ))}
    </View>
  );
}

// ============================================
// NATHIA LOADING BAR
// ============================================

interface LoadingBarProps {
  progress: SharedValue<number>;
}

function NathiaLoadingBar({ progress }: LoadingBarProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.loadingBarContainer}>
      <View style={styles.loadingBarTrack}>
        <Animated.View style={[styles.loadingBarFill, animatedStyle]}>
          <LinearGradient
            colors={[nathColors.rosa.DEFAULT, nathColors.azul.DEFAULT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

// ============================================
// FLOATING PARTICLES
// ============================================

interface ParticleProps {
  delay: number;
  startX: number;
  size: number;
  color: string;
}

function FloatingParticle({ delay, startX, size, color }: ParticleProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const translateX = useSharedValue(startX);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.6, { duration: 800 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 15 }));

    translateY.value = withDelay(
      delay,
      withTiming(-100, {
        duration: 5000 + Math.random() * 2000,
        easing: Easing.out(Easing.quad),
      })
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startX + 30, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
          withTiming(startX - 30, { duration: 2500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(delay + 3500, withTiming(0, { duration: 1000 }));
  }, [delay, startX, translateY, translateX, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AnimatedSplashScreenNathia({ isReady, onFinish }: AnimatedSplashScreenNathiaProps) {
  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(30);
  const loadingProgress = useSharedValue(0);

  const hasFinishedRef = useRef(false);

  const finishOnce = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    onFinish();
  }, [onFinish]);

  // Hide native splash immediately
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  // Safety timeout - CRITICAL: reduced to 2.5s to ensure app starts quickly
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (!hasFinishedRef.current) {
        logger.warn("Splash timeout: forcing exit after 2.5s", "AnimatedSplashScreenNathia");
        finishOnce();
      }
    }, 2500);

    return () => clearTimeout(safetyTimeout);
  }, [finishOnce]);

  // Main animation sequence
  useEffect(() => {
    if (!isReady) {
      loadingProgress.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      return;
    }

    loadingProgress.value = withTiming(1, { duration: 300 });

    // Logo entrance
    logoScale.value = withSpring(1, { damping: 12, stiffness: 80, mass: 1 });
    logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });

    // Glow pulse
    glowOpacity.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.15, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Tagline entrance
    taglineOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    taglineTranslateY.value = withDelay(600, withSpring(0, { damping: 14, stiffness: 90 }));

    // Exit sequence
    const exitTimeout = setTimeout(() => {
      logoOpacity.value = withTiming(0, { duration: 500 });
      taglineOpacity.value = withTiming(0, { duration: 400 });
      glowOpacity.value = withTiming(0, { duration: 300 });

      containerOpacity.value = withTiming(0, { duration: 600 }, (finished) => {
        if (finished) {
          runOnJS(finishOnce)();
        }
      });
    }, 2500);

    return () => clearTimeout(exitTimeout);
  }, [
    isReady,
    logoScale,
    logoOpacity,
    glowOpacity,
    taglineOpacity,
    taglineTranslateY,
    loadingProgress,
    containerOpacity,
    finishOnce,
  ]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const logoContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  // Particles with nathia colors
  const particles = [
    { delay: 200, startX: SCREEN_WIDTH * 0.2, size: 8, color: nathColors.rosa.light },
    { delay: 600, startX: SCREEN_WIDTH * 0.8, size: 6, color: nathColors.azul.light },
    { delay: 1000, startX: SCREEN_WIDTH * 0.5, size: 7, color: nathColors.verde.light },
    { delay: 1400, startX: SCREEN_WIDTH * 0.3, size: 5, color: nathColors.laranja.light },
    { delay: 1800, startX: SCREEN_WIDTH * 0.7, size: 8, color: nathColors.rosa.light },
  ];

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Nathia gradient background */}
      <LinearGradient
        colors={[nathColors.rosa.light, nathColors.cream, nathColors.azul.light]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      {/* Main content */}
      <View style={styles.content}>
        {/* NathIA Logo */}
        <Animated.View style={[styles.logoContainer, logoContainerStyle]}>
          <NathiaLogo size={180} glowOpacity={glowOpacity} />
        </Animated.View>

        {/* Brand name */}
        <View style={styles.brandContainer}>
          <AnimatedText
            text="Nossa Maternidade"
            delay={400}
            letterDelay={45}
            style={styles.brandName}
          />
        </View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, taglineStyle]}>
          Você não está sozinha nessa jornada 💕
        </Animated.Text>
      </View>

      {/* Loading bar */}
      {!isReady && <NathiaLoadingBar progress={loadingProgress} />}

      {/* Version badge */}
      <Animated.Text entering={FadeIn.delay(800).duration(600)} style={styles.version}>
        v1.0
      </Animated.Text>
    </Animated.View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 32,
  },
  brandContainer: {
    marginBottom: 12,
  },
  brandName: {
    fontSize: 26,
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif-medium",
      default: "System",
    }),
    fontWeight: "700",
    color: nathColors.rosa.dark,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif",
      default: "System",
    }),
    fontWeight: "500",
    color: nathColors.text.DEFAULT,
    textAlign: "center",
    letterSpacing: 0.3,
    marginTop: 8,
  },
  loadingBarContainer: {
    position: "absolute",
    bottom: 100,
    width: SCREEN_WIDTH * 0.4,
    alignItems: "center",
  },
  loadingBarTrack: {
    width: "100%",
    height: 4,
    backgroundColor: nathColors.white,
    borderRadius: 2,
    overflow: "hidden",
    opacity: 0.8,
  },
  loadingBarFill: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  version: {
    position: "absolute",
    bottom: 50,
    fontSize: 12,
    fontWeight: "500",
    color: nathColors.text.muted,
    opacity: 0.6,
    letterSpacing: 1,
  },
});
