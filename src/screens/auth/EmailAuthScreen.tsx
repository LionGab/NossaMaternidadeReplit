/**
 * Nossa Maternidade - EmailAuthScreen
 *
 * Tela de autenticacao por e-mail (Login + Cadastro)
 * Design Flo Health Minimal - Ultra Clean
 *
 * FEATURES:
 * - Login com email + senha
 * - Cadastro com nome + email + senha
 * - Toggle suave entre modos
 * - Validacao em tempo real
 * - Feedback visual minimal
 * - Animacoes de entrada suaves
 *
 * @version 4.0.0 - Flo Health Minimal Redesign
 */

import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  Layout,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { signIn, signUp } from "@/api/auth";
import { Button } from "../../components/ui/Button";
import { Tokens, brand, neutral, shadows, typography } from "../../theme/tokens";
import { logger } from "../../utils/logger";
import { useDocumentMetadata } from "../../hooks/useDocumentMetadata";

// Navigation types
type AuthStackParamList = {
  AuthLanding: undefined;
  EmailAuth: undefined;
  ForgotPassword: undefined;
  Login: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "EmailAuth">;
};

// ============================================
// DESIGN TOKENS - Flo Health Minimal
// ============================================
const colors = {
  // Background gradient (subtle pink to white)
  gradientStart: Tokens.cleanDesign.pink[50],
  gradientMid: Tokens.neutral[0],
  gradientEnd: Tokens.cleanDesign.pink[50],

  // Text
  textPrimary: Tokens.text.light.primary,
  textSecondary: Tokens.text.light.secondary,
  textMuted: Tokens.text.light.tertiary,

  // Input
  inputBg: neutral[0],
  inputBorder: Tokens.cleanDesign.pink[200],
  inputBorderFocus: brand.accent[400],

  // Accent
  accent: brand.accent[500],
  accentLight: brand.accent[100],

  // Semantic
  error: Tokens.semantic.light.error,
  success: Tokens.semantic.light.success,
};

const EMAIL_AUTH_METADATA = {
  login: {
    title: "Entrar com e-mail | Nossa Maternidade",
    description:
      "Entre com seu e-mail e senha para acessar conteúdos, notificações e a comunidade que te entende.",
  },
  signup: {
    title: "Criar conta | Nossa Maternidade",
    description:
      "Crie sua conta para guardar hábitos, lembretes e o histórico da sua jornada na maternidade.",
  },
};

