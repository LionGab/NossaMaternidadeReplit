# CLAUDE.md

> Nossa Maternidade — Guia para Claude Code
> Versão: 5.0 | 2026-01-25 | Best Practices 2026

---

## QUICK START

```bash
npm run quality-gate          # OBRIGATÓRIO antes de PR/build
npm start                     # Expo dev server
npm test -- --watch           # Testes em watch mode
```

```typescript
import { Tokens } from "@/theme/tokens";
import { useThemeColors } from "@/hooks/useTheme";
import { logger } from "@/utils/logger";
import { useAppStore } from "@/state";
```

**Path alias:** `@/*` → `src/*`

---

## SKILLS (2026)

Skills são a forma preferida de estender Claude Code. Carregam sob demanda com progressive disclosure.

| Skill                | Propósito                                                     |
| -------------------- | ------------------------------------------------------------- |
| `/deploy-testflight` | Deploy iOS para TestFlight                                    |
| `/deploy-android`    | Deploy Android para Play                                      |
| `/pre-commit`        | Quality gate rápido                                           |
| `/fix-types`         | Resolver erros TypeScript                                     |
| `/verify`            | Quality gate completo                                         |
| `/review`            | Code review completo                                          |
| `/nathia`            | Especialista NathIA                                           |
| `/gates`             | Release gates (G1-G7)                                         |
| `/commit-commands`   | Workflow commit/push/PR (quality gate + atômico)              |
| `/commit`            | Verify + guia commit atômico (uso com plugin Commit commands) |
| `/superdesign`       | UI/UX design agent (drafts, iterações, flows)                 |
| `/ui-ux-pro-max`     | Design intelligence (67 estilos, 96 paletas, 57 font pairs)   |

**Hot-reload**: Skills em `.claude/skills/` recarregam automaticamente.

---

## WORKFLOW AGENTIC

```
Explore → Plan → Implement → Verify
```

1. **Explore**: Leia arquivos antes de agir
2. **Plan**: Tarefas complexas → plano primeiro
3. **Implement**: Verificação incremental
4. **Verify**: `npm run quality-gate`

**Contexto**: `/clear` entre tarefas · `/compact` quando grande · autoCompact em 80k (ver `docs/setup/CLAUDE_CODE_GUIDE_2026.md`)

---

## NON-NEGOTIABLES

| Regra      | Correto                        | Errado                   |
| ---------- | ------------------------------ | ------------------------ |
| TypeScript | `unknown` + guards             | `any`, `@ts-ignore`      |
| Logging    | `logger.*`                     | `console.log`            |
| Colors     | `Tokens.*`, `useThemeColors()` | `#xxx`, `'white'`        |
| Lists      | `FlashList`, `FlatList`        | `ScrollView + map()`     |
| Touch      | `Pressable`                    | `TouchableOpacity`       |
| Zustand    | `useStore(s => s.value)`       | `useStore(s => ({...}))` |

**Zustand CRÍTICO** (previne loops infinitos):

```typescript
// CORRETO
const user = useAppStore((s) => s.user);

// ERRADO - cria nova ref todo render
const { user } = useAppStore((s) => ({ user: s.user }));
```

---

## IMMUTABLE CONSTANTS

| Constante          | Valor                          |
| ------------------ | ------------------------------ |
| Bundle ID iOS      | `br.com.nossamaternidade.app`  |
| Bundle ID Android  | `com.liongab.nossamaternidade` |
| Apple Team ID      | `KZPW4S77UH`                   |
| RevenueCat Product | `premium`                      |
| Supabase Project   | `lqahkqfpynypbmhtffyi`         |

---

## PROJECT STRUCTURE

```
src/
├── api/          # Supabase, chat, transcribe
├── ai/           # nathiaPrompt.ts
├── components/   # UI components (ui/ = atoms)
├── hooks/        # Custom hooks
├── navigation/   # React Navigation
├── screens/      # Screen components
├── state/        # Zustand stores
├── theme/        # Design tokens
└── utils/        # Utilities (logger, cn)

.claude/
├── skills/       # Skills 2026 (prefer these!)
│   ├── release/  # deploy-testflight, deploy-android
│   ├── quality/  # pre-commit, fix-types, verify, review
│   ├── domain/   # nathia
│   └── workflow/ # gates
├── agents/       # Agents especializados (legacy)
├── commands/     # Slash commands
├── hooks/        # Event hooks
└── rules/        # Path-triggered rules
```

---

## RELEASE GATES

```
G1 (Quality) → G2 (Auth) → G3 (RLS) → G4 (RevenueCat) → G5 (NathIA) → G6 (Build) → G7 (Submit)
```

| Gate | Comando                   |
| ---- | ------------------------- |
| G1   | `npm run quality-gate`    |
| G2   | `npm run test:oauth`      |
| G5   | `npm run test:gemini`     |
| G6   | `npm run build:prod:ios`  |
| G7   | `npm run submit:prod:ios` |

Use `/gates` para scoreboard completo.

---

## PREMIUM/IAP

- **Products**: `nossa_maternidade_monthly`, `nossa_maternidade_yearly`
- **Entitlement**: `premium`
- **Free tier**: 6 AI messages/day (reset meia-noite UTC-3)

```typescript
const isPremium = useIsPremium();
<PremiumGate>{/* premium content */}</PremiumGate>
```

---

## AI/NathIA

- **Model**: `gemini-2.0-flash-exp`
- **System prompt**: `src/ai/nathiaPrompt.ts`
- **Test**: `npm run test:gemini`
- **Skill**: `/nathia` para personalidade

