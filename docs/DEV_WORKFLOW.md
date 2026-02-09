# 🛠️ DEV WORKFLOW — NossaMaternidade

## Quick Commands (após terminal configurado)

### Desenvolvimento

```bash
es          # npx expo start
esd         # npx expo start --dev-client
ei <pkg>    # npx expo install <package>
```

### Build & Deploy

```bash
epc         # EAS Build iOS Preview
epa         # EAS Build Android Preview
eprod       # EAS Build Production (ambos)
```

### Qualidade

```bash
lint        # npm run lint
tc          # npx tsc --noEmit
t           # npm test
tw          # npm test --watch
```

### Git

```bash
gs          # git status
gp          # git pull
gca "msg"   # git add -A && git commit -m "msg"
gpu         # git push -u origin HEAD
gl          # git log --oneline -15
```

### Manutenção

```bash
rn-clean    # Limpa caches (watchman, node_modules, pods)
rn-nuke     # Reset completo (inclui gradle)
pod         # cd ios && pod install && cd ..
```

---

## 🚀 Fluxo de Desenvolvimento

### 1. Nova Feature

```bash
git checkout -b feat/nome-da-feature
es                    # Inicia dev server
# ... desenvolve ...
lint && tc            # Valida
t                     # Testa
gca "feat: descrição"
gpu
# Abre PR no GitHub
```

### 2. Bug Fix

```bash
git checkout -b fix/descricao-bug
es
# ... corrige ...
t -- --testPathPattern="arquivo.test"
gca "fix: descrição"
gpu
```

### 3. Build TestFlight

```bash
git checkout main
gp
epc                   # Build iOS Preview
# Aguarda EAS terminar
# Build aparece no TestFlight automaticamente
```

---

## 📱 Simuladores

### iOS

```bash
# Listar simuladores
xcrun simctl list devices

# Abrir específico
open -a Simulator
# Ou: npx expo start --ios
```

### Android

```bash
# Listar emuladores
emulator -list-avds

# Iniciar emulador
emulator -avd Pixel_7_API_34
# Ou: npx expo start --android
```

---

## 🔧 Troubleshooting

### Metro não inicia

```bash
watchman watch-del-all
rm -rf node_modules/.cache
es --clear
```

### Pods desatualizados

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

### Build Android falha

```bash
cd android
./gradlew clean
cd ..
rn-clean
```

### TypeScript errors

```bash
tc 2>&1 | head -20    # Ver primeiros erros
rm -rf node_modules/.cache/typescript
tc
```

---

## 📊 Health Checks

### Antes de cada PR

```bash
lint && tc && t       # Tudo deve passar
```

### Antes de build

```bash
npm run lint -- --max-warnings=0
npx tsc --noEmit
npm test -- --coverage
```

### Monitorar bundle

```bash
npx expo export --platform ios --dump-sourcemap
# Analisar source-map para bundle size
```

---

## 🎯 Targets de Qualidade

| Métrica         | Target  | Atual   |
| --------------- | ------- | ------- |
| ESLint errors   | 0       | 0 ✅    |
| ESLint warnings | < 100   | 366 ⚠️  |
| TS errors       | 0       | 3 ❌    |
| Test coverage   | > 50%   | ~25% ⚠️ |
| Build time      | < 15min | -       |

---

## 🔐 Secrets & Env

### Local (.env.local)

```bash
SUPABASE_URL=xxx
SUPABASE_ANON_KEY=xxx
EXPO_PUBLIC_SENTRY_DSN=xxx
```

### EAS Secrets (produção)

```bash
eas secret:list
eas secret:create --name SUPABASE_URL --value xxx
```

---

_Atualizado: 2026-01-27_
