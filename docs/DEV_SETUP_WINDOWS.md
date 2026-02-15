# Dev Setup — Windows — Nossa Maternidade

> Guia oficial para configurar ambiente de desenvolvimento no **Windows** (Git Bash).
> Última atualização: 14 de fevereiro de 2026

---

## Pré-requisitos

- Windows 10/11 (64-bit)
- 8GB+ RAM (16GB recomendado)
- 20GB+ espaço em disco

---

## 1. Git Bash (MSYS2)

### 1.1 Instalar Git for Windows

1. **Download**: https://git-scm.com/download/win
2. **Instalar** com opções:
   - ✅ **Git Bash** (terminal Unix-like)
   - ✅ **Git Credential Manager**
   - ✅ **Checkout as-is, commit Unix-style line endings**
3. **Verificar**:
   ```bash
   git --version
   # ✅ Deve mostrar: git version 2.43.0 (ou superior)
   ```

### 1.2 Configurar Git

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
git config --global core.autocrlf input
git config --global init.defaultBranch main
```

---

## 2. Node.js

### 2.1 Instalar Node.js v20 LTS

1. **Download**: https://nodejs.org/en/download/
2. **Instalar** Node.js **v20.x LTS** (versão recomendada)
3. **Verificar**:

   ```bash
   node --version
   # ✅ v20.19.4 (ou superior v20.x)

   npm --version
   # ✅ 10.x+
   ```

### 2.2 (Opcional) Usar `fnm` para gerenciar versões

```bash
# Instalar fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash

# Adicionar ao ~/.bashrc
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.bashrc
source ~/.bashrc

# Instalar Node v20 LTS
fnm install 20
fnm use 20
```

---

## 3. Expo & EAS CLI

```bash
# 3.1 Instalar Expo CLI globalmente
npm install -g expo-cli

# 3.2 Instalar EAS CLI (para builds cloud)
npm install -g eas-cli

# 3.3 Verificar
expo --version
eas --version
```

---

## 4. Clonar Repositório

```bash
# 4.1 Clonar repo
git clone https://github.com/LionGab/NossaMaternidadeReplit.git
cd NossaMaternidadeReplit

# 4.2 Instalar dependências
npm ci

# 4.3 Validar instalação
npm run quality-gate
# ✅ TypeScript OK
# ✅ ESLint OK
# ✅ Build-readiness OK
```

---

## 5. Configurar Variáveis de Ambiente

### 5.1 Criar `.env.local`

```bash
# NÃO versionar .env.local (já está no .gitignore)
cp .env.example .env.local
```

### 5.2 Preencher `.env.local`

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

## 6. Iniciar Dev Server

```bash
# 6.1 Iniciar Expo
npm start

# OU com cache limpo
npm run start:clear

# 6.2 Abrir no dispositivo
# - Instalar App "Expo Go" (iOS/Android)
# - Escanear QR code no terminal
```

---

## 7. Workflow de Desenvolvimento

### 7.1 Criar feature branch

```bash
git checkout -b feat/minha-feature
```

### 7.2 Desenvolver

```bash
# Rodar testes em watch mode
npm test -- --watch

# TypeCheck contínuo
npm run typecheck
```

### 7.3 Validar antes de commit

```bash
# Quality gate (obrigatório!)
npm run quality-gate

# Se passar, commitar
git add .
git commit -m "feat: minha feature"
git push origin feat/minha-feature
```

---

## 8. Ferramentas Opcionais

### 8.1 VS Code / Cursor

1. **Download**: https://code.visualstudio.com/ ou https://cursor.sh/
2. **Extensions recomendadas**:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - React Native Tools
   - Expo Tools

### 8.2 Android Studio (para testes Android)

1. **Download**: https://developer.android.com/studio
2. **Instalar Android SDK** e **Android Emulator**
3. **Adicionar ao PATH**:
   ```bash
   export ANDROID_HOME=$HOME/AppData/Local/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

---

## 9. Troubleshooting Windows

### 9.1 Erro: `ENOENT` ou `path not found`

**Causa**: Paths com backslashes (`\`) vs forward slashes (`/`).

**Solução**: Sempre usar **forward slashes** no Git Bash:

```bash
# ✅ Correto
cd /c/Users/User/project

# ❌ Errado
cd C:\Users\User\project
```

### 9.2 Erro: `Permission denied`

**Causa**: Git Bash sem permissões de admin.

**Solução**:

- Rodar **Git Bash como Administrador**
- OU ajustar permissões de pasta no Windows Explorer

### 9.3 Expo Metro bundler lento

**Causa**: Windows Defender scannin `node_modules/`.

**Solução**:

1. **Windows Security** → **Virus & threat protection**
2. **Manage settings** → **Exclusions**
3. **Add exclusion** → `C:\Users\<User>\Documents\NossaMaternidadeReplit`

### 9.4 Line endings (CRLF vs LF)

**Problema**: Git converte line endings automaticamente.

**Solução**:

```bash
git config --global core.autocrlf input
# Força LF (Unix-style) em commits
```

### 9.5 Node modules path muito longo

**Problema**: Windows path limit (260 chars).

**Solução**:

```bash
# Habilitar long paths (PowerShell como Admin)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

# OU mover projeto para raiz
cd /c/dev/NossaMaternidadeReplit
```

---

## 10. Comandos Úteis

```bash
# Dev
npm start                  # Expo dev server
npm test -- --watch        # Jest watch mode
npm run typecheck          # TypeScript validation
npm run lint               # ESLint
npm run quality-gate       # Full validation

# Build (local não recomendado, usar EAS Cloud)
eas build --platform android --profile preview

# Limpar caches
npm run clean              # Limpa todos os caches
npx expo start --clear     # Limpa cache Metro
```

---

## Referências

- **Git for Windows**: https://git-scm.com/download/win
- **Node.js**: https://nodejs.org/
- **Expo**: https://docs.expo.dev/
- **EAS**: https://docs.expo.dev/build/introduction/
- **React Native**: https://reactnative.dev/docs/environment-setup

---

**Última atualização**: 14/02/2026
**Versão do guia**: 1.0
**Mantenedor**: Lion (@LionGab)
