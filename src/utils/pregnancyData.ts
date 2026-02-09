/**
 * Pregnancy Data Utilities
 *
 * Provides baby size comparisons, development insights, and
 * pregnancy-related calculations for the home screen.
 *
 * @version 1.0 - Flo-inspired pregnancy tracking
 */

export interface BabySize {
  /** Emoji representation of the fruit/vegetable */
  fruit: string;
  /** Name of the fruit/vegetable in Portuguese */
  name: string;
  /** Approximate length in cm */
  length: string;
  /** Approximate weight in grams */
  weight: string;
}

export interface WeeklyInsight {
  id: string;
  text: string;
  icon: string;
}

/**
 * Baby size comparisons by week (weeks 4-40)
 * Each week has a fruit/vegetable comparison commonly used in pregnancy apps
 */
export const BABY_SIZE_BY_WEEK: Record<number, BabySize> = {
  4: { fruit: "🌱", name: "semente de papoula", length: "0.1 cm", weight: "<1g" },
  5: { fruit: "🍎", name: "semente de maçã", length: "0.2 cm", weight: "<1g" },
  6: { fruit: "🫛", name: "ervilha", length: "0.6 cm", weight: "<1g" },
  7: { fruit: "🫐", name: "mirtilo", length: "1.3 cm", weight: "<1g" },
  8: { fruit: "🫘", name: "feijão", length: "1.6 cm", weight: "1g" },
  9: { fruit: "🍇", name: "uva", length: "2.3 cm", weight: "2g" },
  10: { fruit: "🫒", name: "azeitona", length: "3.1 cm", weight: "4g" },
  11: { fruit: "🍓", name: "morango", length: "4.1 cm", weight: "7g" },
  12: { fruit: "🍋", name: "limão", length: "5.4 cm", weight: "14g" },
  13: { fruit: "🥝", name: "kiwi", length: "7.4 cm", weight: "23g" },
  14: { fruit: "🍑", name: "pêssego", length: "8.7 cm", weight: "43g" },
  15: { fruit: "🍊", name: "laranja", length: "10.1 cm", weight: "70g" },
  16: { fruit: "🥑", name: "abacate", length: "11.6 cm", weight: "100g" },
  17: { fruit: "🥕", name: "cenoura", length: "13 cm", weight: "140g" },
  18: { fruit: "🍠", name: "batata-doce", length: "14.2 cm", weight: "190g" },
  19: { fruit: "🥭", name: "manga", length: "15.3 cm", weight: "240g" },
  20: { fruit: "🍌", name: "banana", length: "16.4 cm", weight: "300g" },
  21: { fruit: "🥒", name: "pepino", length: "26.7 cm", weight: "360g" },
  22: { fruit: "🥥", name: "coco", length: "27.8 cm", weight: "430g" },
  23: { fruit: "🍆", name: "berinjela", length: "28.9 cm", weight: "500g" },
  24: { fruit: "🌽", name: "espiga de milho", length: "30 cm", weight: "600g" },
  25: { fruit: "🥬", name: "couve-flor", length: "34.6 cm", weight: "660g" },
  26: { fruit: "🥦", name: "brócolis", length: "35.6 cm", weight: "760g" },
  27: { fruit: "🥗", name: "alface", length: "36.6 cm", weight: "875g" },
  28: { fruit: "🍍", name: "abacaxi", length: "37.6 cm", weight: "1kg" },
  29: { fruit: "🎃", name: "abóbora pequena", length: "38.6 cm", weight: "1.15kg" },
  30: { fruit: "🥬", name: "repolho", length: "39.9 cm", weight: "1.32kg" },
  31: { fruit: "🥥", name: "coco grande", length: "41.1 cm", weight: "1.5kg" },
  32: { fruit: "🍈", name: "melão", length: "42.4 cm", weight: "1.7kg" },
  33: { fruit: "🍍", name: "abacaxi grande", length: "43.7 cm", weight: "1.9kg" },
  34: { fruit: "🎃", name: "abóbora", length: "45 cm", weight: "2.15kg" },
  35: { fruit: "🍉", name: "melancia pequena", length: "46.2 cm", weight: "2.4kg" },
  36: { fruit: "🥬", name: "alface romana", length: "47.4 cm", weight: "2.6kg" },
  37: { fruit: "🥬", name: "acelga", length: "48.6 cm", weight: "2.9kg" },
  38: { fruit: "🍈", name: "melão cantalupo", length: "49.8 cm", weight: "3.1kg" },
  39: { fruit: "🍉", name: "melancia média", length: "50.7 cm", weight: "3.3kg" },
  40: { fruit: "🎃", name: "abóbora grande", length: "51.2 cm", weight: "3.5kg" },
};

