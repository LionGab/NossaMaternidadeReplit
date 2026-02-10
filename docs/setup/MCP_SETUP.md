# MCP Setup - Nossa Maternidade (Baseline 09/02/2026)

Este documento define o baseline oficial de MCPs do repositório para macOS/Unix.

## Objetivo

- Eliminar drift entre arquivos de configuração MCP do projeto.
- Garantir onboarding reproduzível para qualquer dev do time.
- Manter GitHub em modo `read-only` por padrão.

## Fonte de verdade

- Arquivo canônico: `.claude/mcp-config.json`.
- Arquivos que devem refletir o mesmo conjunto MCP:
  - `.mcp.json`
  - `scripts/setup/setup-mcps-mac.sh`

## Escopo e plataforma

- Escopo: somente arquivos versionados do repositório.
- Plataforma baseline: macOS/Unix first.
- Windows: fora do baseline operacional; configurar separadamente se necessário.

## Pré-requisitos

- `node` instalado.
- `npx` disponível.
- Cursor instalado (script escreve em `~/Library/Application Support/Cursor/User/settings.json`).
- Expo autenticado (`npx expo login` ou `eas login`).
- Token GitHub read-only em ambiente:
  - `export COPILOT_MCP_GITHUB_TOKEN=<seu_token_read_only>`

## Conjunto MCP oficial

### Obrigatórios

1. `expo`
   - `transport`: `http`
   - `url`: `https://mcp.expo.dev/mcp`

2. `xcode`
   - `command`: `npx`
   - `args`: `["-y","xcodebuildmcp@latest"]`

3. `react-native-guide`
   - `command`: `npx`
   - `args`: `["-y","@mrnitro360/react-native-mcp-guide@1.1.0"]`

4. `rn-debugger`
   - `command`: `npx`
   - `args`: `["-y","@twodoorsdev/react-native-debugger-mcp"]`

5. `sequential-thinking`
   - `command`: `npx`
   - `args`: `["-y","@modelcontextprotocol/server-sequential-thinking"]`

6. `context7`
   - `command`: `npx`
   - `args`: `["-y","@upstash/context7-mcp@latest"]`

7. `github-readonly`
   - `command`: `npx`
   - `args`: `["-y","@modelcontextprotocol/server-github"]`
   - `env.GITHUB_PERSONAL_ACCESS_TOKEN`: `${COPILOT_MCP_GITHUB_TOKEN}`

8. `memory-keeper`
   - `command`: `npx`
   - `args`: `["-y","@modelcontextprotocol/server-memory"]`
   - `env.MCP_MEMORY_DB_PATH`: `.claude/context.db`

9. `playwright`
   - `command`: `npx`
   - `args`: `["-y","@playwright/mcp@latest"]`

### Opcional

10. `figma-devmode`
    - `transport`: `sse`
    - `url`: `http://127.0.0.1:3845/sse`

## Setup macOS

Executar na raiz do projeto:

```bash
chmod +x scripts/setup/setup-mcps-mac.sh
./scripts/setup/setup-mcps-mac.sh
```

Depois:

```bash
export COPILOT_MCP_GITHUB_TOKEN=<seu_token_read_only>
npx expo login
```

Reinicie o Cursor para recarregar os MCPs.

## Validação pós-setup

### 1. JSON sintático

```bash
node -e "JSON.parse(require('fs').readFileSync('.mcp.json','utf8'))"
node -e "JSON.parse(require('fs').readFileSync('.claude/mcp-config.json','utf8'))"
```

### 2. Semântica mínima do baseline

Verifique:

- presença dos 10 MCPs definidos;
- ausência de `cmd`, `/c` e paths fixos `C:\\Users\\...` nos arquivos finais.

### 3. Idempotência do setup

Rode duas vezes:

```bash
./scripts/setup/setup-mcps-mac.sh
./scripts/setup/setup-mcps-mac.sh
```

Confirme que `settings.json` mantém `mcpServers` sem duplicações.

### 4. Smoke tests operacionais

- `expo`: autenticação válida e acesso ao endpoint MCP.
- `github-readonly`: sem token pode iniciar, mas operações autenticadas falham; com token deve permitir leitura.
- `context7` e `sequential-thinking`: inicializam sem erro de comando.

## Segurança

- Não versionar tokens.
- Não usar permissões de escrita no GitHub por padrão.
- Não expor segredos sensíveis do app (`SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`) em configuração MCP.

## Troubleshooting

### MCP não aparece no Cursor

- Reinicie completamente o Cursor.
- Verifique sintaxe de `settings.json` do Cursor.
- Execute novamente `scripts/setup/setup-mcps-mac.sh`.

### Expo MCP indisponível

- Faça login: `npx expo login` ou `eas login`.
- Verifique conectividade com `https://mcp.expo.dev/mcp`.

### GitHub MCP falhando

- Verifique variável: `echo $COPILOT_MCP_GITHUB_TOKEN`.
- Gere token com escopo mínimo de leitura.

### Figma Dev Mode não conecta

- Abra o Figma Desktop.
- Confirme endpoint local `http://127.0.0.1:3845/sse`.
