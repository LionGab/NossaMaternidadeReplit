/**
 * Types para o onboarding "Jornada da Nath"
 * Onboarding funcional com design abstrato (gradientes + ícones)
 *
 * Expandido em Janeiro 2026 para suportar múltiplas jornadas:
 * - Movimento Valente (não apenas maternidade)
 * - 6 jornadas: Autoestima, Saúde, Mental, Relacionamentos, Rotina, Maternidade
 */

// Re-export expanded types para facilitar imports
export type {
  MaternityStage as ExpandedMaternityStage,
  LifeGoal,
  LifeJourney,
} from "./expanded-onboarding.types";

export type OnboardingStage =
  | "GENERAL"
  | "TENTANTE"
  | "GRAVIDA_T1"
  | "GRAVIDA_T2"
  | "GRAVIDA_T3"
  | "PUERPERIO_0_40D"
  | "MAE_RECENTE_ATE_1ANO";

export type OnboardingConcern =
  | "ANSIEDADE_MEDO"
  | "FALTA_INFORMACAO"
  | "SINTOMAS_FISICOS"
  | "MUDANCAS_CORPO"
  | "RELACIONAMENTO"
  | "TRABALHO_MATERNIDADE"
  | "SOLIDAO"
  | "FINANCAS";

export type EmotionalState =
  | "BEM_EQUILIBRADA"
  | "UM_POUCO_ANSIOSA"
  | "MUITO_ANSIOSA"
  | "TRISTE_ESGOTADA"
  | "PREFIRO_NAO_RESPONDER";

export type JourneyType = "maternity" | "cycle";

export type DateKind = "due_date" | "baby_birth" | "none";

/**
 * Key estável para presets de temporada (SSOT).
 * - `custom`: usa `seasonCustomName`
 */
export type SeasonKey =
  | "custom"
  | "eu_por_mim_mesma"
  | "saindo_do_automatico"
  | "fim_da_promessa_vazia"
  | "minha_jornada_real";

export interface SeasonPreset {
  key: Exclude<SeasonKey, "custom">;
  label: string;
}

// Import expandido
import type {
  MaternityStage as ExpandedMaternityStageType,
  LifeGoal,
  LifeJourney,
} from "./expanded-onboarding.types";

export interface OnboardingData {
  // === MOVIMENTO VALENTE (Janeiro 2026) ===

  // Jornada principal escolhida (6 opções)
  // null = ainda não escolheu, "maternity" é derivado de journey === "MATERNIDADE"
  journey: LifeJourney | null;

  // Sub-estágio de maternidade (se journey === "MATERNIDADE")
  maternityStage: ExpandedMaternityStageType | null;

  // Objetivos selecionados (máximo 3)
  goals: LifeGoal[];

  // === CAMPOS ORIGINAIS (mantidos para compatibilidade) ===

  // Fonte: onboarding principal usa maternity
  journeyType: JourneyType;

  // Tela 1 (legacy) - stage de maternidade
  stage: OnboardingStage | null;

  // Tela 2 (branching) - SSOT
  // - `due_date`: DPP (obrigatório quando etapa exigir)
  // - `baby_birth`: nascimento (opcional por agora)
  // - `none`: sem data (GENERAL/TENTANTE)
  dateKind: DateKind;
  dateIso: string | null; // ISO date (YYYY-MM-DD)

  // Tela 3
  concerns: OnboardingConcern[]; // max 3 (opcional)

  // Tela 4
  emotionalState: EmotionalState | null; // opcional

  // Tela 5
  dailyCheckIn: boolean;
  checkInHour: number; // 0-23 (default 21)

  // Tela 6 (ritual)
  seasonKey: SeasonKey | null; // opcional
  seasonCustomName: string | null; // max 40 chars (se seasonKey === 'custom')

  // Metadata
  completedAt: string | null; // ISO datetime
  isFounder: boolean; // badge se completou em D1
  needsExtraCare: boolean; // flag para emotional state crítico
}

export interface StageCardData {
  stage: OnboardingStage;
  title: string;
  quote: string;
  icon: string;
  /** Cores do gradiente para background abstrato */
  gradient: readonly [string, string];
  /** Cor do ícone */
  iconColor: string;
}

export interface ConcernCardData {
  concern: OnboardingConcern;
  icon: string; // Ionicons name
  title: string;
  quote: string;
  /** Cores do gradiente para background abstrato */
  gradient: readonly [string, string];
  /** Cor do ícone */
  iconColor: string;
}

export interface EmotionalStateOptionData {
  state: EmotionalState;
  icon: string; // Ionicons name
  title: string;
  response: string;
  /** Cores do gradiente para background abstrato */
  gradient: readonly [string, string];
  /** Cor do ícone */
  iconColor: string;
}

export type OnboardingScreen =
  // Movimento Valente - Novas telas (Janeiro 2026)
  | "OnboardingWelcome" // Tela de boas-vindas
  | "OnboardingJourneySelect" // Seleção de jornada principal (6 opções)
  | "OnboardingMaternityStage" // Sub-estágio de maternidade (se jornada = MATERNIDADE)
  // Fluxo original
  | "OnboardingStage" // Estágio da gravidez (legacy, para compatibilidade)
  | "OnboardingDate"
  | "OnboardingConcerns"
  | "OnboardingEmotionalState"
  | "OnboardingCheckIn"
  | "OnboardingSeason"
  | "OnboardingSummary"
  | "OnboardingPaywall";
