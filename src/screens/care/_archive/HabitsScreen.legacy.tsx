/**
 * HabitsScreen - Meus Cuidados do Dia
 *
 * Design: Fitness gentil, sem cobrança
 * - 1 cuidado já é suficiente
 * - 0 cuidados NÃO gera culpa
 * - Sem porcentagem, sem streak visual
 * - Microtextos de validação após cada toggle
 */

import React, { useState, useCallback, useMemo } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useHabitsStore, Habit } from "@/state";

import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";
import { IconName } from "@/types/icons";
import { Tokens, spacing, cleanDesign, brand, shadows } from "@/theme/tokens";

// Imagem para o hero header - Meus Cuidados
const MYCARE_IMAGE = require("../../../assets/mycare-image.jpg");

// Local alias for cleaner code
const SPACING = spacing;

// Microtextos de validação após marcar cada cuidado
const FEEDBACK_MESSAGES: Record<string, string> = {
  "1": "Seu corpo agradece cada gole.",
  "2": "Você merece essa energia.",
  "3": "Pausa também é cuidado.",
  "4": "Vitamina D pro seu humor.",
  "5": "Conexão também é saúde.",
  "6": "Seu corpo respondeu.",
  "7": "Esse momento é real.",
  "8": "Você não precisa dar conta sozinha.",
};

// ===========================================
// HABIT CARD - Memoized for performance
// ===========================================
interface HabitCardProps {
  habit: Habit;
  index: number;
  onPress: (habit: Habit) => void;
  isDark: boolean;
  textPrimary: string;
  textSecondary: string;
  bgCard: string;
  borderColor: string;
  neutralWhite: string;
  neutral300: string;
}

