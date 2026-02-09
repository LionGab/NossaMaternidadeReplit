# Integração iTerm2 + Claude Code - NossaMaternidade

> Configuração avançada de produtividade para desenvolvimento iOS/Android com React Native + Expo

---

## 🚀 Quick Start

```bash
# 1. Executar launcher iTerm2 (abre 5 tabs automaticamente)
osascript /tmp/launch-nossamaternidade.scpt

# 2. Importar perfil iTerm2 otimizado
# iTerm2 > Preferences > Profiles > Other Actions > Import JSON Profiles
# Selecione: /tmp/NossaMaternidade_iTerm_Profile.json

# 3. Iniciar Claude Code em cada tab (já está nos scripts)
# Apenas pressione Enter em cada tab
```

---

## 📋 Estrutura das 5 Tabs

### Tab 1: 🎯 Feature Development

**Propósito**: Desenvolver novas features, componentes, screens

**Comandos úteis**:

```bash
npm start                # Expo dev server
npm run typecheck        # Validate TypeScript
npm run test -- --watch  # Tests em watch mode
npm run lint:fix         # Fix ESLint
```

**Quando usar**:

- Criar novo screen ou component
- Adicionar feature ao app
- Refatorar código existente
- Trabalhar em UI/UX

---

### Tab 2: 🐛 Debug & Test

**Propósito**: Debugging, testes, correção de bugs

**Comandos úteis**:

```bash
npm test                 # Run all tests
npm run test:coverage    # Coverage report
npm run nm:doctor        # Health check do projeto
npm run clean            # Limpar cache
```

**Quando usar**:

- Investigar e corrigir bugs
- Escrever testes unitários
- Executar test suite completa
- Resolver problemas de build

---

### Tab 3: 📦 Build & Deploy

**Propósito**: Builds locais e remotos, deploys, quality gates

**Comandos úteis**:

```bash
npm run quality-gate          # OBRIGATÓRIO antes de build
npm run build:dev:ios         # Dev build iOS
npm run build:prod:ios        # Production iOS
npm run build:prod:android    # Production Android
npm run gate:0                # Full release gates (G-1 → G7)
npm run submit:prod:ios       # Submit para App Store
npm run submit:prod:android   # Submit para Play Store
```

**Quando usar**:

- Preparar builds para teste
- Executar quality gates
- Deploy para TestFlight/Play Console
- Verificar configuração de release

---

### Tab 4: 🗄️ Database & Backend

**Propósito**: Trabalho com Supabase, Edge Functions, database migrations

**Comandos úteis**:

```bash
npm run generate-types        # Regenerate Supabase types
npm run verify-backend        # Verify RLS policies
npm run deploy-functions      # Deploy Edge Functions
npm run test:gemini           # Test Gemini AI key
npm run test:oauth            # Test OAuth providers
```

**Quando usar**:

- Modificar schema do banco
- Criar/atualizar Edge Functions
- Testar integrações (AI, OAuth)
- Verificar segurança (RLS)

---

### Tab 5: 📊 Monitoring & Logs

**Propósito**: Monitoramento, logs, status do projeto

**Comandos úteis**:

```bash
npm run monitor:ram           # Monitor RAM usage
npm run tokens:watch          # Watch token usage
npm run nm:status             # Check project status
npm run build:list            # List EAS builds
npm run check-disk            # Check disk usage
```

**Quando usar**:

- Monitorar recursos do sistema
- Ver status de builds EAS
- Acompanhar uso de tokens Claude
- Diagnosticar problemas de performance

---

## 🎯 Claude Code Hooks Automáticos

### SessionStart Hook

**Quando**: Toda vez que você inicia o Claude Code

**O que faz**:

- ✅ Verifica Node.js, Bun, Expo CLI versions
- ✅ Valida .env.local e variáveis obrigatórias
- ✅ Verifica node_modules
- ✅ Mostra comandos úteis contextualizados
- ✅ Define environment variables para a sessão

**Localização**: `.claude/hooks/session-start.sh`

---

### PreToolUse(Bash) Hook

**Quando**: Antes de executar qualquer comando Bash

**O que faz**:

- ❌ **BLOQUEIA** comandos destrutivos (`rm -rf /`, `dd if=`, etc.)
- ⚠️ **AVISA** antes de builds de produção sem quality-gate
- ⚠️ **AVISA** ao modificar arquivos de configuração críticos

**Localização**: `.claude/hooks/validate-bash.sh`

**Padrões bloqueados**:

```bash
rm -rf /
rm -rf ~
rm -rf .
> /dev/
dd if=
mkfs
format
:(){:|:& };:
```

---

### PreToolUse(Write|Edit) Hook

**Quando**: Antes de criar ou editar arquivos

**O que faz**:

- ❌ **BLOQUEIA** edições em arquivos gerados (supabase/types/, _.generated._)
- ⚠️ **AVISA** ao editar node_modules (sugere patch-package)
- ⚠️ **AVISA** ao modificar .env\* files
- ⚠️ **AVISA** ao modificar app.json/eas.json (IMMUTABLE CONSTANTS)

**Localização**: `.claude/hooks/pre-edit-check.sh`

---

### PostToolUse(Write|Edit) Hook

**Quando**: Após criar ou editar arquivos

