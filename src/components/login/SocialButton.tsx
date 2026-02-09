/**
 * SocialButton - Social authentication button (Apple, Google)
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { ActivityIndicator, Image, Pressable, Text, View, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { premium, typography } from "../../theme/tokens";

type SocialAuthType = "apple" | "google";

interface SocialButtonProps {
  type: SocialAuthType;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = React.memo(
  ({ type, onPress, loading, disabled }) => {
    const scale = useSharedValue(1);
    const isApple = type === "apple";

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = useCallback(() => {
      if (!disabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }
    }, [disabled, onPress]);

    const getLabel = () => {
      return isApple ? "Continuar com Apple" : "Continuar com Google";
    };

    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={handlePress}
          onPressIn={() => {
            scale.value = withSpring(0.97, { damping: 15 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 12 });
          }}
          disabled={disabled || loading}
          accessibilityRole="button"
          accessibilityLabel={getLabel()}
          accessibilityState={{ disabled: disabled || loading }}
          accessibilityHint={`Toque duas vezes para fazer login com ${isApple ? "Apple" : "Google"}`}
        >
          <View
            style={[
              styles.socialButton,
              isApple ? styles.socialButtonApple : styles.socialButtonGoogle,
              disabled && styles.socialButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={premium.text.primary} size="small" />
            ) : (
              <>
                {isApple ? (
                  <Ionicons name="logo-apple" size={20} color={premium.text.primary} />
                ) : (
                  <Image
                    source={require("../../../assets/google-logo.jpg")}
                    style={styles.googleLogo}
                    resizeMode="contain"
                    accessible={false}
                  />
                )}
                <Text style={styles.socialButtonText}>{getLabel()}</Text>
              </>
            )}
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

SocialButton.displayName = "SocialButton";

const COLORS = {
  textPrimary: premium.text.primary,
  glassBg: premium.glass.background,
  glassBorder: premium.glass.border,
};

const styles = StyleSheet.create({
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 14,
    gap: 10,
  },
  socialButtonApple: {
    backgroundColor: COLORS.textPrimary,
  },
  socialButtonGoogle: {
    backgroundColor: COLORS.glassBg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  socialButtonDisabled: {
    opacity: 0.5,
  },
  socialButtonText: {
    fontSize: 15,
    fontFamily: typography.fontFamily.semibold,
    color: COLORS.textPrimary,
  },
  googleLogo: {
    width: 18,
    height: 18,
  },
});
