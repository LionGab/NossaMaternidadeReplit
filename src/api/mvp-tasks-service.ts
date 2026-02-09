/**
 * MVP Tasks Service - Cloud Sync
 *
 * Service para sincronização de tasks MVP com Supabase
 * Estratégia: Offline-first com merge inteligente
 *
 * @module api/mvp-tasks-service
 */

import { supabase } from "./supabase";
import { logger } from "@/utils/logger";

// ============================================
// Types
// ============================================

export interface MvpTask {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MvpTaskInsert {
  title: string;
  description?: string | null;
  completed?: boolean;
}

export interface MvpTaskUpdate {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

// ============================================
// API Functions
// ============================================

/**
 * Busca todas as tasks do usuário autenticado
 */
export async function fetchTasks(): Promise<{
  data: MvpTask[] | null;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    const { data, error } = await (supabase
      .from("mvp_tasks" as never)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }) as unknown as {
      data: MvpTask[] | null;
      error: { message: string; code?: string } | null;
    });

    if (error) {
      logger.error("Failed to fetch tasks", "mvp-tasks-service", new Error(error.message));
      return { data: null, error: new Error(error.message) };
    }

    logger.info("Tasks fetched successfully", "mvp-tasks-service", {
      count: data?.length || 0,
    });

    return {
      data: (data || []).map((task) => ({
        id: task.id,
        user_id: task.user_id,
        title: task.title,
        description: task.description,
        completed: task.completed ?? false,
        created_at: task.created_at,
        updated_at: task.updated_at,
      })),
      error: null,
    };
  } catch (error) {
    logger.error("Unexpected error fetching tasks", "mvp-tasks-service", error as Error);
    return { data: null, error: error as Error };
  }
}

/**
 * Busca uma task específica por ID
 */
export async function fetchTask(taskId: string): Promise<{
  data: MvpTask | null;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    const { data, error } = await (supabase
      .from("mvp_tasks" as never)
      .select("*")
      .eq("id", taskId)
      .eq("user_id", user.id)
      .single() as unknown as {
      data: MvpTask | null;
      error: { message: string; code?: string } | null;
    });

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return { data: null, error: null };
      }
      logger.error("Failed to fetch task", "mvp-tasks-service", new Error(error.message));
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: null };
    }

    return {
      data: {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        completed: data.completed ?? false,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      error: null,
    };
  } catch (error) {
    logger.error("Unexpected error fetching task", "mvp-tasks-service", error as Error);
    return { data: null, error: error as Error };
  }
}

/**
 * Cria uma nova task
 */
export async function createTask(task: MvpTaskInsert): Promise<{
  data: MvpTask | null;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    // Type assertion necessário pois mvp_tasks não está nos tipos gerados ainda
    // Após aplicar migration e regenerar tipos, isso pode ser removido
    const result = await (
      supabase as unknown as {
        from: (table: string) => {
          insert: (data: unknown) => {
            select: () => {
              single: () => Promise<{
                data: MvpTask | null;
                error: { message: string; code?: string } | null;
              }>;
            };
          };
        };
      }
    )
      .from("mvp_tasks")
      .insert({
        user_id: user.id,
        title: task.title.trim(),
        description: task.description?.trim() || null,
        completed: task.completed ?? false,
      })
      .select()
      .single();

    const { data, error } = result;

    if (error) {
      logger.error("Failed to create task", "mvp-tasks-service", new Error(error.message));
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error("Task not created") };
    }

    logger.info("Task created successfully", "mvp-tasks-service", {
      taskId: data.id,
    });

    return {
      data: {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        completed: data.completed ?? false,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      error: null,
    };
  } catch (error) {
    logger.error("Unexpected error creating task", "mvp-tasks-service", error as Error);
    return { data: null, error: error as Error };
  }
}

/**
 * Atualiza uma task existente
 */
