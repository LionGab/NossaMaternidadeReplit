# Memory Management Guide - Nossa Maternidade

> Como gerenciar a memória do Claude Code para máxima eficiência

---

## 📋 Hierarquia de Memória

Claude Code carrega arquivos em uma hierarquia específica. Arquivos mais específicos têm prioridade sobre genéricos:

```
┌─────────────────────────────────────────────────────────┐
│ 1. MANAGED POLICY (Organização)                        │
│    Windows: C:\Program Files\ClaudeCode\CLAUDE.md      │
│    Prioridade: MÁXIMA                                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. PROJECT MEMORY (Projeto)                            │
│    ./CLAUDE.md                                          │
│    Prioridade: ALTA                                     │
│    Compartilhado: Via Git com equipe                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. PROJECT RULES (Regras Modulares)                    │
│    ./.claude/rules/*.md                                 │
│    Prioridade: ALTA                                     │
│    Carregamento: Automático por path                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. USER MEMORY (Preferências Pessoais)                 │
│    ~/.claude/CLAUDE.md                                  │
│    Prioridade: MÉDIA                                    │
│    Escopo: Todos os seus projetos                       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. PROJECT LOCAL (Sandbox Pessoal)                     │
│    ./CLAUDE.local.md (gitignored)                       │
│    Prioridade: BAIXA                                    │
│    Escopo: Apenas você, apenas este projeto             │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Estrutura Nossa Maternidade

### Organização Atual

```
NossaMaternidade/
├── CLAUDE.md                  # Referência rápida (200 linhas)
├── CLAUDE.local.md            # Suas preferências locais (gitignored)
│
├── .claude/
│   ├── settings.json          # Configuração principal
│   ├── agents/                # 16 subagents especializados
│   │   ├── mobile-deployer.md
│   │   ├── mobile-debugger.md
│   │   ├── type-checker.md
│   │   ├── nathia-expert.md
│   │   └── ...
│   │
│   └── rules/                 # Regras modulares por contexto
│       ├── always/            # Sempre ativas (8 regras)
│       │   ├── 00-nonnegotiables.mdc
│       │   ├── logging.mdc
│       │   └── typescript-strict.mdc
│       │
│       ├── frontend/          # Ativas em src/** (6 regras)
│       │   ├── components.mdc
│       │   ├── react-native.mdc
│       │   ├── screens.mdc
│       │   ├── zustand.mdc        # NOVO
│       │   ├── navigation.mdc     # NOVO
│       │   └── hooks.mdc          # NOVO
│       │
│       ├── backend/           # Ativas em supabase/** (3 regras)
│       │   ├── supabase.mdc
│       │   ├── migrations.mdc
│       │   └── edge-functions.mdc # NOVO
│       │
│       ├── domain/            # Domínio de negócio (3 regras)
│       │   ├── nathia.mdc         # NOVO
│       │   └── premium-iap.mdc    # NOVO
│       │
│       ├── testing/           # Ativas em **/*.test.ts (1 regra)
│       │   └── jest.mdc           # NOVO
│       │
│       └── workflows/         # Fluxos específicos (2 regras)
│           ├── bug-fixing.mdc     # NOVO
│           └── new-feature.mdc    # NOVO
│
└── docs/claude/               # Documentação detalhada (on-demand)
    ├── workflows.md
    ├── architecture.md
    ├── backend.md
    ├── code-patterns.md
    ├── design-system.md
    └── configuration.md
