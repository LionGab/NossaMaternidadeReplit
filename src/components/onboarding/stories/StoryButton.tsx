import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { brand, premium } from "../../../theme/tokens";
import { FONTS } from "../../../config/onboarding-data";

const GLASS = premium.glass;
const TEXT = premium.text;

interface StoryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export const StoryButton: React.FC<StoryButtonProps> = React.memo(
  ({ label, onPress, disabled, variant = "primary" }) => {
    const scale = useSharedValue(1);
    const glow = useSharedValue(0);

    React.useEffect(() => {
      if (!disabled && variant === "primary") {
        const pulse = () => {
          glow.value = withSequence(
            withTiming(1, {
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(0.3, {
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
            })
          );
        };
        pulse();
        const interval = setInterval(pulse, 2400);
        return () => clearInterval(interval);
      }
      return undefined;
    }, [disabled, variant, glow]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
      shadowOpacity: interpolate(glow.value, [0, 1], [0.3, 0.7]),
      shadowRadius: interpolate(glow.value, [0, 1], [8, 20]),
    }));

    const handlePress = async () => {
      if (disabled) return;
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scale.value = withSequence(
        withTiming(0.96, { duration: 80 }),
        withSpring(1, { damping: 12 })
      );
      onPress();
    };

    const isPrimary = variant === "primary";

    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={
          disabled
            ? "Botão desabilitado. Complete as etapas anteriores"
            : "Toque duas vezes para continuar"
        }
        accessibilityState={{ disabled: !!disabled }}
      >
        <Animated.View style={[animatedStyle, isPrimary && glowStyle]}>
          {isPrimary ? (
            <LinearGradient
              colors={
                disabled
                  ? [GLASS.border, GLASS.base]
                  : [brand.accent[400], brand.accent[500], brand.accent[600]]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.ctaButton, disabled && styles.ctaButtonDisabled]}
            >
              <Text style={[styles.ctaText, disabled && styles.ctaTextDisabled]}>{label}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>{label}</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    );
  }
);

StoryButton.displayName = "StoryButton";

const styles = StyleSheet.create({
  ctaButton: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: brand.accent[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonDisabled: {
    shadowOpacity: 0,
  },
  ctaText: {
    fontSize: 17,
    fontFamily: FONTS.headline,
    color: TEXT.primary,
  },
  ctaTextDisabled: {
    color: TEXT.disabled,
  },
  secondaryButton: {
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GLASS.base,
  },
  secondaryText: {
    fontSize: 15,
    fontFamily: FONTS.accent,
    color: TEXT.bright,
  },
});
