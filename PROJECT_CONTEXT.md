# PROJECT_CONTEXT.md

> **Nossa Maternidade** — Contexto completo do projeto para IAs
> Use este arquivo como "fonte da verdade" ao planejar features ou fazer análises com IA (Claude/ChatGPT/Cursor)

---

## 📱 Propósito do App

**Nossa Maternidade** (subtítulo: _"O mundo da Nat, pra você"_) é um app mobile de maternidade e autocuidado centrado na marca Natália Valente. Oferece:

- **NathIA**: IA conversacional (voz e texto) com personalidade da Natalia
- **Habit Tracker**: Rituais guiados em 5 sessões de vida (Mãe, Mulher, Casa, Trabalho, Amor)
- **Comunidade "MãesValente"**: Forum premium com moderação
- **Mundo Nath**: Feed exclusivo (close friends) para assinantes
- **Premium via RevenueCat**: R$ 29,90/mês ou R$ 249,90/ano

Modelo freemium: free tier com limites (6 mensagens IA/dia); premium ilimitado.

---

## 🛠️ Stack Técnica

| Camada            | Tecnologia                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| **Framework**     | Expo SDK 54                                                                                            |
| **Runtime**       | React 19.1 + React Native 0.81                                                                         |
| **Linguagem**     | TypeScript strict (sem `any`, sem `@ts-ignore` sem justificativa)                                      |
| **UI**            | NativeWind 4 (Tailwind para RN), design tokens em `src/theme/tokens.ts`                                |
| **Estado Client** | Zustand (UI/local state apenas — não server state)                                                     |
| **Estado Server** | TanStack Query v5 (queries, mutations, cache)                                                          |
| **Backend**       | Supabase (auth, Postgres, Edge Functions, RLS)                                                         |
| **IA**            | Google Gemini 2.0 Flash (NathIA chat), ElevenLabs (voz — futuro)                                       |
| **IAP/Paywall**   | RevenueCat (produtos: `nossa_maternidade_monthly`, `nossa_maternidade_yearly`, entitlement: `premium`) |
| **Navegação**     | React Navigation 7 (stack + bottom tabs) — **sem Expo Router**                                         |
| **Analytics**     | Expo Insights + custom analytics (`src/services/analytics.ts`)                                         |
| **Listas**        | FlashList (longas), FlatList (curtas/simples)                                                          |
| **Touch**         | `Pressable` (não `TouchableOpacity` por padrão)                                                        |
| **Logging**       | `logger.*` de `src/utils/logger.ts` — **proibido `console.log` em `src/`**                             |

---

## 📂 Estrutura de Pastas

```
src/
├── api/                    # Supabase client, auth, API calls (fetch puro)
│   ├── hooks/              # TanStack Query hooks (useCommunityPosts, useCycleData, useHabits, etc.)
│   ├── auth.ts             # Auth API
│   ├── community.ts        # Community API
│   ├── supabase.ts         # Supabase client config
│   └── queryKeys.ts        # Chaves centralizadas para queries
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Primitivos/atoms (Button, Card, Input, etc.)
│   ├── home/               # Componentes da Home
│   ├── community/          # Componentes de Comunidade
│   ├── onboarding/         # Componentes de Onboarding
│   ├── chat/               # Componentes de Chat (NathIA)
│   └── profile/            # Componentes de Perfil
├── hooks/                  # Custom hooks (useAuth, useTheme, usePremium, etc.)
├── navigation/             # React Navigation setup
│   ├── RootNavigator.tsx   # Navigator raiz (Auth → Notification → Onboarding → Main)
│   ├── MainTabNavigator.tsx # Bottom tabs (Home | MãesValente | NathIA | Mundo Nath | Meus Cuidados)
│   └── types.ts            # Tipos de navegação
├── screens/                # Telas completas
│   ├── auth/               # Landing, EmailAuth, ForgotPassword
│   ├── onboarding/         # Nath Journey (12 etapas modulares)
│   ├── home/               # HomeScreen
│   ├── community/          # CommunityScreen (MãesValente)
│   ├── mundo/              # MundoScreenNathia (Close Friends)
│   ├── care/               # HabitosScreenNathia (Habit Tracker)
│   ├── assistant/          # Chat NathIA
│   ├── profile/            # ProfileScreen
│   └── premium/            # PaywallScreenRedesign
├── services/               # Lógica de negócio (analytics, revenuecat, notifications, moderation)
├── state/                  # Zustand stores (UI state apenas)
│   ├── app-store.ts        # Store principal (user, onboarding, UI)
│   ├── auth-init.ts        # Auth listener
│   ├── habits-store.ts     # Habits UI state
│   ├── premium-store.ts    # Premium status
│   └── ...
├── theme/                  # Design tokens, paletas, presets
│   ├── tokens.ts           # Cores, typography, spacing, radii
│   └── presets/            # Temas (calmFemtech, floClean)
├── types/                  # Tipos TypeScript compartilhados
└── utils/                  # Utilitários (logger, cn, formatters, etc.)

supabase/
├── functions/              # Edge Functions (transcribe, community-feed, moderate-content, etc.)
└── migrations/             # SQL migrations
```

