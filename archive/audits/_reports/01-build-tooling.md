# Auditoria de Build/Tooling/Quality - Nossa Maternidade

**Data:** 2026-01-05
**Auditor:** Subagente A - Build/Tooling/Quality Audit

---

## Resumo Executivo

| Area          | Status | Score |
| ------------- | ------ | ----- |
| tsconfig.json | OK     | 10/10 |
| package.json  | OK     | 9/10  |
| ESLint config | OK     | 9/10  |
| Babel/Metro   | OK     | 10/10 |
| app.config.js | OK     | 9/10  |
| eas.json      | OK     | 9/10  |

**Score Geral: 56/60 (93%)**

---

## 1. tsconfig.json

### Status: OK

| Item                                     | Status | Observacao                          |
| ---------------------------------------- | ------ | ----------------------------------- |
| `strict: true`                           | OK     | Modo estrito habilitado             |
| `skipLibCheck: true`                     | OK     | Otimiza performance de build        |
| `noUnusedLocals: true`                   | OK     | Detecta variaveis nao usadas        |
| `noUnusedParameters: true`               | OK     | Detecta params nao usados           |
| `noImplicitReturns: true`                | OK     | Garante retornos explicitos         |
| `noFallthroughCasesInSwitch: true`       | OK     | Evita bugs em switch                |
| `forceConsistentCasingInFileNames: true` | OK     | Consistencia cross-platform         |
| `resolveJsonModule: true`                | OK     | Permite importar JSON               |
| `isolatedModules: true`                  | OK     | Compat com Babel                    |
| `esModuleInterop: true`                  | OK     | Compat com CommonJS                 |
| `module: esnext`                         | OK     | Modulos ES adequados                |
| `moduleResolution: bundler`              | OK     | Padrao moderno para bundlers        |
| `baseUrl` e `paths`                      | OK     | 9 aliases configurados corretamente |

**Paths configurados:**

- `@/*` -> `./src/*`
- `@/components/*`, `@/screens/*`, `@/hooks/*`, `@/utils/*`, `@/api/*`, `@/state/*`, `@/types/*`, `@/theme/*`, `@/navigation/*`

**Includes:** `**/*.ts`, `**/*.tsx`, `nativewind-env.d.ts`, `.expo/types/**/*.ts`, `expo-env.d.ts`

**Excludes adequados:** `node_modules`, `supabase/functions/**/*`, `dist`, `build`, etc.

---

## 2. package.json

### Status: OK (com observacoes)

| Item                 | Status | Observacao                                       |
| -------------------- | ------ | ------------------------------------------------ |
| Scripts de qualidade | OK     | `typecheck`, `lint`, `lint:fix`, `quality-gate`  |
| Scripts de teste     | OK     | `test`, `test:watch`, `test:coverage`, `test:ci` |
| Scripts de build EAS | OK     | dev, preview, staging, production                |
| Husky configurado    | OK     | `prepare: husky`                                 |
| Postinstall hook     | OK     | `fix-lightningcss.js`                            |

### Versoes Principais

| Dependencia             | Versao   | Status |
| ----------------------- | -------- | ------ |
| Expo SDK                | ~54.0.30 | OK     |
| React                   | 19.1.0   | OK     |
| React Native            | ^0.81.5  | OK     |
| TypeScript              | ~5.9.2   | OK     |
| NativeWind              | ^4.1.23  | OK     |
| Tailwind CSS            | ^3.4.17  | OK     |
| Zustand                 | ^5.0.4   | OK     |
| React Native Reanimated | ~4.1.1   | OK     |

### DevDependencies

| Dependencia                      | Versao   | Status |
| -------------------------------- | -------- | ------ |
| @babel/core                      | ^7.25.2  | OK     |
| @typescript-eslint/eslint-plugin | ^8.50.0  | OK     |
| @typescript-eslint/parser        | ^8.50.0  | OK     |
| eslint                           | ^9.25.0  | OK     |
| eslint-config-expo               | ~10.0.0  | OK     |
| jest                             | ^29.7.0  | OK     |
| jest-expo                        | ^54.0.16 | OK     |
| prettier                         | ^3.4.2   | OK     |
| husky                            | ^9.1.7   | OK     |

