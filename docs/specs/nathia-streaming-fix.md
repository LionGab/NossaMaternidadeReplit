# SPEC: Correção NathIA Streaming/Thinking

> Gerado via diagnóstico — 2026-01-07

## Problemas Identificados (Severidade ALTA)

| #   | Problema                          | Arquivo                        | Impacto                       |
| --- | --------------------------------- | ------------------------------ | ----------------------------- |
| 1   | Thinking blocks ignorados         | supabase/functions/ai/index.ts | Modelos com raciocínio falham |
| 2   | Parsing SSE incompleto            | src/hooks/useStreaming.ts      | Chunks perdidos               |
| 3   | Buffer overflow no parser         | src/hooks/useStreaming.ts      | Último chunk perdido          |
| 4   | Sem validação de resposta         | src/hooks/useStreaming.ts      | Respostas vazias salvas       |
| 5   | Estado de stream não sincronizado | src/hooks/useChatHandlers.ts   | UI travada                    |

---

## Correções Planejadas

### 1. Tratar Thinking Blocks (Backend)

**Arquivo:** `supabase/functions/ai/index.ts`

**Antes (~linha 1505-1516):**

```typescript
const candidate = data.candidates?.[0];
const text = candidate?.content?.parts?.[0]?.text;

if (text) {
  yield { chunk: text };
}
```

**Depois:**

```typescript
const candidate = data.candidates?.[0];
const parts = candidate?.content?.parts || [];

for (const part of parts) {
  if (part.text) {
    yield { chunk: part.text };
  }
  // Opcional: enviar thinking como evento separado
  if (part.thought) {
    yield { thinking: part.thought };
  }
}
```

### 2. Corrigir Parser SSE (Frontend)

**Arquivo:** `src/hooks/useStreaming.ts`

**Adicionar tratamento para:**

- `parsed.error` - erros do servidor
- `parsed.thinking` - thinking blocks (opcional, pode ignorar)
- `parsed.metadata` - informações estruturais
- Buffer final após stream terminar

**Código:**

```typescript
// Após o while loop (linha ~240)
// Processar buffer restante
if (buffer.trim()) {
  try {
    const parsed = JSON.parse(buffer);
    if (parsed.chunk) {
      fullContent += parsed.chunk;
      appendStreamText(parsed.chunk);
    }
  } catch {
    // Buffer incompleto, ignorar
  }
}
```

### 3. Validar Resposta Antes de Salvar

**Arquivo:** `src/hooks/useStreaming.ts`

**Adicionar validação:**

```typescript
// Antes de retornar fullContent
if (fullContent.trim().length < 10) {
  throw new Error("AI_RESPONSE_TOO_SHORT");
}
```

### 4. Sincronizar Estado de Stream

**Arquivo:** `src/hooks/useChatHandlers.ts`

**Garantir cleanup em todos os paths:**

```typescript
finally {
  setStreaming(false);
  clearStreamText();
}
```

---

## Ordem de Implementação

1. [x] Documentar problemas (esta spec)
2. [ ] Corrigir `useStreaming.ts` - buffer overflow + validação
3. [ ] Corrigir `useChatHandlers.ts` - sincronização de estado
4. [ ] Corrigir edge function (se necessário) - thinking blocks
5. [ ] Testar localmente
6. [ ] Deploy edge function se alterada

---

## Arquivos a Modificar

| Arquivo                        | Prioridade | Tipo de Mudança    |
| ------------------------------ | ---------- | ------------------ |
| src/hooks/useStreaming.ts      | ALTA       | Buffer + validação |
| src/hooks/useChatHandlers.ts   | MÉDIA      | Cleanup de estado  |
| supabase/functions/ai/index.ts | MÉDIA      | Thinking blocks    |

---

## Critério de Sucesso

- [ ] Chat funciona sem erros
- [ ] Streaming completa corretamente
- [ ] Sem respostas vazias
- [ ] Estado de UI sincronizado
