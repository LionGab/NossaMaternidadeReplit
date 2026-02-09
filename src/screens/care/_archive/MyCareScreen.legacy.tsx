/**
 * Nossa Maternidade - MyCareScreen
 *
 * Flo Health Minimal Design Style
 * Clean, simple, and focused self-care screen
 *
 * Features:
 * - Daily affirmation from Nathalia Valente
 * - Care sections (Breathe, Feelings, Rest, Community)
 * - Quick access items (Affirmations, Habits, NathIA)
 * - NathIA conversation CTA
 *
 * @version 2.0 - Flo Health Minimal Redesign
 * @date Janeiro 2026
 */

import React, { useMemo, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { MainTabScreenProps } from "@/types/navigation";
import { useAppStore } from "@/state/store";
import { useTheme } from "@/hooks/useTheme";
import {
  FloScreenWrapper,
  FloHeader,
  FloActionCard,
  FloSectionTitle,
  FloMotivationalCard,
} from "@/components/ui";
import { Tokens, spacing, typography, radius, shadows } from "@/theme/tokens";
import { getGreeting } from "@/utils/greeting";
import { IconName } from "@/types/icons";

// ============================================================================
// CONSTANTS
// ============================================================================

const DAILY_AFFIRMATIONS = [
  "Voce ta fazendo o melhor que pode, e isso ja e demais",
  "Nao existe mae perfeita, existe mae real e presente",
  "Cuidar de voce tambem e cuidar do seu bebe",
  "Seus sentimentos sao validos, todos eles",
  "Descansa, mae. Voce merece esse respiro",
  "Pedir ajuda e forca, nao fraqueza",
  "Cada dia e uma chance nova de se conectar",
  "Voce nao precisa dar conta de tudo",
  "Seu corpo fez um milagre. Respeita ele",
  "Nao deixa ninguem te julgar",
];

const CARE_SECTIONS: {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  color: string;
}[] = [
  {
    id: "breathe",
    title: "Respira comigo",
    subtitle: "Exercicios de respiracao",
    icon: "leaf-outline",
    color: Tokens.brand.teal[500],
  },
  {
    id: "feelings",
    title: "Como voce esta?",
    subtitle: "Registre seus sentimentos",
    icon: "heart-outline",
    color: Tokens.brand.accent[500],
  },
  {
    id: "rest",
    title: "Descanso",
    subtitle: "Sons relaxantes",
    icon: "moon-outline",
    color: Tokens.brand.secondary[500],
  },
  {
    id: "connect",
    title: "Comunidade",
    subtitle: "Conecte-se com outras maes",
    icon: "people-outline",
    color: Tokens.brand.primary[500],
  },
];

const QUICK_ITEMS: {
  id: string;
  title: string;
  icon: IconName;
  color: string;
}[] = [
  { id: "affirmations", title: "Afirmacoes", icon: "heart", color: Tokens.brand.accent[500] },
  { id: "habits", title: "Meu dia", icon: "sunny", color: Tokens.brand.teal[500] },
  { id: "nathia", title: "NathIA", icon: "sparkles", color: Tokens.brand.primary[500] },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MyCareScreen({ navigation }: MainTabScreenProps<"MyCare">) {
  const { isDark } = useTheme();
  const userName = useAppStore((s) => s.user?.name);

  const greetingData = getGreeting();
  const greeting = `${greetingData.emoji} ${greetingData.text}`;

  const todayAffirmation = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return DAILY_AFFIRMATIONS[dayOfYear % DAILY_AFFIRMATIONS.length];
  }, []);

  // Handlers
  const handleCardPress = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      switch (id) {
        case "connect":
          navigation.navigate("Community");
          break;
        case "feelings":
          navigation.navigate("DailyLog", {});
          break;
        case "breathe":
          navigation.navigate("BreathingExercise");
          break;
        case "rest":
          navigation.navigate("RestSounds");
          break;
      }
    },
    [navigation]
  );

  const handleQuickItem = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      switch (id) {
        case "affirmations":
          navigation.navigate("Affirmations");
          break;
        case "habits":
          navigation.navigate("Habits");
          break;
        case "nathia":
          navigation.navigate("Assistant");
          break;
      }
    },
    [navigation]
  );

  const handleNathIA = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Assistant");
  }, [navigation]);

  const handleAffirmationPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Affirmations");
  }, [navigation]);

  // Theme colors
  const cardBg = isDark ? "rgba(255,255,255,0.06)" : Tokens.neutral[0];
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : Tokens.neutral[100];
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];

  return (
    <FloScreenWrapper scrollable testID="my-care-screen">
      {/* Header */}
      <FloHeader
        greeting={greeting + (userName ? `, ${userName}` : "")}
        title="Meus Cuidados"
        variant="large"
        rightActions={[
          {
            icon: "chatbubble-ellipses",
            onPress: handleNathIA,
            label: "Falar com NathIA",
          },
        ]}
      />

      {/* Affirmation Card */}
      <Pressable onPress={handleAffirmationPress}>
        <FloMotivationalCard
          message={todayAffirmation}
          author="Nathalia Valente"
          variant="featured"
          animationDelay={100}
        />
      </Pressable>

      {/* Care Sections */}
      <View style={styles.section}>
        <FloSectionTitle title="Seu momento" size="md" animationDelay={150} />

        {CARE_SECTIONS.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInDown.delay(200 + index * 50).duration(400)}>
            <FloActionCard
              icon={item.icon as keyof typeof Ionicons.glyphMap}
              iconColor={item.color}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => handleCardPress(item.id)}
              style={{ marginBottom: spacing.md }}
            />
          </Animated.View>
        ))}
      </View>

      {/* Quick Access */}
      <View style={styles.section}>
        <FloSectionTitle title="Acesso rapido" size="md" animationDelay={300} />

        <View style={styles.quickRow}>
          {QUICK_ITEMS.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(350 + index * 40).duration(400)}
              style={styles.quickItemWrapper}
            >
              <Pressable
                onPress={() => handleQuickItem(item.id)}
                style={({ pressed }) => [
                  styles.quickItem,
                  {
                    backgroundColor: cardBg,
                    borderColor,
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                  !isDark && shadows.flo.minimal,
                ]}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                <View style={[styles.quickItemIcon, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={item.color}
                  />
                </View>
                <Text style={[styles.quickItemText, { color: textPrimary }]}>{item.title}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* NathIA CTA */}
      <View style={styles.section}>
        <FloActionCard
          icon="chatbubble-ellipses-outline"
          iconColor={Tokens.brand.accent[500]}
          title="Quer conversar?"
          subtitle="A NathIA ta aqui pra te ouvir"
          onPress={handleNathIA}
        />
      </View>

      {/* Footer */}
      <Animated.View entering={FadeInDown.delay(450).duration(400)} style={styles.footer}>
        <Text style={[styles.footerText, { color: Tokens.neutral[400] }]}>
          Cuidar de voce e cuidar do seu filho
        </Text>
      </Animated.View>
    </FloScreenWrapper>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xl,
  },

  // Quick Access
  quickRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  quickItemWrapper: {
    flex: 1,
  },
  quickItem: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.sm,
  },
  quickItemIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  quickItemText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semibold,
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
});
