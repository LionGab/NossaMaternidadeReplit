/**
 * Types para o Onboarding Expandido - "Universo Nath"
 *
 * Baseado na pesquisa sobre Nathalia Valente:
 * - 35+ milhões de seguidores
 * - Superou anorexia na adolescência
 * - Foco em autoestima, autoaceitação e saúde mental
 * - Público: jovens mulheres de 15-35 anos
 *
 * Jornadas disponíveis:
 * 1. Autoestima & Autoaceitação
 * 2. Saúde & Corpo
 * 3. Saúde Mental
 * 4. Relacionamentos
 * 5. Rotina & Organização
 * 6. Maternidade (completa)
 */

// ============================================================================
// JORNADAS PRINCIPAIS (LIFE JOURNEYS)
// ============================================================================

/**
 * Jornada principal escolhida pelo usuário na primeira tela
 * Determina todo o fluxo subsequente do onboarding
 */
export type LifeJourney =
  | "AUTOESTIMA" // Relação consigo mesma, aceitação corporal
  | "SAUDE_CORPO" // Fitness, alimentação, hábitos físicos
  | "SAUDE_MENTAL" // Ansiedade, estresse, bem-estar emocional
  | "RELACIONAMENTOS" // Amor, família, amizades
  | "ROTINA" // Organização, produtividade, hábitos
  | "MATERNIDADE"; // Fluxo completo de maternidade

/**
 * Sub-estágios da jornada de Maternidade
 * Só aparecem se LifeJourney === "MATERNIDADE"
 */
export type MaternityStage =
  | "TENTANTE" // Tentando engravidar
  | "GRAVIDA_T1" // 1º trimestre (1-12 semanas)
  | "GRAVIDA_T2" // 2º trimestre (13-26 semanas)
  | "GRAVIDA_T3" // 3º trimestre (27-40 semanas)
  | "PUERPERIO" // 0-40 dias pós-parto
  | "MAE_RECENTE"; // Até 1 ano

// ============================================================================
// PREOCUPAÇÕES/DESAFIOS POR JORNADA
// ============================================================================

/**
 * Preocupações da jornada AUTOESTIMA
 */
export type AutoestimaConcern =
  | "INSEGURANCA_CORPO" // Não gosto do meu corpo
  | "COMPARACAO_REDES" // Me comparo muito nas redes
  | "PERFECCIONISMO" // Preciso ser perfeita
  | "AUTOSABOTAGEM" // Me boicoto sempre
  | "VALIDACAO_EXTERNA" // Dependo da opinião dos outros
  | "ACEITACAO_PESO"; // Dificuldade com meu peso

/**
 * Preocupações da jornada SAUDE_CORPO
 */
export type SaudeCorpoConcern =
  | "ALIMENTACAO" // Quero comer melhor
  | "EXERCICIO" // Quero me exercitar mais
  | "SONO" // Durmo mal
  | "ENERGIA" // Me sinto sem energia
  | "RELACAO_COMIDA" // Relação complicada com comida
  | "CONSISTENCIA"; // Não consigo manter rotina

/**
 * Preocupações da jornada SAUDE_MENTAL
 */
export type SaudeMentalConcern =
  | "ANSIEDADE" // Me sinto ansiosa
  | "ESTRESSE" // Estresse do dia a dia
  | "OVERTHINKING" // Penso demais em tudo
  | "EXAUSTAO_MENTAL" // Cansaço mental
  | "SOLITUDE" // Me sinto sozinha
  | "AUTOCONHECIMENTO"; // Quero me conhecer melhor

/**
 * Preocupações da jornada RELACIONAMENTOS
 */
export type RelacionamentosConcern =
  | "AMOROSO" // Relacionamento amoroso
  | "FAMILIA" // Relação com família
  | "AMIZADES" // Amizades e conexões
  | "COMUNICACAO" // Dificuldade de comunicar
  | "LIMITES" // Não sei impor limites
  | "DEPENDENCIA_EMOCIONAL"; // Dependência emocional

/**
 * Preocupações da jornada ROTINA
 */
export type RotinaConcern =
  | "ORGANIZACAO" // Desorganização geral
  | "PROCRASTINACAO" // Deixo tudo pra depois
  | "TEMPO" // Não tenho tempo
  | "PRODUTIVIDADE" // Quero ser mais produtiva
  | "HABITOS" // Criar bons hábitos
  | "EQUILIBRIO"; // Equilibrar tudo

/**
 * Preocupações da jornada MATERNIDADE (universais)
 */
export type MaternidadeConcern =
  | "ANSIEDADE_MEDO" // Ansiedade e medo
  | "INFORMACAO" // Falta de informação
  | "SINTOMAS" // Sintomas físicos
  | "CORPO" // Mudanças no corpo
  | "RELACIONAMENTO" // Impacto no relacionamento
  | "TRABALHO" // Conciliar trabalho
  | "SOLIDAO" // Solidão na maternidade
  | "FINANCAS"; // Questões financeiras

