# Spec: NathIA Chat — Fix Crítico + Excelência

> Correção de bugs críticos e elevação da qualidade do chat da NathIA.

---

## Resumo

**Objetivo**: Corrigir layout quebrado, implementar streaming perfeito, renderizar markdown e manter contexto de 20 mensagens.

**Solicitante**: Lion

**Data**: 2026-01-06

**Prazo**: Próxima sprint (qualidade > velocidade)

---

## Contexto

### Problema

- Layout das bolhas de mensagem está "quebrado"
- Markdown não renderiza (texto cru com `**`, `#`, `-`)
- Streaming não funciona (resposta aparece toda de uma vez)
- NathIA esquece contexto da conversa

### Motivação

- Experiência de chat é core do app
- Usuárias esperam interação fluida como ChatGPT
- Bug crítico bloqueando percepção de qualidade

---

## Escopo

### O que ESTÁ incluído

- [x] Fix layout das bolhas de mensagem (referência: ChatGPT)
- [x] Renderização de Markdown com `react-native-markdown-display`
- [x] Streaming perfeito (caractere por caractere)
- [x] Contexto de últimas 20 mensagens
- [x] Voice/TTS com ElevenLabs
- [x] Persistência cloud (sync Supabase)
- [x] Processamento de imagens/visão

### O que NÃO está incluído

- Mudança de provider (Gemini é o primário)
- Rate limiting (desabilitado para beta)
- Mudanças no onboarding da NathIA

---

## Requisitos

### Funcionais

1. **Layout ChatGPT-like**: bolhas limpas, minimalistas, espaçamento adequado
2. **Markdown rico**: headers, bold, italic, listas, code blocks
3. **Streaming**: resposta fluindo caractere por caractere
4. **Contexto**: manter últimas 20 mensagens na conversa
5. **Voice**: TTS com ElevenLabs para respostas da NathIA
6. **Cloud sync**: persistir conversas no Supabase
7. **Imagens**: processar fotos enviadas pela usuária (visão)

### Não-Funcionais

- **Performance**: primeira resposta < 2s, streaming sem lag perceptível
- **Acessibilidade**: tap target 44pt, labels em todos elementos, contraste WCAG AA
- **Segurança**: não expor API keys, sanitizar inputs

---

## Design Técnico

### Arquivos Afetados

```
src/screens/AssistantScreen.tsx     # Tela principal do chat
src/components/chat/                 # Componentes de chat (criar pasta)
  ├── ChatBubble.tsx                # Bolha de mensagem
  ├── ChatInput.tsx                 # Input com envio
  ├── ChatList.tsx                  # Lista de mensagens
  ├── MarkdownRenderer.tsx          # Renderizador MD customizado
  └── StreamingText.tsx             # Componente de streaming
src/hooks/useChat.ts                # Hook de lógica do chat
src/hooks/useStreaming.ts           # Hook para streaming
src/state/store.ts                  # useChatStore (já existe)
src/api/chat-service.ts             # Service de AI (já existe)
supabase/functions/ai/index.ts      # Edge Function (streaming)
```

### Componentes Novos

| Componente         | Responsabilidade                               |
| ------------------ | ---------------------------------------------- |
| `ChatBubble`       | Renderiza mensagem individual (user/assistant) |
| `ChatInput`        | Campo de texto + botão enviar + voice          |
| `ChatList`         | FlatList invertida de mensagens                |
| `MarkdownRenderer` | Wrapper do react-native-markdown-display       |
| `StreamingText`    | Animação de texto chegando                     |

### Estado (Zustand)

```typescript
interface ChatState {
  // Props
  messages: ChatMessage[];
  isStreaming: boolean;
  currentStreamText: string;

  // Actions
  addMessage: (msg: ChatMessage) => void;
  updateStreamText: (text: string) => void;
  clearChat: () => void;
  loadFromCloud: () => Promise<void>;
  syncToCloud: () => Promise<void>;
}
```

### API/Backend

```
POST /functions/v1/ai
Headers: Authorization: Bearer <token>
Body: {
  messages: ChatMessage[],  // últimas 20
  stream: true,
  provider: "gemini"
}
Response: SSE stream de tokens
```

---

## Decisões de Design

### Decisão 1: Provider de AI

**Opções consideradas:**

1. Claude (Anthropic) — melhor para saúde, mais caro
2. Gemini (Google) — rápido, bom custo-benefício
3. GPT-4o (OpenAI) — versátil, streaming excelente

**Escolha**: Gemini (Google)

**Justificativa**: Melhor custo-benefício para beta, streaming nativo, latência baixa.

### Decisão 2: Quantidade de Contexto

**Opções consideradas:**

1. 10 mensagens — leve, menos tokens
2. 20 mensagens — equilíbrio
3. Sessão completa — mais caro

