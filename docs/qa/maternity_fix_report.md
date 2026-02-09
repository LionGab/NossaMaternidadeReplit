# Relatório QA — Onboarding Maternidade-First (P0)

Data: 2026-01-07

## Objetivo

- Onboarding principal **maternidade-first**: **zero** menções a ciclo/menstruação no fluxo principal (inclusive TENTANTE).
- Branching mínimo:
  - **GRAVIDA\_\*** → Date (DPP) obrigatório
  - **PUERPERIO_0_40D / MAE_RECENTE_ATE_1ANO** → Date (nascimento) opcional
  - **TENTANTE / GENERAL** → pula Date
- SSOT (Zustand): `stage`, `dateKind/dateIso`, `checkInHour`, `seasonKey`, `concerns`, etc.
- Sync local-first + oportunista **somente ao concluir Summary** (antes do paywall), sem bloquear UX.

## Arquivos alterados

- `src/types/nath-journey-onboarding.types.ts`
- `src/state/nath-journey-onboarding-store.ts`
- `src/config/nath-journey-onboarding-data.ts`
- `src/api/onboarding-service.ts`
- `src/screens/onboarding/OnboardingWelcomePremium.tsx`
- `src/screens/onboarding/OnboardingStage.tsx`
- `src/screens/onboarding/OnboardingDate.tsx`
- `src/screens/onboarding/OnboardingConcerns.tsx`
- `src/screens/onboarding/OnboardingEmotionalState.tsx`
- `src/screens/onboarding/OnboardingCheckIn.tsx`
- `src/screens/onboarding/OnboardingSeason.tsx`
- `src/screens/onboarding/OnboardingSummary.tsx`
- `src/screens/onboarding/OnboardingPaywall.tsx`

## Evidências

### 1) Grep gate (termos proibidos no onboarding principal)

Comando:

```bash
rg -n "menstruação|menstruacao|DUM|última menstruação|ultima menstruacao|último ciclo|ultimo ciclo" src/screens/onboarding --type ts --type tsx
```

Resultado esperado: **0 matches** no onboarding principal.

Resultado observado: **0 matches** (sem ocorrências em `src/screens/onboarding`).

### 2) Typecheck

Comando:

```bash
npm run typecheck
```

Status: **PASS**

### 3) Lint

Comando:

```bash
npm run lint
```

Status: **PASS**

### 4) Quality Gate (Windows)

Comando:

```bash
npm run quality-gate:win
```

Resumo do output:

- TypeScript: PASS
- ESLint: PASS
- Build readiness: PASS
- console.log scan: PASS

## Smoke checklist (manual)

- [ ] **TENTANTE** → pula Date → vai para Concerns
- [ ] **GENERAL** → pula Date → vai para Concerns
- [ ] **GRAVIDA\_\*** → Date pergunta DPP (obrigatório) → Concerns
- [ ] **PUERPÉRIO / MÃE RECENTE** → Date pergunta nascimento (opcional) → Concerns
- [ ] Summary → sync oportunista (se logada) → Paywall (não bloqueia)
- [ ] Check-in: UI sempre usa `checkInHour` (default 21h) sem hardcode
- [ ] Season: seleção persiste ao voltar (via `seasonKey`/`seasonCustomName`)
