# Checklist de Lançamento - Ações Imediatas

**Data**: 29 de dezembro de 2025
**Status**: 🔴 Crítico - Ações necessárias antes do lançamento

---

## ✅ Correções Aplicadas no Código

### 1. Product IDs Padronizados

**Problema identificado**: Inconsistência entre arquivos:

- `src/services/revenuecat.ts` → `nossa_maternidade_monthly` / `nossa_maternidade_yearly` ✅
- `src/types/premium.ts` → `com.nossamaternidade.subscription.monthly` / `com.nossamaternidade.subscription.annual` ❌
- `src/state/premium-store.ts` → hardcoded `nossa_maternidade_yearly` ✅

**Solução**: Padronizar TODOS os arquivos para usar:

- `nossa_maternidade_monthly` (Mensal)
- `nossa_maternidade_yearly` (Anual)

**Arquivos corrigidos**:

- ✅ `src/types/premium.ts` - Atualizado para usar IDs corretos
- ✅ `src/state/premium-store.ts` - Já estava correto

---

## 🔴 Nível 1: Crítico (Impede o Lançamento)

### Item 1: Credenciais de Build (Android)

**Status**: ❌ Pendente
**Arquivo necessário**: `google-play-service-account.json`
**Localização**: Raiz do projeto (`./google-play-service-account.json`)

**Como obter**:

1. Acesse: https://console.cloud.google.com
2. Selecione o projeto do Google Play Console
3. Vá em **IAM & Admin** → **Service Accounts**
4. Crie uma nova Service Account ou use existente
5. Baixe o JSON da chave
6. No Google Play Console, vá em **Setup** → **API access**
7. Conceda permissões à Service Account:
   - ✅ View financial data
   - ✅ Manage orders and subscriptions
8. Salve o arquivo como `google-play-service-account.json` na raiz do projeto

**Verificação**:

```bash
# O arquivo deve existir na raiz
ls -la google-play-service-account.json

# O .gitignore já está configurado (linha 95)
```

---

### Item 2: Credenciais de Build (iOS)

**Status**: ❌ Pendente
**Arquivo necessário**: `ApiKey_E7IV510UXU7D.p8`
**Localização**: Raiz do projeto (`./ApiKey_E7IV510UXU7D.p8`)

**Como obter**:

1. Acesse: https://appstoreconnect.apple.com
2. Vá em **Users and Access** → **Keys** → **App Store Connect API**
3. Se a chave `E7IV510UXU7D` já existe:
   - Clique em **Download** (só pode baixar uma vez!)
   - Salve como `ApiKey_E7IV510UXU7D.p8`
4. Se não existe:
   - Clique em **Generate API Key**
   - Nome: `EAS Build Key`
   - Access: **Admin** ou **App Manager**
   - Baixe o `.p8` e anote:
     - Key ID: `E7IV510UXU7D`
     - Issuer ID: `f483d4df-0161-497b-8936-729c4674d1ab` (já configurado no `eas.json`)

**Verificação**:

```bash
# O arquivo deve existir na raiz
ls -la ApiKey_E7IV510UXU7D.p8

# O .gitignore já está configurado (linha 16: *.p8)
```

---

### Item 3: Produtos na App Store Connect (iOS)

**Status**: ❌ Pendente
**Product IDs necessários**:

- `nossa_maternidade_monthly` (R$ 19,99/mês)
- `nossa_maternidade_yearly` (R$ 79,99/ano)

**Passos**:

1. Acesse: https://appstoreconnect.apple.com
2. Selecione app: **Nossa Maternidade** (Bundle ID: `br.com.nossamaternidade.app`)
3. Vá em **Features** → **Subscriptions**
4. Clique em **Create Subscription Group**:
   - Nome: `Nossa Maternidade Premium`
5. Dentro do grupo, crie **2 produtos**:

**Produto 1 - Mensal**:

- Product ID: `nossa_maternidade_monthly` ⚠️ **EXATO**
- Duration: `1 month`
- Price: `R$ 19,99` (BRL)
- Display Name: `Plano Mensal`
- Description: `Acesso completo mensal ao Nossa Maternidade Premium`
- Free Trial: `7 days` (opcional, recomendado)

