import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { isExpoGo } from "../utils/expo";
import { logger } from "../utils/logger";

export interface SupabaseAuthStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

interface MmkvStore {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
}

const STORAGE_CONTEXT = "SupabaseAuthStorage";

const ENC_KEY_SECURESTORE_ID = "nm:sb:auth:mmkv_enc_key:v1";
const MIGRATED_FLAG_PREFIX = "nm:sb:auth:migrated:v1:";

// Keys for which we detected write failures. We do NOT force logout mid-session;
// we simply stop trying to persist until the next cold start.
const persistenceDisabledKeys = new Set<string>();

// Avoid repeated writes when Supabase calls setItem frequently.
const lastWrittenByKey = new Map<string, string>();

// Avoid duplicate getItem/migration work under concurrency.
const inFlightByKey = new Map<string, Promise<string | null>>();

let mmkvStore: MmkvStore | null = null;
let mmkvInitAttempted = false;

function safeByteLengthUtf8(input: string): number {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(input).length;
  }

  // Fallback approximation (suficiente para JSON/JWT).
  let bytes = 0;
  for (let i = 0; i < input.length; i++) {
    const codePoint = input.charCodeAt(i);
    if (codePoint <= 0x7f) bytes += 1;
    else if (codePoint <= 0x7ff) bytes += 2;
    else bytes += 3;
  }
  return bytes;
}

function sizeBucket(byteLength: number): "<1k" | "1-2k" | ">2k" {
  if (byteLength < 1024) return "<1k";
  if (byteLength <= 2048) return "1-2k";
  return ">2k";
}

function generateRandomHex(bytesLen: number): string {
  const bytes = new Uint8Array(bytesLen);

  const cryptoObj = globalThis.crypto as unknown as {
    getRandomValues?: (a: Uint8Array) => Uint8Array;
  };
  if (typeof cryptoObj?.getRandomValues !== "function") {
    throw new Error("crypto.getRandomValues não disponível para gerar encryptionKey com segurança");
  }

  cryptoObj.getRandomValues(bytes);
  let hex = "";
  for (const b of bytes) {
    hex += b.toString(16).padStart(2, "0");
  }
  return hex;
}

async function getOrCreateEncryptionKey(): Promise<string> {
  const existing = await SecureStore.getItemAsync(ENC_KEY_SECURESTORE_ID);
  if (existing) return existing;

  // 32 bytes -> 64 hex chars (pequeno o suficiente para o SecureStore)
  const created = generateRandomHex(32);
  await SecureStore.setItemAsync(ENC_KEY_SECURESTORE_ID, created, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return created;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function compactSupabaseSessionJson(value: string): { compacted: string; didCompact: boolean } {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) return { compacted: value, didCompact: false };

    const accessToken = parsed.access_token;
    const refreshToken = parsed.refresh_token;
    if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
      return { compacted: value, didCompact: false };
    }

    const tokenType = typeof parsed.token_type === "string" ? parsed.token_type : undefined;
    const expiresAt = typeof parsed.expires_at === "number" ? parsed.expires_at : undefined;
    const expiresIn = typeof parsed.expires_in === "number" ? parsed.expires_in : undefined;

    const user = parsed.user;
    let compactUser: { id: string; email?: string; user_metadata?: { name?: string } } | undefined;
    if (isRecord(user) && typeof user.id === "string") {
      const email = typeof user.email === "string" ? user.email : undefined;
      const userMetadata = user.user_metadata;
      const name =
        isRecord(userMetadata) && typeof userMetadata.name === "string"
          ? userMetadata.name
          : undefined;

      compactUser = {
        id: user.id,
        ...(email ? { email } : {}),
        ...(name ? { user_metadata: { name } } : {}),
      };
    }

    // Minimização (LGPD): manter apenas o necessário para refresh/autorizações básicas.
    // Removemos campos grandes como identities/app_metadata e provider_token*.
    const minimal = {
      __nm_compact_v: 1,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: tokenType,
      expires_at: expiresAt,
      expires_in: expiresIn,
      ...(compactUser ? { user: compactUser } : {}),
    };

    return { compacted: JSON.stringify(minimal), didCompact: true };
  } catch {
    return { compacted: value, didCompact: false };
  }
}

async function initMmkvStore(): Promise<MmkvStore | null> {
  if (mmkvStore) return mmkvStore;
  if (mmkvInitAttempted) return null;
  mmkvInitAttempted = true;

  // Expo Go geralmente não possui módulo nativo do MMKV. Nesse caso, usamos fallback dev-only.
  if (isExpoGo()) {
    logger.info(
      "Expo Go detectado: usando fallback SecureStore-only para sessão Supabase",
      STORAGE_CONTEXT
    );
    return null;
  }

  try {
    const encryptionKey = await getOrCreateEncryptionKey();

    // Lazy require para evitar quebra em web/tests/Expo Go.
    const mmkvModule = require("react-native-mmkv") as unknown;
    if (!isRecord(mmkvModule) || typeof mmkvModule.MMKV !== "function") {
      throw new Error("react-native-mmkv não expôs MMKV como esperado");
    }

    const MMKVClass = mmkvModule.MMKV as unknown as new (config: {
      id?: string;
      encryptionKey?: string;
    }) => MmkvStore;

    mmkvStore = new MMKVClass({ id: "sb.auth", encryptionKey });
    logger.debug("MMKV encrypted storage initialized for Supabase auth", STORAGE_CONTEXT);
    return mmkvStore;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.warn("MMKV init falhou; usando fallback SecureStore-only (dev-only)", STORAGE_CONTEXT, {
      message: err.message,
    });
    return null;
  }
}