const HabitCard = React.memo(
  ({
    habit,
    index,
    onPress,
    isDark,
    textPrimary,
    textSecondary,
    bgCard,
    borderColor,
    neutralWhite,
    neutral300,
  }: HabitCardProps) => {
    const handlePress = useCallback(() => {
      onPress(habit);
    }, [onPress, habit]);

    return (
      <Animated.View
        entering={FadeInUp.delay(100 + index * 50)
          .duration(500)
          .springify()}
      >
        <Pressable
          onPress={handlePress}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: habit.completed }}
          accessibilityLabel={`${habit.title}. ${habit.description}`}
          accessibilityHint={
            habit.completed ? "Toque para desmarcar" : "Toque para marcar como feito"
          }
          style={({ pressed }) => [
            habitStyles.pressable,
            { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <View
            style={[
              habitStyles.card,
              {
                backgroundColor: habit.completed
                  ? isDark
                    ? `${habit.color}25`
                    : `${habit.color}12`
                  : bgCard,
                borderColor: habit.completed ? habit.color : borderColor,
              },
            ]}
          >
            <View style={habitStyles.cardContent}>
              {/* Icon Container */}
              <View
                style={[
                  habitStyles.iconContainer,
                  { backgroundColor: habit.completed ? habit.color : `${habit.color}15` },
                ]}
              >
                <Ionicons
                  name={habit.icon as IconName}
                  size={24}
                  color={habit.completed ? neutralWhite : habit.color}
                />
              </View>

              {/* Content */}
              <View style={habitStyles.textContainer}>
                <Text style={[habitStyles.title, { color: textPrimary }]}>{habit.title}</Text>
                <Text style={[habitStyles.description, { color: textSecondary }]}>
                  {habit.description}
                </Text>
              </View>

              {/* Checkbox */}
              <View
                style={[
                  habitStyles.checkbox,
                  {
                    backgroundColor: habit.completed ? habit.color : "transparent",
                    borderColor: habit.completed ? habit.color : neutral300,
                  },
                ]}
              >
                {habit.completed && <Ionicons name="checkmark" size={22} color={neutralWhite} />}
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  },
  (prev, next) => {
    // Custom comparison - only re-render when these specific props change
    return (
      prev.habit.id === next.habit.id &&
      prev.habit.completed === next.habit.completed &&
      prev.isDark === next.isDark
    );
  }
);

HabitCard.displayName = "HabitCard";

const habitStyles = StyleSheet.create({
  pressable: {
    marginBottom: SPACING.md,
  },
  card: {
    borderRadius: 24, // Tokens.radius.2xl
    borderWidth: 1,
    overflow: "hidden",
    // Flo Clean Shadows (rosa)
    shadowColor: Tokens.brand.accent[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20, // SPACING.xl
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24, // Circle
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16, // SPACING.lg
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    marginLeft: 12,
  },
  summaryCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  quoteCard: {
    borderRadius: 24,
    padding: 24,
  },
  // Hero Header Styles
  heroAvatarContainer: {
    width: 120,
    height: 120,
    borderRadius: Tokens.radius.xl,
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: brand.accent[300],
    overflow: "hidden",
    ...shadows.lg,
  },
  heroAvatar: {
    width: "100%",
    height: "100%",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 22,
  },
});

// Alias for styles used in the component
const styles = habitStyles;

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const habits = useHabitsStore((s) => s.habits);
  const toggleHabit = useHabitsStore((s) => s.toggleHabit);

  const today = new Date().toISOString().split("T")[0];
  const completedCount = habits.filter((h) => h.completed).length;

  // Estado para microtexto de feedback
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const handleToggleHabit = useCallback(
    async (habit: Habit) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleHabit(habit.id, today);

      // Mostrar feedback apenas ao marcar (não ao desmarcar)
      if (!habit.completed) {
        setLastFeedback(FEEDBACK_MESSAGES[habit.id] || "Cuidado registrado.");
        // Limpar após 3 segundos
        setTimeout(() => setLastFeedback(null), 3000);
      }
    },
    [toggleHabit, today]
  );

  // Memoized theme colors for HabitCard
  const themeProps = useMemo(
    () => ({
      textPrimary: isDark ? colors.neutral[100] : colors.neutral[800],
      textSecondary: isDark ? colors.neutral[400] : colors.neutral[500],
      bgCard: isDark ? colors.neutral[800] : colors.background.card,
      borderColor: isDark ? colors.neutral[700] : colors.neutral[200],
      neutralWhite: colors.neutral[0],
      neutral300: colors.neutral[300],
    }),
    [isDark, colors]
  );

  // For local use in the screen
  const textPrimary = themeProps.textPrimary;
  const textSecondary = themeProps.textSecondary;

  return (
    <View style={{ flex: 1 }}>
      {/* Ultra-clean gradient background - Igual à Home */}
      <LinearGradient
        colors={
          isDark
            ? [colors.background.primary, colors.background.secondary]
            : cleanDesign.gradients.background
        }
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: insets.top + SPACING.lg,
        }}
      >
        {/* Hero Header com Avatar */}
        <Animated.View
          entering={FadeIn.duration(600)}
          style={{
            alignItems: "center",
            paddingHorizontal: cleanDesign.spacing.screenPadding,
            marginBottom: SPACING.xl,
          }}
        >
          <View style={styles.heroAvatarContainer}>
            <Image
              source={MYCARE_IMAGE}
              style={styles.heroAvatar}
              contentFit="cover"
              transition={300}
              accessibilityLabel="Ilustração de autocuidado e bem-estar"
            />
          </View>
          <Text style={[styles.heroTitle, { color: textPrimary }]}>Meus Cuidados</Text>
          <Text style={[styles.heroSubtitle, { color: textSecondary }]}>
            Pequenos gestos que te sustentam hoje
          </Text>
        </Animated.View>

        {/* Feedback Message (após toggle) */}
        {lastFeedback && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={{
              marginHorizontal: cleanDesign.spacing.screenPadding,
              marginBottom: SPACING.lg,
              backgroundColor: isDark ? brand.accent[900] : brand.accent[50],
              borderRadius: Tokens.radius.xl,
              padding: SPACING.md,
              borderWidth: 1,
              borderColor: isDark ? brand.accent[700] : brand.accent[100],
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: isDark ? brand.accent[200] : brand.accent[700],
                textAlign: "center",
                fontFamily: "Manrope_500Medium",
              }}
            >
              {lastFeedback}
            </Text>
          </Animated.View>
        )}

        {/* Validation Message - Using Card component */}
        <Animated.View
          entering={FadeIn.delay(200).duration(500)}
          style={{
            marginHorizontal: cleanDesign.spacing.screenPadding,
            marginBottom: cleanDesign.spacing.sectionGap,
          }}
        >
          <View
            style={[
              habitStyles.summaryCard,
              {
                backgroundColor: isDark ? colors.background.card : cleanDesign.card.background,
                borderColor: isDark ? colors.neutral[800] : cleanDesign.card.border,
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor:
                    completedCount >= habits.length
                      ? Tokens.semantic.light.successLight
                      : Tokens.brand.accent[50],
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: SPACING.md,
                }}
              >
                <Ionicons
                  name={
                    completedCount === 0
                      ? "moon-outline"
                      : completedCount >= habits.length
                        ? "star"
                        : "sparkles"
                  }
                  size={20}
                  color={
                    completedCount >= habits.length
                      ? Tokens.semantic.light.success
                      : Tokens.brand.accent[500]
                  }
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: textSecondary,
                  lineHeight: 22,
                  fontFamily: "Manrope_500Medium",
                }}
              >
                {completedCount === 0
                  ? "Tudo bem. Amanhã é outro dia. Você continua aqui."
                  : completedCount >= habits.length
                    ? "Você cuidou de você hoje. Isso é lindo."
                    : "Um cuidado já é movimento. Você está presente."}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Habits List (flat, no categories) */}
        <View style={{ paddingHorizontal: cleanDesign.spacing.screenPadding }}>
          {habits.map((habit, index) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              index={index}
              onPress={handleToggleHabit}
              isDark={isDark}
              {...themeProps}
            />
          ))}
        </View>

        {/* Fixed Footer Quote - Using Card component */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={{
            marginHorizontal: cleanDesign.spacing.screenPadding,
            marginTop: cleanDesign.spacing.sectionGap,
          }}
        >
          <View
            style={[
              habitStyles.quoteCard,
              {
                backgroundColor: isDark ? colors.background.secondary : brand.accent[50],
              },
            ]}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 24, marginBottom: SPACING.sm }}>💕</Text>
              <Text
                style={{
                  fontSize: 15,
                  color: textSecondary,
                  textAlign: "center",
                  lineHeight: 24,
                  fontFamily: "Manrope_500Medium",
                  fontStyle: "italic",
                }}
              >
                {'"'}Cuidar de você não precisa ser perfeito.{"\n"}Precisa ser possível.{'"'}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
