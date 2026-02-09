# 🚀 Otimização Máxima - React Native + Expo (Ryzen 5 7600X + 32GB)

## 📋 Checklist de Otimizações Adicionais

### ✅ Já Implementado

- [x] TypeScript Server 8GB
- [x] Metro workers dinâmicos (4-5 workers)
- [x] Cache versioning automático
- [x] Debug profiles avançados
- [x] Tasks otimizadas
- [x] Git decorations + autofetch
- [x] Auto-imports habilitados

### 🔥 Próximas Otimizações Críticas

---

## 1. 🔌 Extensões VS Code Essenciais

### Instalar Agora (High Priority)

```jsonc
// .vscode/extensions.json - ADICIONAR:
{
  "recommendations": [
    // === JÁ INSTALADAS ===
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "expo.vscode-expo-tools",
    "openai.chatgpt",

    // === NOVAS - REACT NATIVE ESPECÍFICAS ===
    "msjsdiag.vscode-react-native", // React Native Tools (Microsoft)
    "dsznajder.es7-react-js-snippets", // Snippets React/RN
    "mikestead.dotenv", // .env syntax highlighting
    "foxundermoon.shell-format", // Format shell scripts
    "eamodio.gitlens", // Git superpowers
    "usernamehw.errorlens", // Erros inline
    "christian-kohler.path-intellisense", // Path autocomplete
    "wix.vscode-import-cost", // Mostra tamanho de imports
    "formulahendry.auto-rename-tag", // Auto rename JSX tags
    "yoavbls.pretty-ts-errors", // TypeScript errors bonitos
    "streetsidesoftware.code-spell-checker", // Spell checker
    "streetsidesoftware.code-spell-checker-portuguese-brazilian", // PT-BR
  ],
}
```

**Impacto**:

- ✅ React Native Tools: Debug nativo, device logs, element inspector
- ✅ Import Cost: Identifica imports pesados (otimização de bundle)
- ✅ Error Lens: Erros visíveis inline (menos alt+tab para Problems)
- ✅ GitLens: Blame inline, histórico de commits
- ✅ Pretty TS Errors: Erros TypeScript legíveis

---

## 2. ⚙️ Variáveis de Ambiente - Performance

### Criar `.env.local` (Nunca commitar!)

```bash
# ==================================
# PERFORMANCE - PC High-End
# ==================================

# Node.js - 8GB heap (32GB total RAM)
NODE_OPTIONS=--max-old-space-size=8192

# Expo - Otimizações
EXPO_NO_TELEMETRY=1
EXPO_NO_DOTENV=0
EXPO_USE_METRO_WORKSPACE_ROOT=1

# Metro - Performance
METRO_MAX_WORKERS=5
EXPO_NO_METRO_LAZY=false  # Lazy load = melhor DX em dev

# React Native - Debug
REACT_DEBUGGER="echo 'Debugger desabilitado - use VS Code'"

# Desabilitar warnings específicos
SUPPRESS_NO_CONFIG_WARNING=true

# Fast Refresh otimizado
FAST_REFRESH=true

# ==================================
# WINDOWS SPECIFIC
# ==================================

# Usar PowerShell em vez de CMD
SHELL=powershell.exe

# Melhor performance em Windows
FORCE_COLOR=1
CI=false
```

### Criar `.npmrc` (root do projeto)

```ini
# Cache agressivo - SSD rápido aguenta
cache=C:\npm-cache
cache-min=999999999

# Parallel downloads
maxsockets=8

# Strict SSL (segurança)
strict-ssl=true

# Save exact versions
save-exact=true

# Disable funding messages
fund=false

# Disable update notifier
update-notifier=false

# Progress bars
progress=true
loglevel=error
```

---

## 3. 🏗️ Watchman Configuration (Critical!)

### Por que?

Expo desabilita Watchman por padrão, mas no Windows com SSD NVMe, Watchman é **MUITO** mais rápido que polling nativo.

### Instalar Watchman no Windows

```powershell
# Via Chocolatey
choco install watchman

# OU via Scoop
scoop install watchman

# Verificar instalação
watchman --version
```

### Criar `.watchmanconfig`

