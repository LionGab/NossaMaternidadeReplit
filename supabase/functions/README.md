# Supabase Edge Functions — Deploy Notes

## Secrets Necessários

### CORS Allowlist (`ALLOWED_ORIGINS`)

Configure no **Supabase Dashboard → Edge Functions → Secrets**:

```
ALLOWED_ORIGINS=https://app.nossamaternidade.com,https://admin.nossamaternidade.com
```

> **Observações:**
>
> - Chamadas nativas (sem header `Origin`) continuam funcionando normalmente
> - Chamadas Web com `Origin` fora da allowlist recebem **403 Forbidden**
> - Preflight (OPTIONS) retorna **204** para origins permitidas

### Outras Variáveis de Ambiente

As seguintes variáveis são configuradas automaticamente pelo Supabase:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Deploy das Functions

### Deploy Individual

```bash
# Deploy community-feed
npx supabase functions deploy community-feed

# Deploy outras functions
npx supabase functions deploy ai
npx supabase functions deploy crm-lifecycle
npx supabase functions deploy moderate-content
npx supabase functions deploy mundo-nath-feed
```

### Deploy de Todas

```bash
npx supabase functions deploy
```

## Verificação Pós-Deploy

### Testes CORS

1. **Web (origin permitido):** deve retornar `200 OK`
2. **Web (origin não permitido):** deve retornar `403 Forbidden`
3. **Preflight (OPTIONS):** deve retornar `204 No Content`
4. **Chamada nativa (sem Origin):** deve retornar `200 OK`

### Exemplo de Teste com cURL

```bash
# Origin permitido
curl -i -X POST \
  -H "Origin: https://app.nossamaternidade.com" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "limit": 10, "type": "feed"}' \
  https://YOUR_PROJECT.supabase.co/functions/v1/community-feed

# Origin não permitido (deve retornar 403)
curl -i -X POST \
  -H "Origin: https://malicious-site.com" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"page": 1, "limit": 10, "type": "feed"}' \
  https://YOUR_PROJECT.supabase.co/functions/v1/community-feed
```

## Estrutura das Functions

```
supabase/functions/
├── _shared/
│   ├── cors.ts          # CORS helper (allowlist-based)
│   └── circuit-breaker.ts
├── ai/
├── analytics/
├── community-feed/      # Feed da comunidade
├── crm-lifecycle/       # Attribution, paywall experiments, CRM journeys
├── delete-account/
├── elevenlabs-tts/
├── export-data/
├── moderate-content/
├── mundo-nath-feed/
├── notifications/
├── transcribe/
├── upload-image/
└── webhook/
```

## Troubleshooting

### 403 Forbidden em chamadas Web

1. Verifique se `ALLOWED_ORIGINS` está configurado corretamente
2. Confirme que a origin da requisição está na lista
3. Verifique se não há espaços extras na variável

### Erro de CORS no navegador

1. Verifique se preflight (OPTIONS) está funcionando
2. Confirme headers `Access-Control-Allow-*` na resposta
3. Verifique se `Access-Control-Allow-Credentials: true` está presente
