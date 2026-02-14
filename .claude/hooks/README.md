# Claude Code Hooks

Este diretorio contem scripts executados automaticamente durante o ciclo de vida do Claude Code.

## Hooks Ativos (9)

### SessionStart

| Hook               | Proposito                              |
| ------------------ | -------------------------------------- |
| `session-start.sh` | Valida ambiente, versoes, dependencias |

### PreToolUse

| Hook                          | Matcher       | Proposito                                             |
| ----------------------------- | ------------- | ----------------------------------------------------- |
| `validate-bash.sh`            | `Bash`        | Bloqueia comandos perigosos (rm -rf, force push, etc) |
| `pre-edit-check.sh`           | `Write\|Edit` | Valida edicoes de arquivos                            |
| `validate-sensitive-files.py` | `Write\|Edit` | Bloqueia .env, secrets, credentials                   |

### PostToolUse

| Hook                  | Matcher       | Proposito                               |
| --------------------- | ------------- | --------------------------------------- |
| `post-edit-format.sh` | `Write\|Edit` | Auto-format com Prettier (TS, JSON, MD) |

### UserPromptSubmit

| Hook                | Proposito                           |
| ------------------- | ----------------------------------- |
| `prompt-context.sh` | Injeta contexto baseado em keywords |

### Stop

| Hook                | Proposito                   |
| ------------------- | --------------------------- |
| `pre-stop-check.sh` | Typecheck antes de encerrar |

### PreCompact

| Hook                            | Proposito                          |
| ------------------------------- | ---------------------------------- |
| `pre-compact-save-decisions.sh` | Salva git state antes de compactar |
| `pre-compact-metrics.sh`        | Metricas de compactacao            |

## Como Funciona

Os hooks recebem input JSON via stdin com informacoes da operacao:

```json
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "src/components/Button.tsx",
    "content": "..."
  }
}
```

**Exit codes:**

- `0`: Permite operacao
- `2`: Bloqueia operacao (retorna erro para Claude)

## Adicionar Novo Hook

1. Crie o script em `.claude/hooks/`
2. Torne executavel: `chmod +x script.sh`
3. Registre em `.claude/settings.json` no bloco `hooks`

## Referencia

- Configuracao: `.claude/settings.json` (bloco `hooks`)
- [Claude Code Hooks Guide](https://docs.anthropic.com/en/docs/claude-code/hooks)
