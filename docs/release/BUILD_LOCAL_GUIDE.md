# 📱 Guia de Build Local vs EAS Build

## ⚠️ IMPORTANTE: Build iOS Local

**Build iOS local só funciona no macOS** porque requer:

- Xcode instalado
- Certificados e provisioning profiles configurados
- Ferramentas nativas da Apple

**No Windows:** Você precisa usar **EAS Build** (na nuvem).

---

## 🎯 Opções Disponíveis

### 1️⃣ **Teste Local com Expo Go** (Windows ✅)

Para testar rapidamente sem build:

```bash
npm start
```

Depois escaneie o QR code com:

- **iOS**: App Expo Go (App Store)
- **Android**: App Expo Go (Google Play)

**Limitações:**

- Não testa funcionalidades nativas (câmera, notificações push, etc.)
- Não é o build final que vai para TestFlight

---

### 2️⃣ **Build Preview (EAS Cloud)** ⭐ RECOMENDADO

Para testar antes do TestFlight, use o perfil `preview`:

```bash
# Build iOS Preview (distribuição interna)
npm run build:preview:ios
```

**Ou diretamente:**

```bash
eas build --platform ios --profile preview
```

**Características:**

- ✅ Funciona no Windows
- ✅ Build completo com todas funcionalidades nativas
- ✅ Pode instalar via link direto (não precisa TestFlight)
- ✅ Perfeito para testes antes de enviar para Apple

**Após o build:**

- Você receberá um link para baixar o `.ipa`
- Pode instalar diretamente no dispositivo iOS via link

---

### 3️⃣ **Build Production para TestFlight** (EAS Cloud)

Quando estiver pronto para TestFlight:

```bash
# Build Production iOS
npm run build:prod:ios
```

**Ou diretamente:**

```bash
eas build --platform ios --profile production
```

**Características:**

- ✅ Funciona no Windows
- ✅ Build otimizado para produção
- ✅ Pronto para TestFlight/App Store
- ✅ Inclui todas as otimizações

**Após o build:**

```bash
# Submeter automaticamente para TestFlight
npm run submit:prod:ios
```

**Ou manualmente:**

```bash
eas submit --platform ios --latest
```

---

### 4️⃣ **Build Local (Apenas macOS)** 🍎

Se você tiver acesso a um Mac:

```bash
# Build local production
npm run build:local:ios

# Build local development
npm run build:local:ios:dev
```

**Pré-requisitos no Mac:**

1. Xcode instalado
2. Certificados configurados no Keychain
3. Provisioning profiles configurados
4. Apple Developer Account ativo

**Vantagens:**

- ✅ Mais rápido (não espera fila na nuvem)
- ✅ Não conta para limite de builds EAS
- ✅ Debug mais fácil

---

## 📋 Fluxo Recomendado para Windows

### Passo 1: Teste Local com Expo Go

```bash
npm start
```

- Teste funcionalidades básicas
- Valida navegação e UI

### Passo 2: Build Preview (EAS)

```bash
npm run build:preview:ios
```

- Testa funcionalidades nativas
- Valida integrações (Supabase, RevenueCat, etc.)
- Instala no dispositivo físico via link

### Passo 3: Build Production + TestFlight

```bash
npm run build:prod:ios
npm run submit:prod:ios
```

- Envia para TestFlight
- Testa com beta testers
- Valida antes do lançamento

---

## 🔍 Verificar Builds

```bash
# Listar últimos builds
npm run build:list

# Ver detalhes de um build específico
eas build:view [BUILD_ID]
```

---

## ⚙️ Perfis Disponíveis

| Perfil           | Distribuição | Uso                     | Windows |
| ---------------- | ------------ | ----------------------- | ------- |
| `development`    | Internal     | Dev client              | ✅      |
| `preview`        | Internal     | Testes antes TestFlight | ✅      |
| `ios_preview`    | Internal     | Preview iOS específico  | ✅      |
| `production`     | Store        | TestFlight/App Store    | ✅      |
| `ios_testflight` | Store        | TestFlight específico   | ✅      |

---

## 🚨 Troubleshooting

### Erro: "Build local não suportado no Windows"

- **Solução**: Use `npm run build:preview:ios` ou `npm run build:prod:ios`

### Build Preview muito lento

- **Normal**: Primeiro build pode levar 15-30 minutos
- Builds subsequentes são mais rápidos (cache)

### Erro de credenciais

- **Solução**: Configure credenciais no EAS:

```bash
eas credentials
```

---

## 📝 Checklist Antes do Build

- [ ] Strings de privacidade adicionadas (`app.config.js`)
- [ ] Variáveis de ambiente configuradas
- [ ] `npm run quality-gate` passou
- [ ] Testes locais com Expo Go OK
- [ ] Credenciais EAS configuradas

---

## 💡 Dica Final

**Para desenvolvimento diário no Windows:**

- Use `npm start` + Expo Go
- Rápido e eficiente para desenvolvimento

**Para testes de funcionalidades nativas:**

- Use `npm run build:preview:ios`
- Instala no dispositivo físico

**Para TestFlight:**

- Use `npm run build:prod:ios` + `npm run submit:prod:ios`
- Processo completo automatizado
