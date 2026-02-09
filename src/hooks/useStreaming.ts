/**
 * useStreaming - Hook para streaming SSE de respostas da NathIA
 *
 * Usa fetch + ReadableStream (nativo RN 0.81+) para consumir
 * Server-Sent Events da Edge Function.
 *
 * Features:
 * - Zero dependências externas (usa APIs nativas)
 * - Fallback automático para resposta completa se SSE falhar
 * - Integração com useChatStore para estado de streaming
 * - Abort controller para cancelamento
 */

import { useCallback, useRef } from "react";
import { useChatStore } from "../state";
import { supabase } from "../api/supabase";
import { AIMessage, AIResponse } from "../types/ai";
import { logger } from "../utils/logger";
import { AppError, ErrorCode, wrapError } from "../utils/error-handler";
import { getSupabaseFunctionsUrl } from "../config/env";

const FUNCTIONS_URL = getSupabaseFunctionsUrl();

// Timeout para SSE (mais longo que request normal)
const SSE_TIMEOUT_MS = 120_000; // 2 minutos

export interface StreamingContext {
  requiresGrounding?: boolean;
  imageData?: {
    base64: string;
    mediaType: string;
  };
  isCrisis?: boolean;
  conversationId?: string;
}

interface StreamingResult {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: string;
  latency: number;
  wasStreamed: boolean;
}

/**
 * Hook para streaming de respostas da NathIA
 */
