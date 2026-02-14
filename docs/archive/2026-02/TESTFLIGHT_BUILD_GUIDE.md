# TestFlight Build Guide - Nossa Maternidade

## 📋 Pré-requisitos

Antes de fazer o build para TestFlight, certifique-se de que:

- [ ] Conta Apple Developer ativa
- [ ] App criado no App Store Connect
- [ ] EAS CLI instalado: `npm install -g eas-cli`
- [ ] Login no EAS: `eas login`
- [ ] Todas as validações locais passando

## ✅ Validações Obrigatórias

### 1. Quality Gate Completo

```bash
npm run quality-gate
```

Este comando executa:

- ✅ TypeScript typecheck (`tsc --noEmit`)
- ✅ ESLint
- ✅ Build readiness check
- ✅ Console.log scanner
- ✅ Hardcoded colors check

### 2. Verificações Adicionais

```bash
# Verificar variáveis de ambiente
npm run check-env

# Testar OAuth providers
npm run test:oauth

# Testar Gemini AI (NathIA)
npm run test:gemini
```

## 🚀 Build para TestFlight

### Perfil Recomendado: `ios_testflight`

```bash
# Build para TestFlight (auto-incrementa buildNumber)
eas build --platform ios --profile ios_testflight
```

**Configuração do perfil `ios_testflight` (eas.json):**

```json
{
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
    "EXPO_PUBLIC_ENV": "production",
    "EXPO_PUBLIC_ENABLE_AI_FEATURES": "true",
    "EXPO_PUBLIC_ENABLE_GAMIFICATION": "true",
    "EXPO_PUBLIC_ENABLE_ANALYTICS": "true",
    "EXPO_PUBLIC_SOCIAL_LOGIN_ENABLED": "true"
  }
}
```

### Perfis Alternativos

#### Preview (Internal Testing - Sem App Store)

```bash
eas build --platform ios --profile preview
```

#### Production (App Store Release)

```bash
npm run build:prod:ios
# ou
eas build --platform ios --profile production
```

## 📤 Submeter para TestFlight

### Automático (Recomendado)

```bash
# Submeter o último build do perfil ios_testflight
eas submit --platform ios --profile ios_testflight --latest
```

### Manual via App Store Connect

1. Acesse https://appstoreconnect.apple.com
2. Selecione **Nossa Maternidade**
3. Aba **TestFlight**
4. Aguarde o build processar (pode levar 15-30 minutos)
5. Configure informações de teste
6. Adicione testadores

## 🔐 Credenciais e Secrets

### Credenciais Apple (Gerenciadas pelo EAS)

O EAS gerencia automaticamente:

- ✅ Certificados de distribuição
- ✅ Provisioning profiles
- ✅ Push notification keys

**Configurado em eas.json:**

```json
"ios": {
  "credentialsSource": "remote"
}
```

### App Store Connect Info

```json
"submit": {
  "ios_testflight": {
    "ios": {
      "appleId": "gabrielvesz_@hotmail.com",
      "ascAppId": "6756980888",
      "appleTeamId": "KZPW4S77UH"
    }
  }
}
```

### Secrets EAS (Environment Variables)

Configurados uma vez via EAS CLI:

```bash
# Supabase (Obrigatórios)
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://lqahkqfpynypbmhtffyi.supabase.co" --scope project
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." --scope project
eas secret:create --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1" --scope project

# RevenueCat (Obrigatórios para IAP)
eas secret:create --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_qYAhdJlewUtgaKBDWEAmZsCRIqK" --scope project
eas secret:create --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "goog_YSHALitkRyhugtDvYVVQVmqrqDu" --scope project
```

**Verificar secrets configurados:**

```bash
eas secret:list
```

## 📱 Configuração do App (app.config.js)

### Bundle Identifier

```javascript
ios: {
  bundleIdentifier: "br.com.nossamaternidade.app",
  buildNumber: "48", // Auto-incrementado no perfil ios_testflight
}
```

### Versão

```javascript
version: "1.0.1";
```

### Permissões iOS Configuradas

```javascript
infoPlist: {
  NSCameraUsageDescription: "Este aplicativo precisa acessar a câmera para capturar fotos.",
  NSPhotoLibraryUsageDescription: "Este aplicativo precisa acessar a biblioteca de fotos para selecionar imagens.",
  NSPhotoLibraryAddUsageDescription: "Este aplicativo precisa salvar fotos na sua biblioteca.",
  NSContactsUsageDescription: "O Nossa Maternidade pode precisar acessar seus contatos para funcionalidades futuras de compartilhamento e convites para grupos da comunidade.",
  NSCalendarsUsageDescription: "O Nossa Maternidade pode precisar acessar seu calendário para lembrá-la de consultas médicas, check-ins diários e eventos importantes da sua jornada de maternidade.",
  NSLocationWhenInUseUsageDescription: "O Nossa Maternidade pode usar sua localização para recomendar grupos da comunidade próximos a você e personalizar conteúdo regional.",
  ITSAppUsesNonExemptEncryption: false,
}
```

