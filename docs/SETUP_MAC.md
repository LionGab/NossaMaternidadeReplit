# Setup macOS — Nossa Maternidade

> Guia completo de configuração do ambiente de desenvolvimento no macOS (testado em MacBook Air 2020 8GB RAM).

---

## Pré-requisitos

### 1. Xcode Command Line Tools

```bash
xcode-select --install
```

### 2. Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 3. Node.js (via Homebrew ou nvm)

```bash
# Opção 1: Via Homebrew
brew install node

# Opção 2: Via nvm (recomendado)
brew install nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install 20
nvm use 20
```

### 4. Watchman

```bash
brew install watchman
```

### 5. CocoaPods (para iOS)

```bash
sudo gem install cocoapods
```

### 6. Docker (para MCP servers locais)

```bash
brew install --cask docker
```

---

## Instalar Dependências do Projeto

```bash
cd NossaMaternidadeReplit
npm install
```

---

## Configurar Cursor IDE

### 1. Instalar Cursor

Baixe em: https://cursor.sh/

### 2. Instalar Cursor CLI

1. Abra o Cursor
2. Cmd+Shift+P → "Shell Command: Install 'cursor' command in PATH"
3. Teste: `cursor --version`

### 3. Extensões Recomendadas

**Para MacBook Air 2020 (8GB RAM)**, recomendamos **apenas 3 extensões**:

| Extensão                      | ID                          | Motivo                                        |
| ----------------------------- | --------------------------- | --------------------------------------------- |
| **ESLint**                    | `dbaeumer.vscode-eslint`    | Obrigatório: lint em tempo real, quality gate |
| **Prettier**                  | `esbenp.prettier-vscode`    | Obrigatório: formatação com plugin Tailwind   |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Recomendado: autocomplete NativeWind          |

**Instalar via CLI**:

```bash
cursor --install-extension dbaeumer.vscode-eslint
cursor --install-extension esbenp.prettier-vscode
cursor --install-extension bradlc.vscode-tailwindcss
```

**Ou aceitar recomendações**: Ao abrir o projeto, clique em "Install All" no pop-up de recomendações.

**Guia completo**: [docs/CURSOR_EXTENSIONS_8GB.md](CURSOR_EXTENSIONS_8GB.md)

### 4. Configurações de Desempenho

Os arquivos `.vscode/settings.json` e `.vscode/extensions.json` já estão configurados com:

- TypeScript memory limit: 1GB (ideal para 8GB RAM)
- Minimap desabilitado
- File watchers excluindo `node_modules`, `.expo`, `build`

**Verificar configuração**:

```bash
bash scripts/setup/setup-cursor-mac.sh
```

---

## Configurar MCP Servers

MCP (Model Context Protocol) permite que o Cursor acesse serviços externos (Expo, GitHub, etc.).

### Arquivo `.cursor/mcp.json`

O repositório já tem configuração para:

- **expo-mcp**: EAS Build, submit, docs
- **context7**: Documentação de bibliotecas
- **xcode-mcp**: Simuladores iOS
- **github**: Repos, issues, PRs (remoto via OAuth ou PAT)

### Ativar MCP Servers

1. Reinicie o Cursor após clonar o repo
2. Os servidores serão carregados automaticamente
3. Para GitHub: faça login via OAuth quando solicitado

**Guia completo**: [docs/setup/MCP_SETUP.md](setup/MCP_SETUP.md)

---

## Variáveis de Ambiente

### 1. Criar `.env` na raiz do projeto

```bash
cp .env.example .env
```

### 2. Preencher com valores reais

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon

# Gemini AI (NathIA)
GEMINI_API_KEY=sua-chave-gemini

# RevenueCat (IAP)
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=sua-chave-ios
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=sua-chave-android

# Sentry (opcional)
SENTRY_DSN=seu-dsn
SENTRY_AUTH_TOKEN=seu-token
```

### 3. Exportar variáveis para scripts

Adicione ao `~/.zshrc`:

```bash
# Supabase CLI (para generate-types, migrations)
export SUPABASE_DB_URL="postgresql://..."
export SUPABASE_ACCESS_TOKEN="sbp_..."
```

Recarregue:

```bash
source ~/.zshrc
```

**Verificar**:

```bash
npm run check-env
```

---

## Configurar iOS (Xcode)

### 1. Instalar Xcode

Via App Store (>15GB, demora muito).

### 2. Aceitar licença

```bash
sudo xcodebuild -license accept
```

### 3. Instalar pods

```bash
cd ios
pod install
cd ..
```

### 4. Listar simuladores

```bash
npm run simulator:list
```

---

## Quality Gate (Obrigatório antes de PR/build)

Rode antes de qualquer commit ou build:

```bash
npm run quality-gate
```

**O que verifica**:

- TypeScript: sem erros, sem `any`, sem `@ts-ignore` injustificado
- ESLint: sem `console.log` em `src/`, sem cores hardcoded
- Build: `expo export` sem erros

---

## Executar o App

### Dev server

```bash
npm start
```

### iOS (dev client)

```bash
npm run ios
```

### Android (dev client)

```bash
npm run android
```

### Web (preview)

```bash
npm run web
```

---

## Scripts Úteis

| Comando                  | Descrição                        |
| ------------------------ | -------------------------------- |
| `npm run quality-gate`   | TypeCheck + ESLint + Build check |
| `npm run typecheck`      | Verificar erros TypeScript       |
| `npm run lint`           | Executar ESLint                  |
| `npm run lint:fix`       | Auto-fix ESLint                  |
| `npm run format`         | Formatar código com Prettier     |
| `npm test`               | Executar testes                  |
| `npm run clean`          | Limpar cache Expo/Metro          |
| `npm run generate-types` | Regenerar tipos Supabase         |

---

## Builds de Produção

### iOS TestFlight

```bash
# Verificar pré-requisitos
npm run release:preflight:ios-testflight

# Build via EAS
npx eas-cli build --platform ios --profile ios_testflight
```

**Guia completo**: [docs/release/TESTFLIGHT_BUILD_GUIDE.md](release/TESTFLIGHT_BUILD_GUIDE.md)

---

## Troubleshooting

### "Cannot find module '@/\*'"

```bash
npm run clean
npm install
```

### "TypeScript server is out of memory"

Verifique que `.vscode/settings.json` tem `typescript.tsserver.maxTsServerMemory: 1024`.

### "Metro bundler failed"

```bash
npm run start:clear
```

### "Pod install failed"

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

### "Xcode build failed"

```bash
npm run clean:ios
```

---

## Recursos

- [QUICKSTART.md](../QUICKSTART.md) — Início rápido (10min)
- [CURSOR_EXTENSIONS_8GB.md](CURSOR_EXTENSIONS_8GB.md) — Extensões para 8GB RAM
- [CLAUDE.md](../CLAUDE.md) — Guia para Claude/Cursor Agent
- [AGENTS.md](../AGENTS.md) — Fluxo de build iOS
- [docs/setup/MCP_SETUP.md](setup/MCP_SETUP.md) — MCP servers

---

**Última atualização**: 2026-02-11  
**Hardware testado**: MacBook Air 2020, 8GB RAM, Apple Silicon M1