```json
{
  "ignore_dirs": [
    ".git",
    "node_modules",
    ".expo",
    "dist",
    "build",
    "coverage",
    ".metro-cache",
    "ios/Pods",
    "android/.gradle",
    "android/app/build",
    ".vscode",
    "__mocks__"
  ],
  "settle": 1500,
  "timeout": 60000
}
```

### Habilitar Watchman no Metro

```javascript
// metro.config.js - MODIFICAR:
config.resolver.useWatchman = true; // MUDAR de false para true
```

**Ganho esperado**: Hot reload 30-50% mais rápido

---

## 4. 📦 Package.json Scripts Otimizados

### Adicionar ao `package.json`:

```json
{
  "scripts": {
    // === NOVAS - HIGH PERFORMANCE ===
    "start:turbo": "set NODE_OPTIONS=--max-old-space-size=8192 && set METRO_MAX_WORKERS=5 && set EXPO_NO_METRO_LAZY=true && npx expo start",
    "start:profile": "set EXPO_PROFILE=1 && npx expo start --no-dev --minify",
    "start:prod-sim": "set EXPO_NO_METRO_LAZY=true && npx expo start --no-dev --minify",

    // Bundle analysis
    "bundle:analyze": "npx expo export --dump-sourcemap && npx source-map-explorer dist/**/*.js --html bundle-report.html",
    "bundle:size": "npx expo export --platform all && du -sh dist/*",

    // Cache management - Windows
    "cache:clear:all": "npx expo start --clear && npm cache clean --force && rd /s /q .metro-cache 2>nul & rd /s /q node_modules\\.cache 2>nul",
    "cache:metro": "rd /s /q %USERPROFILE%\\.metro-cache",

    // Prebuild optimizations
    "prebuild:clean": "rd /s /q android ios 2>nul & npx expo prebuild --clean",
    "prebuild:ios": "npx expo prebuild --platform ios --clean",
    "prebuild:android": "npx expo prebuild --platform android --clean",

    // Performance monitoring
    "perf:bundle": "set EXPO_PROFILE=1 && npx expo export",
    "perf:metro": "set DEBUG=metro* && npm start",

    // Quick fixes
    "fix:permissions": "icacls . /reset /T",
    "fix:metro": "taskkill /F /IM node.exe 2>nul & npm run cache:clear:all && npm start"
  }
}
```

---

## 5. 🎯 VS Code Settings - React Native Specific

### Adicionar ao `.vscode/settings.json`:

```jsonc
{
  // === REACT NATIVE TOOLS ===
  "react-native-tools.showUserTips": false,
  "react-native-tools.projectRoot": "${workspaceFolder}",
  "react-native-tools.enableDebugger": true,

  // Import Cost - mostra tamanho de imports
  "importCost.largePackageSize": 100,
  "importCost.mediumPackageSize": 50,
  "importCost.smallPackageSize": 20,
  "importCost.showCalculatingDecoration": true,

  // Error Lens - erros inline
  "errorLens.enabledDiagnosticLevels": ["error", "warning"],
  "errorLens.excludeBySource": ["eslint(prettier/prettier)"],
  "errorLens.fontSize": "0.9em",

  // Path Intellisense
  "typescript.suggest.paths": true,
  "javascript.suggest.paths": true,

  // GitLens (se instalar)
  "gitlens.codeLens.enabled": true,
  "gitlens.codeLens.authors.enabled": false,
  "gitlens.codeLens.recentChange.enabled": true,
  "gitlens.currentLine.enabled": true,
  "gitlens.hovers.currentLine.over": "line",

  // Spell Checker
  "cSpell.language": "en,pt,pt_BR",
  "cSpell.words": [
    "Supabase",
    "RevenueCat",
    "NativeWind",
    "Tailwind",
    "NossaMaternidade",
    "Gemini",
    "ElevenLabs",
  ],

  // File associations - React Native
  "files.associations": {
    "*.tsx": "typescriptreact",
    "*.ts": "typescript",
    "*.config.js": "javascript",
    "*.config.ts": "typescript",
    ".env*": "dotenv",
    "*.gradle": "groovy",
  },

  // Exclude from file watcher (já otimizado, mas garantir)
  "files.watcherExclude": {
    "**/android/app/build/**": true,
    "**/android/.gradle/**": true,
    "**/ios/Pods/**": true,
    "**/ios/build/**": true,
    "**/.expo/**": true,
    "**/.expo-shared/**": true,
  },
}
```

