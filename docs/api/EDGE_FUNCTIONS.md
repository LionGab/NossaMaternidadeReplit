# Edge Functions - Nossa Maternidade

## Visão Geral

Edge Functions são funções serverless que rodam no Supabase Edge (Deno).

**Localização:** `supabase/functions/`

---

## Funções Disponíveis

### 1. `/ai` - Assistente NathIA

**Endpoint:** `POST /functions/v1/ai`

**Descrição:** Processa mensagens de chat com múltiplos providers de IA.

**Features:**

- Claude Sonnet 4.5 (principal)
- Gemini 2.0 Flash (com grounding)
- OpenAI GPT-4o (fallback)
- Rate limiting via Upstash Redis (20 req/min, 50K tokens/min)
- Fallback automático para in-memory se Redis offline
- JWT validation
- Suporte a imagens (vision)

**Request:**

```typescript
{
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  provider?: "claude" | "gemini";
  systemPrompt?: string;
  grounding?: boolean; // Ativa Google Search no Gemini
  imageData?: { base64: string; mediaType: string };
}
```

**Response:**

```typescript
{
  content: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  provider: string;
  latency: number;
  grounding?: { citations: Array<{ title: string; url: string }> };
}
```

---

### 2. `/delete-account` - Deletar Conta (LGPD)

**Endpoint:** `POST /functions/v1/delete-account`

**Descrição:** Deleta permanentemente a conta do usuário e todos os dados associados.

**Features:**

- JWT validation obrigatório
- Confirmação explícita requerida
- Cascade deletion de todas as tabelas
- Deleção do auth user
- Audit logging
- LGPD compliant

**Request:**

```typescript
{
  confirmation: "DELETE"; // Obrigatório - deve ser exatamente "DELETE"
  reason?: string;        // Opcional - motivo da exclusão
}
```

**Response (sucesso):**

```typescript
{
  success: true;
  message: "Account and all associated data have been permanently deleted";
  deletedTables: ["habit_completions", "habits", "likes", "comments", "posts", "users"];
  auditId: "uuid-do-usuario";
}
```

**Response (erro):**

```typescript
{
  error: "Mensagem de erro";
  details?: string;
}
```

**Códigos de Status:**
| Código | Descrição |
|--------|-----------|
| 200 | Conta deletada com sucesso |
| 400 | Confirmação não enviada ou inválida |
| 401 | Token JWT ausente ou inválido |
| 405 | Método não permitido (use POST) |
| 500 | Erro interno |

**Uso no App:**

```typescript
import { deleteAccount } from "@/api/auth";

const handleDeleteAccount = async () => {
  const result = await deleteAccount("Não uso mais o app");

  if (result.success) {
    // Redirecionar para tela de login
    navigation.reset({ routes: [{ name: "Login" }] });
  } else {
    // Mostrar erro
    Alert.alert("Erro", result.error);
  }
};
```

---

## Deploy

### Requisitos

1. Supabase CLI instalado
2. Projeto linkado: `supabase link --project-ref <ref>`

### Comandos

```bash
# Deploy de uma função específica
supabase functions deploy delete-account

# Deploy de todas as funções
supabase functions deploy

# Logs em tempo real
supabase functions logs delete-account --tail

# Testar localmente
supabase functions serve delete-account --env-file .env.local
```

### Variáveis de Ambiente

Configurar no Supabase Dashboard > Edge Functions > Secrets:

| Variável                    | Descrição                     | Obrigatório    |
| --------------------------- | ----------------------------- | -------------- |
| `SUPABASE_URL`              | URL do projeto (automático)   | ✅             |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (automático) | ✅             |
| `ANTHROPIC_API_KEY`         | API key do Claude             | ✅             |
| `GEMINI_API_KEY`            | API key do Gemini             | ✅             |
| `OPENAI_API_KEY`            | API key do OpenAI (fallback)  | ✅             |
| `UPSTASH_REDIS_REST_URL`    | URL do Upstash Redis          | ⚠️ Recomendado |
| `UPSTASH_REDIS_REST_TOKEN`  | Token do Upstash Redis        | ⚠️ Recomendado |

> **Nota:** Se as variáveis do Upstash não forem configuradas, o rate limiting usa fallback in-memory (não funciona bem com múltiplas instâncias).

---

## Segurança

### JWT Validation

Todas as funções validam o JWT do Supabase Auth:

```typescript
const {
  data: { user },
  error,
} = await supabase.auth.getUser(token);
if (error || !user) {
  return jsonResponse({ error: "Invalid token" }, 401);
}
```

### CORS

Domínios permitidos:

- `https://nossamaternidade.com.br`
- `https://www.nossamaternidade.com.br`
- `exp://` (Expo Go)
- `http://localhost:8081` (Dev)

### Rate Limiting

**`/ai` - Upstash Redis (Production-Ready)**

| Limite          | Valor                        |
| --------------- | ---------------------------- |
| Requests/minuto | 20                           |
| Tokens/minuto   | 50.000                       |
| Janela          | 60 segundos (sliding window) |

**Arquitetura:**