```

---

## 🔄 Path-Triggered Rules

Regras são carregadas automaticamente quando você trabalha em arquivos específicos:

### Frontend Paths

| Path Pattern                | Regras Carregadas                                    |
| --------------------------- | ---------------------------------------------------- |
| `src/components/ui/**`      | `frontend/components.mdc`                            |
| `src/components/chat/**`    | `frontend/components.mdc` + `domain/nathia.mdc`      |
| `src/components/premium/**` | `frontend/components.mdc` + `domain/premium-iap.mdc` |
| `src/screens/**`            | `frontend/screens.mdc` + `frontend/react-native.mdc` |
| `src/state/**`              | `frontend/zustand.mdc`                               |
| `src/navigation/**`         | `frontend/navigation.mdc`                            |
| `src/hooks/**`              | `frontend/hooks.mdc`                                 |
| `src/ai/**`                 | `domain/nathia.mdc`                                  |

### Backend Paths

| Path Pattern               | Regras Carregadas                                  |
| -------------------------- | -------------------------------------------------- |
| `supabase/migrations/**`   | `backend/migrations.mdc`                           |
| `supabase/functions/**`    | `backend/edge-functions.mdc`                       |
| `supabase/functions/ai/**` | `backend/edge-functions.mdc` + `domain/nathia.mdc` |
| `src/api/**`               | `backend/supabase.mdc`                             |

### Testing Paths

| Path Pattern                   | Regras Carregadas  |
| ------------------------------ | ------------------ |
| `**/__tests__/**/*.test.ts(x)` | `testing/jest.mdc` |
| `**/*.test.ts(x)`              | `testing/jest.mdc` |

---

## 📝 Exemplo de Regra Path-Specific

````markdown
# .claude/rules/frontend/zustand.mdc

---

paths:

- "src/state/\*_/_.ts"
  priority: critical

---

# Zustand - State Management

## CRITICAL: Selector Pattern

**NUNCA use object destructuring:**

```typescript
// ❌ ERRADO - Cria nova ref a cada render → loops infinitos
const { user, setUser } = useAppStore((s) => ({
  user: s.user,
  setUser: s.setUser,
}));

// ✅ CORRETO - Seletores individuais
const user = useAppStore((s) => s.user);
const setUser = useAppStore((s) => s.setUser);
```
````

````

**Quando você edita um arquivo em `src/state/`, esta regra é carregada automaticamente.**

---

## 🏠 User-Level vs Project-Level

### User-Level (`~/.claude/CLAUDE.md`)

**Use para**: Preferências pessoais que seguem você em todos projetos

```markdown
# ~/.claude/CLAUDE.md

# Minhas Preferências de Código

## React Native
- Sempre usar componentes funcionais (nunca class)
- Preferir Pressable sobre TouchableOpacity
- Usar FlashList para listas

## TypeScript
- Preferir named exports sobre default exports
- Sempre usar strict mode
- Adicionar JSDoc para funções públicas

## Commits
- Usar Conventional Commits (feat:, fix:, etc.)
- Mensagens em português
- Referência a issues quando aplicável
````

### Project-Level (`./CLAUDE.md`)

**Use para**: Regras específicas do Nossa Maternidade

```markdown
# CLAUDE.md

## 🚫 NON-NEGOTIABLES

- TypeScript: Zero `any` types
- Logging: NUNCA `console.log` → usar `logger.*`
- Colors: NUNCA hardcode → usar `Tokens.*`
- Lists: NUNCA `ScrollView + map()` → usar `FlashList`

## 📱 PROJECT SPECIFIC

- Bundle ID: `br.com.nossamaternidade.app` (IMUTÁVEL)
- NathIA: Sempre empática, português informal, nunca diagnóstico médico
- Premium: RevenueCat com entitlement "premium"
```

---

## 🚀 CLAUDE.md Otimizado

### Antes (480 linhas)

```markdown
# CLAUDE.md

## QUICK REFERENCE

[15 linhas de comandos]

## NON-NEGOTIABLES

[60 linhas de regras detalhadas]

## PROJECT OVERVIEW

[80 linhas de arquitetura]

## ARCHITECTURE OVERVIEW

[120 linhas de estrutura]
...
[+200 linhas de detalhes]
```

### Depois (200 linhas)

```markdown
# CLAUDE.md

## 🚀 QUICK START

- 5 comandos essenciais
- Path alias: @/_ → src/_

## 🚫 NON-NEGOTIABLES (Summary)

- TS: Zero any
- Log: logger.\*
- Colors: Tokens.\*

## 🎯 WORKFLOW

- Explore → Plan → Implement → Verify
- Use subagents para investigação
- /clear entre tarefas

## 📚 DETAILED DOCS

- Architecture: docs/claude/architecture.md
- Workflows: docs/claude/workflows.md
- Patterns: docs/claude/code-patterns.md
```

**Detalhes movidos para `docs/claude/`** (carregados on-demand)

---

## 💡 Best Practices

### 1. Mantenha CLAUDE.md Conciso

✅ **Incluir:**

- Comandos que você não consegue adivinhar
- Non-negotiables que causam erros se violados
- Constantes imutáveis (Bundle ID, etc.)
- Workflows de alto nível

❌ **Não incluir:**

- Detalhes que Claude pode ler no código
- Convenções padrão da linguagem
- Documentação completa de APIs
- Informações que mudam frequentemente

### 2. Use Rules para Organização Modular

✅ **Criar regra quando:**

- Padrão se aplica a path específico
- Regra tem escopo claro (state, navigation, etc.)
- Múltiplos arquivos seguem mesma convenção

❌ **Não criar regra quando:**

- Aplica-se a apenas 1 arquivo
- É óbvio pelo código existente
- Muda frequentemente

### 3. Imports no CLAUDE.md

Você pode importar arquivos adicionais:

```markdown
# CLAUDE.md

Ver @README.md para overview do projeto.
Ver @package.json para comandos npm disponíveis.

# Instruções Adicionais

- Workflow Git: @docs/git-workflow.md
- Preferências pessoais: @~/.claude/nossa-maternidade-prefs.md
```

### 4. Verificar Memória Carregada

Use o comando `/memory` para ver quais arquivos estão carregados:

```bash
> /memory
```

Retorna:

```
Memory files loaded:
- ./CLAUDE.md (200 lines)
- ./.claude/rules/always/*.mdc (8 files)
- ./.claude/rules/frontend/components.mdc (path match)
- ~/.claude/CLAUDE.md (user preferences)
```

---

## 🎯 Estratégias de Caching

### Cache Agressivo (raramente muda)

- `src/theme/tokens.ts` - Tokens do design system
- `src/types/database.types.ts` - Types gerados do Supabase
- `src/types/navigation.ts` - Types de navegação
- `src/ai/nathiaPrompt.ts` - Prompt da NathIA (já tem cache 1hr)

### Re-read Frequente (muda durante dev)

- `src/state/*.ts` - Stores Zustand (estado atual)
- `src/screens/**/*.tsx` - Screens em desenvolvimento
- `**/__tests__/**` - Tests atualizados com implementação

### Compact vs Clear

```bash
# Após implementar feature:
> /compact
# Mantém decisões, comprime arquivos explorados

# Entre tarefas não relacionadas:
> /clear
# Reset completo

# Após 2+ correções no mesmo problema:
> /clear + prompt melhor
```

### Uso com autoCompact (recomendações)

- **Deixe autoCompact ligado** em `triggerTokens: 80000` (faixa 70k–90k no projeto).
- **`/clear`** entre tarefas; **`/compact`** quando a thread está longa mas ainda relevante.
- Prefira **`@arquivo`** a colar blocos grandes; use **skills** (`/verify`, `/nathia`) para contexto focado.

---

## 🔧 Gerenciamento de Sessões

### Nomear Sessões

```bash
# Durante sessão:
> /rename auth-refactor

# Depois retomar:
> claude --resume auth-refactor
```

### Tipos de Sessão

| Tipo          | Context Needed   | Workflow                                |
| ------------- | ---------------- | --------------------------------------- |
| **Quick Fix** | Mínimo           | `/clear` → Fix → `/verify` → Commit     |
| **Feature**   | Moderado         | Plan → Implement → `/verify` → `/gates` |
| **Debug**     | Alto (subagents) | Investigate → Reproduce → Fix → Test    |
| **Release**   | Completo         | `/gates` → Fix → Build → Submit         |

---

## 📊 Métricas de Sucesso

### Antes da Otimização

- CLAUDE.md: 480 linhas (auto-carregado)
- Regras: 15 arquivos (gaps de cobertura)
- Contexto: Poluído após 30min
- Resets: Frequentes

### Após Otimização (Alvos)

- CLAUDE.md: ≤200 linhas
- Regras: ~25 arquivos (cobertura completa)
- Contexto: Limpo por 60-90min
- Resets: Raros (apenas entre tarefas não relacionadas)

---

_Última atualização: 2026-01-24_