---

## 6. 🐳 Docker Desktop - Otimizar se usar Supabase local

### Settings Docker Desktop (Windows)

```json
{
  "cpus": 4,
  "memory": 8192, // 8GB para Docker
  "swap": 2048,
  "disk": {
    "size": 100 // GB
  }
}
```

**Se NÃO usar Supabase local**: Fechar Docker Desktop (economiza 2-4GB RAM)

---

## 7. 🔧 Windows System Optimizations

### A. Windows Defender - Exclusões Críticas

```powershell
# Executar PowerShell como ADMIN:

# Projeto
Add-MpPreference -ExclusionPath "C:\Users\User\Documents\new\NossaMaternidade"

# Node/NPM
Add-MpPreference -ExclusionPath "$env:USERPROFILE\.npm"
Add-MpPreference -ExclusionPath "$env:USERPROFILE\.metro-cache"
Add-MpPreference -ExclusionPath "C:\npm-cache"

# Processos
Add-MpPreference -ExclusionProcess "node.exe"
Add-MpPreference -ExclusionProcess "Code.exe"
Add-MpPreference -ExclusionProcess "watchman.exe"

# Verificar exclusões
Get-MpPreference | Select-Object -ExpandProperty ExclusionPath
```

**Ganho**: 15-25% mais rápido em `npm install` e Metro bundling

### B. PowerShell Profile ($PROFILE)

```powershell
# Editar profile
notepad $PROFILE

# Adicionar:

# === REACT NATIVE ENV ===
$env:NODE_OPTIONS = "--max-old-space-size=8192"
$env:METRO_MAX_WORKERS = 5
$env:EXPO_NO_TELEMETRY = 1

# Aliases úteis
function rn-start { npm run start:turbo }
function rn-ios { npm run ios }
function rn-android { npm run android }
function rn-clean { npm run cache:clear:all }
function rn-kill { taskkill /F /IM node.exe 2>$null }

# CD rápido
function nm { Set-Location "C:\Users\User\Documents\new\NossaMaternidade\NossaMaternidade" }

# Cor do terminal
Set-PSReadLineOption -Colors @{
    Command = 'Green'
    Parameter = 'Gray'
    String = 'Yellow'
}

Write-Host "✅ React Native profile loaded" -ForegroundColor Green
```

### C. Windows Terminal - Configuração Otimizada

```json
// settings.json do Windows Terminal
{
  "profiles": {
    "defaults": {
      "fontFace": "Cascadia Code",
      "fontSize": 11,
      "colorScheme": "One Half Dark",
      "cursorShape": "bar",
      "useAcrylic": false,
      "antialiasingMode": "cleartype"
    },
    "list": [
      {
        "name": "React Native Dev",
        "commandline": "powershell.exe -NoExit -Command \"cd C:\\Users\\User\\Documents\\new\\NossaMaternidade\\NossaMaternidade\"",
        "icon": "📱",
        "startingDirectory": "C:\\Users\\User\\Documents\\new\\NossaMaternidade\\NossaMaternidade"
      }
    ]
  }
}
```

---

## 8. 📱 Android Studio - Otimizações (se usar)

### `android/gradle.properties` (criar se não existir)

```properties
# === PERFORMANCE - RYZEN 5 7600X ===
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.workers.max=5
org.gradle.jvmargs=-Xmx8g -XX:MaxMetaspaceSize=1g -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8

# Kotlin
kotlin.incremental=true
kotlin.caching.enabled=true

# R8/D8
android.enableR8=true
android.enableR8.fullMode=true

# AndroidX
android.useAndroidX=true
android.enableJetifier=true

# Build cache
android.buildCacheDir=C:/AndroidBuildCache
android.enableBuildCache=true

# Network
systemProp.http.maxRedirects=10
systemProp.http.socketTimeout=300000
systemProp.http.connectionTimeout=300000
```