**Escolha**: 20 mensagens

**Justificativa**: Equilíbrio entre qualidade de resposta e custo. Suficiente para manter contexto relevante.

### Decisão 3: Referência Visual

**Opções consideradas:**

1. ChatGPT — limpo, minimalista
2. WhatsApp — bolhas coloridas
3. Apple Messages — iOS nativo

**Escolha**: ChatGPT

**Justificativa**: Foco em conteúdo, markdown rico, profissional para contexto de saúde.

### Decisão 4: Streaming vs Completo

**Opções consideradas:**

1. Streaming perfeito — UX superior, mais complexo
2. Resposta completa — simples, menos engaging

**Escolha**: Streaming perfeito

**Justificativa**: Expectativa moderna de chat, feedback imediato, melhor UX.

---

## Riscos e Mitigações

| Risco                            | Probabilidade | Impacto | Mitigação                                |
| -------------------------------- | ------------- | ------- | ---------------------------------------- |
| Streaming falha em conexão lenta | Média         | Alto    | Fallback para resposta completa          |
| Gemini API indisponível          | Baixa         | Alto    | Fallback chain: Gemini → Claude → GPT    |
| Markdown mal formatado           | Média         | Médio   | Sanitização + fallback texto plain       |
| Contexto muito grande = custo    | Média         | Médio   | Limitar a 20 msgs, resumir se necessário |
| ElevenLabs latência              | Média         | Baixo   | Cache de áudios comuns, otimizar prompts |

---

## Testes

### Cenários de Teste

1. **Happy path**: enviar mensagem, receber streaming, markdown renderiza
2. **Conexão lenta**: streaming degrada gracefully
3. **Mensagem longa**: markdown com múltiplos elementos renderiza correto
4. **Contexto**: NathIA lembra informação de 15 mensagens atrás
5. **Voice**: TTS reproduz resposta corretamente
6. **Offline**: mensagens ficam em fila, sync quando online

### Como Testar Manualmente

1. Abrir AssistantScreen
2. Enviar "Olá, estou grávida de 20 semanas"
3. Verificar: streaming fluido, markdown renderizado
4. Enviar "Quais sintomas são normais agora?"
5. Verificar: NathIA usa contexto (sabe que é 20 semanas)
6. Testar botão de voz (TTS)
7. Fechar app, reabrir, verificar histórico

---

## Checklist Pré-Implementação

- [x] Escopo aprovado (entrevista completa)
- [x] Design técnico documentado
- [x] Riscos avaliados
- [x] Padrões existentes verificados
- [ ] Investigar AssistantScreen.tsx atual
- [ ] Investigar chat-service.ts atual
- [ ] Investigar Edge Function ai/index.ts

---

## Implementação — Ordem Core-First (Value-Driven)

> **Princípio**: Infra de dados primeiro, UI depois. Streaming é o motor do app.

```
FASE 1: SSE (Server-Sent Events) ← CRÍTICO
  └─ Edge Function: Implementar streaming SSE
  └─ Frontend: fetch + ReadableStream (nativo RN 0.81+)
  └─ State: currentStreamText + isStreaming no useChatStore
  └─ Fallback: Retry automático + resposta completa se SSE falhar

FASE 2: Context (Gerenciamento de Memória)
  └─ Defense in depth: Frontend limita 25, Backend limita 20
  └─ Configuração centralizada em src/config/ai.ts
  └─ Garantir início com role: "user"

FASE 3: Markdown
  └─ MarkdownRenderer.tsx wrapper customizado
  └─ Estilos do design system (Tokens)
  └─ Code blocks com syntax highlight

FASE 4: Layout (UX de Chat)
  └─ Referência: ChatGPT-like
  └─ Bolhas limpas, minimalistas
  └─ StreamingText component para animação

FASE 5: Vision (Imagens)
  └─ Preview inline na bolha
  └─ Claude Vision para análise
  └─ Já funcional, melhorar UX

FASE 6: Voice (TTS)
  └─ Botão play por mensagem (não auto-play)
  └─ Cache híbrido: hash(texto+voz) → local → cloud
  └─ ElevenLabs Edge Function já existe
```

---

## Aprovação

| Papel       | Nome   | Data       | Status   |
| ----------- | ------ | ---------- | -------- |
| Solicitante | Lion   | 2026-01-06 | Aprovado |
| Tech Lead   | Claude | 2026-01-06 | Aprovado |

---

## Notas

- **react-native-markdown-display** já está instalado no projeto
- **ElevenLabs** Edge Function existe em `supabase/functions/elevenlabs-tts`
- **Gemini** configurado como provider em `.env.local`
- Manter compatibilidade com fallback chain existente
- Usar `Tokens` para cores (nunca hardcode)
- Usar `logger.*` (nunca console.log)
