/**
 * TasksScreen - MVP CRUD Example
 *
 * Screen minimalista com CRUD completo para demonstração
 * - Lista de tasks do usuário
 * - Criar nova task (modal/form)
 * - Editar task existente
 * - Deletar task (com confirmação)
 * - Pull-to-refresh
 * - Indicador de sincronização
 * - Offline-first (funciona sem internet)
 *
 * @module screens/mvp/TasksScreen
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { useAuth } from "@/hooks/useAuth";
import { useSyncData } from "@/hooks/useSyncData";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertModal } from "@/components/ui/AlertModal";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  batchSaveTasks,
  type MvpTask,
  type MvpTaskInsert,
} from "@/api/mvp-tasks-service";
import { logger } from "@/utils/logger";
import { spacing, typography, radius, Tokens } from "@/theme/tokens";

const CONTEXT = "TasksScreen";

interface TaskFormData {
  title: string;
  description: string;
}

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();

  // Sync hook
  const {
    data: tasks,
    isLoading,
    isSyncing,
    lastSyncAt,
    error: syncError,
    refresh,
    addItem,
    updateItem,
    deleteItem,
    syncToCloud,
    syncFromCloud,
  } = useSyncData<MvpTask>({
    tableName: "mvp_tasks",
    fetchFn: fetchTasks,
    createFn: createTask,
    updateFn: updateTask,
    deleteFn: deleteTask,
    batchSaveFn: batchSaveTasks,
    getId: (task) => task.id,
    storageKey: "mvp_tasks_cache",
  });

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<MvpTask | null>(null);
  const [deletingTask, setDeletingTask] = useState<MvpTask | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({ title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
      await syncFromCloud();
    } catch (err) {
      logger.error("Failed to refresh", CONTEXT, err as Error);
    } finally {
      setRefreshing(false);
    }
  }, [refresh, syncFromCloud]);

  /**
   * Open create modal
   */
  const handleOpenCreate = useCallback(() => {
    setFormData({ title: "", description: "" });
    setShowCreateModal(true);
  }, []);

  /**
   * Close create modal
   */
  const handleCloseCreate = useCallback(() => {
    setShowCreateModal(false);
    setFormData({ title: "", description: "" });
  }, []);

  /**
   * Submit create/edit form
   */
  const handleSubmit = useCallback(async () => {
    if (!formData.title.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingTask) {
        // Update existing task
        const result = await updateItem(editingTask.id, {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
        });

        if (result.error) {
          logger.error("Failed to update task", CONTEXT, result.error);
        } else {
          setEditingTask(null);
          setFormData({ title: "", description: "" });
          // Try to sync if online
          await syncToCloud();
        }
      } else {
        // Create new task
        // Note: user_id will be added by the service
        const taskInsert: MvpTaskInsert = {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          completed: false,
        };
        const result = await addItem(
          taskInsert as Omit<MvpTask, "id" | "user_id" | "created_at" | "updated_at">
        );

        if (result.error) {
          logger.error("Failed to create task", CONTEXT, result.error);
        } else {
          setShowCreateModal(false);
          setFormData({ title: "", description: "" });
          // Try to sync if online
          await syncToCloud();
        }
      }
    } catch (err) {
      logger.error("Unexpected error submitting form", CONTEXT, err as Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingTask, addItem, updateItem, syncToCloud]);

  /**
   * Open edit modal
   */
  const handleEdit = useCallback((task: MvpTask) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
    });
    setShowCreateModal(true);
  }, []);

  /**
   * Close edit modal
   */
  const handleCloseEdit = useCallback(() => {
    setEditingTask(null);
    setShowCreateModal(false);
    setFormData({ title: "", description: "" });
  }, []);

  /**
   * Toggle task completion
   */
  const handleToggleComplete = useCallback(
    async (task: MvpTask) => {
      const result = await updateItem(task.id, {
        completed: !task.completed,
      });

      if (result.error) {
        logger.error("Failed to toggle task", CONTEXT, result.error);
      } else {
        await syncToCloud();
      }
    },
    [updateItem, syncToCloud]
  );

  /**
   * Confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!deletingTask) return;

    const result = await deleteItem(deletingTask.id);

    if (result.error) {
      logger.error("Failed to delete task", CONTEXT, result.error);
    } else {
      setDeletingTask(null);
      await syncToCloud();
    }
  }, [deletingTask, deleteItem, syncToCloud]);

  /**
   * Render task item
   */
  const renderTaskItem = useCallback(
    ({ item }: { item: MvpTask }) => {
      return (
        <Pressable
          onPress={() => handleToggleComplete(item)}
          style={{
            backgroundColor: colors.background.card,
            borderRadius: radius.md,
            padding: spacing.md,
            marginBottom: spacing.sm,
            borderWidth: 1,
            borderColor: item.completed ? colors.semantic.success : colors.border.default,
            minHeight: 44, // WCAG AAA
          }}
          accessibilityRole="button"
          accessibilityLabel={
            item.completed ? `Task concluída: ${item.title}` : `Task: ${item.title}`
          }
          accessibilityHint={
            item.completed
              ? "Toque para marcar como não concluída"
              : "Toque para marcar como concluída"
          }
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            {/* Checkbox */}
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: item.completed ? colors.semantic.success : colors.neutral[300],
                backgroundColor: item.completed ? colors.semantic.success : "transparent",
                marginRight: spacing.sm,
                marginTop: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.completed && (
                <Ionicons name="checkmark" size={16} color={colors.text.inverse} />
              )}
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.bodyLarge.fontSize,
                  fontWeight: item.completed ? "400" : "600",
                  color: item.completed ? colors.text.secondary : colors.text.primary,
                  textDecorationLine: item.completed ? "line-through" : "none",
                  marginBottom: spacing.xs,
                }}
              >
                {item.title}
              </Text>

              {item.description && (
                <Text
                  style={{
                    fontSize: typography.bodyMedium.fontSize,
                    color: colors.text.secondary,
                    marginBottom: spacing.sm,
                  }}
                >
                  {item.description}
                </Text>
              )}

              {/* Actions */}
              <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs }}>
                <Pressable
                  onPress={() => handleEdit(item)}
                  style={{
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: radius.sm,
                    backgroundColor: colors.primary[50],
                    minHeight: 44,
                    justifyContent: "center",
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Editar task: ${item.title}`}
                >
                  <Text
                    style={{
                      fontSize: typography.bodySmall.fontSize,
                      color: colors.primary[600],
                      fontWeight: "500",
                    }}
                  >
                    Editar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setDeletingTask(item)}
                  style={{
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                    borderRadius: radius.sm,
                    backgroundColor: colors.semantic.errorLight,
                    minHeight: 44,
                    justifyContent: "center",
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Deletar task: ${item.title}`}
                >
                  <Text
                    style={{
                      fontSize: typography.bodySmall.fontSize,
                      color: colors.semantic.error,
                      fontWeight: "500",
                    }}
                  >
                    Deletar
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Pressable>
      );
    },
    [colors, handleToggleComplete, handleEdit]
  );

  // Guard: Require authentication
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.xl,
          }}
        >
          <Text
            style={{
              fontSize: typography.titleLarge.fontSize,
              color: colors.text.primary,
              textAlign: "center",
              marginBottom: spacing.md,
            }}
          >
            Você precisa estar logado
          </Text>
          <Text
            style={{
              fontSize: typography.bodyMedium.fontSize,
              color: colors.text.secondary,
              textAlign: "center",
            }}
          >
            Faça login para acessar suas tasks
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.default,
        }}
      >
        <View
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: typography.headlineSmall.fontSize,
              fontWeight: "700",
              color: colors.text.primary,
            }}
          >
            Minhas Tasks
          </Text>

          {/* Sync indicator */}
          {isSyncing && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
              <ActivityIndicator size="small" color={colors.primary[500]} />
              <Text
                style={{
                  fontSize: typography.bodySmall.fontSize,
                  color: colors.text.secondary,
                }}
              >
                Sincronizando...
              </Text>
            </View>
          )}
        </View>

        {/* Last sync time */}
        {lastSyncAt && !isSyncing && (
          <Text
            style={{
              fontSize: typography.bodySmall.fontSize,
              color: colors.text.tertiary,
              marginTop: spacing.xs,
            }}
          >
            Última sincronização: {new Date(lastSyncAt).toLocaleTimeString()}
          </Text>
        )}

        {/* Error message */}
        {syncError && (
          <View
            style={{
              marginTop: spacing.sm,
              padding: spacing.sm,
              backgroundColor: colors.semantic.errorLight,
              borderRadius: radius.sm,
            }}
          >
            <Text
              style={{
                fontSize: typography.bodySmall.fontSize,
                color: colors.semantic.error,
              }}
            >
              Erro de sincronização: {syncError.message}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text
            style={{
              fontSize: typography.bodyMedium.fontSize,
              color: colors.text.secondary,
              marginTop: spacing.md,
            }}
          >
            Carregando tasks...
          </Text>
        </View>
      ) : tasks.length === 0 ? (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.xl,
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <Ionicons name="checkmark-circle-outline" size={64} color={colors.text.tertiary} />
          <Text
            style={{
              fontSize: typography.titleMedium.fontSize,
              color: colors.text.primary,
              marginTop: spacing.md,
              textAlign: "center",
            }}
          >
            Nenhuma task ainda
          </Text>
          <Text
            style={{
              fontSize: typography.bodyMedium.fontSize,
              color: colors.text.secondary,
              marginTop: spacing.sm,
              textAlign: "center",
            }}
          >
            Crie sua primeira task para começar
          </Text>
        </ScrollView>
      ) : (
        <FlashList
          data={tasks}
          renderItem={renderTaskItem}
          contentContainerStyle={{
            padding: spacing.lg,
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* FAB - Create Button */}
      <Pressable
        onPress={handleOpenCreate}
        style={{
          position: "absolute",
          bottom: insets.bottom + spacing.lg,
          right: spacing.lg,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary[500],
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.neutral[900],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
        accessibilityRole="button"
        accessibilityLabel="Criar nova task"
        accessibilityHint="Abre o formulário para criar uma nova task"
      >
        <Ionicons name="add" size={28} color={colors.text.inverse} />
      </Pressable>

      {/* Create/Edit Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
        onRequestClose={editingTask ? handleCloseEdit : handleCloseCreate}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: Tokens.overlay.dark,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.background.card,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              padding: spacing.lg,
              paddingBottom: insets.bottom + spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: typography.titleLarge.fontSize,
                fontWeight: "700",
                color: colors.text.primary,
                marginBottom: spacing.lg,
              }}
            >
              {editingTask ? "Editar Task" : "Nova Task"}
            </Text>

            <View style={{ marginBottom: spacing.md }}>
              <Input
                label="Título"
                placeholder="Digite o título da task"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                autoFocus
              />
            </View>

            <View style={{ marginBottom: spacing.lg }}>
              <Input
                label="Descrição (opcional)"
                placeholder="Digite uma descrição"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Button
                  variant="outline"
                  onPress={editingTask ? handleCloseEdit : handleCloseCreate}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </View>

              <View style={{ flex: 1 }}>
                <Button
                  variant="primary"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={!formData.title.trim() || isSubmitting}
                >
                  {editingTask ? "Salvar" : "Criar"}
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <AlertModal
        visible={deletingTask !== null}
        title="Deletar Task"
        message={`Tem certeza que deseja deletar "${deletingTask?.title}"? Esta ação não pode ser desfeita.`}
        icon="trash-outline"
        iconColor={colors.semantic.error}
        buttons={[
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => setDeletingTask(null),
          },
          {
            text: "Deletar",
            style: "destructive",
            onPress: handleConfirmDelete,
          },
        ]}
        onDismiss={() => setDeletingTask(null)}
      />
    </SafeAreaView>
  );
}
