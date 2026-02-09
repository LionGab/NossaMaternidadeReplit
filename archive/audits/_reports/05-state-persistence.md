# Relatorio de Auditoria: State/Zustand/Persistence

**Data:** 2026-01-05
**Subagente:** E - State Audit
**Arquivos Analisados:**

- `src/state/nath-journey-onboarding-store.ts` (283 linhas)
- `src/state/nathia-onboarding-store.ts` (298 linhas)
- `src/state/store.ts` (888 linhas)
- `src/api/onboarding-service.ts` (166 linhas)
- `src/navigation/flowResolver.ts` (218 linhas)
- `src/navigation/RootNavigator.tsx` (471 linhas)
- Telas de onboarding (OnboardingStage, OnboardingDate, OnboardingSummary, OnboardingPaywall)

---

## 1. Resumo Executivo

| Aspecto                              | Status           | Severidade |
| ------------------------------------ | ---------------- | ---------- |
| Interface NathJourneyOnboardingState | Completa         | OK         |
| Persist middleware AsyncStorage      | Configurado      | OK         |
| Actions tipadas                      | Corretas         | OK         |
| Computed functions                   | Funcionais       | OK         |
| Persistencia local                   | Funcionando      | OK         |
| Sincronizacao Supabase               | **Problematica** | CRITICO    |
| Duplicacao de estado                 | **Presente**     | ALTO       |
| Passagem via route.params            | **Presente**     | ALTO       |
| Sobreposicao de stores               | **Identificada** | MEDIO      |

---

## 2. Diagrama de Fluxo de Dados

```
                    +---------------------------+
                    |     AsyncStorage          |
                    |  (persist middleware)     |
                    +------------+--------------+
                                 |
          +----------------------+----------------------+
          |                      |                      |
          v                      v                      v
+-------------------+  +-------------------+  +-------------------+
| nath-journey-     |  | nathia-onboarding |  | nossa-maternidade |
| onboarding        |  | -profile          |  | -app (AppStore)   |
| (9 telas fluxo)   |  | (AI persona)      |  | (auth + global)   |
+-------------------+  +-------------------+  +-------------------+
          |                      |                      |
          |    PROBLEMA:         |                      |
          |    Dados duplicados  |                      |
          |    via route.params  |                      |
          v                      v                      v
+-------------------+      +---------------------------+
|  Telas Onboarding |      |        RootNavigator      |
|  (route.params)   |----->|     (le isComplete de     |
+-------------------+      |   NathJourneyStore)       |
          |                +---------------------------+
          |
          v
+-------------------+       +---------------------------+
|  OnboardingPaywall|------>|  saveOnboardingData()    |
|  (dados de params)|       |  (Supabase)              |
+-------------------+       +---------------------------+
          |
          v
+-------------------+
|  completeOnboarding()|
|  (apenas marca      |
|   isComplete=true)  |
+-------------------+
```

---

## 3. Analise Detalhada

### 3.1 NathJourneyOnboardingStore - Interface

**Status:** Completa e bem estruturada

```typescript
interface NathJourneyOnboardingState {
  // Dados do onboarding
  data: OnboardingData;

  // Estado do fluxo
  currentScreen: OnboardingScreen;
  isComplete: boolean;

  // Actions - Data updates (10 actions)
  setStage;
  setLastMenstruation;
  setDueDate;
  setBirthDate;
  setConcerns;
  toggleConcern;
  setEmotionalState;
  setDailyCheckIn;
  setCheckInTime;
  setSeasonName;

  // Actions - Flow control (5 actions)
  setCurrentScreen;
  nextScreen;
  prevScreen;
  completeOnboarding;
  resetOnboarding;

  // Computed (3 functions)
  canProceed;
  getProgress;
  needsExtraCare;
}
```

**Pontos positivos:**

- Tipagem correta de todos os campos
- Validacoes inline (concerns max 3, seasonName max 40)
- Computed functions funcionais
- Logica de `needsExtraCare` calculada automaticamente

### 3.2 Persist Middleware

