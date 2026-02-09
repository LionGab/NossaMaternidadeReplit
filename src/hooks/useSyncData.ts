/**
 * useSyncData Hook - Generic Offline-First Sync
 *
 * Hook reutilizável para sincronização offline-first com Supabase
 * Suporta qualquer tabela e inclui queue de operações pendentes
 *
 * @module hooks/useSyncData
 */

import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetworkStatus } from "./useNetworkStatus";
import { logger } from "@/utils/logger";

const CONTEXT = "useSyncData";

// ============================================
// Types
// ============================================

export interface SyncOperation<T> {
  type: "create" | "update" | "delete";
  data: T;
  id: string;
  timestamp: number;
}

export interface UseSyncDataOptions<T> {
  /** Table name in Supabase (for future use/logging) */
  tableName: string; // Used for logging/debugging purposes
  /** Function to fetch data from Supabase */
  fetchFn: () => Promise<{ data: T[] | null; error: Error | null }>;
  /** Function to create item in Supabase */
  createFn?: (item: Omit<T, "id" | "user_id" | "created_at" | "updated_at">) => Promise<{
    data: T | null;
    error: Error | null;
  }>;
  /** Function to update item in Supabase */
  updateFn?: (
    id: string,
    updates: Partial<T>
  ) => Promise<{
    data: T | null;
    error: Error | null;
  }>;
  /** Function to delete item in Supabase */
  deleteFn?: (id: string) => Promise<{ data: boolean; error: Error | null }>;
  /** Function to batch save items (for sync) */
  batchSaveFn?: (items: T[]) => Promise<{ data: T[] | null; error: Error | null }>;
  /** Function to get ID from item */
  getId: (item: T) => string;
  /** Storage key for local cache */
  storageKey: string;
}

export interface UseSyncDataReturn<T> {
  // State
  data: T[];
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;
  error: Error | null;

  // Methods
  syncToCloud: () => Promise<{ error: Error | null }>;
  syncFromCloud: () => Promise<{ error: Error | null }>;
  refresh: () => Promise<void>;
  addItem: (
    item: Omit<T, "id" | "user_id" | "created_at" | "updated_at">
  ) => Promise<{ error: Error | null }>;
  updateItem: (id: string, updates: Partial<T>) => Promise<{ error: Error | null }>;
  deleteItem: (id: string) => Promise<{ error: Error | null }>;
  clearError: () => void;
}

/**
 * Hook genérico para sincronização offline-first
 *
 * @example
 * ```tsx
 * const { data, syncToCloud, syncFromCloud, addItem } = useSyncData({
 *   tableName: "mvp_tasks",
 *   fetchFn: fetchTasks,
 *   createFn: createTask,
 *   updateFn: updateTask,
 *   deleteFn: deleteTask,
 *   getId: (task) => task.id,
 *   storageKey: "mvp_tasks_cache",
 * });
 * ```
 */
