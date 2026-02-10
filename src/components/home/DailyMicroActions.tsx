/**
 * DailyMicroActions - Micro-ações do dia
 *
 * Características:
 * - 8 hábitos default (do habits-store)
 * - Top 3 visíveis inicialmente + toggle "Ver todas (8)"
 * - Persistência com Zustand + AsyncStorage
 * - Reset diário automático
 * - Haptic feedback ao completar
 * - Touch targets WCAG (44x44)
 * - Confetti ao completar ações
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { brand, neutral, spacing, radius, accessibility } from "@/theme/tokens";
import { shadowPresets } from "@/utils/shadow";
import { useHabitsStore } from "@/state/habits-store";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

// TOP_COUNT: número de ações visíveis inicialmente
const TOP_COUNT = 3;

// Tempo estimado por hábito (em minutos)
const HABIT_TIME_MAP: Record<string, string> = {
  "1": "30 seg", // Água
  "2": "15 min", // Comida
  "3": "5 min", // Self-care
  "4": "2 min", // Sol
  "5": "10 min", // Conversa
  "6": "1 min", // Respirações
  "7": "30 seg", // Foto
  "8": "5 min", // Pedir ajuda
};

// (getTodayKey removido - store gerencia persistência)

// ============================================================================
// CONFETTI COMPONENT
// ============================================================================

interface ConfettiBurstProps {
  activeKey: number;
}

/**
 * Confetti discreto ao completar micro-ação (6 partículas)
 */
function ConfettiBurst({ activeKey }: ConfettiBurstProps): React.JSX.Element {
  const progress = useSharedValue(0);

  const particles = useMemo(() => {
    const colors = [brand.primary[400], brand.accent[400], brand.secondary[400], brand.teal[400]];

    return Array.from({ length: 6 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 6;
      const dist = 14 + (i % 2) * 4;
      const size = 3 + (i % 2);
      const color = colors[i % colors.length];
      return { angle, dist, size, color };
    });
  }, []);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) });
  }, [activeKey, progress]);

  return (
    <View style={styles.confettiContainer}>
      {particles.map((p, idx) => (
        <ConfettiParticle key={idx} particle={p} progress={progress} />
      ))}
    </View>
  );
}

/**
 * Single confetti particle with animated style
 */
interface ConfettiParticleProps {
  particle: { angle: number; dist: number; size: number; color: string };
  progress: SharedValue<number>;
}

function ConfettiParticle({ particle: p, progress }: ConfettiParticleProps): React.JSX.Element {
  const style = useAnimatedStyle(() => {
    const t = progress.value;
    const x = Math.cos(p.angle) * p.dist * t;
    const y = Math.sin(p.angle) * p.dist * t - 4 * t;
    return {
      opacity: 1 - t,
      transform: [{ translateX: x }, { translateY: y }, { scale: 1 - 0.2 * t }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        {
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
        },
        style,
      ]}
    />
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

export const DailyMicroActions: React.FC = () => {
  const { isDark, text } = useTheme();
  const { shouldAnimate } = useReducedMotion();

  // Zustand store
  const habits = useHabitsStore((s) => s.habits);
  const toggleHabit = useHabitsStore((s) => s.toggleHabit);

  // Local state para toggle de expansão
  const [showAll, setShowAll] = useState(false);

  // Filtra hábitos visíveis (top 3 ou todos)
  const visibleHabits = showAll ? habits : habits.slice(0, TOP_COUNT);
  const totalCount = habits.length;

  // Handler para toggle de hábito
  const handleToggle = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const today = new Date().toISOString().split("T")[0];
      toggleHabit(id, today);
    },
    [toggleHabit]
  );

  // Colors
  const cardBg = isDark ? neutral[800] : neutral[0];
  const textPrimary = isDark ? text.primary : neutral[800];
  const textSecondary = isDark ? text.secondary : neutral[500];
  const completedBg = isDark ? brand.primary[700] : brand.primary[50];
  const completedText = isDark ? brand.primary[200] : brand.primary[700];
  const checkColor = isDark ? brand.primary[300] : brand.primary[500];

  // Cores dos ícones (círculos coloridos inspirados em QuickComposerCard)
  const iconColors = [brand.teal[400], brand.primary[400], brand.accent[400]];
  const iconBgColors = [
    isDark ? `${brand.teal[500]}20` : brand.teal[50],
    isDark ? `${brand.primary[500]}20` : brand.primary[50],
    isDark ? `${brand.accent[500]}20` : brand.accent[50],
  ];

  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      {/* Header: título + botão na mesma linha, subtítulo abaixo */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: textPrimary }]}>Micro-ações do dia</Text>
        <Pressable
          onPress={() => setShowAll(!showAll)}
          style={styles.toggleButton}
          accessibilityRole="button"
          accessibilityLabel={showAll ? "Ver menos ações" : `Ver todas ${totalCount} ações`}
        >
          <Text style={[styles.toggleText, { color: brand.primary[600] }]}>
            {showAll ? "Ver menos" : `Ver todas (${totalCount})`}
          </Text>
        </Pressable>
      </View>
      <Text style={[styles.subtitle, { color: textSecondary }]}>
        Pequenos passos, grande diferença
      </Text>

      {/* Lista de ações */}
      <View style={styles.actionsContainer}>
        {visibleHabits.map((habit, index) => {
          const iconColor = iconColors[index % iconColors.length];
          const iconBgColor = iconBgColors[index % iconBgColors.length];

          return (
            <MicroActionItem
              key={habit.id}
              habit={habit}
              onToggle={() => handleToggle(habit.id)}
              iconColor={iconColor}
              iconBgColor={iconBgColor}
              checkColor={checkColor}
              completedBg={completedBg}
              completedText={completedText}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
              shouldAnimate={shouldAnimate}
            />
          );
        })}
      </View>
    </View>
  );
};