**Status:** Configurado corretamente

```typescript
persist(
  (set, get) => ({
    /* state and actions */
  }),
  {
    name: "nath-journey-onboarding",
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      data: state.data,
      currentScreen: state.currentScreen,
      isComplete: state.isComplete,
    }),
  }
);
```

**Analise:**

- AsyncStorage configurado como storage engine
- `partialize` filtra corretamente apenas dados persistiveis
- Nome unico evita colisao com outras stores

### 3.3 Actions Tipadas

**Status:** Corretas

Todas as actions usam tipagem correta via generics do Zustand:

- `set: (fn: (state) => Partial<State>) => void`
- `get: () => State`

**Exemplo correto:**

```typescript
setConcerns: (concerns: OnboardingConcern[]) => {
  if (concerns.length > 3) {
    logger.warn("...", "OnboardingStore");
    return;
  }
  set((state) => ({
    data: { ...state.data, concerns },
  }));
},
```

### 3.4 Computed Functions

**Status:** Funcionais com ressalva

| Funcao             | Implementacao | Observacao         |
| ------------------ | ------------- | ------------------ |
| `canProceed()`     | Correta       | Valida por tela    |
| `getProgress()`    | Correta       | Calculo percentual |
| `needsExtraCare()` | Correta       | Le do state.data   |

**Ressalva:** Nao sao computed reais (memoizados). Sao funcoes que recalculam a cada chamada. Para performance critica, considerar `zustand/shallow` ou selectors derivados.

---

## 4. Problemas de Sincronizacao

### 4.1 CRITICO: Dados Passados via route.params

**Localizacao:** Todas as telas de OnboardingStage ate OnboardingPaywall

**Problema:**
Os dados sao passados via `route.params` ao inves de lidos diretamente da store:

```typescript
// OnboardingStage.tsx - CORRETO, usa store
const { data, setStage } = useNathJourneyOnboardingStore();

// Mas na navegacao - PROBLEMA!
navigation.navigate("OnboardingDate", { stage: data.stage! });
```

```typescript
// OnboardingDate.tsx - LER do params ao inves da store
const { stage } = route.params; // <-- DUPLICACAO!
```

**Fluxo problematico:**

```
OnboardingStage --> params: { stage }
OnboardingDate  --> params: { stage, date }
OnboardingConcerns --> params: { stage, date, concerns }
...
OnboardingSummary --> params: { stage, date, concerns, emotionalState, dailyCheckIn, checkInTime, seasonName }
OnboardingPaywall --> params: { onboardingData: {...} }
```

**Impacto:**

1. Estado duplicado entre store e params
2. Possivel dessincronizacao se usuario voltar e mudar dados
3. Payload cresce a cada tela (overhead de memoria)

### 4.2 CRITICO: Sincronizacao Tardia com Supabase

**Localizacao:** `OnboardingPaywall.tsx` linha 123

**Problema:**
Os dados so sao salvos no Supabase NO FINAL do fluxo, na tela Paywall:

```typescript
const handleComplete = useCallback(async () => {
  // Salvar onboarding data no Supabase
  await saveOnboardingData(userId, {
    stage: onboardingData.stage,
    date: onboardingData.date,
    concerns: onboardingData.concerns,
    // ... todos os dados de UMA VEZ
  });

  // Marcar onboarding como completo
  completeOnboarding();
}, [...]);
```

**Impacto:**

1. Se app crashar antes do Paywall, todos os dados sao perdidos (mesmo com AsyncStorage)
2. Nao ha sincronizacao intermediaria
3. Se falhar `saveOnboardingData`, o usuario continua (linha 155: "Continuar mesmo se falhar")

### 4.3 Conflito Local vs Remoto

**Localizacao:** `src/api/onboarding-service.ts`

**Problema:**
Nao ha estrategia de merge/conflito:

```typescript
// Upsert simples - nuvem sempre sobrescreve
const { error } = await supabase.from("user_onboarding").upsert(payload, { onConflict: "user_id" });
```

**Cenario de conflito:**

