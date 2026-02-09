/**
 * Button - Design System Component (NativeWind 2025)
 *
 * Pink Clean + Blue Clean Premium ✨
 *
 * Hierarquia de variantes:
 * - accent: Pink CTA (destaque máximo)
 * - glow: Pink CTA com animação de glow pulsante
 * - gradient: Gradiente pink para destaque premium
 * - primary: Blue pastel (ação primária)
 * - secondary: Outline blue
 * - outline: Outline customizável
 * - ghost: Sem fundo
 * - soft: Fundo suave blue
 *
 * Hybrid NativeWind: Base layout via Tailwind, theme-dynamic styles via tokens.
 *
 * @example
 * ```tsx
 * <Button variant="glow" onPress={handleCTA}>Começar Agora</Button>
 * <Button variant="gradient" onPress={handlePremium}>Upgrade Premium</Button>
 * <Button variant="accent" onPress={handleSave}>Salvar</Button>
 * <Button variant="primary" onPress={handleNext}>Próximo</Button>
 * <Button variant="soft" className="mt-4">Com NativeWind</Button>
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useCallback } from "react";
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useOptimizedAnimation } from "../../hooks/useOptimizedAnimation";
import { useTheme } from "../../hooks/useTheme";
import { buttonAccessibility } from "../../utils/accessibility";
import { cn } from "../../utils/cn";
import { haptic } from "../../utils/haptics";
import { SPRING, TIMING } from "../../utils/animations";
import {
  brand,
  neutral,
  gradients,
  shadows,
  micro,
  typography,
  spacing,
  radius,
  accessibility,
} from "../../theme/tokens";
import { shadowPresets } from "../../utils/shadow";

// ===========================================
// TYPES
// ===========================================

type ButtonVariant =
  | "accent"
  | "glow"
  | "gradient"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "soft";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  /** Button text label */
  children: string;
  /** Press handler */
  onPress: () => void;
  /**
   * Visual style variant:
   * - accent: Rosa CTA (destaque máximo)
   * - glow: Rosa CTA com glow pulsante animado
   * - gradient: Gradiente rosa premium
   * - primary: Azul pastel (calmo)
   * - secondary: Outline azul
   * - outline: Outline customizável
   * - ghost: Sem fundo
   * - soft: Fundo suave azul
   */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Optional icon (Ionicons name) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Icon position relative to text */
  iconPosition?: "left" | "right";
  /** Loading state (shows spinner) */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom color override (for outline/ghost variants) */
  color?: string;
  /** Accessibility label override */
  accessibilityLabel?: string;
  /** Additional className for NativeWind styling */
  className?: string;
  /** Additional style overrides */
  style?: ViewStyle;
}

// ===========================================
// SIZE CONFIGS
// ===========================================

const SIZE_STYLES = {
  sm: {
    paddingVertical: spacing.md - 2, // 10px
    paddingHorizontal: spacing.lg, // 16px
    fontSize: typography.bodySmall.fontSize, // 14px
    iconSize: spacing.lg, // 16px
    minHeight: accessibility.minTapTarget, // 44px (iOS HIG)
    borderRadius: radius.md, // 12px
  },
  md: {
    paddingVertical: spacing.lg - 2, // 14px
    paddingHorizontal: spacing.xl, // 20px
    fontSize: typography.bodyMedium.fontSize, // 15px
    iconSize: spacing.lg + 2, // 18px
    minHeight: accessibility.minTapTarget, // 44px
    borderRadius: radius.md + 2, // 14px
  },
  lg: {
    paddingVertical: spacing.lg + 2, // 18px
    paddingHorizontal: spacing["2xl"], // 24px
    fontSize: typography.bodyLarge.fontSize, // 16px
    iconSize: spacing.xl, // 20px
    minHeight: accessibility.minTapTarget + spacing.sm, // 52px
    borderRadius: radius.lg, // 16px
  },
} as const;

