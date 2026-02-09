/**
 * AI Service - Client Wrapper (Seguro)
 *
 * Chama a Edge Function /ai com JWT do usuário autenticado.
 * Nunca expõe API keys no client.
 */

import { AIMessage, AIResponse } from "../types/ai";
import { logger } from "../utils/logger";
import { fetchWithRetry, TIMEOUT_PRESETS } from "../utils/fetch-utils";
import { AppError, ErrorCode, wrapError, isAppError } from "../utils/error-handler";
import { supabase } from "./supabase";
import { rateLimiter } from "../utils/rate-limiter";
import { getSupabaseFunctionsUrl } from "../config/env";
import { chatMessagesSchema, validateWithSchema } from "../utils/validation";

const FUNCTIONS_URL = getSupabaseFunctionsUrl();

export interface AIContext {
  requiresGrounding?: boolean; // Usa Gemini com Google Search
  estimatedTokens?: number; // Estimativa para rate limiting
  imageData?: {
    // Suporte a imagem (Claude vision)
    base64: string;
    mediaType: string;
  };
  isCrisis?: boolean; // Força Claude para situações de crise
  conversationId?: string; // ID da conversa para persistência no DB
  /** AbortSignal for request cancellation */
  abortSignal?: AbortSignal;
}

/**
 * Palavras-chave de CRISE - força uso de Claude (modelo mais seguro)
 * Sincronizado com edge function
 */
const CRISIS_KEYWORDS = [
  "suicídio",
  "suicidio",
  "me matar",
  "quero morrer",
  "não quero viver",
  "melhor morta",
  "vou me matar",
  "penso em morrer",
  "acabar com tudo",
  "não aguento mais viver",
  "queria estar morta",
  "machucar o bebê",
  "machucar meu filho",
  "machucar minha filha",
  "fazer mal ao bebê",
  "jogar o bebê",
  "sufocar o bebê",
  "me cortar",
  "me machucar",
  "me ferir",
  "não tenho saída",
  "ninguém se importa",
  "sou um peso",
];

/**
 * Detecta se mensagem indica crise (requer Claude)
 */
export function detectCrisis(message: string): boolean {
  const lower = message.toLowerCase();
  return CRISIS_KEYWORDS.some((k) => lower.includes(k));
}

/**
 * Payload enviado para a Edge Function /ai
 */
interface EdgeFunctionPayload {
  messages: AIMessage[];
  provider: "claude" | "gemini" | "openai";
  grounding: boolean;
  imageData?: {
    base64: string;
    mediaType: string;
  };
  conversationId?: string;
}

/**
 * Obter resposta da NathIA (Claude ou Gemini)
 * Decide automaticamente o provider com base no contexto
 * Inclui retry + timeout automático
 */