/**
 * Weekly insights by pregnancy week
 * Short, encouraging facts about baby development
 */
export const WEEKLY_INSIGHTS: Record<number, WeeklyInsight[]> = {
  18: [
    { id: "18-1", text: "Seu bebê já consegue ouvir sua voz!", icon: "👂" },
    { id: "18-2", text: "Movimentos fetais podem começar a ser sentidos", icon: "🦋" },
  ],
  19: [
    { id: "19-1", text: "O vérnix caseoso começa a proteger a pele do bebê", icon: "✨" },
    { id: "19-2", text: "Os sentidos estão se desenvolvendo rapidamente", icon: "👀" },
  ],
  20: [
    { id: "20-1", text: "Metade da gravidez! Parabéns mamãe!", icon: "🎉" },
    { id: "20-2", text: "O bebê já tem impressões digitais únicas", icon: "👆" },
  ],
  21: [
    { id: "21-1", text: "Seu bebê pode sentir o sabor do líquido amniótico", icon: "👅" },
    { id: "21-2", text: "As sobrancelhas estão se formando", icon: "😊" },
  ],
  22: [
    { id: "22-1", text: "O bebê pode sentir seu toque na barriga", icon: "🤚" },
    { id: "22-2", text: "Os olhos estão formados, mas ainda sem cor definida", icon: "👁️" },
  ],
  23: [
    { id: "23-1", text: "O bebê responde a sons altos e músicas", icon: "🎵" },
    { id: "23-2", text: "O ritmo de sono começa a se estabelecer", icon: "😴" },
  ],
  24: [
    { id: "24-1", text: "O rosto está quase totalmente formado", icon: "👶" },
    { id: "24-2", text: "Pulmões em desenvolvimento - praticando respirar", icon: "🫁" },
  ],
};

/**
 * Default insights for weeks not specifically defined
 */
const DEFAULT_INSIGHTS: WeeklyInsight[] = [
  { id: "default-1", text: "Seu bebê está crescendo a cada dia", icon: "💫" },
  {
    id: "default-2",
    text: "Cuide de você, mamãe. Você está fazendo um ótimo trabalho!",
    icon: "💝",
  },
];

/**
 * Milliseconds in a day (constant for performance)
 */
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Total pregnancy duration in days (40 weeks)
 */
const TOTAL_PREGNANCY_DAYS = 280;

/**
 * Calculate days pregnant from due date
 * Private helper - used only by getPregnancyWeek and getPregnancyDayOfWeek
 */
function calculateDaysPregnant(dueDate: Date): number {
  const diffTime = dueDate.getTime() - Date.now();
  const diffDays = Math.ceil(diffTime / MS_PER_DAY);
  return TOTAL_PREGNANCY_DAYS - diffDays;
}

/**
 * Calculate pregnancy week from due date
 */
export function getPregnancyWeek(dueDate: Date): number {
  const daysPregnant = calculateDaysPregnant(dueDate);
  const weeks = Math.floor(daysPregnant / 7);
  return Math.max(4, Math.min(40, weeks)); // Clamp between 4-40
}

/**
 * Calculate day of the week (1-7) in current pregnancy week
 */
export function getPregnancyDayOfWeek(dueDate: Date): number {
  const daysPregnant = calculateDaysPregnant(dueDate);
  return (daysPregnant % 7) + 1;
}

/**
 * Calculate trimester (1, 2, or 3)
 */
export function getTrimester(week: number): number {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  return 3;
}

/**
 * Calculate days remaining until due date
 */
export function getDaysRemaining(dueDate: Date): number {
  const diffTime = dueDate.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffTime / MS_PER_DAY));
}

/**
 * Get baby size for a specific week
 */
export function getBabySize(week: number): BabySize {
  const clampedWeek = Math.max(4, Math.min(40, week));
  return BABY_SIZE_BY_WEEK[clampedWeek] || BABY_SIZE_BY_WEEK[20];
}

/**
 * Get weekly insights for a specific week
 */
export function getWeeklyInsights(week: number): WeeklyInsight[] {
  return WEEKLY_INSIGHTS[week] || DEFAULT_INSIGHTS;
}

/**
 * Portuguese month names for date formatting
 */
const PORTUGUESE_MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

/**
 * Format due date in Portuguese
 */
export function formatDueDate(dueDate: Date): string {
  return `${dueDate.getDate()} de ${PORTUGUESE_MONTHS[dueDate.getMonth()]}`;
}

/**
 * Calculate pregnancy progress (0-1)
 */
export function getPregnancyProgress(week: number): number {
  return Math.min(1, Math.max(0, week / 40));
}