### Overrides (resolucao de conflitos)

```json
{
  "react-native-css-interop": "0.1.22",
  "react-native-reanimated": "~4.1.1",
  "expo-linking": "~8.0.11",
  "react-native-ios-context-menu": "3.2.1",
  "react-native-ios-utilities": "5.2.0"
}
```

**Observacao WARN:** Projeto usa `bun` em alguns scripts (`validate`, `validate:full`) mas principal e npm. Pode causar inconsistencia em CI.

---

## 3. ESLint Config (eslint.config.js)

### Status: OK

| Item                 | Status | Observacao                |
| -------------------- | ------ | ------------------------- |
| Formato flat config  | OK     | ESLint 9+                 |
| TypeScript parser    | OK     | @typescript-eslint/parser |
| React plugin         | OK     | eslint-plugin-react       |
| React Hooks plugin   | OK     | eslint-plugin-react-hooks |
| Design System plugin | OK     | Custom plugin interno     |

### Regras Configuradas

| Regra                                            | Nivel            | Observacao                                |
| ------------------------------------------------ | ---------------- | ----------------------------------------- |
| `design-system/no-hardcoded-colors`              | warn             | Detecta cores hardcoded                   |
| `no-console`                                     | error            | Bloqueia console.log (permite warn/error) |
| `@typescript-eslint/no-explicit-any`             | warn             | Detecta uso de `any`                      |
| `@typescript-eslint/consistent-type-definitions` | warn (interface) | Prefere interfaces                        |
| `react-hooks/rules-of-hooks`                     | error            | Regras de hooks                           |
| `react-hooks/exhaustive-deps`                    | warn             | Deps de useEffect                         |
| `@typescript-eslint/no-unused-vars`              | warn             | Com ignorePattern `^_`                    |
| `prefer-const`                                   | warn             | Prefere const                             |
| `no-var`                                         | error            | Bloqueia var                              |
| `eqeqeq`                                         | error            | Igualdade estrita                         |

### Custom Plugin: design-system/no-hardcoded-colors

- Detecta cores hex em propriedades de estilo
- Detecta cores nomeadas (white, black, red, etc.)
- Permite: `transparent`, `inherit`, `currentColor`
- Ignora: `theme/tokens.ts`, `theme/design-system.ts`

### Ignores

- `node_modules/**`, `.expo/**`, `dist/**`, `build/**`
- Arquivos config: `*.config.js`, `babel.config.js`, `metro.config.js`, etc.
- `scripts/**`, `supabase/functions/**`

**Observacao WARN:** `@typescript-eslint/no-explicit-any` esta como `warn`, projeto exige `zero any`. Considerar mudar para `error`.

---

## 4. babel.config.js

### Status: OK

| Item              | Status | Observacao                         |
| ----------------- | ------ | ---------------------------------- |
| Preset Expo       | OK     | `babel-preset-expo`                |
| NativeWind JSX    | OK     | `jsxImportSource: "nativewind"`    |
| NativeWind preset | OK     | `nativewind/babel`                 |
| Module resolver   | OK     | Aliases sincronizados com tsconfig |
| Reanimated plugin | OK     | Ultimo na lista (obrigatorio)      |

### Aliases Configurados

Sincronizados com `tsconfig.json`:

- `@`, `@/components`, `@/screens`, `@/hooks`, `@/utils`, `@/api`, `@/state`, `@/types`, `@/theme`, `@/navigation`

---

## 5. metro.config.js

### Status: OK

