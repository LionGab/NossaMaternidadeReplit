/**
 * AnimatedSplashScreen - Friendly Soft Minimalist Design ✨
 *
 * Design Philosophy: "Warm, Welcoming & Nurturing"
 * - Soft pastel palette (#fdf1e6 cream, #e1325c pink, #5ba4d8 blue)
 * - Rounded Quicksand typography for approachable feel
 * - Layered shadows and glows
 * - Smooth organic animations with custom cubic-bezier
 *
 * Animation Sequence:
 * 1. Background blur circles fade in
 * 2. Central circular hero scales up (0.9 → 1.0) with soft glow
 * 3. Title fades and slides up (20px)
 * 4. Subtitle fades and slides up (staggered 0.3s)
 * 5. Version badge appears
 *
 * @version 3.0.0 - Friendly Soft Minimalist Redesign
 */

import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
// Safe area insets removed - using fixed values for splash screen
import { Tokens, typography } from "../theme/tokens";
import { logger } from "../utils/logger";

// Logo principal - Mãe com bebê
const LOGO_IMAGE = require("../../assets/mother-baby-logo.png");

interface AnimatedSplashScreenProps {
  isReady: boolean;
  onFinish: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Keep splash screen visible until app is ready
SplashScreen.preventAutoHideAsync();

// ============================================
// DESIGN TOKENS - Friendly Soft Minimalist
// ============================================

const COLORS = {
  background: Tokens.maternal.warmth.cream,
  primaryPink: Tokens.brand.accent[500],
  secondaryBlue: Tokens.brand.primary[400],
  versionBlue: Tokens.brand.primary[200],
  glowPink: Tokens.brand.accent[200],
  blurPink: Tokens.brand.accent[50],
  blurBlue: Tokens.brand.primary[100],
  white: Tokens.neutral[0],
};

// Custom easing for organic feel
const ORGANIC_EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

// ============================================
// ANIMATED BACKGROUND BLUR CIRCLES
// ============================================

interface BlurCircleProps {
  color: string;
  size: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  delay?: number;
}

function BlurCircle({ color, size, top, bottom, left, right, delay = 0 }: BlurCircleProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.3, { duration: 1200, easing: ORGANIC_EASE }));
    scale.value = withDelay(delay, withTiming(1, { duration: 1200, easing: ORGANIC_EASE }));
  }, [delay, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          bottom,
          left,
          right,
        },
        animatedStyle,
        // Blur effect (only works on web/iOS with specific setup)
        Platform.select<{ filter?: string }>({
          web: {
            filter: "blur(64px)",
          },
        }),
      ]}
    />
  );
}

// ============================================
// CIRCULAR HERO IMAGE with Layered Glow
// ============================================

interface CircularHeroProps {
  size: number;
  delay?: number;
}

function CircularHero({ size, delay = 0 }: CircularHeroProps) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Main image entrance
    scale.value = withDelay(delay, withTiming(1, { duration: 1200, easing: ORGANIC_EASE }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 1200, easing: ORGANIC_EASE }));

    // Glow layer entrance
    glowOpacity.value = withDelay(
      delay + 200,
      withTiming(0.3, { duration: 800, easing: ORGANIC_EASE })
    );
  }, [delay, scale, opacity, glowOpacity]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Layer 1: Background blur circle (pink glow) */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: (size * 1.5) / 2,
            backgroundColor: COLORS.glowPink,
          },
          glowStyle,
          Platform.select<{ filter?: string }>({
            web: {
              filter: "blur(64px)",
            },
          }),
        ]}
      />

      {/* Layer 2: Circular image with white border and shadow */}
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 6,
            borderColor: COLORS.white,
            backgroundColor: COLORS.white,
            overflow: "hidden",
            // Soft pink shadow
            shadowColor: COLORS.primaryPink,
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.15,
            shadowRadius: 50,
            elevation: 20,
          },
          imageStyle,
        ]}
      >
        <Image
          source={LOGO_IMAGE}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
}

// ============================================
// ANIMATED TEXT with Slide Up + Fade
// ============================================

interface AnimatedTextProps {
  children: string;
  delay: number;
  style?: ViewStyle | TextStyle;
}

function AnimatedTextSlide({ children, delay, style }: AnimatedTextProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 800, easing: ORGANIC_EASE }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 800, easing: ORGANIC_EASE }));
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.Text style={[style, animatedStyle]}>{children}</Animated.Text>;
}

