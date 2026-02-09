/**
 * Tipos para ícones Ionicons
 * Elimina necessidade de usar 'as any' em componentes
 */

import { Ionicons } from "@expo/vector-icons";

/**
 * Nome de ícone válido do Ionicons
 * Extraído do glyphMap para type safety
 */
export type IconName = keyof typeof Ionicons.glyphMap;

/**
 * Type guard para verificar se uma string é um IconName válido
 * @param value - String a ser verificada
 * @returns True se for um IconName válido
 */
export function isIconName(value: string): value is IconName {
  return value in Ionicons.glyphMap;
}

/**
 * Helper para obter IconName com fallback seguro
 * @param icon - Nome do ícone
 * @param fallback - Ícone padrão se inválido
 * @returns IconName válido
 */
export function getIconName(icon: string, fallback: IconName = "ellipse"): IconName {
  return isIconName(icon) ? icon : fallback;
}