export async function updateTask(
  taskId: string,
  updates: MvpTaskUpdate
): Promise<{
  data: MvpTask | null;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    // Build update object (only include defined fields)
    const updateData: Record<string, unknown> = {};
    if (updates.title !== undefined) {
      updateData.title = updates.title.trim();
    }
    if (updates.description !== undefined) {
      updateData.description = updates.description?.trim() || null;
    }
    if (updates.completed !== undefined) {
      updateData.completed = updates.completed;
    }

    // Type assertion necessário pois mvp_tasks não está nos tipos gerados ainda
    const result = await (
      supabase as unknown as {
        from: (table: string) => {
          update: (data: unknown) => {
            eq: (
              col: string,
              val: string
            ) => {
              eq: (
                col: string,
                val: string
              ) => {
                select: () => {
                  single: () => Promise<{
                    data: MvpTask | null;
                    error: { message: string; code?: string } | null;
                  }>;
                };
              };
            };
          };
        };
      }
    )
      .from("mvp_tasks")
      .update(updateData as Record<string, unknown>)
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select()
      .single();

    const { data, error } = result;

    if (error) {
      logger.error("Failed to update task", "mvp-tasks-service", new Error(error.message));
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error("Task not updated") };
    }

    logger.info("Task updated successfully", "mvp-tasks-service", {
      taskId: data.id,
    });

    return {
      data: {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        completed: data.completed ?? false,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      error: null,
    };
  } catch (error) {
    logger.error("Unexpected error updating task", "mvp-tasks-service", error as Error);
    return { data: null, error: error as Error };
  }
}

/**
 * Deleta uma task
 */
export async function deleteTask(taskId: string): Promise<{
  data: boolean;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: false, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: false, error: new Error("User not authenticated") };
    }

    const { error } = await (supabase
      .from("mvp_tasks" as never)
      .delete()
      .eq("id", taskId)
      .eq("user_id", user.id) as unknown as {
      error: { message: string; code?: string } | null;
    });

    if (error) {
      logger.error("Failed to delete task", "mvp-tasks-service", new Error(error.message));
      return { data: false, error: new Error(error.message) };
    }

    logger.info("Task deleted successfully", "mvp-tasks-service", {
      taskId,
    });

    return { data: true, error: null };
  } catch (error) {
    logger.error("Unexpected error deleting task", "mvp-tasks-service", error as Error);
    return { data: false, error: error as Error };
  }
}

/**
 * Batch save tasks (para sincronização offline)
 */
export async function batchSaveTasks(
  tasks: Array<Omit<MvpTask, "user_id" | "created_at" | "updated_at">>
): Promise<{
  data: MvpTask[] | null;
  error: Error | null;
}> {
  try {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not initialized") };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    if (tasks.length === 0) {
      return { data: [], error: null };
    }

    // Map tasks to insert format
    const tasksToInsert = tasks.map((task) => ({
      id: task.id,
      user_id: user.id,
      title: task.title.trim(),
      description: task.description?.trim() || null,
      completed: task.completed ?? false,
    }));

    // Use upsert to handle conflicts (based on id)
    // Type assertion necessário pois mvp_tasks não está nos tipos gerados ainda
    const result = await (
      supabase as unknown as {
        from: (table: string) => {
          upsert: (
            data: unknown[],
            options: { onConflict: string; ignoreDuplicates: boolean }
          ) => {
            select: () => Promise<{
              data: MvpTask[] | null;
              error: { message: string; code?: string } | null;
            }>;
          };
        };
      }
    )
      .from("mvp_tasks")
      .upsert(tasksToInsert, {
        onConflict: "id",
        ignoreDuplicates: false,
      })
      .select();

    const { data, error } = result;

    if (error) {
      logger.error("Failed to batch save tasks", "mvp-tasks-service", new Error(error.message));
      return { data: null, error: new Error(error.message) };
    }

    logger.info("Tasks batch saved successfully", "mvp-tasks-service", {
      count: data?.length || 0,
    });

    return {
      data:
        data?.map((task) => ({
          id: task.id,
          user_id: task.user_id,
          title: task.title,
          description: task.description,
          completed: task.completed ?? false,
          created_at: task.created_at,
          updated_at: task.updated_at,
        })) || null,
      error: null,
    };
  } catch (error) {
    logger.error("Unexpected error batch saving tasks", "mvp-tasks-service", error as Error);
    return { data: null, error: error as Error };
  }
}
