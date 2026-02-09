# SPEC: Chat NathIA - Hardening + Produção

> **Status**: 🚧 Em Implementação
> **Criado**: 2026-01-06
> **Objetivo**: Deixar o Chat NathIA 100% pronto para produção

---

## Resumo Executivo

| Área             | Estado Atual                      | Meta                            |
| ---------------- | --------------------------------- | ------------------------------- |
| **Streaming**    | ⚠️ Implementado, não testado      | ✅ Prod-grade + fallback        |
| **Imagens**      | ⚠️ Picker OK, upload não validado | ✅ Compressão + Storage         |
| **Voz**          | ⚠️ Componente OK, e2e não testado | ✅ Record → Upload → Transcribe |
| **Sync Backend** | ❌ Só local (AsyncStorage)        | ✅ Híbrido local + Supabase     |
| **Premium Gate** | ✅ 6 msgs free                    | ✅ 20 msgs/dia                  |
| **Testes**       | ❌ Sem cobertura                  | ✅ Jest + QA Checklist          |

---

## Stack Técnica

- **App**: Expo SDK 54 + React Native 0.81 + TypeScript strict
- **Styling**: NativeWind v4 (sem StyleSheet)
- **State**: Zustand + AsyncStorage (persistência)
- **Navigation**: React Navigation 7
- **Backend**: Supabase (Auth/DB/Storage/Edge Functions)
- **AI Providers**: Gemini 2.5 Flash (primary) → Claude 3.5 (fallback) → GPT-4o (último)

---

## Arquivos Mapeados (Auditoria)

### Screens & Components

| Arquivo                                        | LOC  | Propósito                       |
| ---------------------------------------------- | ---- | ------------------------------- |
| `src/screens/AssistantScreen.tsx`              | ~521 | Tela principal do chat          |
| `src/components/chat/MessageBubble.tsx`        | ~233 | Bolhas com Markdown + Streaming |
| `src/components/chat/ChatInputArea.tsx`        | ~340 | Input + attachments + sugestões |
| `src/components/chat/ChatInputAreaPremium.tsx` | ~364 | Variante premium                |
| `src/components/chat/ChatHistorySidebar.tsx`   | ~278 | Sidebar com histórico           |
| `src/components/chat/ChatEmptyState.tsx`       | ~321 | Empty state + sugestões         |
| `src/components/chat/MarkdownRenderer.tsx`     | ~222 | Renderiza Markdown              |
| `src/components/chat/VoiceRecordingInput.tsx`  | ~143 | Gravação de áudio               |

### State & API

| Arquivo                          | Propósito                                        |
| -------------------------------- | ------------------------------------------------ |
| `src/state/store.ts`             | ChatState (conversations, currentConversationId) |
| `src/api/ai-service.ts`          | Rate limiting, provider routing, fallbacks       |
| `src/hooks/useChatHandlers.ts`   | Core logic (send, streaming, voice)              |
| `src/hooks/useStreaming.ts`      | SSE streaming + fallback JSON                    |
| `src/hooks/useVoiceRecording.ts` | Recording state + transcription                  |

### Backend (Supabase)

| Arquivo                                  | Propósito                           |
| ---------------------------------------- | ----------------------------------- |
| `supabase/functions/ai/index.ts`         | Edge Function principal (~1.8K LOC) |
| `supabase/functions/transcribe/index.ts` | Transcrição de áudio                |

---

## Passos de Implementação

### Passo 0: Auditoria Rápida ✅

- [x] Mapear arquivos existentes
- [x] Documentar como streaming funciona (SSE via useStreaming)
- [x] Identificar onde upload começa (expo-image-picker)

**Descobertas da Auditoria:**

| Item              | Localização                                   | Estado                              |
| ----------------- | --------------------------------------------- | ----------------------------------- |
| ChatMessage type  | `src/types/navigation.ts:230-235`             | Falta `status`, `attachments[]`     |
| ChatStore         | `src/state/store.ts:257-381`                  | Falta `updateMessage`, `remoteId`   |
| Streaming hook    | `src/hooks/useStreaming.ts`                   | ✅ Completo (SSE + fallback)        |
| Chat handlers     | `src/hooks/useChatHandlers.ts`                | `FREE_MESSAGE_LIMIT = 6` (linha 33) |
| Voice UI          | `src/components/chat/VoiceRecordingInput.tsx` | Usa StyleSheet (migrar NativeWind)  |
| Conversation type | `src/state/store.ts:69-76`                    | Falta `remoteId`, `lastSyncedAt`    |

