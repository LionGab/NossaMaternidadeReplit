/**
 * ComingSoonScreen - Flo Health Minimal Redesign
 *
 * Premium "Coming Soon" Experience
 *
 * Design Flo Health Minimal:
 * - Subtle gradient background via FloScreenWrapper
 * - Floating particles decoration
 * - Animated icon with soft glow
 * - Glassmorphism content card
 * - Premium CTAs with soft shadows
 * - Staggered animations
 * - Manrope typography
 * - Dark mode support
 */

import { FloScreenWrapper } from "@/components/ui/FloScreenWrapper";
import { useOptimizedAnimation } from "@/hooks/useOptimizedAnimation";
import { useTheme } from "@/hooks/useTheme";
import { Tokens, shadows, spacing, typography } from "@/theme/tokens";
import { getIconName } from "@/types/icons";
import { RootStackScreenProps } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ComingSoonParams {
  title?: string;
  description?: string;
  icon?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  relatedRoute?: string;
}

// ============================================
// FLOATING PARTICLES (subtle decoration)
// ============================================
const FloatingParticles = ({ isDark }: { isDark: boolean }) => {
  const particleColor = isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[300];

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      pointerEvents="none"
    >
      <Animated.View
        entering={FadeIn.delay(800).duration(600)}
        style={{
          position: "absolute",
          top: "15%",
          left: "8%",
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: particleColor,
          opacity: 0.5,
        }}
      />
      <Animated.View
        entering={FadeIn.delay(1000).duration(600)}
        style={{
          position: "absolute",
          top: "22%",
          right: "12%",
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: particleColor,
          opacity: 0.4,
        }}
      />
      <Animated.View
        entering={FadeIn.delay(1200).duration(600)}
        style={{
          position: "absolute",
          top: "65%",
          left: "5%",
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: particleColor,
          opacity: 0.45,
        }}
      />
      <Animated.View
        entering={FadeIn.delay(1400).duration(600)}
        style={{
          position: "absolute",
          top: "72%",
          right: "8%",
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: particleColor,
          opacity: 0.4,
        }}
      />
    </View>
  );
};

// ============================================
// ANIMATED ICON WITH GLOW
// ============================================
const AnimatedIcon = ({
  iconName,
  isDark,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  isDark: boolean;
}) => {
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.3);

  const accentColor = Tokens.brand.accent[500];

  useEffect(() => {
    if (!shouldAnimate || !isActive) {
      cancelAnimation(scale);
      cancelAnimation(glow);
      scale.value = 1;
      glow.value = 0.3;
      return;
    }

    // Gentle pulse animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    // Glow animation
    glow.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.25, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      maxIterations,
      true
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(glow);
    };
  }, [scale, glow, shouldAnimate, isActive, maxIterations]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: glow.value,
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(500).springify()}
      style={[
        {
          width: 112,
          height: 112,
          borderRadius: 56,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? `${accentColor}20` : `${accentColor}10`,
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 32,
          elevation: 8,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? `${accentColor}30` : `${accentColor}15`,
        }}
      >
        <Ionicons
          name={iconName}
          size={48}
          color={isDark ? Tokens.brand.accent[300] : accentColor}
        />
      </View>
    </Animated.View>
  );
};

// ============================================
// SPARKLE BADGE (encouragement)
// ============================================
const SparkleBadge = ({ isDark }: { isDark: boolean }) => {
  const accentColor = Tokens.brand.accent[500];

  return (
    <Animated.View
      entering={FadeInUp.delay(600).duration(500)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        backgroundColor: isDark ? Tokens.glass.dark.medium : `${accentColor}10`,
        borderWidth: 1,
        borderColor: isDark ? Tokens.glass.dark.strong : `${accentColor}20`,
      }}
    >
      <Ionicons name="sparkles" size={14} color={isDark ? Tokens.brand.accent[400] : accentColor} />
      <Text
        style={{
          marginLeft: spacing.sm,
          fontSize: 12,
          fontFamily: typography.fontFamily.medium,
          color: isDark ? Tokens.brand.accent[300] : Tokens.brand.accent[600],
        }}
      >
        Novidades em breve
      </Text>
    </Animated.View>
  );
};