1. Usuario A completa onboarding no dispositivo 1
2. Usuario A completa onboarding no dispositivo 2 (dados diferentes)
3. Ultimo a sincronizar "ganha" (last-write-wins)

---

## 5. Duplicacao de Stores

### 5.1 NathJourneyOnboardingStore vs NathIAOnboardingStore

| Campo        | NathJourney                       | NathIA                             |
| ------------ | --------------------------------- | ---------------------------------- |
| life_stage   | `stage` (TENTANTE, GRAVIDA_T1...) | `life_stage` (trying, pregnant...) |
| interests    | Nao tem                           | `interests: InterestOption[]`      |
| mood         | `emotionalState`                  | `mood_today`                       |
| completed_at | `completedAt`                     | `onboarding_completed_at`          |

**Sobreposicao:**

- Ambos capturam fase de vida (com valores diferentes!)
- Ambos capturam estado emocional
- Ambos tem flag de conclusao

**Uso atual (RootNavigator):**

```typescript
// NathJourneyOnboarding e usado
const isNathJourneyOnboardingComplete = useNathJourneyOnboardingStore(s => s.isComplete);

// NathIA e IGNORADO (sempre true)
isNathIAOnboardingComplete: true, // hardcoded!
```

### 5.2 AppStore.onboardingDraft

**Localizacao:** `src/state/store.ts` linha 46-54

```typescript
onboardingDraft: {
  name: string;
  stage: PregnancyStage | null;
  dueDate: string | null;
  interests: Interest[];
},
```

**Problema:** Este draft NUNCA e usado pelas telas de onboarding! E residuo de versao legada.

### 5.3 AppStore.isOnboardingComplete vs NathJourneyStore.isComplete

**Problema de nomenclatura:**

```typescript
// AppStore
isOnboardingComplete: boolean; // LEGADO, nao usado

// NathJourneyStore
isComplete: boolean; // ESTE e o real

// RootNavigator
isOnboardingComplete: true, // hardcoded para ignorar legado
```

---

## 6. Uso nas Telas

### 6.1 Padrao Correto (OnboardingStage)

```typescript
// Usa store diretamente para LER
const { data, setStage, canProceed, setCurrentScreen } = useNathJourneyOnboardingStore();

// Usa store para ESCREVER
const handleSelectStage = (stage: StageType) => {
  setStage(stage);
};
```

### 6.2 Padrao Problematico (OnboardingSummary)

```typescript
// LE dos params ao inves da store!
const { stage, date, concerns, emotionalState, dailyCheckIn, checkInTime, seasonName } =
  route.params;

// So usa store para computed
const { needsExtraCare, setCurrentScreen } = useNathJourneyOnboardingStore();
```

### 6.3 Tabela de Uso por Tela

| Tela                     | Le de Store | Le de Params             | Escreve em Store         |
| ------------------------ | ----------- | ------------------------ | ------------------------ |
| OnboardingWelcome        | Sim         | N/A                      | Sim                      |
| OnboardingStage          | Sim         | N/A                      | Sim                      |
| OnboardingDate           | Sim         | **Sim (stage)**          | Sim                      |
| OnboardingConcerns       | Parcial     | **Sim (stage, date)**    | Sim                      |
| OnboardingEmotionalState | Parcial     | **Sim (varios)**         | Sim                      |
| OnboardingCheckIn        | Parcial     | **Sim (varios)**         | Sim                      |
| OnboardingSeason         | Parcial     | **Sim (varios)**         | Sim                      |
| OnboardingSummary        | Parcial     | **Sim (TODOS)**          | Nao                      |
| OnboardingPaywall        | Nao         | **Sim (onboardingData)** | Sim (completeOnboarding) |

---

## 7. Recomendacoes de Refactor

### 7.1 PRIORIDADE 1: Eliminar route.params duplicados

**Refactor sugerido:**

```typescript
// ANTES - OnboardingDate.tsx
const { stage } = route.params; // Ler de params
const dateValue = data.dueDate;

// DEPOIS
const { data } = useNathJourneyOnboardingStore();
const stage = data.stage; // Ler SEMPRE da store
```

