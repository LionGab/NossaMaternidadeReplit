/**
 * AdminDashboardScreen - Dashboard admin para Mundo da Nath
 *
 * Tela principal da área admin onde Nathália pode:
 * - Ver estatísticas de posts (publicados, rascunhos, agendados)
 * - Ver lista de posts recentes
 * - Criar novo post
 *
 * Design System 2025 - Calm FemTech
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdminPostCard } from "../../components/admin/AdminPostCard";
import { Card } from "../../components/ui/Card";
import { useAdmin } from "../../hooks/useAdmin";
import { useAdminPosts } from "../../hooks/useAdminPosts";
import { useTheme } from "../../hooks/useTheme";
import { useToast } from "../../context/ToastContext";
import { RootStackScreenProps } from "../../types/navigation";
import { Tokens } from "../../theme/tokens";
import { logger } from "../../utils/logger";

const CONTEXT = "AdminDashboardScreen";

/**
 * AdminDashboardScreen
 *
 * Área administrativa para gestão de conteúdos do Mundo da Nath.
 * Acesso restrito apenas para usuários admin.
 */
export default function AdminDashboardScreen({
  navigation,
}: RootStackScreenProps<"AdminDashboard">) {
  const insets = useSafeAreaInsets();
  const { text: textColors } = useTheme();
  const { isAdmin, isLoading: isLoadingAdmin } = useAdmin();
  const { showError } = useToast();
  const { posts, stats, isLoading, error, refresh } = useAdminPosts({ limit: 5 });

  // Guard: Redirect non-admin users
  useEffect(() => {
    if (!isLoadingAdmin && !isAdmin) {
      logger.warn("Tentativa de acesso não autorizado ao admin", CONTEXT);
      showError("Acesso restrito a administradores");
      navigation.goBack();
    }
  }, [isAdmin, isLoadingAdmin, navigation, showError]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // Handle new post - Navigate to NewPost screen
  const handleNewPost = useCallback(() => {
    logger.info("Admin criando novo post", CONTEXT);
    navigation.navigate("NewPost");
  }, [navigation]);

  // Handle edit post - Navigate to post detail
  const handleEditPost = useCallback(
    (postId: string) => {
      logger.info("Editando post", CONTEXT, { postId });
      navigation.navigate("PostDetail", { postId });
    },
    [navigation]
  );

  // Handle view post - Navigate to post detail
  const handleViewPost = useCallback(
    (postId: string) => {
      logger.info("Ver post", CONTEXT, { postId });
      navigation.navigate("PostDetail", { postId });
    },
    [navigation]
  );

  // Handle close
  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Loading state
  if (isLoadingAdmin) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
        <Text style={{ color: textColors.secondary }} className="mt-4 text-base">
          Verificando permissões...
        </Text>
      </View>
    );
  }

  // Not admin (will redirect via useEffect)
  if (!isAdmin) {
    return null;
  }

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <View
        className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark" size={24} color={Tokens.brand.accent[500]} />
            <Text style={{ color: textColors.primary }} className="ml-2 text-lg font-bold">
              Admin — Mundo da Nath
            </Text>
          </View>
          <Pressable
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar painel admin"
            className="p-2 -mr-2 active:opacity-70"
          >
            <Ionicons name="close" size={24} color={textColors.secondary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={Tokens.brand.accent[500]}
          />
        }
      >
        {/* Stats Cards */}
        <View className="flex-row gap-3 mb-6">
          <StatCard
            icon="checkmark-circle"
            label="Publicados"
            value={stats.published}
            color={Tokens.semantic.light.success}
          />
          <StatCard
            icon="document-text"
            label="Rascunhos"
            value={stats.draft}
            color={Tokens.semantic.light.warning}
          />
          <StatCard
            icon="time"
            label="Agendados"
            value={stats.scheduled}
            color={Tokens.semantic.light.info}
          />
        </View>

        {/* New Post Button */}
        <Pressable
          onPress={handleNewPost}
          accessibilityRole="button"
          accessibilityLabel="Criar novo post"
          className="mb-3 active:opacity-90"
        >
          <Card variant="accent" padding="md">
            <View className="flex-row items-center justify-center">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: Tokens.brand.accent[500] }}
              >
                <Ionicons name="add" size={24} color={Tokens.neutral[0]} />
              </View>
              <View className="flex-1">
                <Text style={{ color: textColors.primary }} className="text-base font-semibold">
                  Criar Novo Post
                </Text>
                <Text style={{ color: textColors.secondary }} className="text-sm">
                  Foto, vídeo ou texto para o Mundo da Nath
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={textColors.secondary} />
            </View>
          </Card>
        </Pressable>

        {/* Moderation Button */}
        <Pressable
          onPress={() => navigation.navigate("Moderation")}
          accessibilityRole="button"
          accessibilityLabel="Abrir moderação de conteúdo"
          className="mb-6 active:opacity-90"
        >
          <Card variant="elevated" padding="md">
            <View className="flex-row items-center justify-center">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: Tokens.brand.teal[100] }}
              >
                <Ionicons name="shield-checkmark" size={22} color={Tokens.brand.teal[500]} />
              </View>
              <View className="flex-1">
                <Text style={{ color: textColors.primary }} className="text-base font-semibold">
                  Moderação de Conteúdo
                </Text>
                <Text style={{ color: textColors.secondary }} className="text-sm">
                  Revisar e aprovar posts da comunidade
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={textColors.secondary} />
            </View>
          </Card>
        </Pressable>

        {/* Recent Posts Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text style={{ color: textColors.primary }} className="text-base font-semibold">
              Posts Recentes
            </Text>
            <Pressable
              onPress={() => navigation.navigate("AdminPostsList", { filter: "all" })}
              accessibilityRole="button"
              accessibilityLabel="Ver todos os posts"
              className="flex-row items-center active:opacity-70"
            >
              <Text style={{ color: Tokens.brand.accent[500] }} className="text-sm font-medium">
                Ver todos
              </Text>
              <Ionicons name="chevron-forward" size={16} color={Tokens.brand.accent[500]} />
            </Pressable>
          </View>

          {/* Error State */}
          {error && (
            <Card variant="outlined" padding="md" className="mb-4">
              <View className="flex-row items-center">
                <Ionicons name="warning" size={20} color={Tokens.semantic.light.error} />
                <Text style={{ color: Tokens.semantic.light.error }} className="ml-2 flex-1">
                  {error}
                </Text>
              </View>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && posts.length === 0 && (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
              <Text style={{ color: textColors.secondary }} className="mt-3 text-sm">
                Carregando posts...
              </Text>
            </View>
          )}

          {/* Empty State */}
          {!isLoading && posts.length === 0 && !error && (
            <Card variant="soft" padding="lg">
              <View className="items-center">
                <Ionicons name="document-outline" size={48} color={textColors.secondary} />
                <Text style={{ color: textColors.primary }} className="mt-3 text-base font-medium">
                  Nenhum post ainda
                </Text>
                <Text style={{ color: textColors.secondary }} className="mt-1 text-sm text-center">
                  Crie seu primeiro conteúdo exclusivo para as mamães!
                </Text>
              </View>
            </Card>
          )}

          {/* Posts List */}
          {posts.length > 0 && (
            <View className="gap-3">
              {posts.map((post) => (
                <AdminPostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEditPost}
                  onView={handleViewPost}
                />
              ))}
            </View>
          )}
        </View>

        {/* Total Stats Footer */}
        <View className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Text style={{ color: textColors.secondary }} className="text-center text-sm">
            Total: {stats.total} post{stats.total !== 1 ? "s" : ""}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const { text: statTextColors } = useTheme();

  return (
    <View className="flex-1">
      <Card variant="elevated" padding="md">
        <View className="items-center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mb-2"
            style={{ backgroundColor: `${color}20` }}
          >
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <Text style={{ color: statTextColors.primary }} className="text-xl font-bold">
            {value}
          </Text>
          <Text style={{ color: statTextColors.secondary }} className="text-xs">
            {label}
          </Text>
        </View>
      </Card>
    </View>
  );
}