// ============================================
// MAIN SCREEN
// ============================================
export default function ComingSoonScreen({
  route,
  navigation,
}: RootStackScreenProps<"ComingSoon">) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const params = (route.params || {}) as ComingSoonParams;

  const {
    title = "Em breve",
    description = "Estamos trabalhando nessa funcionalidade com muito carinho. Logo estará disponível para você!",
    icon = "construct-outline",
    primaryCtaLabel = "Voltar",
    secondaryCtaLabel,
    relatedRoute,
  } = params;

  const iconName = getIconName(icon, "construct-outline");

  // Theme colors
  const textMain = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const accentColor = Tokens.brand.accent[500];
  const cardBg = isDark ? Tokens.glass.dark.light : Tokens.neutral[0];
  const borderColor = isDark ? Tokens.glass.dark.strong : Tokens.neutral[100];

  // Button animations
  const primaryScale = useSharedValue(1);
  const secondaryScale = useSharedValue(1);

  const primaryAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: primaryScale.value }],
  }));

  const secondaryAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondaryScale.value }],
  }));

  const handlePrimaryAction = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleSecondaryAction = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (relatedRoute === "Assistant") {
      navigation.navigate("MainTabs", { screen: "Assistant" });
    } else if (relatedRoute === "Community") {
      navigation.navigate("MainTabs", { screen: "Community" });
    } else {
      navigation.goBack();
    }
  };

  return (
    <FloScreenWrapper gradient>
      {/* Floating Particles */}
      <FloatingParticles isDark={isDark} />

      {/* Header with close button */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: spacing["2xl"],
        }}
      >
        <Pressable
          onPress={handlePrimaryAction}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDark ? Tokens.glass.dark.medium : Tokens.neutral[100],
          }}
          accessibilityLabel="Fechar"
          accessibilityRole="button"
        >
          <Ionicons
            name="close"
            size={24}
            color={isDark ? Tokens.neutral[300] : Tokens.neutral[500]}
          />
        </Pressable>
      </Animated.View>

      {/* Content */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: spacing.lg,
        }}
      >
        {/* Animated Icon with Glow */}
        <AnimatedIcon iconName={iconName} isDark={isDark} />

        {/* Title */}
        <Animated.Text
          entering={FadeInUp.delay(300).duration(500).springify()}
          style={{
            textAlign: "center",
            marginTop: spacing["3xl"],
            marginBottom: spacing.md,
            fontSize: typography.displayMedium.fontSize,
            lineHeight: typography.displayMedium.lineHeight,
            color: textMain,
            fontFamily: typography.fontFamily.bold,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </Animated.Text>

        {/* Description */}
        <Animated.Text
          entering={FadeInUp.delay(400).duration(500).springify()}
          style={{
            textAlign: "center",
            marginBottom: spacing.xl,
            maxWidth: 300,
            fontSize: typography.bodyLarge.fontSize,
            lineHeight: typography.bodyLarge.lineHeight + 4,
            color: textSecondary,
            fontFamily: typography.fontFamily.base,
          }}
        >
          {description}
        </Animated.Text>

        {/* Sparkle Badge */}
        <SparkleBadge isDark={isDark} />
      </View>

      {/* Bottom CTAs */}
      <View
        style={{
          paddingBottom: Math.max(insets.bottom, spacing["2xl"]) + spacing.lg,
        }}
      >
        {/* Primary CTA */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500).springify()}
          style={primaryAnimStyle}
        >
          <Pressable
            onPress={handlePrimaryAction}
            onPressIn={() => (primaryScale.value = withSpring(0.97))}
            onPressOut={() => (primaryScale.value = withSpring(1))}
            style={{
              width: "100%",
              paddingVertical: spacing.lg,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: accentColor,
              minHeight: 56,
              ...shadows.flo.cta,
            }}
            accessibilityLabel={primaryCtaLabel}
            accessibilityRole="button"
          >
            <Text
              style={{
                fontSize: typography.bodyLarge.fontSize,
                color: Tokens.neutral[0],
                fontFamily: typography.fontFamily.semibold,
              }}
            >
              {primaryCtaLabel}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Secondary CTA */}
        {secondaryCtaLabel && (
          <Animated.View
            entering={FadeInDown.delay(600).duration(500).springify()}
            style={[{ marginTop: spacing.md }, secondaryAnimStyle]}
          >
            <Pressable
              onPress={handleSecondaryAction}
              onPressIn={() => (secondaryScale.value = withSpring(0.97))}
              onPressOut={() => (secondaryScale.value = withSpring(1))}
              style={{
                width: "100%",
                paddingVertical: spacing.lg,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: cardBg,
                minHeight: 56,
                borderWidth: 1,
                borderColor: borderColor,
              }}
              accessibilityLabel={secondaryCtaLabel}
              accessibilityRole="button"
            >
              <Text
                style={{
                  fontSize: typography.bodyLarge.fontSize,
                  color: isDark ? Tokens.neutral[200] : Tokens.neutral[700],
                  fontFamily: typography.fontFamily.semibold,
                }}
              >
                {secondaryCtaLabel}
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Footer branding */}
        <Animated.View
          entering={FadeIn.delay(700).duration(500)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: spacing["2xl"],
          }}
        >
          <Ionicons
            name="heart"
            size={14}
            color={isDark ? Tokens.brand.accent[400] : accentColor}
          />
          <Text
            style={{
              marginLeft: spacing.sm,
              fontSize: 12,
              color: isDark ? Tokens.neutral[500] : Tokens.neutral[400],
              fontFamily: typography.fontFamily.medium,
            }}
          >
            Nossa Maternidade
          </Text>
        </Animated.View>
      </View>
    </FloScreenWrapper>
  );
}
