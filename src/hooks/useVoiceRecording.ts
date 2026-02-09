/**
 * useVoiceRecording Hook
 *
 * Gerencia gravação de áudio para mensagens de voz no chat.
 * Usa expo-audio para gravação e Supabase Edge Function para transcrição.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useAudioRecorder, AudioModule, RecordingPresets, setAudioModeAsync } from "expo-audio";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import { supabase } from "../api/supabase";
import { getSupabaseFunctionsUrl } from "../config/env";
import { logger } from "../utils/logger";

// =======================
// TIPOS
// =======================

interface RecordingState {
  isRecording: boolean;
  isTranscribing: boolean;
  duration: number; // em segundos
  error: string | null;
}

interface UseVoiceRecordingReturn extends RecordingState {
  // Actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>; // Retorna texto transcrito
  cancelRecording: () => Promise<void>;

  // Status
  canRecord: boolean;
  permissionGranted: boolean;
}

// =======================
// CONSTANTES
// =======================

const FUNCTIONS_URL = getSupabaseFunctionsUrl();

// Limite de gravação (2 minutos)
const MAX_DURATION_MS = 120 * 1000;

// =======================
// HOOK
// =======================

export function useVoiceRecording(): UseVoiceRecordingReturn {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isTranscribing: false,
    duration: 0,
    error: null,
  });

  const [permissionGranted, setPermissionGranted] = useState(false);
  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Usar hook do expo-audio para criar recorder
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY, (status) => {
    // Status listener - atualiza estado quando gravação termina
    if (status.isFinished) {
      setState((prev) => ({ ...prev, isRecording: false }));
    }
    if (status.hasError && status.error) {
      setState((prev) => ({ ...prev, error: status.error }));
    }
  });

  /**
   * Verifica permissões de áudio
   */
  const checkPermissions = useCallback(async () => {
    try {
      const status = await AudioModule.getRecordingPermissionsAsync();
      setPermissionGranted(status.granted);
    } catch (error) {
      logger.error(
        "Failed to check audio permissions",
        "useVoiceRecording",
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }, []);

  // Verificar permissões ao montar
  useEffect(() => {
    checkPermissions();
    return () => {
      // Cleanup
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [checkPermissions]);

  /**
   * Solicita permissões de áudio
   */
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setPermissionGranted(status.granted);
      return status.granted;
    } catch (error) {
      logger.error(
        "Failed to request audio permissions",
        "useVoiceRecording",
        error instanceof Error ? error : new Error(String(error))
      );
      return false;
    }
  }, []);

  /**
   * Inicia gravação de áudio
   */
  const startRecording = useCallback(async (): Promise<void> => {
    try {
      // Verificar/solicitar permissões
      if (!permissionGranted) {
        const granted = await requestPermissions();
        if (!granted) {
          setState((prev) => ({
            ...prev,
            error: "Permissão de microfone negada. Habilite nas configurações.",
          }));
          return;
        }
      }

      // Configurar modo de áudio para gravação
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Preparar e iniciar gravação
      await recorder.prepareToRecordAsync();
      recorder.record();

      startTimeRef.current = Date.now();

      // Iniciar contador de duração
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setState((prev) => ({ ...prev, duration: elapsed }));

        // Auto-stop se atingir limite
        if (Date.now() - startTimeRef.current >= MAX_DURATION_MS) {
          recorder.stop();
          setState((prev) => ({
            ...prev,
            isRecording: false,
            error: "Limite de gravação atingido (2 min)",
          }));
        }
      }, 1000);

      setState({
        isRecording: true,
        isTranscribing: false,
        duration: 0,
        error: null,
      });

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      logger.info("Voice recording started", "useVoiceRecording");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao iniciar gravação";
      logger.error(
        "Failed to start recording",
        "useVoiceRecording",
        error instanceof Error ? error : new Error(String(error))
      );

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isRecording: false,
      }));
    }
  }, [permissionGranted, requestPermissions, recorder]);

  /**
   * Para gravação e transcreve o áudio
   */
  const stopRecording = useCallback(async (): Promise<string | null> => {
    // Parar contador
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    try {
      setState((prev) => ({ ...prev, isRecording: false, isTranscribing: true }));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Parar gravação e obter URI
      recorder.stop();
      const uri = recorder.uri;

      if (!uri) {
        throw new Error("Falha ao obter URI do áudio");
      }

      // Restaurar modo de áudio
      await setAudioModeAsync({
        allowsRecording: false,
      });

      // Ler arquivo como base64
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      // Verificar se tem Supabase configurado
      if (!supabase) {
        throw new Error("Supabase não configurado");
      }

      // Obter sessão para autenticação
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Usuário não autenticado");
      }

      // Chamar Edge Function de transcrição
      logger.info("Transcribing audio...", "useVoiceRecording");

      const response = await fetch(`${FUNCTIONS_URL}/transcribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          audioBase64: base64Audio,
          mimeType: "audio/m4a",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha na transcrição");
      }

      const data = await response.json();
      const transcribedText = data.text?.trim();

      if (!transcribedText) {
        throw new Error("Não consegui entender o áudio. Tente novamente.");
      }

      logger.info("Transcription successful", "useVoiceRecording", {
        textLength: transcribedText.length,
        latency: data.latency,
      });

      // Limpar arquivo temporário
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch (cleanupError) {
        // Cleanup failure is not critical
        logger.debug("Failed to cleanup audio file", "useVoiceRecording", {
          error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError),
        });
      }

      setState((prev) => ({
        ...prev,
        isTranscribing: false,
        duration: 0,
      }));

      return transcribedText;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao transcrever áudio";
      logger.error(
        "Transcription failed",
        "useVoiceRecording",
        error instanceof Error ? error : new Error(String(error))
      );

      setState((prev) => ({
        ...prev,
        isTranscribing: false,
        error: errorMessage,
        duration: 0,
      }));

      return null;
    }
  }, [recorder]);

  /**
   * Cancela gravação sem transcrever
   */
  const cancelRecording = useCallback(async (): Promise<void> => {
    // Parar contador
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    try {
      recorder.stop();
      const uri = recorder.uri;

      // Limpar arquivo
      if (uri) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }

      // Restaurar modo de áudio
      await setAudioModeAsync({
        allowsRecording: false,
      });
    } catch (cleanupError) {
      // Cleanup errors are not critical
      logger.debug("Cleanup error on cancel recording", "useVoiceRecording", {
        error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError),
      });
    }

    setState({
      isRecording: false,
      isTranscribing: false,
      duration: 0,
      error: null,
    });

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logger.info("Recording cancelled", "useVoiceRecording");
  }, [recorder]);

  return {
    // State
    ...state,

    // Actions
    startRecording,
    stopRecording,
    cancelRecording,

    // Status
    canRecord: !!FUNCTIONS_URL,
    permissionGranted,
  };
}

export default useVoiceRecording;
