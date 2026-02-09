/**
 * MOVIMENTO VALENTE - Conceito de Pertencimento
 *
 * Janeiro 2026 - Nathalia Valente em ascensão
 * 35+ milhões de seguidores querendo fazer parte de algo MAIOR
 *
 * ESTRATÉGIA DE RETENÇÃO:
 *
 * 1. IDENTIDADE COLETIVA
 *    - "Você é uma VALENTE" - não apenas uma usuária
 *    - Linguagem: "nós", "a gente", "juntas"
 *    - Símbolos: 💜 (roxo), fogo, coroa
 *
 * 2. RITUAIS DIÁRIOS
 *    - Check-in matinal: "Bom dia, Valente!"
 *    - Afirmação do dia da Nath
 *    - Desafio diário
 *    - Check-out noturno: "Como foi seu dia?"
 *
 * 3. PROGRESSÃO & RECONHECIMENTO
 *    - Níveis: Iniciante → Valente → Guerreira → Rainha
 *    - Badges por conquistas
 *    - Streak público na comunidade
 *    - "Valente do Mês" destaque
 *
 * 4. EXCLUSIVIDADE
 *    - Conteúdo "só para Valentes"
 *    - Lives exclusivas
 *    - Acesso antecipado a novidades
 *    - Comunidade fechada
 *
 * 5. CONEXÃO REAL
 *    - Histórias reais de superação
 *    - Duplas de apoio (buddy system)
 *    - Grupos por interesse/fase
 *    - Encontros presenciais (futuro)
 */

import { brand, Tokens } from "../theme/tokens";

// ============================================================================
// IDENTIDADE DO MOVIMENTO
// ============================================================================

export const MOVEMENT_IDENTITY = {
  name: "Movimento Valente",
  shortName: "Valentes",
  memberTitle: "Valente", // "Você é uma Valente"
  memberTitlePlural: "Valentes",

  // Taglines
  tagline: "Mulheres que escolhem se amar",
  subtagline: "Uma comunidade de milhões que decidiu parar de se cobrar e começar a se cuidar",

  // Manifesto curto
  manifesto: `
    Ser Valente não é sobre ser forte o tempo todo.
    É sobre ser REAL.
    É sobre chorar quando precisa.
    Pedir ajuda quando não dá mais.
    E se levantar, no seu tempo, do seu jeito.

    Aqui ninguém te julga.
    Aqui a gente se acolhe.
    Aqui você não está sozinha.

    Bem-vinda ao Movimento Valente.
    💜
  `.trim(),

  // Cores do movimento
  colors: {
    primary: brand.accent[500], // Roxo/Rosa
    secondary: brand.teal[500], // Verde-água
    accent: Tokens.premium.special.gold, // Dourado para conquistas
    background: brand.accent[50],
  },

  // Símbolos
  symbols: {
    emoji: "💜",
    fire: "🔥", // Para streaks
    crown: "👑", // Para Rainhas (nível máximo)
    star: "⭐", // Para conquistas
    heart: "💕", // Para comunidade
  },
};

// ============================================================================
// NÍVEIS DE PROGRESSÃO
// ============================================================================

export type ValenteLevel = "INICIANTE" | "VALENTE" | "GUERREIRA" | "RAINHA";

export interface LevelData {
  level: ValenteLevel;
  title: string;
  subtitle: string;
  minDays: number; // Dias mínimos de streak
  minPoints: number; // Pontos mínimos
  badge: string; // Emoji
  color: string;
  perks: string[];
}

export const LEVELS: LevelData[] = [
  {
    level: "INICIANTE",
    title: "Iniciante",
    subtitle: "Começando a jornada",
    minDays: 0,
    minPoints: 0,
    badge: "🌱",
    color: brand.primary[500],
    perks: ["Acesso à comunidade", "Check-ins diários", "Afirmações da Nath"],
  },
  {
    level: "VALENTE",
    title: "Valente",
    subtitle: "Comprometida com você mesma",
    minDays: 7,
    minPoints: 100,
    badge: "💜",
    color: brand.accent[500],
    perks: ["Badge exclusivo no perfil", "Acesso a conteúdos premium", "Participação em desafios"],
  },
  {
    level: "GUERREIRA",
    title: "Guerreira",
    subtitle: "Inspirando outras mulheres",
    minDays: 30,
    minPoints: 500,
    badge: "🔥",
    color: brand.teal[500],
    perks: ["Destaque na comunidade", "Mentoria de iniciantes", "Lives exclusivas com a Nath"],
  },
  {
    level: "RAINHA",
    title: "Rainha",
    subtitle: "Líder do Movimento Valente",
    minDays: 90,
    minPoints: 2000,
    badge: "👑",
    color: Tokens.premium.special.gold,
    perks: [
      "Coroa dourada no perfil",
      "Convite para eventos presenciais",
      "Acesso a TUDO, pra sempre",
      "Possível parceria com a Nath",
    ],
  },
];