**ChatMessage atual (navigation.ts:230-235):**

```typescript
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  image_url?: string; // Já existe campo para imagem
}
```

### Passo 1: Padronizar Tipos de Dados

**Criar**: `src/types/chat.ts`

```typescript
export type ChatRole = "user" | "assistant" | "system";

export type MessageStatus = "sending" | "streaming" | "done" | "error";

export interface ChatAttachment {
  id: string;
  type: "image" | "audio";
  url: string;
  localUri?: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  duration?: number; // para áudio
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string; // ISO 8601
  status: MessageStatus;
  attachments?: ChatAttachment[];
  error?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  // Sync com backend
  remoteId?: string;
  lastSyncedAt?: string;
}
```

**Modificar**: `src/state/chat-store.ts` (ou onde estiver)

- Migrar para usar tipos de `src/types/chat.ts`
- Adicionar `updateMessage(id, patch)` para streaming
- Adicionar `setConversationRemoteId(localId, remoteId)`

---

### Passo 2: Streaming Prod-Grade

**Criar**: `src/api/chat/streamingClient.ts`

Requisitos:

- `AbortController` para cancelar stream
- Parser robusto (SSE / newline-delimited JSON)
- Callbacks: `onToken`, `onDone`, `onError`
- Timeout (60s) + fallback para não-streaming
- Logs via `logger.*` (nunca console.log)

**Modificar**: `src/api/chat/index.ts`

Expor `sendMessage({ conversationId, text, attachments })`:

1. Criar message `user`
2. Criar message `assistant` com status `streaming`
3. Stream e atualizar `assistant.content` via `updateMessage`
4. Ao final: status `done`
5. Em erro: status `error` + manter texto parcial

**Modificar**: `AssistantScreen.tsx`

- Botão "stop" aborta stream real
- Ao sair da tela, abortar stream pendente
- UI exibe estados: streaming (cursor), error (retry)

---

### Passo 3: Imagens (Upload + Validação)

**Criar**: `src/api/uploads/imageUpload.ts`

Requisitos:

- Validar: mime (jpg/png/webp), size (≤5MB), dimensão (≤2048px)
- Comprimir via `expo-image-manipulator`
- Upload no Supabase Storage bucket `nathia-uploads`
- Path: `chat/{userId}/{conversationId}/{uuid}.jpg`
- Retornar URL assinada ou pública

**Modificar**: Componente de picker

- Preview + estado `uploading`
- Erro amigável + retry
- Incluir attachment na mensagem

---

### Passo 4: Voz (Record → Upload → Transcribe)

**Criar**: `src/api/uploads/audioUpload.ts`

Requisitos:

- Usar `expo-av` (já no projeto)
- Validar: duração (≤60s), size (≤10MB)
- Upload no mesmo bucket

**Criar/Modificar**: `src/api/chat/transcription.ts`

- Chamar Edge Function `transcribe`
- Fallback: enviar áudio sem transcrição

**Modificar**: `VoiceRecordingInput.tsx`

- Fluxo: gravar → upload → transcrever → inserir texto
- Indicador de gravação + contador
- Cancelar descarta, Enviar dispara upload

---

### Passo 5: Sync Backend (Supabase)

**Criar Migration**: `supabase/migrations/XXXX_create_chat_tables.sql`

```sql
-- chat_conversations
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nova conversa',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_message_at TIMESTAMPTZ
);

-- chat_messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'done',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- chat_attachments
CREATE TABLE chat_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'audio')),
  url TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_conversations_user ON chat_conversations(user_id, updated_at DESC);
CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id, created_at);

-- RLS
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own conversations" ON chat_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own messages" ON chat_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own attachments" ON chat_attachments
  FOR ALL USING (
    message_id IN (
      SELECT id FROM chat_messages WHERE user_id = auth.uid()
    )
  );
```

**Criar**: `src/api/chat/sync.ts`

Implementar:

