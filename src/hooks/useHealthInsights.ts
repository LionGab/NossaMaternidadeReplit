/**
 * useHealthInsights Hook
 *
 * Analisa dados do usuário (mood, sleep, energy, habits, cycle)
 * e gera insights inteligentes para prevenção de saúde
 *
 * Features:
 * - Detecta padrões de humor baixo (possível depressão pós-parto)
 * - Alerta sobre sono insuficiente
 * - Sugere ações baseadas em dados reais
 * - Gateway para telemedicina
 */

import { useMemo } from "react";
import { useCheckInStore, useHabitsStore } from "@/state";

// =======================
// TYPES
// =======================

export type InsightType =
  | "mood_declining"
  | "sleep_poor"
  | "energy_low"
  | "habits_neglected"
  | "self_care_needed"
  | "cycle_irregular"
  | "positive_trend"
  | "great_progress";

export type InsightPriority = "high" | "medium" | "low";

export type InsightAction = "chat_nathia" | "log_mood" | "community";

export interface HealthInsight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  message: string;
  emoji: string;
  actions: {
    primary: {
      label: string;
      action: InsightAction;
      screen?: string;
    };
    secondary?: {
      label: string;
      action: InsightAction;
      screen?: string;
    };
  };
  data?: {
    avgMood?: number;
    avgSleep?: number;
    avgEnergy?: number;
    daysAnalyzed?: number;
    habitsCompleted?: number;
    trend?: "up" | "down" | "stable";
  };
}

interface UseHealthInsightsReturn {
  insights: HealthInsight[];
  hasHighPriorityInsight: boolean;
  topInsight: HealthInsight | null;
  stats: {
    avgMood: number;
    avgSleep: number;
    avgEnergy: number;
    habitsCompletedToday: number;
    totalHabits: number;
    checkInStreak: number;
  };
  isLoading: boolean;
}

// =======================
// HELPERS
// =======================

function getLastNDays(n: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

function calculateAverage(values: (number | null)[]): number {
  const validValues = values.filter((v): v is number => v !== null);
  if (validValues.length === 0) return 0;
  return validValues.reduce((a, b) => a + b, 0) / validValues.length;
}

function detectTrend(values: number[]): "up" | "down" | "stable" {
  if (values.length < 3) return "stable";

  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));

  const avgFirst = calculateAverage(firstHalf);
  const avgSecond = calculateAverage(secondHalf);

  const diff = avgSecond - avgFirst;
  if (diff > 0.5) return "up";
  if (diff < -0.5) return "down";
  return "stable";
}

// =======================
// INSIGHT GENERATORS
// =======================

function generateMoodInsight(
  avgMood: number,
  trend: "up" | "down" | "stable",
  daysAnalyzed: number
): HealthInsight | null {
  // Mood baixo persistente (< 2.5 em escala 1-5)
  if (avgMood > 0 && avgMood < 2.5 && daysAnalyzed >= 3) {
    return {
      id: "mood_low",
      type: "mood_declining",
      priority: "high",
      title: "Percebi que você não está bem",
      message: `Nos últimos ${daysAnalyzed} dias, seu humor tem estado mais baixo que o normal. Isso pode ser cansaço, estresse, ou algo mais. Quer conversar?`,
      emoji: "💜",
      actions: {
        primary: {
          label: "Conversar com NathIA",
          action: "chat_nathia",
          screen: "Assistant",
        },
      },
      data: { avgMood, daysAnalyzed, trend },
    };
  }

  // Tendência de queda no humor
  if (trend === "down" && avgMood < 3.5 && daysAnalyzed >= 5) {
    return {
      id: "mood_declining",
      type: "mood_declining",
      priority: "medium",
      title: "Seu humor está caindo",
      message:
        "Notei uma tendência de queda no seu bem-estar. Vamos conversar sobre o que está acontecendo?",
      emoji: "🌧️",
      actions: {
        primary: {
          label: "Conversar com NathIA",
          action: "chat_nathia",
          screen: "Assistant",
        },
      },
      data: { avgMood, daysAnalyzed, trend },
    };
  }

  return null;
}

