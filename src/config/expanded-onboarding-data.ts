/**
 * Dados do Onboarding Expandido - "Universo Nath"
 *
 * Baseado na pesquisa sobre Nathalia Valente:
 * - Superou anorexia na adolescência após sofrer bullying
 * - 35+ milhões de seguidores (TikTok + Instagram + YouTube)
 * - Foco em autoestima, autoaceitação corporal, saúde mental
 * - Público principal: jovens mulheres 15-35 anos
 * - Voz autêntica: direta, empática, sem julgamento
 *
 * Todas as quotes são escritas na voz da Nath:
 * - Português brasileiro informal
 * - Empática e acolhedora
 * - Compartilha experiências pessoais
 * - Sem julgamento, só apoio
 */

import { brand, maternal } from "../theme/tokens";
import {
  AnyConcern,
  ConcernCardData,
  EmotionalStateCardData,
  GoalCardData,
  JourneyCardData,
  LifeJourney,
  MaternityStageCardData,
} from "../types/expanded-onboarding.types";

// ============================================================================
// JORNADAS PRINCIPAIS
// ============================================================================

export const JOURNEY_CARDS: JourneyCardData[] = [
  {
    journey: "AUTOESTIMA",
    title: "Me amar mais",
    subtitle: "Autoestima & aceitação",
    nathQuote:
      "Eu sofri muito com isso. Tive anorexia, desmaiei várias vezes. Hoje sei que a gente merece se amar como é.",
    icon: "heart-outline",
    emoji: "💜",
    gradient: [maternal.strength.rose, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    journey: "SAUDE_CORPO",
    title: "Cuidar do meu corpo",
    subtitle: "Saúde & movimento",
    nathQuote:
      "Não é sobre ser magra, é sobre se sentir bem. Comecei a me exercitar por AMOR, não por punição.",
    icon: "fitness-outline",
    emoji: "💪",
    gradient: [brand.teal[50], brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    journey: "SAUDE_MENTAL",
    title: "Cuidar da minha mente",
    subtitle: "Ansiedade & bem-estar",
    nathQuote:
      "A ansiedade quase me destruiu. Hoje tenho ferramentas pra lidar - e quero compartilhar com você.",
    icon: "happy-outline",
    emoji: "🧠",
    gradient: [maternal.calm.lavender, brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    journey: "RELACIONAMENTOS",
    title: "Me relacionar melhor",
    subtitle: "Amor & conexões",
    nathQuote:
      "Já sofri muito por relações tóxicas. Aprendi que primeiro a gente precisa se amar pra amar o outro.",
    icon: "people-outline",
    emoji: "❤️",
    gradient: [maternal.bond.heart, brand.accent[100]],
    iconColor: brand.accent[600],
  },
  {
    journey: "ROTINA",
    title: "Organizar minha vida",
    subtitle: "Hábitos & rotina",
    nathQuote:
      "Minha vida era um caos. Quando criei uma rotina de autocuidado, TUDO mudou. Vou te mostrar como.",
    icon: "calendar-outline",
    emoji: "✨",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    journey: "MATERNIDADE",
    title: "Viver a maternidade",
    subtitle: "Gestação & maternidade",
    nathQuote:
      "Ser mãe é lindo e DIFÍCIL. Você não precisa ser perfeita, precisa ser real. To aqui contigo.",
    icon: "flower-outline",
    emoji: "🌸",
    gradient: [maternal.journey.gravidez, brand.accent[100]],
    iconColor: brand.accent[500],
  },
];

// ============================================================================
// ESTÁGIOS DA MATERNIDADE
// ============================================================================

export const MATERNITY_STAGE_CARDS: MaternityStageCardData[] = [
  {
    stage: "TENTANTE",
    title: "Tentando engravidar",
    nathQuote: "A ansiedade de cada ciclo é real. Respira. Cada corpo tem seu tempo.",
    icon: "heart-outline",
    gradient: [maternal.journey.tentando, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    stage: "GRAVIDA_T1",
    title: "Grávida - Primeiros meses",
    nathQuote: "Os enjoos, o medo, a alegria... tudo junto. É assim mesmo, tá tudo bem.",
    icon: "leaf-outline",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    stage: "GRAVIDA_T2",
    title: "Grávida - Barriga crescendo",
    nathQuote: "A melhor fase pra muitas! Sentir o bebê mexer é mágico demais.",
    icon: "flower-outline",
    gradient: [maternal.journey.gravidez, brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    stage: "GRAVIDA_T3",
    title: "Grávida - Reta final",
    nathQuote: "Ansiosa, com medo, empolgada... tudo ao mesmo tempo. Você tá quase lá!",
    icon: "balloon-outline",
    gradient: [brand.accent[50], brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    stage: "PUERPERIO",
    title: "Acabei de ter bebê",
    nathQuote: "Os primeiros dias são caóticos e lindos. Descansa, chora se precisar, pede ajuda.",
    icon: "happy-outline",
    gradient: [maternal.journey.posNatal, brand.accent[100]],
    iconColor: brand.accent[600],
  },
  {
    stage: "MAE_RECENTE",
    title: "Mãe recente (até 1 ano)",
    nathQuote: "Cada dia é um aprendizado. Você não precisa saber tudo, precisa só amar.",
    icon: "heart",
    gradient: [maternal.journey.maternidade, brand.accent[100]],
    iconColor: brand.accent[500],
  },
];

// ============================================================================
// PREOCUPAÇÕES/DESAFIOS POR JORNADA
// ============================================================================

export const CONCERN_CARDS: ConcernCardData[] = [
  // === AUTOESTIMA ===
  {
    concern: "INSEGURANCA_CORPO",
    journeys: ["AUTOESTIMA", "SAUDE_CORPO"],
    title: "Não gosto do meu corpo",
    nathQuote: "Já me odiei tanto... Hoje sei que meu corpo é minha casa, não meu inimigo.",
    icon: "body-outline",
    gradient: [maternal.strength.rose, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    concern: "COMPARACAO_REDES",
    journeys: ["AUTOESTIMA", "SAUDE_MENTAL"],
    title: "Me comparo nas redes",
    nathQuote: "As redes mostram o highlight, não a vida real. Ninguém posta os dias ruins.",
    icon: "phone-portrait-outline",
    gradient: [brand.secondary[50], brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    concern: "PERFECCIONISMO",
    journeys: ["AUTOESTIMA", "SAUDE_MENTAL"],
    title: "Preciso ser perfeita",
    nathQuote: "Perfeição não existe. Eu tentei ser perfeita e quase morri. Seja REAL.",
    icon: "star-outline",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[600],
  },
  {
    concern: "AUTOSABOTAGEM",
    journeys: ["AUTOESTIMA", "ROTINA"],
    title: "Tendo a me sabotar",
    nathQuote: "Quando você começa a se amar, para de se sabotar. É um processo.",
    icon: "warning-outline",
    gradient: [maternal.calm.mist, brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    concern: "VALIDACAO_EXTERNA",
    journeys: ["AUTOESTIMA", "RELACIONAMENTOS"],
    title: "Preciso de aprovação",
    nathQuote: "Passei anos vivendo pra agradar os outros. Hoje vivo pra mim.",
    icon: "thumbs-up-outline",
    gradient: [maternal.bond.heart, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    concern: "ACEITACAO_PESO",
    journeys: ["AUTOESTIMA", "SAUDE_CORPO"],
    title: "Luto com meu peso",
    nathQuote: "O número na balança não define seu valor. Eu sei porque já deixei definir o meu.",
    icon: "scale-outline",
    gradient: [brand.teal[50], brand.teal[100]],
    iconColor: brand.teal[500],
  },

  // === SAÚDE & CORPO ===
  {
    concern: "ALIMENTACAO",
    journeys: ["SAUDE_CORPO"],
    title: "Quero comer melhor",
    nathQuote: "Comer bem não é fazer dieta maluca. É nutrir seu corpo com amor.",
    icon: "nutrition-outline",
    gradient: [brand.teal[50], brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    concern: "EXERCICIO",
    journeys: ["SAUDE_CORPO", "ROTINA"],
    title: "Quero me exercitar",
    nathQuote: "Exercício é celebração do que seu corpo PODE fazer, não punição.",
    icon: "barbell-outline",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    concern: "SONO",
    journeys: ["SAUDE_CORPO", "SAUDE_MENTAL"],
    title: "Durmo mal",
    nathQuote: "Sono ruim bagunça TUDO. Vou te dar dicas que mudaram minha vida.",
    icon: "moon-outline",
    gradient: [maternal.calm.lavender, brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    concern: "ENERGIA",
    journeys: ["SAUDE_CORPO", "SAUDE_MENTAL"],
    title: "Sem energia",
    nathQuote: "Cansaço constante não é normal. Vamos descobrir o que tá drenando você.",
    icon: "battery-half-outline",
    gradient: [maternal.strength.mint, brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    concern: "RELACAO_COMIDA",
    journeys: ["SAUDE_CORPO", "AUTOESTIMA"],
    title: "Relação difícil com comida",
    nathQuote: "Eu tive anorexia. Sei o que é ter medo de comer. Você não tá sozinha.",
    icon: "restaurant-outline",
    gradient: [brand.accent[50], brand.accent[100]],
    iconColor: brand.accent[600],
  },
  {
    concern: "CONSISTENCIA",
    journeys: ["SAUDE_CORPO", "ROTINA"],
    title: "Dificuldade em manter constância",
    nathQuote: "Consistência > intensidade. Pouco todo dia é melhor que muito de vez em quando.",
    icon: "repeat-outline",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },

  // === SAÚDE MENTAL ===
  {
    concern: "ANSIEDADE",
    journeys: ["SAUDE_MENTAL"],
    title: "Ansiedade",
    nathQuote: "A ansiedade quase me destruiu. Hoje tenho ferramentas - vou te passar.",
    icon: "pulse-outline",
    gradient: [maternal.calm.lavender, brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    concern: "ESTRESSE",
    journeys: ["SAUDE_MENTAL", "ROTINA"],
    title: "Muito estresse",
    nathQuote: "Estresse é o mal do século. A gente não pode eliminar, mas pode aprender a lidar.",
    icon: "thunderstorm-outline",
    gradient: [maternal.calm.mist, brand.primary[100]],
    iconColor: brand.primary[600],
  },
  {
    concern: "OVERTHINKING",
    journeys: ["SAUDE_MENTAL"],
    title: "Penso demais",
    nathQuote: "Minha cabeça não desliga nunca. Aprendi técnicas que ajudam MUITO.",
    icon: "cloud-outline",
    gradient: [brand.secondary[50], brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    concern: "EXAUSTAO_MENTAL",
    journeys: ["SAUDE_MENTAL", "ROTINA"],
    title: "Exaustão mental",
    nathQuote: "Burnout é real. Seu corpo tá pedindo uma pausa - escuta ele.",
    icon: "sad-outline",
    gradient: [maternal.calm.cloud, brand.primary[50]],
    iconColor: brand.primary[500],
  },
  {
    concern: "SOLITUDE",
    journeys: ["SAUDE_MENTAL", "RELACIONAMENTOS"],
    title: "Me sinto sozinha",
    nathQuote: "Dá pra se sentir sozinha no meio de mil pessoas. Eu sei. Vamos mudar isso.",
    icon: "person-outline",
    gradient: [maternal.bond.heart, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    concern: "AUTOCONHECIMENTO",
    journeys: ["SAUDE_MENTAL", "AUTOESTIMA"],
    title: "Quero me conhecer",
    nathQuote: "Me conhecer foi a melhor coisa que fiz. Demorou, mas valeu cada segundo.",
    icon: "eye-outline",
    gradient: [brand.teal[50], brand.teal[100]],
    iconColor: brand.teal[500],
  },

  // === RELACIONAMENTOS ===
  {
    concern: "AMOROSO",
    journeys: ["RELACIONAMENTOS"],
    title: "Relacionamento amoroso",
    nathQuote:
      "Amor próprio vem primeiro. Quando você se ama, atrai pessoas que te amam de verdade.",
    icon: "heart-outline",
    gradient: [maternal.bond.heart, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    concern: "FAMILIA",
    journeys: ["RELACIONAMENTOS"],
    title: "Relação com família",
    nathQuote:
      "Família é complicado. Nem sempre dá pra mudar eles, mas dá pra mudar como você lida.",
    icon: "home-outline",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    concern: "AMIZADES",
    journeys: ["RELACIONAMENTOS"],
    title: "Amizades",
    nathQuote: "Qualidade > quantidade. Prefiro 3 amigos de verdade que 100 conhecidos.",
    icon: "people-outline",
    gradient: [brand.secondary[50], brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    concern: "COMUNICACAO",
    journeys: ["RELACIONAMENTOS"],
    title: "Comunicação",
    nathQuote: "Aprendi que a maioria dos problemas é falta de comunicação. Falar é libertador.",
    icon: "chatbubble-outline",
    gradient: [brand.teal[50], brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    concern: "LIMITES",
    journeys: ["RELACIONAMENTOS", "AUTOESTIMA"],
    title: "Impor limites",
    nathQuote: "Dizer 'não' não é ser má. É se respeitar. Levei anos pra aprender isso.",
    icon: "hand-left-outline",
    gradient: [maternal.strength.rose, brand.accent[100]],
    iconColor: brand.accent[600],
  },
  {
    concern: "DEPENDENCIA_EMOCIONAL",
    journeys: ["RELACIONAMENTOS", "AUTOESTIMA"],
    title: "Dependência emocional",
    nathQuote: "Já fui muito dependente. Quando aprendi a me bastar, tudo mudou.",
    icon: "link-outline",
    gradient: [maternal.calm.lavender, brand.secondary[100]],
    iconColor: brand.secondary[500],
  },

  // === ROTINA ===
  {
    concern: "ORGANIZACAO",
    journeys: ["ROTINA"],
    title: "Desorganização",
    nathQuote: "Minha vida era um caos total. Pequenas mudanças fizeram diferença ENORME.",
    icon: "folder-outline",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    concern: "PROCRASTINACAO",
    journeys: ["ROTINA", "SAUDE_MENTAL"],
    title: "Procrastino muito",
    nathQuote: "Procrastinar é fugir de algo. Vamos descobrir do quê você tá fugindo.",
    icon: "time-outline",
    gradient: [maternal.calm.mist, brand.primary[100]],
    iconColor: brand.primary[600],
  },
  {
    concern: "TEMPO",
    journeys: ["ROTINA"],
    title: "Falta de tempo",
    nathQuote: "Todo mundo tem 24h. A diferença é como a gente usa. Vou te ajudar.",
    icon: "hourglass-outline",
    gradient: [brand.secondary[50], brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    concern: "PRODUTIVIDADE",
    journeys: ["ROTINA"],
    title: "Produtividade",
    nathQuote: "Produtividade não é fazer mil coisas. É fazer as certas.",
    icon: "rocket-outline",
    gradient: [brand.teal[50], brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    concern: "HABITOS",
    journeys: ["ROTINA", "SAUDE_CORPO"],
    title: "Criar bons hábitos",
    nathQuote: "Hábito de 5 minutos todo dia > esforço enorme de vez em quando.",
    icon: "checkmark-done-outline",
    gradient: [maternal.strength.mint, brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    concern: "EQUILIBRIO",
    journeys: ["ROTINA", "SAUDE_MENTAL"],
    title: "Equilibrar tudo",
    nathQuote: "Equilíbrio não é dividir tudo igual. É saber o que priorizar em cada momento.",
    icon: "options-outline",
    gradient: [maternal.calm.cloud, brand.primary[50]],
    iconColor: brand.primary[500],
  },

  // === MATERNIDADE ===
  {
    concern: "ANSIEDADE_MEDO",
    journeys: ["MATERNIDADE"],
    title: "Ansiedade e medo",
    nathQuote: "Eu tinha pavor do parto. Chorei MUITO. É normal ter medo.",
    icon: "alert-circle-outline",
    gradient: [maternal.selfCare.breathe, brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    concern: "INFORMACAO",
    journeys: ["MATERNIDADE"],
    title: "Falta de informação",
    nathQuote: "Toda hora no Google: 'é normal?' Te entendo DEMAIS.",
    icon: "help-circle-outline",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    concern: "SINTOMAS",
    journeys: ["MATERNIDADE"],
    title: "Sintomas físicos",
    nathQuote: "Enjoo 24/7. Os sintomas são reais e difíceis. Você não é fresca.",
    icon: "medkit-outline",
    gradient: [maternal.warmth.peach, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    concern: "CORPO",
    journeys: ["MATERNIDADE"],
    title: "Mudanças no corpo",
    nathQuote: "Estranhei MUITO meu novo corpo. Leva tempo aceitar.",
    icon: "body-outline",
    gradient: [maternal.strength.rose, brand.accent[100]],
    iconColor: brand.accent[600],
  },
  {
    concern: "RELACIONAMENTO",
    journeys: ["MATERNIDADE"],
    title: "Impacto no relacionamento",
    nathQuote: "A gente brigou MUITO. Gravidez mexe com tudo.",
    icon: "heart-dislike-outline",
    gradient: [maternal.bond.heart, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    concern: "TRABALHO",
    journeys: ["MATERNIDADE"],
    title: "Trabalho e maternidade",
    nathQuote: "Como vou fazer tudo? A culpa é real. Mas dá pra equilibrar.",
    icon: "briefcase-outline",
    gradient: [brand.secondary[50], brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    concern: "SOLIDAO",
    journeys: ["MATERNIDADE"],
    title: "Solidão",
    nathQuote: "Às vezes me sentia muito só. Maternidade pode ser solitária.",
    icon: "sad-outline",
    gradient: [maternal.calm.lavender, brand.secondary[100]],
    iconColor: brand.secondary[600],
  },
  {
    concern: "FINANCAS",
    journeys: ["MATERNIDADE"],
    title: "Questões financeiras",
    nathQuote: "Enxoval é CARO. Fiquei assustada. Mas dá pra fazer com o que tem.",
    icon: "wallet-outline",
    gradient: [maternal.strength.gold, brand.accent[100]],
    iconColor: brand.accent[600],
  },
];

// ============================================================================
// ESTADOS EMOCIONAIS
// ============================================================================

export const EMOTIONAL_STATE_CARDS: EmotionalStateCardData[] = [
  {
    state: "OTIMA",
    title: "Tô ótima!",
    nathResponse: "Que bom! Vamos manter essa energia boa!",
    icon: "sunny",
    emoji: "🌟",
    gradient: [maternal.strength.mint, brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    state: "BEM",
    title: "Tô bem",
    nathResponse: "Que bom! Aproveita esse momento bom.",
    icon: "partly-sunny",
    emoji: "😊",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    state: "OK",
    title: "Tô ok, poderia melhorar",
    nathResponse: "Entendo. Vamos trabalhar pra melhorar juntas.",
    icon: "cloud-outline",
    emoji: "😐",
    gradient: [maternal.calm.mist, brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    state: "ANSIOSA",
    title: "Ansiosa",
    nathResponse: "Te entendo DEMAIS. A ansiedade quase me destruiu. Vou te ajudar.",
    icon: "pulse",
    emoji: "😰",
    gradient: [maternal.calm.lavender, brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    state: "ESGOTADA",
    title: "Esgotada",
    nathResponse: "Seu corpo tá pedindo descanso. Vamos com calma, uma coisa de cada vez.",
    icon: "battery-dead",
    emoji: "😔",
    gradient: [brand.secondary[50], brand.secondary[100]],
    iconColor: brand.secondary[600],
  },
  {
    state: "NAO_SEI",
    title: "Não sei explicar",
    nathResponse: "Tudo bem não saber. Às vezes os sentimentos são confusos mesmo.",
    icon: "help-circle",
    emoji: "🤷‍♀️",
    gradient: [maternal.calm.cloud, brand.primary[50]],
    iconColor: brand.primary[500],
  },
  {
    state: "PREFIRO_NAO_DIZER",
    title: "Prefiro não dizer agora",
    nathResponse: "Tudo bem. Quando quiser conversar, tô aqui. Sem pressão.",
    icon: "ellipsis-horizontal",
    emoji: "🤐",
    gradient: [brand.accent[50], brand.accent[100]],
    iconColor: brand.accent[500],
  },
];

// ============================================================================
// OBJETIVOS/METAS
// ============================================================================

export const GOAL_CARDS: GoalCardData[] = [
  {
    goal: "ME_AMAR_MAIS",
    journeys: ["AUTOESTIMA", "SAUDE_MENTAL"],
    title: "Me amar mais",
    icon: "heart",
    emoji: "💜",
    gradient: [maternal.strength.rose, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    goal: "CUIDAR_SAUDE",
    journeys: ["SAUDE_CORPO", "ROTINA"],
    title: "Cuidar da saúde",
    icon: "fitness",
    emoji: "💪",
    gradient: [brand.teal[50], brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    goal: "ANSIEDADE_MENOS",
    journeys: ["SAUDE_MENTAL"],
    title: "Ter menos ansiedade",
    icon: "leaf",
    emoji: "🍃",
    gradient: [maternal.selfCare.breathe, brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    goal: "RELACIONAR_MELHOR",
    journeys: ["RELACIONAMENTOS"],
    title: "Relacionar melhor",
    icon: "people",
    emoji: "❤️",
    gradient: [maternal.bond.heart, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    goal: "ORGANIZAR_VIDA",
    journeys: ["ROTINA"],
    title: "Organizar a vida",
    icon: "calendar",
    emoji: "✨",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    goal: "SER_MAE",
    journeys: ["MATERNIDADE"],
    title: "Viver bem a maternidade",
    icon: "flower",
    emoji: "🌸",
    gradient: [maternal.journey.gravidez, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    goal: "AUTOCONHECIMENTO",
    journeys: ["SAUDE_MENTAL", "AUTOESTIMA"],
    title: "Me conhecer melhor",
    icon: "eye",
    emoji: "👁️",
    gradient: [maternal.calm.lavender, brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    goal: "EQUILIBRIO",
    journeys: ["ROTINA", "SAUDE_MENTAL"],
    title: "Ter mais equilíbrio",
    icon: "options",
    emoji: "⚖️",
    gradient: [brand.secondary[50], brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Filtra concerns por jornada
 */
export function getConcernsByJourney(journey: LifeJourney): ConcernCardData[] {
  return CONCERN_CARDS.filter((c) => c.journeys.includes(journey));
}

/**
 * Filtra goals por jornada
 */
export function getGoalsByJourney(journey: LifeJourney): GoalCardData[] {
  return GOAL_CARDS.filter((g) => g.journeys.includes(journey));
}

/**
 * Retorna a jornada por ID
 */
export function getJourneyById(journey: LifeJourney): JourneyCardData | undefined {
  return JOURNEY_CARDS.find((j) => j.journey === journey);
}

/**
 * Verifica se o concern pertence à jornada
 */
export function isConcernInJourney(concern: AnyConcern, journey: LifeJourney): boolean {
  const card = CONCERN_CARDS.find((c) => c.concern === concern);
  return card?.journeys.includes(journey) ?? false;
}
