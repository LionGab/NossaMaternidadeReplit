---
name: deploy-testflight
description: Deploy completo para TestFlight com validação de gates e build automático
agent: general-purpose
model: sonnet
allowed-tools:
  - Bash
  - Read
  - Edit
  - Grep
  - Glob
hooks:
  - event: PreToolUse
    matcher: "Bash"
    script: |
      # Validar que não estamos fazendo push sem typecheck
      if [[ "$TOOL_ARGS" == *"eas build"* ]]; then
        npm run typecheck 2>&1 || exit 1
      fi
---

# Deploy TestFlight

Pipeline completo para deploy iOS no TestFlight.

## Quick Start

```bash
# Deploy completo (recomendado)
npm run build:prod:ios && npm run submit:prod:ios
```

## Pipeline Automático

@.claude/skills/release/pipeline.md

## Troubleshooting

@.claude/skills/release/troubleshooting.md

## Checklist Pré-Deploy

- [ ] `npm run quality-gate` passa
- [ ] Versão incrementada em `app.json`
- [ ] Secrets configurados no EAS
- [ ] Git status limpo

## Comandos Rápidos

| Ação          | Comando                          |
| ------------- | -------------------------------- |
| Build iOS     | `npm run build:prod:ios`         |
| Submit        | `npm run submit:prod:ios`        |
| Listar builds | `eas build:list --limit 5`       |
| Ver build     | `eas build:view <id>`            |
| Credentials   | `eas credentials --platform ios` |

## Regras Críticas

1. **NUNCA** fazer build sem `npm run typecheck` passar
2. **SEMPRE** incrementar versão antes de build production
3. **SEMPRE** usar `--non-interactive` em CI/CD
