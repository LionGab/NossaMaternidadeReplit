---
name: deploy-android
description: Deploy completo para Google Play com build EAS e submissão
agent: general-purpose
model: sonnet
allowed-tools:
  - Bash
  - Read
  - Edit
  - Grep
  - Glob
hooks:
  - event: PreToolUse
    matcher: "Bash"
    script: |
      if [[ "$TOOL_ARGS" == *"eas build"* ]]; then
        npm run typecheck 2>&1 || exit 1
      fi
---

# Deploy Android

Build e deploy para Android via EAS.

## Quick Start

```bash
# Preview (APK interno)
npm run build:preview:android

# Production (Google Play)
npm run build:prod:android

# Submit
npm run submit:prod:android
```

## Workflow Completo

### 1. Pre-flight Check

```bash
npm run quality-gate
```

### 2. Verificar Versão

```bash
# Verificar versionCode atual
grep -A5 '"android"' app.json | grep versionCode
```

### 3. Build

```bash
# Preview (interno)
npm run build:preview:android

# OU Production
npm run build:prod:android
```

### 4. Monitorar Build

```bash
eas build:list --platform android --limit 3
```

### 5. Submit (Production)

```bash
npm run submit:prod:android
```

## Requisitos

- EAS CLI configurado (`eas login`)
- Google Play credentials em EAS
- Keystore configurado no EAS

## Troubleshooting

| Problema              | Solução                                |
| --------------------- | -------------------------------------- |
| Keystore error        | `eas credentials` para verificar       |
| versionCode duplicado | Incrementar em app.json                |
| Build timeout         | Verificar `eas build:list` para status |
| Google Play reject    | Verificar compliance no Console        |

## Diferenças iOS vs Android

| Aspecto    | iOS                    | Android             |
| ---------- | ---------------------- | ------------------- |
| Store      | TestFlight → App Store | Google Play Console |
| Build      | .ipa                   | .aab / .apk         |
| Versioning | CFBundleVersion        | versionCode         |
| Review     | 24-48h                 | 2-7 dias            |
