# Baseline Report - Nossa Maternidade Onboarding Audit

**Data**: 2026-01-05
**Objetivo**: Auditoria completa do sistema de onboarding

---

## 1. RESUMO EXECUTIVO

| Aspecto                 | Status          | Notas                               |
| ----------------------- | --------------- | ----------------------------------- |
| **Typecheck**           | ✅ PASS         | Sem erros                           |
| **Lint**                | ✅ PASS         | Sem warnings                        |
| **Testes**              | ✅ PASS         | 105 testes passando                 |
| **Schema Supabase**     | ✅ Existe       | `028_nath_journey_onboarding.sql`   |
| **API Service**         | ✅ Funciona     | `saveOnboardingData()` implementado |
| **Gate de Navegacao**   | ✅ Funciona     | Via `flowResolver.ts`               |
| **Salvamento Supabase** | ✅ Implementado | No `OnboardingPaywall.tsx`          |
| **NativeWind**          | ❌ VIOLADO      | Telas usam StyleSheet               |
| **Params vs Store**     | ⚠️ ALERTA       | Dados passados via params           |

---

## 2. ESTRUTURA DO ONBOARDING

### 2.1 Fluxo de Telas (9 screens)

```
OnboardingWelcome
    ↓
OnboardingStage (escolha momento: tentante/gravida/mae)
    ↓
OnboardingDate (data relevante baseada no stage)
    ↓
OnboardingConcerns (max 3 preocupacoes)
    ↓
OnboardingEmotionalState (como se sente)
    ↓
OnboardingCheckIn (ativar lembretes)
    ↓
OnboardingSeason (nome da temporada)
    ↓
OnboardingSummary (resumo das escolhas)
    ↓
OnboardingPaywall (trial/compra/skip)
```

### 2.2 Arquivos Principais

| Arquivo                                               | Funcao                    |
| ----------------------------------------------------- | ------------------------- |
| `src/screens/onboarding/*.tsx`                        | 9 telas do wizard         |
| `src/components/onboarding/*.tsx`                     | Componentes reutilizaveis |
| `src/state/nath-journey-onboarding-store.ts`          | Store Zustand             |
| `src/api/onboarding-service.ts`                       | API para Supabase         |
| `src/types/nath-journey-onboarding.types.ts`          | Tipos TS                  |
| `src/navigation/flowResolver.ts`                      | Gate de navegacao         |
| `supabase/migrations/028_nath_journey_onboarding.sql` | Schema DB                 |

---

## 3. O QUE JA FUNCIONA

### 3.1 Schema Supabase (Completo)

```sql
-- Tabela user_onboarding com:
- stage (TENTANTE, GRAVIDA_T1/T2/T3, PUERPERIO, MAE_RECENTE)
- last_menstruation, due_date, birth_date
- concerns (array max 3)
- emotional_state
- daily_check_in, check_in_time
- season_name
- is_founder, needs_extra_care
- RLS policies (SELECT, INSERT, UPDATE, DELETE)
```

### 3.2 Store Zustand (Funcional)

```typescript
// Persiste em AsyncStorage
// Gerencia:
(-data(OnboardingData) -
  currentScreen -
  isComplete -
  // Actions:
  setStage,
  setConcerns,
  toggleConcern,
  etc - nextScreen,
  prevScreen - completeOnboarding,
  resetOnboarding -
    // Computed:
    canProceed(),
  getProgress(),
  needsExtraCare());
```

### 3.3 API Service (Implementado)

```typescript
// src/api/onboarding-service.ts
- saveOnboardingData(userId, data) → upsert no Supabase
- getOnboardingData(userId) → busca dados
- hasCompletedOnboarding(userId) → boolean
```

### 3.4 Gate de Navegacao (Funcional)

```typescript
// src/navigation/flowResolver.ts
- resolveNavigationStage() → determina stage atual
- resolveNavigationFlags() → flags para Navigator
// RootNavigator usa flowResolver corretamente
// Se isNathJourneyOnboardingComplete = false → mostra onboarding
```

---

## 4. PROBLEMAS IDENTIFICADOS

### 4.1 CRITICO: StyleSheet em vez de NativeWind

**Arquivos afetados:**

- `src/screens/onboarding/OnboardingSummary.tsx` (80 linhas de styles)
- `src/screens/onboarding/OnboardingPaywall.tsx` (150+ linhas de styles)

**Violacao:** CLAUDE.md proibe StyleSheet, exige NativeWind (`className`)

### 4.2 MEDIO: Dados via route.params

**Problema:**

- OnboardingSummary recebe dados via `route.params`
- OnboardingPaywall recebe `onboardingData` via params
- Duplicacao com Store (store tem os mesmos dados)

**Solucao:** Usar store como fonte unica de verdade

### 4.3 BAIXO: userId fallback para "anonymous"

**Codigo atual:**

```typescript
const userId = authUserId || "anonymous";
```

**Problema:** Com RLS, "anonymous" nao consegue salvar (auth.uid() sera null)

**Solucao:** Garantir que usuario esta autenticado antes de chegar no paywall

---

## 5. COMANDOS DE QUALIDADE

### 5.1 Typecheck

```bash
$ npm run typecheck
> tsc --noEmit
# PASS - sem erros
```

### 5.2 Lint

```bash
$ npm run lint
# PASS - sem warnings
```

### 5.3 Testes

```bash
$ npm run test
Test Suites: 7 passed, 7 total
Tests:       105 passed, 105 total
Time:        3.137s
```

---

## 6. PLANO DE ACAO

### Fase 1: Auditorias Detalhadas

- [ ] Build/Tooling - configs e scripts
- [ ] Navegacao - flow completo
- [ ] UI/A11y - design system compliance
- [ ] Supabase - schema e RLS
- [ ] State - sincronizacao store/db

### Fase 2: Correcoes

- [ ] Migrar StyleSheet → NativeWind (OnboardingSummary, OnboardingPaywall)
- [ ] Remover duplicacao params/store
- [ ] Melhorar tratamento de auth

### Fase 3: Documentacao

- [ ] docs/ONBOARDING.md
- [ ] docs/DATABASE.md
- [ ] Atualizar README.md

---

## 7. CONCLUSAO

O onboarding **JA ESTA FUNCIONAL** em termos de logica de negocio:

- Perguntas existem e funcionam
- Store persiste localmente
- Salvamento no Supabase implementado
- Gate de navegacao funciona

**Correcoes necessarias sao de QUALIDADE, nao de FUNCIONALIDADE:**

- Padronizacao de estilo (NativeWind)
- Remocao de duplicacao
- Melhoria de robustez

---

_Relatorio gerado automaticamente por Claude Code_
