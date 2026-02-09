/**
 * Formatters
 *
 * Funções utilitárias para formatação de dados
 */

import type { LifeStage } from "@/types/nathia-onboarding";

/**
 * Formata uma data para exibição relativa (ex: "há 1h", "há 2 dias")
 * Otimizado para evitar cálculos redundantes
 */
export function formatTimeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diffMs / 1000);

  if (seconds < 60) return "agora";

  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "há 1 min";
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "há 1h";
  if (hours < 24) return `há ${hours}h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "há 1 dia";
  if (days < 7) return `há ${days} dias`;

  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "há 1 semana";
  if (weeks < 4) return `há ${weeks} semanas`;

  const months = Math.floor(days / 30);
  if (months === 1) return "há 1 mês";
  return `há ${months} meses`;
}

/**
 * Formata um número grande para exibição compacta (ex: 1.2k, 5M)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
}

/**
 * Trunca um texto no tamanho especificado com reticências
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Retorna saudação baseada no horário atual
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

/**
 * Retorna informação contextual da gravidez/puerpério
 */
export function getPregnancyInfo(
  userStage: LifeStage | undefined,
  dueDate: string | undefined,
  babyBirthDate: string | undefined
): string | null {
  if (userStage === "pregnant" && dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor((280 - diffDays) / 7);
    if (diffDays > 0) return `${weeks}ª semana de gestação`;
    return "Parto chegando!";
  } else if (userStage === "postpartum" && babyBirthDate) {
    const today = new Date();
    const birth = new Date(babyBirthDate);
    const diffTime = today.getTime() - birth.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} dias de puerpério`;
  }
  return null;
}

/**
 * Retorna label legível para o estágio da jornada
 */
export function getStageLabel(stage: LifeStage | undefined): string {
  switch (stage) {
    case "trying":
      return "Tentando Engravidar";
    case "pregnant":
      return "Grávida";
    case "postpartum":
      return "Pós-parto";
    case "lifestyle":
      return "Lifestyle";
    default:
      return "Sua Jornada";
  }
}

/**
 * Retorna emoji correspondente ao humor
 */
export function getMoodEmoji(mood: number | string): string {
  if (typeof mood === "number") {
    const numberToMood: Record<number, string> = {
      5: "😊",
      4: "🙂",
      3: "😐",
      2: "😔",
      1: "😢",
    };
    return numberToMood[mood] || "😐";
  }

  const moodMap: Record<string, string> = {
    great: "😊",
    good: "🙂",
    ok: "😐",
    bad: "😔",
    terrible: "😢",
  };
  return moodMap[mood] || "❤️";
}
