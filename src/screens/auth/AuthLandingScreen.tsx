/**
 * Nossa Maternidade - AuthLandingScreen
 *
 * DESIGN: Flo Health Minimal Style
 * Clean, welcoming authentication landing with subtle elegance
 *
 * Design principles:
 * - Clean, welcoming design with generous whitespace
 * - App logo/branding area at top with subtle glow
 * - Social login buttons (Google, Apple) with clean styling
 * - Email login option
 * - Subtle gradient background
 * - Privacy policy/terms link at bottom
 *
 * @version 5.0.0 - Flo Health Minimal Redesign
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { signInWithApple, signInWithGoogle } from "../../api/social-auth";
import { logger } from "../../utils/logger";
import { Tokens, brand, neutral, radius, shadows, spacing, typography } from "../../theme/tokens";

// Types
import type { RootStackScreenProps } from "@/types/navigation";

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"AuthLanding">;

// ===========================================
// CONSTANTS
// ===========================================

const isCompact = Dimensions.get("window").height < 700;

const LOGO = require("../../../assets/logo.png");
const TERMS_URL = "https://nossamaternidade.com.br/termos";
const PRIVACY_URL = "https://nossamaternidade.com.br/privacidade";

// ===========================================
// DESIGN TOKENS - Flo Minimal Style
// ===========================================

const DS = {
  // Background gradient - subtle and warm
  gradient: {
    colors: [neutral[0], Tokens.cleanDesign.pink[50], Tokens.cleanDesign.pink[100]] as const,
  },

  // Text hierarchy
  text: {
    headline: neutral[900],
    body: neutral[600],
    muted: neutral[500],
    link: neutral[700],
  },

  // Button styles
  button: {
    dark: {
      bg: neutral[900],
      text: neutral[0],
    },
    light: {
      bg: neutral[0],
      text: neutral[900],
      border: neutral[200],
    },
    accent: {
      bg: brand.accent[500],
      text: neutral[0],
    },
  },

  // Error state
  error: Tokens.semantic.light.error,
  errorBg: Tokens.semantic.light.errorLight,
};

// ===========================================
// PRESSABLE BUTTON COMPONENT
// Minimal, clean button with scale animation
// ===========================================

interface AuthButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant: "dark" | "light" | "accent";
  icon?: string;
  iconComponent?: React.ReactNode;
  label: string;
}

const AuthButton = ({
  onPress,
  disabled = false,
  loading = false,
  variant,
  icon,
  iconComponent,
  label,
}: AuthButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  }, [disabled, loading, onPress]);

  const getButtonStyle = () => {
    switch (variant) {
      case "dark":
        return styles.buttonDark;
      case "accent":
        return styles.buttonAccent;
      default:
        return styles.buttonLight;
    }
  };

  const textColor =
    variant === "dark" || variant === "accent" ? DS.button.dark.text : DS.button.light.text;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[styles.button, getButtonStyle(), (disabled || loading) && styles.buttonDisabled]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <View style={styles.buttonContent}>
            {iconComponent ||
              (icon && (
                <Ionicons
                  name={icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={textColor}
                  style={styles.buttonIcon}
                />
              ))}
            <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

// ===========================================
// DIVIDER COMPONENT
// ===========================================

const Divider = ({ text }: { text: string }) => (
  <View style={styles.divider}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>{text}</Text>
    <View style={styles.dividerLine} />
  </View>
);

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function AuthLandingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // Loading states
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Logo entrance animation
  const logoScale = useSharedValue(0.9);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, [logoScale]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const anyLoading = appleLoading || googleLoading;

  // ===========================================
  // AUTH HANDLERS
  // ===========================================

  const handleApple = useCallback(async () => {
    try {
      setAppleLoading(true);
      setError(null);
      logger.info("Iniciando login com Apple", "AuthLanding");

      const res = await signInWithApple();
      if (!res.success) {
        setError(res.error || "Erro ao entrar com Apple");
        logger.warn("Login Apple falhou", "AuthLanding", { error: res.error });
      } else {
        logger.info("Login Apple iniciado com sucesso", "AuthLanding", {
          platform: Platform.OS,
          hasUser: !!res.user,
        });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error(
        "Excecao no login Apple",
        "AuthLanding",
        e instanceof Error ? e : new Error(errorMsg)
      );
    } finally {
      setAppleLoading(false);
    }
  }, []);

  const handleGoogle = useCallback(async () => {
    try {
      setGoogleLoading(true);
      setError(null);
      logger.info("Iniciando login com Google", "AuthLanding");

      const res = await signInWithGoogle();
      if (!res.success) {
        setError(res.error || "Erro ao entrar com Google");
        logger.warn("Login Google falhou", "AuthLanding", { error: res.error });
      } else {
        logger.info("Login Google iniciado com sucesso", "AuthLanding", {
          platform: Platform.OS,
          hasUser: !!res.user,
        });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error(
        "Excecao no login Google",
        "AuthLanding",
        e instanceof Error ? e : new Error(errorMsg)
      );
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  const handleEmail = useCallback(() => {
    setError(null);
    navigation.navigate("EmailAuth");
  }, [navigation]);

  const handleOpenLink = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Subtle Gradient Background */}
      <LinearGradient
        colors={DS.gradient.colors}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Main Content */}
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + spacing["2xl"],
            paddingBottom: Math.max(insets.bottom, spacing["2xl"]),
          },
        ]}
      >
        {/* Logo & Branding Section */}
        <Animated.View
          entering={FadeIn.duration(600)}
          style={[styles.brandingSection, logoAnimatedStyle]}
        >
          <View style={styles.logoContainer}>
            <Image source={LOGO} style={styles.logo} accessibilityLabel="Nossa Maternidade" />
          </View>
        </Animated.View>

        {/* Hero Text Section */}
        <View style={styles.heroSection}>
          <Animated.Text entering={FadeInUp.delay(200).springify()} style={styles.headline}>
            Bem-vinda a sua{"\n"}jornada
          </Animated.Text>

          <Animated.Text entering={FadeInUp.delay(350).springify()} style={styles.subheadline}>
            Cuidado, apoio e rotinas personalizadas{"\n"}para cada fase da maternidade
          </Animated.Text>
        </View>

        {/* Auth Buttons Section */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.authSection}>
          {/* Error Message */}
          {error && (
            <Animated.View entering={FadeIn.duration(200)} style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={DS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}

          {/* Social Login Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Apple Sign In - iOS only */}
            {Platform.OS === "ios" && (
              <AuthButton
                variant="dark"
                icon="logo-apple"
                label="Continuar com Apple"
                onPress={handleApple}
                loading={appleLoading}
                disabled={anyLoading && !appleLoading}
              />
            )}

            {/* Google Sign In */}
            <AuthButton
              variant="light"
              iconComponent={
                <Image
                  source={require("../../../assets/google-logo.jpg")}
                  style={styles.googleIcon}
                  resizeMode="contain"
                />
              }
              label="Continuar com Google"
              onPress={handleGoogle}
              loading={googleLoading}
              disabled={anyLoading && !googleLoading}
            />

            {/* Divider */}
            <Divider text="ou" />

            {/* Email Sign In */}
            <AuthButton
              variant="accent"
              icon="mail-outline"
              label="Continuar com e-mail"
              onPress={handleEmail}
              disabled={anyLoading}
            />
          </View>
        </Animated.View>

        {/* Footer - Terms & Privacy */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.footer}>
          <Text style={styles.legalText}>
            Ao continuar, voce concorda com nossos{" "}
            <Text
              style={styles.legalLink}
              onPress={() => handleOpenLink(TERMS_URL)}
              accessibilityRole="link"
              accessibilityLabel="Ver termos de uso"
            >
              Termos
            </Text>{" "}
            e{" "}
            <Text
              style={styles.legalLink}
              onPress={() => handleOpenLink(PRIVACY_URL)}
              accessibilityRole="link"
              accessibilityLabel="Ver politica de privacidade"
            >
              Privacidade
            </Text>
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

// ===========================================
// STYLES - Flo Health Minimal
// ===========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral[0],
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing["2xl"],
  },

  // Branding Section
  brandingSection: {
    alignItems: "center",
    paddingTop: isCompact ? spacing.lg : spacing["3xl"],
  },

  logoContainer: {
    width: isCompact ? 100 : 120,
    height: isCompact ? 100 : 120,
    borderRadius: radius.full,
    backgroundColor: neutral[0],
    justifyContent: "center",
    alignItems: "center",
    ...shadows.flo.soft,
    shadowColor: Tokens.cleanDesign.pink[300],
    borderWidth: 1,
    borderColor: Tokens.cleanDesign.pink[100],
  },

  logo: {
    width: isCompact ? 90 : 110,
    height: isCompact ? 90 : 110,
    borderRadius: radius.full,
  },

  // Hero Section
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },

  headline: {
    fontSize: isCompact ? 28 : 34,
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
    color: DS.text.headline,
    textAlign: "center",
    lineHeight: isCompact ? 34 : 42,
    letterSpacing: -0.5,
  },

  subheadline: {
    fontSize: isCompact ? 15 : 16,
    fontFamily: typography.fontFamily.base,
    color: DS.text.body,
    textAlign: "center",
    lineHeight: isCompact ? 22 : 24,
    marginTop: spacing.xl,
  },

  // Auth Section
  authSection: {
    paddingBottom: spacing.lg,
  },

  buttonsContainer: {
    gap: spacing.md,
  },

  // Button Styles
  button: {
    height: 56,
    borderRadius: radius["2xl"],
    justifyContent: "center",
    alignItems: "center",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonIcon: {
    marginRight: spacing.sm + 2,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
  },

  buttonDark: {
    backgroundColor: DS.button.dark.bg,
    ...shadows.flo.cta,
    shadowColor: neutral[900],
  },

  buttonLight: {
    backgroundColor: DS.button.light.bg,
    borderWidth: 1,
    borderColor: DS.button.light.border,
    ...shadows.flo.minimal,
  },

  buttonAccent: {
    backgroundColor: DS.button.accent.bg,
    ...shadows.flo.cta,
    shadowColor: brand.accent[400],
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  googleIcon: {
    width: 20,
    height: 20,
    marginRight: spacing.sm + 2,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: neutral[200],
  },

  dividerText: {
    paddingHorizontal: spacing.lg,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: DS.text.muted,
  },

  // Error Box
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: DS.errorBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: Tokens.semantic.light.error + "30",
  },

  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: DS.error,
  },

  // Footer
  footer: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },

  legalText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.base,
    color: DS.text.muted,
    textAlign: "center",
    lineHeight: 18,
  },

  legalLink: {
    color: DS.text.link,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
