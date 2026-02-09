# Cursor Setup Completo - MacBook M1 8GB

Guia completo de configuração do Cursor IDE para desenvolvimento no MacBook M1 8GB.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Setup Automático](#setup-automático)
3. [Configuração Manual](#configuração-manual)
4. [Atalhos Principais](#atalhos-principais)
5. [Otimizações M1 8GB](#otimizações-m1-8gb)
6. [MCP Servers](#mcp-servers)
7. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

### Software Necessário

- **macOS** (qualquer versão recente)
- **Node.js 18+** (`brew install node`)
- **npm** (vem com Node.js)
- **Cursor IDE** ([cursor.sh](https://cursor.sh))

### Verificar Instalações

```bash
node -v    # Deve mostrar v18.x ou superior
npm -v     # Deve mostrar versão do npm
cursor --version  # Após instalar CLI do Cursor
```

---

## Setup Automático

### 1. Instale as Dependências do Projeto

**⚠️ IMPORTANTE:** Execute isso primeiro antes de qualquer outra coisa:

```bash
npm install
```

Isso instalará todas as dependências necessárias, incluindo:

- ESLint e plugins
- Tailwind CSS
- TypeScript
- Expo e React Native
- E todas as outras dependências do projeto

**Aguarde a instalação completar** (pode levar alguns minutos dependendo da conexão).

### 2. Execute o Script de Setup

```bash
bash scripts/setup-cursor-mac.sh
```

Este script irá:

- ✅ Verificar dependências (Node.js, npm)
- ✅ Verificar arquivos de configuração
- ✅ Validar formato macOS (npx ao invés de cmd)
- ✅ Verificar otimizações M1 8GB
- ✅ Verificar regras .mdc
- ✅ Verificar código (console.log, any types)

### 3. Configure Variáveis de Ambiente

Adicione ao `~/.zshrc`:

```bash
# Supabase
export SUPABASE_DB_URL="postgresql://..."
export SUPABASE_ACCESS_TOKEN="sbp_..."

# Recarregue o shell
source ~/.zshrc
```

### 4. Instale o Cursor CLI

No Cursor:

1. `Cmd+Shift+P` → "Shell Command: Install 'cursor' command in PATH"
2. Feche e reabra o terminal

### 5. Ative os MCP Servers

No Cursor:

1. `Cmd+Shift+P` → "MCP: Enable Servers"
2. Aguarde a inicialização

### 6. Reinicie o Cursor

`Cmd+Shift+P` → "Developer: Reload Window"

---

## Configuração Manual

### Arquivos Criados

| Arquivo                    | Descrição                                              |
| -------------------------- | ------------------------------------------------------ |
| `.cursorrules`             | Regras do projeto (TypeScript, logging, design system) |
| `.mcp.json`                | Configuração dos MCP Servers                           |
| `.claude/settings.json`    | Configurações do Claude Code                           |
| `.claude/statusline.sh`    | Script de status line (bash)                           |
| `.vscode/settings.json`    | Configurações do editor (otimizado M1)                 |
| `.vscode/keybindings.json` | Atalhos de teclado Mac                                 |
| `.vscode/extensions.json`  | Extensões recomendadas                                 |

### Verificar Configuração

```bash
bash scripts/verify-cursor-setup.sh
```

---

## Atalhos Principais

### Cursor AI

| Atalho        | Função                          |
| ------------- | ------------------------------- |
| `Cmd+L`       | Abrir Cursor Chat               |
| `Cmd+Shift+A` | Abrir Cursor Chat (alternativo) |
| `Cmd+Shift+C` | Abrir Cursor Chat (alternativo) |

### Navegação

| Atalho        | Função                     |
| ------------- | -------------------------- |
| `Cmd+P`       | Quick Open (arquivos)      |
| `Cmd+Shift+P` | Command Palette            |
| `Cmd+Shift+O` | Ir para símbolo no arquivo |
| `F12`         | Ir para definição          |
| `Shift+F12`   | Mostrar referências        |
| `Cmd+K Cmd+I` | Mostrar hover              |

### Editor

| Atalho          | Função                        |
| --------------- | ----------------------------- |
| `Cmd+D`         | Selecionar próxima ocorrência |
| `Cmd+Shift+L`   | Selecionar todas ocorrências  |
| `Alt+↑/↓`       | Mover linha                   |
| `Shift+Alt+↑/↓` | Copiar linha                  |
| `Cmd+Shift+K`   | Deletar linha                 |
| `Cmd+/`         | Comentar linha                |
| `Shift+Alt+A`   | Comentar bloco                |

### Layout

| Atalho        | Função             |
| ------------- | ------------------ |
| `Cmd+B`       | Toggle Sidebar     |
| `Cmd+J`       | Toggle Terminal    |
| `Cmd+Shift+E` | Explorer           |
| `Cmd+Shift+F` | Buscar em arquivos |
| `Cmd+Shift+G` | Source Control     |
| `Cmd+Shift+D` | Debug              |

### Tasks

| Atalho        | Função       |
| ------------- | ------------ |
| `Cmd+Shift+T` | Typecheck    |
| `Cmd+Shift+L` | Lint Fix     |
| `Cmd+Shift+Q` | Quality Gate |

### Terminal

| Atalho         | Função          |
| -------------- | --------------- |
| `Ctrl+\``      | Toggle Terminal |
| `Cmd+Shift+\`` | Novo Terminal   |
| `Cmd+K`        | Limpar terminal |

---

## Otimizações M1 8GB

### TypeScript Server

```json
"typescript.tsserver.maxTsServerMemory": 1536  // 1.5GB (limite para 8GB RAM)
```

### File Watchers

Excluídos para economizar recursos:

- `node_modules`
- `.expo`
- `dist`, `build`
- `ios/Pods`
- `android/.gradle`
- `.metro-cache`

### Editor

```json
"editor.minimap.enabled": false              // Economiza GPU
"editor.smoothScrolling": false               // Economiza GPU
"editor.cursorSmoothCaretAnimation": "off"   // Economiza CPU
```

### Auto-imports Desabilitados

```json
"typescript.preferences.includePackageJsonAutoImports": "off"
"typescript.suggest.autoImports": false
```

### Git Decorations Desabilitados

```json
"git.decorations.enabled": false  // Economiza CPU
```

---

## MCP Servers

### Configurados (macOS)

| Server                  | Comando                                                | Descrição                               |
| ----------------------- | ------------------------------------------------------ | --------------------------------------- |
| **expo-mcp**            | HTTP                                                   | Expo MCP Server para builds iOS/Android |
| **supabase**            | `npx @supabase/mcp-server`                             | Migrations, RLS, edge functions         |
| **memory-keeper**       | `npx @modelcontextprotocol/server-memory`              | Persistência de contexto                |
| **sequential-thinking** | `npx @modelcontextprotocol/server-sequential-thinking` | Pensamento sequencial                   |
| **context7**            | `npx @upstash/context7-mcp`                            | Documentação atualizada                 |
| **playwright-browser**  | `npx @playwright/mcp@latest`                           | Visual testing                          |

### Variáveis de Ambiente Necessárias

```bash
export SUPABASE_DB_URL="postgresql://..."
export SUPABASE_ACCESS_TOKEN="sbp_..."
```

---

## Regras do Projeto (.cursorrules)

### TypeScript Strict

- ✅ Zero `any` types
- ✅ Zero `@ts-ignore` sem justificativa
- ✅ TypeScript strict mode sempre habilitado

### Logging

- ✅ Proibido `console.log`
- ✅ Usar `logger.*` de `src/utils/logger.ts`

### Design System

- ✅ Proibido cores hardcoded
- ✅ Usar `Tokens.*` ou `useThemeColors()`

### Acessibilidade

- ✅ WCAG AAA (contraste 7:1)
- ✅ Touch targets ≥ 44pt
- ✅ `accessibilityLabel` obrigatório

---

## Troubleshooting

### Cursor CLI não encontrado

```bash
# No Cursor:
Cmd+Shift+P → "Shell Command: Install 'cursor' command in PATH"
```

### MCP Servers não inicializam

1. Verifique variáveis de ambiente:

   ```bash
   echo $SUPABASE_DB_URL
   echo $SUPABASE_ACCESS_TOKEN
   ```

2. Recarregue o Cursor:
   - No Cursor: `Cmd+Shift+P` → "Developer: Reload Window"

### Tailwind CSS IntelliSense não funciona

**Erro:** `node_modules doesn't exist or is not a directory`

1. **Instale as dependências do projeto:**

   ```bash
   npm install
   ```

2. **Aguarde a instalação completar** (pode levar alguns minutos)

3. **Recarregue o Cursor:**
   - No Cursor: `Cmd+Shift+P` → "Developer: Reload Window"

4. **Se ainda não funcionar, reinicie o Tailwind Server:**
   - No Cursor: `Cmd+Shift+P` → "Tailwind CSS: Restart IntelliSense"

5. **Verifique o Output do Tailwind:**
   - `Cmd+Shift+P` → "View: Show Output" → Selecione "Tailwind CSS IntelliSense"

**Nota:** O Tailwind CSS IntelliSense precisa do `node_modules` instalado para funcionar corretamente.

### ESLint não está rodando

1. **Instale as dependências primeiro:**

   ```bash
   npm install
   ```

2. Verifique se a extensão ESLint está instalada:
   - `Cmd+Shift+X` → Procure "ESLint" → Instale `dbaeumer.vscode-eslint`

3. Verifique a configuração no `.vscode/settings.json`:

   ```json
   "eslint.enable": true,
   "eslint.useFlatConfig": true,
   "eslint.probe": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
   ```

4. Reinicie o ESLint Server:
   - No Cursor: `Cmd+Shift+P` → "ESLint: Restart ESLint Server"

5. Verifique se o arquivo `eslint.config.js` existe na raiz do projeto

6. Se ainda não funcionar, verifique o Output do ESLint:
   - `Cmd+Shift+P` → "View: Show Output" → Selecione "ESLint"

### TypeScript Server lento

1. Verifique memória configurada:

   ```json
   "typescript.tsserver.maxTsServerMemory": 1536
   ```

2. Feche arquivos não utilizados
3. Reinicie o TypeScript Server:
   - No Cursor: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### Arquivos não encontrados

Execute o setup novamente:

```bash
bash scripts/setup-cursor-mac.sh
```

### Verificar configuração completa

```bash
bash scripts/verify-cursor-setup.sh
```

---

## Extensões Recomendadas

Instale via `Cmd+Shift+X`:

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **Expo Tools** (`expo.vscode-expo-tools`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **GitLens** (`eamodio.gitlens`)

Ou instale todas de uma vez:

```bash
cat .vscode/extensions.json | grep -o '"[^"]*"' | xargs -I {} cursor --install-extension {}
```

---

## Comandos Úteis

### Validação

```bash
npm run validate          # Validação rápida
npm run validate:full     # Validação completa
npm run quality-gate      # Quality gate completo
```

### TypeScript

```bash
npm run typecheck         # Verificar tipos
npm run lint              # Lint
npm run lint:fix          # Auto-fix lint
```

### Build

```bash
npm run build:preview     # Build preview
npm run build:prod        # Build produção
```

---

## Status da Configuração

Execute para verificar tudo:

```bash
bash scripts/verify-cursor-setup.sh
```

Resultado esperado:

- ✅ Todos os arquivos presentes
- ✅ Formato macOS correto (npx, bash)
- ✅ Otimizações M1 aplicadas
- ✅ MCP Servers configurados
- ✅ Regras .mdc ativas

---

## Próximos Passos

1. ✅ Setup completo executado
2. ✅ Variáveis de ambiente configuradas
3. ✅ Cursor CLI instalado
4. ✅ MCP Servers ativados
5. ✅ Cursor reiniciado

**🍼 Pronto para desenvolver!**

---

## Referências

- [Cursor Documentation](https://docs.cursor.com)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)

---

**Última atualização:** 10 de janeiro de 2025
