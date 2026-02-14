# Cursor + Claude Code Setup (Versão Pragmática)

⚠️ **Este documento substitui promessas teóricas por o que REALMENTE funciona.**

## O Que Funciona vs O Que Não Funciona

### ❌ NÃO FUNCIONA (Evite)

1. **Agentes automáticos via settings.json**
   - Cursor não dispara agentes automaticamente
   - "Sub-personalidades" são marketing, não realidade técnica
   - MCPs de agentes especializados são experimentais

2. **Comandos slash customizados (/verify, /typecheck)**
   - Não existem nativemente no Cursor
   - Você pode criar custom commands, mas é complexo
   - npm scripts são mais confiáveis

3. **Hooks automáticos sofisticados**
   - `PostToolUse` hooks geralmente não disparam
   - `PreCompact` hooks não funcionam fora do Composer
   - `Stop` hooks são limitados

**Workaround / cross-platform**: hooks resolvem automaticamente o `repo root` via `git rev-parse --show-toplevel` (compatível com macOS, Linux, Git Bash/WSL). Para pular a validação do `validate-bash.sh` em operações manuais documentadas, use `CLAUDE_SKIP_VALIDATE_BASH=1 <command>` — use com cautela e registre a razão no PR/log.

4. **MCPs em Produção**
   - Supabase MCP é experimental e instável
   - Memory Keeper é beta e exigente
   - Context7 pode falhar silenciosamente
   - Configuração é frágil e quebra facilmente

### ✅ O QUE REALMENTE FUNCIONA

1. **npm scripts diretos**

   ```bash
   npm run typecheck     # Roda TypeScript
   npm run lint:fix      # Corrige lint
   npm run test:watch    # Testes com watch
   npm run quality-gate  # Verificação completa
   ```

2. **Referências @agent via prompt**

   ```
   @type-checker por favor corrija os erros de TypeScript
   @component-builder crie um novo componente Badge
   ```

   (Claude entende o contexto mesmo sem "agentes reais")

3. **Integração Figma via MCP**
   - Funciona se habilitado (você tem acesso)
   - Excelente para design system

4. **Git + VS Code integrado**
   - Source control nativo funciona bem
   - Commits, branches, diffs sem problemas

5. **Terminal + Scripts bash/node**
   - Rodar scripts manualmente é 100% confiável
   - Melhor que hooks automáticos

---

## Setup Prático (Que Vai Funcionar)

### 1. Instalar Extensões Essenciais (VS Code/Cursor)

```bash
# Abrir Cursor e instalar via Extensions (Cmd+Shift+X):
- Prettier - Code formatter
- ESLint
- TypeScript Vue Plugin (Volar)
- ES7+ React/Redux/React-Native snippets
- Thunder Client ou REST Client (para APIs)
- GitLens
- GitHub Copilot (já com Cursor)
```

Ou via CLI:

```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension eamodio.gitlens
```

### 2. Configurar settings.json do Cursor/VSCode

**Arquivo:** `~/.config/Cursor/User/settings.json` (Mac) ou `%APPDATA%\Cursor\User\settings.json` (Win)

```json
{
  // Editor
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": false,

  // TypeScript
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,

  // Exclusões
  "files.exclude": {
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/.expo": true,
    "**/dist": true
  },

  "search.exclude": {
    "**/node_modules": true,
    "**/.expo": true,
    "**/dist": true
  },

  // Git
  "git.ignoreLimitWarning": true,
  "git.autofetch": true,

  // Cursor specific
  "cursor.ai.codeActions": true,
  "cursor.ai.autoIntegrateCompletions": true
}
```

### 3. Configurar Project Settings (No Repositório)

**Arquivo:** `.vscode/settings.json` (já criamos isso antes)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### 4. Criar Atalhos de Tarefas (Realmente Funcionam)

