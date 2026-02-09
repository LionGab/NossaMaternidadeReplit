/**
 * Dados para o onboarding "Jornada da Nath"
 * Design abstrato com gradientes + icones (sem fotos reais)
 */

import { brand, maternal } from "../theme/tokens";
import {
  ConcernCardData,
  EmotionalStateOptionData,
  SeasonKey,
  SeasonPreset,
  StageCardData,
} from "../types/nath-journey-onboarding.types";

/**
 * Stage Cards - 7 estagios da jornada (inclui GENERAL para bem-estar geral)
 * Cada um com gradiente unico e icone representativo
 */
export const STAGE_CARDS: StageCardData[] = [
  {
    stage: "GENERAL",
    title: "Quero cuidar de mim",
    quote: "O seu bem-estar é a base de tudo o que você constrói.",
    icon: "sparkles-outline",
    gradient: [maternal.selfCare.breathe, brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    stage: "TENTANTE",
    title: "Tentando engravidar",
    quote: "Lembro da ansiedade de cada ciclo",
    icon: "heart-outline",
    gradient: [maternal.journey.tentando, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    stage: "GRAVIDA_T1",
    title: "Gravida - Primeiros meses",
    quote: "Os enjoos eram reais demais",
    icon: "leaf-outline",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    stage: "GRAVIDA_T2",
    title: "Gravida - Barriga crescendo",
    quote: "Melhor fase! Senti ele mexer pela 1a vez",
    icon: "flower-outline",
    gradient: [maternal.journey.gravidez, brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    stage: "GRAVIDA_T3",
    title: "Gravida - Reta final",
    quote: "Ansiosa, com medo, mas empolgada",
    icon: "balloon-outline",
    gradient: [brand.accent[50], brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    stage: "PUERPERIO_0_40D",
    title: "Acabei de ter meu bebe",
    quote: "Primeiros 40 dias: caos lindo",
    icon: "happy-outline",
    gradient: [maternal.journey.posNatal, brand.accent[100]],
    iconColor: brand.accent[600],
  },
  {
    stage: "MAE_RECENTE_ATE_1ANO",
    title: "Mae recente (ate 1 ano)",
    quote: "Aprendendo a cada dia",
    icon: "heart",
    gradient: [maternal.journey.maternidade, brand.accent[100]],
    iconColor: brand.accent[500],
  },
];

/**
 * Concern Cards - 8 preocupacoes comuns
 * Cores semanticas para cada tipo de preocupacao
 */
export const CONCERN_CARDS: ConcernCardData[] = [
  {
    concern: "ANSIEDADE_MEDO",
    icon: "alert-circle-outline",
    title: "Ansiedade e medo",
    quote: "Eu tinha pavor do parto. Chorei MUITO.",
    gradient: [maternal.selfCare.breathe, brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    concern: "FALTA_INFORMACAO",
    icon: "help-circle-outline",
    title: "Falta de informação",
    quote: "Toda hora no Google: 'e normal?'",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    concern: "SINTOMAS_FISICOS",
    icon: "medkit-outline",
    title: "Sintomas físicos",
    quote: "Enjoo 24/7. Perdi 5kg no 1o trimestre.",
    gradient: [maternal.warmth.peach, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    concern: "MUDANCAS_CORPO",
    icon: "body-outline",
    title: "Mudanças no corpo",
    quote: "Estranhei MUITO meu novo corpo.",
    gradient: [maternal.strength.rose, brand.accent[100]],
    iconColor: brand.accent[600],
  },
  {
    concern: "RELACIONAMENTO",
    icon: "heart-dislike-outline",
    title: "Relacionamento",
    quote: "A gente brigou MUITO na gestacao.",
    gradient: [maternal.bond.heart, brand.accent[100]],
    iconColor: brand.accent[500],
  },
  {
    concern: "TRABALHO_MATERNIDADE",
    icon: "briefcase-outline",
    title: "Trabalho e maternidade",
    quote: "Como vou fazer tudo?",
    gradient: [brand.secondary[50], brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    concern: "SOLIDAO",
    icon: "sad-outline",
    title: "Solidão",
    quote: "As vezes me sentia muito so.",
    gradient: [maternal.calm.lavender, brand.secondary[100]],
    iconColor: brand.secondary[600],
  },
  {
    concern: "FINANCAS",
    icon: "wallet-outline",
    title: "Grana",
    quote: "Enxoval e CARO. Fiquei assustada.",
    gradient: [maternal.strength.gold, brand.accent[100]],
    iconColor: brand.accent[600],
  },
];

/**
 * Emotional State Options - 5 estados emocionais
 * Gradientes que refletem o mood de cada estado
 */
export const EMOTIONAL_STATE_OPTIONS: EmotionalStateOptionData[] = [
  {
    state: "BEM_EQUILIBRADA",
    icon: "sunny-outline",
    title: "Bem, em equilíbrio",
    response: "Que sorte! Aproveita esse momento",
    gradient: [maternal.strength.mint, brand.teal[100]],
    iconColor: brand.teal[500],
  },
  {
    state: "UM_POUCO_ANSIOSA",
    icon: "partly-sunny-outline",
    title: "Um pouco ansiosa",
    response: "Eu tbm. Vou te passar umas dicas",
    gradient: [maternal.calm.mist, brand.primary[100]],
    iconColor: brand.primary[500],
  },
  {
    state: "MUITO_ANSIOSA",
    icon: "thunderstorm-outline",
    title: "Muito ansiosa",
    response: "Te entendo DEMAIS. Vamos com calma",
    gradient: [maternal.calm.lavender, brand.secondary[100]],
    iconColor: brand.secondary[500],
  },
  {
    state: "TRISTE_ESGOTADA",
    icon: "rainy-outline",
    title: "Triste ou esgotada",
    response: "Nao esta sozinha. Tem ajuda, viu?",
    gradient: [brand.primary[50], brand.primary[100]],
    iconColor: brand.primary[600],
  },
  {
    state: "PREFIRO_NAO_RESPONDER",
    icon: "ellipsis-horizontal-outline",
    title: "Prefiro não falar agora",
    response: "Tudo bem. Quando quiser, eu to aqui",
    gradient: [maternal.calm.cloud, brand.primary[50]],
    iconColor: brand.secondary[500],
  },
];

/**
 * Season Presets - 4 opcoes de nome para temporada
 */
export const SEASON_PRESETS = [
  { key: "eu_por_mim_mesma", label: "Eu por mim mesma" },
  { key: "saindo_do_automatico", label: "Saindo do automatico" },
  { key: "fim_da_promessa_vazia", label: "Fim da promessa vazia" },
  { key: "minha_jornada_real", label: "Minha jornada real" },
] as const satisfies readonly SeasonPreset[];

export const SEASON_PRESET_BY_KEY: Record<
  Exclude<SeasonKey, "custom">,
  string
> = Object.fromEntries(SEASON_PRESETS.map((p) => [p.key, p.label])) as Record<
  Exclude<SeasonKey, "custom">,
  string
>;

export const SEASON_KEY_BY_LABEL: Record<string, Exclude<SeasonKey, "custom">> = Object.fromEntries(
  SEASON_PRESETS.map((p) => [p.label, p.key])
) as Record<string, Exclude<SeasonKey, "custom">>;
