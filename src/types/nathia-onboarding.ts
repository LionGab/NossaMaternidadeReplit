/**
 * NathIA Onboarding Types
 * Focused on lifestyle + motherhood (NO menstruation/cycle/LMP/ovulation)
 */

export type LifeStage = "trying" | "pregnant" | "postpartum" | "lifestyle";

export type TryingFocus = "trying_emotions" | "mixed" | "lifestyle_only";
export type Trimester = "t1" | "t2" | "t3" | "unknown";
export type BabyAgeBucket = "0-6w" | "2-6m" | "6-12m" | "1y+";
export type Routine = "calm" | "busy" | "chaotic";
export type AgeRange = "18-24" | "25-34" | "35+" | "unknown";

export type InterestOption =
  | "beachwear"
  | "dance"
  | "self_esteem"
  | "sleep_energy"
  | "motherhood"
  | "travel"
  | "basic";

export type MoodToday = "excited" | "powerful" | "anxious" | "tired" | "other";

export type SensitiveTopic = "body_comparison" | "weight_diet" | "anxiety" | "none";

export type TonePreference = "direct" | "warm" | "balanced";

export type NotificationPref = "none" | "daily" | "weekly";

export interface StageDetail {
  trying_focus?: TryingFocus;
  trimester?: Trimester;
  week_approx?: number | null;
  baby_age_bucket?: BabyAgeBucket;
  routine?: Routine;
  age_range?: AgeRange;
}

export interface NathIAOnboardingProfile {
  nickname?: string | null;
  life_stage: LifeStage;
  stage_detail: StageDetail;
  interests: InterestOption[];
  mood_today?: MoodToday;
  mood_note?: string | null;
  sensitive_topics: SensitiveTopic[];
  body_safe_mode: boolean;
  tone_pref: TonePreference;
  allow_brand_recos: boolean;
  notifications_pref: NotificationPref;
  health_connect_interest: boolean;
  onboarding_completed_at: string | null;
  onboarding_version: number;
}

export const DEFAULT_NATHIA_PROFILE: NathIAOnboardingProfile = {
  nickname: null,
  life_stage: "lifestyle",
  stage_detail: {},
  interests: [],
  mood_today: undefined,
  mood_note: null,
  sensitive_topics: [],
  body_safe_mode: false,
  tone_pref: "balanced",
  allow_brand_recos: false,
  notifications_pref: "none",
  health_connect_interest: false,
  onboarding_completed_at: null,
  onboarding_version: 1,
};

// Screen step types
export type NathIAOnboardingStep = "phase" | "context" | "interests" | "mood" | "preferences";

// Options for each screen
export const LIFE_STAGE_OPTIONS: {
  id: LifeStage;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    id: "trying",
    label: "Tentando engravidar",
    icon: "leaf-outline",
    description: "Estou no caminho da maternidade",
  },
  {
    id: "pregnant",
    label: "Estou grávida",
    icon: "heart-outline",
    description: "Esperando meu bebê chegar",
  },
  {
    id: "postpartum",
    label: "Sou mãe / pós-parto",
    icon: "happy-outline",
    description: "Meu bebê já chegou",
  },
  {
    id: "lifestyle",
    label: "Lifestyle, moda e autoestima",
    icon: "sparkles",
    description: "Foco em bem-estar e estilo",
  },
];

export const TRYING_FOCUS_OPTIONS: {
  id: TryingFocus;
  label: string;
  description: string;
}[] = [
  {
    id: "trying_emotions",
    label: "Emoções e rotina de tentante",
    description: "Apoio emocional nessa jornada",
  },
  {
    id: "mixed",
    label: "Lifestyle + maternidade",
    description: "Um pouco de tudo",
  },
  {
    id: "lifestyle_only",
    label: "Só lifestyle por enquanto",
    description: "Foco em bem-estar geral",
  },
];

export const TRIMESTER_OPTIONS: {
  id: Trimester;
  label: string;
}[] = [
  { id: "t1", label: "1º trimestre (até 12 semanas)" },
  { id: "t2", label: "2º trimestre (13-26 semanas)" },
  { id: "t3", label: "3º trimestre (27+ semanas)" },
  { id: "unknown", label: "Prefiro não dizer" },
];

export const BABY_AGE_OPTIONS: {
  id: BabyAgeBucket;
  label: string;
}[] = [
  { id: "0-6w", label: "0-6 semanas (recém-nascido)" },
  { id: "2-6m", label: "2-6 meses" },
  { id: "6-12m", label: "6-12 meses" },
  { id: "1y+", label: "1 ano ou mais" },
];

export const ROUTINE_OPTIONS: {
  id: Routine;
  label: string;
  icon: string;
}[] = [
  { id: "calm", label: "Tranquila", icon: "sunny-outline" },
  { id: "busy", label: "Corrida", icon: "walk-outline" },
  { id: "chaotic", label: "Caótica", icon: "flash-outline" },
];

export const AGE_RANGE_OPTIONS: {
  id: AgeRange;
  label: string;
}[] = [
  { id: "18-24", label: "18-24 anos" },
  { id: "25-34", label: "25-34 anos" },
  { id: "35+", label: "35+ anos" },
  { id: "unknown", label: "Prefiro não dizer" },
];

export const INTEREST_OPTIONS: {
  id: InterestOption;
  label: string;
  icon: string;
}[] = [
  { id: "beachwear", icon: "sunny", label: "Moda praia / looks" },
  { id: "dance", icon: "musical-notes", label: "Fitness leve, dança e movimento" },
  { id: "self_esteem", icon: "diamond", label: "Autoestima e confiança no corpo" },
  { id: "sleep_energy", icon: "battery-full", label: "Sono, energia e rotina prática" },
  { id: "motherhood", icon: "heart-circle", label: "Gravidez e maternidade real" },
  { id: "travel", icon: "airplane", label: "Viagens e lifestyle" },
  { id: "basic", icon: "checkmark-circle", label: "Só o básico" },
];

export const MOOD_OPTIONS: {
  id: MoodToday;
  label: string;
  icon: string;
}[] = [
  { id: "excited", icon: "sparkles", label: "Animada" },
  { id: "powerful", icon: "flame", label: "Poderosa" },
  { id: "anxious", icon: "pulse", label: "Ansiosa" },
  { id: "tired", icon: "moon", label: "Cansada" },
  { id: "other", icon: "chatbubble-ellipses", label: "Outra vibe" },
];

export const SENSITIVE_TOPIC_OPTIONS: {
  id: SensitiveTopic;
  label: string;
}[] = [
  { id: "body_comparison", label: "Corpo e comparação" },
  { id: "weight_diet", label: "Peso e dieta" },
  { id: "anxiety", label: "Ansiedade" },
  { id: "none", label: "Nenhum" },
];

export const TONE_OPTIONS: {
  id: TonePreference;
  label: string;
  description: string;
}[] = [
  {
    id: "direct",
    label: "Direta e objetiva",
    description: "Vai direto ao ponto",
  },
  {
    id: "warm",
    label: "Acolhedora e conversa",
    description: "Mais carinhosa e detalhada",
  },
  {
    id: "balanced",
    label: "Meio termo",
    description: "Equilíbrio entre os dois",
  },
];

export const NOTIFICATION_OPTIONS: {
  id: NotificationPref;
  label: string;
  description: string;
}[] = [
  { id: "none", label: "Não", description: "Sem notificações" },
  { id: "daily", label: "Diária", description: "Uma mensagem por dia" },
  { id: "weekly", label: "Semanal", description: "Resumo semanal" },
];
