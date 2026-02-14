# TestFlight Release Guide — Nossa Maternidade

> **Guia oficial e único** para fazer builds TestFlight do app Nossa Maternidade.
> Última atualização: 14 de fevereiro de 2026

---

## Pré-requisitos

✅ **Conta Apple Developer ativa** (br.com.nossamaternidade.app)
✅ **EAS CLI instalado**: `npm install -g eas-cli`
✅ **Autenticado no EAS**: `eas login`
✅ **App criado no App Store Connect**
✅ **Bundle ID**: `br.com.nossamaternidade.app`
✅ **Quality gate passou**: `npm run quality-gate`

---

## Build TestFlight (Passo a Passo)

### 1. Validar Ambiente

```bash
# 1.1 Verificar versão atual
cat package.json | grep '"version"'
# ✅ Deve mostrar: "version": "1.0.1"

# 1.2 Validar código
npm run quality-gate
# ✅ TypeScript OK
# ✅ ESLint OK
# ✅ Build-readiness OK
# ✅ No console.log in src/
```

### 2. Fazer Build

```bash
# 2.1 Build para TestFlight (recomendado)
eas build --platform ios --profile ios_testflight

# OU (alias curto)
eas build --platform ios --profile testflight

# 2.2 Aguardar build (15-25 minutos)
# EAS vai:
# - Auto-incrementar build number
# - Usar credenciais remotas (certificados Apple)
# - Compilar em Release mode
# - Gerar IPA assinado
```

**Profiles disponíveis** (ver `eas.json`):

| Profile          | Distribuição | Uso                        | Auto-increment |
| ---------------- | ------------ | -------------------------- | -------------- |
| `development`    | internal     | Dev client (Expo Go)       | ❌             |
| `ios_preview`    | internal     | Ad-hoc testing             | ❌             |
| `ios_testflight` | store        | **TestFlight** (produção)  | ✅             |
| `testflight`     | store        | Alias de `ios_testflight`  | ✅             |
| `production`     | store        | App Store (release final)  | ✅             |

### 3. Submit para TestFlight

#### 3.1 Automatic Submit (Recomendado)

```bash
# Submit automático após build bem-sucedido
eas submit --platform ios --profile ios_testflight --latest
```

#### 3.2 Manual Submit (App Store Connect)

1. Acesse: https://appstoreconnect.apple.com
2. **My Apps** → **Nossa Maternidade**
3. **TestFlight** tab
4. Build aparece automaticamente (pode levar 5-10min)
5. **Missing Compliance** → Adicionar Export Compliance Info:
   - "Does your app use encryption?" → **NO** (se não usar criptografia customizada)
   - OU **YES** + justificar (se usar HTTPS, end-to-end crypto, etc.)

### 4. Adicionar Testadores

#### 4.1 Testadores Internos (Até 100)

1. App Store Connect → **TestFlight** → **Internal Testing**
2. **Testers** → **+** → Adicionar emails
3. Testadores recebem email com link para App TestFlight

**Requisito**: Testadores internos precisam estar no **App Store Connect** com role de:
- Admin, App Manager, Developer, ou Marketing

#### 4.2 Testadores Externos (Até 10.000)

1. **External Testing** → **+** → Criar grupo
2. Adicionar build
3. **Apple Review** (pode levar 24-48h)
4. Após aprovado → Adicionar testadores por email ou public link

### 5. Testadores Instalam

1. **Instalar App TestFlight** (App Store oficial)
2. Abrir link recebido por email OU redeem code
3. App aparece no TestFlight
4. **Install** → App instalado no device

---

## Troubleshooting

### Build falha com "Provisioning profile error"

```bash
# Limpar credenciais e recriar
eas credentials --platform ios
# Select: Select build credentials → Clear all credentials
# Build novamente: build vai recriar certificados
```

### "Missing Compliance" não aparece