- `syncConversation(conversationId)`: push local → pull remote
- `syncAll()`: chamado ao abrir chat / recuperar conexão
- Merge determinístico por `createdAt`

---

### Passo 6: Premium Gate

**Modificar**: Onde está o limite de mensagens

- Trocar de 6 msgs total para **20 msgs/dia**
- Reset diário (chave por `YYYY-MM-DD`)
- Persistir contador no store

---

### Passo 7: Testes + QA

**Criar**: `src/api/chat/__tests__/streamingParser.test.ts`

- Tokens em ordem
- Chunks inválidos
- Abort

**Criar**: `src/state/__tests__/useChatStore.test.ts`

- addMessage upsert
- updateMessage
- criar/deletar conversa

**QA Checklist** (manual antes de TestFlight):

| Cenário                        | iOS | Android |
| ------------------------------ | --- | ------- |
| Enviar mensagem texto          | [ ] | [ ]     |
| Streaming exibe em tempo real  | [ ] | [ ]     |
| Cancelar stream (botão stop)   | [ ] | [ ]     |
| Trocar conversa durante stream | [ ] | [ ]     |
| Enviar imagem (jpg ≤5MB)       | [ ] | [ ]     |
| Imagem muito grande (erro)     | [ ] | [ ]     |
| Gravar voz (≤60s)              | [ ] | [ ]     |
| Transcrição funciona           | [ ] | [ ]     |
| Cancelar gravação              | [ ] | [ ]     |
| 20 msgs/dia → paywall          | [ ] | [ ]     |
| Sync: login em 2 devices       | [ ] | [ ]     |
| Offline → Online: sync         | [ ] | [ ]     |
| App reset: histórico persiste  | [ ] | [ ]     |

---

## Critérios de Aceitação

| Área           | Critério                                        |
| -------------- | ----------------------------------------------- |
| **Streaming**  | iOS/Android, abort real, fallback sem-stream    |
| **Imagens**    | Upload validado, compressão, anexo aparece      |
| **Voz**        | Grava, envia, transcreve, insere texto          |
| **Sync**       | Logado = sync entre devices; não logado = local |
| **Styling**    | NativeWind, sem StyleSheet                      |
| **A11y**       | accessibilityRole/Label em interativos          |
| **TypeScript** | type-check ok                                   |
| **Testes**     | Jest passando                                   |
| **UI/UX**      | Não quebrar sidebar, markdown, bubbles          |

---

## Arquivos a Criar/Modificar

### Novos Arquivos

| Arquivo                                           | Propósito                     |
| ------------------------------------------------- | ----------------------------- |
| `src/types/chat.ts`                               | Tipos padronizados            |
| `src/api/chat/streamingClient.ts`                 | Client de streaming robusto   |
| `src/api/uploads/imageUpload.ts`                  | Upload + validação de imagens |
| `src/api/uploads/audioUpload.ts`                  | Upload de áudio               |
| `src/api/chat/transcription.ts`                   | Chamada de transcrição        |
| `src/api/chat/sync.ts`                            | Sync híbrido local+cloud      |
| `supabase/migrations/XXXX_create_chat_tables.sql` | Schema do chat                |
| `src/api/chat/__tests__/streamingParser.test.ts`  | Testes streaming              |
| `src/state/__tests__/useChatStore.test.ts`        | Testes store                  |

### Arquivos a Modificar

| Arquivo                                       | Modificação                           |
| --------------------------------------------- | ------------------------------------- |
| `src/state/chat-store.ts`                     | Migrar tipos, adicionar updateMessage |
| `src/screens/AssistantScreen.tsx`             | Abort stream, UI estados              |
| `src/components/chat/ChatInputArea.tsx`       | Integrar upload imagem                |
| `src/components/chat/VoiceRecordingInput.tsx` | Fluxo completo                        |
| Gate premium (localizar)                      | 20 msgs/dia                           |

---

## Notas de Execução

1. **Não inventar pastas**: seguir `src/screens`, `src/components`, `src/state`, `src/api`
2. **Antes de concluir**: `npm run quality-gate`
3. **Logging**: usar `logger.*` de `src/utils/logger.ts`
4. **Cores**: usar `Tokens` de `src/theme/tokens.ts`
5. **Commits**: atômicos, conventional commits em português