### Android SDK Manager - Limpar

```powershell
# Limpar builds antigos
rd /s /q "%USERPROFILE%\.gradle\caches" 2>nul
rd /s /q "%LOCALAPPDATA%\Android\Sdk\build-cache" 2>nul

# Rebuild cache
cd android
.\gradlew clean --refresh-dependencies
```

---

## 9. 🍎 Xcode - Otimizações (macOS/Hackintosh)

### Se tiver acesso ao macOS:

```bash
# Derived Data em SSD rápido
defaults write com.apple.dt.Xcode IDECustomDerivedDataLocation -string "~/Library/Developer/Xcode/DerivedData"

# Build paralelo
defaults write com.apple.dt.Xcode IDEBuildOperationMaxNumberOfConcurrentCompileTasks -int 6

# Disable indexing em node_modules
touch ios/Pods/.nosearch
```

---

## 10. 🚀 Expo CLI - Configurações Avançadas

### `.expo/settings.json` (auto-gerado, mas pode customizar)

```json
{
  "hostType": "lan",
  "lanType": "ip",
  "dev": true,
  "minify": false,
  "urlRandomness": null,
  "https": false,
  "scheme": null,
  "devClient": false,
  "android": {
    "buildType": "apk"
  }
}
```

### Tunnel vs LAN vs Localhost

```bash
# LAN = Mais rápido (mesma rede WiFi)
npx expo start --lan

# Tunnel = Mais lento (ngrok), mas funciona de qualquer rede
npx expo start --tunnel

# Localhost = Só funciona em emuladores
npx expo start --localhost
```

**Recomendação**: LAN para desenvolvimento, Tunnel para testes remotos

---

## 11. 🔥 Keybindings Customizados

### `.vscode/keybindings.json` (criar)

```json
[
  // React Native específicos
  {
    "key": "ctrl+shift+r",
    "command": "workbench.action.tasks.runTask",
    "args": "Start Expo"
  },
  {
    "key": "ctrl+shift+k",
    "command": "workbench.action.tasks.runTask",
    "args": "Clean All Caches"
  },
  {
    "key": "ctrl+shift+b",
    "command": "workbench.action.tasks.runTask",
    "args": "Build iOS Preview"
  },
  {
    "key": "ctrl+alt+b",
    "command": "workbench.action.tasks.runTask",
    "args": "Build Android Preview"
  },
  // Reload React Native
  {
    "key": "ctrl+r",
    "command": "reactnative.reloadApp",
    "when": "!editorTextFocus"
  },
  // Element Inspector
  {
    "key": "ctrl+shift+i",
    "command": "reactnative.showDevMenu"
  }
]
```

---

## 12. 📊 Performance Monitoring Tools

### A. React Native Performance Monitor (Integrado)

```typescript
// App.tsx - Adicionar em DEV:
if (__DEV__) {
  const { enablePerformanceMonitoring } = require("@react-native-community/performance");
  enablePerformanceMonitoring();
}
```

### B. Bundle Analyzer

```bash
# Gerar report
npm run bundle:analyze

# Abre bundle-report.html no browser
# Identifica módulos pesados
```

### C. Metro Bundler Logs

```bash
# Ver tempo de bundling
set DEBUG=metro* && npm start

# Ver cache hits
set METRO_CACHE_DEBUG=1 && npm start
```

---

## 13. 🎯 Quick Wins - Implementação Imediata

### Checklist Rápido (30 minutos)

- [ ] **Instalar Watchman** → `choco install watchman`
- [ ] **Habilitar no Metro** → `config.resolver.useWatchman = true`
- [ ] **Criar `.env.local`** → Com `NODE_OPTIONS=--max-old-space-size=8192`
- [ ] **Criar `.npmrc`** → Cache otimizado
- [ ] **Windows Defender exclusões** → PowerShell script acima
- [ ] **Instalar extensões** → React Native Tools + Error Lens + Import Cost
- [ ] **PowerShell profile** → Aliases úteis
- [ ] **Criar `.watchmanconfig`** → Ignorar pastas corretas

