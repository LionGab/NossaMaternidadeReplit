/**
 * ConcernCard - Card para selecao de preocupacoes
 * Design: Gradiente abstrato + icone grande
 * 100% funcional sem fotos reais
 */

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { ConcernCardData } from "../../types/nath-journey-onboarding.types";

const isWeb = Platform.OS === "web";

interface ConcernCardProps {
  data: ConcernCardData;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

function ConcernCardComponent({ data, isSelected, onPress, disabled }: ConcernCardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  // Gesture handling
  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    })
    .onEnd(() => {
      // Bounce do icone quando selecionado
      if (!isSelected) {
        iconScale.value = withSequence(
          withSpring(1.3, { damping: 8, stiffness: 300 }),
          withSpring(1, { damping: 10, stiffness: 200 })
        );
      }
      runOnJS(onPress)();
    });

  // Background color for selected state
  const selectedBgColor = theme.isDark
    ? `${Tokens.brand.accent[900]}30`
    : `${Tokens.brand.accent[50]}60`;

  // Animated styles
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isSelected ? Tokens.brand.accent[400] : theme.colors.border.subtle,
    borderWidth: withSpring(isSelected ? 3 : 1, { damping: 20 }),
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  // Badge animation
  const badgeScale = useSharedValue(isSelected ? 1 : 0);
  React.useEffect(() => {
    badgeScale.value = withSpring(isSelected ? 1 : 0, {
      damping: 12,
      stiffness: 250,
    });
  }, [isSelected, badgeScale]);

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeScale.value,
  }));

  // Card content (shared between web and native)
  const cardContent = (
    <>
      {/* Gradient Background */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={[data.gradient[0], data.gradient[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />

        {/* Icone grande central */}
        <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
          <View style={[styles.iconCircle, { backgroundColor: `${data.iconColor}20` }]}>
            <Ionicons
              name={data.icon as React.ComponentProps<typeof Ionicons>["name"]}
              size={32}
              color={data.iconColor}
            />
          </View>
        </Animated.View>

        {/* Badge de selecao */}
        <Animated.View style={[styles.badge, animatedBadgeStyle]}>
          <LinearGradient
            colors={[Tokens.brand.accent[300], Tokens.brand.accent[400]]}
            style={styles.badgeGradient}
          >
            <Ionicons name="checkmark" size={14} color={Tokens.neutral[0]} />
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text.primary }]} numberOfLines={2}>
          {data.title}
        </Text>
      </View>

      {/* Selection highlight - mais visível */}
      {isSelected && (
        <View style={styles.selectionHighlight} pointerEvents="none">
          <LinearGradient
            colors={[`${Tokens.brand.accent[300]}30`, `${Tokens.brand.accent[200]}15`]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
    </>
  );

  // Use Pressable for web, GestureDetector for native
  if (isWeb) {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityLabel={data.title}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled: !!disabled }}
      >
        <AnimatedView
          style={[
            styles.card,
            {
              backgroundColor: isSelected ? selectedBgColor : theme.surface.card,
            },
            animatedCardStyle,
            disabled && !isSelected && styles.cardDisabled,
          ]}
          accessible
          accessibilityLabel={data.title}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected, disabled: !!disabled }}
        >
          {cardContent}
        </AnimatedView>
      </Pressable>
    );
  }

  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedView
        style={[
          styles.card,
          {
            backgroundColor: isSelected ? selectedBgColor : theme.surface.card,
          },
          animatedCardStyle,
          disabled && !isSelected && styles.cardDisabled,
        ]}
        accessible
        accessibilityLabel={data.title}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled: !!disabled }}
      >
        {cardContent}
      </AnimatedView>
    </GestureDetector>
  );
}

export const ConcernCard = memo(ConcernCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: Tokens.radius["2xl"],
    overflow: "hidden",
    ...Tokens.shadows.md,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  gradientContainer: {
    width: "100%",
    height: 100,
    position: "relative",
  },
  gradient: {
    flex: 1,
  },
  iconWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  badge: {
    position: "absolute",
    top: Tokens.spacing.sm,
    right: Tokens.spacing.sm,
  },
  badgeGradient: {
    width: 28,
    height: 28,
    borderRadius: Tokens.radius.full,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  content: {
    padding: Tokens.spacing.md,
    gap: Tokens.spacing.xs,
    alignItems: "center",
  },
  title: {
    fontSize: Tokens.typography.titleSmall.fontSize,
    fontWeight: Tokens.typography.titleSmall.fontWeight,
    textAlign: "center",
    lineHeight: Tokens.typography.titleSmall.lineHeight * 1.2,
  },
  selectionHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Tokens.radius.xl,
  },
});
