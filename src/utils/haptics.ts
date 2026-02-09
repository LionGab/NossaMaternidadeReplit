/**
 * Haptics - Utilitário de Feedback Tátil Padronizado
 *
 * Centraliza todos os feedbacks hápticos do app para consistência.
 * Usa expo-haptics internamente com fallback silencioso para web.
 *
 * @example
 * ```tsx
 * import { haptic } from '@/utils/haptics';
 *
 * // Em um botão
 * <Pressable onPress={() => { haptic.light(); doAction(); }}>
 *
 * // Sucesso após ação
 * await saveData();
 * haptic.success();
 *
 * // Erro de validação
 * if (!isValid) {
 *   haptic.error();
 *   showError();
 * }
 * ```
 */

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// Verifica se haptics está disponível (não funciona em web ou alguns simuladores)
const isHapticsAvailable = Platform.OS !== "web";

/**
 * Executa haptic de forma segura (silencia erros em plataformas não suportadas)
 */
const safeHaptic = async (fn: () => Promise<void>): Promise<void> => {
  if (!isHapticsAvailable) return;
  try {
    await fn();
  } catch {
    // Silencia erros de haptics não disponível
  }
};

/**
 * Feedbacks hápticos padronizados para o app
 */
export const haptic = {
  /**
   * Feedback leve - para interações comuns
   * Uso: tap em botões, cards, toggles
   */
  light: () => safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),

  /**
   * Feedback médio - para ações importantes
   * Uso: confirmações, seleções significativas
   */
  medium: () => safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),

  /**
   * Feedback pesado - para ações de destaque
   * Uso: drop de drag, ações destrutivas, marcos
   */
  heavy: () => safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),

  /**
   * Feedback de seleção - para mudanças de estado
   * Uso: picker, slider, segmented control
   */
  selection: () => safeHaptic(() => Haptics.selectionAsync()),

  /**
   * Feedback de sucesso - para ações completadas
   * Uso: save concluído, hábito marcado, conquista desbloqueada
   */
  success: () =>
    safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),

  /**
   * Feedback de aviso - para alertas importantes
   * Uso: ação requer atenção, limite atingido
   */
  warning: () =>
    safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),

  /**
   * Feedback de erro - para falhas
   * Uso: validação falhou, erro de rede, ação bloqueada
   */
  error: () => safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),

  /**
   * Feedback rígido - para impactos secos
   * Uso: colisões, limites, snap to position
   */
  rigid: () => safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)),

  /**
   * Feedback suave - para transições gentis
   * Uso: scroll suave, transições, hover
   */
  soft: () => safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)),
} as const;

/**
 * Tipos de haptic disponíveis (para tipagem em componentes)
 */
export type HapticType = keyof typeof haptic;

/**
 * Versão síncrona que não bloqueia (fire and forget)
 * Uso interno em handlers onde não queremos await
 */
export const hapticSync = {
  light: () => void haptic.light(),
  medium: () => void haptic.medium(),
  heavy: () => void haptic.heavy(),
  selection: () => void haptic.selection(),
  success: () => void haptic.success(),
  warning: () => void haptic.warning(),
  error: () => void haptic.error(),
  rigid: () => void haptic.rigid(),
  soft: () => void haptic.soft(),
} as const;

export default haptic;
