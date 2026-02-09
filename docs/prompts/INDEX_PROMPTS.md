# 📋 ÍNDICE DE PROMPTS OTIMIZADOS - NOSSA MATERNIDADE

**Data**: 25 de dezembro de 2025  
**Versão**: Prompt Architect 2.0  
**Destinação**: Claude Code (/ide, terminal, desktop)

---

## 🎯 QUICK START

1. **Escolha uma tarefa** da lista abaixo
2. **Copie o prompt** correspondente
3. **Abra Claude Code**: `claude` ou `claude --dangerously-skip-permissions`
4. **Cole o prompt** inteiro (começando em `⚙️ TASK`)
5. **Siga o workflow** (Plan Mode → STEP 1 → Gates → etc)
6. **Execute**: `/clear` quando terminar

---

## 📊 STATUS E PRIORIDADES

| Fase    | Tarefa                 | Tempo  | Prioridade | Status          |
| ------- | ---------------------- | ------ | ---------- | --------------- |
| **1.1** | Design System Cleanup  | 10 min | 🔴 HIGH    | ⏳ EM PROGRESSO |
| **1.2** | Console.log → Logger   | 20 min | 🔴 HIGH    | ❌ PENDENTE     |
| **1.3** | FlatList Performance   | 45 min | 🟡 MEDIUM  | ❌ PENDENTE     |
| **1.4** | Unit Testing (5 tests) | 2h     | 🟡 MEDIUM  | ❌ PENDENTE     |
| **2.0** | Full Testing Suite     | 40h    | 🟢 LOW     | ❌ BACKLOG      |

---

## 🚀 PROMPTS DISPONÍVEIS

### PROMPT 1: Design System Cleanup ⏳

**Arquivo**: `PROMPT_1_DESIGN_SYSTEM.md`  
**Tipo**: Refactor  
**Tempo**: 10 minutos  
**Objetivo**: Migrar 4 screens de colors.ts → design-system.ts tokens  
**Por que**: 290 cores hardcoded bloqueiam quality-gate, cada tela será mais limpa  
**Resultado**: 4 telas usando Tokens.\* corretamente, 0 erros visuais

**Telas**:

1. PremiumGate.tsx (3 cores, simples)
2. VoiceMessagePlayer.tsx (4 cores)
3. AssistantScreen.tsx (6 cores)
4. PaywallScreen.tsx (9 cores)

**Como usar**:

```bash
git checkout -b feature/design-system-cleanup
# Copie PROMPT_1_DESIGN_SYSTEM.md inteiro
# Cole no Claude Code
# Siga Plan Mode + 4 iterações (uma por screen)
```

---

### PROMPT 2: Console.log → Logger ❌

**Arquivo**: `PROMPT_2_LOGGER.md`  
**Tipo**: Bugfix (production quality)  
**Tempo**: 20 minutos  
**Objetivo**: Substituir console._ por logger em 3 arquivos  
**Por que**: ESLint bloqueia console.log em produção  
**Resultado**: quality-gate passa, 0 console._ no código

**Arquivos**:

1. src/screens/HomeScreen.tsx (1 ocorrência)
2. src/utils/reset-onboarding.ts (2 ocorrências)
3. src/services/purchases.ts (13 ocorrências)

**Como usar**:

```bash
git checkout -b feature/logger-migration
# Copie PROMPT_2_LOGGER.md inteiro
# Cole no Claude Code
# Siga: 1 arquivo por vez, 1 commit por arquivo
```

---

### PROMPT 3: FlatList Performance 🎯

**Arquivo**: `PROMPT_3_FLATLIST.md`  
**Tipo**: Performance optimization  
**Tempo**: 45 minutos  
**Objetivo**: Converter CommunityScreen ScrollView → FlatList virtualization  
**Por que**: 20+ posts causam lag, FlatList renderiza só visible items  
**Resultado**: +80% FPS improvement, -50% memory consumption

**Como usar**:

```bash
git checkout -b feature/flatlist-optimization
# Copie PROMPT_3_FLATLIST.md inteiro
# Cole no Claude Code
# Siga: Baseline → Plan Mode → Implementation → Measure
# Use React DevTools Profiler antes/depois
```

---

### PROMPT 4: Unit Testing Foundation 🧪

**Arquivo**: `PROMPT_4_TESTING.md`  
**Tipo**: Feature (quality improvement)  
**Tempo**: 2 horas  
**Objetivo**: Implementar 5 unit tests (TDD) em Jest  
**Por que**: Cobertura 3/10, sem testes automatizados  
**Resultado**: 5 tests passando, >50% coverage em 3 files

**Tests**:

1. useTheme hook returns Calm FemTech tokens
2. useTheme toggles theme light/dark
3. AppError preserves stack trace
4. AppError serializes to JSON
5. premium-store checkPremiumStatus returns boolean

**Como usar**:

