# .claude/ — Configuração Claude Code

> Regras para extensões do Claude Code neste projeto

---

## Estrutura

```
.claude/
├── CLAUDE.md         # Este arquivo
├── skills/           # Skills 2026 (preferir!)
│   ├── release/      # deploy-testflight, deploy-android
│   ├── quality/      # pre-commit, fix-types, verify, review
│   ├── domain/       # nathia
│   └── workflow/     # gates
├── agents/           # Agents especializados (legacy)
├── commands/         # Slash commands customizados
├── hooks/            # Event hooks
└── rules/            # Path-triggered rules
```

---

## Skills Disponíveis

| Skill          | Comando              | Propósito                 |
| -------------- | -------------------- | ------------------------- |
| Deploy iOS     | `/deploy-testflight` | Build + upload TestFlight |
| Deploy Android | `/deploy-android`    | Build + upload Play Store |
| Pre-commit     | `/pre-commit`        | Quality gate rápido       |
| Fix Types      | `/fix-types`         | Resolver erros TypeScript |
| Verify         | `/verify`            | Quality gate completo     |
| Review         | `/review`            | Code review               |
| NathIA         | `/nathia`            | Especialista na IA do app |
| Gates          | `/gates`             | Scoreboard de release     |
| Superdesign    | `/superdesign`       | UI/UX design agent (drafts, init)    |

**Hot-reload**: Modificações em skills são carregadas automaticamente.

---

## Quando Usar Skills vs Agents

| Cenário                       | Usar              |
| ----------------------------- | ----------------- |
| Tarefas específicas e focadas | Skills            |
| Fluxos complexos multi-step   | Agents            |
| Novo em 2026                  | Skills (preferir) |

---

## Criando Nova Skill

```
.claude/skills/[categoria]/[nome].md
```

Template:

```markdown
# Nome da Skill

## Trigger

Quando usar esta skill

## Steps

1. Passo 1
2. Passo 2

## Output

O que deve ser entregue
```

---

## Hooks Disponíveis

| Hook         | Trigger             |
| ------------ | ------------------- |
| `pre-commit` | Antes de git commit |
| `post-edit`  | Após editar arquivo |

---

## Contexto do Projeto

Este projeto usa:

- **Expo SDK 55** + React Native 0.81
- **TypeScript strict**
- **Zustand** + **TanStack Query**
- **Supabase** backend
- **RevenueCat** IAP

Ver `../CLAUDE.md` para regras completas do projeto.
