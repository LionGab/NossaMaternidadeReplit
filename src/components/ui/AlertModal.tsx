/**
 * AlertModal - Custom modal to replace native Alert.alert
 *
 * Follows Apple HIG and Material Design 3 guidelines
 * Supports multiple button configurations
 *
 * @version 1.0.0
 */

import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { neutral, typography, spacing, accessibility, overlay } from "../../theme/tokens";
import { shadowPresets } from "../../utils/shadow";

// Local aliases for cleaner code
const COLORS = { neutral };
const TYPOGRAPHY = typography;
const SPACING = spacing;
const ACCESSIBILITY = accessibility;

export interface AlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onDismiss: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export function AlertModal({
  visible,
  title,
  message,
  buttons = [{ text: "OK", style: "default" }],
  onDismiss,
  icon,
  iconColor,
}: AlertModalProps) {
  const { colors, isDark } = useTheme();

  const handleButtonPress = (button: AlertButton) => {
    button.onPress?.();
    onDismiss();
  };

  const getButtonStyle = (style?: "default" | "cancel" | "destructive") => {
    switch (style) {
      case "destructive":
        return {
          backgroundColor: colors.semantic.error,
          textColor: COLORS.neutral[0],
        };
      case "cancel":
        return {
          backgroundColor: colors.background.tertiary,
          textColor: colors.text.primary,
        };
      default:
        return {
          backgroundColor: colors.primary[500],
          textColor: COLORS.neutral[0],
        };
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onDismiss}
      statusBarTranslucent
      accessibilityViewIsModal={true}
    >
      <Pressable
        onPress={onDismiss}
        style={{
          flex: 1,
          backgroundColor: overlay.dark,
          justifyContent: "center",
          alignItems: "center",
          padding: SPACING.lg,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          accessibilityViewIsModal={true}
          accessibilityRole="alert"
          accessibilityLabel={`Alerta: ${title}. ${message}`}
          style={[
            {
              backgroundColor: colors.background.card,
              borderRadius: 24,
              padding: SPACING.lg,
              width: "100%",
              maxWidth: 340,
            },
            shadowPresets.xl,
          ]}
        >
          {/* Icon */}
          {icon && (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: iconColor
                  ? `${iconColor}20`
                  : isDark
                    ? colors.primary[800]
                    : colors.primary[50],
                alignItems: "center",
                justifyContent: "center",
                marginBottom: SPACING.md,
                alignSelf: "center",
              }}
            >
              <Ionicons name={icon} size={28} color={iconColor || colors.primary[500]} />
            </View>
          )}

          {/* Title */}
          <Text
            style={{
              color: colors.text.primary,
              fontSize: TYPOGRAPHY.titleLarge.fontSize,
              fontFamily: typography.fontFamily.display,
              textAlign: "center",
              marginBottom: SPACING.xs,
            }}
          >
            {title}
          </Text>

          {/* Message */}
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: TYPOGRAPHY.bodyMedium.fontSize,
              lineHeight: 22,
              textAlign: "center",
              marginBottom: SPACING.lg,
            }}
          >
            {message}
          </Text>

          {/* Buttons */}
          <View
            style={{
              flexDirection: buttons.length <= 2 ? "row" : "column",
              gap: SPACING.sm,
            }}
          >
            {buttons.map((button, index) => {
              const buttonStyle = getButtonStyle(button.style);
              return (
                <Pressable
                  key={index}
                  onPress={() => handleButtonPress(button)}
                  style={{
                    flex: buttons.length <= 2 ? 1 : undefined,
                    backgroundColor: buttonStyle.backgroundColor,
                    borderRadius: 16,
                    paddingVertical: SPACING.md,
                    paddingHorizontal: SPACING.md,
                    alignItems: "center",
                    minHeight: ACCESSIBILITY.minTapTarget,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: buttonStyle.textColor,
                      fontSize: TYPOGRAPHY.bodyMedium.fontSize,
                      fontWeight: "600",
                    }}
                  >
                    {button.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * Hook to manage AlertModal state
 */
export function useAlertModal() {
  const [visible, setVisible] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<AlertModalProps, "visible" | "onDismiss">>({
    title: "",
    message: "",
  });

  const show = React.useCallback((alertConfig: Omit<AlertModalProps, "visible" | "onDismiss">) => {
    setConfig(alertConfig);
    setVisible(true);
  }, []);

  const hide = React.useCallback(() => {
    setVisible(false);
  }, []);

  const AlertModalComponent = React.useCallback(
    () => <AlertModal visible={visible} onDismiss={hide} {...config} />,
    [visible, config, hide]
  );

  return {
    show,
    hide,
    AlertModal: AlertModalComponent,
  };
}
