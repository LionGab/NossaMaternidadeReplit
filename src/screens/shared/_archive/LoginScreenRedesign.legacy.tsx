/**
 * LoginScreen - Flo Health Minimal Design
 *
 * DESIGN CONCEPT: "Clean Maternal Welcome"
 * A minimal, welcoming entry point inspired by Flo Health's
 * clean aesthetic with soft pink gradients and spacious layouts.
 *
 * AESTHETIC:
 * - Soft pink to white gradient (warm, maternal)
 * - Clean, spacious card design
 * - Minimal visual noise
 * - Generous whitespace
 * - Subtle shadows with pink tints
 *
 * DESIGN PRINCIPLES:
 * 1. Clean, welcoming design
 * 2. Subtle gradient background (pink to white)
 * 3. Clean input fields
 * 4. Social login options
 * 5. Uses Tokens from theme for all colors
 * 6. Button component for CTAs
 *
 * EXPO GO COMPATIBLE
 *
 * @version 3.0.0 - Flo Health Minimal Redesign
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { signInWithMagicLink } from "@/api/auth";
import { signInWithApple, signInWithGoogle } from "@/api/social-auth";
import { Button } from "@/components/ui/Button";
import {
  Tokens,
  brand,
  cleanDesign,
  neutral,
  shadows,
  typography,
  spacing,
  radius,
} from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";

type Props = RootStackScreenProps<"Login">;

// ============================================
// DESIGN SYSTEM - Flo Health Minimal
// ============================================

const COLORS = {
  // Background gradient (pink to white)
  gradientStart: cleanDesign.pink[50], // #FFF5F7
  gradientMid: cleanDesign.pink[100], // #FFE4EC
  gradientEnd: neutral[0], // #FFFFFF

  // Text hierarchy
  textPrimary: neutral[800], // #1F2937
  textSecondary: neutral[500], // #6B7280
  textTertiary: neutral[400], // #9CA3AF
  textMuted: neutral[300], // #D1D5DB

  // Card & Surfaces
  cardBg: neutral[0], // #FFFFFF
  cardBorder: cleanDesign.pink[100], // #FFE4EC

  // Inputs
  inputBg: neutral[50], // #F9FAFB
  inputBorder: neutral[200], // #E5E7EB
  inputFocus: brand.accent[400], // #FB7196

  // CTA
  ctaPrimary: brand.accent[500], // #F43F68
  ctaText: neutral[0], // #FFFFFF

  // Social buttons
  socialBg: neutral[0], // #FFFFFF
  socialBorder: neutral[200], // #E5E7EB
  socialText: neutral[700], // #374151

  // States
  error: Tokens.semantic.light.error,
  success: Tokens.semantic.light.success,
  successBg: Tokens.semantic.light.successLight,
};

const FONTS = {
  display: typography.fontFamily.display,
  headline: typography.fontFamily.bold,
  body: typography.fontFamily.base,
  medium: typography.fontFamily.medium,
  semibold: typography.fontFamily.semibold,
};

// ============================================
// SOCIAL BUTTON COMPONENT (Minimal Style)
// ============================================

interface SocialButtonProps {
  type: "apple" | "google";
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}

const SocialLoginButton: React.FC<SocialButtonProps> = React.memo(
  ({ type, onPress, loading, disabled }) => {
    const isApple = type === "apple";

    const handlePress = useCallback(() => {
      if (!disabled && !loading) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }
    }, [disabled, loading, onPress]);

    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.socialButton,
          pressed && styles.socialButtonPressed,
          disabled && styles.socialButtonDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Entrar com ${isApple ? "Apple" : "Google"}`}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {loading ? (
          <View style={styles.socialButtonContent}>
            <Text style={styles.socialButtonText}>Carregando...</Text>
          </View>
        ) : (
          <View style={styles.socialButtonContent}>
            <Ionicons
              name={isApple ? "logo-apple" : "logo-google"}
              size={20}
              color={COLORS.socialText}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>
              Continuar com {isApple ? "Apple" : "Google"}
            </Text>
          </View>
        )}
      </Pressable>
    );
  }
);

SocialLoginButton.displayName = "SocialLoginButton";

// ============================================
// EMAIL INPUT COMPONENT (Minimal Style)
// ============================================

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled: boolean;
}

const EmailInputField: React.FC<EmailInputProps> = React.memo(
  ({ value, onChange, error, disabled }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            error && styles.inputWrapperError,
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={isFocused ? COLORS.inputFocus : COLORS.textTertiary}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={COLORS.textMuted}
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            accessibilityLabel="Campo de email"
            accessibilityHint="Digite seu endere\u00e7o de email"
          />
        </View>
        {error && (
          <Animated.View entering={FadeInDown.duration(200)} style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={14} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}
      </View>
    );
  }
);

EmailInputField.displayName = "EmailInputField";

// ============================================
// MAIN SCREEN
// ============================================

export default function LoginScreenRedesign(_props: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();

  // State
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const anyLoading = loading || appleLoading || googleLoading;
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // Handlers
  const handleApple = async () => {
    try {
      setAppleLoading(true);
      setError(null);
      const res = await signInWithApple();
      if (!res.success) setError(res.error || "Erro ao entrar com Apple");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setAppleLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      setError(null);
      const res = await signInWithGoogle();
      if (!res.success) setError(res.error || "Erro ao entrar com Google");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmail = async () => {
    Keyboard.dismiss();
    if (!email) return setError("Digite seu email");
    if (!isValidEmail(email)) return setError("Email inv\u00e1lido");

    try {
      setLoading(true);
      setError(null);
      const { error: err } = await signInWithMagicLink(email.trim());
      if (err) return setError(err instanceof Error ? err.message : "Erro");
      setSuccess("Link m\u00e1gico enviado! Verifique seu email.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Background gradient - soft pink to white */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <Pressable onPress={Keyboard.dismiss} style={styles.flex}>
          {/* Header section */}
          <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
            {/* Logo */}
            <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.logoContainer}>
              <Image
                source={require("../../../assets/logo.png")}
                style={styles.logo}
                contentFit="contain"
                accessibilityLabel="Logo Nossa Maternidade"
              />
            </Animated.View>

            {/* Welcome text */}
            <Animated.View
              entering={FadeInUp.delay(200).duration(500)}
              style={styles.welcomeContainer}
            >
              <Text style={styles.welcomeTitle}>Bem-vinda</Text>
              <Text style={styles.welcomeSubtitle}>
                Sua jornada na maternidade{"\n"}come\u00e7a aqui
              </Text>
            </Animated.View>
          </View>

          {/* Auth card */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(500)}
            style={[styles.cardContainer, { paddingBottom: insets.bottom + 24 }]}
          >
            <View style={styles.card}>
              {/* Social buttons */}
              <View style={styles.socialSection}>
                {Platform.OS === "ios" ? (
                  <>
                    <SocialLoginButton
                      type="apple"
                      onPress={handleApple}
                      loading={appleLoading}
                      disabled={anyLoading && !appleLoading}
                    />
                    <SocialLoginButton
                      type="google"
                      onPress={handleGoogle}
                      loading={googleLoading}
                      disabled={anyLoading && !googleLoading}
                    />
                  </>
                ) : (
                  <>
                    <SocialLoginButton
                      type="google"
                      onPress={handleGoogle}
                      loading={googleLoading}
                      disabled={anyLoading && !googleLoading}
                    />
                    <SocialLoginButton
                      type="apple"
                      onPress={handleApple}
                      loading={appleLoading}
                      disabled={anyLoading && !appleLoading}
                    />
                  </>
                )}
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Email input */}
              <EmailInputField
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  if (error) setError(null);
                  if (success) setSuccess(null);
                }}
                error={error || undefined}
                disabled={anyLoading}
              />

              {/* Success message */}
              {success && (
                <Animated.View entering={FadeInDown.duration(300)} style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                  <Text style={styles.successText}>{success}</Text>
                </Animated.View>
              )}

              {/* CTA Button */}
              <View style={styles.ctaContainer}>
                <Button
                  variant="accent"
                  size="lg"
                  onPress={handleEmail}
                  loading={loading}
                  disabled={anyLoading && !loading}
                  fullWidth
                >
                  Continuar
                </Button>
              </View>

              {/* Legal */}
              <Text style={styles.legal}>
                Ao continuar, voc\u00ea concorda com nossos{" "}
                <Text style={styles.legalLink}>Termos</Text> e{" "}
                <Text style={styles.legalLink}>Privacidade</Text>
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

