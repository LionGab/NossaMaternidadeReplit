/**
 * Nossa Maternidade - ForgotPasswordScreen
 *
 * Tela de recuperacao de senha
 * Design clean com feedback em tempo real
 *
 * @version 1.0.0
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
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
import { resetPassword } from "../../api/auth";
import { Tokens, brand, neutral } from "../../theme/tokens";
import { logger } from "../../utils/logger";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Navigation types
type AuthStackParamList = {
  AuthLanding: undefined;
  EmailAuth: undefined;
  ForgotPassword: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "ForgotPassword">;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const isCompact = SCREEN_HEIGHT < 700;

// ============================================
// DESIGN SYSTEM (from Tokens)
// ============================================
const DS = {
  white: neutral[0],
  black: neutral[900],
  primary: brand.primary[500],
  accent: brand.accent[500],
  text: {
    primary: Tokens.text.light.primary,
    secondary: Tokens.text.light.secondary,
    muted: Tokens.text.light.tertiary,
  },
  border: neutral[200],
  inputBg: neutral[50],
  error: Tokens.semantic.light.error,
  success: Tokens.semantic.light.success,
};

// ============================================
// PRESSABLE WITH SCALE
// ============================================
const PressableScale = ({
  onPress,
  disabled,
  accessibilityLabel,
  children,
}: {
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  children: React.ReactNode;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  }, [disabled, onPress]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => (scale.value = withSpring(0.97))}
        onPressOut={() => (scale.value = withSpring(1))}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: !!disabled }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

// ============================================
// MAIN SCREEN
// ============================================
export default function ForgotPasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const emailRef = useRef<TextInput>(null);

  // State
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [countdown]);

  // Validation
  const validateEmail = (text: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const isValidEmail = validateEmail(email);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!email.trim()) {
      setError("Digite seu e-mail");
      return;
    }

    if (!isValidEmail) {
      setError("E-mail invalido");
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError("");

    try {
      const result = await resetPassword(email.trim().toLowerCase());

      if (result.error) {
        logger.warn("Reset password failed", "ForgotPassword", {
          error: result.error,
        });
        setError("Erro ao enviar. Tente novamente.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        setSuccess(true);
        setCountdown(60);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        logger.info("Reset password email sent", "ForgotPassword", { email });
      }
    } catch (err) {
      logger.error("Reset password exception", "ForgotPassword", err as Error);
      setError("Erro inesperado. Tente novamente.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }, [email, isValidEmail]);

  // Handle resend
  const handleResend = useCallback(() => {
    if (countdown === 0) {
      setSuccess(false);
      handleSubmit();
    }
  }, [countdown, handleSubmit]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color={DS.black} />
          </Pressable>
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          {!success ? (
            // Form State
            <>
              <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                <Text style={styles.title}>Esqueceu a senha?</Text>
                <Text style={styles.subtitle}>
                  Acontece! Digite seu e-mail e enviaremos um link para criar uma nova senha.
                </Text>
              </Animated.View>

              {/* Email Input */}
              <Animated.View
                entering={FadeInDown.delay(200).duration(400)}
                style={styles.inputContainer}
              >
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={DS.text.muted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor={DS.text.muted}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit}
                    editable={!loading}
                    accessibilityLabel="Campo de e-mail"
                    accessibilityHint="Digite seu e-mail para receber o link de recuperacao"
                  />
                  {isValidEmail && (
                    <Ionicons name="checkmark-circle" size={20} color={DS.success} />
                  )}
                </View>
              </Animated.View>

              {/* Error Message */}
              {error ? (
                <Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={DS.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              ) : null}

              {/* Submit Button */}
              <Animated.View
                entering={FadeInDown.delay(300).duration(400)}
                style={styles.buttonContainer}
              >
                <PressableScale
                  onPress={handleSubmit}
                  disabled={loading || !email.trim()}
                  accessibilityLabel={loading ? "Enviando..." : "Enviar link de recuperacao"}
                >
                  <View
                    style={[
                      styles.submitButton,
                      (loading || !email.trim()) && styles.submitButtonDisabled,
                    ]}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={DS.white} />
                    ) : (
                      <>
                        <Text style={styles.submitButtonText}>Enviar link de recuperacao</Text>
                        <Ionicons name="arrow-forward" size={20} color={DS.white} />
                      </>
                    )}
                  </View>
                </PressableScale>
              </Animated.View>
            </>
          ) : (
            // Success State
            <Animated.View entering={FadeInUp.duration(400)} style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="mail-open-outline" size={48} color={DS.primary} />
              </View>

              <Text style={styles.successTitle}>E-mail enviado!</Text>
              <Text style={styles.successSubtitle}>
                Enviamos um link para{"\n"}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>

              <Text style={styles.successHint}>Verifique sua caixa de entrada e spam.</Text>

              {/* Resend Button */}
              <View style={styles.resendContainer}>
                {countdown > 0 ? (
                  <Text style={styles.countdownText}>Reenviar em {countdown}s</Text>
                ) : (
                  <Pressable
                    onPress={handleResend}
                    accessibilityLabel="Reenviar e-mail"
                    accessibilityRole="button"
                  >
                    <Text style={styles.resendText}>Nao recebeu? Reenviar</Text>
                  </Pressable>
                )}
              </View>

              {/* Back to Login */}
              <Animated.View
                entering={FadeInUp.delay(200).duration(400)}
                style={styles.backToLoginContainer}
              >
                <PressableScale
                  onPress={() => navigation.goBack()}
                  accessibilityLabel="Voltar para login"
                >
                  <View style={styles.backToLoginButton}>
                    <Ionicons name="arrow-back" size={18} color={DS.primary} />
                    <Text style={styles.backToLoginText}>Voltar para login</Text>
                  </View>
                </PressableScale>
              </Animated.View>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.white,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: neutral[50],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: isCompact ? 24 : 48,
  },
  title: {
    fontSize: isCompact ? 28 : 32,
    fontWeight: "700",
    color: DS.black,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: DS.text.secondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DS.inputBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: DS.border,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: DS.text.primary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${DS.error}10`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: DS.error,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DS.black,
    paddingVertical: 18,
    borderRadius: 14,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: DS.white,
  },
  // Success State
  successContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: isCompact ? 32 : 64,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: `${DS.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: DS.black,
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: DS.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  emailHighlight: {
    fontWeight: "600",
    color: DS.primary,
  },
  successHint: {
    fontSize: 14,
    color: DS.text.muted,
    marginBottom: 32,
  },
  resendContainer: {
    marginBottom: 32,
  },
  countdownText: {
    fontSize: 14,
    color: DS.text.muted,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "600",
    color: DS.primary,
  },
  backToLoginContainer: {
    marginTop: 16,
  },
  backToLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: `${DS.primary}10`,
  },
  backToLoginText: {
    fontSize: 15,
    fontWeight: "600",
    color: DS.primary,
  },
});
