# Navigation/Onboarding Gate Audit Report

**Data:** 2026-01-05
**Auditor:** Subagente B - Navigation Specialist
**Status Geral:** FUNCIONA (com ressalvas)

---

## 1. RESUMO EXECUTIVO

| Aspecto      | Status  | Observacao                             |
| ------------ | ------- | -------------------------------------- |
| flowResolver | OK      | Logica deterministica bem implementada |
| DevBypass    | OK      | Granular e funcional                   |
| Stages       | PARCIAL | Stages Onboarding/NathIA obsoletos     |
| Tabs         | OK      | 5 tabs funcionais                      |
| Tipagem      | PARCIAL | Algumas rotas nao usadas               |

---

## 2. DIAGRAMA DO FLUXO

```
                    [App Start]
                         |
                         v
              +------------------+
              | isAuthenticated? |
              +------------------+
                  |           |
                 NO          YES
                  |           |
                  v           v
           [AuthLanding]  +-------------------------+
           [EmailAuth]    | notificationSetupDone?  |
           [Login]        +-------------------------+
                              |           |
                             NO          YES
                              |           |
                              v           v
                    [NotificationPermission]
                              |
                              v
              +--------------------------------+
              | isNathJourneyOnboardingComplete? |
              +--------------------------------+
                  |                    |
                 NO                   YES
                  |                    |
                  v                    |
       [OnboardingWelcome]             |
       [OnboardingStage]               |
       [OnboardingDate]                |
       [OnboardingConcerns]            |
       [OnboardingEmotionalState]      |
       [OnboardingCheckIn]             |
       [OnboardingSeason]              |
       [OnboardingSummary]             |
       [OnboardingPaywall]             |
                  |                    |
                  +--------------------+
                           |
                           v
         +----------------------------------+
         | isOnboardingComplete? (HARDCODED)|
         +----------------------------------+
                    (sempre true)
                           |
                           v
         +----------------------------------+
         | isNathIAOnboardingComplete?     |
         | (HARDCODED)                     |
         +----------------------------------+
                    (sempre true)
                           |
                           v
                    [MainTabs]
                         |
        +----------------+----------------+
        |        |        |       |       |
        v        v        v       v       v
     [Home] [Community] [Assistant] [MundoNath] [MyCare]
```

---

## 3. ANALISE: RootNavigator.tsx

### 3.1 Como o flowResolver e usado

```typescript
// Linha 145-152 - FlowState e montado:
const flowState: FlowState = {
  isAuthenticated,
  notificationSetupDone,
  isNathJourneyOnboardingComplete,
  // HARDCODED - Stages legados desativados
  isOnboardingComplete: true,
  isNathIAOnboardingComplete: true,
};

// Linha 155-161 - Flags resolvidas:
const { shouldShowLogin, shouldShowNotificationPermission, ... } =
  resolveNavigationFlags(flowState, devBypassActive);
```

**Avaliacao:** O flowResolver e usado corretamente como uma funcao pura que recebe o estado e retorna flags de navegacao. A decisao e deterministica e event-driven (sem polling).

### 3.2 Stages Ativos

| Stage                  | Screens                                       | Status |
| ---------------------- | --------------------------------------------- | ------ |
| Auth                   | AuthLanding, EmailAuth, ForgotPassword, Login | ATIVO  |
| NotificationPermission | NotificationPermission                        | ATIVO  |
| NathJourneyOnboarding  | 9 screens (Welcome->Paywall)                  | ATIVO  |
| MainApp                | MainTabs + 15 screens secundarias             | ATIVO  |

**Stages Obsoletos (hardcoded true):**

- `isOnboardingComplete` - Legacy onboarding removido
- `isNathIAOnboardingComplete` - NathIA onboarding removido

### 3.3 DevBypass

```typescript
// dev-bypass.ts - Configuracao atual:
DEV_CONFIG = {
  ENABLE_DEV_BYPASS: true, // Master switch
  BYPASS_LOGIN: false, // Mostra login
  BYPASS_NOTIFICATION_PERMISSION: true, // Pula notificacao
  BYPASS_ONBOARDING: false, // Mostra onboarding
};
```

**Funcoes granulares:**

- `isDevBypassActive()` - Full bypass (todos true)
- `isLoginBypassActive()` - Bypass apenas login
- `isNotificationBypassActive()` - Bypass apenas notificacao
- `isOnboardingBypassActive()` - Bypass apenas onboarding

**Seguranca:** Todas funcoes verificam `__DEV__` primeiro.

---

## 4. ANALISE: flowResolver.ts

