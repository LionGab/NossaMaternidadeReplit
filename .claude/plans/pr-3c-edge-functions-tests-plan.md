# PR-3C: Edge Functions Tests - Plano Detalhado

**Data**: 2026-01-29
**PR**: feat/phase3c-edge-function-tests
**Objetivo**: Adicionar testes unitários para Edge Functions críticas
**Tempo estimado**: 8-10 horas
**Coverage meta**: 70% por função

---

## 📋 FUNÇÕES PRIORITÁRIAS

### 1. `ai/index.ts` (1869 linhas) - PRIORIDADE 1

**Complexidade**: Alta
**Razão**: Core da NathIA, múltiplos providers, circuit breakers

**Funcionalidades principais**:

- JWT validation (Supabase auth)
- AI consent validation (LGPD compliance)
- Rate limiting (Redis + in-memory fallback)
- Circuit breakers (Gemini, Claude, OpenAI)
- Crisis detection & guardrails
- Provider fallback chain (OpenAI → Claude)
- Image support (Claude Vision)
- Grounding support (Gemini + Google Search)
- Content persistence (chat_messages)
- Analytics logging (ai_requests)

**APIs externas**:

- Supabase (auth, database, storage)
- OpenAI (`gpt-4o-mini`)
- Anthropic Claude (`claude-sonnet-4-5`)
- Google Gemini (`gemini-2.0-flash`)
- Upstash Redis (rate limiting)

---

### 2. `moderate-content/index.ts` (443 linhas) - PRIORIDADE 2

**Complexidade**: Média
**Razão**: Segurança (LGPD), OpenAI integration

**Funcionalidades principais**:

- JWT validation
- OpenAI Moderation API integration
- Content classification (safe/flagged/blocked)
- Rate limiting (in-memory, 50 req/min)
- Moderation cache (1 hour TTL)
- Admin notifications (flagged content)
- Audit logging (moderation_logs)

**APIs externas**:

- Supabase (auth, database, notifications)
- OpenAI Moderation API (`omni-moderation-latest`)

---

### 3. `webhook/index.ts` (712 linhas) - PRIORIDADE 3

**Complexidade**: Média
**Razão**: Pagamentos (RevenueCat), subscription lifecycle

**Funcionalidades principais**:

- Webhook signature validation (Bearer token)
- Idempotency (prevent duplicate processing)
- RevenueCat event handling (12 event types)
- Subscription lifecycle (activate, cancel, expire, billing issues)
- User lookup (by UUID or email)
- Audit logging (webhook_transactions, audit_logs)

**APIs externas**:

- Supabase (database)
- RevenueCat (webhooks)

---

## 🛠️ SETUP JEST/DENO

### Desafios

- Edge Functions rodam em **Deno runtime** (não Node.js)
- Deno tem APIs diferentes: `Deno.env.get()`, `Deno.serve()`
- Supabase usa ESM imports (`https://esm.sh/...`)

### Estratégia

1. **Usar Vitest** (mais compatível com Deno do que Jest)
2. **Mock Deno globals** (`Deno.env`, `Deno.serve`)
3. **Mock fetch API** (para chamadas HTTP externas)
4. **Mock Supabase client** (para database/auth)

### Arquivos a criar

```
supabase/functions/__tests__/
├── setup.ts                    # Setup global, mocks compartilhados
├── mocks/
│   ├── deno.mock.ts           # Mock Deno.env, Deno.serve
│   ├── supabase.mock.ts       # Mock createClient
│   ├── openai.mock.ts         # Mock OpenAI SDK
│   ├── anthropic.mock.ts      # Mock Anthropic SDK
│   └── redis.mock.ts          # Mock Upstash Redis
├── ai.test.ts                  # Testes ai/index.ts
├── moderate-content.test.ts    # Testes moderate-content/index.ts
└── webhook.test.ts             # Testes webhook/index.ts

vitest.config.edge.js           # Config Vitest para edge runtime
```

---

## 📝 CASOS DE TESTE

### `ai/index.ts` - 15+ testes

#### Auth & Validation (5 testes)

```typescript
describe("AI Edge Function - Auth", () => {
  it("should reject requests without Authorization header", async () => {
    // ...
  });

  it("should reject requests with invalid JWT token", async () => {
    // ...
  });

  it("should reject requests when AI consent is not granted", async () => {
    // ...
  });

  it("should reject requests when AI is disabled by user", async () => {
    // ...
  });

  it("should accept requests with valid JWT and AI consent", async () => {
    // ...
  });
});
```

