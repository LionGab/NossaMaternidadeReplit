import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "./logger";

const MESSAGE_COUNT_KEY = "nathia_message_count";

export interface MessageCountData {
  count: number;
  lastResetDate: string; // YYYY-MM-DD em timezone de Brasília
}

/**
 * Obtém data atual em horário de Brasília (UTC-3) no formato YYYY-MM-DD
 */
export function getTodayBrasilia(): string {
  const now = new Date();
  const brasiliaOffset = -3 * 60; // -180 minutos
  const brasiliaTime = new Date(now.getTime() + (brasiliaOffset - now.getTimezoneOffset()) * 60000);
  return brasiliaTime.toISOString().split("T")[0];
}

/**
 * Verifica se é um novo dia comparando com a última data de reset
 */
function shouldResetDailyCount(lastResetDate: string | null): boolean {
  if (!lastResetDate) return true;
  const currentDate = getTodayBrasilia();
  return currentDate !== lastResetDate;
}

/**
 * Carrega contador de mensagens do AsyncStorage com reset automático diário
 */
export async function loadMessageCountData(userId: string): Promise<MessageCountData> {
  const key = `${MESSAGE_COUNT_KEY}_${userId}`;
  const stored = await AsyncStorage.getItem(key);

  if (!stored) {
    return { count: 0, lastResetDate: getTodayBrasilia() };
  }

  // Tentar parsear JSON (novo formato)
  try {
    const data = JSON.parse(stored) as MessageCountData;

    // Verificar se precisa resetar (novo dia)
    if (shouldResetDailyCount(data.lastResetDate)) {
      const resetData = { count: 0, lastResetDate: getTodayBrasilia() };
      await AsyncStorage.setItem(key, JSON.stringify(resetData));
      logger.info("Daily message count reset", "MessageCount", { userId });
      return resetData;
    }

    return data;
  } catch (error) {
    // Formato antigo (apenas número) - migrar automaticamente
    logger.debug("Migrating old message count format", "MessageCount", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    const oldCount = parseInt(stored, 10);
    const newData = { count: oldCount, lastResetDate: getTodayBrasilia() };
    await AsyncStorage.setItem(key, JSON.stringify(newData));
    logger.info("Migrated old message count format", "MessageCount", {
      userId,
      oldCount,
    });
    return newData;
  }
}

/**
 * Salva contador de mensagens no AsyncStorage
 */
export async function saveMessageCountData(userId: string, data: MessageCountData): Promise<void> {
  const key = `${MESSAGE_COUNT_KEY}_${userId}`;
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

/**
 * Reseta contador de mensagens (usado em migrations ou debug)
 */
export async function resetMessageCount(userId: string): Promise<void> {
  const data: MessageCountData = {
    count: 0,
    lastResetDate: getTodayBrasilia(),
  };
  await saveMessageCountData(userId, data);
  logger.info("Message count manually reset", "MessageCount", { userId });
}
