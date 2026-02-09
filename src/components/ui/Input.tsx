/**
 * Input - Design System Component (NativeWind 2025)
 *
 * Text input with label, error states, icons, and dark mode support.
 * Uses NativeWind for static styling, inline for theme-dynamic states.
 *
 * @example
 * ```tsx
 * <Input label="Email" placeholder="seu@email.com" leadingIcon="mail" />
 * <Input label="Senha" secureTextEntry trailingIcon="eye" />
 * <Input error="Campo obrigatório" value={value} onChangeText={setValue} />
 * <Input label="Nome" className="mb-4" />
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils/cn";

interface InputProps extends Omit<TextInputProps, "style"> {
  /** Input label */
  label?: string;
  /** Helper text shown below input */
  helperText?: string;
  /** Error message (shows error state) */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Leading icon (Ionicons name) */
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  /** Trailing icon (Ionicons name) */
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  /** Trailing icon press handler (for password toggle, clear, etc.) */
  onTrailingIconPress?: () => void;
  /** Full width input */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className for NativeWind styling */
  className?: string;
}

/**
 * NativeWind base classes for input components
 */
const INPUT_CONTAINER_CLASSES = "flex-row items-center px-3.5 py-3 rounded-xl border-[1.5px]";

export function Input({
  label,
  helperText,
  error,
  success = false,
  leadingIcon,
  trailingIcon,
  onTrailingIconPress,
  fullWidth = true,
  disabled = false,
  className,
  ...textInputProps
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  // Determine state-based border color (must be inline for dynamic theming)
  const getBorderColor = () => {
    if (error) return colors.semantic.error;
    if (success) return colors.semantic.success;
    if (isFocused) return colors.primary[500];
    return colors.neutral[200];
  };

  // Determine helper text color based on state
  const getHelperTextColor = () => {
    if (error) return colors.semantic.error;
    if (success) return colors.semantic.success;
    return colors.neutral[500];
  };

  return (
    <View className={cn(fullWidth && "w-full", className)}>
      {/* Label */}
      {label && (
        <Text className="text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        className={cn(
          INPUT_CONTAINER_CLASSES,
          disabled ? "bg-neutral-50 dark:bg-neutral-800" : "bg-white dark:bg-neutral-900"
        )}
        style={{ borderColor: getBorderColor() }}
      >
        {/* Leading Icon */}
        {leadingIcon && (
          <Ionicons
            name={leadingIcon}
            size={20}
            color={colors.neutral[400]}
            style={{ marginRight: 10 }}
          />
        )}

        {/* Text Input */}
        <TextInput
          {...textInputProps}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          className={cn(
            "flex-1 text-[15px] font-normal",
            disabled
              ? "text-neutral-400 dark:text-neutral-500"
              : "text-neutral-700 dark:text-neutral-200"
          )}
          placeholderTextColor={colors.neutral[400]}
          accessibilityLabel={label || textInputProps.placeholder || "Campo de texto"}
        />

        {/* Trailing Icon */}
        {trailingIcon && (
          <Pressable
            onPress={onTrailingIconPress}
            disabled={!onTrailingIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={
              trailingIcon.includes("eye") ? "Mostrar ou ocultar senha" : "Ação do campo"
            }
          >
            <Ionicons
              name={trailingIcon}
              size={20}
              color={colors.neutral[400]}
              style={{ marginLeft: 10 }}
            />
          </Pressable>
        )}
      </View>

      {/* Helper Text / Error */}
      {(helperText || error) && (
        <Text className="text-[13px] mt-1.5 ml-1" style={{ color: getHelperTextColor() }}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

/** Legacy export for backward compatibility */
export default Input;