| Item                  | Status | Observacao                             |
| --------------------- | ------ | -------------------------------------- |
| Sentry config         | OK     | `getSentryExpoConfig` para source maps |
| NativeWind            | OK     | `withNativeWind` com `global.css`      |
| Watchman desabilitado | OK     | `useWatchman: false` (compat Windows)  |
| Package exports fix   | OK     | `unstable_enablePackageExports: false` |
| Cache configurado     | OK     | FileStore + HttpStore opcional         |
| Cache version         | OK     | Versionado para invalidacao            |

---

## 6. tailwind.config.js

### Status: OK

| Item              | Status | Observacao                                                  |
| ----------------- | ------ | ----------------------------------------------------------- |
| Content paths     | OK     | `App.tsx`, `app/**`, `src/**`                               |
| NativeWind preset | OK     | `nativewind/preset`                                         |
| Design tokens     | OK     | Cores extensas (primary, accent, rosa, menta, etc.)         |
| Dark mode         | OK     | `class` strategy                                            |
| Custom plugins    | OK     | Spacing, shadows, glassmorphism, cards, buttons, typography |
| Acessibilidade    | OK     | `.tap-target` (44pt), `.tap-target-lg` (48pt)               |

### Paleta de Cores

- **Primary:** Verde Menta (#A8C5B5)
- **Accent:** Rosa (#A07676)
- **Secondary:** Lilas/Roxo (#A855F7)
- **Backgrounds:** Off-white premium (#FAFCFD)
- **Feelings:** Cores semanticas para check-in diario

---

## 7. app.config.js

### Status: OK (com observacoes)

| Item                       | Status | Observacao                                                              |
| -------------------------- | ------ | ----------------------------------------------------------------------- |
| New Architecture           | OK     | `newArchEnabled: true`                                                  |
| Bundle IDs                 | OK     | iOS: `br.com.nossamaternidade.app`, Android: `com.nossamaternidade.app` |
| Privacy Manifest (iOS 17+) | OK     | `NSPrivacyAccessedAPITypes` configurado                                 |
| Android SDK                | OK     | `compileSdkVersion: 34`, `targetSdkVersion: 34`, `minSdkVersion: 24`    |
| iOS Deployment             | OK     | `deploymentTarget: 15.1`                                                |
| Deep linking               | OK     | Scheme `nossamaternidade`, intent filters                               |
| OTA Updates                | OK     | `expo-updates` habilitado                                               |
| Sentry                     | OK     | Configurado via plugin                                                  |
| EAS Project ID             | OK     | `87ac745f-119e-4b2f-b140-28a5109dfdf9`                                  |

### Plugins Configurados (30+)

- Core: expo-secure-store, expo-font, expo-localization, expo-asset
- Media: expo-camera, expo-audio, expo-image-picker, expo-media-library
- Auth: expo-apple-authentication, expo-local-authentication
- Notifications: expo-notifications, expo-background-fetch
- Tracking: expo-tracking-transparency (ATT iOS 14.5+)
- Error: @sentry/react-native/expo
- Updates: expo-updates
- Build: expo-build-properties
- UX: expo-splash-screen, expo-screen-orientation, expo-video

**Observacao WARN:** `usesNonExemptEncryption: false` esta duplicado (infoPlist e config).

---

## 8. eas.json

### Status: OK

| Item             | Status | Observacao                                      |
| ---------------- | ------ | ----------------------------------------------- |
| CLI version      | OK     | `>= 16.0.0`                                     |
| appVersionSource | OK     | `remote` (gerenciado pelo EAS)                  |
| Node version     | OK     | `20.11.1`                                       |
| Prebuild command | OK     | `npx expo prebuild --clean`                     |
| Cache            | OK     | Key `nossamaternidade-v2`, paths `node_modules` |

### Build Profiles

| Profile               | Distribution | iOS               | Android    |
| --------------------- | ------------ | ----------------- | ---------- |
| development           | internal     | device, m-medium  | apk        |
| development-simulator | internal     | simulator         | apk        |
| preview               | internal     | m-medium          | apk        |
| staging               | internal     | m-medium          | apk        |
| production            | store        | m-medium, Release | app-bundle |

### Submit Config

| Platform | Configuracao                                                 |
| -------- | ------------------------------------------------------------ |
| iOS      | appleId, ascAppId (6756980888), appleTeamId (KZPW4S77UH)     |
| Android  | serviceAccountKeyPath, track: internal, releaseStatus: draft |

**Observacao WARN:** Supabase keys estao hardcoded em `eas.json` (anon key e apenas). Nao e problema de seguranca (anon key e publica), mas poderia usar EAS Secrets.

---

## 9. quality-gate.sh

### Status: OK

| Gate | Descricao             | Status |
| ---- | --------------------- | ------ |
| 1/4  | TypeScript type check | OK     |
| 2/4  | ESLint check          | OK     |
| 3/4  | Build readiness check | OK     |
| 4/4  | console.log scan      | OK     |

O script:

1. Roda `npm run typecheck`
2. Roda `npm run lint`
3. Roda `npm run check-build-ready`
4. Grep por `console.log` em src/ (exceto logger.ts, Toast.tsx, useToast.ts)

---

## Problemas Encontrados

### Criticos (0)

Nenhum problema critico encontrado.

### Warnings (4)

| #   | Area          | Problema                                                         | Impacto              | Recomendacao           |
| --- | ------------- | ---------------------------------------------------------------- | -------------------- | ---------------------- |
| 1   | package.json  | Scripts usam `bun` (validate, validate:full) mas projeto usa npm | Inconsistencia em CI | Padronizar para npm    |
| 2   | ESLint        | `@typescript-eslint/no-explicit-any` e warn, deveria ser error   | Any pode passar      | Mudar para `error`     |
| 3   | app.config.js | `usesNonExemptEncryption` duplicado                              | Redundancia          | Remover duplicata      |
| 4   | eas.json      | Keys em plain text (embora publicas)                             | Gerenciamento        | Considerar EAS Secrets |

### Info (2)

| #   | Area                     | Observacao                                      |
| --- | ------------------------ | ----------------------------------------------- |
| 1   | react-native-css-interop | Override para versao 0.1.22 (compat NativeWind) |
| 2   | react-native-reanimated  | Override para ~4.1.1 (compat Expo SDK 54)       |

---

## Recomendacoes

### Alta Prioridade

1. **Mudar `@typescript-eslint/no-explicit-any` para `error`**
   - Arquivo: `eslint.config.js:179`
   - De: `"@typescript-eslint/no-explicit-any": "warn"`
   - Para: `"@typescript-eslint/no-explicit-any": "error"`

### Media Prioridade

2. **Padronizar scripts para npm**
   - Arquivo: `package.json:20-21`
   - De: `"validate": "bun run typecheck && bun run lint"`
   - Para: `"validate": "npm run typecheck && npm run lint"`

3. **Limpar duplicata usesNonExemptEncryption**
   - Arquivo: `app.config.js`
   - Manter apenas em `infoPlist.ITSAppUsesNonExemptEncryption`

### Baixa Prioridade

4. **Considerar EAS Secrets para keys**
   - Mover EXPO*PUBLIC*\* keys para EAS Secrets
   - Referencia: https://docs.expo.dev/build-reference/variables/

---

## Conclusao

O projeto **Nossa Maternidade** possui uma configuracao de build e qualidade **madura e bem estruturada**:

- TypeScript strict mode habilitado com todas as flags importantes
- ESLint com regras customizadas para design system
- NativeWind integrado corretamente em Babel e Metro
- Build profiles adequados para dev, preview, staging, production
- Quality gate automatizado antes de PR/build
- Suporte a novas arquiteturas (React Native 0.81+, Expo SDK 54)

**O projeto esta pronto para builds de producao** com pequenos ajustes recomendados.

---

_Relatorio gerado automaticamente por Subagente A - Build/Tooling/Quality Audit_