// ============================================
// MINIMAL INPUT COMPONENT
// ============================================
const MinimalInput = React.memo(
  ({
    icon,
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType = "default",
    autoCapitalize = "none",
    returnKeyType = "next",
    onSubmitEditing,
    inputRef,
    error,
    disabled,
    rightIcon,
    onRightIconPress,
    accessibilityLabel,
    accessibilityHint,
  }: {
    icon: string;
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address";
    autoCapitalize?: "none" | "sentences" | "words";
    returnKeyType?: "next" | "done";
    onSubmitEditing?: () => void;
    inputRef?: React.RefObject<TextInput | null>;
    error?: string | null;
    disabled?: boolean;
    rightIcon?: string;
    onRightIconPress?: () => void;
    accessibilityLabel: string;
    accessibilityHint: string;
  }) => {
    const [focused, setFocused] = useState(false);
    const borderProgress = useSharedValue(0);

    useEffect(() => {
      borderProgress.value = withTiming(focused ? 1 : 0, { duration: 200 });
    }, [focused, borderProgress]);

    const animatedBorderStyle = useAnimatedStyle(() => ({
      borderColor: interpolateColor(
        borderProgress.value,
        [0, 1],
        [error ? colors.error : colors.inputBorder, colors.inputBorderFocus]
      ),
    }));

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Animated.View
          style={[
            styles.inputContainer,
            animatedBorderStyle,
            error && styles.inputError,
            focused && styles.inputFocused,
          ]}
        >
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={20}
            color={focused ? colors.accent : colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            secureTextEntry={secureTextEntry}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            editable={!disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
          />
          {rightIcon && (
            <Pressable
              onPress={onRightIconPress}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={secureTextEntry ? "Mostrar senha" : "Ocultar senha"}
              accessibilityRole="button"
            >
              <Ionicons
                name={rightIcon as keyof typeof Ionicons.glyphMap}
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          )}
        </Animated.View>
        {error && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}
      </View>
    );
  }
);

MinimalInput.displayName = "MinimalInput";

// ============================================
// TAB TOGGLE COMPONENT
// ============================================
const TabToggle = React.memo(
  ({
    isLogin,
    onToggle,
    disabled,
  }: {
    isLogin: boolean;
    onToggle: () => void;
    disabled: boolean;
  }) => {
    const slidePosition = useSharedValue(isLogin ? 0 : 1);

    useEffect(() => {
      slidePosition.value = withSpring(isLogin ? 0 : 1, {
        damping: 20,
        stiffness: 150,
      });
    }, [isLogin, slidePosition]);

    const sliderStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: slidePosition.value * 152 }],
    }));

    return (
      <Animated.View entering={FadeInDown.delay(100)} style={styles.tabContainer}>
        <Pressable
          onPress={onToggle}
          disabled={disabled}
          style={styles.tabTrack}
          accessibilityRole="switch"
          accessibilityState={{ checked: !isLogin }}
          accessibilityLabel={
            isLogin
              ? "Modo login ativo. Toque para criar conta"
              : "Modo cadastro ativo. Toque para fazer login"
          }
        >
          <Animated.View style={[styles.tabSlider, sliderStyle]} />
          <View style={styles.tabLabels}>
            <Text style={[styles.tabLabel, isLogin && styles.tabLabelActive]}>Entrar</Text>
            <Text style={[styles.tabLabel, !isLogin && styles.tabLabelActive]}>Criar conta</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

TabToggle.displayName = "TabToggle";

// ============================================
// MAIN SCREEN
// ============================================
export default function EmailAuthScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // State
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const metadata = isLogin ? EMAIL_AUTH_METADATA.login : EMAIL_AUTH_METADATA.signup;
  useDocumentMetadata(metadata.title, metadata.description);

  // Field-level errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Validation helpers
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isValidPassword = (v: string) => v.length >= 6;
  const isValidName = (v: string) => v.trim().length >= 2;

  // Can submit
  const canSubmit = isLogin
    ? isValidEmail(email) && password.length >= 6 && !loading
    : isValidName(name) &&
      isValidEmail(email) &&
      password.length >= 6 &&
      confirmPassword === password &&
      !loading;

  // Clear errors on mode change
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  }, [isLogin]);

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggleMode = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLogin((prev) => !prev);
  }, []);

  const clearFieldErrors = useCallback(() => {
    setError(null);
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  }, []);

  const validateFields = useCallback((): boolean => {
    let valid = true;
    clearFieldErrors();

    if (!isLogin && !isValidName(name)) {
      setNameError("Nome deve ter pelo menos 2 caracteres");
      valid = false;
    }

    if (!email.trim()) {
      setEmailError("Digite seu e-mail");
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("E-mail inválido");
      valid = false;
    }

    if (!isValidPassword(password)) {
      setPasswordError("Senha deve ter pelo menos 6 caracteres");
      valid = false;
    }

    if (!isLogin && password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem");
      valid = false;
    }

    return valid;
  }, [isLogin, name, email, password, confirmPassword, clearFieldErrors]);

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();

    if (!validateFields()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (isLogin) {
        // LOGIN
        logger.info("Tentando login com senha", "EmailAuth", { email: email.trim() });
        const { error: apiError } = await signIn(email.trim(), password);

        if (apiError) {
          const errorMsg = apiError instanceof Error ? apiError.message : String(apiError);
          if (errorMsg.includes("Invalid login")) {
            setError("E-mail ou senha incorretos");
          } else if (errorMsg.includes("Email not confirmed")) {
            setError("Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.");
          } else {
            setError(errorMsg);
          }
          logger.warn("Erro no login", "EmailAuth", { error: errorMsg });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return;
        }

        logger.info("Login realizado com sucesso", "EmailAuth");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Navigation happens automatically via auth state
      } else {
        // SIGNUP
        logger.info("Tentando criar conta", "EmailAuth", {
          email: email.trim(),
          name: name.trim(),
        });
        const { error: apiError } = await signUp(email.trim(), password, name.trim());

        if (apiError) {
          const errorMsg = apiError instanceof Error ? apiError.message : String(apiError);
          if (errorMsg.includes("already registered")) {
            setError("Este e-mail já está cadastrado. Tente fazer login.");
          } else {
            setError(errorMsg);
          }
          logger.warn("Erro no cadastro", "EmailAuth", { error: errorMsg });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return;
        }

        logger.info("Conta criada com sucesso", "EmailAuth");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSuccess("Conta criada! Verifique seu e-mail para confirmar.");
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error("Exceção no auth", "EmailAuth", e instanceof Error ? e : new Error(errorMsg));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }, [isLogin, name, email, password, validateFields]);

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={Keyboard.dismiss} style={styles.flex}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
              <Pressable
                onPress={handleBack}
                style={styles.backButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityLabel="Voltar"
                accessibilityRole="button"
              >
                <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* Title Section */}
              <Animated.View entering={FadeInDown.delay(50)} style={styles.titleSection}>
                <Text style={styles.title}>
                  {isLogin ? "Bem-vinda de volta" : "Crie sua conta"}
                </Text>
                <Text style={styles.subtitle}>
                  {isLogin ? "Entre com seu e-mail e senha" : "Preencha os dados para começar"}
                </Text>
              </Animated.View>

              {/* Tab Toggle */}
              <TabToggle isLogin={isLogin} onToggle={handleToggleMode} disabled={loading} />

              {/* Form */}
              <Animated.View layout={Layout.springify()} style={styles.form}>
                {/* Name (only for signup) */}
                {!isLogin && (
                  <Animated.View entering={FadeInDown.delay(150)} exiting={FadeOut.duration(150)}>
                    <MinimalInput
                      icon="person-outline"
                      label="Nome"
                      value={name}
                      onChangeText={(text) => {
                        setName(text);
                        if (nameError) setNameError(null);
                      }}
                      placeholder="Seu nome"
                      autoCapitalize="words"
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                      inputRef={nameRef}
                      error={nameError}
                      disabled={loading}
                      accessibilityLabel="Nome completo"
                      accessibilityHint="Digite seu nome para criar a conta"
                    />
                  </Animated.View>
                )}

                {/* Email */}
                <Animated.View entering={FadeInDown.delay(isLogin ? 150 : 200)}>
                  <MinimalInput
                    icon="mail-outline"
                    label="E-mail"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="seu@email.com"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    inputRef={emailRef}
                    error={emailError}
                    disabled={loading}
                    accessibilityLabel="Endereço de e-mail"
                    accessibilityHint="Digite seu e-mail"
                  />
                </Animated.View>

                {/* Password */}
                <Animated.View entering={FadeInDown.delay(isLogin ? 200 : 250)}>
                  <MinimalInput
                    icon="lock-closed-outline"
                    label="Senha"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Mínimo 6 caracteres"
                    secureTextEntry={!showPassword}
                    returnKeyType={isLogin ? "done" : "next"}
                    onSubmitEditing={
                      isLogin ? handleSubmit : () => confirmPasswordRef.current?.focus()
                    }
                    inputRef={passwordRef}
                    error={passwordError}
                    disabled={loading}
                    rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    accessibilityLabel="Senha"
                    accessibilityHint="Digite sua senha"
                  />
                </Animated.View>

                {/* Confirm Password (only for signup) */}
                {!isLogin && (
                  <Animated.View entering={FadeInDown.delay(300)} exiting={FadeOut.duration(150)}>
                    <MinimalInput
                      icon="lock-closed-outline"
                      label="Confirmar senha"
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (confirmPasswordError) setConfirmPasswordError(null);
                      }}
                      placeholder="Repita sua senha"
                      secureTextEntry={!showConfirmPassword}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                      inputRef={confirmPasswordRef}
                      error={confirmPasswordError}
                      disabled={loading}
                      rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      accessibilityLabel="Confirmar senha"
                      accessibilityHint="Repita a senha"
                    />
                  </Animated.View>
                )}

                {/* Forgot Password (only for login) */}
                {isLogin && (
                  <Animated.View entering={FadeInDown.delay(250)} style={styles.forgotContainer}>
                    <Pressable
                      onPress={() => navigation.navigate("ForgotPassword")}
                      style={styles.forgotButton}
                      accessibilityLabel="Esqueceu a senha?"
                      accessibilityRole="link"
                    >
                      <Text style={styles.forgotText}>Esqueceu a senha?</Text>
                    </Pressable>
                  </Animated.View>
                )}
              </Animated.View>

              {/* Error Message */}
              {error && (
                <Animated.View entering={FadeIn.duration(200)} style={styles.messageCard}>
                  <Ionicons name="alert-circle" size={18} color={colors.error} />
                  <Text style={[styles.messageText, { color: colors.error }]}>{error}</Text>
                </Animated.View>
              )}

              {/* Success Message */}
              {success && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  style={[styles.messageCard, styles.successCard]}
                >
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={[styles.messageText, { color: colors.success }]}>{success}</Text>
                </Animated.View>
              )}

              {/* Submit Button */}
              <Animated.View
                entering={FadeInDown.delay(isLogin ? 300 : 350)}
                style={styles.submitSection}
              >
                <Button
                  variant="accent"
                  size="lg"
                  fullWidth
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                  loading={loading}
                  icon="arrow-forward"
                  iconPosition="right"
                >
                  {isLogin ? "Entrar" : "Criar conta"}
                </Button>
              </Animated.View>

              {/* Switch mode link */}
              <Animated.View
                entering={FadeInDown.delay(isLogin ? 350 : 400)}
                style={styles.switchSection}
              >
                <Text style={styles.switchText}>
                  {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                </Text>
                <Pressable
                  onPress={handleToggleMode}
                  disabled={loading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel={isLogin ? "Criar uma conta" : "Fazer login"}
                >
                  <Text style={styles.switchLink}>{isLogin ? "Criar conta" : "Fazer login"}</Text>
                </Pressable>
              </Animated.View>
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// ============================================
// STYLES - Flo Health Minimal
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: neutral[0],
    justifyContent: "center",
    alignItems: "center",
    ...shadows.flo.minimal,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },

  // Title Section
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Tokens.text.light.primary,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Tokens.text.light.secondary,
    fontFamily: typography.fontFamily.base,
    lineHeight: 24,
  },

  // Tab Toggle
  tabContainer: {
    marginBottom: 32,
  },
  tabTrack: {
    width: 312,
    height: 48,
    backgroundColor: neutral[0],
    borderRadius: 24,
    padding: 4,
    alignSelf: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: Tokens.cleanDesign.pink[200],
    ...shadows.flo.minimal,
  },
  tabSlider: {
    position: "absolute",
    top: 4,
    left: 4,
    width: 152,
    height: 40,
    backgroundColor: Tokens.cleanDesign.pink[100],
    borderRadius: 20,
  },
  tabLabels: {
    flexDirection: "row",
    height: "100%",
  },
  tabLabel: {
    flex: 1,
    textAlign: "center",
    lineHeight: 40,
    fontSize: 15,
    fontWeight: "600",
    color: Tokens.text.light.tertiary,
    fontFamily: typography.fontFamily.semibold,
  },
  tabLabelActive: {
    color: brand.accent[500],
  },

  // Form
  form: {
    gap: 20,
  },

  // Input Group
  inputGroup: {
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Tokens.text.light.primary,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: neutral[0],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Tokens.cleanDesign.pink[200],
    paddingHorizontal: 16,
    minHeight: 56,
    ...shadows.flo.minimal,
  },
  inputFocused: {
    borderWidth: 2,
  },
  inputError: {
    borderColor: Tokens.semantic.light.error,
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Tokens.text.light.primary,
    fontFamily: typography.fontFamily.base,
    paddingVertical: 16,
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },

  // Error Row
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 13,
    color: Tokens.semantic.light.error,
    fontFamily: typography.fontFamily.medium,
  },

  // Forgot Password
  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  forgotButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
    color: brand.primary[600],
    fontFamily: typography.fontFamily.semibold,
  },

  // Message Cards
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: neutral[0],
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: Tokens.semantic.light.error,
    ...shadows.flo.minimal,
  },
  successCard: {
    borderColor: Tokens.semantic.light.success,
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 20,
  },

  // Submit Section
  submitSection: {
    marginTop: 32,
  },

  // Switch Section
  switchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 6,
  },
  switchText: {
    fontSize: 15,
    color: Tokens.text.light.secondary,
    fontFamily: typography.fontFamily.base,
  },
  switchLink: {
    fontSize: 15,
    fontWeight: "600",
    color: brand.accent[500],
    fontFamily: typography.fontFamily.semibold,
  },
});