```bash
git checkout -b feature/unit-tests
# Copie PROMPT_4_TESTING.md inteiro
# Cole no Claude Code
# Siga: TDD (test fails → implement → pass)
# 3 test files criados: __tests__/unit/[hook].test.ts
```

---

## 🔄 WORKFLOW RECOMENDADO

### Dia 1 (1.5h total)

1. **Prompt 1**: Design System (10 min)
2. **Prompt 2**: Logger (20 min)
3. **Break**: Commit + push
4. **Prompt 3**: FlatList (45 min)

### Dia 2 (2h total)

1. **Prompt 4**: Testing (2h)

### Resultado

- Design score: 10/10 (colors 100% clean)
- Code quality: 9/10 (logger 100%, design clean)
- Performance: 8/10 (FlatList optimized)
- Testing: 4/10 (5 tests, foundation set)
- **OVERALL**: 8.0/10 (up from 7.7/10)

---

## 📋 CHECKLIST PRÉ-USO

Antes de usar QUALQUER prompt:

```bash
# 1. Verificar branch limpo
git status
# Esperado: "On branch main" e "nothing to commit"

# 2. Criar branch novo
git checkout -b feature/[tarefa]

# 3. Verificar qualidade baseline
npm run quality-gate
# Anote os erros atuais (para comparação)

# 4. Verificar dependências
npm run check-env
```

---

## 📲 COMO COLAR NO CLAUDE CODE

### Opção A: Terminal direto

```bash
# 1. Abra o repositório no Claude Code
cd /path/to/NossaMaternidade
claude

# 2. No Claude Code, copie todo o prompt (começando em ⚙️ TASK)
# 3. Cole na conversa do Claude Code
# 4. Siga o workflow (Plan Mode → Steps → Gates)
```

### Opção B: Copiar arquivo inteiro

```bash
# 1. Navegue até /home/claude/PROMPT_[N]_[NOME].md
# 2. Abra arquivo
# 3. Selecione tudo (Cmd+A / Ctrl+A)
# 4. Copie (Cmd+C / Ctrl+C)
# 5. Cole no Claude Code
```

---

## 🛠️ COMANDOS ESSENCIAIS

**Durante os prompts:**

```bash
# Type check
npm run typecheck

# Lint
npm run lint
npm run lint:fix

# Quality gate
npm run quality-gate

# Tests
npm test
npm test --watch
npm test --coverage

# Dev
npm start
npm start:clear

# Build
npm run build:dev:ios
npm run build:dev:android
```

---

## 🎯 METAS

### Após Prompt 1+2+3 (1.5h)

- ✅ Design system 100% clean (0 hardcoded colors)
- ✅ Logger 100% (no console.log)
- ✅ FlatList optimized (80% FPS better)
- ✅ Quality gate: PASS

### Após Prompt 4 (2h)

- ✅ 5 tests passing
- ✅ >50% coverage em 3 files
- ✅ Foundation para testing

### Resultado Final

- **Code Score**: 8.0/10 (up from 7.7/10)
- **Time Invested**: 3.5h
- **Future Savings**: 40h (testing infrastructure built)

---

## 🚨 SE ALGO DER ERRADO

### Erro: "Command not found: claude"

```bash
# Solução
npx -y @anthropic-ai/claude-code [comando]
# OU instale globalmente
bun install -g @anthropic-ai/claude-code
```

### Erro: "ESLint failed"

```bash
# Veja erros específicos
npm run lint
# Fix automaticamente
npm run lint:fix
```

### Erro: "TypeScript error"

```bash
npm run typecheck
# Veja linha exata do erro
```

### Erro: "Test failed"

```bash
npm test --watch
# Debug individual test
npm test -- --testNamePattern="should return tokens"
```

---

## 📞 SUPORTE

**Dúvidas sobre prompts?**

- Leia CLAUDE.md (arquitetura)
- Leia .cursorrules (padrões)
- Leia docs/ (guias detalhados)

**Leia primeiro:**

1. CLAUDE.md - Source of truth
2. Resposta prompt anterior (Plan Mode explica tudo)
3. ESLint/TypeScript output (bem específico)

---

## 📊 SUMMARY TABLE

| Prompt      | Tipo     | Tempo | Dificuldade | Impact    | Status |
| ----------- | -------- | ----- | ----------- | --------- | ------ |
| 1. Design   | Refactor | 10m   | ⭐ Easy     | 🟡 Medium | ⏳     |
| 2. Logger   | Bugfix   | 20m   | ⭐ Easy     | 🔴 High   | ❌     |
| 3. FlatList | Perf     | 45m   | ⭐⭐        | 🟡 Medium | ❌     |
| 4. Testing  | Feature  | 2h    | ⭐⭐⭐      | 🟡 Medium | ❌     |

---

**Pronto! 🚀 Escolha seu primeiro prompt acima e comece.**

---

**Última atualização**: 25 de dezembro de 2025  
**Autor**: Prompt Architect 2.0  
**Versão Projeto**: 1.0.0 Beta