**Arquivo:** `.vscode/tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🔍 Typecheck",
      "type": "shell",
      "command": "npm",
      "args": ["run", "typecheck"],
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "✨ Lint Fix",
      "type": "shell",
      "command": "npm",
      "args": ["run", "lint:fix"],
      "problemMatcher": []
    },
    {
      "label": "✅ Quality Gate",
      "type": "shell",
      "command": "npm",
      "args": ["run", "quality-gate"],
      "problemMatcher": []
    },
    {
      "label": "🧪 Tests",
      "type": "shell",
      "command": "npm",
      "args": ["run", "test:watch"],
      "problemMatcher": [],
      "isBackground": true
    },
    {
      "label": "▶️ Start Expo",
      "type": "shell",
      "command": "npm",
      "args": ["start"],
      "problemMatcher": [],
      "isBackground": true
    }
  ]
}
```

**Como usar:** Cmd+Shift+B → Selecione tarefa → Execute

### 5. Keyboard Shortcuts (Atalhos Reais)

**Arquivo:** `~/.config/Cursor/User/keybindings.json` (Mac)

```json
[
  {
    "key": "cmd+shift+t",
    "command": "workbench.action.tasks.runTask",
    "args": "Typecheck"
  },
  {
    "key": "cmd+shift+l",
    "command": "workbench.action.tasks.runTask",
    "args": "Lint Fix"
  },
  {
    "key": "cmd+shift+g",
    "command": "workbench.action.tasks.runTask",
    "args": "Quality Gate"
  }
]
```

Agora você tem:

- `Cmd+Shift+T` → Typecheck
- `Cmd+Shift+L` → Lint Fix
- `Cmd+Shift+G` → Quality Gate

### 6. Prompt Templates (Para quando chamar Claude)

**Arquivo:** `.claude/prompt-templates.md`

```markdown
# Template: Corrigir Erros de TypeScript

Corrija todos os erros de TypeScript:

1. Primeiro rode: npm run typecheck
2. Leia a saída atentamente
3. Para cada erro, entenda a causa e corrija no código fonte
4. Use tipos explícitos, evite 'any'
5. Ao terminar, rode novamente para confirmar zero erros

# Template: Construir Componente

Construa um componente React Native seguindo estes passos:

1. Use apenas tokens de `src/theme/tokens.ts` para cores/tamanho
2. Adicione tipos TypeScript completos para as props
3. Adicione `accessibilityLabel` para acessibilidade
4. Se é atômico, coloque em `src/components/ui/`
5. Crie um arquivo `.test.tsx` com teste básico
6. Rode `npm run lint:fix` e `npm run typecheck` antes de terminar

# Template: Feature Completa

Implementar uma feature do zero:

1. Entenda o requisito (leia docs/user story)
2. Proponha arquitetura (quais arquivos/componentes)
3. Aguarde aprovação
4. Implemente em etapas pequenas
5. Rode `npm run quality-gate` antes de terminar
6. Crie testes se for lógica crítica
```

---

## MCPs Que Realmente Valem a Pena

### ✅ Figma MCP (Se você usa Figma)

```bash
npm install -g @modelcontextprotocol/server-figma
```

**Config:** `.claude/mcp-config.json`

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "seu_token_aqui"
      }
    }
  }
}
```

**Uso:** Arraste links Figma no chat do Cursor → Claude extrai designs

### ⚠️ Evitar Completamente

- Supabase MCP (quebra muito)
- Memory Keeper (experimental)
- Context7 (use web search do próprio Claude)
- Sequential Thinking MCP (use Ralph mentalmente)

---

## Scripts Reais Que Você Precisa

**Arquivo:** `scripts/dev-workflow.sh`

```bash
#!/bin/bash
set -e

echo "🔄 Starting Development Workflow..."

echo "1️⃣ Typecheck..."
npm run typecheck

echo "2️⃣ Lint + Fix..."
npm run lint:fix

echo "3️⃣ Format code..."
npm run format

echo "4️⃣ Running tests..."
npm run test:ci

