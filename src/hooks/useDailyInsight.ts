// src/hooks/useDailyInsight.ts
import { useMemo } from 'react';
import { format } from 'date-fns';
import { INSIGHTS, type DailyInsight, getInsightsByJourney, getMaxDayIndex } from '../content/insights';
import { useDailyInsightStore } from '../state/daily-insight-store';
import { useAppStore } from '../state/app-store';
import { LifeJourney } from '../types/expanded-onboarding.types';

interface UseDailyInsightResult {
  insight: DailyInsight | null;
  journey: LifeJourney;
  dayIndex: number;
}

function toISODate(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

function clampDayIndex(day: number): number {
  if (Number.isNaN(day) || day < 1) return 1;
  return Math.floor(day);
}

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  const raw = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
  return clampDayIndex(raw);
}

function pickInsight(journey: LifeJourney, dayIndex: number): DailyInsight | null {
  const list = getInsightsByJourney(journey);
  if (!list.length) return null;

  const max = getMaxDayIndex(journey);
  const normalized = ((dayIndex - 1) % max) + 1; // loop
  const found = list.find((i) => i.dayIndex === normalized);
  return found ?? list[0] ?? null;
}

export function useDailyInsight(): UseDailyInsightResult {
  const { lastShownDate, lastInsightId, lastJourney, setDailyInsightCache } = useDailyInsightStore();
  const user = useAppStore((s) => s.user);

  return useMemo(() => {
    const today = new Date();
    const todayISO = toISODate(today);

    // Resolver de jornada + data inicial usando dados reais do app
    const journey = (user as { journey?: LifeJourney })?.journey || 'MATERNIDADE';
    const startDate = user?.createdAt ? new Date(user.createdAt) : new Date();
    
    const dayIndex = daysBetween(startDate, today);

    // Se já escolheu hoje, retorna o mesmo
    if (lastShownDate === todayISO && lastInsightId) {
      const cached = INSIGHTS.find((i) => i.id === lastInsightId);
      if (cached) {
        return { insight: cached, journey: (cached.journey as LifeJourney) || journey, dayIndex };
      }
    }

    // Se mudou a jornada mas ainda é o mesmo dia, priorizar cache se consistente
    if (lastShownDate === todayISO && lastInsightId && lastJourney) {
      const cached = INSIGHTS.find((i) => i.id === lastInsightId);
      if (cached) return { insight: cached, journey: cached.journey, dayIndex };
    }

    // Escolhe novo insight e persiste para hoje
    const picked = pickInsight(journey, dayIndex);
    if (picked) {
      setDailyInsightCache({ date: todayISO, insightId: picked.id, journey: picked.journey });
    }

    return { insight: picked, journey, dayIndex };
  }, [lastShownDate, lastInsightId, lastJourney, setDailyInsightCache, user]);
}