**Produto 2 - Anual**:

- Product ID: `nossa_maternidade_yearly` ⚠️ **EXATO**
- Duration: `1 year`
- Price: `R$ 79,99` (BRL)
- Display Name: `Plano Anual`
- Description: `Acesso completo anual - Economize 67% (R$ 6,67/mês)`
- Free Trial: `7 days` (opcional, recomendado)

6. Salve e aguarde aprovação (até 24h)

**⚠️ CRÍTICO**: Os Product IDs devem ser **EXATAMENTE** como acima (sem `com.` no início)

---

### Item 4: Produtos no Google Play Console (Android)

**Status**: ❌ Pendente
**Product IDs necessários**:

- `nossa_maternidade_monthly` (R$ 19,99/mês)
- `nossa_maternidade_yearly` (R$ 79,99/ano)

**Passos**:

1. Acesse: https://play.google.com/console
2. Selecione app: **Nossa Maternidade** (Package: `com.liongab.nossamaternidade`)
3. Vá em **Monetization** → **Subscriptions**
4. Clique em **Create subscription**

**Produto 1 - Mensal**:

- Product ID: `nossa_maternidade_monthly` ⚠️ **EXATO**
- Billing period: `Monthly`
- Price: `R$ 19,99` (BRL)
- Title: `Plano Mensal`
- Description: `Acesso completo mensal ao Nossa Maternidade Premium`
- Free trial: `7 days` (opcional)

**Produto 2 - Anual**:

- Product ID: `nossa_maternidade_yearly` ⚠️ **EXATO**
- Billing period: `Yearly`
- Price: `R$ 79,99` (BRL)
- Title: `Plano Anual`
- Description: `Acesso completo anual - Economize 67% (R$ 6,67/mês)`
- Free trial: `7 days` (opcional)

5. Salve e aguarde aprovação

**⚠️ CRÍTICO**: Os Product IDs devem ser **EXATAMENTE** como acima (mesmos IDs do iOS)

---

### Item 5: Secret do Webhook (Supabase)

**Status**: ❌ Pendente
**Variável necessária**: `REVENUECAT_WEBHOOK_SECRET`
**Localização**: Supabase Dashboard → Edge Functions → Secrets

**Passos**:

1. **Gerar secret** (terminal):

   ```bash
   openssl rand -base64 32
   ```

   Copie o resultado (exemplo: `aBc123XyZ456...`)

2. **Configurar no Supabase**:
   - Acesse: https://app.supabase.com/project/lqahkqfpynypbmhtffyi/settings/functions
   - Clique em **Add secret**
   - Name: `REVENUECAT_WEBHOOK_SECRET`
   - Value: `<valor gerado no passo 1>`
   - Save

3. **Configurar no RevenueCat**:
   - Acesse: https://app.revenuecat.com
   - Vá em **Project Settings** → **Webhooks**
   - Clique em **Add Webhook**
   - URL: `https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook`
   - Authorization Header: `Bearer <REVENUECAT_WEBHOOK_SECRET>` (mesmo do passo 2)
   - Webhook Secret: `<mesmo valor do passo 1>`
   - Events: Selecione todos (ou pelo menos `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`)
   - Save

**Verificação**:

```bash
# Verificar se o secret está configurado
npx supabase secrets list
# Deve aparecer: REVENUECAT_WEBHOOK_SECRET
```

---

## 🟡 Nível 2: Alta Prioridade

### Item 6: API Keys para IA (Supabase)

