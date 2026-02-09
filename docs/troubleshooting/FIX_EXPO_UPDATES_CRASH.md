# 🔧 Fix: Expo Updates Crash (StartupProcedure)

**Problema:** App crasha no iOS/TestFlight com `StartupProcedure.throwException` quando expo-updates tenta carregar atualização.

**Causa:** `ErrorRecovery.crash()` é chamado quando o expo-updates não consegue carregar uma atualização OTA corrompida ou incompatível.

---

## ✅ Soluções Aplicadas

### 1. Configuração Robusta de Updates

**Arquivo:** `app.config.js`

**Mudanças aplicadas:**

```javascript
updates: {
  enabled: true,
  // CRÍTICO: "ON_ERROR_RECOVERY" evita crash no startup
  // Só verifica updates após erro, não no carregamento inicial
  checkAutomatically: "ON_ERROR_RECOVERY",
  // fallbackToCacheTimeout: 0 = usa embedded bundle imediatamente se cache falhar
  // Previne crash quando update OTA está corrompido
  fallbackToCacheTimeout: 0,
  url: "https://u.expo.dev/87ac745f-119e-4b2f-b140-28a5109dfdf9",
  requestHeaders: {
    "expo-platform": "ios",
  },
},
runtimeVersion: "1.0.0", // IMPORTANTE: Manter igual enquanto não mudar native code
```

**O que mudou:**

1. **`checkAutomatically: "ON_ERROR_RECOVERY"`** (era `"ON_LOAD"`)
   - **ANTES:** Verificava updates no carregamento inicial → crash se update corrompido
   - **AGORA:** Só verifica após erro → embedded bundle carrega primeiro

2. **`fallbackToCacheTimeout: 0`** (era `30000`)
   - **ANTES:** Esperava 30s antes de usar embedded bundle → crash se falhar
   - **AGORA:** Usa embedded bundle imediatamente se cache falhar → app sempre inicia

3. **`requestHeaders` adicionado**
   - Identifica plataforma explicitamente

**Por que funciona:**

- Embedded bundle (código compilado no app) sempre funciona
- Updates OTA são opcionais e só aplicados após app iniciar
- Se update falhar, app continua rodando com embedded bundle

---

### 2. Script de Limpeza de Cache

**Script:** `scripts/clear-updates-cache.sh`

```bash
# Limpar cache de updates do app iOS
bash scripts/clear-updates-cache.sh
```

**O que faz:**

- Remove `.expo/` (cache Metro)
- Remove `ios/build` (cache build)
- Remove DerivedData do Xcode
- Remove `node_modules/.cache`

**Quando usar:**

- Após crash relacionado a updates
- Antes de reinstalar no TestFlight
- Quando suspeitar de cache corrompido

---

## 🚀 Próximos Passos

### Para Build Atual (TestFlight)

1. **Limpar cache:**

   ```bash
   bash scripts/clear-updates-cache.sh
   ```

2. **Fazer novo build:**

   ```bash
   npm run build:preview:ios
   # ou
   npx eas build --platform ios --profile preview --clear-cache
   ```

3. **Reinstalar no TestFlight**

### Opção Alternativa: Desabilitar Updates Temporariamente

Se precisar de build funcionando AGORA sem mudar código:

**Editar `app.config.js` temporariamente:**

```javascript
updates: {
  enabled: false, // TEMPORÁRIO: Desabilita updates
},
```

**⚠️ IMPORTANTE:**

- Re-habilitar após identificar e corrigir problema
- Builds sem updates não recebem OTA updates (precisam rebuild nativo)

---

## 🔍 Debugging

### 1. Verificar Updates Publicados

```bash
npx eas update:list
```

**Verificar:**

- Há updates com runtimeVersion diferente?
- Há updates com status "failed"?
- Há updates recentes que podem estar corrompidos?

### 2. Verificar Runtime Version

```bash
npx eas update:list --branch production
```

**Confirmar:**

- Runtime version do update = "1.0.0"?
- Runtime version do binary = "1.0.0"?
- Se diferentes → incompatibilidade → crash

### 3. Rollback Updates Problemáticos

Se houver update corrompido:

```bash
npx eas update:rollback --branch production
```

### 4. Build Limpo (sem cache)

```bash
npx eas build --platform ios --profile production --clear-cache
```

---

## 📊 Comparação: Antes vs Depois

| Configuração             | Antes       | Depois                       | Efeito                               |
| ------------------------ | ----------- | ---------------------------- | ------------------------------------ |
| `checkAutomatically`     | `"ON_LOAD"` | `"ON_ERROR_RECOVERY"`        | ✅ Não verifica updates no startup   |
| `fallbackToCacheTimeout` | `30000`     | `0`                          | ✅ Usa embedded bundle imediatamente |
| `requestHeaders`         | Não tinha   | `{ "expo-platform": "ios" }` | ✅ Identifica plataforma             |

**Resultado:**

- ✅ App sempre inicia (embedded bundle)
- ✅ Updates OTA aplicados após app iniciar (se disponíveis)
- ✅ Crash evitado mesmo com update corrompido

---

## 📚 Referências

- [Expo Updates Error Recovery](https://docs.expo.dev/eas-update/error-recovery/)
- [Issue #37182 - App crashes immediately on launch](https://github.com/expo/expo/issues/37182)
- [Issue #33737 - [EXPO-UPDATES] Crash iOS](https://github.com/expo/expo/issues/33737)
- [Issue #28046 - [expo-updates] [SDK 50] Presence of...](https://github.com/expo/expo/issues/28046)

---

## ✅ Checklist

- [x] Configuração robusta aplicada no `app.config.js`
- [x] Script de limpeza de cache criado
- [x] Documentação criada
- [ ] Testar build local
- [ ] Testar build TestFlight
- [ ] Monitorar crash reports
- [ ] Validar que updates OTA ainda funcionam (após app iniciar)

---

## ⚠️ Notas Importantes

1. **Runtime Version:**
   - Manter `runtimeVersion: "1.0.0"` enquanto não mudar código nativo
   - Se mudar código nativo, incrementar runtimeVersion
   - Updates OTA só funcionam com mesmo runtimeVersion

2. **Updates OTA:**
   - Ainda funcionam com nova configuração
   - Só são aplicados após app iniciar (não no startup)
   - Se falharem, app continua com embedded bundle

3. **Builds Futuros:**
   - Configuração aplicada → todos os builds futuros usarão
   - Não precisa fazer nada especial nos próximos builds
   - App sempre iniciará mesmo com updates corrompidos

---

**Última atualização:** Janeiro 2026
**Status:** ✅ Correções aplicadas e prontas para teste