**Navegacao simplificada:**

```typescript
// ANTES
navigation.navigate("OnboardingConcerns", {
  stage,
  date: dateValue || "",
});

// DEPOIS
navigation.navigate("OnboardingConcerns");
// A proxima tela le da store
```

### 7.2 PRIORIDADE 2: Sincronizacao Incremental

```typescript
// Adicionar ao NathJourneyOnboardingStore
syncToCloud: async () => {
  const { data, isComplete } = get();
  if (!isComplete) return; // So sincroniza quando completo

  const userId = useAppStore.getState().authUserId;
  if (!userId) return;

  await saveOnboardingData(userId, data);
},

// Chamar em completeOnboarding
completeOnboarding: () => {
  set((state) => ({
    isComplete: true,
    data: { ...state.data, completedAt: new Date().toISOString() }
  }));

  // Sincronizar automaticamente
  get().syncToCloud();
},
```

### 7.3 PRIORIDADE 3: Unificar ou Deprecar NathIAOnboardingStore

**Opcao A: Mesclar em NathJourneyOnboardingStore**

```typescript
// Adicionar campos do NathIA ao OnboardingData
interface OnboardingData {
  // Campos existentes...

  // Campos do NathIA
  tonePreference?: TonePreference;
  sensitiveTopics?: SensitiveTopic[];
  notificationsPref?: NotificationPref;
}
```

**Opcao B: Remover NathIAOnboardingStore**

- O RootNavigator ja ignora (`isNathIAOnboardingComplete: true`)
- As telas de NathIA onboarding nao existem no fluxo atual
- Deprecar formalmente

### 7.4 PRIORIDADE 4: Limpar AppStore

```typescript
// REMOVER (codigo morto)
onboardingDraft: { ... },
updateOnboardingDraft: () => {},
clearOnboardingDraft: () => {},

// CONSIDERAR REMOVER
isOnboardingComplete: boolean, // Substituido por NathJourneyStore.isComplete
currentOnboardingStep: OnboardingStep, // Substituido por NathJourneyStore.currentScreen
```

---

## 8. Testes Recomendados

### 8.1 Teste de Persistencia

```typescript
describe("NathJourneyOnboardingStore persistence", () => {
  it("should persist data to AsyncStorage", async () => {
    const { setStage, data } = useNathJourneyOnboardingStore.getState();
    setStage("GRAVIDA_T2");

    // Simular reload
    await useNathJourneyOnboardingStore.persist.rehydrate();

    expect(useNathJourneyOnboardingStore.getState().data.stage).toBe("GRAVIDA_T2");
  });
});
```

### 8.2 Teste de Sincronizacao

```typescript
describe("Onboarding sync", () => {
  it("should sync to Supabase on complete", async () => {
    const saveSpy = jest.spyOn(onboardingService, "saveOnboardingData");

    const { completeOnboarding } = useNathJourneyOnboardingStore.getState();
    await completeOnboarding();

    expect(saveSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ stage: expect.any(String) })
    );
  });
});
```

---

## 9. Conclusao

### Pontos Fortes

- Store bem estruturada com tipagem correta
- Persist middleware funcionando
- Computed functions uteis
- Validacoes inline

### Pontos Criticos

1. **Duplicacao via route.params** - Causa dessincronizacao potencial
2. **Sincronizacao tardia** - Dados podem ser perdidos antes do Paywall
3. **Stores sobrepostas** - NathJourney + NathIA + AppStore.onboardingDraft
4. **Sem estrategia de conflito** - Last-write-wins pode perder dados

### Proximos Passos

1. [ ] Refatorar telas para ler APENAS da store
2. [ ] Implementar sincronizacao incremental
3. [ ] Deprecar NathIAOnboardingStore
4. [ ] Limpar AppStore de codigo morto
5. [ ] Adicionar testes de persistencia

---

_Relatorio gerado automaticamente pelo Subagente E - State Audit_