// ============================================================================
// BADGES/CONQUISTAS
// ============================================================================

export type BadgeId =
  | "FIRST_CHECKIN"
  | "WEEK_STREAK"
  | "MONTH_STREAK"
  | "QUARTER_STREAK"
  | "FIRST_POST"
  | "HELPED_SOMEONE"
  | "COMPLETED_CHALLENGE"
  | "EARLY_BIRD"
  | "NIGHT_OWL"
  | "FOUNDER"
  | "SUPER_VALENTE";

export interface BadgeData {
  id: BadgeId;
  title: string;
  description: string;
  howToUnlock: string;
  emoji: string;
  rarity: "comum" | "raro" | "épico" | "lendário";
  points: number;
}

export const BADGES: BadgeData[] = [
  {
    id: "FIRST_CHECKIN",
    title: "Primeira Vez",
    description: "Fez seu primeiro check-in",
    howToUnlock: "Faça seu primeiro check-in diário",
    emoji: "🌟",
    rarity: "comum",
    points: 10,
  },
  {
    id: "WEEK_STREAK",
    title: "7 Dias Valente",
    description: "Uma semana inteira se cuidando",
    howToUnlock: "Faça check-in por 7 dias seguidos",
    emoji: "🔥",
    rarity: "comum",
    points: 50,
  },
  {
    id: "MONTH_STREAK",
    title: "30 Dias Valente",
    description: "Um mês de autocuidado",
    howToUnlock: "Faça check-in por 30 dias seguidos",
    emoji: "💪",
    rarity: "raro",
    points: 200,
  },
  {
    id: "QUARTER_STREAK",
    title: "90 Dias Valente",
    description: "Uma Guerreira de verdade",
    howToUnlock: "Faça check-in por 90 dias seguidos",
    emoji: "👑",
    rarity: "épico",
    points: 500,
  },
  {
    id: "FIRST_POST",
    title: "Voz Ativa",
    description: "Compartilhou na comunidade",
    howToUnlock: "Faça seu primeiro post na comunidade",
    emoji: "📣",
    rarity: "comum",
    points: 20,
  },
  {
    id: "HELPED_SOMEONE",
    title: "Mão Amiga",
    description: "Ajudou outra Valente",
    howToUnlock: "Receba 10 curtidas em comentários de apoio",
    emoji: "🤝",
    rarity: "raro",
    points: 100,
  },
  {
    id: "COMPLETED_CHALLENGE",
    title: "Desafio Aceito",
    description: "Completou um desafio",
    howToUnlock: "Complete qualquer desafio da semana",
    emoji: "🏆",
    rarity: "comum",
    points: 30,
  },
  {
    id: "EARLY_BIRD",
    title: "Madrugadora",
    description: "Check-in antes das 7h",
    howToUnlock: "Faça check-in antes das 7h da manhã",
    emoji: "🌅",
    rarity: "raro",
    points: 25,
  },
  {
    id: "NIGHT_OWL",
    title: "Coruja",
    description: "Check-out depois das 23h",
    howToUnlock: "Faça check-out depois das 23h",
    emoji: "🦉",
    rarity: "raro",
    points: 25,
  },
  {
    id: "FOUNDER",
    title: "Fundadora",
    description: "Estava aqui desde o início",
    howToUnlock: "Entrou no app na primeira semana de lançamento",
    emoji: "💎",
    rarity: "lendário",
    points: 1000,
  },
  {
    id: "SUPER_VALENTE",
    title: "Super Valente",
    description: "Reconhecida pela própria Nath",
    howToUnlock: "Seja destacada pela Nathalia",
    emoji: "🌈",
    rarity: "lendário",
    points: 5000,
  },
];

// ============================================================================
// RITUAIS DIÁRIOS
// ============================================================================

export interface DailyRitual {
  id: string;
  time: "morning" | "evening" | "anytime";
  title: string;
  description: string;
  icon: string;
  points: number;
}

