import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Root Stack Navigator
// NOTE: Must be 'type' (not interface) for ParamListBase constraint
export type RootStackParamList = {
  // Auth Flow
  AuthLanding: undefined;
  EmailAuth: undefined;
  ForgotPassword: undefined;
  Login: undefined; // Legacy, kept for compatibility
  NotificationPermission: undefined;
  NathIAOnboarding: undefined;

  // Main App
  Onboarding: undefined;

  // Nath Journey Onboarding - Stories Format
  OnboardingStories: undefined;

  // Nath Journey Onboarding - State managed by NathJourneyOnboardingStore
  // All screens read from store, no route.params needed
  OnboardingWelcome: undefined;
  OnboardingStage: undefined;
  OnboardingDate: undefined;
  OnboardingConcerns: undefined;
  OnboardingEmotionalState: undefined;
  OnboardingCheckIn: undefined;
  OnboardingSeason: undefined;
  OnboardingSummary: undefined;
  OnboardingPaywall: undefined;

  // Expanded Onboarding - Movimento Valente (Janeiro 2026)
  // Suporta múltiplas jornadas: Autoestima, Saúde, Mental, Relacionamentos, Rotina, Maternidade
  OnboardingJourneySelect: undefined;
  OnboardingMaternityStage: undefined;

  MainTabs: NavigatorScreenParams<MainTabParamList>;

  // Community
  PostDetail: { postId: string };
  NewPost: undefined;
  MyPosts: undefined;
  GroupDetail: { groupId: string };

  // Profile
  EditProfile: undefined;
  NotificationSettings: undefined;
  NotificationPreferences: undefined;
  // ARCHIVED: Privacy screens moved to archive/privacy-support/
  // PrivacySettings: undefined;

  // Tools
  DailyLog: { date?: string };
  Affirmations: undefined;

  // Habits
  Habits: undefined;
  HabitsEnhanced: undefined;
  MaeValenteProgress: undefined;

  // Wellness (new)
  BreathingExercise: undefined;
  RestSounds: undefined;

  // Premium
  Paywall: { source?: string };

  // Mundo da Nath
  MundoDaNath: undefined;

  // Admin - Mundo da Nath (apenas para admins)
  AdminDashboard: undefined;
  AdminPostsList: { filter?: "all" | "draft" | "scheduled" | "published" };
  AdminPostEditor: { postId?: string };
  Moderation: undefined;

  // Legal
  Legal: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;

  // Other
  ComingSoon: {
    title?: string;
    description?: string;
    icon?: string;
    emoji?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    relatedRoute?: string;
  };

  // Design System
  DesignSystem: undefined;
};

// Main Tab Navigator
// NOTE: Must be 'type' (not interface) for ParamListBase constraint
export type MainTabParamList = {
  Home: undefined;
  Community: undefined;
  Assistant:
    | {
        emotionalContext?:
          | "ansiosa"
          | "desanimada"
          | "com_sono"
          | "enjoada"
          | "em_paz"
          | "orgulhosa"
          | "bem"
          | "cansada"
          | "indisposta"
          | "amada";
        seedMood?: number; // Valor numérico do slider (0-1) para contexto adicional
      }
    | undefined;
  MundoNath: undefined;
  MyCare: undefined;
};

// Cycle Tracking Types
export interface CycleLog {
  id: string;
  date: string;
  isPeriod: boolean;
  flow?: "light" | "medium" | "heavy";
  symptoms: string[];
  mood: string[];
  notes?: string;
}

export interface DailyLog {
  id: string;
  date: string;
  temperature?: number;
  sleep?: number;
  water?: number;
  exercise?: boolean;
  sexActivity?: "protected" | "unprotected" | "none";
  symptoms: string[];
  mood: string[];
  discharge?: "none" | "light" | "medium" | "heavy";
  notes?: string;
}

export interface Affirmation {
  id: string;
  text: string;
  category: string;
}

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

// Onboarding Types
export type OnboardingStep =
  | "welcome"
  | "name"
  | "stage"
  | "dueDate"
  | "age"
  | "location"
  | "goals"
  | "challenges"
  | "support"
  | "communication"
  | "interests"
  | "complete";

export type PregnancyStage = "trying" | "pregnant" | "postpartum";

export type Interest =
  | "nutrition"
  | "exercise"
  | "mental_health"
  | "baby_care"
  | "breastfeeding"
  | "sleep"
  | "relationships"
  | "career";

// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  stage: PregnancyStage;
  dueDate?: string;
  babyBirthDate?: string;
  interests: Interest[];
  createdAt: string;
  hasCompletedOnboarding: boolean;
}

// Community Types
export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  groupId?: string;
  isLiked: boolean;
  type?: string;
  /** Status de revisão: pending | approved | rejected */
  status?: "pending" | "approved" | "rejected";
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
  category: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  image_url?: string;
  image_analysis?: string;
  audio_url?: string;
  audio_duration_seconds?: number;
  transcription?: string;
}
