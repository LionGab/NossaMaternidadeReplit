/**
 * AdminPostCard - Card de post para área admin do Mundo da Nath
 *
 * Exibe informações do post com badge de status e ações.
 * Design System 2025 - Calm FemTech
 */

import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { MundoNathPostAdmin, MundoNathPostStatus } from "../../types/community";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { Card } from "../ui/Card";

interface AdminPostCardProps {
  /** Post data */
  post: MundoNathPostAdmin;
  /** Edit action handler (stub for Phase 2) */
  onEdit?: (postId: string) => void;
  /** View action handler */
  onView?: (postId: string) => void;
}

/**
 * Status badge colors and labels
 */
const STATUS_CONFIG: Record<
  MundoNathPostStatus,
  { label: string; bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  published: {
    label: "Publicado",
    bg: Tokens.semantic.light.success,
    text: Tokens.neutral[0],
    icon: "checkmark-circle",
  },
  draft: {
    label: "Rascunho",
    bg: Tokens.semantic.light.warning,
    text: Tokens.neutral[900],
    icon: "document-text",
  },
  scheduled: {
    label: "Agendado",
    bg: Tokens.semantic.light.info,
    text: Tokens.neutral[0],
    icon: "time",
  },
  archived: {
    label: "Arquivado",
    bg: Tokens.neutral[400],
    text: Tokens.neutral[0],
    icon: "archive",
  },
};

/**
 * Format date to Brazilian format
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * AdminPostCard Component
 *
 * @example
 * ```tsx
 * <AdminPostCard
 *   post={post}
 *   onEdit={(id) => navigation.navigate('AdminPostEditor', { postId: id })}
 *   onView={(id) => handleViewPost(id)}
 * />
 * ```
 */
function AdminPostCardComponent({ post, onEdit, onView }: AdminPostCardProps) {
  const { text: textColors } = useTheme();
  const status = post.status || "draft";
  const statusConfig = STATUS_CONFIG[status];

  const handleEdit = useCallback(() => {
    onEdit?.(post.id);
  }, [onEdit, post.id]);

  const handleView = useCallback(() => {
    onView?.(post.id);
  }, [onView, post.id]);

  return (
    <Card
      variant="elevated"
      padding="md"
      radius="lg"
      accessibilityLabel={`Post: ${truncateText(post.text, 50)}. Status: ${statusConfig.label}`}
    >
      {/* Header: Status Badge + Date */}
      <View className="flex-row items-center justify-between mb-3">
        {/* Status Badge */}
        <View
          style={{ backgroundColor: statusConfig.bg }}
          className="flex-row items-center px-3 py-1.5 rounded-full"
        >
          <Ionicons name={statusConfig.icon} size={14} color={statusConfig.text} />
          <Text style={{ color: statusConfig.text }} className="ml-1.5 text-xs font-semibold">
            {statusConfig.label}
          </Text>
        </View>

        {/* Date */}
        <Text style={{ color: textColors.secondary }} className="text-xs">
          {formatDate(post.published_at || post.created_at)}
        </Text>
      </View>

      {/* Content Preview */}
      <Text
        style={{ color: textColors.primary }}
        className="text-base leading-6 mb-4"
        numberOfLines={3}
      >
        {truncateText(post.text, 150) || "Sem conteúdo de texto"}
      </Text>

      {/* Media Type Indicator */}
      {post.type && post.type !== "text" && (
        <View className="flex-row items-center mb-4">
          <View
            style={{ backgroundColor: Tokens.surface.light.tertiary }}
            className="flex-row items-center px-2.5 py-1 rounded-lg"
          >
            <Ionicons
              name={
                post.type === "image" ? "image" : post.type === "video" ? "videocam" : "document"
              }
              size={14}
              color={textColors.secondary}
            />
            <Text style={{ color: textColors.secondary }} className="ml-1.5 text-xs">
              {post.type === "image" ? "Imagem" : post.type === "video" ? "Vídeo" : "Mídia"}
            </Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-end gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
        {/* View Button */}
        <Pressable
          onPress={handleView}
          accessibilityRole="button"
          accessibilityLabel="Ver post"
          className="flex-row items-center px-3 py-2 rounded-lg active:opacity-70"
          style={{ backgroundColor: Tokens.surface.light.soft }}
        >
          <Ionicons name="eye-outline" size={16} color={textColors.secondary} />
          <Text style={{ color: textColors.secondary }} className="ml-1.5 text-sm font-medium">
            Ver
          </Text>
        </Pressable>

        {/* Edit Button (Stub - Phase 2) */}
        <Pressable
          onPress={handleEdit}
          accessibilityRole="button"
          accessibilityLabel="Editar post"
          className="flex-row items-center px-3 py-2 rounded-lg active:opacity-70"
          style={{ backgroundColor: Tokens.brand.accent[100] }}
        >
          <Ionicons name="create-outline" size={16} color={Tokens.brand.accent[600]} />
          <Text style={{ color: Tokens.brand.accent[600] }} className="ml-1.5 text-sm font-medium">
            Editar
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

export const AdminPostCard = memo(AdminPostCardComponent);
export default AdminPostCard;
