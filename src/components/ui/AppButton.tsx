/**
 * @deprecated Use `Button` from `./Button` instead.
 *
 * Este componente está DEPRECATED e será removido em versão futura.
 * O componente Button.tsx é mais completo e inclui:
 * - Variantes accent, glow, gradient
 * - Animações de pressão e glow
 * - Integração completa com design tokens
 * - Suporte a dark mode via useTheme
 *
 * @example
 * // Antes (deprecated):
 * import AppButton from "./AppButton";
 * <AppButton title="Salvar" onPress={handleSave} variant="primary" />
 *
 * // Depois (recomendado):
 * import { Button } from "./Button";
 * <Button variant="primary" onPress={handleSave}>Salvar</Button>
 *
 * @see Button
 */
import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { buttonAccessibility } from "../../utils/accessibility";
import { useTheme } from "../../hooks/useTheme";

/** @deprecated Use `Button` from `./Button` instead */
interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "soft";
  size?: "sm" | "md" | "lg";
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  color?: string;
}

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  color,
}: AppButtonProps) {
  const { colors } = useTheme();

  const handlePress = async () => {
    if (!disabled && !loading) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, iconSize: 16 },
    md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 15, iconSize: 18 },
    lg: { paddingVertical: 18, paddingHorizontal: 24, fontSize: 16, iconSize: 20 },
  };

  const variantStyles = {
    primary: {
      bg: color || colors.primary[500],
      text: colors.neutral[0],
      border: "transparent",
    },
    secondary: {
      bg: colors.neutral[600],
      text: colors.neutral[0],
      border: "transparent",
    },
    outline: {
      bg: "transparent",
      text: color || colors.primary[500],
      border: color || colors.primary[500],
    },
    ghost: {
      bg: "transparent",
      text: color || colors.primary[500],
      border: "transparent",
    },
    soft: {
      bg: colors.background.tertiary,
      text: color || colors.neutral[900],
      border: "transparent",
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];
  const opacity = disabled ? 0.5 : 1;

  const accessibilityProps = buttonAccessibility(
    title,
    disabled ? "Botão desabilitado" : loading ? "Carregando..." : undefined,
    disabled || loading
  );

  return (
    <Pressable
      {...accessibilityProps}
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: currentVariant.bg,
        borderWidth: currentVariant.border !== "transparent" ? 1.5 : 0,
        borderColor: currentVariant.border,
        borderRadius: 14,
        paddingVertical: currentSize.paddingVertical,
        paddingHorizontal: currentSize.paddingHorizontal,
        opacity: pressed ? 0.8 : opacity,
        width: fullWidth ? "100%" : "auto",
      })}
    >
      {loading ? (
        <ActivityIndicator size="small" color={currentVariant.text} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={currentVariant.text}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={{
              color: currentVariant.text,
              fontSize: currentSize.fontSize,
              fontWeight: "600",
            }}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={currentVariant.text}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </Pressable>
  );
}