**O que faz**:

- ✅ **AUTO-FORMATA** com Prettier (TypeScript, JavaScript, JSON, Markdown)
- ✅ Executa apenas nos arquivos modificados (rápido)

**Localização**: `.claude/hooks/post-edit-format.sh`

**Extensões formatadas**: `ts`, `tsx`, `js`, `jsx`, `json`, `md`, `mdx`

---

### Stop Hook

**Quando**: Antes do Claude parar de responder

**O que faz**:

- 🔍 Executa `npm run typecheck` se há arquivos TS/JS modificados
- ⚠️ Avisa se há erros de TypeScript
- ⚠️ Avisa se há arquivos staged mas não committed
- ⚠️ **NÃO BLOQUEIA**, apenas informa

**Localização**: `.claude/hooks/pre-stop-check.sh`

---

### UserPromptSubmit Hook

**Quando**: Ao enviar um prompt para Claude

**O que faz**:

- 📦 Adiciona contexto de build/deploy se prompt menciona "build", "production", etc.
- 🧪 Adiciona contexto de testes se prompt menciona "test", "jest", etc.
- 📘 Adiciona contexto TypeScript se prompt menciona "type", "typescript", etc.
- 🎨 Adiciona contexto de design system se prompt menciona "color", "theme", etc.

**Localização**: `.claude/hooks/prompt-context.sh`

---

## 🔧 Troubleshooting

### Hooks não estão executando

```bash
# 1. Verificar permissões
chmod +x .claude/hooks/*.sh

# 2. Testar hook manualmente
echo '{"session_id": "test"}' | .claude/hooks/session-start.sh

# 3. Verificar sintaxe do settings.json
cat .claude/settings.json | python -m json.tool
```

### Launcher iTerm2 não funciona

```bash
# 1. Verificar permissão
chmod +x /tmp/launch-nossamaternidade.scpt

# 2. Executar com debug
osascript -l JavaScript -i /tmp/launch-nossamaternidade.scpt

# 3. Se falhar, abrir manualmente no Script Editor
open -a "Script Editor" /tmp/launch-nossamaternidade.scpt
```

### Prettier falhando após edições

```bash
# Reinstalar dependências
npm install prettier prettier-plugin-tailwindcss --save-dev

# Testar manualmente
npx prettier --write src/components/Button.tsx
```

---

## ⚡ Workflow Recomendado

### Desenvolvimento de Feature

1. **Tab 1** (Feature Dev): Desenvolver a feature
2. **Tab 2** (Debug & Test): Escrever e rodar testes
3. **Tab 1**: Refinar baseado nos testes
4. **Tab 3** (Build): Executar `npm run quality-gate`

### Correção de Bug

1. **Tab 2** (Debug & Test): Reproduzir e investigar
2. **Tab 1** (Feature Dev): Corrigir o código
3. **Tab 2**: Validar com testes
4. **Tab 3**: Quality gate antes de commit

### Deploy para Produção

1. **Tab 3** (Build & Deploy): `npm run gate:0` (todos os gates)
2. **Tab 4** (Database): `npm run verify-backend` (RLS OK)
3. **Tab 3**: `npm run build:prod:ios` / `npm run build:prod:android`
4. **Tab 5** (Monitoring): `npm run build:list` (acompanhar build)
5. **Tab 3**: `npm run submit:prod:ios` / `npm run submit:prod:android`

### Trabalho com Database

1. **Tab 4** (Database): Modificar schema / Edge Functions
2. **Tab 4**: `npm run generate-types` (atualizar tipos)
3. **Tab 1** (Feature Dev): Usar os novos tipos
4. **Tab 2** (Debug & Test): Testar integração

---

## 🎨 Personalização

### Alterar cores do perfil iTerm2

1. iTerm2 > Preferences > Profiles > NossaMaternidade - RN Dev
2. Colors > Color Presets > Import...
3. Ou editar manualmente: `/tmp/NossaMaternidade_iTerm_Profile.json`

### Adicionar novos hooks

1. Criar script: `.claude/hooks/meu-hook.sh`
2. Tornar executável: `chmod +x .claude/hooks/meu-hook.sh`
3. Adicionar em `.claude/settings.json`:

```json
"hooks": {
  "EventName": [
    {
      "matcher": "ToolPattern",
      "hooks": [
        {
          "type": "command",
          "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/meu-hook.sh",
          "timeout": 10
        }
      ]
    }
  ]
}
```

### Modificar launcher iTerm2

Edite `/tmp/launch-nossamaternidade.scpt` para:

- Adicionar/remover tabs
- Mudar comandos iniciais
- Ajustar nomes das tabs

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [Claude Code Hooks](https://code.claude.com/docs/en/hooks)
- [iTerm2 Documentation](https://iterm2.com/documentation.html)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

### Arquivos do Projeto

- `CLAUDE.md` - Guia principal do projeto
- `.claude/settings.json` - Configuração Claude Code
- `docs/claude/` - Documentação detalhada
- `scripts/` - Scripts de validação e build

---

## 🆘 Suporte

**Project Lead**: Lion (eugabrielmktd@gmail.com)
**Creator**: Nathalia Valente

---

_Última atualização: Janeiro 2026_
_Versão iTerm Integration: 1.0_