// ============================================
// STYLES - Flo Health Minimal
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gradientStart,
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["3xl"],
  },
  logoContainer: {
    marginBottom: spacing["3xl"],
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: radius["2xl"],
  },

  // Welcome text
  welcomeContainer: {
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: FONTS.display,
    color: COLORS.textPrimary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },

  // Card
  cardContainer: {
    paddingHorizontal: spacing.xl,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: radius["3xl"],
    padding: spacing["2xl"],
    ...shadows.flo.soft,
  },

  // Social buttons
  socialSection: {
    gap: spacing.md,
  },
  socialButton: {
    backgroundColor: COLORS.socialBg,
    borderWidth: 1,
    borderColor: COLORS.socialBorder,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  socialButtonPressed: {
    backgroundColor: neutral[50],
  },
  socialButtonDisabled: {
    opacity: 0.5,
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    marginRight: spacing.md,
  },
  socialButtonText: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.socialText,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing["2xl"],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.cardBorder,
  },
  dividerText: {
    paddingHorizontal: spacing.lg,
    fontSize: 13,
    fontFamily: FONTS.body,
    color: COLORS.textTertiary,
  },

  // Input
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: FONTS.semibold,
    color: COLORS.textSecondary,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  inputWrapperFocused: {
    borderColor: COLORS.inputFocus,
    backgroundColor: neutral[0],
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.body,
    color: COLORS.textPrimary,
    paddingVertical: spacing.lg,
  },

  // Error
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.error,
  },

  // Success message
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: COLORS.successBg,
    borderRadius: radius.md,
  },
  successText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.success,
    flex: 1,
  },

  // CTA
  ctaContainer: {
    marginTop: spacing.sm,
  },

  // Legal
  legal: {
    fontSize: 11,
    fontFamily: FONTS.body,
    color: COLORS.textTertiary,
    textAlign: "center",
    lineHeight: 16,
    marginTop: spacing.xl,
  },
  legalLink: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.semibold,
  },
});