function generateSleepInsight(avgSleep: number, daysAnalyzed: number): HealthInsight | null {
  // Sono muito ruim (< 2 em escala 1-5)
  if (avgSleep > 0 && avgSleep < 2 && daysAnalyzed >= 3) {
    return {
      id: "sleep_critical",
      type: "sleep_poor",
      priority: "high",
      title: "Você precisa descansar mais",
      message: `Seu sono tem sido muito ruim nos últimos dias. Isso afeta tudo: humor, energia, imunidade. Vamos encontrar uma solução?`,
      emoji: "😴",
      actions: {
        primary: {
          label: "Dicas de sono com NathIA",
          action: "chat_nathia",
          screen: "Assistant",
        },
      },
      data: { avgSleep, daysAnalyzed },
    };
  }

  // Sono ruim (< 3)
  if (avgSleep > 0 && avgSleep < 3 && daysAnalyzed >= 5) {
    return {
      id: "sleep_poor",
      type: "sleep_poor",
      priority: "medium",
      title: "Seu sono precisa de atenção",
      message: "Dormir bem é fundamental, especialmente agora. Posso te dar algumas dicas?",
      emoji: "💤",
      actions: {
        primary: {
          label: "Ver dicas",
          action: "chat_nathia",
          screen: "Assistant",
        },
      },
      data: { avgSleep, daysAnalyzed },
    };
  }

  return null;
}

function generateEnergyInsight(
  avgEnergy: number,
  avgSleep: number,
  daysAnalyzed: number
): HealthInsight | null {
  // Energia muito baixa
  if (avgEnergy > 0 && avgEnergy < 2 && daysAnalyzed >= 3) {
    const sleepRelated = avgSleep < 3;
    return {
      id: "energy_low",
      type: "energy_low",
      priority: sleepRelated ? "medium" : "high",
      title: "Sua energia está muito baixa",
      message: sleepRelated
        ? "Sua energia baixa pode estar relacionada ao sono. Vamos trabalhar nisso juntas?"
        : "Energia baixa persistente pode ter várias causas. Quer conversar sobre isso?",
      emoji: "🔋",
      actions: {
        primary: {
          label: "Conversar com NathIA",
          action: "chat_nathia",
          screen: "Assistant",
        },
      },
      data: { avgEnergy, avgSleep, daysAnalyzed },
    };
  }

  return null;
}

function generateHabitsInsight(
  habitsCompletedToday: number,
  totalHabits: number,
  avgMood: number
): HealthInsight | null {
  const completionRate = totalHabits > 0 ? habitsCompletedToday / totalHabits : 0;

  // Autocuidado negligenciado + humor baixo
  if (completionRate < 0.25 && avgMood < 3) {
    return {
      id: "self_care_needed",
      type: "self_care_needed",
      priority: "medium",
      title: "Que tal um tempinho pra você?",
      message:
        "Notei que você não tem cuidado muito de si. Um pequeno gesto já faz diferença. Que tal começar com algo simples?",
      emoji: "🌸",
      actions: {
        primary: {
          label: "Ver meus cuidados",
          action: "log_mood",
          screen: "Habits",
        },
      },
      data: { habitsCompleted: habitsCompletedToday },
    };
  }

  return null;
}

function generatePositiveInsight(
  avgMood: number,
  avgEnergy: number,
  trend: "up" | "down" | "stable",
  habitsCompletedToday: number,
  totalHabits: number
): HealthInsight | null {
  const completionRate = totalHabits > 0 ? habitsCompletedToday / totalHabits : 0;

  // Tudo ótimo!
  if (avgMood >= 4 && avgEnergy >= 4 && completionRate >= 0.5) {
    return {
      id: "great_progress",
      type: "great_progress",
      priority: "low",
      title: "Você está arrasando! 💪",
      message:
        "Seu humor, energia e autocuidado estão ótimos. Continue assim, você merece se sentir bem!",
      emoji: "✨",
      actions: {
        primary: {
          label: "Compartilhar na comunidade",
          action: "community",
          screen: "Community",
        },
      },
      data: { avgMood, avgEnergy, habitsCompleted: habitsCompletedToday, trend },
    };
  }

  // Tendência positiva
  if (trend === "up" && avgMood >= 3) {
    return {
      id: "positive_trend",
      type: "positive_trend",
      priority: "low",
      title: "Seu humor está melhorando!",
      message: "Que bom ver você se sentindo melhor. Continue cuidando de você! 💜",
      emoji: "🌈",
      actions: {
        primary: {
          label: "Ver afirmação do dia",
          action: "chat_nathia",
          screen: "Affirmations",
        },
      },
      data: { avgMood, trend },
    };
  }

  return null;
}