echo "✅ All checks passed! Ready to commit."
```

**Uso:**

```bash
bash scripts/dev-workflow.sh
# Ou via npm se adicionar a package.json:
npm run workflow
```

---

## Workflow Real (Dia-a-dia)

### Cenário 1: Corrigir um Bug

```bash
# 1. Fazer a mudança no código
# 2. Rodar atalho
Cmd+Shift+T  # Typecheck

# 3. Se erros, usar Claude
"@type-checker corrija esses erros de TypeScript"

# 4. Depois
Cmd+Shift+L  # Lint fix

# 5. Commit
git add .
git commit -m "fix: corrigir bug XYZ"
```

### Cenário 2: Criar Novo Componente

```bash
# 1. Usar prompt template no Claude
# (copiar de .claude/prompt-templates.md)

# 2. Claude cria o componente

# 3. Você valida localmente
Cmd+Shift+T  # Typecheck
npm run ios  # Visualizar no simulador

# 4. Commit
git add src/components/ui/NovoComponente.tsx
git commit -m "feat: adicionar componente NovoComponente"
```

### Cenário 3: Antes de Push/PR

```bash
# 1. Rodar verificação completa
Cmd+Shift+G  # Quality Gate

# 2. Se tudo ok, push
git push origin feature/minha-feature

# 3. GitHub Actions roda CI automaticamente
```

---

## O Que Fazer Com Agentes (Pragmaticamente)

Esqueça "agentes automáticos". Use assim:

### Padrão: Invocar Claude com Contexto

```
@type-checker [colar prompt aqui]
[contexto técnico]
[código que precisa corrigir]
```

O Claude vai entender que é um contexto de "type checking" e responder apropriadamente.

### Os Agentes São Apenas Prompts

**Arquivo:** `.claude/agent-prompts.md`

```markdown
## @type-checker

Você é um especialista em TypeScript. Seu trabalho é:

- Identificar erros de tipo
- Propor correções mantendo lógica intacta
- Eliminar qualquer uso de 'any'
- Adicionar tipos faltantes

## @component-builder

Você é especialista em UI/React Native. Seu trabalho é:

- Construir componentes reutilizáveis
- Usar apenas design tokens
- Garantir acessibilidade
- Estruturar código limpo

## @code-reviewer

Você é revisor crítico. Seu trabalho é:

- Verificar se segue padrões do projeto
- Apontar anti-patterns
- Sugerir otimizações
- Validar segurança/privacidade
```

### Invocar assim:

```
Leia o prompt em .claude/agent-prompts.md (@code-reviewer)

Depois revise este código:
[colar código]
```

---

## Checklist Final (O Que Realmente Fazer)

- ✅ Instalar extensões VS Code essenciais
- ✅ Configurar `settings.json` do Cursor (global e projeto)
- ✅ Criar `.vscode/tasks.json` com atalhos
- ✅ Configurar atalhos de teclado (optional mas útil)
- ✅ Criar `.claude/prompt-templates.md`
- ✅ Criar `.claude/agent-prompts.md`
- ✅ Criar `scripts/dev-workflow.sh`
- ✅ Usar npm scripts em vez de hooks complexos
- ✅ Invocar Claude com contexto claro
- ✅ Rodar `npm run quality-gate` antes de push

**NÃO fazer:**

- ❌ Configurar MCPs experimentais (Supabase, Memory Keeper)
- ❌ Esperar hooks automáticos funcionarem
- ❌ Contar com agentes "sub-personalidades"
- ❌ Usar comandos slash customizados complexos

---

## Resultado

Com essa abordagem pragmática você terá:

- **Fluxo confiável** (sem dependências frágeis)
- **Atalhos reais** que funcionam (Cmd+Shift+T, etc.)
- **Claude integrado** de forma eficaz (prompts bons)
- **Zero frustração** (nada quebra do nada)

Simples, funcional, e que realmente funciona. 🚀
