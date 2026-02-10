# TestFlight Deployment Guide

> Nossa Maternidade - iOS TestFlight Deployment
> Last updated: January 24, 2026

---

## 1. Pre-Deployment Checklist

### Code Quality

- [ ] `npm run quality-gate` passa sem erros
- [ ] `npm run typecheck` sem erros TypeScript
- [ ] `npm run test` testes passando
- [ ] `npm run lint` sem warnings criticos

### Environment

- [ ] `.env.local` configurado com todas as variaveis
- [ ] `npm run check-env` valida configuracao
- [ ] EAS secrets configurados (`npm run validate-secrets`)

### iOS Specific

- [ ] `buildNumber` incrementado em `app.config.js`
- [ ] `runtimeVersion` atualizado se houver mudanca nativa
- [ ] Capabilities verificadas no EAS (`eas credentials --platform ios`)

### App Store Connect

- [ ] App criado com Bundle ID `br.com.nossamaternidade.app`
- [ ] In-App Purchases configurados e aprovados
- [ ] TestFlight group "Internal Testers" criado
- [ ] Agreements & Tax aceitos

---

## 2. Build Configuration

### Arquivos Criticos

| Arquivo                     | Proposito                                 |
| --------------------------- | ----------------------------------------- |
| `app.config.js`             | Configuracao Expo (entitlements, plugins) |
| `eas.json`                  | Profiles de build (ios_testflight)        |
| `ios/PrivacyInfo.xcprivacy` | Privacy Manifest iOS 17+                  |

### Profile ios_testflight (eas.json)

```json
{
  "ios_testflight": {
    "extends": "base",
    "distribution": "store",
    "autoIncrement": true,
    "channel": "testflight",
    "ios": {
      "resourceClass": "m-medium",
      "credentialsSource": "remote",
      "image": "latest",
      "buildConfiguration": "Release"
    },
    "env": {
      "EAS_NO_UPDATES": "true",
      "EXPO_PUBLIC_ENV": "production"
    }
  }
}
```

### Entitlements Configurados

- **Push Notifications**: `aps-environment: production`
- **Sign in with Apple**: `com.apple.developer.applesignin`
- **In-App Purchase**: Gerenciado automaticamente pelo RevenueCat
- **Associated Domains**: Deep linking para `nossamaternidade.app`

---

## 3. Code Signing Setup

### EAS Managed (Recomendado)

O EAS gerencia automaticamente:

- Distribution Certificate
- Provisioning Profile
- Push Notification Key

### Verificar Credenciais

```bash
# Listar credenciais
npx eas credentials --platform ios

# Verificar capabilities
npx eas credentials --platform ios
# Selecionar: App > Capabilities
# Garantir: Push Notifications, Sign in with Apple, In-App Purchase
```

### Regenerar se Necessario

```bash
# Regenerar provisioning profile
npx eas credentials --platform ios
# Selecionar: Provisioning Profile > Create new
```

---

## 4. Build Process

### Comandos

```bash
# 1. Limpar cache (IMPORTANTE para resolver crashes)
npm run clean:all
rm -rf ios android

# 2. Reinstalar dependencias
npm install

# 3. Quality gate
npm run quality-gate

# 4. Build para TestFlight
npx eas build --platform ios --profile ios_testflight --clear-cache

# 5. Acompanhar build
npx eas build:view
```

### Build com Auto-Submit

```bash
# Build e submit automatico
npx eas build --platform ios --profile ios_testflight --auto-submit
```

### Apenas Submit (build ja existe)

```bash
# Submit ultimo build
npx eas submit --platform ios --latest

# Submit build especifico
npx eas submit --platform ios --id BUILD_ID
```

---

## 5. TestFlight Configuration

### App Store Connect Setup

