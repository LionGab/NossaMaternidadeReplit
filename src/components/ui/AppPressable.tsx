import React from "react";
import {
  Pressable,
  PressableProps,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
} from "react-native";
import * as Haptics from "expo-haptics";
import { accessibility } from "../../theme/tokens";

type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error"
  | "none";

export interface AppPressableProps extends Omit<PressableProps, "accessibilityLabel"> {
  /**
   * Label de acessibilidade OBRIGATÓRIO.
   * Descreve a ação do botão para leitores de tela.
   */
  accessibilityLabel: string;

  /**
   * Tipo de feedback háptico ao pressionar.
   * Default: "light"
   */
  haptic?: HapticType;

  /**
   * Garante tamanho mínimo de toque (44x44px)?
   * Default: true
   */
  ensureMinTouchArea?: boolean;

  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AppPressable({
  children,
  onPress,
  haptic = "light",
  ensureMinTouchArea = true,
  accessibilityLabel,
  accessibilityRole = "button",
  style,
  hitSlop,
  ...props
}: AppPressableProps) {
  const handlePress = async (event: GestureResponderEvent) => {
    if (haptic !== "none") {
      switch (haptic) {
        case "light":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "medium":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "heavy":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case "selection":
          await Haptics.selectionAsync();
          break;
        case "success":
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case "warning":
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case "error":
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    }
    onPress?.(event);
  };

  // Garante hitSlop mínimo se não for informado e ensureMinTouchArea for true
  // Nota: hitSlop expande a área de toque sem afetar o layout visível.
  // Para minHeight/minWidth visível, deve-se usar style.
  const resolvedHitSlop = hitSlop ?? (ensureMinTouchArea ? 10 : undefined);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      hitSlop={resolvedHitSlop}
      style={[
        ensureMinTouchArea && {
          minHeight: accessibility.minTapTarget,
          minWidth: accessibility.minTapTarget,
          justifyContent: "center",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}