**Status**: ❌ Pendente
**Variáveis necessárias**:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY` (Claude)
- `GEMINI_API_KEY`

**Passos**:

1. Acesse: https://app.supabase.com/project/lqahkqfpynypbmhtffyi/settings/functions
2. Para cada key, clique em **Add secret**:
   - `OPENAI_API_KEY` = `<sua chave OpenAI>`
   - `ANTHROPIC_API_KEY` = `<sua chave Anthropic>`
   - `GEMINI_API_KEY` = `<sua chave Gemini>`

**⚠️ IMPORTANTE**:

- Essas keys NÃO devem ter prefixo `EXPO_PUBLIC_*`
- Elas ficam APENAS no Supabase (backend)
- O app chama a Edge Function `/ai` que usa essas keys

---

### Item 7: API Key da ElevenLabs (Supabase)

**Status**: ❌ Pendente
**Variável necessária**: `ELEVENLABS_API_KEY`

**Passos**:

1. Acesse: https://app.supabase.com/project/lqahkqfpynypbmhtffyi/settings/functions
2. Clique em **Add secret**:
   - Name: `ELEVENLABS_API_KEY`
   - Value: `<sua chave ElevenLabs>`
   - Save

**Verificação**:

- Edge Function `elevenlabs-tts` deve estar deployada
- Testar com: `npx supabase functions invoke elevenlabs-tts`

---

### Item 8: Variáveis de Ambiente no App

**Status**: ⚠️ Incompleto
**Arquivo**: `.env.local` (raiz do projeto)

**Variáveis opcionais** (preencher se necessário):

```bash
# Imgur - Upload de imagens (opcional)
EXPO_PUBLIC_IMGUR_CLIENT_ID=

# Sentry - Error Tracking (opcional, mas recomendado)
EXPO_PUBLIC_SENTRY_DSN=

# Stripe - Pagamentos diretos (opcional, se não usar RevenueCat)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# OneSignal - Push Notifications (opcional)
EXPO_PUBLIC_ONESIGNAL_APP_ID=
```

**Nota**: Essas variáveis são opcionais. O app funciona sem elas, mas algumas funcionalidades ficarão desabilitadas.

---

## 🟢 Nível 3: Opcional

### Item 9: Rate Limiting (IA)

**Status**: ⚠️ Opcional
**Variáveis necessárias**:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

**Quando configurar**: Se quiser limitar o uso de IA por usuário (prevenir abuse)

**Passos**:

1. Criar conta em: https://upstash.com
2. Criar Redis database
3. Copiar `REST_URL` e `REST_TOKEN`
4. Adicionar no Supabase Secrets (mesmo processo do Item 6)

---

### Item 10: Disponibilidade (Países)

**Status**: ⏳ A Configurar
**Ação**: Configurar manualmente nas lojas

**App Store Connect**:

- Vá em **App Information** → **Availability**
- Selecione países desejados

**Google Play Console**:

- Vá em **Store presence** → **Pricing & distribution**
- Selecione países desejados

---

## 📋 Resumo de Ações Imediatas

### Prioridade 1 (Hoje - Bloqueia Builds):

1. ✅ Corrigir Product IDs no código (FEITO)
2. ⏳ Adicionar `google-play-service-account.json` na raiz
3. ⏳ Adicionar `ApiKey_E7IV510UXU7D.p8` na raiz

### Prioridade 2 (Esta Semana - Bloqueia Lançamento):

4. ⏳ Criar produtos no App Store Connect
5. ⏳ Criar produtos no Google Play Console
6. ⏳ Configurar `REVENUECAT_WEBHOOK_SECRET` no Supabase + RevenueCat

### Prioridade 3 (Antes do Lançamento):

7. ⏳ Configurar API keys de IA no Supabase
8. ⏳ Configurar `ELEVENLABS_API_KEY` no Supabase
9. ⏳ Preencher variáveis opcionais no `.env.local` (se necessário)

---

## ✅ Validação Final

Após completar todos os itens críticos, validar:

```bash
# 1. Verificar arquivos de credenciais
ls -la google-play-service-account.json ApiKey_E7IV510UXU7D.p8

# 2. Verificar Product IDs no código
grep -r "nossa_maternidade_monthly" src/

# 3. Testar build local (se possível)
npx expo prebuild --clean

# 4. Verificar secrets no Supabase
npx supabase secrets list
```

---

**Última atualização**: 29 de dezembro de 2025