// ============================================================================
// MICRO ACTION ITEM (with animation + confetti)
// ============================================================================

interface MicroActionItemProps {
  habit: import("@/state/habits-store").Habit;
  onToggle: () => void;
  iconColor: string;
  iconBgColor: string;
  checkColor: string;
  completedBg: string;
  completedText: string;
  textPrimary: string;
  textSecondary: string;
  shouldAnimate: boolean;
}

function MicroActionItem({
  habit,
  onToggle,
  iconColor,
  iconBgColor,
  checkColor,
  completedBg,
  completedText,
  textPrimary,
  textSecondary,
  shouldAnimate,
}: MicroActionItemProps): React.JSX.Element {
  const isCompleted = habit.completed;
  const scale = useSharedValue(1);
  const [localBurstKey, setLocalBurstKey] = useState(0);
  const estimatedTime = HABIT_TIME_MAP[habit.id] || "5 min";

  // Anima scale quando completar (se animações habilitadas)
  useEffect(() => {
    if (isCompleted && shouldAnimate) {
      scale.value = withSpring(1.05, { damping: 12, stiffness: 220 }, () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 220 });
      });
      setLocalBurstKey((k) => k + 1);
    } else if (isCompleted) {
      // Reduce Motion: sem animação, só atualiza burst para mostrar check
      scale.value = 1;
      setLocalBurstKey((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted, shouldAnimate]);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isCompleted }}
      accessibilityLabel={`${habit.title}, ${isCompleted ? "concluído" : "pendente"}`}
      style={({ pressed }) => [
        styles.actionRow,
        {
          backgroundColor: isCompleted ? completedBg : "transparent",
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.actionContent}>
        {/* Indicador: ícone quando pendente, check quando concluído */}
        <Animated.View
          style={[
            styles.iconCircle,
            {
              backgroundColor: isCompleted ? checkColor : iconBgColor,
            },
            checkAnimatedStyle,
          ]}
        >
          {isCompleted ? (
            <Ionicons name="checkmark" size={14} color={neutral[0]} />
          ) : (
            <Ionicons
              name={habit.icon as keyof typeof Ionicons.glyphMap}
              size={15}
              color={iconColor}
            />
          )}
        </Animated.View>

        {/* Texto */}
        <View style={styles.actionTextContainer}>
          <Text
            style={[
              styles.actionLabel,
              {
                color: isCompleted ? completedText : textPrimary,
                opacity: isCompleted ? 0.55 : 1,
              },
            ]}
          >
            {habit.title}
          </Text>
          <Text style={[styles.actionMeta, { color: textSecondary }]}>
            {estimatedTime} • {habit.description}
          </Text>
        </View>
      </View>

      {/* Confetti ao completar (apenas se animações habilitadas) */}
      {isCompleted && shouldAnimate && <ConfettiBurst activeKey={localBurstKey} />}
    </Pressable>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    ...shadowPresets.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    marginBottom: spacing.md,
  },
  toggleButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    minHeight: accessibility.minTapTarget,
    justifyContent: "center",
  },
  toggleText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    fontWeight: "600",
  },
  actionsContainer: {
    gap: spacing.sm,
  },
  actionRow: {
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    minHeight: accessibility.minTapTarget,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  actionTextContainer: {
    flex: 1,
    gap: 2,
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
  },
  actionMeta: {
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  confettiContainer: {
    position: "absolute",
    right: 12,
    top: "50%",
    width: 40,
    height: 40,
    marginTop: -20,
    pointerEvents: "none",
  },
  confettiParticle: {
    position: "absolute",
    left: 20,
    top: 20,
    borderRadius: 999,
  },
});

export default DailyMicroActions;