- Aguardar 10-15 minutos após build aparecer
- Refresh página do App Store Connect
- Se não aparecer: build pode estar em processing (aguardar)

### Build demora mais de 30 minutos

- Verificar EAS status: https://status.expo.dev
- Verificar queue: `eas build:list --limit 5`
- Considerar usar resource class maior (m-large) se recorrente

### Testadores não recebem email

- Verificar spam/junk folder
- Reenviar: TestFlight → Testers → **Resend Invitation**
- Limite: 100 internal, 10.000 external

---

## Configuração de Build (Referência)

### `eas.json` — Profile `ios_testflight`

```jsonc
{
  "ios_testflight": {
    "extends": "base",
    "distribution": "store",           // Required for TestFlight
    "channel": "testflight",            // OTA update channel
    "autoIncrement": true,              // Auto-bump build number
    "ios": {
      "resourceClass": "m-medium",      // Build performance
      "credentialsSource": "remote",    // EAS manages certs
      "image": "latest",                // Latest Xcode
      "buildConfiguration": "Release"   // Production build
    },
    "env": {
      "EAS_NO_UPDATES": "true",         // Prevent startup crashes
      "EXPO_PUBLIC_ENV": "production",  // Production mode
      "EXPO_PUBLIC_SAFE_BOOT": "true"   // Skip dangerous startup code
      // ... other env vars
    }
  }
}
```

### `package.json` — Versioning

```json
{
  "name": "nossa-maternidade",
  "version": "1.0.1"  // Semantic version (user-facing)
}
```

**Build number** é auto-incrementado pelo EAS (não manual).

---

## Workflow Completo

```
┌─────────────────────┐
│ npm run quality-gate│  ← Validar código
└──────────┬──────────┘
           ↓
┌─────────────────────────────────────────┐
│ eas build --platform ios --profile      │  ← Build (15-25min)
│ ios_testflight                          │
└──────────┬──────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ eas submit --platform ios --latest      │  ← Submit (5-10min)
└──────────┬──────────────────────────────┘
           ↓
┌─────────────────────┐
│ App Store Connect   │  ← Adicionar testadores
│ → TestFlight        │     Configurar compliance
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Testadores instalam │  ← Via App TestFlight
│ via App TestFlight  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Coletar feedback    │  ← Crashlytics, TestFlight feedback
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Iterar e fazer novo │  ← Repetir ciclo
│ build se necessário │
└─────────────────────┘
```

---

## FAQ

**Q: Preciso mudar `version` em `package.json` toda vez?**
A: Não. Só mude quando fizer release de nova versão (1.0.1 → 1.0.2). Build number é auto-gerenciado.

**Q: Como sei qual build number será usado?**
A: EAS auto-incrementa. Ver último build: `eas build:list --limit 1`

**Q: Posso fazer build local (no meu Mac)?**
A: Sim, mas **não recomendado**. EAS Cloud é mais confiável e gerencia certificados automaticamente.

**Q: Quanto tempo demora para testadores receberem build?**
A: Internos: imediato. Externos: 24-48h (Apple Review).

**Q: Quantos builds posso fazer por dia?**
A: Ilimitado, mas considere CI/CD quota do plano EAS.

---

## Comandos Rápidos

```bash
# Quality gate
npm run quality-gate

# Build TestFlight
eas build --platform ios --profile ios_testflight

# Submit para TestFlight
eas submit --platform ios --latest

# Listar builds recentes
eas build:list --limit 10

# Ver status de build específico
eas build:view <build-id>

# Cancelar build em andamento
eas build:cancel <build-id>

# Login/re-auth EAS
eas login

# Ver credenciais iOS
eas credentials --platform ios
```

---

## Referências

- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/
- **TestFlight**: https://developer.apple.com/testflight/
- **App Store Connect**: https://appstoreconnect.apple.com

---

**Última atualização**: 14/02/2026
**Versão do guia**: 1.0
**Mantenedor**: Lion (@LionGab)
