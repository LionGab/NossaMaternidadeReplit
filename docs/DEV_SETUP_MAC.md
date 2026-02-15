# Dev Setup — macOS — Nossa Maternidade

> Guia oficial para configurar ambiente de desenvolvimento no **macOS** (Apple Silicon e Intel).
> Última atualização: 14 de fevereiro de 2026

---

## Pré-requisitos

- macOS 12 Monterey ou superior (14 Sonoma recomendado)
- 8GB+ RAM (16GB recomendado para Apple Silicon M1/M2)
- 30GB+ espaço em disco (inclui Xcode)
- Apple ID (para App Store e Developer)

---

## 1. Xcode & Command Line Tools

### 1.1 Instalar Xcode

1. **App Store** → Buscar "Xcode" → **Instalar** (15+ GB, ~30min)
2. **Abrir Xcode** → Aceitar licença → Instalar componentes adicionais
3. **Verificar**:
   ```bash
   xcode-select -p
   # ✅ /Applications/Xcode.app/Contents/Developer
   ```

### 1.2 Instalar Command Line Tools

```bash
xcode-select --install
# ✅ Popup aparece → Instalar
```

### 1.3 Aceitar Licença

```bash
sudo xcodebuild -license accept
```

---

## 2. Homebrew (Package Manager)

### 2.1 Instalar Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2.2 Adicionar ao PATH (Apple Silicon M1/M2)

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 2.3 Verificar

```bash
brew --version
# ✅ Homebrew 4.x+
```

---

## 3. Git

### 3.1 Instalar Git

```bash
brew install git
```

### 3.2 Configurar Git

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
git config --global init.defaultBranch main
```

---

## 4. Node.js

### 4.1 Instalar `fnm` (Fast Node Manager)

```bash
# Instalar fnm via Homebrew
brew install fnm

# Adicionar ao shell (~/.zshrc para zsh)
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc
```

### 4.2 Instalar Node.js v20 LTS

```bash
fnm install 20
fnm use 20
fnm default 20

# Verificar
node --version
# ✅ v20.19.4 (ou superior v20.x)

npm --version
# ✅ 10.x+
```

---

## 5. Expo & EAS CLI

```bash
# 5.1 Instalar Expo CLI globalmente
npm install -g expo-cli

# 5.2 Instalar EAS CLI (para builds cloud)
npm install -g eas-cli

# 5.3 Verificar
expo --version
eas --version
```

---

## 6. Clonar Repositório

```bash
# 6.1 Clonar repo
git clone https://github.com/LionGab/NossaMaternidadeReplit.git
cd NossaMaternidadeReplit

# 6.2 Instalar dependências
npm ci

# 6.3 Validar instalação
npm run quality-gate
# ✅ TypeScript OK
# ✅ ESLint OK
# ✅ Build-readiness OK
```

---

## 7. Configurar Variáveis de Ambiente

### 7.1 Criar `.env.local`

```bash
# NÃO versionar .env.local (já está no .gitignore)
cp .env.example .env.local
```

### 7.2 Preencher `.env.local`

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://lqahkqfpynypbmhtffyi.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<seu-anon-key>

# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_qYAhdJlewUtgaKBDWEAmZsCRIqK
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_YSHALitkRyhugtDvYVVQVmqrqDu

# AI (Gemini)
EXPO_PUBLIC_GEMINI_API_KEY=<seu-gemini-key>

# Environment
EXPO_PUBLIC_ENV=development
```

⚠️ **Nunca commitar `.env.local`!**

---

## 8. Iniciar Dev Server

```bash
# 8.1 Iniciar Expo
npm start

# OU com cache limpo
npm run start:clear

# 8.2 Abrir no Simulador iOS
# - Pressionar 'i' no terminal
# - OU: npm run ios

# 8.3 Abrir no dispositivo físico
# - Instalar App "Expo Go" (App Store)
# - Escanear QR code no terminal
```

---

## 9. iOS Simulator (Opcional para desenvolvimento)

### 9.1 Abrir Simulator

```bash
# Via Xcode
open -a Simulator

# OU via linha de comando
xcrun simctl list devices
# Escolher device e abrir
```

### 9.2 Instalar App no Simulator

```bash
# Com Expo rodando, pressionar:
i  # Abre no iOS Simulator
```

---

## 10. Workflow de Desenvolvimento

### 10.1 Criar feature branch

```bash
git checkout -b feat/minha-feature
```

### 10.2 Desenvolver

```bash
# Rodar testes em watch mode
npm test -- --watch

# TypeCheck contínuo
npm run typecheck
```

