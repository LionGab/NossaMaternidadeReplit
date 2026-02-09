# 🚀 GUIA COMPLETO CLAUDE CODE - JANEIRO 2026

> **Data do Guia:** 10 de Janeiro de 2026
> **Versão Claude Code:** 2.1.3
> **Baseado em:** Documentação oficial completa de https://code.claude.com/docs/en/

## 📋 ÍNDICE

1. [Novidades e Atualizações Recentes](#novidades)
2. [Configurações Essenciais](#configuracoes)
3. [Memória e Contexto](#memoria)
4. [Modelos e Performance](#modelos)
5. [Plugins e Extensibilidade](#plugins)
6. [Automação com Hooks](#hooks)
7. [MCP Servers](#mcp)
8. [Integrações](#integracoes)
9. [Segurança e Sandbox](#seguranca)
10. [Otimização de Custos](#custos)
11. [Workflows Avançados](#workflows)
12. [Chrome Integration (Beta)](#chrome)
13. [Checkpointing e Rewind](#checkpointing)
14. [Dicas de Terminal](#terminal)

---

<a name="novidades"></a>

## 🆕 NOVIDADES E ATUALIZAÇÕES RECENTES (v2.1.3)

### Recursos Mais Recentes

✨ **Unificação de Slash Commands e Skills** - Modelo mental unificado para melhor experiência

✨ **Release Channels** - Escolha entre `stable` ou `latest` no `/config`

✨ **Detecção de Regras Inacessíveis** - Warnings com sugestões de correção para permission rules

✨ **Hot-reload de Skills** - Atualização automática de skills em `~/.claude/skills` e `.claude/skills`

✨ **Steering em Tempo Real** - Controle Claude enquanto ele trabalha

✨ **Unified Ctrl+B** - Backgrounding unificado para bash e agents

✨ **MCP `list_changed`** - Suporte a notificações de mudanças

✨ **Hooks em Frontmatter** - Suporte a hooks em agents/skills/slash commands

✨ **Vim Motions Expandidos** - Novos movimentos: `;`, `,`, `y`, `p`, `>>`, `<<`, `J`

### Correções Importantes

🔧 Plan files não persistem mais entre `/clear`

🔧 Correção de vulnerabilidade de command injection

🔧 Memory leak com tree-sitter resolvido

🔧 Sub-agents agora usam o modelo correto durante compaction

---

<a name="configuracoes"></a>

## ⚙️ CONFIGURAÇÕES ESSENCIAIS

### Localização dos Settings

```
.claude/settings.json          # Configurações do projeto
~/.claude/settings.json        # Configurações globais do usuário
```

### Configuração Recomendada para 2026

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "project": "Seu Projeto",

  // Model Configuration
  "model": "sonnet", // ou "opus" para tarefas complexas

  // Auto-compact (economiza contexto)
  "autoCompact": {
    "enabled": true,
    "triggerTokens": 40000 // Ajuste conforme necessário
  },

  // Status Line
  "statusline": {
    "enabled": true,
    "command": "bash .claude/statusline.sh",
    "refreshIntervalMs": 10000
  },

  // Memory (SQLite recomendado)
  "memory": {
    "provider": "sqlite",
    "path": ".claude/context.db"
  },

  // Language
  "language": "pt-BR", // Novo em 2026!

  // Limits
  "limits": {
    "maxTurns": 100,
    "timeoutMinutes": 120,
    "maxTokensPerTurn": 200000
  },

  // YOLO Mode (dev only)
  "yoloMode": {
    "enabled": true,
    "autoApproveTools": ["Read", "Grep", "Glob"]
  }
}
```

---

<a name="memoria"></a>

## 🧠 MEMÓRIA E CONTEXTO

### Hierarquia de Memória (4 níveis)

| Tipo                  | Localização                            | Escopo                       | Compartilhado com |
| --------------------- | -------------------------------------- | ---------------------------- | ----------------- |
| **Enterprise Policy** | `/etc/claude-code/CLAUDE.md`           | Toda organização             | Todos os usuários |
| **Project Memory**    | `./CLAUDE.md` ou `./.claude/CLAUDE.md` | Projeto (time)               | Time via Git      |
| **Project Rules**     | `./.claude/rules/*.md`                 | Módulos por tópico           | Time via Git      |
| **User Memory**       | `~/.claude/CLAUDE.md`                  | Todos os projetos do usuário | Só você           |
| **Project Local**     | `./CLAUDE.local.md`                    | Projeto específico           | Só você           |

### Melhores Práticas de Memória

✅ **Use estrutura clara**

```markdown
# Coding Standards

## TypeScript

- Use strict mode
- No `any` types
- Prefer `unknown` + type guards

## React

- Functional components only
- Use hooks
- Avoid inline functions in JSX
```

✅ **Imports de arquivos**

```markdown
See @README for project overview
See @package.json for available commands

# Git Workflow

@docs/git-workflow.md
```

✅ **Rules específicas por path**

```markdown
---
paths: src/api/**/*.ts
---

# API Development Rules

- All endpoints must have input validation
- Use Zod for schema validation
```

✅ **Comandos úteis**

- `/memory` - Edita arquivo de memória
- `/init` - Bootstrap project memory

### Compactação automática e uso do Claude Desktop

O `autoCompact` em `.claude/settings.json` (ex.: `triggerTokens: 80000`) compacta contexto antigo quando o limite é atingido. Para aproveitar ao máximo:

| Ação | Quando usar |
|------|-----------------------------|
| **Manter autoCompact** | Sempre ativo com `triggerTokens` entre 70k–90k (projeto usa 80k). |
| **`/clear`** | Ao mudar de tarefa (novo bug, nova feature, novo assunto). |
| **`/compact`** | Quando a conversa está longa mas ainda no mesmo tema e você quer manter decisões sem zerar. |
| **Evitar colar blocos enormes** | Preferir referências a arquivos (`@arquivo`) para não inflar tokens. |
| **Usar skills/agents** | `/nathia`, `/verify`, etc. mantêm o contexto focado e reduzem tokens. |

- **70k–90k tokens**: faixa configurada no projeto (80k); menos compactações, mais contexto recente preservado.

---

<a name="modelos"></a>

## 🤖 MODELOS E PERFORMANCE

### Aliases de Modelos

| Alias        | Uso Recomendado     | Performance           |
| ------------ | ------------------- | --------------------- |
| `sonnet`     | Tarefas diárias     | ⚡⚡⚡ Rápido         |
| `opus`       | Raciocínio complexo | 🧠 Profundo           |
| `haiku`      | Tarefas simples     | ⚡⚡⚡⚡ Muito rápido |
| `sonnet[1m]` | Grandes contextos   | ⚡⚡ Médio            |
| `opusplan`   | Hybrid mode         | 🧠⚡ Inteligente      |

### Modo `opusplan` (RECOMENDADO)

```bash
claude --model opusplan
```

**✅ CONFIRMADO na v2.1.3** (testado em 10/01/2026)

**Funciona assim:**

- 📐 **Plan mode**: Usa Opus para arquitetura e raciocínio
- 💻 **Execution mode**: Muda automaticamente para Sonnet para código

**Benefícios:**

- Melhor custo-benefício
- Raciocínio profundo + execução rápida
- Ideal para features complexas

### Variáveis de Ambiente

```bash
# Customizar modelos padrão
export ANTHROPIC_DEFAULT_OPUS_MODEL="claude-opus-4-5-20251101"
export ANTHROPIC_DEFAULT_SONNET_MODEL="claude-sonnet-4-5-20250929"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="claude-haiku-4-0-20250107"

# Modelo para subagents
export CLAUDE_CODE_SUBAGENT_MODEL="haiku"  # Economiza custos

# Desabilitar prompt caching (não recomendado)
export DISABLE_PROMPT_CACHING=true
```

### Trocar Modelo na Sessão

```bash
/model opus       # Durante a sessão
/model sonnet[1m] # Extended context
```

---

<a name="plugins"></a>

## 🔌 PLUGINS E EXTENSIBILIDADE

### Descobrir e Instalar Plugins

```bash
# Adicionar marketplace oficial
/plugin marketplace add anthropics/claude-code

# Listar plugins disponíveis
/plugin list

# Instalar plugin
/plugin install <plugin-name>@claude-code-plugins

# Plugins populares
/plugin install frontend-design@claude-code-plugins
/plugin install commit-commands@claude-code-plugins
/plugin install pr-review-toolkit@claude-code-plugins
```

### Estrutura de Plugin

```
my-plugin/
├── plugin.json              # Manifest
├── commands/                # Slash commands
│   └── my-command.md
├── agents/                  # Custom agents
│   └── my-agent.md
├── skills/                  # Skills
│   └── my-skill.md
└── hooks/                   # Event hooks
    ├── PreToolUse/
    └── PostToolUse/
```

### Criar Plugin Básico

**plugin.json:**

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My custom plugin",
  "author": "Your Name",
  "claudeCodeVersion": ">=2.0.0"
}
```

**commands/hello.md:**

```markdown
---
name: hello
description: Say hello
---

Say hello to the user in a friendly way!
```

### Hot-reload (Novo em 2.1!)

Plugins em `~/.claude/skills` e `.claude/skills` são **recarregados automaticamente**!

---

<a name="hooks"></a>

## 🪝 AUTOMAÇÃO COM HOOKS

### Tipos de Hooks

| Hook               | Quando Executa                | Uso                        |
| ------------------ | ----------------------------- | -------------------------- |
| `PreToolUse`       | Antes de usar uma ferramenta  | Validação, logging         |
| `PostToolUse`      | Depois de usar uma ferramenta | Cleanup, notificações      |
| `Stop`             | Ao parar sessão               | Salvar estado              |
| `SubagentStop`     | Ao parar subagent             | Cleanup de subagent        |
| `SessionStart`     | Ao iniciar sessão             | Setup inicial              |
| `SessionEnd`       | Ao terminar sessão            | Cleanup final              |
| `UserPromptSubmit` | Ao enviar prompt              | Validação de input         |
| `PreCompact`       | Antes de compactar            | Salvar contexto importante |
| `Notification`     | Ao mostrar notificação        | Custom alerts              |

### Exemplo de Hook

**.claude/hooks/PreToolUse/validate-git.sh:**

```bash
#!/bin/bash
# Valida commits antes de executar git push

TOOL_NAME="$1"

if [[ "$TOOL_NAME" == "Bash" ]]; then
  COMMAND=$(echo "$TOOL_ARGS" | jq -r '.command')

  if [[ "$COMMAND" == *"git push"* ]]; then
    # Verificar se há commits para push
    if ! git log origin/main..HEAD --oneline | grep -q .; then
      echo "BLOCK: No commits to push"
      exit 1
    fi
  fi
fi

exit 0
```

### Hook em Frontmatter (Skills/Agents)

```markdown
---
name: my-skill
hooks:
  - event: PreToolUse
    script: scripts/validate.sh
---

Skill content here...
```

---

<a name="mcp"></a>

## 🌐 MCP SERVERS (Model Context Protocol)

### Configuração MCP

**.mcp.json:**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_DB_URL": "${env:SUPABASE_DB_URL}",
        "SUPABASE_ACCESS_TOKEN": "${env:SUPABASE_ACCESS_TOKEN}"
      }
    },
    "memory-keeper": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MCP_MEMORY_DB_PATH": "${workspace}/.claude/context.db"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "description": "Documentação atualizada: React, Supabase, Expo, etc."
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

### MCP Servers Recomendados

| Server                                             | Propósito                              |
| -------------------------------------------------- | -------------------------------------- |
| `@modelcontextprotocol/server-memory`              | Persistência de contexto               |
| `@upstash/context7-mcp`                            | Docs atualizadas (React, Next.js, etc) |
| `@modelcontextprotocol/server-sequential-thinking` | Pensamento sequencial                  |
| `@supabase/mcp-server`                             | Migrations, RLS, edge functions        |
| `@playwright/mcp`                                  | Browser automation                     |
| `@anthropic-ai/mcp-server-slack`                   | Integração Slack                       |

---

<a name="integracoes"></a>

## 🔗 INTEGRAÇÕES

### VS Code

```json
// .vscode/settings.json
{
  "claudeCode.allowDangerouslySkipPermissions": true,
  "claudeCode.enableUltraThink": true,
  "claudeCode.maxContextTokens": 200000,
  "claudeCode.preferredModel": "sonnet"
}
```

### GitHub Actions

```yaml
name: Claude Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Claude Code
        run: curl -fsSL https://claude.ai/install.sh | bash
      - name: Review PR
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Review this PR for bugs and suggest improvements" \
            --allowedTools "Read,Grep,Glob" \
            --output-format json > review.json
```

### Slack

**Setup:**

1. Instalar Claude app no Slack
2. Conectar conta Claude
3. Habilitar Claude Code on the web
4. Conectar GitHub
5. Escolher modo: Code only ou Code + Chat

**Uso:**

```
@Claude fix the login bug in auth.ts
@Claude add input validation to the signup form
@Claude investigate why tests are failing
```

### Desktop App

**Git Worktrees:**

- Múltiplas sessões simultâneas no mesmo repo
- Worktrees isolados com git

**.worktreeinclude:**

```
.env
.env.local
.env.*
**/.claude/settings.local.json
```

---

<a name="seguranca"></a>

## 🔒 SEGURANÇA E SANDBOX

### Sandboxing

```bash
# Habilitar sandbox
/sandbox
```

**Modos:**

1. **Auto-allow mode** - Comandos bash executam automaticamente dentro dos limites
2. **Regular permissions** - Fluxo padrão de permissões

### Configuração de Sandbox

```json
{
  "sandbox": {
    "filesystem": {
      "allowedPaths": ["/workspace", "/tmp"],
      "deniedPaths": ["/etc/passwd", "~/.ssh"]
    },
    "network": {
      "allowedDomains": ["github.com", "npmjs.org"],
      "httpProxyPort": 8080
    }
  }
}
```

### Boas Práticas de Segurança

✅ Review todas as mudanças sugeridas

✅ Use permissões específicas por projeto

✅ Considere devcontainers para isolamento

✅ Audite permissões com `/permissions`

✅ Use managed settings em enterprise

⚠️ **NUNCA** use `--dangerously-skip-permissions` em repos não confiáveis

---

<a name="custos"></a>

## 💰 OTIMIZAÇÃO DE CUSTOS

### Monitorar Custos

```bash
/cost  # Ver custo da sessão atual
```

**Output:**

```
Total cost:            $0.55
Total duration (API):  6m 19.7s
Total duration (wall): 6h 33m 10.2s
Total code changes:    0 lines added, 0 lines removed
```

### Estratégias de Redução

✅ **Auto-compact habilitado** (economiza tokens)

```json
{
  "autoCompact": {
    "enabled": true,
    "triggerTokens": 40000
  }
}
```

✅ **Use Haiku para subagents** (tarefas simples)

```bash
export CLAUDE_CODE_SUBAGENT_MODEL="haiku"
```

✅ **Queries específicas** (evite perguntas vagas)

✅ **Use `/clear`** entre tarefas não relacionadas

✅ **Customize compaction** em CLAUDE.md

```markdown
# Summary instructions

When compacting, focus on test output and code changes.
Omit verbose logs and intermediate steps.
```

### Benchmarks (Janeiro 2026)

| Uso                      | Custo Estimado                |
| ------------------------ | ----------------------------- |
| Desenvolvedor individual | ~$6/dia (90% < $12/dia)       |
| Team usage               | $100-200/dev/mês (Sonnet 4.5) |

### Rate Limits Recomendados

| Team Size   | TPM/user  | RPM/user  |
| ----------- | --------- | --------- |
| 1-5 users   | 200k-300k | 5-7       |
| 5-20 users  | 100k-150k | 2.5-3.5   |
| 20-50 users | 50k-75k   | 1.25-1.75 |

---

<a name="workflows"></a>

## 🎯 WORKFLOWS AVANÇADOS

### Headless Mode (Programmatic)

```bash
# One-shot com output JSON
claude -p "Fix all linting errors" \
  --allowedTools "Read,Edit,Bash" \
  --output-format json

# Continue conversation
claude -p "Now run the tests" --continue

# Resume sessão específica
claude -p "Check test coverage" --resume "$session_id"

# Pipeline Unix
tail -f app.log | claude -p "Alert me if anomalies appear"
```

### Output Styles

```bash
# Trocar para modo explanatory
/output-style explanatory

# Modo learning (collaborative)
/output-style learning

# Custom output style
# Criar: ~/.claude/output-styles/custom.md
```

**custom.md:**

```markdown
---
name: Custom Style
description: My custom output style
keep-coding-instructions: false
---

You are concise and focus on performance optimization.
Always suggest benchmarks when making changes.
```

### Checkpointing e Rewind

```bash
# Rewind (desfazer mudanças)
Esc Esc     # Pressionar Esc duas vezes
/rewind     # Ou usar comando

# Opções:
# 1. Conversation only - Mantém código, volta conversa
# 2. Code only - Reverte código, mantém conversa
# 3. Both - Volta tudo
```

⚠️ **Limitações:**

- Comandos bash NÃO são rastreados
- Mudanças externas não são capturadas
- Não substitui Git

### Vim Mode

```bash
/vim  # Habilitar vim mode
```

**Movimentos suportados:**

- Modos: `Esc`, `i`, `a`, `o`, `I`, `A`, `O`
- Navegação: `h`, `j`, `k`, `l`, `w`, `e`, `b`, `0`, `$`, `gg`, `G`
- Edição: `x`, `dw`, `dd`, `D`, `cw`, `cc`, `C`
- Yank/paste: `yy`, `Y`, `yw`, `p`, `P`
- Text objects: `iw`, `aw`, `i"`, `a"`, `i(`, `a(`
- Indentação: `>>`, `<<`
- Novos em 2.1: `;`, `,`, `y`, `p`, `J`

---

<a name="chrome"></a>

## 🌐 CHROME INTEGRATION (Beta)

### Setup

**Requisitos:**

- Google Chrome
- Claude in Chrome extension v1.0.36+
- Claude Code CLI v2.0.73+
- Plano pago (Pro, Team, Enterprise)

**Instalação:**

```bash
# Atualizar Claude Code
claude update

# Iniciar com Chrome
claude --chrome

# Verificar conexão
/chrome
```

### Use Cases

✅ **Live debugging**

```
Open localhost:3000/dashboard and check console for errors
```

✅ **Design verification**

```
Build the login form and verify it matches the Figma design
```

✅ **Form testing**

```
Test the signup form validation with invalid inputs
```

✅ **Authenticated apps**

```
Open my Google Doc and add today's standup notes
```

✅ **Data extraction**

```
Go to example.com/products and extract names, prices to CSV
```

✅ **Session recording**

```
Record my checkout flow as a GIF
```

### Limitações

⚠️ Apenas Google Chrome (não Brave, Arc, etc)

⚠️ WSL não suportado

⚠️ Requer janela visível (sem headless)

⚠️ Modais podem bloquear comandos

### Habilitar por Padrão

```bash
/chrome  # → "Enabled by default"
```

---

<a name="checkpointing"></a>

## 💾 CHECKPOINTING E REWIND

### Como Funciona

- ✅ **Automático**: Cada prompt do usuário cria checkpoint
- ✅ **Persistente**: Funciona entre sessões resumidas
- ✅ **Auto-cleanup**: Remove após 30 dias

### Reverter Mudanças

**Atalho:** `Esc` `Esc` (pressionar Esc duas vezes)

**Comando:** `/rewind`

**Opções:**

1. **Conversation only**
   - Volta mensagem do usuário
   - Mantém mudanças de código

2. **Code only**
   - Reverte mudanças de arquivos
   - Mantém histórico de conversa

3. **Both**
   - Restaura código E conversa

### Use Cases

✅ Explorar alternativas sem perder ponto de partida

✅ Recuperar de bugs introduzidos

✅ Iterar em features com segurança

### ⚠️ IMPORTANTE

- Comandos bash NÃO rastreados (`rm`, `mv`, etc)
- Mudanças externas não capturadas
- Use Git para histórico permanente

---

<a name="terminal"></a>

## 🖥️ DICAS DE TERMINAL

### Shift+Enter (Multi-line)

**Funciona nativamente:**

- iTerm2
- WezTerm
- Ghostty
- Kitty

**Configurar manualmente:**

```bash
/terminal-setup  # Auto-configura para VS Code, Alacritty, Zed, Warp
```

**Alternativa:** `\` + Enter

### Status Line

**.claude/statusline.sh:**

```bash
#!/bin/bash
PROJECT_NAME="My Project"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

# Git status
GIT_STATUS=$(git status --porcelain 2>/dev/null)
if [ -n "$GIT_STATUS" ]; then
    GIT_ICON="●"
else
    GIT_ICON="✓"
fi

# Memory (macOS)
SWAP_INFO=$(sysctl vm.swapusage 2>/dev/null || echo "")
SWAP_USED=$(echo "$SWAP_INFO" | awk '{print $7}' | sed 's/M//')

if [ "$SWAP_USED" -gt 2000 ]; then
    MEM_ICON="🔴"
elif [ "$SWAP_USED" -gt 1000 ]; then
    MEM_ICON="🟡"
else
    MEM_ICON="🟢"
fi

echo "$PROJECT_NAME | $BRANCH $GIT_ICON | $MEM_ICON"
```

### Notificações (iTerm2)

1. iTerm 2 Preferences
2. Profiles → Terminal
3. Enable "Silence bell" e "Filter Alerts"
4. Set notification delay

### Handling Large Inputs

⚠️ **Evite paste longo direto** - Terminal pode truncar

✅ **Use arquivos:**

```bash
# Em vez de colar 1000 linhas
echo "Review this code: $(cat large-file.ts)" | claude -p
```

---

## 🎓 COMANDOS ESSENCIAIS (Referência Rápida)

### Comandos Slash

```bash
/help              # Ajuda
/config            # Configurações
/model <alias>     # Trocar modelo
/memory            # Editar memória
/init              # Bootstrap project
/clear             # Limpar contexto
/compact           # Compactar manualmente
/cost              # Ver custos
/permissions       # Ver/editar permissões
/sandbox           # Configurar sandbox
/rewind            # Desfazer mudanças
/chrome            # Chrome integration
/vim               # Vim mode
/output-style      # Trocar output style
/terminal-setup    # Setup terminal
/status            # Ver status
/tasks             # Ver tarefas em background
```

### CLI Flags

```bash
--model <alias>                    # Modelo a usar
--chrome                           # Habilitar Chrome
--print, -p                        # Headless mode
--continue, -c                     # Continuar última conversa
--resume <session_id>              # Resumir sessão específica
--output-format <format>           # text|json|stream-json
--allowedTools <tools>             # Auto-approve tools
--append-system-prompt <text>      # Adicionar ao system prompt
--dangerously-skip-permissions     # Bypass permissões (cuidado!)
--debug [filter]                   # Debug mode
```

---

## 🏆 BEST PRACTICES - RESUMO

### ✅ FAZER

1. **Use opusplan** para features complexas (melhor custo-benefício)
2. **Habilite auto-compact** (economiza tokens)
3. **Organize memória** em `.claude/rules/*.md`
4. **Use MCP servers** para dados externos
5. **Habilite sandbox** para segurança
6. **Monitore custos** com `/cost`
7. **Use checkpointing** para experimentos
8. **Configure statusline** para visibilidade
9. **Use Haiku para subagents** (economiza)
10. **Aproveite Chrome integration** para web tasks

### ⛔ EVITAR

1. **Não use** `any` types - prefira `unknown` + type guards
2. **Não desabilite** prompt caching (economiza muito)
3. **Não use** `--dangerously-skip-permissions` em repos não confiáveis
4. **Não cole** inputs gigantes - use arquivos
5. **Não ignore** security warnings
6. **Não esqueça** de fazer `/clear` entre tarefas não relacionadas
7. **Não confie** apenas em checkpointing - use Git
8. **Não exponha** secrets em logs ou configs

---

## 📚 RECURSOS ADICIONAIS

**Documentação Oficial:** https://code.claude.com/docs/en/

**GitHub:** https://github.com/anthropics/claude-code

**Changelog:** https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md

**Trust Center:** https://trust.anthropic.com

**HackerOne (Security):** https://hackerone.com/anthropic-vdp

**Community Plugins:** `/plugin marketplace add anthropics/claude-code`

---

## 🎯 PRÓXIMOS PASSOS

1. **Atualize para v2.1.3:** `claude update`
2. **Configure seu projeto:** `/init`
3. **Adicione MCP servers** relevantes
4. **Instale plugins** úteis
5. **Configure statusline** personalizada
6. **Habilite sandbox** para segurança
7. **Experimente Chrome integration**
8. **Otimize custos** com auto-compact
9. **Use opusplan** para desenvolvimento

---

**🚀 Happy Coding with Claude Code!**