// ===========================================
// ANIMATED PRESSABLE
// ===========================================

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ===========================================
// BUTTON COMPONENT
// ===========================================

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  color,
  accessibilityLabel,
  className,
  style,
}: ButtonProps) {
  const { button: buttonTokens, brand: themeBrand, neutral: themeNeutral, isDark } = useTheme();
  const { shouldAnimate, isActive, maxIterations } = useOptimizedAnimation();

  // Animation values
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(micro.glow.min as number);

  // Glow animation for glow variant
  useEffect(() => {
    if (variant === "glow" && !disabled && shouldAnimate && isActive) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(micro.glow.max, {
            duration: TIMING.glow.duration,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
          withTiming(micro.glow.min, {
            duration: TIMING.glow.duration,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          })
        ),
        maxIterations,
        false
      );
    } else {
      cancelAnimation(glowOpacity);
      glowOpacity.value = micro.glow.min as number;
    }
    return () => cancelAnimation(glowOpacity);
  }, [variant, disabled, glowOpacity, shouldAnimate, isActive, maxIterations]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(micro.pressScale, SPRING.snappy);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING.gentle);
  }, [scale]);

  const handlePress = useCallback(async () => {
    if (!disabled && !loading) {
      haptic.light();
      onPress();
    }
  }, [disabled, loading, onPress]);

  const currentSize = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  // Get variant-specific styles
  const getVariantStyles = useMemo(() => {
    const primary = buttonTokens.primary;
    const secondary = buttonTokens.secondary;
    const ghost = buttonTokens.ghost;
    const soft = buttonTokens.soft;

    return {
      // Rosa CTA - Destaque máximo
      accent: {
        bg: primary.background,
        text: primary.text,
        border: primary.border,
        bgPressed: primary.backgroundPressed,
        bgDisabled: primary.backgroundDisabled,
        textDisabled: primary.textDisabled,
        shadow: shadows.accentGlow,
        isGradient: false,
        hasGlow: false,
      },
      // Rosa CTA com glow animado
      glow: {
        bg: primary.background,
        text: primary.text,
        border: primary.border,
        bgPressed: primary.backgroundPressed,
        bgDisabled: primary.backgroundDisabled,
        textDisabled: primary.textDisabled,
        shadow: shadows.accentGlow,
        isGradient: false,
        hasGlow: true,
      },
      // Gradient rosa premium
      gradient: {
        bg: "transparent",
        text: neutral[900], // Navy for contrast
        border: "transparent",
        bgPressed: "transparent",
        bgDisabled: themeNeutral[200],
        textDisabled: themeNeutral[400],
        shadow: shadows.accentGlow,
        isGradient: true,
        hasGlow: false,
        gradientColors: gradients.accent,
      },
      // Azul pastel
      primary: {
        bg: themeBrand.primary[500],
        text: isDark ? themeBrand.primary[50] : themeNeutral[0],
        border: "transparent",
        bgPressed: themeBrand.primary[600],
        bgDisabled: themeNeutral[200],
        textDisabled: themeNeutral[400],
        shadow: undefined,
        isGradient: false,
        hasGlow: false,
      },
      // Outline azul
      secondary: {
        bg: secondary.background,
        text: secondary.text,
        border: secondary.border,
        bgPressed: secondary.backgroundPressed,
        bgDisabled: secondary.backgroundDisabled,
        textDisabled: secondary.textDisabled,
        shadow: undefined,
        isGradient: false,
        hasGlow: false,
      },
      // Outline customizável
      outline: {
        bg: "transparent",
        text: color || secondary.text,
        border: color || secondary.border,
        bgPressed: secondary.backgroundPressed,
        bgDisabled: "transparent",
        textDisabled: themeNeutral[400],
        shadow: undefined,
        isGradient: false,
        hasGlow: false,
      },
      // Sem fundo
      ghost: {
        bg: ghost.background,
        text: color || ghost.text,
        border: ghost.border,
        bgPressed: ghost.backgroundPressed,
        bgDisabled: ghost.backgroundDisabled,
        textDisabled: ghost.textDisabled,
        shadow: undefined,
        isGradient: false,
        hasGlow: false,
      },
      // Fundo suave azul
      soft: {
        bg: soft.background,
        text: color || soft.text,
        border: soft.border,
        bgPressed: soft.backgroundPressed,
        bgDisabled: soft.backgroundDisabled,
        textDisabled: soft.textDisabled,
        shadow: undefined,
        isGradient: false,
        hasGlow: false,
      },
    };
  }, [buttonTokens, themeBrand, themeNeutral, isDark, color]);

  const currentVariant = getVariantStyles[variant];

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // Accessibility props
  const accessibilityProps = buttonAccessibility(
    accessibilityLabel || children,
    disabled ? "Botão desabilitado" : loading ? "Carregando..." : undefined,
    isDisabled
  );

  // Text color
  const textColor = isDisabled ? currentVariant.textDisabled : currentVariant.text;

  // Render button content
  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={textColor}
              style={{ marginRight: spacing.sm }}
            />
          )}
          <Text
            style={{
              color: textColor,
              fontSize: currentSize.fontSize,
              fontFamily: typography.fontFamily.semibold,
            }}
          >
            {children}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={textColor}
              style={{ marginLeft: spacing.sm }}
            />
          )}
        </>
      )}
    </>
  );

  // Base button styles (inline required for reanimated compatibility)
  // NativeWind className handles wrapper customization, these handle internal animation
  const baseButtonStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minHeight: currentSize.minHeight,
    paddingVertical: currentSize.paddingVertical,
    paddingHorizontal: currentSize.paddingHorizontal,
    borderRadius: currentSize.borderRadius,
  };

  // Gradient variant
  if (variant === "gradient" && !isDisabled) {
    return (
      <View className={cn(fullWidth && "w-full", className)}>
        <AnimatedPressable
          {...accessibilityProps}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDisabled }}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          style={[animatedContainerStyle, style]}
        >
          <LinearGradient
            colors={gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[baseButtonStyle, currentVariant.shadow, { overflow: "hidden" }]}
          >
            {renderContent()}
          </LinearGradient>
        </AnimatedPressable>
      </View>
    );
  }

  // Glow variant
  if (currentVariant.hasGlow) {
    return (
      <View className={cn("relative", fullWidth && "w-full", className)}>
        {/* Glow layer */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: brand.accent[400],
              borderRadius: currentSize.borderRadius,
            },
            shadowPresets.colored(brand.accent[400], 1),
            animatedGlowStyle,
          ]}
          pointerEvents="none"
        />

        {/* Button */}
        <AnimatedPressable
          {...accessibilityProps}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDisabled }}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          style={[
            animatedContainerStyle,
            baseButtonStyle,
            {
              backgroundColor: isDisabled ? currentVariant.bgDisabled : currentVariant.bg,
              borderWidth: currentVariant.border !== "transparent" ? 1.5 : 0,
              borderColor: currentVariant.border,
              opacity: isDisabled ? 0.6 : 1,
            },
            currentVariant.shadow,
            style,
          ]}
        >
          {renderContent()}
        </AnimatedPressable>
      </View>
    );
  }

  // Standard variants
  return (
    <View className={cn(fullWidth && "w-full", className)}>
      <AnimatedPressable
        {...accessibilityProps}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={[
          animatedContainerStyle,
          baseButtonStyle,
          {
            backgroundColor: isDisabled ? currentVariant.bgDisabled : currentVariant.bg,
            borderWidth: currentVariant.border !== "transparent" ? 1.5 : 0,
            borderColor: currentVariant.border,
            opacity: isDisabled ? 0.6 : 1,
          },
          currentVariant.shadow,
          style,
        ]}
      >
        {renderContent()}
      </AnimatedPressable>
    </View>
  );
}

/** Legacy export for backward compatibility */
export default Button;
