import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { premium, Tokens } from "../../../theme/tokens";
import { FONTS } from "../../../config/onboarding-data";

const GLASS = premium.glass;
const TEXT = premium.text;

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface EmotionalOptionProps {
  id: string;
  icon: IoniconName;
  label: string;
  color: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index: number;
}

export const EmotionalOption: React.FC<EmotionalOptionProps> = React.memo(
  ({ id, icon, label, color, isSelected, onSelect, index }) => {
    return (
      <Animated.View
        entering={FadeInDown.delay(350 + index * 60).duration(300)}
        style={styles.emotionalItem}
      >
        <Pressable
          onPress={() => {
            onSelect(id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          style={[
            styles.emotionalCard,
            isSelected && {
              borderColor: color,
              backgroundColor: `${color}20`,
            },
          ]}
          accessibilityRole="radio"
          accessibilityLabel={label}
          accessibilityHint={
            isSelected
              ? "Selecionado. Toque duas vezes para desmarcar"
              : "Toque duas vezes para selecionar esta emoção"
          }
          accessibilityState={{ selected: isSelected }}
        >
          <View style={[styles.iconContainer, isSelected && { backgroundColor: `${color}30` }]}>
            <Ionicons name={icon} size={28} color={isSelected ? color : TEXT.secondary} />
          </View>
          <Text style={[styles.emotionalLabel, isSelected && { color: color }]}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  }
);

EmotionalOption.displayName = "EmotionalOption";

const styles = StyleSheet.create({
  emotionalItem: {
    width: "30%",
  },
  emotionalCard: {
    alignItems: "center",
    backgroundColor: GLASS.light,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: "transparent",
    minHeight: Tokens.accessibility.minTapTarget,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: GLASS.base,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emotionalLabel: {
    fontSize: 12,
    fontFamily: FONTS.accent,
    color: TEXT.secondary,
    textAlign: "center",
  },
});