#### Rate Limiting (3 testes)

```typescript
describe("AI Edge Function - Rate Limiting", () => {
  it("should allow requests within rate limit", async () => {
    // ...
  });

  it("should reject requests exceeding rate limit (20 req/min)", async () => {
    // ...
  });

  it("should fall back to in-memory rate limit when Redis fails", async () => {
    // ...
  });
});
```

#### Provider Logic (5 testes)

```typescript
describe("AI Edge Function - Providers", () => {
  it("should use Claude for crisis messages", async () => {
    // Message with "suicídio" keyword
    // ...
  });

  it("should use OpenAI as default provider", async () => {
    // Normal message
    // ...
  });

  it("should use Claude Vision for image messages", async () => {
    // Message with imageData
    // ...
  });

  it("should fallback to Claude when OpenAI fails", async () => {
    // Mock OpenAI error
    // ...
  });

  it("should reprocess with Claude if guardrail is triggered", async () => {
    // OpenAI response with blocked phrase ("você tem depressão")
    // ...
  });
});
```

#### Circuit Breakers (2 testes)

```typescript
describe("AI Edge Function - Circuit Breakers", () => {
  it("should open circuit after 5 consecutive failures", async () => {
    // ...
  });

  it("should close circuit after successful call in HALF_OPEN state", async () => {
    // ...
  });
});
```

---

### `moderate-content/index.ts` - 10+ testes

#### Auth (2 testes)

```typescript
describe("Moderate Content - Auth", () => {
  it("should accept requests with valid JWT", async () => {
    // ...
  });

  it("should accept requests with service key", async () => {
    // Header: x-service-key
    // ...
  });
});
```

#### Moderation Logic (4 testes)

```typescript
describe("Moderate Content - Moderation", () => {
  it("should classify safe content as SAFE", async () => {
    // Content: "Oi, tudo bem?"
    // ...
  });

  it("should classify flagged content as FLAGGED (score >= 0.5)", async () => {
    // Content with moderate risk
    // ...
  });

  it("should classify blocked content as BLOCKED (score >= 0.8)", async () => {
    // Content with high risk
    // ...
  });

  it("should return cached result for duplicate content", async () => {
    // Call moderation twice with same content
    // Second call should hit cache
    // ...
  });
});
```

#### Rate Limiting (2 testes)

```typescript
describe("Moderate Content - Rate Limiting", () => {
  it("should allow up to 50 requests per minute", async () => {
    // ...
  });

  it("should reject 51st request in same minute", async () => {
    // ...
  });
});
```

#### Notifications (2 testes)

```typescript
describe("Moderate Content - Notifications", () => {
  it("should queue admin notification for flagged content", async () => {
    // ...
  });

  it("should not notify admins for safe content", async () => {
    // ...
  });
});
```

---

### `webhook/index.ts` - 12+ testes

#### Auth (2 testes)

```typescript
describe("Webhook - Auth", () => {
  it("should accept webhook with valid Bearer token", async () => {
    // Authorization: Bearer <REVENUECAT_WEBHOOK_SECRET>
    // ...
  });

  it("should reject webhook with invalid token", async () => {
    // ...
  });
});
```

#### Idempotency (2 testes)

```typescript
describe("Webhook - Idempotency", () => {
  it("should process event only once", async () => {
    // Send same event_id twice
    // Second call should return "already processed"
    // ...
  });

  it("should cache processed event IDs", async () => {
    // ...
  });
});
```

#### RevenueCat Events (8 testes)

```typescript
describe("Webhook - RevenueCat Events", () => {
  it("should activate premium on INITIAL_PURCHASE", async () => {
    // ...
  });

  it("should activate premium on RENEWAL", async () => {
    // ...
  });

  it("should mark as cancelled on CANCELLATION", async () => {
    // ...
  });

  it("should deactivate premium on EXPIRATION", async () => {
    // ...
  });

  it("should mark billing issue on BILLING_ISSUE", async () => {
    // ...
  });

  it("should update subscription tier on PRODUCT_CHANGE", async () => {
    // ...
  });

  it("should handle one-time purchase (lifetime)", async () => {
    // ...
  });

  it("should skip TEST events", async () => {
    // ...
  });
});
```

---

## 🧪 MOCKS NECESSÁRIOS

### `setup.ts` - Setup global

