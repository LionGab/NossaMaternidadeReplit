# Edge Functions Tests

Testes unitários para Supabase Edge Functions usando Vitest.

## Estrutura

```
__tests__/
├── setup.ts                    # Setup global (Deno mocks, helpers)
├── mocks/                      # Mocks reutilizáveis
│   ├── deno.mock.ts           # Mock Deno.env, Deno.serve
│   ├── supabase.mock.ts       # Mock Supabase client
│   ├── openai.mock.ts         # Mock OpenAI SDK
│   ├── anthropic.mock.ts      # Mock Anthropic SDK
│   └── redis.mock.ts          # Mock Upstash Redis
├── ai.test.ts                  # 15 testes (ai/ function)
├── moderate-content.test.ts    # 10 testes (moderate-content/ function)
└── webhook.test.ts             # 12 testes (webhook/ function)
```

**Total**: 37 testes cobrindo 3 edge functions prioritárias.

## Rodando os Testes

### Todos os testes

```bash
npm run test:edge-functions
```

### Watch mode (desenvolvimento)

```bash
npm run test:edge-functions -- --watch
```

### Com coverage

```bash
npm run test:edge-functions -- --coverage
```

### Teste específico

```bash
npm run test:edge-functions -- ai.test.ts
```

## Coverage Mínimo

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

Coverage report gerado em: `coverage/index.html`

## Funções Testadas

### 1. `ai/` (15 testes)

**Auth & Validation** (5 testes):

- ✅ Rejeita requests sem Authorization header
- ✅ Rejeita requests com JWT inválido
- ✅ Rejeita requests sem AI consent
- ✅ Rejeita requests com AI desabilitado
- ✅ Aceita requests com JWT válido e AI consent

**Rate Limiting** (3 testes):

- ✅ Permite requests dentro do rate limit
- ✅ Rejeita requests acima de 20 req/min
- ✅ Fallback para in-memory quando Redis falha

**Provider Logic** (5 testes):

- ✅ Usa Claude para mensagens de crise
- ✅ Usa OpenAI como provider padrão
- ✅ Usa Claude Vision para imagens
- ✅ Fallback para Claude quando OpenAI falha
- ✅ Reprocessa com Claude se guardrail for acionado

**Circuit Breakers** (2 testes):

- ✅ Abre circuit após 5 falhas consecutivas
- ✅ Fecha circuit após sucesso em HALF_OPEN

### 2. `moderate-content/` (10 testes)

**Auth** (2 testes):

- ✅ Aceita requests com JWT válido
- ✅ Aceita requests com service key

**Moderation Logic** (4 testes):

- ✅ Classifica conteúdo seguro como SAFE
- ✅ Classifica conteúdo flagged (score >= 0.5)
- ✅ Classifica conteúdo blocked (score >= 0.8)
- ✅ Retorna resultado cacheado para conteúdo duplicado

**Rate Limiting** (2 testes):

- ✅ Permite até 50 requests por minuto
- ✅ Rejeita 51º request no mesmo minuto

**Notifications** (2 testes):

- ✅ Envia notificação admin para conteúdo flagged
- ✅ Não notifica admins para conteúdo seguro

### 3. `webhook/` (12 testes)

**Auth** (2 testes):

- ✅ Aceita webhook com Bearer token válido
- ✅ Rejeita webhook com token inválido

**Idempotency** (2 testes):

- ✅ Processa evento apenas uma vez
- ✅ Cacheia event IDs processados

**RevenueCat Events** (8 testes):

- ✅ Ativa premium em INITIAL_PURCHASE
- ✅ Ativa premium em RENEWAL
- ✅ Marca como cancelado em CANCELLATION
- ✅ Desativa premium em EXPIRATION
- ✅ Marca billing issue em BILLING_ISSUE
- ✅ Atualiza tier em PRODUCT_CHANGE
- ✅ Trata compra única (lifetime)
- ✅ Pula eventos TEST

## Mocks

### `setup.ts`

Configura ambiente de teste:

- Mock `Deno.env` com variáveis de teste
- Mock `global.fetch`
- Helpers: `createMockJWT()`, `createMockHeaders()`, `createMockRequest()`

### `mocks/supabase.mock.ts`

Mock Supabase client com query builder chainable:

```typescript
const mockClient = createMockSupabaseClient();
mockClient.from("users").select().eq("id", "test").single();
mockClient.auth.getUser();
mockClient.storage.from("bucket").upload();
```

### `mocks/openai.mock.ts`

Mock OpenAI SDK (chat + moderation):

```typescript
const openai = mockOpenAISuccess("Resposta teste");
const openai = mockModerationFlagged(0.6);
const openai = mockModerationBlocked(0.9);
```

### `mocks/anthropic.mock.ts`

Mock Anthropic (Claude) SDK:

```typescript
const claude = mockClaudeSuccess("Resposta teste");
const claude = mockClaudeVisionSuccess("Vejo uma imagem...");
```

### `mocks/redis.mock.ts`

Mock Upstash Redis com in-memory store:

```typescript
const redis = mockRateLimitOk();
const redis = mockRateLimitExceeded();
const redis = mockRedisFailure();
```

## Por Que Vitest?

- ✅ Melhor compatibilidade com Deno edge runtime do que Jest
- ✅ Mais rápido (usa Vite internamente)
- ✅ ESM nativo (edge functions usam ESM)
- ✅ API compatível com Jest (fácil migração)
- ✅ Coverage integrado com v8

## Troubleshooting

### Erro: "Cannot find module 'vitest'"

```bash
npm install -D vitest @vitest/coverage-v8
```

### Coverage baixo

Verifique arquivos excluídos em `vitest.config.edge.js`:

```javascript
exclude: ["supabase/functions/__tests__/**", "supabase/functions/_shared/**"];
```

### Mock não funciona

Certifique-se de chamar `vi.clearAllMocks()` em `beforeEach()`.

---

**Última atualização**: 2026-01-29
**PR**: feat/phase3c-edge-function-tests
**Coverage meta**: 70% por função