---

## 🔐 Auth e Fluxo de Navegação

**Fluxo principal** (implementado em `src/navigation/RootNavigator.tsx`):

1. **Auth**: `AuthLandingScreen` → `EmailAuthScreen` (login/signup)
2. **Notification Permission**: `NotificationPermissionScreen` (pede push notification)
3. **Nath Journey Onboarding**: 12 telas modulares (Welcome, JourneySelect, MaternityStage, Date, Season, Stage, CheckIn, EmotionalState, Concerns, Paywall, Summary)
4. **Main App**: `MainTabNavigator` com 5 tabs:
   - Home
   - MãesValente (Community)
   - NathIA (chat — tab central com glow)
   - Mundo Nath (Close Friends feed)
   - Meus Cuidados (Habit Tracker)

**Onde está auth**:

- Hooks: `src/hooks/useAuth.ts`
- API: `src/api/auth.ts`, `src/api/social-auth.ts`
- Storage: `src/api/supabaseAuthStorage.ts` (MMKV para tokens)
- Store: `src/state/auth-init.ts` (listener de auth state)

---

## 📊 Dados e API

**TanStack Query hooks** (em `src/api/hooks/`):

- `useCommunityPosts` — posts da comunidade
- `useCycleData` — dados de ciclo menstrual/gestação
- `useHabits` — lista de hábitos do usuário
- `useLikePost`, `useDeletePost`, `useReportPost` — mutations de comunidade

**Query keys** centralizadas em `src/api/queryKeys.ts`:

```typescript
["community", "posts"][("community", "posts", { filter: "recent" })][("cycle", "data", userId)][
  ("habits", "list")
];
```

**Serviços** (lógica de negócio em `src/services/`):

- `analytics.ts` — tracking de eventos
- `revenuecat.ts` — IAP setup e status premium
- `notifications.ts` — push notifications
- `moderation.ts` — moderação de conteúdo
- `community.ts` — lógica de comunidade
- `mundoNath.ts` — feed Mundo Nath

---

## 🎨 Principais Telas e Rotas

**Auth**:

- `AuthLandingScreen` / `AuthLandingScreenNathia`
- `EmailAuthScreen`
- `ForgotPasswordScreen`

**Onboarding** (Nath Journey — 12 telas):

- `OnboardingWelcome` / `OnboardingWelcomeNathia`
- `OnboardingJourneySelect` / `OnboardingJourneySelectNathia`
- `OnboardingMaternityStage`, `OnboardingDate`, `OnboardingSeason`, `OnboardingStage`
- `OnboardingCheckIn`, `OnboardingEmotionalState`, `OnboardingConcerns`
- `OnboardingPaywall` / `OnboardingPaywallNathia`
- `OnboardingSummary` / `OnboardingSummaryNathia`