### 4.1 Logica do Gate

```typescript
export function resolveNavigationStage(state: FlowState, devBypass = false): NavigationStage {
  if (devBypass) return "MainApp"; // Fast path

  if (!state.isAuthenticated) return "Login";
  if (!state.notificationSetupDone) return "NotificationPermission";
  if (!state.isNathJourneyOnboardingComplete) return "NathJourneyOnboarding";
  if (!state.isOnboardingComplete) return "Onboarding"; // NUNCA ATINGIDO
  if (!state.isNathIAOnboardingComplete) return "NathIAOnboarding"; // NUNCA ATINGIDO

  return "MainApp";
}
```

**Problema Identificado:**

- `Onboarding` e `NathIAOnboarding` stages existem no tipo mas nunca sao atingidos (hardcoded true)
- Codigo morto gera confusao e complexidade desnecessaria

### 4.2 Flags Usadas

| Flag                            | Origem                                           | Usado em RootNavigator |
| ------------------------------- | ------------------------------------------------ | ---------------------- |
| isAuthenticated                 | useAppStore + loginBypass                        | SIM                    |
| notificationSetupDone           | useNotificationSetup + notifBypass               | SIM                    |
| isNathJourneyOnboardingComplete | useNathJourneyOnboardingStore + onboardingBypass | SIM                    |
| isOnboardingComplete            | HARDCODED true                                   | NAO (obsoleto)         |
| isNathIAOnboardingComplete      | HARDCODED true                                   | NAO (obsoleto)         |

### 4.3 isFullyOnboarded()

```typescript
export function isFullyOnboarded(state: FlowState): boolean {
  return (
    state.isAuthenticated &&
    state.notificationSetupDone &&
    state.isNathJourneyOnboardingComplete &&
    state.isOnboardingComplete && // Sempre true
    state.isNathIAOnboardingComplete // Sempre true
  );
}
```

**Avaliacao:** Funciona corretamente dado que os valores hardcoded sao true. Porem, a funcao verifica mais do que precisa.

---

## 5. ANALISE: MainTabNavigator.tsx

### 5.1 Tabs Configuradas

| Tab       | Screen                     | Feature Toggle                     | ErrorBoundary |
| --------- | -------------------------- | ---------------------------------- | ------------- |
| Home      | HomeScreen/Redesign        | `redesign.home`                    | NAO           |
| Community | CommunityScreen/Redesign   | `redesign.s8`                      | SIM           |
| Assistant | AssistantScreen/Redesign   | `redesign.assistant`               | SIM           |
| MundoNath | MundoDaNathScreen/Redesign | `FEATURE_FLAGS.REDESIGN_MUNDONATH` | NAO           |
| MyCare    | HabitsScreen/Enhanced      | `redesign.meusHabitos`             | NAO           |

### 5.2 Feature Toggles

**Padroes de Toggle:**

1. `screenToggle(flag, redesign, legacy)` - Componente helper
2. `FEATURE_FLAGS.REDESIGN_*` - Flags diretas

**Inconsistencia:** MundoDaNath usa `FEATURE_FLAGS.REDESIGN_MUNDONATH` diretamente enquanto outros usam `screenToggle()`.

### 5.3 Acessibilidade

Todos os tabs tem:

- `tabBarAccessibilityLabel` definido
- `tabBarLabel` para texto visual
- Icones animados com feedback visual

---

## 6. ANALISE: types/navigation.ts

### 6.1 RootStackParamList

**Rotas Definidas:** 35 rotas

**Rotas Usadas (RootNavigator):** 28 rotas

- Auth: 4 (AuthLanding, EmailAuth, ForgotPassword, Login)
- Notification: 1
- Onboarding: 9
- MainApp: 14

**Rotas Nao Usadas:**
| Rota | Definida | Status |
|------|----------|--------|
| NathIAOnboarding | SIM | NAO RENDERIZADA |
| Onboarding | SIM | NAO RENDERIZADA |
| OnboardingStories | SIM | NAO RENDERIZADA |
| GroupDetail | SIM | NAO RENDERIZADA |
| NotificationSettings | SIM | NAO RENDERIZADA |

### 6.2 Params Tipados

**Bem tipados:**

- OnboardingDate: `{ stage: string }`
- OnboardingConcerns: `{ stage, date }`
- PostDetail: `{ postId: string }`
- Paywall: `{ source?: string }`

**Problema:** Params de onboarding usam `string` generico em vez de tipos especificos.

---

## 7. VERIFICACAO DO FLUXO

