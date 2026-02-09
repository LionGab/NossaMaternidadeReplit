/**
 * PostTypeSelector - Seletor visual de tipo de post
 *
 * Tipos disponíveis:
 * - duvida: Dúvidas sobre gravidez/maternidade
 * - desabafo: Compartilhar sentimentos
 * - vitoria: Celebrar conquistas
 * - geral: Posts gerais
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { brand, neutral, typography, spacing, radius } from "../../theme/tokens";

export type PostType = "duvida" | "desabafo" | "vitoria" | "geral";

interface PostTypeSelectorProps {
  selectedType: PostType | null;
  onSelectType: (type: PostType) => void;
  disabled?: boolean;
}

interface TypeConfig {
  id: PostType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}

const POST_TYPES: TypeConfig[] = [
  {
    id: "duvida",
    label: "Dúvida",
    icon: "help-circle-outline",
    color: brand.primary[600],
    bgColor: brand.primary[50],
  },
  {
    id: "desabafo",
    label: "Desabafo",
    icon: "chatbubble-ellipses-outline",
    color: brand.secondary[600],
    bgColor: brand.secondary[50],
  },
  {
    id: "vitoria",
    label: "Vitória",
    icon: "trophy-outline",
    color: brand.teal[600],
    bgColor: brand.teal[50],
  },
  {
    id: "geral",
    label: "Geral",
    icon: "chatbubbles-outline",
    color: neutral[600],
    bgColor: neutral[100],
  },
];

const TypeButton: React.FC<{
  config: TypeConfig;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}> = React.memo(({ config, isSelected, onPress, disabled }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12 });
  }, [scale]);

  const handlePress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  return (
    <Animated.View style={[styles.typeButtonWrapper, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Tipo de post: ${config.label}`}
        accessibilityState={{ selected: isSelected, disabled: !!disabled }}
        style={[
          styles.typeButton,
          {
            backgroundColor: isSelected ? config.bgColor : neutral[50],
            borderColor: isSelected ? config.color : neutral[200],
          },
          disabled && styles.typeButtonDisabled,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isSelected ? config.color : neutral[200],
            },
          ]}
        >
          <Ionicons name={config.icon} size={20} color={isSelected ? neutral[0] : neutral[500]} />
        </View>
        <Text
          style={[
            styles.typeLabel,
            {
              color: isSelected ? config.color : neutral[600],
            },
          ]}
        >
          {config.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

TypeButton.displayName = "TypeButton";

export const PostTypeSelector: React.FC<PostTypeSelectorProps> = React.memo(
  ({ selectedType, onSelectType, disabled }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Tipo de Post</Text>
        <View style={styles.grid}>
          {POST_TYPES.map((type) => (
            <TypeButton
              key={type.id}
              config={type}
              isSelected={selectedType === type.id}
              onPress={() => onSelectType(type.id)}
              disabled={disabled}
            />
          ))}
        </View>
      </View>
    );
  }
);

PostTypeSelector.displayName = "PostTypeSelector";

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
    color: neutral[700],
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  typeButtonWrapper: {
    width: "48%",
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    gap: spacing.sm,
  },
  typeButtonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  typeLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semibold,
    flex: 1,
  },
});
