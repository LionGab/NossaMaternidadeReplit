# Release Gates - Nossa Maternidade TestFlight

## Scoreboard

| Gate | Status     | Date       | Duration | Validated By | Notes                                            |
| ---- | ---------- | ---------- | -------- | ------------ | ------------------------------------------------ |
| G-1  | ✅ PASS    | 2026-01-13 | -        | Auto         | Secrets scan clean                               |
| G0   | ✅ PASS    | 2026-01-13 | -        | Auto         | Diagnose production ready                        |
| G1   | ✅ PASS    | 2026-02-01 | -        | Auto         | Quality gate (TS + ESLint + No console.log)      |
| G2.5 | ✅ PASS    | 2026-01-20 | -        | Auto         | AI consent unified (canUseAi)                    |
| G2   | ⏳ PENDING | -          | -        | Manual       | Auth (Email, Google, Apple) - testar no device   |
| G3   | ✅ PASS    | 2026-01-10 | 15min    | SQL          | All 35 tables RLS enabled, 113 policies verified |
| G4   | ⏳ PENDING | -          | -        | Manual       | RevenueCat (IAP + Webhook)                       |
| G5   | ✅ PASS    | 2026-01-20 | -        | Auto         | NathIA + Voice ID configured                     |
| G6   | ✅ PASS    | 2026-02-02 | ~11min   | EAS          | ios_testflight Build #104 SUCCESS (+ npm fix)    |
| G7   | ✅ PASS    | 2026-02-02 | ~2min    | EAS          | TestFlight Submit SUCCESS                        |

**Current Status:** G7 PASS ✅ | Build #104 submetido ao TestFlight | npm cache fix + buildNumber 104 | Aguardando processamento Apple (5-10 min)

---

## Latest Build Info (iOS TestFlight)

| Campo             | Valor                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Profile**       | ios_testflight                                                                                          |
| **Build #**       | 104 (npm cache fix macOS + buildNumber increment)                                                       |
| **Build ID**      | fc938839-3e94-4f5e-a8bf-1118dc9e5646                                                                    |
| **Submission ID** | 54d498a2-68c3-4492-a6de-079d8d8060c8                                                                    |
| **Status**        | ✅ finished + submitted (aguardando processamento Apple)                                                |
| **Version**       | 1.0.1                                                                                                   |
| **SDK**           | 54.0.0                                                                                                  |
| **Commit**        | d2e5966d (fix: corrigir cache npm para macOS)                                                           |
| **IPA URL**       | https://expo.dev/artifacts/eas/xbYsNh5ixkxn7tvuJ4eMZh.ipa                                               |
| **Logs**          | https://expo.dev/accounts/liongab/projects/nossamaternidade/builds/fc938839-3e94-4f5e-a8bf-1118dc9e5646 |

---

## EAS Configuration Summary

### eas.json - ios_testflight profile ✅

```json
{
  "distribution": "store",
  "autoIncrement": true,
  "ios": {
    "resourceClass": "m-medium",
    "credentialsSource": "remote",
    "image": "latest",
    "buildConfiguration": "Release"
  },
  "env": {
    "EXPO_PUBLIC_ENV": "production",
    "EXPO_PUBLIC_ENABLE_AI_FEATURES": "true",
    "EXPO_PUBLIC_ENABLE_GAMIFICATION": "true",
    "EXPO_PUBLIC_ENABLE_ANALYTICS": "true"
  }
}
```

### app.config.js ✅

- **Name:** Nossa Maternidade
- **Bundle ID:** br.com.nossamaternidade.app
- **Version:** 1.0.0
- **Icon:** 1024x1024 PNG ✅
- **Splash:** 1284x2778 PNG ✅
- **infoPlist:** Camera, Photo Library, ITSAppUsesNonExemptEncryption: false ✅

### Submit Config (eas.json) ✅

```json
{
  "ios": {
    "appleId": "gabrielvesz_@hotmail.com",
    "ascAppId": "6756980888",
    "appleTeamId": "KZPW4S77UH"
  }
}
```

---

## Next Actions

### ✅ Build #104 submetido ao TestFlight!

- **Submission ID**: 54d498a2-68c3-4492-a6de-079d8d8060c8
- **Status**: ✅ Submitted successfully - Processando (Apple leva 5-10 minutos)
- **Monitor**: https://appstoreconnect.apple.com/apps/6756980888/testflight/ios
- **Submission Details**: https://expo.dev/accounts/liongab/projects/nossamaternidade/submissions/54d498a2-68c3-4492-a6de-079d8d8060c8

### Correções incluídas neste build:

1. **Fix crítico npm cache**: Corrigido `.npmrc` com caminho Windows (`C:\npm-cache`) para macOS (`~/.npm`)
2. **BuildNumber increment**: 101 → 104 (manual, app.config.js não suporta autoIncrement)
3. **Quality Gate**: TypeScript + ESLint + Build check 100% PASS

### ⚠️ IMPORTANTE: BuildNumber Manual

Como o projeto usa `app.config.js` (dynamic config), o EAS **não suporta** `autoIncrement`.
**Sempre incrementar manualmente** o `buildNumber` em `app.config.js` antes de fazer build para TestFlight.

```javascript
// app.config.js
ios: {
  buildNumber: "105", // <- Incrementar manualmente antes do próximo build
}
```

### Gates pendentes (testar via TestFlight no device):

1. **G2 - Auth**: Testar Email, Google, Apple login no device
2. **G4 - RevenueCat**: Testar compra sandbox

---

## Quality Gate Status (2026-01-13)

```
✅ TypeScript: 0 errors
✅ ESLint: 0 errors
✅ Build readiness: OK
✅ Security (no console.log): OK
✅ EAS logged in: liongab
✅ Assets: icon.png (1024x1024), splash.png (1284x2778)
```

---

**Last Updated:** 2026-02-02
**Document Owner:** Release Team
**Version:** 1.3 (Build #104 submitted - npm fix + buildNumber increment)
