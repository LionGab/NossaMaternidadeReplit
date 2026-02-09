/**
 * Chat Types - Tipos padronizados para o Chat NathIA
 *
 * Este arquivo define tipos fortes para mensagens, attachments,
 * conversas e estados de sincronização.
 *
 * @module types/chat
 */

/**
 * Role da mensagem no chat
 */
export type ChatRole = "user" | "assistant" | "system";

/**
 * Status da mensagem durante o ciclo de vida
 * - sending: Mensagem sendo enviada ao servidor
 * - streaming: Resposta da IA sendo recebida em tempo real
 * - done: Mensagem finalizada com sucesso
 * - error: Erro durante envio ou processamento
 */
export type MessageStatus = "sending" | "streaming" | "done" | "error";

/**
 * Tipo de attachment suportado
 */
export type AttachmentType = "image" | "audio";

/**
 * Attachment de mídia em uma mensagem
 */
export interface ChatAttachment {
  /** ID único do attachment */
  id: string;
  /** Tipo do attachment */
  type: AttachmentType;
  /** URL remota do arquivo (após upload) */
  url: string;
  /** URI local do arquivo (antes do upload) */
  localUri?: string;
  /** MIME type do arquivo */
  mimeType: string;
  /** Tamanho em bytes */
  sizeBytes: number;
  /** Largura em pixels (para imagens) */
  width?: number;
  /** Altura em pixels (para imagens) */
  height?: number;
  /** Duração em segundos (para áudio) */
  duration?: number;
  /** Status do upload */
  uploadStatus?: "pending" | "uploading" | "done" | "error";
  /** Erro de upload se houver */
  uploadError?: string;
}

/**
 * Mensagem do chat com suporte a status e attachments
 *
 * Compatível com o tipo legado ChatMessage de navigation.ts,
 * adicionando campos para streaming, attachments e erros.
 */
export interface ChatMessageV2 {
  /** ID único da mensagem */
  id: string;
  /** Role da mensagem (user, assistant, system) */
  role: ChatRole;
  /** Conteúdo textual da mensagem */
  content: string;
  /** Data de criação (ISO 8601) */
  createdAt: string;
  /** Status atual da mensagem */
  status: MessageStatus;
  /** Attachments de mídia (imagens, áudios) */
  attachments?: ChatAttachment[];
  /** Mensagem de erro se status === 'error' */
  error?: string;
  /**
   * URL de imagem legada (compatibilidade com ChatMessage original)
   * @deprecated Use attachments[] para novas implementações
   */
  image_url?: string;
}

/**
 * Status de sincronização da conversa com backend
 */
export type SyncStatus = "synced" | "pending" | "syncing" | "error";

/**
 * Conversa do chat com suporte a sync backend
 *
 * Compatível com Conversation de store.ts,
 * adicionando campos para sincronização com Supabase.
 */
export interface ChatConversation {
  /** ID local da conversa */
  id: string;
  /** Título da conversa (gerado automaticamente) */
  title: string;
  /** Data de criação (ISO 8601) */
  createdAt: string;
  /** Data de última atualização (ISO 8601) */
  updatedAt: string;
  /** Mensagens da conversa */
  messages: ChatMessageV2[];
  /** ID remoto no Supabase (após sync) */
  remoteId?: string;
  /** Data do último sync bem-sucedido (ISO 8601) */
  lastSyncedAt?: string;
  /** Status de sincronização */
  syncStatus?: SyncStatus;
  /** Erro de sincronização se houver */
  syncError?: string;
}

// ==========================================
// Funções de Conversão (Compatibilidade)
// ==========================================

import type { ChatMessage } from "./navigation";

/**
 * Converte ChatMessage legado para ChatMessageV2
 */
export function toMessageV2(msg: ChatMessage): ChatMessageV2 {
  return {
    id: msg.id,
    role: msg.role,
    content: msg.content,
    createdAt: msg.createdAt,
    status: "done",
    image_url: msg.image_url,
    // Converter image_url legado para attachment
    attachments: msg.image_url
      ? [
          {
            id: `img-${msg.id}`,
            type: "image",
            url: msg.image_url,
            mimeType: "image/jpeg",
            sizeBytes: 0,
            uploadStatus: "done",
          },
        ]
      : undefined,
  };
}

/**
 * Converte ChatMessageV2 para ChatMessage legado
 * (para compatibilidade com código existente)
 */
export function toLegacyMessage(msg: ChatMessageV2): ChatMessage {
  // Pegar primeira imagem dos attachments
  const imageAttachment = msg.attachments?.find((a) => a.type === "image");

  return {
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    createdAt: msg.createdAt,
    image_url: imageAttachment?.url || msg.image_url,
  };
}

/**
 * Cria uma nova mensagem com status 'sending'
 */
export function createUserMessage(content: string, attachments?: ChatAttachment[]): ChatMessageV2 {
  return {
    id: Date.now().toString(),
    role: "user",
    content,
    createdAt: new Date().toISOString(),
    status: "sending",
    attachments,
  };
}

/**
 * Cria uma mensagem placeholder de assistant para streaming
 */
export function createStreamingMessage(): ChatMessageV2 {
  return {
    id: `stream-${Date.now()}`,
    role: "assistant",
    content: "",
    createdAt: new Date().toISOString(),
    status: "streaming",
  };
}

/**
 * Cria uma mensagem de erro
 */
export function createErrorMessage(error: string): ChatMessageV2 {
  return {
    id: `error-${Date.now()}`,
    role: "assistant",
    content: "",
    createdAt: new Date().toISOString(),
    status: "error",
    error,
  };
}

// ==========================================
// Type Guards
// ==========================================

/**
 * Verifica se mensagem está em estado de loading
 */
export function isMessageLoading(msg: ChatMessageV2): boolean {
  return msg.status === "sending" || msg.status === "streaming";
}

/**
 * Verifica se mensagem teve erro
 */
export function isMessageError(msg: ChatMessageV2): boolean {
  return msg.status === "error";
}

/**
 * Verifica se mensagem está completa
 */
export function isMessageDone(msg: ChatMessageV2): boolean {
  return msg.status === "done";
}

/**
 * Verifica se conversa precisa de sync
 */
export function needsSync(conv: ChatConversation): boolean {
  if (!conv.remoteId) return true;
  if (conv.syncStatus === "pending" || conv.syncStatus === "error") return true;

  // Verificar se há mensagens não sincronizadas
  const lastSyncTime = conv.lastSyncedAt ? new Date(conv.lastSyncedAt).getTime() : 0;
  const updatedTime = new Date(conv.updatedAt).getTime();

  return updatedTime > lastSyncTime;
}
