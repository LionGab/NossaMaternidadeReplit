# Architecture Deep Dive

> Nossa Maternidade — Arquitetura detalhada

---

## Navigation

### RootStackParamList (todas as rotas)

```typescript
type RootStackParamList = {
  // Auth Flow
  AuthLanding: undefined;
  EmailAuth: undefined;
  ForgotPassword: undefined;
  Login: undefined; // Legacy
  NotificationPermission: undefined;
  NathIAOnboarding: undefined;

  // Main App
  Onboarding: undefined;
  OnboardingStories: undefined;

  // Nath Journey Onboarding (state managed by store)
  OnboardingWelcome: undefined;
  OnboardingStage: undefined;
  OnboardingDate: undefined;
  OnboardingConcerns: undefined;
  OnboardingEmotionalState: undefined;
  OnboardingCheckIn: undefined;
  OnboardingSeason: undefined;
  OnboardingSummary: undefined;
  OnboardingPaywall: undefined;

  // Expanded Onboarding (Movimento Valente)
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

  // Tools
  DailyLog: { date?: string };
  Affirmations: undefined;
  Habits: undefined;
  HabitsEnhanced: undefined;
  MaeValenteProgress: undefined;

  // Wellness
  BreathingExercise: undefined;
  RestSounds: undefined;

  // Premium
  Paywall: { source?: string };

  // Mundo da Nath
  MundoDaNath: undefined;
  AdminDashboard: undefined;
  AdminPostsList: { filter?: "all" | "draft" | "scheduled" | "published" };
  AdminPostEditor: { postId?: string };

  // Other
  Legal: undefined;
  ComingSoon: {
    title?: string;
    description?: string;
    icon?: string;
    emoji?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    relatedRoute?: string;
  };
  DesignSystem: undefined;
};
```

### MainTabParamList (5 tabs)

```typescript
type MainTabParamList = {
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
      }
    | undefined;
  MundoNath: undefined;
  MyCare: undefined;
};
```

### Navigation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        App.tsx                                  │
│  - SafeAreaProvider                                             │
│  - GestureHandlerRootView                                       │
│  - AuthProvider                                                 │
│  - PremiumProvider                                              │
│  - SplashScreen                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     RootNavigator                               │
│  - NavigationContainer                                          │
│  - createNativeStackNavigator                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Auth      │      │  Onboarding │      │  MainTabs   │
│   Stack     │      │   Stack     │      │ (5 tabs)    │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Screen Types

```typescript
// Para usar em componentes de screen
import { RootStackScreenProps, MainTabScreenProps } from "@/types/navigation";

// Exemplo
export function HomeScreen({ navigation }: MainTabScreenProps<"Home">) {
  // ...
}

export function PostDetailScreen({ route }: RootStackScreenProps<"PostDetail">) {
  const { postId } = route.params;
  // ...
}
```

---

## State Management (Zustand)

### Store Overview

| Store                         | File                               | Persisted | Key State                    |
| ----------------------------- | ---------------------------------- | --------- | ---------------------------- |
| useAppStore                   | `store.ts`                         | Yes       | user, theme, isAuthenticated |
| useChatStore                  | `store.ts`                         | Yes       | messages, conversations      |
| useCycleStore                 | `store.ts`                         | Yes       | cycleData, predictions       |
| usePremiumStore               | `premium-store.ts`                 | Yes       | isPremium, offerings         |
| useNathJourneyOnboardingStore | `nath-journey-onboarding-store.ts` | Yes       | currentStep, userData        |
| useCommunityStore             | `store.ts`                         | No        | posts, groups                |
| useHabitsStore                | `store.ts`                         | Yes       | habits, streaks              |
| useCheckInStore               | `store.ts`                         | Yes       | checkIns, moods              |
| useAffirmationsStore          | `store.ts`                         | Yes       | favorites, history           |

### useAppStore

```typescript
interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;

  // Theme
  theme: "light" | "dark" | "system";
  isDarkMode: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  logout: () => void;
  completeOnboarding: () => void;
}

// Uso CORRETO
const user = useAppStore((s) => s.user);
const setUser = useAppStore((s) => s.setUser);

// Uso ERRADO (causa re-renders infinitos)
const { user, setUser } = useAppStore((s) => ({ user: s.user, setUser: s.setUser }));
```

### usePremiumStore

```typescript
interface PremiumState {
  isPremium: boolean;
  isLoading: boolean;
  offerings: PurchasesOfferings | null;
  customerInfo: CustomerInfo | null;

  // Actions
  syncWithRevenueCat: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

// Fluxo de sincronizacao
// 1. App.tsx chama initializePurchases()
// 2. Purchases.configure({ apiKey })
// 3. syncWithRevenueCat() → getCustomerInfo()
// 4. isPremium = entitlements.active['premium'] !== undefined
```

### useNathJourneyOnboardingStore

```typescript
interface OnboardingState {
  // Progress
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;

  // User Data
  name: string;
  stage: "trying" | "pregnant" | "postpartum";
  dueDate: string | null;
  concerns: string[];
  emotionalState: string;
  checkInPreference: string;
  season: string;

  // Actions
  setStep: (step: number) => void;
  setName: (name: string) => void;
  setStage: (stage: string) => void;
  // ... mais actions

  reset: () => void;
  completeOnboarding: () => void;
}
```

### Persistence (AsyncStorage)

```typescript
// Todas as stores persistidas usam este pattern
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useStore = create(
  persist(
    (set, get) => ({
      // state e actions
    }),
    {
      name: "store-name",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Selecionar apenas o que persistir
        user: state.user,
        theme: state.theme,
      }),
    }
  )
);
```