export function useStreaming() {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Selectors específicos (evita re-renders desnecessários)
  const setStreaming = useChatStore((s) => s.setStreaming);
  const appendStreamText = useChatStore((s) => s.appendStreamText);
  const clearStreamText = useChatStore((s) => s.clearStreamText);

  /**
   * Cancela streaming em andamento
   */
  const cancelStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearStreamText();
  }, [clearStreamText]);

  /**
   * Inicia streaming de resposta da NathIA
   * Retorna a resposta completa ao final do stream
   */
  const streamResponse = useCallback(
    async (messages: AIMessage[], context: StreamingContext = {}): Promise<StreamingResult> => {
      // Cancelar streaming anterior se existir
      cancelStreaming();

      // Criar novo AbortController
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      // Timeout
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, SSE_TIMEOUT_MS);

      try {
        // Verificar autenticação
        if (!supabase) {
          throw new AppError(
            "Supabase não configurado",
            ErrorCode.API_ERROR,
            "Erro de configuração. Contate o suporte."
          );
        }

        if (!FUNCTIONS_URL) {
          throw new AppError(
            "Supabase Functions URL not configured",
            ErrorCode.API_ERROR,
            "Erro de configuração. Contate o suporte.",
            undefined,
            { missing: "EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL" }
          );
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new AppError(
            "Sessão não encontrada",
            ErrorCode.UNAUTHORIZED,
            "Você não está autenticado. Faça login para continuar."
          );
        }

        // Decidir provider
        let provider: "claude" | "gemini" | "openai" = "gemini";
        if (context.isCrisis || context.imageData) {
          provider = "claude";
        }

        // Preparar payload
        const payload = {
          messages,
          provider,
          grounding: context.requiresGrounding || false,
          stream: true, // Flag para SSE
          ...(context.imageData && { imageData: context.imageData }),
          ...(context.conversationId && { conversationId: context.conversationId }),
        };

        // Iniciar streaming
        setStreaming(true);
        const startTime = Date.now();

        logger.info("Starting SSE stream", "useStreaming", {
          provider,
          messageCount: messages.length,
        });

        // Nota: A function deployada no Supabase é "nathia-chat", não "/ai"
        const response = await fetch(`${FUNCTIONS_URL}/nathia-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            Accept: "text/event-stream",
          },
          body: JSON.stringify(payload),
          signal,
        });

        // Verificar se é SSE ou JSON fallback
        const contentType = response.headers.get("content-type") || "";
        const isSSE = contentType.includes("text/event-stream");

        if (!response.ok) {
          const errorText = await response.text();
          throw new AppError(
            `API error: ${response.status}`,
            ErrorCode.API_ERROR,
            "Erro ao conectar com a NathIA. Tente novamente.",
            undefined,
            { status: response.status, error: errorText }
          );
        }

        // Se não é SSE, usar fallback JSON
        if (!isSSE) {
          logger.info("SSE not available, using JSON fallback", "useStreaming");
          const data = await response.json();
          const latency = Date.now() - startTime;

          // Simular "streaming" exibindo o texto completo
          appendStreamText(data.content);

          return {
            content: data.content,
            usage: data.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
            provider: data.provider || provider,
            latency,
            wasStreamed: false,
          };
        }

        // Processar SSE stream
        const reader = response.body?.getReader();
        if (!reader) {
          throw new AppError(
            "ReadableStream not supported",
            ErrorCode.API_ERROR,
            "Seu dispositivo não suporta streaming."
          );
        }

        const decoder = new TextDecoder();
        let fullContent = "";
        let usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
        let finalProvider = provider;

        // Buffer para SSE parsing
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Decodificar chunk
          buffer += decoder.decode(value, { stream: true });

          // Processar linhas SSE
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Manter linha incompleta no buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              // [DONE] indica fim do stream
              if (data === "[DONE]") {
                continue;
              }

              try {
                const parsed = JSON.parse(data);

                // Erro do servidor
                if (parsed.error) {
                  const serverError = new Error(parsed.error.message || "Server error");
                  logger.error("SSE server error", "useStreaming", serverError);
                  throw new AppError(
                    parsed.error.message || "Server error",
                    ErrorCode.AI_SERVICE_ERROR,
                    parsed.error.userMessage || "Erro no servidor. Tente novamente."
                  );
                }

                // Chunk de texto
                if (parsed.chunk) {
                  fullContent += parsed.chunk;
                  appendStreamText(parsed.chunk);
                }

                // Thinking blocks (ignorar no output, mas logar)
                if (parsed.thinking) {
                  logger.debug("Thinking block received", "useStreaming", {
                    length: parsed.thinking.length,
                  });
                  // Não adicionar ao fullContent - thinking é interno
                }

                // Metadata final (usage, provider)
                if (parsed.usage) {
                  usage = parsed.usage;
                }
                if (parsed.provider) {
                  finalProvider = parsed.provider;
                }
              } catch (parseError) {
                // Ignorar linhas que não são JSON válido (exceto AppError)
                if (parseError instanceof AppError) {
                  throw parseError;
                }
                logger.debug("Invalid SSE JSON", "useStreaming", { data });
              }
            }
          }
        }

        // Processar buffer residual (fix buffer overflow)
        if (buffer.trim() && buffer.startsWith("data: ")) {
          const data = buffer.slice(6);
          if (data !== "[DONE]") {
            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                fullContent += parsed.chunk;
                appendStreamText(parsed.chunk);
              }
            } catch {
              logger.debug("Incomplete buffer ignored", "useStreaming", { buffer });
            }
          }
        }

        const latency = Date.now() - startTime;

        // Validar resposta antes de retornar
        if (fullContent.trim().length < 5) {
          logger.warn("AI response too short or empty", "useStreaming", {
            contentLength: fullContent.length,
          });
          throw new AppError(
            "AI response too short",
            ErrorCode.AI_SERVICE_ERROR,
            "A resposta da NathIA foi muito curta. Tente reformular sua pergunta."
          );
        }

        logger.info("SSE stream completed", "useStreaming", {
          contentLength: fullContent.length,
          latency,
          provider: finalProvider,
        });

        return {
          content: fullContent,
          usage,
          provider: finalProvider,
          latency,
          wasStreamed: true,
        };
      } catch (error) {
        // Verificar se foi cancelamento intencional
        if (error instanceof Error && error.name === "AbortError") {
          logger.info("SSE stream cancelled", "useStreaming");
          throw new AppError("Stream cancelled", ErrorCode.REQUEST_TIMEOUT, "Resposta cancelada.");
        }

        // Re-throw AppError
        if (error instanceof AppError) {
          throw error;
        }

        // Wrap erro genérico
        throw wrapError(
          error,
          ErrorCode.AI_SERVICE_ERROR,
          "Não consegui processar sua mensagem. Tente novamente.",
          { component: "useStreaming" }
        );
      } finally {
        clearTimeout(timeoutId);
        setStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [setStreaming, appendStreamText, cancelStreaming]
  );

  return {
    streamResponse,
    cancelStreaming,
  };
}

/**
 * Converte AIResponse para StreamingResult (para compatibilidade)
 */
export function aiResponseToStreamingResult(
  response: AIResponse,
  latency: number
): StreamingResult {
  return {
    content: response.content,
    usage: response.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    provider: response.provider || "unknown",
    latency,
    wasStreamed: false,
  };
}
