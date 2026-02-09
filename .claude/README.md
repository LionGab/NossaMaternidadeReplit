# Claude Code Configuration - Nossa Maternidade

**Última atualização:** 2026-01-25
**Versão:** 2.0.0 (Best Practices 2026)

## Estrutura

```
.claude/
├── settings.json          # Config principal (v2.0)
├── settings.local.json    # Permissões locais
├── statusline.sh          # Status line
├── skills/                # Skills 2026 (PREFERIDO!)
│   ├── release/           # deploy-testflight
│   ├── quality/           # pre-commit, fix-types, review
│   ├── domain/            # nathia
│   └── workflow/          # gates
├── agents/                # Agents especializados (legacy)
├── commands/              # Slash commands
├── hooks/                 # Event hooks
└── rules/                 # Path-triggered rules
```

## Skills 2026 (Recomendado)

Skills são a forma preferida de estender Claude Code em 2026. Carregam sob demanda com progressive disclosure.

| Skill               | Invocação            | Propósito                  |
| ------------------- | -------------------- | -------------------------- |
| `deploy-testflight` | `/deploy-testflight` | Deploy iOS para TestFlight |
| `deploy-android`    | `/deploy-android`    | Deploy Android para Play   |
| `pre-commit`        | `/pre-commit`        | Quality gate rápido        |
| `fix-types`         | `/fix-types`         | Resolver erros TS          |
| `verify`            | `/verify`            | Quality gate completo      |
| `review`            | `/review`            | Code review                |
| `nathia`            | `/nathia`            | Especialista NathIA        |
| `gates`             | `/gates`             | Release gates              |

**Hot-reload**: Skills recarregam automaticamente quando modificados.

## Agents (Legacy)

Mantidos para backward compatibility. Preferir skills quando possível.

| Agent                 | Propósito               |
| --------------------- | ----------------------- |
| `mobile-deployer`     | Builds EAS e deploy     |
| `mobile-debugger`     | Debug iOS/Android/Metro |
| `type-checker`        | Erros TypeScript        |
| `code-reviewer`       | Review de código        |
| `performance`         | Otimização RN           |
| `design-ui`           | Design system           |
| `database`            | Supabase, RLS           |
| `nathia-expert`       | Personalidade NathIA    |
| `nm-release-operator` | Gates TestFlight        |

## Commands

```bash
/verify          # Quality gate
/typecheck       # TypeScript
/test            # Jest tests
/fix-lint        # Auto-fix ESLint
/build-ios       # Build iOS
/build-android   # Build Android
/build-testflight# G6 + G7
/gates           # Scoreboard
/db-types        # Tipos Supabase
/db-migrate      # Migrations
```

## MCP Servers

- **supabase** - Migrations, RLS, edge functions
- **context7** - Documentação atualizada

## Configurações 2026

```json
{
  "autoCompact": { "enabled": true, "triggerTokens": 40000 },
  "statusline": { "enabled": true },
  "language": "pt-BR",
  "model": "sonnet"
}
```

## Migração v4 → v5

| Antes (v4)              | Depois (v5)                |
| ----------------------- | -------------------------- |
| Agents pesados          | Skills leves               |
| Spawnam subprocessos    | Executam inline            |
| 16 agents               | 6 skills + 9 agents legacy |
| settings.json 56 linhas | settings.json 122 linhas   |

**Benefícios v5:**

- ~3x mais rápido (skills inline)
- Progressive disclosure (carrega sob demanda)
- Hot-reload automático
- Melhor composição de workflows
