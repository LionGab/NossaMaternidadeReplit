import { maternal, mood, typography } from "../theme/tokens";
import { PregnancyStage, Interest } from "../types/navigation";

// Typography - from Tokens.typography.fontFamily
export const FONTS = {
  display: typography.fontFamily.extrabold,
  headline: typography.fontFamily.bold,
  body: typography.fontFamily.medium,
  accent: typography.fontFamily.semibold,
  light: typography.fontFamily.base,
};

// Story slide type
export type StorySlide =
  | "welcome"
  | "moment"
  | "date"
  | "objectives"
  | "emotional"
  | "checkIn"
  | "reward";

export const SLIDES_ORDER: StorySlide[] = [
  "welcome",
  "moment",
  "date",
  "objectives",
  "emotional",
  "checkIn",
  "reward",
];

// Ionicon name type
type IoniconName =
  | "leaf-outline"
  | "heart-outline"
  | "heart"
  | "nutrition-outline"
  | "fitness-outline"
  | "brain-outline"
  | "happy-outline"
  | "water-outline"
  | "moon-outline"
  | "people-outline"
  | "sparkles"
  | "sunny-outline"
  | "alert-circle-outline"
  | "star-outline"
  | "cloud-outline"
  | "flash-outline"
  | "partly-sunny-outline";

// Moment options (replaces stage)
export const MOMENT_OPTIONS: {
  id: PregnancyStage;
  icon: IoniconName;
  label: string;
  subtitle: string;
}[] = [
  {
    id: "trying",
    icon: "leaf-outline",
    label: "Tentando engravidar",
    subtitle: "Cada mês é uma nova esperança",
  },
  {
    id: "pregnant",
    icon: "heart-outline",
    label: "Gestante",
    subtitle: "A vida crescendo dentro de você",
  },
  {
    id: "postpartum",
    icon: "heart",
    label: "Puerpério",
    subtitle: "Os primeiros dias são intensos",
  },
];

// Objectives options
export const OBJECTIVE_OPTIONS: { id: Interest; icon: IoniconName; label: string }[] = [
  { id: "nutrition", icon: "nutrition-outline", label: "Alimentação" },
  { id: "exercise", icon: "fitness-outline", label: "Movimento" },
  { id: "mental_health", icon: "brain-outline", label: "Mente" },
  { id: "baby_care", icon: "happy-outline", label: "Bebê" },
  { id: "breastfeeding", icon: "water-outline", label: "Amamentação" },
  { id: "sleep", icon: "moon-outline", label: "Sono" },
  { id: "relationships", icon: "people-outline", label: "Relacionamentos" },
  { id: "career", icon: "sparkles", label: "Propósito" },
];

// Emotional state options - using Tokens.mood
export const EMOTIONAL_OPTIONS: { id: string; icon: IoniconName; label: string; color: string }[] =
  [
    { id: "peaceful", icon: "sunny-outline", label: "Em paz", color: mood.calm },
    { id: "anxious", icon: "alert-circle-outline", label: "Ansiosa", color: mood.anxious },
    { id: "excited", icon: "star-outline", label: "Animada", color: mood.energetic },
    { id: "tired", icon: "cloud-outline", label: "Cansada", color: mood.tired },
    { id: "overwhelmed", icon: "flash-outline", label: "Sobrecarregada", color: mood.sensitive },
    { id: "hopeful", icon: "sparkles", label: "Esperançosa", color: mood.happy },
  ];

// Check-in time options
export const CHECKIN_OPTIONS: { id: string; icon: IoniconName; label: string; time: string }[] = [
  { id: "morning", icon: "sunny-outline", label: "Manhã", time: "Acordar com calma" },
  { id: "afternoon", icon: "partly-sunny-outline", label: "Tarde", time: "Pausa do dia" },
  { id: "evening", icon: "moon-outline", label: "Noite", time: "Antes de dormir" },
];

// 7-day plan items for Episode 0
export const SEVEN_DAY_PLAN = [
  { day: 1, title: "Conhecendo você", icon: "heart" as const },
  { day: 2, title: "Primeiro check-in", icon: "sunny" as const },
  { day: 3, title: "Afirmação diária", icon: "sparkles" as const },
  { day: 4, title: "Hábito de ouro", icon: "star" as const },
  { day: 5, title: "Comunidade", icon: "people" as const },
  { day: 6, title: "NathIA", icon: "chatbubble-ellipses" as const },
  { day: 7, title: "Celebração", icon: "trophy" as const },
];

// Story gradients - from Tokens.maternal.stories
export const STORY_GRADIENTS = maternal.stories;