// =======================
// MAIN HOOK
// =======================

export function useHealthInsights(): UseHealthInsightsReturn {
  const checkIns = useCheckInStore((s) => s.checkIns);
  const habits = useHabitsStore((s) => s.habits);

  const insights = useMemo(() => {
    const last7Days = getLastNDays(7);
    const recentCheckIns = checkIns.filter((c) => last7Days.includes(c.date));

    // Calculate stats
    const moods = recentCheckIns.map((c) => c.mood);
    const sleeps = recentCheckIns.map((c) => c.sleep);
    const energies = recentCheckIns.map((c) => c.energy);

    const avgMood = calculateAverage(moods);
    const avgSleep = calculateAverage(sleeps);
    const avgEnergy = calculateAverage(energies);

    const validMoods = moods.filter((m): m is number => m !== null);
    const moodTrend = detectTrend(validMoods);

    const daysAnalyzed = recentCheckIns.length;
    const habitsCompletedToday = habits.filter((h) => h.completed).length;
    const totalHabits = habits.length;

    // Generate insights (priority order)
    const generatedInsights: HealthInsight[] = [];

    // High priority first
    const moodInsight = generateMoodInsight(avgMood, moodTrend, daysAnalyzed);
    if (moodInsight) generatedInsights.push(moodInsight);

    const sleepInsight = generateSleepInsight(avgSleep, daysAnalyzed);
    if (sleepInsight) generatedInsights.push(sleepInsight);

    const energyInsight = generateEnergyInsight(avgEnergy, avgSleep, daysAnalyzed);
    if (energyInsight) generatedInsights.push(energyInsight);

    const habitsInsight = generateHabitsInsight(habitsCompletedToday, totalHabits, avgMood);
    if (habitsInsight) generatedInsights.push(habitsInsight);

    // Positive insights (only if no high/medium priority)
    const hasHighPriority = generatedInsights.some(
      (i) => i.priority === "high" || i.priority === "medium"
    );
    if (!hasHighPriority && daysAnalyzed >= 3) {
      const positiveInsight = generatePositiveInsight(
        avgMood,
        avgEnergy,
        moodTrend,
        habitsCompletedToday,
        totalHabits
      );
      if (positiveInsight) generatedInsights.push(positiveInsight);
    }

    // Sort by priority
    const priorityOrder: Record<InsightPriority, number> = { high: 0, medium: 1, low: 2 };
    generatedInsights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return generatedInsights;
  }, [checkIns, habits]);

  const stats = useMemo(() => {
    const last7Days = getLastNDays(7);
    const recentCheckIns = checkIns.filter((c) => last7Days.includes(c.date));

    const moods = recentCheckIns.map((c) => c.mood);
    const sleeps = recentCheckIns.map((c) => c.sleep);
    const energies = recentCheckIns.map((c) => c.energy);

    return {
      avgMood: calculateAverage(moods),
      avgSleep: calculateAverage(sleeps),
      avgEnergy: calculateAverage(energies),
      habitsCompletedToday: habits.filter((h) => h.completed).length,
      totalHabits: habits.length,
      checkInStreak: recentCheckIns.length,
    };
  }, [checkIns, habits]);

  return {
    insights,
    hasHighPriorityInsight: insights.some((i) => i.priority === "high"),
    topInsight: insights[0] || null,
    stats,
    isLoading: false,
  };
}