### Impacto Esperado

| Otimização                 | Ganho Estimado                       |
| -------------------------- | ------------------------------------ |
| Watchman                   | 30-50% hot reload                    |
| Windows Defender exclusões | 15-25% npm/builds                    |
| Node 8GB heap              | Menos crashes                        |
| Metro 5 workers            | 20-30% builds                        |
| Extensões                  | Melhor DX                            |
| Cache otimizado            | 40-60% reinstalls                    |
| **TOTAL**                  | **2-3x desenvolvimento mais fluido** |

---

## 14. 🐛 Troubleshooting Guide

### "Metro bundler está lento"

```powershell
# 1. Matar todos os processos Node
taskkill /F /IM node.exe

# 2. Limpar TUDO
npm run cache:clear:all

# 3. Reinstalar node_modules
rd /s /q node_modules
npm install

# 4. Verificar Watchman
watchman watch-list
watchman watch-del-all

# 5. Start limpo
npm start -- --reset-cache
```

### "VS Code está lento"

```powershell
# Ver extensões problemáticas
code --status

# Desabilitar workspace
code --disable-extensions

# Limpar cache VS Code
rd /s /q "%APPDATA%\Code\Cache"
rd /s /q "%APPDATA%\Code\CachedData"
```

### "TypeScript lento"

```jsonc
// Temporariamente reduzir:
"typescript.tsserver.maxTsServerMemory": 4096

// Verificar node_modules
npm dedupe
npm prune
```

---

## 15. 🎓 Métricas de Sucesso

### Antes vs Depois (Targets)

| Métrica                   | Antes  | Meta   | Como Medir         |
| ------------------------- | ------ | ------ | ------------------ |
| **Metro initial build**   | 45-60s | 20-30s | Tempo no console   |
| **Hot reload**            | 3-5s   | 1-2s   | Salvar arquivo     |
| **npm install**           | 3-5min | 1-2min | `time npm install` |
| **TS IntelliSense**       | 2-3s   | <0.5s  | Ctrl+Space delay   |
| **Bundle size (iOS)**     | -      | <2MB   | `bundle:analyze`   |
| **Bundle size (Android)** | -      | <3MB   | `bundle:analyze`   |

### Comandos de Benchmark

```powershell
# Build time
Measure-Command { npm run start -- --reset-cache }

# Install time
Measure-Command { rd /s /q node_modules; npm install }

# Bundle size
npm run bundle:analyze
```

---

## 16. 📚 Recursos Adicionais

### Documentação

- [Metro Performance](https://metrobundler.dev/docs/performance/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Expo Optimization](https://docs.expo.dev/guides/customizing-metro/)
- [Watchman Docs](https://facebook.github.io/watchman/)

### Tools

- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/) - Meta's debugging platform
- [Why Did You Render](https://github.com/welldone-software/why-did-you-render)

### Community

- [React Native Discord](https://discord.gg/reactnative)
- [Expo Discord](https://discord.gg/expo)
- [Stack Overflow - react-native](https://stackoverflow.com/questions/tagged/react-native)

---

## 📝 Próximos Passos

### Esta Semana

1. ✅ Implementar Quick Wins (checklist 30min)
2. ✅ Instalar extensões essenciais
3. ✅ Configurar Windows Defender exclusões
4. ✅ Testar Watchman
5. ✅ Criar `.env.local` e `.npmrc`

### Próximas 2 Semanas

6. ⏳ Analisar bundle size (identificar imports pesados)
7. ⏳ Configurar Android gradle.properties
8. ⏳ Implementar performance monitoring
9. ⏳ Benchmarking completo (antes/depois)
10. ⏳ Documentar ganhos reais

### Longo Prazo

11. ⏳ Setup CI/CD otimizado para 6 cores
12. ⏳ Implementar E2E testing (Detox)
13. ⏳ Profiling avançado com Flipper
14. ⏳ Bundle optimization strategies

---

**Última atualização**: 16 de Janeiro de 2026
**Hardware**: AMD Ryzen 5 7600X + 32GB RAM
**Stack**: React Native + Expo SDK 54 + TypeScript
**Autor**: @LionGab
