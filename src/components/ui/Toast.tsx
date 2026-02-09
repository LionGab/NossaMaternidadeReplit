/**
 * Toast Component - Sistema de notificações
 * Refatorado para Reanimated v4 + Dark Mode
 */

import React, { useCallback, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { neutral, spacing, radius, shadows, typography, semantic } from "../../theme/tokens";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastProps extends ToastConfig {
  onDismiss: () => void;
}

const TOAST_ICONS = {
  success: "checkmark-circle" as const,
  error: "close-circle" as const,
  info: "information-circle" as const,
  warning: "warning" as const,
};

export function Toast({ message, type = "info", duration = 3000, action, onDismiss }: ToastProps) {
  const { isDark } = useTheme();

  // Theme-aware colors
  const colors = isDark ? semantic.dark : semantic.light;
  const TOAST_COLORS = {
    success: colors.success,
    error: colors.error,
    info: colors.info,
    warning: colors.warning,
  };

  const bgColor = isDark ? neutral[800] : neutral[0];
  const textColor = isDark ? neutral[100] : neutral[900];
  const closeColor = isDark ? neutral[500] : neutral[400];

  // Animated values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-100);

  const dismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(-100, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)();
      }
    });
  }, [opacity, translateY, onDismiss]);

  useEffect(() => {
    // Animate in
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });

    // Auto-dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        dismiss();
      }, duration);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [dismiss, duration, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const color = TOAST_COLORS[type];
  const icon = TOAST_ICONS[type];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPress={dismiss}
        style={[
          styles.toast,
          {
            backgroundColor: bgColor,
            borderLeftColor: color,
          },
          shadows.lg,
        ]}
        accessibilityLabel={`Notificacao: ${message}`}
        accessibilityRole="alert"
      >
        <Ionicons name={icon} size={24} color={color} style={styles.icon} />
        <View style={styles.content}>
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
          {action && (
            <Pressable
              onPress={() => {
                action.onPress();
                dismiss();
              }}
              style={styles.actionButton}
              accessibilityLabel={action.label}
              accessibilityRole="button"
            >
              <Text style={[styles.actionText, { color }]}>{action.label}</Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={dismiss}
          style={styles.closeButton}
          accessibilityLabel="Fechar notificacao"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={20} color={closeColor} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
  },
  toast: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
  },
  icon: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: typography.bodyMedium.fontSize,
    lineHeight: typography.bodyMedium.lineHeight,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
  },
  actionButton: {
    marginTop: spacing.xs,
  },
  actionText: {
    fontSize: typography.labelSmall.fontSize,
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
  },
  closeButton: {
    marginLeft: spacing.md,
    padding: spacing.xs,
  },
});