1. Acessar [App Store Connect](https://appstoreconnect.apple.com)
2. Ir em **My Apps** > **Nossa Maternidade**
3. Selecionar **TestFlight** tab

### Internal Testing Group

1. **App Store Connect** > **TestFlight** > **Internal Testing**
2. Criar grupo: "Internal Testers"
3. Adicionar testers por email
4. Habilitar **Automatic Distribution**

### Build Distribution

1. Aguardar build aparecer em "Processing" (5-10 min)
2. Aguardar mudanca para "Ready to Test"
3. Se auto-distribute OFF: selecionar build e clicar "Start Testing"

### Compliance

Quando solicitado sobre Export Compliance:

- **Uses encryption?** No (usamos apenas HTTPS padrao)
- Ja configurado no `app.config.js`: `ITSAppUsesNonExemptEncryption: false`

---

## 6. Verification Steps

### QA Checklist Completo (Recomendado)

Use o checklist oficial para validação completa (15 itens, 5-10 min):

📋 **[docs/qa/IOS_QA_CHECKLIST.md](../qa/IOS_QA_CHECKLIST.md)**

### Smoke Tests (Obrigatorios)

| Teste       | Passos                  | Esperado                 |
| ----------- | ----------------------- | ------------------------ |
| Launch      | Abrir app               | App inicia sem crash     |
| Login Email | Criar conta / Login     | Autenticacao funciona    |
| Login Apple | Sign in with Apple      | Autenticacao funciona    |
| NathIA      | Enviar mensagem         | IA responde              |
| Paywall     | Acessar feature premium | Paywall aparece          |
| Purchase    | Tentar comprar          | Flow RevenueCat funciona |
| Push        | Receber notificacao     | Notificacao aparece      |

### Verificar no Device

```bash
# Logs do device (Mac com Xcode)
xcrun devicectl device info --device DEVICE_ID

# Console logs
xcrun devicectl device logs --device DEVICE_ID
```

---

## 7. Troubleshooting

### Crash no Launch (ErrorRecovery.crash)

**Sintoma**: App abre e fecha em < 1 segundo

**Causa**: Cache OTA corrompido do expo-updates

**Solucao**:

1. Verificar `EXUpdatesEnabled: false` no `infoPlist`
2. Bump `runtimeVersion` em `app.config.js`
3. Build com `--clear-cache`
4. No device: deletar app e reinstalar

### Build Falha no EAS

**Verificar logs**:

```bash
npx eas build:view
```

**Problemas comuns**:

- Credenciais expiradas: `npx eas credentials --platform ios`
- Cache corrompido: `--clear-cache`
- Node version: verificar `eas.json` > `base` > `node`

### Upload Falha

**Verificar**:

1. Apple ID correto em `eas.json`
2. ASC App ID correto: `6756980888`
3. Agreements aceitos no App Store Connect
4. Nao ha build em "Processing" (limite de 1)

### Tester Nao Recebe Build

**Verificar**:

1. Email correto no TestFlight group
2. Auto-distribute habilitado
3. Build em status "Ready to Test"
4. Tester aceitou convite TestFlight

### RevenueCat Nao Funciona

**Verificar**:

1. `EXPO_PUBLIC_REVENUECAT_IOS_KEY` configurado
2. App ID no RevenueCat: `br.com.nossamaternidade.app`
3. Products configurados no App Store Connect
4. Sandbox account para teste

---

## 8. CI/CD (GitHub Actions)

### Workflows Disponiveis

| Workflow         | Trigger      | Proposito                     |
| ---------------- | ------------ | ----------------------------- |
| `eas-build.yml`  | Manual       | Build com profile selecionado |
| `production.yml` | Tag `v*.*.*` | Build + Submit automatico     |
| `eas-submit.yml` | Manual       | Submit ultimo build           |

### Deploy Manual via Actions

1. Ir em **Actions** > **EAS Build**
2. Clicar **Run workflow**
3. Selecionar:
   - Platform: `ios`
   - Profile: `ios_testflight`
4. Executar

### Deploy Automatico (Tag)

```bash
# Criar tag de versao
git tag v1.0.2
git push origin v1.0.2
# Workflow production.yml executa automaticamente
```

---

## 9. Constants Reference

| Constante      | Valor                                  |
| -------------- | -------------------------------------- |
| Bundle ID      | `br.com.nossamaternidade.app`          |
| Apple Team ID  | `KZPW4S77UH`                           |
| ASC App ID     | `6756980888`                           |
| Apple ID       | `gabrielvesz_@hotmail.com`             |
| EAS Project ID | `ec07a024-3e98-4023-af9b-1c5ecb9df2af` |

---

## 10. Quick Commands

```bash
# Full deploy (manual)
npm run clean:all && npm install && npm run quality-gate && \
npx eas build --platform ios --profile ios_testflight --clear-cache --auto-submit

# Check build status
npx eas build:list --platform ios --limit 5

# View latest build
npx eas build:view

# Submit latest
npx eas submit --platform ios --latest

# Verify credentials
npx eas credentials --platform ios
```

---

_Document version: 2.0 - January 24, 2026_