export const DAILY_RITUALS: DailyRitual[] = [
  {
    id: "morning_checkin",
    time: "morning",
    title: "Bom dia, Valente!",
    description: "Como você acordou hoje?",
    icon: "sunny-outline",
    points: 10,
  },
  {
    id: "daily_affirmation",
    time: "morning",
    title: "Afirmação do Dia",
    description: "Uma mensagem da Nath pra você",
    icon: "heart-outline",
    points: 5,
  },
  {
    id: "daily_challenge",
    time: "anytime",
    title: "Desafio Valente",
    description: "Um pequeno passo de autocuidado",
    icon: "flash-outline",
    points: 20,
  },
  {
    id: "evening_checkout",
    time: "evening",
    title: "Boa noite, Valente!",
    description: "Como foi seu dia?",
    icon: "moon-outline",
    points: 10,
  },
  {
    id: "gratitude",
    time: "evening",
    title: "Gratidão",
    description: "3 coisas boas de hoje",
    icon: "sparkles-outline",
    points: 15,
  },
];

// ============================================================================
// MENSAGENS DE ONBOARDING
// ============================================================================

export const ONBOARDING_MESSAGES = {
  welcome: {
    title: "Bem-vinda ao\nMovimento Valente 💜",
    subtitle: "Milhões de mulheres já escolheram se cuidar.\nAgora é sua vez.",
    nathQuote:
      "Eu criei esse espaço porque sei como é difícil se amar num mundo que te cobra perfeição. Aqui você não precisa ser perfeita. Só precisa ser REAL.",
    cta: "Quero fazer parte",
  },

  journey: {
    title: "O que você quer transformar?",
    subtitle: "Escolhe a jornada que mais combina com seu momento agora",
    nathQuote:
      "Cada uma tá num momento diferente. E tá tudo bem. O importante é dar o primeiro passo.",
  },

  concerns: {
    title: "O que mais te pega?",
    subtitle: "Escolhe até 3 coisas que você quer trabalhar",
    nathQuote:
      "Eu já passei por TUDO isso. Ansiedade, insegurança, transtorno alimentar... Se eu superei, você também pode.",
  },

  emotional: {
    title: "Como você tá agora?",
    subtitle: "Seja honesta. Aqui ninguém te julga.",
    nathQuote: "Não precisa fingir que tá bem. Aqui a gente pode ser real.",
  },

  goals: {
    title: "O que você quer alcançar?",
    subtitle: "Escolhe até 3 objetivos pra gente trabalhar juntas",
    nathQuote: "Sonha grande, mas celebra cada pequena vitória. É assim que a gente cresce.",
  },

  checkin: {
    title: "Vamos criar um ritual?",
    subtitle: "Um momento todo dia só pra você se cuidar",
    nathQuote: "5 minutos por dia mudaram minha vida. Sério. Parece pouco, mas faz TODA diferença.",
  },

  season: {
    title: "Dá um nome pra essa fase",
    subtitle: "Como você quer chamar essa temporada da sua vida?",
    nathQuote: "Eu chamo de 'temporada' porque tudo passa. As fases difíceis também.",
    suggestions: [
      "Temporada: Eu por mim mesma",
      "Temporada: Sem mais desculpas",
      "Temporada: Minha vez de brilhar",
      "Temporada: Renascendo",
    ],
  },

  complete: {
    title: "Você agora é uma VALENTE! 💜",
    subtitle: "Bem-vinda à nossa comunidade",
    nathQuote:
      "Parabéns por dar esse passo! Agora você faz parte de milhões de mulheres que escolheram se amar. To orgulhosa de você!",
    cta: "Começar minha jornada",
  },
};

// ============================================================================
// HELPERS
// ============================================================================

export function getLevelByPoints(points: number, days: number): LevelData {
  // Encontra o maior nível que o usuário se qualifica
  let currentLevel = LEVELS[0];

  for (const level of LEVELS) {
    if (points >= level.minPoints && days >= level.minDays) {
      currentLevel = level;
    } else {
      break;
    }
  }

  return currentLevel;
}

export function getNextLevel(currentLevel: ValenteLevel): LevelData | null {
  const currentIndex = LEVELS.findIndex((l) => l.level === currentLevel);
  if (currentIndex < LEVELS.length - 1) {
    return LEVELS[currentIndex + 1];
  }
  return null;
}

export function getBadgeById(id: BadgeId): BadgeData | undefined {
  return BADGES.find((b) => b.id === id);
}

export function getRarityColor(rarity: BadgeData["rarity"]): string {
  switch (rarity) {
    case "comum":
      return brand.primary[500];
    case "raro":
      return brand.secondary[500];
    case "épico":
      return brand.accent[500];
    case "lendário":
      return Tokens.premium.special.gold;
    default:
      return brand.primary[500];
  }
}
