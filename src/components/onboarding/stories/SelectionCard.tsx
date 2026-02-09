import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { brand, premium } from "../../../theme/tokens";
import { FONTS } from "../../../config/onboarding-data";

const GLASS = premium.glass;
const TEXT = premium.text;

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface SelectionCardProps {
  selected: boolean;
  onPress: () => void;
  icon: IoniconName;
  label: string;
  subtitle?: string;
  variant?: "large" | "compact";
}

export const SelectionCard: React.FC<SelectionCardProps> = React.memo(
  ({ selected, onPress, icon, label, subtitle, variant = "large" }) => {
    const scale = useSharedValue(1);
    const glow = useSharedValue(selected ? 1 : 0);

    React.useEffect(() => {
      glow.value = withSpring(selected ? 1 : 0, { damping: 15 });
    }, [selected, glow]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
      opacity: interpolate(glow.value, [0, 1], [0, 0.6]),
      transform: [{ scale: interpolate(glow.value, [0, 1], [0.8, 1.1]) }],
    }));

    const handlePress = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scale.value = withSequence(
        withTiming(0.95, { duration: 80 }),
        withSpring(1, { damping: 12 })
      );
      onPress();
    };

    const isCompact = variant === "compact";

    return (
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={subtitle ? `${label}. ${subtitle}` : label}
        accessibilityHint={
          selected
            ? "Selecionado. Toque duas vezes para desmarcar"
            : "Toque duas vezes para selecionar"
        }
        accessibilityState={{ selected }}
      >
        <Animated.View style={animatedStyle}>
          {/* Glow effect */}
          <Animated.View
            style={[styles.cardGlow, glowStyle, isCompact && styles.cardGlowCompact]}
          />
          <View
            style={[
              styles.selectionCard,
              isCompact && styles.selectionCardCompact,
              selected && styles.selectionCardSelected,
            ]}
          >
            <View style={[styles.cardIconContainer, isCompact && styles.cardIconContainerCompact]}>
              <Ionicons
                name={icon}
                size={isCompact ? 22 : 28}
                color={selected ? brand.accent[300] : TEXT.primary}
              />
            </View>
            <View style={isCompact ? styles.cardContentCompact : styles.cardContent}>
              <Text
                style={[
                  styles.cardLabel,
                  isCompact && styles.cardLabelCompact,
                  selected && styles.cardLabelSelected,
                ]}
              >
                {label}
              </Text>
              {subtitle && !isCompact && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
            </View>
            {selected && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark" size={16} color={TEXT.primary} />
              </View>
            )}
          </View>
        </Animated.View>
      </Pressable>
    );
  }
);

SelectionCard.displayName = "SelectionCard";

const styles = StyleSheet.create({
  selectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GLASS.light,
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectionCardCompact: {
    padding: 14,
    borderRadius: 16,
  },
  selectionCardSelected: {
    borderColor: brand.accent[400],
    backgroundColor: GLASS.accentLight,
  },
  cardGlow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    backgroundColor: brand.accent[500],
  },
  cardGlowCompact: {
    borderRadius: 20,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: GLASS.base,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardIconContainerCompact: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardContentCompact: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 17,
    fontFamily: FONTS.headline,
    color: TEXT.primary,
  },
  cardLabelCompact: {
    fontSize: 15,
  },
  cardLabelSelected: {
    color: brand.accent[300],
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.light,
    color: TEXT.subtle,
    marginTop: 2,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: brand.accent[500],
    alignItems: "center",
    justifyContent: "center",
  },
});