### 10.3 Validar antes de commit

```bash
# Quality gate (obrigatório!)
npm run quality-gate

# Se passar, commitar
git add .
git commit -m "feat: minha feature"
git push origin feat/minha-feature
```

---

## 11. Otimização (Apple Silicon M1/M2 com 8GB RAM)

### 11.1 Limitar workers do Metro

```bash
# Usar npm script otimizado
npm run start:memory
# Define METRO_MAX_WORKERS=2
```

### 11.2 Fechar apps em background

- **Quit** (⌘Q): Chrome, Slack, Discord durante desenvolvimento
- **Activity Monitor** → Ordenar por Memory → Force Quit apps pesados

### 11.3 Limpar caches regularmente

```bash
npm run clean              # Limpa todos os caches
npx expo start --clear     # Limpa cache Metro
```

### 11.4 Restart Dock e Finder (se sistema lento)

```bash
killall Dock
killall Finder
```

---

## 12. Build Local iOS (Opcional)

**Nota**: **Não recomendado** para produção. Usar **EAS Cloud** (ver [RELEASE_TESTFLIGHT.md](RELEASE_TESTFLIGHT.md)).

### 12.1 Pré-requisitos

- macOS (não funciona em Windows/Linux)
- Xcode instalado
- Apple Developer Account

### 12.2 Build local

```bash
# Gerar projeto iOS nativo
npx expo prebuild --platform ios --clean

# Abrir no Xcode
open ios/NossaMaternidade.xcworkspace

# OU build via CLI (não recomendado)
eas build --platform ios --profile development --local
```

⚠️ **Para TestFlight/App Store, sempre usar EAS Cloud Build**.

---

## 13. Troubleshooting macOS

### 13.1 Erro: `xcrun: error: SDK "iphoneos" cannot be located`

**Causa**: Xcode Command Line Tools desconfigurado.

**Solução**:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

### 13.2 Erro: `CocoaPods not found`

**Causa**: CocoaPods não instalado (necessário para iOS).

**Solução**:

```bash
sudo gem install cocoapods
pod --version
```

### 13.3 Metro bundler lento (M1/M2 8GB)

**Causa**: Rosetta 2 overhead ou RAM limitada.

**Solução**:

```bash
# 1. Verificar se Node está rodando nativo (não Rosetta)
file $(which node)
# ✅ Deve mostrar: Mach-O 64-bit executable arm64

# 2. Se mostrar x86_64, reinstalar Node nativo
fnm install 20 --arch arm64

# 3. Limitar workers
npm run start:memory
```

### 13.4 Simulador não abre

**Solução**:

```bash
# Reset simulador
xcrun simctl erase all

# Reabrir Simulator
open -a Simulator
```

### 13.5 Build falha com "No signing certificate found"

**Causa**: Certificados iOS não configurados.

**Solução** (usar EAS):

```bash
eas build --platform ios --profile development
# EAS gerencia certificados automaticamente
```

---

## 14. Comandos Úteis

```bash
# Dev
npm start                  # Expo dev server
npm run ios                # Abrir no iOS Simulator
npm test -- --watch        # Jest watch mode
npm run typecheck          # TypeScript validation
npm run lint               # ESLint
npm run quality-gate       # Full validation

# Build (usar EAS Cloud, não local)
eas build --platform ios --profile ios_testflight

# Limpar caches
npm run clean              # Limpa todos os caches
npx expo start --clear     # Limpa cache Metro

# Xcode
open ios/*.xcworkspace     # Abrir projeto iOS no Xcode
xcrun simctl list devices  # Listar simuladores
```

---

## 15. Ferramentas Opcionais

### 15.1 VS Code / Cursor

1. **Download**: https://code.visualstudio.com/ ou https://cursor.sh/
2. **Extensions recomendadas**:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - React Native Tools
   - Expo Tools

### 15.2 React Native Debugger

```bash
brew install --cask react-native-debugger
```

### 15.3 Flipper (Meta's debugger)

```bash
brew install --cask flipper
```

---

## Referências

- **Xcode**: https://developer.apple.com/xcode/
- **Homebrew**: https://brew.sh/
- **fnm**: https://github.com/Schniz/fnm
- **Expo**: https://docs.expo.dev/
- **EAS**: https://docs.expo.dev/build/introduction/
- **React Native**: https://reactnative.dev/docs/environment-setup

---

**Última atualização**: 14/02/2026  
**Versão do guia**: 1.0  
**Mantenedor**: Lion (@LionGab)
