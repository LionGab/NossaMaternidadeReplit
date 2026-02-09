/**
 * Mensagens contextuais baseadas no humor e estado do usuário
 *
 * Retorna mensagens adaptadas ao estado emocional atual,
 * evitando dissonância e punição desnecessária.
 */

export interface ContextualMessage {
  message: string;
  cta: string;
  ctaIcon: string;
}

export interface HabitsMessage {
  title: string;
  subtitle: string;
}

/**
 * Retorna mensagem contextual baseada no humor do check-in
 *
 * @param mood - Humor do check-in (1-5 scale)
 * - 1-2: Muito mal / Mal → Acolhimento
 * - 3: Neutro → Incentivo leve
 * - 4-5: Bem / Muito bem → Aproveitamento de embalo
 * - null: Sem check-in → CTA para fazer
 */
export function getContextualMessage(mood: number | null): ContextualMessage {
  // Sem check-in: incentivo para fazer
  if (mood === null) {
    return {
      message: "Como você está hoje?",
      cta: "Fazer check-in",
      ctaIcon: "heart",
    };
  }

  // Humor negativo (1-2): acolhimento
  if (mood <= 2) {
    return {
      message: "Tá pesado? Respira. Eu tô aqui.",
      cta: "Conversar sobre isso",
      ctaIcon: "chatbubble-ellipses",
    };
  }

  // Humor neutro (3): incentivo leve
  if (mood === 3) {
    return {
      message: "Quer deixar seu dia 1% melhor?",
      cta: "Escolher uma micro-ação",
      ctaIcon: "sparkles",
    };
  }

  // Humor positivo (4-5): aproveitar embalo
  return {
    message: "Vamos aproveitar esse embalo?",
    cta: "Definir intenção do dia",
    ctaIcon: "sunny",
  };
}

/**
 * Retorna mensagem não-punitiva para hábitos
 *
 * Evita "0/8" que gera sensação de falha antes de começar.
 * Foca em progresso semanal e mensagens de início.
 *
 * @param completed - Hábitos completados hoje
 * @param total - Total de hábitos configurados
 */
export function getHabitsMessage(completed: number, total: number): HabitsMessage {
  // Zero completados: mensagem de início (não punição)
  if (completed === 0) {
    return {
      title: "Hábitos",
      subtitle: "Seu primeiro te espera 🌱",
    };
  }

  // Todos completados: celebração
  if (completed === total) {
    return {
      title: "Hábitos",
      subtitle: "Tudo pronto hoje! ✨",
    };
  }

  // Progresso parcial: mostrar positivamente
  return {
    title: "Hábitos",
    subtitle: `${completed}/${total} completos`,
  };
}
