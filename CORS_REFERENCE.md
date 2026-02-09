# 📋 GUIA DE REFERÊNCIA RÁPIDA - CORS CENTRALIZADO

## ✅ Checklist para Novas Edge Functions

Ao criar uma nova Edge Function, siga este checklist:

### 1. Imports

```typescript
import { buildCorsHeaders, handlePreflight } from "../_shared/cors.ts";
```

### 2. Handler Setup

```typescript
Deno.serve(async (req) => {
  // CORS preflight (sempre primeiro!)
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  // Rest of handler...
});
```

### 3. Helper Function

```typescript
function jsonResponse(data: unknown, status: number, requestObj: Request): Response {
  const headers = buildCorsHeaders(requestObj);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}
```

### 4. Usage

```typescript
// Always pass `req` as third parameter
return jsonResponse({ error: "Not found" }, 404, req);
```

### 5. Para SSE (Streaming)

```typescript
function sseResponse(stream: ReadableStream, requestObj: Request): Response {
  const headers = buildCorsHeaders(requestObj);
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Connection", "keep-alive");
  return new Response(stream, { headers });
}
```

## 🔒 Configuração de Secrets

Em `supabase/secrets.json` ou via Supabase Dashboard:

```
ALLOWED_ORIGINS=https://nossamaternidade.com.br,https://www.nossamaternidade.com.br,exp://,http://localhost:8081
```

## 📚 Arquivos Centralizados

### `supabase/functions/_shared/cors.ts`

- `buildCorsHeaders(req: Request): Headers` - Constrói headers CORS baseado no origin
- `handlePreflight(req: Request): Response | null` - Gerencia OPTIONS requests
- `isOriginAllowed(req: Request): boolean` - Valida origin
- `getAllowedOrigins(): string[]` - Retorna originais configuradas

## 🚫 NUNCA FAÇA

❌ **Não hardcode ALLOWED_ORIGINS**

```typescript
// ERRADO:
const ALLOWED_ORIGINS = ["https://example.com"];
```

❌ **Não implemente preflight manualmente**

```typescript
// ERRADO:
if (req.method === "OPTIONS") {
  return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
}
```

❌ **Não crie headers CORS manualmente**

```typescript
// ERRADO:
headers: {
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "GET,POST",
  // ...
}
```

## ✅ SEMPRE FAÇA

✅ **Use handlePreflight()**

```typescript
const preflightResponse = handlePreflight(req);
if (preflightResponse) return preflightResponse;
```

✅ **Use buildCorsHeaders()**

```typescript
const headers = buildCorsHeaders(req);
// headers já contém Access-Control-Allow-Origin, Vary, etc
```

✅ **Passe o `req` para helpers**

```typescript
return jsonResponse(data, status, req); // req, não origin string
```

## 🧪 Testando CORS

### Preflight (OPTIONS)

```bash
curl -X OPTIONS https://api.nossamaternidade.com/functions/v1/ai \
  -H "Origin: https://nossamaternidade.com.br" \
  -v
```

Resposta esperada:

```
< HTTP/1.1 204 No Content
< Access-Control-Allow-Origin: https://nossamaternidade.com.br
< Vary: Origin
< Access-Control-Allow-Methods: GET,POST,OPTIONS
```

### Requisição Simples (GET/POST)

```bash
curl -X POST https://api.nossamaternidade.com/functions/v1/ai \
  -H "Origin: https://nossamaternidade.com.br" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' \
  -v
```

Resposta esperada:

```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: https://nossamaternidade.com.br
< Content-Type: application/json
```

## 🔍 Debug: Origem Não Permitida

Se receber erro de CORS no cliente:

1. Verifique o valor de `ALLOWED_ORIGINS` em Supabase Secrets
2. Verifique que a origem da requisição é exata (protocolo, domínio, porta)
3. Para apps nativos, a função permite sem header Origin
4. Verifique os logs da função

## 📞 Suporte

Dúvidas? Consulte:

- `supabase/functions/_shared/cors.ts` - Implementação
- `supabase/functions/ai/index.ts` - Exemplo completo com SSE
- `supabase/functions/delete-account/index.ts` - Exemplo simples

---

**Versão**: 1.0.0
**Data**: Janeiro 2025
**Mantém**: Projeto Nossa Maternidade
