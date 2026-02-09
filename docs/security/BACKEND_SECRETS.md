# Backend Secrets - Nossa Maternidade

> Documentacao dos secrets necessarios para o backend funcionar em producao.

## Visao Geral

| Tipo       | Onde Configurar            | Proposito                  |
| ---------- | -------------------------- | -------------------------- |
| **Client** | `.env.local` / EAS Secrets | Variaveis publicas do app  |
| **Server** | Supabase Dashboard         | Secrets das Edge Functions |

---

## 1. Client Secrets (.env.local)

### Obrigatorios

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://xxxxx.supabase.co/functions/v1

# RevenueCat (Monetizacao)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxx
```

### Opcionais (Recomendados)

```env
# Sentry (Error Tracking)
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_AUTH_TOKEN=sntrys_xxxxx

# ElevenLabs (TTS - voz da NathIA)
EXPO_PUBLIC_ELEVENLABS_VOICE_ID=your_voice_id
```

### Como Configurar

```bash
# 1. Copiar exemplo
cp .env.example .env.local

# 2. Editar com valores reais
# (nunca commitar .env.local!)

# 3. Validar configuracao
npm run validate-secrets
```

---

## 2. Server Secrets (Supabase)

### Obrigatorios (AI Edge Function)

| Secret              | Descricao         | Onde Obter                                                   |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| `GEMINI_API_KEY`    | Google Gemini API | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `OPENAI_API_KEY`    | OpenAI API        | [OpenAI Platform](https://platform.openai.com/api-keys)      |
| `ANTHROPIC_API_KEY` | Claude API        | [Anthropic Console](https://console.anthropic.com/)          |

### Opcionais (Mas Recomendados)

| Secret                      | Descricao                 | Onde Obter                                               |
| --------------------------- | ------------------------- | -------------------------------------------------------- |
| `ELEVENLABS_API_KEY`        | Text-to-Speech            | [ElevenLabs](https://elevenlabs.io/app/speech-synthesis) |
| `REVENUECAT_WEBHOOK_SECRET` | Validacao de webhook      | Gerado automaticamente                                   |
| `UPSTASH_REDIS_REST_URL`    | Rate limiting persistente | [Upstash Console](https://console.upstash.com/)          |
| `UPSTASH_REDIS_REST_TOKEN`  | Rate limiting persistente | [Upstash Console](https://console.upstash.com/)          |

### Como Configurar

#### Opcao 1: Via Script (Recomendado)

```bash
# Interativo - guia passo a passo
npm run setup-supabase-secrets
```

#### Opcao 2: Via CLI

```bash
# Project ref: lqahkqfpynypbmhtffyi
supabase secrets set GEMINI_API_KEY=xxx --project-ref lqahkqfpynypbmhtffyi
supabase secrets set OPENAI_API_KEY=xxx --project-ref lqahkqfpynypbmhtffyi
supabase secrets set ANTHROPIC_API_KEY=xxx --project-ref lqahkqfpynypbmhtffyi
```

#### Opcao 3: Via Dashboard

1. Acesse: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/settings/functions
2. Clique em "Add new secret"
3. Adicione cada secret com nome e valor

### Verificar Configuracao

```bash
# Listar secrets configurados (nao mostra valores)
supabase secrets list --project-ref lqahkqfpynypbmhtffyi
```

---

## 3. Prioridade de Providers AI

A Edge Function `/ai` usa fallback chain:

```
1. Gemini 2.5 Flash (DEFAULT) - Rapido, direto
2. Claude Sonnet 4.5 (FALLBACK) - Quando Gemini falha
3. OpenAI GPT-4o (ULTIMO RECURSO) - Emergencia
```

### Casos Especiais

- **Imagens/Ultrassons** -> Claude Vision (sempre)
- **Perguntas medicas** -> Gemini + Google Search (grounding)
- **Crise detectada** -> Claude (modelo mais seguro)

---

## 4. Rate Limiting (Upstash Redis)

### Por que usar?

- Rate limiting persistente (sobrevive a restarts)
- Compartilhado entre Edge Functions
- Metricas de uso

### Como configurar

1. Criar conta em [Upstash](https://console.upstash.com/)
2. Criar database Redis
3. Copiar REST URL e Token
4. Configurar secrets:

```bash
supabase secrets set UPSTASH_REDIS_REST_URL=https://xxx.upstash.io --project-ref lqahkqfpynypbmhtffyi
supabase secrets set UPSTASH_REDIS_REST_TOKEN=AX... --project-ref lqahkqfpynypbmhtffyi
```

### Fallback

Se Redis nao estiver configurado, a Edge Function usa rate limiting em memoria (funciona, mas nao persiste entre invocacoes).

---

## 5. Webhook RevenueCat

### Configurar no RevenueCat Dashboard

1. Acesse: https://app.revenuecat.com/
2. Projeto > Integrations > Webhooks
3. Configure:
   - URL: `https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat`
   - Authorization: Bearer token (gere com `npm run generate-webhook-secret`)

### Configurar Secret

```bash
# Gerar secret
npm run generate-webhook-secret

# Configurar no Supabase
supabase secrets set REVENUECAT_WEBHOOK_SECRET=xxx --project-ref lqahkqfpynypbmhtffyi
```

---

## 6. Checklist de Verificacao

Antes de qualquer build de producao:

```bash
# Verificacao 1-shot completa
npm run verify-backend

# Ou com detalhes
npm run verify-backend:verbose
```

### O que e verificado:

- [x] `.env.local` existe e tem variaveis obrigatorias
- [x] Supabase CLI autenticado
- [x] Secrets do Supabase configurados
- [x] Edge Functions existem
- [x] Migrations existem
- [x] Scripts de deploy existem

---

## 7. Troubleshooting

### Erro: "Invalid or expired token"

- Verifique se `EXPO_PUBLIC_SUPABASE_ANON_KEY` esta correto
- Token pode ter expirado (regenere no Dashboard)

### Erro: "Rate limit exceeded"

- Usuario excedeu 20 req/min
- Se Upstash nao configurado, limite e por instancia (menos preciso)

### Erro: "Gemini API error"

- Verifique se `GEMINI_API_KEY` esta configurado
- Fallback automatico para Claude

### Erro: "Missing webhook secret"

- Configure `REVENUECAT_WEBHOOK_SECRET`
- Em dev, webhook aceita sem validacao (warning no log)

---

**Ultima atualizacao:** Janeiro 2026
