# Claude Code Hooks

Este diretório contém scripts que são executados automaticamente durante o ciclo de vida do Claude Code.

## Hooks Disponíveis

### `validate-sensitive-files.py`

**Evento:** `PreToolUse` (Edit|Write)

Bloqueia edições em arquivos sensíveis:

- `.env*` (variáveis de ambiente)
- `secrets/`, `credentials/`
- `.git/`, `node_modules/`
- Configs de build sensíveis

**Exit codes:**

- `0`: Permite operação
- `2`: Bloqueia operação (retorna erro para Claude)

### `auto-format.sh`

**Evento:** `PostToolUse` (Edit|Write)

Formata automaticamente arquivos após edição:

- TypeScript/JavaScript: Prettier
- JSON: Prettier
- Markdown: Prettier

## Como Funciona

Os hooks recebem input JSON via stdin com informações da operação:

```json
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "src/components/Button.tsx",
    "content": "..."
  }
}
```

## Adicionar Novo Hook

1. Crie o script em `.claude/hooks/`
2. Torne executável: `chmod +x script.sh`
3. Registre em `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": ".claude/hooks/seu-script.sh" }]
      }
    ]
  }
}
```

## Referência

- [Hooks Guide](https://code.claude.com/docs/en/hooks-guide.md)
- [Hooks Reference](https://code.claude.com/docs/en/hooks.md)