```typescript
import { vi } from "vitest";

// Mock Deno globals
global.Deno = {
  env: {
    get: vi.fn(),
  },
  serve: vi.fn(),
};

// Mock fetch API
global.fetch = vi.fn();

// Setup env vars
process.env.SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
process.env.OPENAI_API_KEY = "test-openai-key";
process.env.ANTHROPIC_API_KEY = "test-anthropic-key";
process.env.GEMINI_API_KEY = "test-gemini-key";
process.env.REVENUECAT_WEBHOOK_SECRET = "test-webhook-secret";
```

### `mocks/supabase.mock.ts`

```typescript
export const createMockSupabaseClient = () => ({
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
    insert: vi.fn(),
    update: vi.fn(() => ({
      eq: vi.fn(),
    })),
  })),
  rpc: vi.fn(),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      getPublicUrl: vi.fn(),
    })),
  },
});
```

### `mocks/openai.mock.ts`

```typescript
export const createMockOpenAI = () => ({
  chat: {
    completions: {
      create: vi.fn(),
    },
  },
  moderations: {
    create: vi.fn(),
  },
});
```

### `mocks/anthropic.mock.ts`

```typescript
export const createMockAnthropic = () => ({
  messages: {
    create: vi.fn(),
  },
});
```

### `mocks/redis.mock.ts`

```typescript
export const createMockRedis = () => ({
  get: vi.fn(),
  setex: vi.fn(),
  incr: vi.fn(),
  incrby: vi.fn(),
  ttl: vi.fn(),
  pipeline: vi.fn(() => ({
    get: vi.fn(),
    ttl: vi.fn(),
    setex: vi.fn(),
    incr: vi.fn(),
    incrby: vi.fn(),
    exec: vi.fn(),
  })),
});
```

---

## 📦 vitest.config.edge.js

```javascript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node", // Simular ambiente Deno em Node
    setupFiles: ["./supabase/functions/__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["supabase/functions/**/*.ts"],
      exclude: [
        "supabase/functions/__tests__/**",
        "supabase/functions/_shared/**", // Shared utils já testados indiretamente
      ],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
});
```

---

## 🚀 COMANDOS

### Instalar dependências

```bash
npm install -D vitest @vitest/coverage-v8
```

### Rodar testes

```bash
# Todos os testes edge
npm run test:edge-functions

# Watch mode
npm run test:edge-functions -- --watch

# Coverage
npm run test:edge-functions -- --coverage

# Teste específico
npm run test:edge-functions -- ai.test.ts
```

### Adicionar ao package.json

```json
{
  "scripts": {
    "test:edge-functions": "vitest run --config vitest.config.edge.js"
  }
}
```

---

## ✅ CRITÉRIOS DE ACEITE

### Funcional

- [ ] Todos os testes passam (`npm run test:edge-functions`)
- [ ] Coverage >= 70% por função
- [ ] Mocks isolados (zero chamadas reais a APIs externas)
- [ ] Testes cobrem casos de sucesso + erro
- [ ] Edge cases cobertos (rate limit, auth failure, provider fallback)

### Técnico

- [ ] Vitest configurado corretamente
- [ ] Setup global funciona (mocks carregados)
- [ ] CI passa (GitHub Actions)
- [ ] Documentação dos mocks (README em `__tests__/`)

### Qualidade

- [ ] Testes legíveis (describe/it descritivos)
- [ ] Sem flakiness (testes determinísticos)
- [ ] Isolamento (cada teste limpa state)
- [ ] Performance (suite completa < 10s)

---

## 📅 EXECUÇÃO

### Dia 1 (3-4h): Setup + ai/index.ts

1. Criar estrutura de arquivos
2. Configurar Vitest
3. Criar mocks básicos (Deno, Supabase, OpenAI)
4. Escrever 15 testes para `ai/index.ts`

### Dia 2 (2-3h): moderate-content/index.ts

1. Adicionar mocks OpenAI Moderation
2. Escrever 10 testes para `moderate-content/index.ts`

### Dia 3 (2-3h): webhook/index.ts + polish

1. Escrever 12 testes para `webhook/index.ts`
2. Verificar coverage (ajustar se < 70%)
3. Documentar mocks (README)
4. Testar CI

---

## 🎯 PRÓXIMA AÇÃO

**Agora**: Aguardar review/merge do PR-3A
**Depois do merge**: Executar Dia 1 do PR-3C

**Branch**: `feat/phase3c-edge-function-tests`
**PR Target**: GitHub `main`

---

_PR-3C: Testes robustos para backend crítico_
_Última atualização: 2026-01-29_
