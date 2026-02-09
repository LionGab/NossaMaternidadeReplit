# Phase 3 - Quality & Infrastructure (4 PRs Focados)

**Data**: 2026-01-29
**Estratégia**: Consolidar código antes de release para App Store
**Timeline**: 3-4 semanas
**Autor**: Claude Code + LionGab

---

## 📊 CONTEXTO

**Objetivo**: Consolidar qualidade de código e infraestrutura antes de produção
**Status atual**:

- ✅ App em TestFlight (Build #31)
- ⚠️ Phase 3 bloqueia release para produção
- 🎯 Economiza horas de refactor pós-launch
- 🔐 Garante robustez técnica e segurança

---

## 🎯 DIVISÃO EM 4 PRs

### ✅ PR-3A: TypeScript Strict Mode 100%

**Status**: Concluído e no GitHub ([#88](https://github.com/LionGab/NossaMaternidade/pull/88))
**Mudanças**: 4 arquivos modificados

- `NathIAStackNavigator.tsx` - Removido `as any`, adicionado `CompositeNavigationProp`
- `AnimatedSplashScreen.tsx` - `style?: object` → `style?: ViewStyle | TextStyle`
- `AnimatedSplashScreenNathia.tsx` - `style?: object` → `style?: ViewStyle | TextStyle`
- `VideoPlayer.tsx` - `style?: object` → `style?: ViewStyle`

**Resultado**: Zero `any` types, tipos estritos 100%

---

### ✅ PR-3B: CORS Centralizado

**Status**: Já implementado (nada a fazer)
**Implementação existente**: `supabase/functions/_shared/cors.ts`

- Todas as 10 edge functions usam `buildCorsHeaders()` e `handlePreflight()`
- Whitelist configurada via `ALLOWED_ORIGINS` env var
- Padrão consistente em todas as funções

---

### 🔄 PR-3C: Edge Functions Tests (PRÓXIMO)

**Status**: Planejado (este documento)
**Escopo**: Testes unitários para Edge Functions críticas
**Funções prioritárias**:

1. `ai/` - Core NathIA (1869 linhas, provedor de IA)
2. `moderate-content/` - Moderação OpenAI (443 linhas, segurança LGPD)
3. `webhook/` - RevenueCat webhooks (712 linhas, pagamentos)

**Tempo estimado**: 8-10 horas (Semana 2)

**Arquivos a criar**:

```
supabase/functions/__tests__/
├── setup.ts                    # Setup global (mocks, env)
├── ai.test.ts                  # Testes ai/
├── moderate-content.test.ts    # Testes moderate-content/
└── webhook.test.ts             # Testes webhook/
jest.config.edge.js             # Config Jest para Deno
```

**Checklist**:

- [ ] Setup Jest para Deno edge runtime
- [ ] Mock environment variables
- [ ] Mock Supabase client
- [ ] Mock external APIs (OpenAI, Anthropic, Gemini, RevenueCat)
- [ ] Testes para 3 funções prioritárias
- [ ] Coverage mínimo: 70% por função
- [ ] `npm run test:edge-functions` ✅

**Critérios de aceite**:

- Jest roda sem erros em Deno runtime
- Cada função tem >= 70% coverage
- Mocks estão isolados (sem chamadas reais)
- CI passa com testes green

---

### 📋 PR-3D: Test Coverage 80%

**Status**: Pendente
**Escopo**: Aumentar coverage de ~15% para 80%

**Arquivos críticos** (~20 arquivos de teste):

- `src/api/__tests__/database.test.ts` - Expandir
- `src/api/__tests__/ai-service.test.ts` - Expandir
- `src/api/__tests__/community.test.ts` - **CRIAR**
- `src/services/__tests__/mundoNathAdmin.test.ts` - **CRIAR**

**Tempo estimado**: 12-15 horas (Semana 2-3)

**Checklist**:

- [ ] Baseline: `npm run test:coverage` (esperado ~15-20%)
- [ ] Focar em arquivos críticos (database, ai-service, community)
- [ ] Testes integração mockando APIs reais
- [ ] Coverage 80% geral (mínimo 70% em críticas)
- [ ] Relatório: `coverage/lcov-report/index.html`

---

## 📅 TIMELINE

| Semana       | PRs                  | Tempo Total               |
| ------------ | -------------------- | ------------------------- |
| **Semana 1** | PR-3A ✅ + PR-3B ✅  | Concluído                 |
| **Semana 2** | PR-3C (Edge Tests)   | 8-10h                     |
| **Semana 3** | PR-3D (Coverage 80%) | 12-15h                    |
| **TOTAL**    | 4 PRs                | **20-25 horas restantes** |

**Merge progressivo**: Cada PR merge independente assim que passa quality gate

---

## 🚀 COMANDOS PRÁTICOS

### PR-3C: Edge Functions Tests

```bash
# 1. Criar branch
git checkout main && git pull
git checkout -b feat/phase3c-edge-function-tests

# 2. Criar estrutura de testes
mkdir -p supabase/functions/__tests__
# ... criar setup.ts, ai.test.ts, moderate-content.test.ts, webhook.test.ts ...
# ... criar jest.config.edge.js ...

# 3. Rodar testes
npm run test:edge-functions

# 4. Commit e push
git add supabase/functions/__tests__/ jest.config.edge.js
git commit -m "feat: Phase 3c - Add unit tests for Edge Functions (70% coverage)"
git push origin feat/phase3c-edge-function-tests

# 5. Criar PR no GitHub
gh pr create --title "feat: Phase 3c - Edge Functions Tests" --body "..."
```

### PR-3D: Test Coverage 80%

```bash
# 1. Criar branch
git checkout main && git pull
git checkout -b feat/phase3d-test-coverage-80

# 2. Adicionar testes faltantes
npm run test:coverage -- --watch
# ... criar/expandir testes em src/api/__tests__/ ...

# 3. Commit e push
git add src/api/__tests__/
git commit -m "feat: Phase 3d - Achieve 80% test coverage (from ~15%)"
git push origin feat/phase3d-test-coverage-80

# 4. Verificar
npm run test:coverage
# Deve mostrar: "All files | 80.x% | ..."
```

---

## ✅ VERIFICAÇÃO E TESTES

### Após cada PR:

```bash
# Quality gate obrigatório
npm run quality-gate           # MUST PASS ✅

# Testes específicos
npm run typecheck              # PR-3A ✅
npm run test:edge-functions    # PR-3C
npm run test:coverage          # PR-3D

# Build de produção
npm run build:prod:ios         # Garantir que não quebrou nada
```

### Antes de merge:

- [ ] ✅ Quality gate: PASS
- [ ] ✅ TypeScript: Zero erros
- [ ] ✅ ESLint: Zero warnings
- [ ] ✅ Testes: 100% passing
- [ ] ✅ Coverage: >= meta definida
- [ ] ✅ Build iOS: Sucesso
- [ ] ✅ Build Android: Sucesso

---

## 📚 DOCUMENTAÇÃO DE REFERÊNCIA

**Regras do projeto**:

- Zero `any` types (usar `unknown` + type guards)
- Zero `console.log` (usar `logger.*`)
- Zero hardcoded colors (usar `Tokens.*` ou `useThemeColors()`)
- Zustand: seletores individuais (não destructuring)
- FlashList/FlatList para listas (não ScrollView + map)

**Quality gates**:

```bash
npm run quality-gate           # TypeScript + ESLint + build check
npm run typecheck              # TS only
npm run lint:fix               # Auto-fix ESLint
npm run test                   # Jest tests
npm run test:coverage          # Coverage report
```

---

## 🎬 STATUS ATUAL

| PR    | Status             | Progresso                                                         |
| ----- | ------------------ | ----------------------------------------------------------------- |
| PR-3A | ✅ Concluído       | GitHub [#88](https://github.com/LionGab/NossaMaternidade/pull/88) |
| PR-3B | ✅ Já implementado | Nada a fazer                                                      |
| PR-3C | 📋 Planejado       | Próximo passo                                                     |
| PR-3D | ⏳ Pendente        | Após PR-3C                                                        |

**Próxima ação**: Aguardar review/merge do PR-3A, depois executar PR-3C

---

_Phase 3 - Quality: Consolidação técnica antes de produção_
_Última atualização: 2026-01-29_
