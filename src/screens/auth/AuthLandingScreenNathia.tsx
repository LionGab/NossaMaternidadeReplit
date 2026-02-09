/**
 * AuthLandingScreenNathia - Tela de Login
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Background gradient rosa/cream/azul
 * - Logo animado com NathIA
 * - Headline acolhedor
 * - Botões de login (Apple, Google, Email)
 * - Legal links footer
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

// API
import { signInWithApple, signInWithGoogle } from "../../api/social-auth";

// Components
import { Body, Caption, Title } from "@/components/ui";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
import type { RootStackScreenProps } from "@/types/navigation";

// Utils
import { logger } from "../../utils/logger";

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"AuthLanding">;

// ===========================================
// CONSTANTS
// ===========================================

const isCompact = Dimensions.get("window").height < 700;

const NATHIA_AVATAR = require("../../../assets/nathia-app.png");
const TERMS_URL = "https://nossamaternidade.com.br/termos";
const PRIVACY_URL = "https://nossamaternidade.com.br/privacidade";

// Cores do design Nathia
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
  },
  laranja: {
    DEFAULT: Tokens.maternal.warmth.peach,
    light: Tokens.maternal.warmth.honey,
  },
  cream: Tokens.maternal.warmth.cream,
  white: Tokens.neutral[0],
  text: {
    DEFAULT: Tokens.neutral[800],
    muted: Tokens.neutral[500],
    light: Tokens.neutral[600],
  },
  border: Tokens.neutral[200],
  input: Tokens.neutral[50],
  error: {
    bg: Tokens.semantic.light.errorLight,
    border: Tokens.semantic.light.errorBorder,
    text: Tokens.semantic.light.errorText,
  },
};

// ===========================================
// AUTH BUTTON COMPONENT
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
    variant === "dark" || variant === "accent" ? nathColors.white : nathColors.text.DEFAULT;

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
                  name={icon as React.ComponentProps<typeof Ionicons>["name"]}
                  size={20}
                  color={textColor}
                  style={styles.buttonIcon}
                />
              ))}
            <Body weight="bold" style={[styles.buttonText, { color: textColor }]}>
              {label}
            </Body>
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
    <Caption style={styles.dividerText}>{text}</Caption>
    <View style={styles.dividerLine} />
  </View>
);

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function AuthLandingScreenNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // Loading states
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Logo animation
  const logoScale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, [logoScale]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const anyLoading = appleLoading || googleLoading;

  // ===========================================
  // AUTH HANDLERS
  // ===========================================

  const handleApple = useCallback(async () => {
    try {
      setAppleLoading(true);
      setError(null);
      logger.info("Iniciando login com Apple", "AuthLandingNathia");

      const res = await signInWithApple();
      if (!res.success) {
        setError(res.error || "Erro ao entrar com Apple");
        logger.warn("Login Apple falhou", "AuthLandingNathia", { error: res.error });
      } else {
        logger.info("Login Apple iniciado com sucesso", "AuthLandingNathia");
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error(
        "Exceção no login Apple",
        "AuthLandingNathia",
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
      logger.info("Iniciando login com Google", "AuthLandingNathia");

      const res = await signInWithGoogle();
      if (!res.success) {
        setError(res.error || "Erro ao entrar com Google");
        logger.warn("Login Google falhou", "AuthLandingNathia", { error: res.error });
      } else {
        logger.info("Login Google iniciado com sucesso", "AuthLandingNathia");
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error(
        "Exceção no login Google",
        "AuthLandingNathia",
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

      {/* Nathia Gradient Background */}
      <LinearGradient
        colors={[nathColors.rosa.light, nathColors.cream, nathColors.azul.light]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
          {/* Glow effect */}
          <Animated.View style={[styles.logoGlow, glowStyle]} />

          {/* Logo container */}
          <View style={styles.logoContainer}>
            <Image
              source={NATHIA_AVATAR}
              style={styles.logo}
              accessibilityLabel="NathIA - Sua companheira de maternidade"
            />
          </View>
        </Animated.View>

        {/* Hero Text Section */}
        <View style={styles.heroSection}>
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <Title style={styles.headline}>Bem-vinda ao Nossa Maternidade 🩵</Title>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(350).springify()}>
            <Body style={styles.subheadline}>
              Vou te acompanhar em cada momento{"\n"}dessa jornada incrível da maternidade
            </Body>
          </Animated.View>
        </View>

        {/* Auth Buttons Section */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.authSection}>
          {/* Error Message */}
          {error && (
            <Animated.View entering={FadeIn.duration(200)} style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Tokens.semantic.light.errorText} />
              <Caption style={styles.errorText}>{error}</Caption>
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
          <Caption style={styles.legalText}>
            Ao continuar, você concorda com nossos{" "}
            <Caption style={styles.legalLink} onPress={() => handleOpenLink(TERMS_URL)}>
              Termos
            </Caption>{" "}
            e{" "}
            <Caption style={styles.legalLink} onPress={() => handleOpenLink(PRIVACY_URL)}>
              Privacidade
            </Caption>
          </Caption>
        </Animated.View>
      </View>
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nathColors.cream,
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

  logoGlow: {
    position: "absolute",
    width: isCompact ? 140 : 160,
    height: isCompact ? 140 : 160,
    borderRadius: 80,
    backgroundColor: nathColors.rosa.light,
  },

  logoContainer: {
    width: isCompact ? 100 : 120,
    height: isCompact ? 100 : 120,
    borderRadius: isCompact ? 50 : 60,
    backgroundColor: nathColors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: nathColors.rosa.DEFAULT,
    overflow: "hidden",
    ...shadows.lg,
  },

  logo: {
    width: "100%",
    height: "100%",
  },

  // Hero Section
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },

  headline: {
    fontSize: isCompact ? 26 : 32,
    lineHeight: isCompact ? 32 : 40,
    letterSpacing: -0.5,
    color: nathColors.text.DEFAULT,
    textAlign: "center",
  },

  subheadline: {
    fontSize: isCompact ? 15 : 16,
    lineHeight: isCompact ? 22 : 24,
    color: nathColors.text.muted,
    textAlign: "center",
    marginTop: spacing.lg,
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
  },

  buttonDark: {
    backgroundColor: nathColors.text.DEFAULT,
    ...shadows.md,
  },

  buttonLight: {
    backgroundColor: nathColors.white,
    borderWidth: 1.5,
    borderColor: nathColors.border,
    ...shadows.sm,
  },

  buttonAccent: {
    backgroundColor: nathColors.rosa.DEFAULT,
    ...shadows.md,
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
    backgroundColor: nathColors.border,
  },

  dividerText: {
    paddingHorizontal: spacing.lg,
    fontSize: 13,
    color: nathColors.text.muted,
  },

  // Error Box
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: nathColors.error.bg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: nathColors.error.border,
  },

  errorText: {
    flex: 1,
    fontSize: 14,
    color: nathColors.error.text,
  },

  // Footer
  footer: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },

  legalText: {
    fontSize: 12,
    color: nathColors.text.muted,
    textAlign: "center",
    lineHeight: 18,
  },

  legalLink: {
    color: nathColors.text.light,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
