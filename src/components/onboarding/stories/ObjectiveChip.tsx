import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { brand, premium } from "../../../theme/tokens";
import { FONTS } from "../../../config/onboarding-data";

const GLASS = premium.glass;
const TEXT = premium.text;

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface ObjectiveChipProps {
  selected: boolean;
  onPress: () => void;
  icon: IoniconName;
  label: string;
}

export const ObjectiveChip: React.FC<ObjectiveChipProps> = React.memo(
  ({ selected, onPress, icon, label }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSequence(withTiming(0.9, { duration: 60 }), withSpring(1, { damping: 15 }));
      onPress();
    };

    return (
      <Pressable
        onPress={handlePress}
        accessibilityRole="radio"
        accessibilityLabel={label}
        accessibilityHint={
          selected
            ? "Selecionado. Toque duas vezes para desmarcar"
            : "Toque duas vezes para selecionar"
        }
        accessibilityState={{ selected }}
      >
        <Animated.View style={animatedStyle}>
          <View style={[styles.chip, selected && styles.chipSelected]}>
            <Ionicons name={icon} size={18} color={selected ? brand.accent[300] : TEXT.bright} />
            <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
          </View>
        </Animated.View>
      </Pressable>
    );
  }
);

ObjectiveChip.displayName = "ObjectiveChip";

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GLASS.base,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  chipSelected: {
    backgroundColor: GLASS.accentMedium,
    borderColor: brand.accent[400],
  },
  chipLabel: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: TEXT.bright,
  },
  chipLabelSelected: {
    color: brand.accent[300],
  },
});