```
Request → checkRateLimitRedis()
              ↓
    [Redis disponível?]
         ↓         ↓
        SIM       NÃO
         ↓         ↓
      Redis    In-Memory
     (prod)    (fallback)
```

**Response 429 (Rate Limited):**

```json
{
  "error": "Rate limit exceeded. Try again in a minute.",
  "retryAfter": 45,
  "remaining": 0,
  "source": "redis"
}
```

**Logs de Rate Limit:**

```
✅ Rate limit OK: user=xxx, requests=5/20, remaining=15
🚫 Rate limit HIT (requests): user=xxx, requests=20/20
🚫 Rate limit HIT (tokens): user=xxx, tokens=48000+5000/50000
```

**`/delete-account`** - Sem rate limit (operação única)

---

## Logging & Monitoring

### Structured Logging

A Edge Function `/ai` usa logging estruturado em JSON para fácil ingestão por ferramentas de análise.

**Formato do Log:**

```json
{
  "timestamp": "2025-12-17T12:34:56.789Z",
  "level": "info",
  "event": "request_metrics",
  "data": {
    "requestId": "req_abc123",
    "userId": "user_f3a2b1c4",
    "provider": "claude",
    "messageCount": 5,
    "tokens": {
      "estimatedInput": 500,
      "actualInput": 480,
      "output": 150,
      "total": 630
    },
    "latencyMs": 1250,
    "success": true,
    "fallback": false
  }
}
```

### Eventos Logados

| Evento                      | Level | Descrição                  |
| --------------------------- | ----- | -------------------------- |
| `auth_success`              | info  | Autenticação bem-sucedida  |
| `auth_failure`              | warn  | Falha na autenticação      |
| `request_started`           | info  | Início do processamento    |
| `request_metrics`           | info  | Métricas finais da request |
| `request_failed`            | error | Erro durante processamento |
| `rate_limit_exceeded`       | warn  | Rate limit atingido        |
| `provider_fallback`         | warn  | Fallback para OpenAI       |
| `provider_error`            | error | Erro no provider primário  |
| `payload_validation_failed` | warn  | Payload inválido           |
| `analytics_insert_failed`   | warn  | Falha ao salvar analytics  |

### Privacidade

- **userId é hasheado** em todos os logs para privacidade
- Formato: `user_f3a2b1c4` (8 caracteres hex)
- **Mensagens NÃO são logadas** - apenas metadata

### Request ID

Cada request recebe um ID único para rastreamento:

- Formato: `req_<timestamp>_<random>`
- Exemplo: `req_m1abc2_x7y8z9`
- Incluído na response para troubleshooting

### Visualizar Logs

```bash
# Logs em tempo real
supabase functions logs ai --tail

# Filtrar por evento
supabase functions logs ai --tail | grep "request_metrics"

# Filtrar por erros
supabase functions logs ai --tail | grep '"level":"error"'
```

### Métricas Disponíveis

| Métrica                | Descrição                          |
| ---------------------- | ---------------------------------- |
| `latencyMs`            | Tempo total de resposta (ms)       |
| `estimatedInputTokens` | Tokens estimados (chars/4)         |
| `actualInputTokens`    | Tokens reais do provider           |
| `outputTokens`         | Tokens da resposta                 |
| `totalTokens`          | Total de tokens consumidos         |
| `messageCount`         | Número de mensagens no histórico   |
| `success`              | Se a request foi bem-sucedida      |
| `fallback`             | Se usou fallback (OpenAI)          |
| `rateLimitSource`      | Fonte do rate limit (redis/memory) |

---

## Troubleshooting

### Erro 401: Invalid token

- Verificar se o usuário está logado
- Verificar se o token não expirou
- Verificar se o header `Authorization: Bearer <token>` está correto

### Erro 500: Internal server error

- Verificar logs: `supabase functions logs <nome> --tail`
- Verificar se as variáveis de ambiente estão configuradas
- Verificar se as tabelas existem no banco

### Função não encontrada (404)

- Verificar se a função foi deployada: `supabase functions list`
- Verificar o nome da função na URL

---

## Setup do Upstash Redis

### 1. Criar conta no Upstash

1. Acesse [upstash.com](https://upstash.com)
2. Crie uma conta gratuita
3. Crie um novo database Redis

### 2. Obter credenciais

No dashboard do Upstash, copie:

- **REST URL**: `https://xxx.upstash.io`
- **REST Token**: `AXxxxx...`

### 3. Configurar no Supabase

```bash
# Via CLI
supabase secrets set UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
supabase secrets set UPSTASH_REDIS_REST_TOKEN="AXxxxx..."

# Ou via Dashboard
# Supabase > Edge Functions > Secrets
```

### 4. Verificar funcionamento

```bash
# Ver logs
supabase functions logs ai --tail

# Procurar por:
# ✅ Upstash Redis initialized
# ✅ Rate limit OK: user=xxx, requests=1/20, remaining=19
```

### Plano Gratuito do Upstash

- 10.000 comandos/dia
- 256 MB storage
- Suficiente para ~500 usuários ativos/dia

---

_Última atualização: 2025-12-17_