### 7.1 Usuario Nao Autenticado -> Login

```
isAuthenticated = false
  -> resolveNavigationStage() = "Login"
  -> shouldShowLogin = true
  -> Renderiza: AuthLanding, EmailAuth, ForgotPassword, Login
```

**Status:** FUNCIONA

### 7.2 Usuario Autenticado sem Onboarding -> Onboarding

```
isAuthenticated = true
notificationSetupDone = true (bypass)
isNathJourneyOnboardingComplete = false
  -> resolveNavigationStage() = "NathJourneyOnboarding"
  -> shouldShowNathJourneyOnboarding = true
  -> Renderiza: OnboardingWelcome...OnboardingPaywall
```

**Status:** FUNCIONA

### 7.3 Usuario com Onboarding Completo -> MainApp

```
isAuthenticated = true
notificationSetupDone = true
isNathJourneyOnboardingComplete = true
isOnboardingComplete = true (hardcoded)
isNathIAOnboardingComplete = true (hardcoded)
  -> resolveNavigationStage() = "MainApp"
  -> shouldShowMainApp = true
  -> Renderiza: MainTabs + screens secundarias
```

**Status:** FUNCIONA

---

## 8. PROBLEMAS ENCONTRADOS

### 8.1 CRITICOS (0)

Nenhum problema critico identificado.

### 8.2 WARNINGS (3)

| ID  | Problema                       | Arquivo                      | Impacto                    |
| --- | ------------------------------ | ---------------------------- | -------------------------- |
| W1  | Codigo morto em flowResolver   | flowResolver.ts:99-107       | Complexidade desnecessaria |
| W2  | FlowState tem campos obsoletos | flowResolver.ts:22-33        | Confusao para devs         |
| W3  | Rotas nao usadas em types      | navigation.ts:14,17,20,74,78 | Tipos poluidos             |

### 8.3 INFO (2)

| ID  | Observacao                             | Arquivo                 |
| --- | -------------------------------------- | ----------------------- |
| I1  | Feature toggle inconsistente           | MainTabNavigator.tsx:51 |
| I2  | Onboarding params usam string generico | navigation.ts:25-54     |

---

## 9. STATUS DO GATE

### Gate de Navegacao

| Condicao                     | Implementacao                      | Funciona |
| ---------------------------- | ---------------------------------- | -------- |
| Nao autenticado -> Login     | `!isAuthenticated`                 | SIM      |
| Autenticado -> Notificacao   | `!notificationSetupDone`           | SIM      |
| Notificacao OK -> Onboarding | `!isNathJourneyOnboardingComplete` | SIM      |
| Onboarding OK -> MainApp     | Hardcoded true                     | SIM      |

**Veredicto:** O gate FUNCIONA corretamente para o fluxo simplificado atual.

---

## 10. RECOMENDACOES

### Prioridade Alta

1. **Remover codigo morto do flowResolver**
   - Excluir stages `Onboarding` e `NathIAOnboarding`
   - Simplificar FlowState para 3 campos
   - Atualizar testes

2. **Limpar types/navigation.ts**
   - Remover rotas nao usadas
   - Ou marcar como `@deprecated`

### Prioridade Media

3. **Tipar params de onboarding**
   - Usar tipos especificos (OnboardingStage, etc)
   - Evitar `string` generico

4. **Padronizar feature toggles**
   - Usar `screenToggle()` consistentemente
   - Ou migrar tudo para FEATURE_FLAGS

### Prioridade Baixa

5. **Adicionar ErrorBoundary em mais tabs**
   - Home e MyCare sem protecao

---

## 11. TESTES EXISTENTES

O arquivo `flowResolver.test.ts` tem 313 linhas com cobertura de:

- Todos os stages
- DevBypass
- Edge cases
- Funcoes auxiliares

**Resultado dos Testes (previsto):** PASS

- Testes cobrem cenarios que incluem stages obsoletos
- Precisam ser atualizados se codigo morto for removido

---

## 12. CONCLUSAO

O sistema de navegacao e gate de onboarding esta **FUNCIONAL** com a arquitetura atual. O fluxo e:

1. **Deterministic** - Sem polling, event-driven
2. **Granular** - DevBypass configuravel por etapa
3. **Type-safe** - Params tipados (com ressalvas)
4. **Testado** - Cobertura de testes existente

**Divida tecnica:** Codigo morto dos stages legados (`Onboarding`, `NathIAOnboarding`) deve ser removido para reduzir complexidade.

---

**Gerado por:** Claude Code - Subagente B
**Tempo de auditoria:** ~10 minutos