---

## COMMANDS

| Comando                  | Propósito                                                 |
| ------------------------ | --------------------------------------------------------- |
| `npm run quality-gate`   | TypeCheck + Lint + Build (obrigatório antes de commit/PR) |
| `/commit`                | Verify + guia commit atômico (mensagem convencional)      |
| `npm start`              | Expo dev server                                           |
| `npm test -- --watch`    | Jest watch mode                                           |
| `npm run generate-types` | Regenerar tipos Supabase                                  |
| `npm run build:prod:ios` | Build produção iOS                                        |

---

## BUILDS

- Builds locais requerem macOS/Linux. Em Windows, use EAS cloud:
  `eas build --platform all --profile production`
- Sempre valide build cloud antes de release.

---

## TROUBLESHOOTING

```bash
npm run clean && npm install   # Build failures
npm run typecheck              # TS errors
npm start:clear                # Metro issues
npm run generate-types         # Schema changed
```

---

## DOCUMENTATION

### Contexto para IAs

| Docs                                     | Conteúdo                                                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) | Raio-X completo do projeto (stack, estrutura, padrões, constantes) — cole em prompts para planejar features |

### Setup e Arquitetura

| Docs                                                              | Conteúdo                                         |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| [CLAUDE_CODE_GUIDE_2026.md](docs/setup/CLAUDE_CODE_GUIDE_2026.md) | Best practices 2026                              |
| [memory-guide.md](docs/claude/memory-guide.md)                    | Gerenciamento de memória                         |
| [architecture.md](docs/claude/architecture.md)                    | Navigation, stores                               |
| [design-system.md](docs/claude/design-system.md)                  | Tokens, cores                                    |
| [COMMIT_COMMANDS_SETUP.md](docs/setup/COMMIT_COMMANDS_SETUP.md)   | Workflow commit/push/PR (plugin Commit commands) |

### Produto (`docs/product/`)

| Docs                                                | Conteudo               |
| --------------------------------------------------- | ---------------------- |
| [NATALIA_BRAND.md](docs/product/NATALIA_BRAND.md)   | Quem e Natalia Valente |
| [PRODUCT_VISION.md](docs/product/PRODUCT_VISION.md) | Visao do produto       |
| [BUSINESS_MODEL.md](docs/product/BUSINESS_MODEL.md) | Modelo de negocio      |

> **Nota**: Docs de produto sao visao estrategica, NAO spec tecnica. A arquitetura real esta aqui e em `src/CLAUDE.md`.

### Skills 2026 (.claude/skills/)

| Categoria | Skills                                        |
| --------- | --------------------------------------------- |
| Release   | `deploy-testflight`, `deploy-android`         |
| Quality   | `pre-commit`, `fix-types`, `verify`, `review` |
| Domain    | `nathia`                                      |
| Workflow  | `gates`, `commit-commands`                    |
| Design    | `superdesign`, `ui-ux-pro-max`                |

### Agents Ativos (10)

**Core**: `mobile-debugger` · `performance` · `database` · `frontend-architect`
**Frontend**: `design-ui` · `accessibility-auditor` · `animation-specialist` · `component-builder` · `responsive-layout` · `theme-migrator`

---

## ANTI-PATTERNS

| Evitar                 | Solução                  |
| ---------------------- | ------------------------ |
| Kitchen sink session   | `/clear` entre tarefas   |
| Correção infinita (3+) | `/clear` + prompt melhor |
| `console.log`          | `logger.*`               |
| `any` types            | `unknown` + guards       |
| Hardcoded colors       | `Tokens.*`               |

---

## SUMMARY INSTRUCTIONS FOR COMPACTION

Quando compactar contexto (autoCompact ou `/compact`), Claude deve focar em preservar:

### Preservar SEMPRE (Alta Prioridade)

1. **NathIA Personality Decisions** - Refinamentos em `src/ai/nathiaPrompt.ts`, tom, disclaimers médicos
2. **Supabase Schema Changes** - Estruturas de tabelas, RLS policies, migrations SQL
3. **Premium/IAP Integration** - RevenueCat configs, lógica de subscription, gates de paywall
4. **Navigation Flow Changes** - Rotas, padrões de navegação, deep links
5. **Design System Decisions** - Uso de tokens, esquemas de cores, regras de acessibilidade
6. **TypeScript Patterns** - Resoluções de erros de tipo, type guards, padrões imutáveis
7. **Build & Release Decisions** - Configurações de EAS, gates de release (G1-G7), versioning

### Omitir (Baixa Prioridade)

- Logs verbosos de Expo/Metro bundler
- Explorações repetidas de arquivos (sem mudanças)
- Tentativas de build falhadas (manter só a bem-sucedida)
- Etapas intermediárias de debugging (manter só causa raiz e solução)
- Outputs de ferramentas sem ação subsequente

### Contexto do Projeto

- **Domínio**: Saúde materna, AI companion (NathIA), mobile-first iOS/Android
- **Stack**: Expo SDK 55, React Native 0.83, TypeScript strict, Supabase, RevenueCat
- **Arquitetura**: Zustand stores, React Navigation, NativeWind styling, Gemini AI
- **Qualidade**: Zero `any`, zero `console.log`, zero hardcoded colors, WCAG AAA accessibility

---

_Skills: `.claude/skills/` · Docs: `docs/claude/` · Guide 2026: `docs/setup/CLAUDE_CODE_GUIDE_2026.md`_
