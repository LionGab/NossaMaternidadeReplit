/**
 * AdminPostsListScreen - Lista completa de posts do Mundo da Nath (Admin)
 *
 * Fase 1 (P0): tela mínima para navegação a partir do dashboard.
 * - Acesso restrito via useAdmin()
 * - Lista posts (published vs draft) usando mundoNathAdminService via hook useAdminPosts
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdminPostCard } from "../../components/admin/AdminPostCard";
import { Card } from "../../components/ui/Card";
import { useAdmin } from "../../hooks/useAdmin";
import { useAdminPosts } from "../../hooks/useAdminPosts";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { MundoNathPostStatus } from "../../types/community";
import { RootStackScreenProps } from "../../types/navigation";
import { logger } from "../../utils/logger";

const CONTEXT = "AdminPostsListScreen";

type Filter = MundoNathPostStatus | "all";

function normalizeFilter(value: unknown): Filter {
  if (
    value === "published" ||
    value === "draft" ||
    value === "scheduled" ||
    value === "archived" ||
    value === "all"
  ) {
    return value;
  }
  return "all";
}

export default function AdminPostsListScreen({
  navigation,
  route,
}: RootStackScreenProps<"AdminPostsList">) {
  const insets = useSafeAreaInsets();
  const { text: textColors } = useTheme();
  const { isAdmin, isLoading: isLoadingAdmin } = useAdmin();

  const filter = useMemo<Filter>(
    () => normalizeFilter(route.params?.filter),
    [route.params?.filter]
  );
  const { posts, isLoading, error, refresh } = useAdminPosts({
    limit: 50,
    status: filter,
  });

  useEffect(() => {
    if (!isLoadingAdmin && !isAdmin) {
      logger.warn("Tentativa de acesso não autorizado ao admin posts list", CONTEXT);
      navigation.goBack();
    }
  }, [isAdmin, isLoadingAdmin, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const title = useMemo(() => {
    switch (filter) {
      case "published":
        return "Posts publicados";
      case "draft":
        return "Rascunhos";
      case "scheduled":
        return "Agendados";
      case "archived":
        return "Arquivados";
      case "all":
      default:
        return "Todos os posts";
    }
  }, [filter]);

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
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            className="p-2 -ml-2 mr-2 active:opacity-70"
          >
            <Ionicons name="chevron-back" size={22} color={textColors.secondary} />
          </Pressable>

          <View className="flex-1">
            <Text style={{ color: textColors.primary }} className="text-base font-bold">
              {title}
            </Text>
            <Text style={{ color: textColors.secondary }} className="text-xs">
              Admin — Mundo da Nath
            </Text>
          </View>

          <Pressable
            onPress={refresh}
            accessibilityRole="button"
            accessibilityLabel="Recarregar posts"
            className="p-2 -mr-2 active:opacity-70"
          >
            <Ionicons name="refresh" size={20} color={Tokens.brand.accent[500]} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
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

        {isLoading && posts.length === 0 && (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
            <Text style={{ color: textColors.secondary }} className="mt-3 text-sm">
              Carregando posts...
            </Text>
          </View>
        )}

        {!isLoading && posts.length === 0 && !error && (
          <Card variant="soft" padding="lg">
            <View className="items-center">
              <Ionicons name="document-outline" size={48} color={textColors.secondary} />
              <Text style={{ color: textColors.primary }} className="mt-3 text-base font-medium">
                Nenhum post encontrado
              </Text>
              <Text style={{ color: textColors.secondary }} className="mt-1 text-sm text-center">
                Esse filtro não retornou resultados.
              </Text>
            </View>
          </Card>
        )}

        {posts.length > 0 && (
          <View className="gap-3">
            {posts.map((post) => (
              <AdminPostCard
                key={post.id}
                post={post}
                onEdit={() => {
                  // Fase 2
                  logger.info("Editar post (stub)", CONTEXT, { postId: post.id });
                }}
                onView={() => {
                  logger.info("Ver post (stub)", CONTEXT, { postId: post.id });
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
