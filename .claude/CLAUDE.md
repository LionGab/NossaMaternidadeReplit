# .claude/ — Configuracao Claude Code

> Regras para extensoes do Claude Code neste projeto

---

## Estrutura

```
.claude/
├── CLAUDE.md         # Este arquivo
├── skills/           # Skills 2026 (preferir!)
│   ├── release/      # deploy-testflight, deploy-android
│   ├── quality/      # pre-commit, fix-types, verify, review
│   ├── domain/       # nathia
│   └── workflow/     # gates, commit-commands
├── agents/           # Agents ativos (10)
├── commands/         # Slash commands (9)
├── hooks/            # Event hooks (8 ativos)
└── rules/            # Path-triggered rules (25)
```

---

## Skills Disponiveis (11)

| Skill           | Comando              | Proposito                                        |
| --------------- | -------------------- | ------------------------------------------------ |
| Deploy iOS      | `/deploy-testflight` | Build + upload TestFlight                        |
| Deploy Android  | `/deploy-android`    | Build + upload Play Store                        |
| Pre-commit      | `/pre-commit`        | Quality gate rapido                              |
| Fix Types       | `/fix-types`         | Resolver erros TypeScript                        |
| Verify          | `/verify`            | Quality gate completo                            |
| Review          | `/review`            | Code review                                      |
| NathIA          | `/nathia`            | Especialista na IA do app                        |
| Gates           | `/gates`             | Scoreboard de release                            |
| Commit commands | `/commit-commands`   | Workflow commit/push/PR (quality gate + atomico) |
| Superdesign     | `/superdesign`       | UI/UX design agent (drafts, init)                |
| UI/UX Pro Max   | `/ui-ux-pro-max`     | Design intelligence (67 estilos, 96 paletas)     |

**Hot-reload**: Modificacoes em skills sao carregadas automaticamente.

---

## Agents Ativos (10)

### Core (4 — sem skill equivalente)

| Agent              | Proposito                           |
| ------------------ | ----------------------------------- |
| mobile-debugger    | Debug React Native (build, runtime) |
| performance        | Otimizacao de performance           |
| database           | Supabase, migrations, RLS           |
| frontend-architect | Orquestrador de UI (usa subagentes) |

### Frontend (6 — subagentes do frontend-architect)

| Agent                 | Proposito                       |
| --------------------- | ------------------------------- |
| design-ui             | Design system coordinator       |
| accessibility-auditor | Auditoria WCAG AAA              |
| animation-specialist  | Animacoes Reanimated            |
| component-builder     | Criar componentes React Native  |
| responsive-layout     | Safe Areas, layouts responsivos |
| theme-migrator        | Migrar hardcoded para tokens    |

### Migrados para Skills (removidos)

- ~~mobile-deployer~~ → `/deploy-testflight`, `/deploy-android`
- ~~nathia-expert~~ → `/nathia`
- ~~nm-release-operator~~ → `/gates`
- ~~type-checker~~ → `/fix-types`
- ~~code-reviewer~~ → `/review`

---

## Commands (9)

| Command       | Proposito                |
| ------------- | ------------------------ |
| verify        | Quality gate completo    |
| typecheck     | TypeScript validation    |
| test          | Jest test suite          |
| fix-lint      | Auto-fix ESLint+Prettier |
| db-types      | Gerar tipos Supabase     |
| db-migrate    | Rodar migrations         |
| rules         | Listar regras ativas     |
| commit        | Quality gate + commit    |
| compact-stats | Metricas de compactacao  |

### Migrados para Skills (removidos)

- ~~gates~~ → skill `/gates`
- ~~build-ios~~ → skill `/deploy-testflight`
- ~~build-testflight~~ → skill `/deploy-testflight`
- ~~build-android~~ → skill `/deploy-android`

---

## Hooks (8 ativos)

| Hook                          | Evento           | Proposito                   |
| ----------------------------- | ---------------- | --------------------------- |
| session-start.sh              | SessionStart     | Valida ambiente, versoes    |
| validate-bash.sh              | PreToolUse:Bash  | Bloqueia comandos perigosos |
| pre-edit-check.sh             | PreToolUse:Write | Valida edicoes de arquivos  |
| validate-sensitive-files.py   | PreToolUse:Write | Bloqueia .env, secrets      |
| post-edit-format.sh           | PostToolUse      | Auto-format com Prettier    |
| pre-stop-check.sh             | Stop             | Typecheck antes de parar    |
| prompt-context.sh             | UserPromptSubmit | Contexto por keywords       |
| pre-compact-save-decisions.sh | PreCompact       | Salva git state             |
| pre-compact-metrics.sh        | PreCompact       | Metricas de compactacao     |

---

## Quando Usar Skills vs Agents

| Cenario                       | Usar              |
| ----------------------------- | ----------------- |
| Tarefas especificas e focadas | Skills            |
| Fluxos complexos multi-step   | Agents            |
| Novo em 2026                  | Skills (preferir) |

---

## Sessoes Paralelas

Abra multiplos terminais no Cursor (`Cmd+\``) e rode `claude` em cada:

```
Sessao 1 (Feature)     Sessao 2 (Quality)     Sessao 3 (Backend)
claude                  claude                  claude
→ UI/componentes        → /verify               → database agent
→ /review ao final      → /fix-types            → migrations
```

**Regras**: nunca 2 sessoes no mesmo arquivo · `/clear` entre tarefas · worktrees para branches isoladas.

---

## Contexto do Projeto

- **Expo SDK 55** + React Native 0.83
- **TypeScript strict** (zero `any`)
- **Zustand** + **TanStack Query**
- **Supabase** backend
- **RevenueCat** IAP

Ver `../CLAUDE.md` para regras completas do projeto.