### Capabilities Habilitadas

```javascript
entitlements: {
  "aps-environment": "production",
  "com.apple.developer.applesignin": ["Default"],
}
```

### Privacy Manifest (iOS 17+)

Privacy Manifest configurado com:

- ✅ Coleta de dados (email, nome, saúde)
- ✅ APIs acessadas (UserDefaults, FileTimestamp, SystemBootTime, DiskSpace)
- ✅ Sem tracking
- ✅ Razões de uso documentadas

## 🧪 Testadores TestFlight

### Adicionar Testadores Internos

1. App Store Connect → TestFlight → Internal Testing
2. Adicionar testadores da sua equipe Apple Developer
3. Limite: 100 testadores internos

### Adicionar Testadores Externos

1. App Store Connect → TestFlight → External Testing
2. Criar grupo de teste
3. Adicionar testadores por email
4. Limite: 10.000 testadores externos
5. **IMPORTANTE:** Requer aprovação da Apple (1-2 dias)

### Link Público TestFlight (Opcional)

1. Criar link público em External Testing
2. Limite: 10.000 instalações
3. Compartilhar link: `https://testflight.apple.com/join/XXXXXXXX`

## 📊 Monitoramento

### Acompanhar Build

```bash
# Listar builds recentes
eas build:list --platform ios --limit 10

# Ver detalhes de um build específico
eas build:view [BUILD_ID]
```

### Logs de Build

```bash
# Ver logs em tempo real
eas build:view [BUILD_ID] --logs
```

### Crash Reports

1. App Store Connect → TestFlight → Crashes
2. Também disponível em Sentry (se configurado)

## 🐛 Troubleshooting

### Build Falha com "TypeScript errors"

**Solução:**

```bash
npm run typecheck
# Corrigir erros e tentar novamente
```

### Build Falha com "Missing credentials"

**Solução:**

```bash
# Gerar credenciais novamente
eas credentials --platform ios
```

### Build Falha com "Secrets not found"

**Solução:**

```bash
# Verificar se secrets estão configurados
eas secret:list

# Criar secrets faltantes
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "..." --scope project
```

### App Crashando ao Abrir no TestFlight

**Solução:**

1. Verificar logs no App Store Connect → TestFlight → Crashes
2. Verificar se todas as variáveis de ambiente estão configuradas
3. Verificar se o runtimeVersion mudou (pode invalidar cache)

### Submission Rejeitada

**Solução:**

1. Verificar email da Apple Developer
2. Corrigir issues apontados
3. Fazer novo build
4. Resubmeter

## 📝 Checklist Completo

### Antes do Build

- [ ] `npm run quality-gate` passou sem erros
- [ ] Secrets EAS configurados
- [ ] Versão/buildNumber atualizados se necessário
- [ ] Changelog documentado

### Durante o Build

- [ ] Build iniciado com `eas build --platform ios --profile ios_testflight`
- [ ] Monitorar logs em caso de erro
- [ ] Aguardar conclusão (15-30 minutos)

### Após Build Completar

- [ ] Verificar build no EAS: `eas build:list`
- [ ] Submeter para TestFlight: `eas submit --platform ios --profile ios_testflight --latest`
- [ ] Aguardar processamento no App Store Connect (15-30 min)

### Configurar TestFlight

- [ ] Adicionar "What to Test" notes
- [ ] Configurar informações de teste
- [ ] Adicionar testadores
- [ ] Enviar notificações de build

### Testar

- [ ] Instalar via TestFlight
- [ ] Testar fluxo de onboarding
- [ ] Testar login/autenticação
- [ ] Testar funcionalidades principais
- [ ] Coletar feedback dos testadores

## 🔗 Referências

- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [Documentação EAS Submit](https://docs.expo.dev/submit/introduction/)
- [Apple TestFlight](https://developer.apple.com/testflight/)
- [App Store Connect](https://appstoreconnect.apple.com)

## 📞 Suporte

- EAS Status: https://status.expo.dev/
- Expo Discord: https://chat.expo.dev/
- GitHub Issues: https://github.com/LionGab/NossaMaternidade/issues

---

**Última atualização:** 2026-02-01
**Versão:** 1.0.1
**Build:** 48+