**Main Tabs**:

- `Home` — HomeScreen (checkin emocional, micro-actions, reminders, insight diário)
- `Community` — CommunityScreen (forum MãesValente)
- `NathIA` — NathIAStackNavigator (chat + consent gate)
- `MundoNath` — MundoScreenNathia (close friends feed)
- `MeusCuidados` — HabitosScreenNathia (habit tracker)

**Secondary Screens** (acessíveis via navegação):

- `Profile` — ProfileScreen
- `Paywall` — PaywallScreenRedesign
- `Affirmations` — AffirmationsScreen / AffirmationsScreenRedesign
- `DailyLog` — DailyLogScreen
- `RestSounds` — RestSoundsScreen
- Muitas outras em `src/screens/`

---

## 🔒 Padrões Obrigatórios

| Regra               | ✅ Correto                                                          | ❌ Errado                                   |
| ------------------- | ------------------------------------------------------------------- | ------------------------------------------- |
| **Server State**    | TanStack Query (`useQuery`, `useMutation`)                          | Fetch dentro de Zustand store               |
| **Client/UI State** | Zustand com seletor atômico: `useStore(s => s.value)`               | `useStore(s => ({ ...s }))` (cria nova ref) |
| **Listas longas**   | `FlashList` com `estimatedItemSize`                                 | `ScrollView` + `.map()`                     |
| **Listas curtas**   | `FlatList` com `keyExtractor` e `getItemLayout`                     | `ScrollView` + `.map()`                     |
| **Touch**           | `Pressable`                                                         | `TouchableOpacity` (exceto se necessário)   |
| **Cores**           | `Tokens.*` ou `useThemeColors()`                                    | Hardcoded: `#xxx`, `'white'`, `'black'`     |
| **Logging**         | `logger.*` (`logger.info`, `logger.error`)                          | `console.log` em `src/`                     |
| **TypeScript**      | `unknown` + type guards, tipos explícitos                           | `any`, `@ts-ignore` sem justificativa       |
| **Itens de lista**  | `React.memo()` nos componentes                                      | Componentes sem memoização                  |
| **Acessibilidade**  | `accessibilityLabel`, `accessibilityRole`, contraste WCAG AAA (7:1) | Sem a11y                                    |

**Zustand CRÍTICO** (previne loops infinitos):

```typescript
// ✅ CORRETO
const user = useAppStore((s) => s.user);
const isPremium = usePremiumStore((s) => s.isPremium);

// ❌ ERRADO — cria nova referência todo render
const { user } = useAppStore((s) => ({ user: s.user }));
```

**Query Key Pattern**:

```typescript
// Padrão: ['domain', 'operation', ...params]
["community", "posts"][("community", "posts", { filter: "recent" })][("cycle", "data", userId)][
  ("habits", "list")
][("habits", "detail", habitId)];
```

---

## 🚫 Proibições (Non-Negotiables)

1. ❌ `console.log` ou `console.*` em `src/` — use `logger.*`
2. ❌ `: any` sem necessidade — use `unknown` + type guards
3. ❌ `@ts-ignore` / `@ts-expect-error` sem justificativa em comentário
4. ❌ Fetch de servidor dentro de Zustand store — use TanStack Query
5. ❌ Hardcoded colors (`#fff`, `rgba(...)`, `'white'`, `'black'`) — use tokens
6. ❌ `TouchableOpacity` por padrão — use `Pressable`
7. ❌ `ScrollView` + `.map()` para listas longas — use `FlashList` ou `FlatList`
8. ❌ Imports relativos profundos (`../../../`) quando há alias `@/`
9. ❌ Adicionar dependências sem necessidade

---

## 📦 Constantes Imutáveis