function withInFlight(key: string, fn: () => Promise<string | null>): Promise<string | null> {
  const existing = inFlightByKey.get(key);
  if (existing) return existing;

  const p = fn().finally(() => {
    inFlightByKey.delete(key);
  });
  inFlightByKey.set(key, p);
  return p;
}

async function getNativeItem(key: string): Promise<string | null> {
  const store = await initMmkvStore();

  if (store) {
    const stored = store.getString(key);
    if (typeof stored === "string") return stored;

    // Migração 1x (por key) do legado em AsyncStorage → MMKV
    const migratedFlagKey = `${MIGRATED_FLAG_PREFIX}${key}`;
    const migrated = store.getString(migratedFlagKey) === "1";
    if (!migrated) {
      const legacy = await AsyncStorage.getItem(key);
      store.set(migratedFlagKey, "1");

      if (legacy !== null) {
        const { compacted } = compactSupabaseSessionJson(legacy);
        try {
          store.set(key, compacted);
          await AsyncStorage.removeItem(key);
          lastWrittenByKey.set(key, compacted);
        } catch (e) {
          // Não remover legacy se não conseguimos persistir — evita “logout fantasma”.
          logger.warn(
            "Falha ao migrar sessão do AsyncStorage para MMKV; mantendo sessão atual",
            STORAGE_CONTEXT,
            {
              key,
              error: e instanceof Error ? e.message : String(e),
            }
          );
        }
        return compacted;
      }
    }

    return null;
  }

  // Fallback dev-only: SecureStore-only (pode falhar por limite; tratamos de forma determinística)
  const secure = await SecureStore.getItemAsync(key);
  if (secure !== null) return secure;

  // Migração 1x (best-effort) do AsyncStorage → SecureStore
  const legacy = await AsyncStorage.getItem(key);
  if (legacy !== null) {
    const { compacted } = compactSupabaseSessionJson(legacy);
    try {
      await SecureStore.setItemAsync(key, compacted, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      await AsyncStorage.removeItem(key);
      lastWrittenByKey.set(key, compacted);
    } catch (e) {
      // Não remover legacy se não conseguimos persistir — evita “logout fantasma”.
      logger.warn(
        "Falha ao migrar sessão do AsyncStorage para SecureStore; persistência desabilitada até reiniciar",
        STORAGE_CONTEXT,
        {
          key,
          error: e instanceof Error ? e.message : String(e),
        }
      );
      persistenceDisabledKeys.add(key);
    }
    return compacted;
  }

  return null;
}

async function setNativeItem(key: string, value: string): Promise<void> {
  if (persistenceDisabledKeys.has(key)) return;

  const { compacted, didCompact } = compactSupabaseSessionJson(value);
  const byteLength = safeByteLengthUtf8(compacted);
  const bucket = sizeBucket(byteLength);

  // Dedupe writes (Supabase pode chamar setItem repetidamente durante refresh).
  const last = lastWrittenByKey.get(key);
  if (last === compacted) return;

  const store = await initMmkvStore();

  if (store) {
    try {
      store.set(key, compacted);
      lastWrittenByKey.set(key, compacted);

      if (__DEV__ && (didCompact || bucket !== "<1k")) {
        logger.debug("Supabase auth session persisted (MMKV)", STORAGE_CONTEXT, {
          key,
          didCompact,
          byteLength,
          bucket,
        });
      }
      return;
    } catch (e) {
      // Não forçar logout mid-session. Só desabilitar persistência até reiniciar.
      persistenceDisabledKeys.add(key);
      logger.warn(
        "Falha ao persistir sessão no MMKV; persistência desabilitada até reiniciar",
        STORAGE_CONTEXT,
        {
          key,
          didCompact,
          byteLength,
          bucket,
          error: e instanceof Error ? e.message : String(e),
        }
      );
      return;
    }
  }

  // Fallback dev-only: SecureStore-only
  try {
    await SecureStore.setItemAsync(key, compacted, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    lastWrittenByKey.set(key, compacted);

    if (__DEV__ && (didCompact || bucket !== "<1k")) {
      logger.debug("Supabase auth session persisted (SecureStore fallback)", STORAGE_CONTEXT, {
        key,
        didCompact,
        byteLength,
        bucket,
      });
    }
  } catch (e) {
    persistenceDisabledKeys.add(key);
    logger.warn(
      "Falha ao persistir sessão no SecureStore; persistência desabilitada até reiniciar",
      STORAGE_CONTEXT,
      {
        key,
        didCompact,
        byteLength,
        bucket,
        error: e instanceof Error ? e.message : String(e),
      }
    );
  }
}

async function removeNativeItem(key: string): Promise<void> {
  try {
    const store = await initMmkvStore();
    if (store) {
      store.delete(key);
      store.delete(`${MIGRATED_FLAG_PREFIX}${key}`);
    }
  } catch (e) {
    logger.warn("Falha ao remover item do MMKV", STORAGE_CONTEXT, {
      key,
      error: e instanceof Error ? e.message : String(e),
    });
  }

  // Cleanup defensivo: remover legado e fallback.
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {}

  persistenceDisabledKeys.delete(key);
  lastWrittenByKey.delete(key);
}

export function createSupabaseAuthStorage(): SupabaseAuthStorage {
  // Web: manter AsyncStorage (localStorage-backed).
  if (Platform.OS === "web") {
    return {
      getItem: (key) => AsyncStorage.getItem(key),
      setItem: (key, value) => AsyncStorage.setItem(key, value),
      removeItem: (key) => AsyncStorage.removeItem(key),
    };
  }

  return {
    getItem: (key) => withInFlight(key, () => getNativeItem(key)),
    setItem: (key, value) => setNativeItem(key, value),
    removeItem: (key) => removeNativeItem(key),
  };
}