export function useSyncData<T extends { id: string }>(
  options: UseSyncDataOptions<T>
): UseSyncDataReturn<T> {
  const { fetchFn, createFn, updateFn, deleteFn, batchSaveFn, getId, storageKey } = options;

  const { isOffline } = useNetworkStatus();

  // State
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Queue of pending operations when offline
  const queueRef = useRef<SyncOperation<T>[]>([]);

  /**
   * Load data from local storage
   */
  const loadFromStorage = useCallback(async (): Promise<T[]> => {
    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (!stored) return [];

      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];

      return parsed as T[];
    } catch (err) {
      logger.warn("Failed to load from storage", CONTEXT, {
        storageKey,
        error: err instanceof Error ? err.message : String(err),
      });
      return [];
    }
  }, [storageKey]);

  /**
   * Save data to local storage
   */
  const saveToStorage = useCallback(
    async (items: T[]): Promise<void> => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(items));
      } catch (err) {
        logger.error(
          "Failed to save to storage",
          CONTEXT,
          err instanceof Error ? err : new Error(String(err))
        );
      }
    },
    [storageKey]
  );

  /**
   * Load pending operations queue
   */
  const loadQueue = useCallback(async (): Promise<SyncOperation<T>[]> => {
    try {
      const stored = await AsyncStorage.getItem(`${storageKey}_queue`);
      if (!stored) return [];

      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];

      return parsed as SyncOperation<T>[];
    } catch (err) {
      logger.warn("Failed to load queue", CONTEXT, {
        storageKey,
        error: err instanceof Error ? err.message : String(err),
      });
      return [];
    }
  }, [storageKey]);

  /**
   * Save pending operations queue
   */
  const saveQueue = useCallback(
    async (queue: SyncOperation<T>[]): Promise<void> => {
      try {
        await AsyncStorage.setItem(`${storageKey}_queue`, JSON.stringify(queue));
      } catch (err) {
        logger.error(
          "Failed to save queue",
          CONTEXT,
          err instanceof Error ? err : new Error(String(err))
        );
      }
    },
    [storageKey]
  );

  /**
   * Process pending operations queue
   */
  const processQueue = useCallback(async (): Promise<void> => {
    if (queueRef.current.length === 0 || isOffline) {
      return;
    }

    if (!createFn || !updateFn || !deleteFn) {
      logger.warn("Queue processing skipped - missing functions", CONTEXT);
      return;
    }

    setIsSyncing(true);

    try {
      const queue = [...queueRef.current];
      queueRef.current = [];

      for (const op of queue) {
        try {
          if (op.type === "create" && createFn) {
            // Extract only fields needed for create (exclude id, user_id, timestamps)
            // Create a new object without the fields we want to exclude
            const createData = { ...op.data };
            delete (createData as Record<string, unknown>).id;
            delete (createData as Record<string, unknown>).user_id;
            delete (createData as Record<string, unknown>).created_at;
            delete (createData as Record<string, unknown>).updated_at;
            await createFn(createData as Omit<T, "id" | "user_id" | "created_at" | "updated_at">);
          } else if (op.type === "update" && updateFn) {
            await updateFn(op.id, op.data as Partial<T>);
          } else if (op.type === "delete" && deleteFn) {
            await deleteFn(op.id);
          }
        } catch (err) {
          logger.error(
            `Failed to process queue operation: ${op.type}`,
            CONTEXT,
            err instanceof Error ? err : new Error(String(err))
          );
          // Re-add to queue for retry
          queueRef.current.push(op);
        }
      }

      await saveQueue(queueRef.current);
    } finally {
      setIsSyncing(false);
    }
  }, [isOffline, createFn, updateFn, deleteFn, saveQueue]);

  /**
   * Sync data from cloud to local
   */
  const syncFromCloud = useCallback(async (): Promise<{ error: Error | null }> => {
    if (isOffline) {
      return { error: new Error("Cannot sync from cloud when offline") };
    }

    setIsSyncing(true);
    setError(null);

    try {
      const result = await fetchFn();

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      const cloudData = result.data || [];
      setData(cloudData);
      await saveToStorage(cloudData);
      setLastSyncAt(new Date().toISOString());

      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return { error };
    } finally {
      setIsSyncing(false);
    }
  }, [isOffline, fetchFn, saveToStorage]);

  /**
   * Sync data from local to cloud
   */
  const syncToCloud = useCallback(async (): Promise<{ error: Error | null }> => {
    if (isOffline) {
      return { error: new Error("Cannot sync to cloud when offline") };
    }

    if (!batchSaveFn) {
      return { error: new Error("batchSaveFn not provided") };
    }

    setIsSyncing(true);
    setError(null);

    try {
      const result = await batchSaveFn(data);

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      const syncedData = result.data || [];
      setData(syncedData);
      await saveToStorage(syncedData);
      setLastSyncAt(new Date().toISOString());

      // Process queue after successful sync
      await processQueue();

      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return { error };
    } finally {
      setIsSyncing(false);
    }
  }, [isOffline, data, batchSaveFn, saveToStorage, processQueue]);

  /**
   * Refresh data (load from storage, then sync from cloud if online)
   */
  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Load from local storage first (offline-first)
      const localData = await loadFromStorage();
      setData(localData);

      // Load queue
      const queue = await loadQueue();
      queueRef.current = queue;

      // Sync from cloud if online
      if (!isOffline) {
        await syncFromCloud();
        await processQueue();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logger.error("Failed to refresh", CONTEXT, error);
    } finally {
      setIsLoading(false);
    }
  }, [isOffline, loadFromStorage, loadQueue, syncFromCloud, processQueue]);

  /**
   * Add new item
   */
  const addItem = useCallback(
    async (
      item: Omit<T, "id" | "user_id" | "created_at" | "updated_at">
    ): Promise<{ error: Error | null }> => {
      if (!createFn) {
        return { error: new Error("createFn not provided") };
      }

      setError(null);

      // Generate temporary ID
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      // Create temporary item with all required fields
      // user_id will be added by the service when syncing
      // Using type assertion since we're creating a temporary item that will be replaced
      const newItem = {
        ...item,
        id: tempId,
        user_id: "", // Temporary, will be replaced by service
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as T;

      // Add to local state immediately (optimistic update)
      const updatedData = [newItem, ...data];
      setData(updatedData);
      await saveToStorage(updatedData);

      // Try to create in cloud if online
      if (!isOffline) {
        try {
          // createFn expects Omit<T, "id" | "user_id" | "created_at" | "updated_at">
          const result = await createFn(
            item as Omit<T, "id" | "user_id" | "created_at" | "updated_at">
          );

          if (result.error) {
            // Revert optimistic update
            setData(data);
            await saveToStorage(data);
            setError(result.error);
            return { error: result.error };
          }

          // Replace temp item with real item
          const realItem = result.data;
          if (realItem) {
            const finalData = updatedData.map((i) => (getId(i) === tempId ? realItem : i));
            setData(finalData);
            await saveToStorage(finalData);
          }

          return { error: null };
        } catch (err) {
          // Revert optimistic update
          setData(data);
          await saveToStorage(data);
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          return { error };
        }
      } else {
        // Add to queue for later sync
        queueRef.current.push({
          type: "create",
          data: newItem,
          id: tempId,
          timestamp: Date.now(),
        });
        await saveQueue(queueRef.current);
        return { error: null };
      }
    },
    [data, createFn, isOffline, getId, saveToStorage, saveQueue]
  );

  /**
   * Update existing item
   */
  const updateItem = useCallback(
    async (id: string, updates: Partial<T>): Promise<{ error: Error | null }> => {
      if (!updateFn) {
        return { error: new Error("updateFn not provided") };
      }

      setError(null);

      // Update local state immediately (optimistic update)
      const updatedData = data.map((item) =>
        getId(item) === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      ) as T[];
      setData(updatedData);
      await saveToStorage(updatedData);

      // Try to update in cloud if online
      if (!isOffline) {
        try {
          const result = await updateFn(id, updates);

          if (result.error) {
            // Revert optimistic update
            setData(data);
            await saveToStorage(data);
            setError(result.error);
            return { error: result.error };
          }

          // Update with server response
          const updatedItem = result.data;
          if (updatedItem) {
            const finalData = updatedData.map((i) => (getId(i) === id ? updatedItem : i));
            setData(finalData);
            await saveToStorage(finalData);
          }

          return { error: null };
        } catch (err) {
          // Revert optimistic update
          setData(data);
          await saveToStorage(data);
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          return { error };
        }
      } else {
        // Add to queue for later sync
        const item = data.find((i) => getId(i) === id);
        if (item) {
          queueRef.current.push({
            type: "update",
            data: { ...item, ...updates } as T,
            id,
            timestamp: Date.now(),
          });
          await saveQueue(queueRef.current);
        }
        return { error: null };
      }
    },
    [data, updateFn, isOffline, getId, saveToStorage, saveQueue]
  );

  /**
   * Delete item
   */
  const deleteItem = useCallback(
    async (id: string): Promise<{ error: Error | null }> => {
      if (!deleteFn) {
        return { error: new Error("deleteFn not provided") };
      }

      setError(null);

      // Remove from local state immediately (optimistic update)
      const itemToDelete = data.find((i) => getId(i) === id);
      const updatedData = data.filter((i) => getId(i) !== id);
      setData(updatedData);
      await saveToStorage(updatedData);

      // Try to delete in cloud if online
      if (!isOffline) {
        try {
          const result = await deleteFn(id);

          if (result.error) {
            // Revert optimistic update
            setData(data);
            await saveToStorage(data);
            setError(result.error);
            return { error: result.error };
          }

          return { error: null };
        } catch (err) {
          // Revert optimistic update
          setData(data);
          await saveToStorage(data);
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          return { error };
        }
      } else {
        // Add to queue for later sync
        if (itemToDelete) {
          queueRef.current.push({
            type: "delete",
            data: itemToDelete,
            id,
            timestamp: Date.now(),
          });
          await saveQueue(queueRef.current);
        }
        return { error: null };
      }
    },
    [data, deleteFn, isOffline, getId, saveToStorage, saveQueue]
  );

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize on mount
  useEffect(() => {
    refresh().catch((err) => {
      logger.error("Failed to initialize sync", CONTEXT, err as Error);
    });
  }, [refresh]);

  // Process queue when coming back online
  useEffect(() => {
    if (!isOffline && queueRef.current.length > 0) {
      processQueue().catch((err) => {
        logger.error("Failed to process queue", CONTEXT, err as Error);
      });
    }
  }, [isOffline, processQueue]);

  return {
    // State
    data,
    isLoading,
    isSyncing,
    lastSyncAt,
    error,

    // Methods
    syncToCloud,
    syncFromCloud,
    refresh,
    addItem,
    updateItem,
    deleteItem,
    clearError,
  };
}
