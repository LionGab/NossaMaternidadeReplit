/**
 * greeting.ts - Utilitário de saudação por horário
 *
 * Fornece saudação contextual baseada na hora do dia.
 */

export type GreetingPeriod = "morning" | "afternoon" | "evening" | "night";

export interface GreetingResult {
  period: GreetingPeriod;
  text: string;
  emoji: string;
}

/**
 * Retorna saudação baseada na hora do dia
 * @param date - Data para calcular (padrão: agora)
 * @returns Objeto com período e texto da saudação
 */
export function getGreeting(date: Date = new Date()): GreetingResult {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return { period: "morning", text: "Bom dia", emoji: "🌅" };
  }

  if (hour >= 12 && hour < 18) {
    return { period: "afternoon", text: "Boa tarde", emoji: "🌤️" };
  }

  if (hour >= 18 && hour < 23) {
    return { period: "evening", text: "Boa noite", emoji: "✨" };
  }

  return { period: "night", text: "Boa noite", emoji: "✨" };
}

/**
 * Formata saudação com nome opcional
 * @param name - Nome para personalizar (opcional)
 * @param date - Data para calcular (padrão: agora)
 * @returns Saudação formatada
 *
 * @example
 * formatGreeting() // "Bom dia"
 * formatGreeting("Ana") // "Bom dia, Ana"
 */
export function formatGreeting(name?: string, date: Date = new Date()): string {
  const { text } = getGreeting(date);
  const cleanName = name?.trim();

  return cleanName ? `${text}, ${cleanName}` : text;
}
