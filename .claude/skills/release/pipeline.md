# Pipeline de Deploy

## Fase 1: Pre-Flight

```bash
# Verificar TypeScript
npx tsc --noEmit

# Verificar Expo
npx expo-doctor

# Verificar EAS config
eas config --platform ios
```

## Fase 2: Versão

```bash
# Ver versão atual
cat app.json | grep -E '"version"|"buildNumber"'

# Incrementar buildNumber em app.json antes de prosseguir
```

## Fase 3: Build

```bash
# Build production iOS
eas build --platform ios --profile production --non-interactive

# Monitorar
eas build:list --limit 1 --json --non-interactive
```

## Fase 4: Submit

```bash
# Submeter para TestFlight
eas submit --platform ios --latest

# Ou com build específico
eas submit --platform ios --id BUILD_ID
```

## Fase 5: Verificação

1. Verificar App Store Connect
2. Aguardar processamento Apple (5-10 min)
3. Testar no TestFlight

## Rollback

```bash
# Se precisar reverter
git checkout v1.0.0  # tag estável
# Incrementar apenas buildNumber
eas build --platform ios --profile production
eas submit --platform ios --latest
```