/**
 * União de todas as preocupações
 */
export type AnyConcern =
  | AutoestimaConcern
  | SaudeCorpoConcern
  | SaudeMentalConcern
  | RelacionamentosConcern
  | RotinaConcern
  | MaternidadeConcern;

// ============================================================================
// ESTADO EMOCIONAL (Universal)
// ============================================================================

export type EmotionalState =
  | "OTIMA" // Tô ótima!
  | "BEM" // Tô bem
  | "OK" // Tô ok, poderia melhorar
  | "ANSIOSA" // Ansiosa
  | "ESGOTADA" // Esgotada
  | "NAO_SEI" // Não sei explicar
  | "PREFIRO_NAO_DIZER"; // Prefiro não dizer agora

// ============================================================================
// OBJETIVOS (Goals) - O que a pessoa quer alcançar
// ============================================================================

export type LifeGoal =
  | "ME_AMAR_MAIS" // Me amar mais
  | "CUIDAR_SAUDE" // Cuidar da minha saúde
  | "ANSIEDADE_MENOS" // Ter menos ansiedade
  | "RELACIONAR_MELHOR" // Me relacionar melhor
  | "ORGANIZAR_VIDA" // Organizar minha vida
  | "SER_MAE" // Viver a maternidade bem
  | "AUTOCONHECIMENTO" // Me conhecer melhor
  | "EQUILIBRIO"; // Ter mais equilíbrio

// ============================================================================
// DADOS DO ONBOARDING
// ============================================================================

export interface ExpandedOnboardingData {
  // Tela 1: Jornada principal
  journey: LifeJourney | null;

  // Tela 2 (se MATERNIDADE): Estágio específico
  maternityStage: MaternityStage | null;

  // Tela 2 (se MATERNIDADE + GRAVIDA/MAE): Data relevante
  relevantDate: string | null; // ISO date (DPP ou nascimento)

  // Tela 3: Preocupações/desafios (max 3)
  concerns: AnyConcern[];

  // Tela 4: Estado emocional atual
  emotionalState: EmotionalState | null;

  // Tela 5: Objetivos (max 3)
  goals: LifeGoal[];

  // Tela 6: Check-in diário
  wantsDailyCheckIn: boolean;
  checkInTime: number; // 0-23, default 21

  // Tela 7: Personalização
  seasonName: string | null; // Nome da "temporada" da pessoa

  // Metadata
  completedAt: string | null;
  needsExtraCare: boolean; // Se estado emocional é crítico
  isFounder: boolean; // Badge especial
}

// ============================================================================
// DADOS DOS CARDS (UI)
// ============================================================================

export interface JourneyCardData {
  journey: LifeJourney;
  title: string;
  subtitle: string;
  nathQuote: string; // Fala autêntica da Nath
  icon: string; // Ionicons name
  emoji: string;
  gradient: readonly [string, string];
  iconColor: string;
}

export interface MaternityStageCardData {
  stage: MaternityStage;
  title: string;
  nathQuote: string;
  icon: string;
  gradient: readonly [string, string];
  iconColor: string;
}

export interface ConcernCardData {
  concern: AnyConcern;
  journeys: LifeJourney[]; // Quais jornadas esse concern aparece
  title: string;
  nathQuote: string;
  icon: string;
  gradient: readonly [string, string];
  iconColor: string;
}

export interface EmotionalStateCardData {
  state: EmotionalState;
  title: string;
  nathResponse: string; // Resposta empática da Nath
  icon: string;
  emoji: string;
  gradient: readonly [string, string];
  iconColor: string;
}

export interface GoalCardData {
  goal: LifeGoal;
  journeys: LifeJourney[]; // Quais jornadas esse goal aparece
  title: string;
  icon: string;
  emoji: string;
  gradient: readonly [string, string];
  iconColor: string;
}

// ============================================================================
// TELAS DO ONBOARDING
// ============================================================================

export type ExpandedOnboardingScreen =
  | "OnboardingWelcome" // Splash com a Nath
  | "OnboardingJourney" // Escolhe jornada principal
  | "OnboardingMaternity" // Se MATERNIDADE: estágio
  | "OnboardingDate" // Se MATERNIDADE + data: DPP/nascimento
  | "OnboardingConcerns" // Preocupações (filtradas por jornada)
  | "OnboardingEmotional" // Estado emocional
  | "OnboardingCheckIn" // Configurar check-in
  | "OnboardingSeason" // Nome da temporada
  | "OnboardingSummary" // Resumo personalizado
  | "OnboardingPaywall"; // Planos premium