---

## Component Architecture

### Directory Structure

```
src/components/
├── ui/                      # Atomos reutilizaveis
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Avatar.tsx
│   ├── Badge.tsx
│   ├── Skeleton.tsx
│   ├── FloSectionTitle.tsx
│   └── ...
├── assistant/               # NathIA chat components
│   ├── ChatBubble.tsx
│   ├── MessageInput.tsx
│   ├── QuickReplies.tsx
│   └── ...
├── community/               # Community components
│   ├── PostCard.tsx
│   ├── CommentList.tsx
│   ├── GroupCard.tsx
│   └── ...
├── cycle/                   # Cycle tracking
│   ├── CycleCalendar.tsx
│   ├── DaySelector.tsx
│   └── ...
├── home/                    # Home screen
│   ├── WelcomeCard.tsx
│   ├── QuickActions.tsx
│   └── ...
├── onboarding/              # Onboarding
│   ├── ConcernCard.tsx
│   ├── EmotionalStateCard.tsx
│   ├── ShareableCard.tsx
│   └── ...
├── premium/                 # Premium/paywall
│   ├── PremiumGate.tsx
│   ├── SubscriptionCard.tsx
│   └── ...
└── shared/                  # Shared across features
    ├── Header.tsx
    ├── TabBar.tsx
    ├── EmptyState.tsx
    └── ...
```

### Component Pattern

```typescript
// src/components/ui/Button.tsx
import { Pressable, Text, ActivityIndicator } from "react-native";
import { cn } from "@/utils/cn";
import { Tokens } from "@/theme/tokens";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      className={cn(
        "items-center justify-center rounded-xl",
        // Size
        size === "sm" && "h-10 px-4",
        size === "md" && "h-12 px-6",
        size === "lg" && "h-14 px-8",
        // Variant
        variant === "primary" && "bg-primary",
        variant === "secondary" && "bg-secondary",
        variant === "ghost" && "bg-transparent",
        // State
        disabled && "opacity-50",
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={Tokens.neutral[50]} />
      ) : (
        <Text
          className={cn(
            "font-semibold",
            size === "sm" && "text-sm",
            size === "md" && "text-base",
            size === "lg" && "text-lg",
            variant === "primary" && "text-white",
            variant === "secondary" && "text-primary",
            variant === "ghost" && "text-primary"
          )}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
```

---

## Screen Inventory

### Auth Screens (4)

- `AuthLandingScreen` - Login options
- `EmailAuthScreen` - Email/password
- `ForgotPasswordScreen` - Password reset
- `LoginScreen` - Legacy

### Onboarding Screens (11)

- `OnboardingWelcome`
- `OnboardingStage`
- `OnboardingDate`
- `OnboardingConcerns`
- `OnboardingEmotionalState`
- `OnboardingCheckIn`
- `OnboardingSeason`
- `OnboardingSummary`
- `OnboardingPaywall`
- `OnboardingJourneySelect`
- `OnboardingMaternityStage`

### Main Tab Screens (5)

- `HomeScreen`
- `CommunityScreen`
- `AssistantScreen` (NathIA)
- `MundoDaNathScreen`
- `MyCareScreen`

### Community Screens (4)

- `PostDetailScreen`
- `NewPostScreen`
- `MyPostsScreen`
- `GroupDetailScreen`

### Profile/Settings Screens (3)

- `EditProfileScreen`
- `NotificationSettingsScreen`
- `NotificationPreferencesScreen`

### Tools Screens (5)

- `DailyLogScreen`
- `AffirmationsScreen`
- `HabitsScreen`
- `HabitsEnhancedScreen`
- `MaeValenteProgressScreen`

### Wellness Screens (2)

- `BreathingExerciseScreen`
- `RestSoundsScreen`

### Premium Screens (1)

- `PaywallScreen`

### Admin Screens (3)

- `AdminDashboardScreen`
- `AdminPostsListScreen`
- `AdminPostEditorScreen`

### Other Screens (3)

- `LegalScreen`
- `ComingSoonScreen`
- `DesignSystemScreen`

**Total: ~41 screens**

---

## Hooks Inventory

### State Hooks

- `useAppStore` - Main app state
- `usePremiumStore` - Premium state
- `useChatStore` - Chat state
- `useCycleStore` - Cycle state

### Theme Hooks

- `useThemeColors()` - Current theme colors
- `useColorScheme()` - System color scheme

### Auth Hooks

- `useAuth()` - Auth context
- `useSession()` - Current session

### Data Hooks

- `useUserProfile()` - User profile
- `usePosts()` - Community posts
- `useComments()` - Post comments
- `useGroups()` - Community groups

### Utility Hooks

- `useDebounce()` - Debounced value
- `useKeyboard()` - Keyboard state
- `useSafeAreaInsets()` - Safe area

---

## API Services

### Supabase Client

```typescript
// src/api/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Chat Service

```typescript
// src/api/chat-service.ts
export async function sendMessage(
  message: string,
  conversationId: string
): Promise<{ data: ChatResponse | null; error: Error | null }> {
  // Calls supabase/functions/ai
}
```

### Image Service

```typescript
// src/api/image-generation.ts
export async function generateImage(
  prompt: string
): Promise<{ data: string | null; error: Error | null }> {
  // Calls supabase/functions/upload-image
}
```

### Transcription Service

```typescript
// src/api/transcribe.ts
export async function transcribeAudio(
  audioUri: string
): Promise<{ data: string | null; error: Error | null }> {
  // Calls supabase/functions/transcribe
}
```
