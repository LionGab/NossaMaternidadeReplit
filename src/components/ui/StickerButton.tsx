import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Tokens } from "../../theme/tokens";

interface StickerButtonProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  iconColor?: string;
  onPress?: () => void;
  size?: number;
  selected?: boolean;
  haptics?: boolean;
  accessibilityHint?: string;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StickerButton({
  label,
  icon = "heart-outline",
  color = Tokens.brand.primary[100],
  iconColor = Tokens.brand.primary[600],
  onPress,
  size = 72,
  selected = false,
  haptics = true,
  accessibilityHint,
  testID,
}: StickerButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handlePress = () => {
    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  const accessibilityLabel = selected ? label + " selecionado" : label;
  const defaultHint = "Toque para selecionar " + label;

  return (
    <View style={styles.container}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint || defaultHint}
        accessibilityState={{ selected }}
        testID={testID}
        style={[
          styles.circle,
          animatedStyle,
          {
            backgroundColor: selected ? Tokens.brand.primary[200] : color,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: selected ? 2 : 0,
            borderColor: selected ? Tokens.brand.primary[400] : "transparent",
          },
        ]}
      >
        <Ionicons name={icon} size={size * 0.45} color={iconColor} />
      </AnimatedPressable>
      <Text style={styles.label} accessibilityLabel={undefined}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing.xs,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    ...Tokens.shadows.sm,
  },
  label: {
    ...Tokens.typography.labelMedium,
    color: Tokens.text.light.secondary,
    textAlign: "center",
  },
});
