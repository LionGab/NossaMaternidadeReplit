/**
 * useVoice Hook
 *
 * Gerencia playback de voz da NathIA com ElevenLabs TTS.
 * Verifica canUseAi (consentimento do usuário) antes de permitir reproducao.
 * Cacheia audio gerado para replay sem custo adicional.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AudioPlayer, AudioStatus } from "expo-audio";
import { generateSpeech, isElevenLabsConfigured, playAudio, stopAudio } from "../api/elevenlabs";
import { usePrivacyStore } from "../state/usePrivacyStore";
import { logger } from "../utils/logger";

// ============================================
// TIPOS
// ============================================

interface VoiceState {
  isPlaying: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  currentMessageId: string | null;
  progress: number; // 0-1
}

interface UseVoiceReturn extends VoiceState {
  // Actions
  playMessage: (messageId: string, text: string) => Promise<void>;
  stopPlayback: () => Promise<void>;
  togglePlayback: (messageId: string, text: string) => Promise<void>;

  // Status
  canUseVoice: boolean;
  isConfigured: boolean;

  // Helpers
  hasAudioCached: (messageId: string) => boolean;
}

interface CachedAudio {
  fileUri: string;
  text: string;
  generatedAt: number;
}

// ============================================
// CONSTANTES
// ============================================

// Cache de audio gerado (evita regenerar para mesma mensagem)
const audioCache = new Map<string, CachedAudio>();

// Limite de cache (10 mensagens)
const MAX_CACHE_SIZE = 10;

// ============================================
// HOOK
// ============================================

export function useVoice(): UseVoiceReturn {
  // Estado
  const [state, setState] = useState<VoiceState>({
    isPlaying: false,
    isLoading: false,
    isGenerating: false,
    error: null,
    currentMessageId: null,
    progress: 0,
  });

  // Refs
  const playerRef = useRef<AudioPlayer | null>(null);

  // AI consent access (unified check from privacy store)
  const canUseAi = usePrivacyStore((s) => s.canUseAi)();

  // Verificar se pode usar voz
  const canUseVoice = canUseAi && isElevenLabsConfigured();
  const isConfigured = isElevenLabsConfigured();

  /**
   * Limpa recursos de audio
   */
  const cleanup = useCallback(async () => {
    if (playerRef.current) {
      try {
        await stopAudio(playerRef.current);
      } catch (err) {
        // Log de cleanup failure para debug
        logger.warn("Audio cleanup failed", "useVoice", {
          error: err instanceof Error ? err.message : String(err),
        });
      }
      playerRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isLoading: false,
      currentMessageId: null,
      progress: 0,
    }));
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      void cleanup();
    };
  }, [cleanup]);

  /**
   * Verifica se tem audio em cache para uma mensagem
   */
  const hasAudioCached = useCallback((messageId: string): boolean => {
    return audioCache.has(messageId);
  }, []);

  /**
   * Gerencia cache de audio (LRU simples)
   */
  const addToCache = useCallback((messageId: string, fileUri: string, text: string) => {
    // Se cache cheio, remover mais antigo
    if (audioCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = audioCache.keys().next().value;
      if (oldestKey) {
        audioCache.delete(oldestKey);
      }
    }

    audioCache.set(messageId, {
      fileUri,
      text,
      generatedAt: Date.now(),
    });
  }, []);

  /**
   * Callback de status do playback (expo-audio)
   */
  const onPlaybackStatusUpdate = useCallback((status: AudioStatus) => {
    // Calcular progresso
    if (status.duration && status.currentTime) {
      const progress = status.currentTime / status.duration;
      setState((prev) => ({ ...prev, progress }));
    }

    // Detectar fim do playback
    if (status.didJustFinish) {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        progress: 0,
        currentMessageId: null,
      }));

      // Liberar player
      if (playerRef.current) {
        try {
          playerRef.current.release();
        } catch (error) {
          logger.debug("Player already released", "useVoice", {
            error: error instanceof Error ? error.message : String(error),
          });
        }
        playerRef.current = null;
      }
    }
  }, []);

  /**
   * Para reproducao atual
   */
  const stopPlayback = useCallback(async (): Promise<void> => {
    await cleanup();
  }, [cleanup]);

  /**
   * Reproduz mensagem com voz
   *
   * @param messageId - ID unico da mensagem
   * @param text - Texto para converter em fala
   */
  const playMessage = useCallback(
    async (messageId: string, text: string): Promise<void> => {
      // Verificar AI opt-in
      if (!canUseVoice) {
        setState((prev) => ({
          ...prev,
          error:
            "A IA está desativada. Ative em Privacidade e Preferências para usar a voz da NathIA.",
        }));
        return;
      }

      // Verificar configuracao
      if (!isConfigured) {
        setState((prev) => ({
          ...prev,
          error: "Servico de voz nao configurado",
        }));
        return;
      }

      // Limpar erro anterior
      setState((prev) => ({ ...prev, error: null }));

      // Se ja tocando esta mensagem, parar
      if (state.isPlaying && state.currentMessageId === messageId) {
        await stopPlayback();
        return;
      }

      // Se tocando outra mensagem, parar primeiro
      if (state.isPlaying) {
        await stopPlayback();
      }

      try {
        let fileUri: string;

        // Verificar cache
        const cached = audioCache.get(messageId);

        if (cached && cached.text === text) {
          // Usar cache
          fileUri = cached.fileUri;
          logger.info("Using cached audio", "useVoice", { messageId });
        } else {
          // Gerar novo audio
          setState((prev) => ({
            ...prev,
            isGenerating: true,
            isLoading: true,
            currentMessageId: messageId,
          }));

          fileUri = await generateSpeech({ text });

          // Adicionar ao cache
          addToCache(messageId, fileUri, text);

          setState((prev) => ({
            ...prev,
            isGenerating: false,
          }));
        }

        // Reproduzir
        setState((prev) => ({
          ...prev,
          isLoading: true,
          currentMessageId: messageId,
        }));

        const player = await playAudio(fileUri);
        playerRef.current = player;

        // Configurar listener de status (expo-audio)
        player.addListener("playbackStatusUpdate", onPlaybackStatusUpdate);

        setState((prev) => ({
          ...prev,
          isPlaying: true,
          isLoading: false,
          progress: 0,
        }));

        logger.info("Voice playback started", "useVoice", { messageId });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro ao reproduzir voz";

        logger.error(
          "Voice playback failed",
          "useVoice",
          error instanceof Error ? error : new Error(String(error))
        );

        setState((prev) => ({
          ...prev,
          isPlaying: false,
          isLoading: false,
          isGenerating: false,
          error: errorMessage,
          currentMessageId: null,
        }));
      }
    },
    [
      canUseVoice,
      isConfigured,
      state.isPlaying,
      state.currentMessageId,
      stopPlayback,
      addToCache,
      onPlaybackStatusUpdate,
    ]
  );

  /**
   * Toggle play/pause para uma mensagem
   */
  const togglePlayback = useCallback(
    async (messageId: string, text: string): Promise<void> => {
      if (state.isPlaying && state.currentMessageId === messageId) {
        // Pausar
        if (playerRef.current) {
          try {
            playerRef.current.pause();
            setState((prev) => ({ ...prev, isPlaying: false }));
          } catch (error) {
            // Se erro ao pausar, parar completamente
            logger.debug("Failed to pause, stopping playback", "useVoice", {
              error: error instanceof Error ? error.message : String(error),
            });
            await stopPlayback();
          }
        }
      } else if (!state.isPlaying && state.currentMessageId === messageId && playerRef.current) {
        // Retomar
        try {
          playerRef.current.play();
          setState((prev) => ({ ...prev, isPlaying: true }));
        } catch (error) {
          // Se erro ao retomar, regenerar
          logger.debug("Failed to resume, regenerating audio", "useVoice", {
            error: error instanceof Error ? error.message : String(error),
          });
          await playMessage(messageId, text);
        }
      } else {
        // Nova mensagem
        await playMessage(messageId, text);
      }
    },
    [state.isPlaying, state.currentMessageId, stopPlayback, playMessage]
  );

  return {
    // State
    ...state,

    // Actions
    playMessage,
    stopPlayback,
    togglePlayback,

    // Status
    canUseVoice,
    isConfigured,

    // Helpers
    hasAudioCached,
  };
}

// ============================================
// HOOK DE AI OPT-IN GATE PARA VOZ
// ============================================

/**
 * Hook auxiliar para verificar se usuário habilitou IA
 * antes de tentar reproduzir voz
 */
export function useVoiceOptInGate() {
  const canUseAi = usePrivacyStore((s) => s.canUseAi)();

  const checkAccess = useCallback(
    (onGranted: () => void, onDenied: () => void) => {
      if (canUseAi) {
        onGranted();
      } else {
        onDenied();
      }
    },
    [canUseAi]
  );

  return {
    hasAccess: canUseAi,
    checkAccess,
  };
}

export default useVoice;