// ============================================
// STATUS BAR (Mobile Clock + Icons)
// ============================================

interface StatusBarProps {
  topInset: number;
}

function StatusBar({ topInset }: StatusBarProps) {
  return (
    <View style={[styles.statusBar, { top: Math.max(topInset, 16) }]}>
      <Text style={styles.statusClock}>07:30</Text>
      <View style={styles.statusIcons}>
        <Text style={styles.statusIcon}>📶</Text>
        <Text style={styles.statusIcon}>📡</Text>
        <Text style={styles.statusIcon}>🔋</Text>
      </View>
    </View>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AnimatedSplashScreen({ isReady, onFinish }: AnimatedSplashScreenProps) {
  // Animation values
  const containerOpacity = useSharedValue(1);

  // Fixed safe area values for splash screen
  const SAFE_AREA_TOP = Platform.select({ ios: 44, android: 24, default: 16 });
  const SAFE_AREA_BOTTOM = Platform.select({ ios: 34, android: 16, default: 48 });

  // Refs
  const hasFinishedRef = useRef(false);

  // Idempotent finish function
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
        logger.warn("Splash timeout: forcing exit after 2.5s", "AnimatedSplashScreen");
        finishOnce();
      }
    }, 2500);

    return () => clearTimeout(safetyTimeout);
  }, [finishOnce]);

  // Exit sequence when app is ready
  useEffect(() => {
    if (!isReady) return;

    // Wait for animations to play (3 seconds total)
    const exitTimeout = setTimeout(() => {
      // Fade everything out
      containerOpacity.value = withTiming(0, { duration: 600 }, (finished) => {
        if (finished) {
          runOnJS(finishOnce)();
        }
      });
    }, 3000);

    return () => clearTimeout(exitTimeout);
  }, [isReady, containerOpacity, finishOnce]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Solid cream background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.background }]} />

      {/* Background decorative blur circles */}
      <BlurCircle
        color={COLORS.blurPink}
        size={256}
        top={-SCREEN_HEIGHT * 0.1}
        right={-128}
        delay={0}
      />
      <BlurCircle
        color={COLORS.blurBlue}
        size={320}
        bottom={SCREEN_HEIGHT * 0.15}
        left={-160}
        delay={200}
      />

      {/* Status Bar */}
      <StatusBar topInset={SAFE_AREA_TOP} />

      {/* Main Content - Centered */}
      <View style={styles.content}>
        {/* Circular Hero Image with Glow */}
        <View style={styles.heroContainer}>
          <CircularHero size={224} delay={400} />
        </View>

        {/* Title - Nossa Maternidade */}
        <AnimatedTextSlide delay={800} style={styles.title}>
          Nossa Maternidade
        </AnimatedTextSlide>

        {/* Subtitle - Sua jornada maternal começa aqui */}
        <AnimatedTextSlide delay={1100} style={styles.subtitle}>
          Sua jornada maternal começa aqui
        </AnimatedTextSlide>
      </View>

      {/* Footer - Version Badge */}
      <View style={[styles.footer, { paddingBottom: SAFE_AREA_BOTTOM }]}>
        <AnimatedTextSlide delay={1400} style={styles.version}>
          v1.0
        </AnimatedTextSlide>
      </View>
    </Animated.View>
  );
}

// ============================================
// STYLES - Friendly Soft Minimalist
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Status Bar
  statusBar: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  statusClock: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primaryPink,
    opacity: 0.8,
  },
  statusIcons: {
    flexDirection: "row",
    gap: 8,
  },
  statusIcon: {
    fontSize: 14,
    opacity: 0.8,
  },

  // Main Content
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  // Hero Section
  heroContainer: {
    marginBottom: 40,
  },

  // Title - Bold Quicksand (using Manrope bold as fallback)
  title: {
    fontSize: 32,
    fontWeight: "700",
    // TODO: Use Quicksand when installed
    fontFamily: typography.fontFamily.bold, // Manrope fallback
    color: COLORS.primaryPink,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 12,
  },

  // Subtitle - Medium Quicksand (using Manrope medium as fallback)
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    // TODO: Use Quicksand when installed
    fontFamily: typography.fontFamily.medium, // Manrope fallback
    color: COLORS.secondaryBlue,
    textAlign: "center",
    letterSpacing: 0.2,
    paddingHorizontal: 20,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  // Version Badge
  version: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
    color: COLORS.versionBlue,
    letterSpacing: 3, // tracking-widest
    textTransform: "lowercase",
  },
});