export async function getNathIAResponse(
  messages: AIMessage[],
  context: AIContext = {}
): Promise<AIResponse> {
  try {
    // Validação com Zod (CRÍTICO: previne prompt injection, mensagens vazias, spam)
    const validation = validateWithSchema(chatMessagesSchema, messages);
    if (!validation.success) {
      const errorMessage = validation.errors.join(", ");
      logger.error("Chat messages validation failed", "AIService", new Error(errorMessage));
      throw new AppError(
        "Mensagens inválidas",
        ErrorCode.VALIDATION_ERROR,
        errorMessage,
        undefined,
        { component: "AIService" }
      );
    }

    // Rate limiting - anti-spam
    if (!rateLimiter.canProceed("nathia-burst")) {
      throw new AppError(
        "Rate limit exceeded (burst)",
        ErrorCode.RATE_LIMITED,
        "Calma! Aguarde alguns segundos antes de enviar outra mensagem.",
        undefined,
        { key: "nathia-burst", resetIn: rateLimiter.getTimeUntilReset("nathia-burst") }
      );
    }

    if (!rateLimiter.canProceed("nathia")) {
      const resetIn = Math.ceil(rateLimiter.getTimeUntilReset("nathia") / 1000);
      throw new AppError(
        "Rate limit exceeded",
        ErrorCode.RATE_LIMITED,
        `Você atingiu o limite de mensagens. Aguarde ${resetIn}s.`,
        undefined,
        { key: "nathia", resetIn }
      );
    }

    // 1. Verificar autenticação
    if (!supabase) {
      throw new AppError(
        "Supabase não está configurado",
        ErrorCode.API_ERROR,
        "Erro de configuração. Contate o suporte.",
        undefined,
        { component: "AIService" }
      );
    }

    if (!FUNCTIONS_URL) {
      throw new AppError(
        "Supabase Functions URL not configured",
        ErrorCode.API_ERROR,
        "Erro de configuração. Contate o suporte.",
        undefined,
        { component: "AIService", missing: "EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL" }
      );
    }

    if (!supabase) {
      throw new AppError(
        "Supabase not configured",
        ErrorCode.API_ERROR,
        "Serviço temporariamente indisponível. Tente novamente mais tarde.",
        undefined,
        { component: "AIService" }
      );
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new AppError(
        "Session token not found",
        ErrorCode.UNAUTHORIZED,
        "Você não está autenticado. Faça login para continuar.",
        undefined,
        { component: "AIService" }
      );
    }

    // 2. Decidir provider (NathIA v2.0)
    // Default: Gemini (rápido, barato)
    // Crise/Imagem: Claude (mais seguro)
    let provider: EdgeFunctionPayload["provider"] = "gemini";
    let grounding = false;

    // Detectar crise na última mensagem do usuário
    const lastUserMessage = messages.filter((m) => m.role === "user").pop();
    const isCrisis = context.isCrisis || (lastUserMessage && detectCrisis(lastUserMessage.content));

    if (isCrisis) {
      // 🚨 CRISE: Força Claude (modelo mais seguro para situações delicadas)
      provider = "claude";
      logger.warn("Crisis detected, routing to Claude", "AIService");
    } else if (context.imageData) {
      // Imagem → Claude Vision
      provider = "claude";
    } else if (context.requiresGrounding) {
      // Pergunta médica → Gemini com Google Search
      provider = "gemini";
      grounding = true;
    } else if (context.estimatedTokens && context.estimatedTokens > 100000) {
      // Long context (>100K tokens) → Gemini (1M window)
      provider = "gemini";
    }
    // Default: Gemini (NathIA v2.0 - custo-benefício)

    // 3. Preparar payload
    const payload: EdgeFunctionPayload = {
      messages,
      provider,
      grounding,
      ...(context.imageData && { imageData: context.imageData }),
      ...(context.conversationId && { conversationId: context.conversationId }),
    };

    // 4. Chamar Edge Function COM JWT + RETRY + TIMEOUT
    // Nota: A function deployada no Supabase é "nathia-chat", não "/ai"
    const targetUrl = `${FUNCTIONS_URL}/nathia-chat`;
    const response = await fetchWithRetry(
      targetUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          "x-client-platform": "expo-app",
          "x-client-version": "2.0.0",
        },
        body: JSON.stringify(payload),
        // AI pode demorar até 60s dependendo do provider
        timeoutMs: TIMEOUT_PRESETS.CRITICAL,
        context: "AIService",
        // Pass external abort signal for user cancellation
        abortSignal: context.abortSignal,
      },
      {
        // Não retry em erros de autenticação/validação
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 5000,
        retryable: (error) => {
          if (isAppError(error)) {
            // Não retry em erros que não devem ser retentados
            return ![ErrorCode.UNAUTHORIZED, ErrorCode.FORBIDDEN, ErrorCode.INVALID_INPUT].includes(
              error.code as ErrorCode
            );
          }
          return true;
        },
      }
    );

    // 5. Parse resposta
    const data = await response.json();

    // Validar estrutura da resposta
    if (!data.content || !data.usage || !data.provider) {
      throw new AppError(
        "Invalid response structure from AI service",
        ErrorCode.API_ERROR,
        "Resposta inválida do servidor. Tente novamente.",
        undefined,
        { received: Object.keys(data) }
      );
    }

    logger.info(
      `AI response: ${data.provider}, ${data.latency}ms, ${data.usage.totalTokens} tokens`,
      "AIService"
    );

    // Aviso se usou fallback
    if (data.fallback) {
      logger.warn("AI fallback: Claude offline, usou OpenAI", "AIService");
    }

    return {
      content: data.content,
      usage: data.usage,
      provider: data.provider,
      latency: data.latency,
      grounding: data.grounding,
      fallback: data.fallback,
    };
  } catch (error) {
    // Se já é AppError, re-throw mantendo contexto
    if (isAppError(error)) {
      throw error;
    }

    // Converter erro genérico para AppError
    throw wrapError(
      error,
      ErrorCode.AI_SERVICE_ERROR,
      "Não consegui processar sua mensagem. Tente novamente em instantes.",
      { component: "AIService", messageCount: messages.length }
    );
  }
}

/**
 * Estimar tokens de uma conversa (rough approximation)
 * ~4 chars = 1 token
 */
export function estimateTokens(messages: AIMessage[]): number {
  const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
  return Math.ceil(totalChars / 4);
}

/**
 * Detectar se é pergunta médica (requires grounding)
 * Palavras-chave que indicam necessidade de busca atualizada
 */
export function detectMedicalQuestion(message: string): boolean {
  const medicalKeywords = [
    "o que é",
    "como prevenir",
    "sintomas de",
    "tratamento para",
    "pode ser",
    "é normal",
    "pesquisar",
    "informações sobre",
    "dados sobre",
    "estudos sobre",
    // Termos médicos comuns
    "pré-eclâmpsia",
    "eclâmpsia",
    "diabetes gestacional",
    "hipertensão",
    "anemia",
    "infecção urinária",
    "contrações",
    "placenta",
    "líquido amniótico",
  ];

  const lowerMessage = message.toLowerCase();
  return medicalKeywords.some((keyword) => lowerMessage.includes(keyword));
}

/**
 * Converter imagem URI para base64 (para Claude vision)
 */
export async function imageUriToBase64(
  uri: string
): Promise<{ base64: string; mediaType: string }> {
  try {
    // Se já é base64, extrair
    if (uri.startsWith("data:")) {
      const match = uri.match(/^data:(image\/\w+);base64,(.*)$/);
      if (!match) throw new Error("Invalid base64 data URI");
      return {
        mediaType: match[1],
        base64: match[2],
      };
    }

    // Senão, fetch e converter
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const match = dataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
        if (!match) {
          reject(new Error("Failed to convert image to base64"));
          return;
        }
        resolve({
          mediaType: match[1],
          base64: match[2],
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    logger.error("Image conversion error", "AIService", error as Error);
    throw new Error("Não consegui processar a imagem. Tente outra.");
  }
}