| Constante                  | Valor                                                   |
| -------------------------- | ------------------------------------------------------- |
| **Bundle ID iOS**          | `br.com.nossamaternidade.app`                           |
| **Bundle ID Android**      | `com.liongab.nossamaternidade`                          |
| **Apple Team ID**          | `KZPW4S77UH`                                            |
| **Supabase Project ID**    | `lqahkqfpynypbmhtffyi`                                  |
| **RevenueCat Products**    | `nossa_maternidade_monthly`, `nossa_maternidade_yearly` |
| **RevenueCat Entitlement** | `premium`                                               |
| **IA Model**               | `gemini-2.0-flash-exp`                                  |

---

## ⚠️ O Que Está Incompleto ou Pendente

Conforme `docs/product/PRODUCT_VISION.md` e `PROJECT_STATUS.md`:

**Módulos "Futuro" (não implementados)**:

- **Feed Público "Nat todo dia"**: Conteúdo aberto pra topo do funil
- **Impacto Social**: Projetos sociais + transparência de doações

**Arquivos Swift removidos**: `PROJECT_STATUS.md` documenta que arquivos Swift (App.swift, ContentView.swift, etc.) foram removidos a pedido. Docs de Swift preservadas em arquivos `.md`.

**NathIA Voice**: Clonagem de voz via ElevenLabs está planejada mas não implementada (só texto por enquanto).

**Build local iOS**: Requer macOS/Xcode. No Windows, usar EAS cloud (`npm run build:prod:ios`).

---

## 📚 Documentação de Referência

Para **detalhes de implementação**, **quality-gate** e **release**:

- **`CLAUDE.md`**: Guia completo, skills, gates (G1–G7), workflow agentic
- **`AGENTS.md`**: Fluxo de build iOS, checklist P0, persistência em `docs/builds/`
- **`src/CLAUDE.md`**: Padrões de frontend, estrutura de código, hooks, stores

Para **visão de produto** (NÃO spec técnica):

- **`docs/product/PRODUCT_VISION.md`**: Modelo de negócio, módulos, diferenciais
- **`docs/product/NATALIA_BRAND.md`**: Quem é Natália Valente
- **`docs/product/BUSINESS_MODEL.md`**: Modelo de 4 camadas, monetização

Para **setup e troubleshooting**:

- **`docs/setup/CLAUDE_CODE_GUIDE_2026.md`**: Best practices 2026 para Claude Code
- **`docs/claude/architecture.md`**: Navegação, stores
- **`docs/claude/design-system.md`**: Tokens, cores, tipografia

---

## 🚀 Como Usar Este Arquivo

### Antes de Planejar Features com IA

Cole este `PROJECT_CONTEXT.md` + descrição da feature em Claude/ChatGPT/Cursor e peça:

1. **Plano de arquivos**: Novos e modificados
2. **Onde mexer**: Código existente que precisa de alteração
3. **Dependências**: Novas libs (se necessário)
4. **Riscos/Conflitos**: Com código atual
5. **Ordem de implementação**: Passo a passo

Valide o plano **antes** de implementar.

### No Cursor (Composer/Agent)

Use prompts que referenciem as regras:

```
"Neste projeto [regras em .cursorrules e CLAUDE.md]:

Quero implementar [feature].

Requisitos:
- [req 1]
- [req 2]

Gere:
1. Hook(s) em src/api/hooks/ (TanStack Query)
2. Componente(s) em src/components/
3. Tela(s) em src/screens/
4. Store em src/state/ (se necessário para UI state)
5. Integração com [Supabase/RevenueCat]

Mostre o diff completo antes de aplicar."
```

**Sempre revise o diff antes de aceitar**.

### Depois de Implementar

1. `npx expo start` — testa no simulador/emulador
2. Se erro: cola stack trace + arquivo problemático no Cursor
3. Opcional: pede revisão de diff para IA ("bugs, edge cases, performance, duplicação")
4. `npm run quality-gate` — antes de commit/PR

---

**Versão**: 1.0  
**Última atualização**: 2026-02-10
