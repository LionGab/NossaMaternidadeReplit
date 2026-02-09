/**
 * ModerationScreen - Tela de Moderação de Conteúdo
 * 
 * Permite ao time revisar posts pendentes:
 * - Lista os melhores posts para aprovação (ranqueados por qualidade)
 * - Mostra score de qualidade e flags de moderação
 * - Aprovar/Rejeitar com um toque
 * - Estatísticas em tempo real
 * 
 * Design Premium 2025
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { AlertTriangle, Check, Clock, Filter, Shield, X } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Body, Caption, NathBadge, NathCard, Subtitle, Title } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { brand, mockupColors, nathAccent, radius, shadows, spacing, Tokens } from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";

import {
  approvePost,
  fetchModerationQueue,
  fetchModerationStats,
  fetchTopPostsForReview,
  rejectPost,
  type ModerationQueueItem,
  type ModerationStats,
} from "@/api/moderation";

type Props = RootStackScreenProps<"Moderation">;

const REJECTION_REASONS = [
  "Conteúdo ofensivo",
  "Spam ou propaganda",
  "Informação incorreta",
  "Fora do tema da comunidade",
  "Outro motivo",
];

export default function ModerationScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  const [items, setItems] = useState<ModerationQueueItem[]>([]);
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "best">("best");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const bgPrimary = isDark ? Tokens.neutral[900] : Tokens.neutral[50];
  const bgCard = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
  const textPrimary = isDark ? Tokens.neutral[100] : Tokens.neutral[900];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[600];

  const loadData = useCallback(async () => {
    const [queueResult, statsResult] = await Promise.all([
      filter === "best" 
        ? fetchTopPostsForReview(200) 
        : fetchModerationQueue(100, "pending"),
      fetchModerationStats(),
    ]);

    setItems(queueResult.data);
    setStats(statsResult.data);
  }, [filter]);

  useEffect(() => {
    setIsLoading(true);
    loadData().finally(() => setIsLoading(false));
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleApprove = async (item: ModerationQueueItem) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const { success, error } = await approvePost(item.id, user?.id || "");
    
    if (success) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      if (stats) {
        setStats({
          ...stats,
          pending: stats.pending - 1,
          approved: stats.approved + 1,
        });
      }
    } else {
      Alert.alert("Erro", error?.message || "Não foi possível aprovar o post.");
    }
  };

  const handleReject = (item: ModerationQueueItem) => {
    setRejectingId(item.id);
    setRejectReason("");
  };

  const confirmReject = async () => {
    if (!rejectingId) return;
    
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    const { success, error } = await rejectPost(
      rejectingId,
      user?.id || "",
      rejectReason || "Conteúdo não aprovado"
    );
    
    if (success) {
      setItems(prev => prev.filter(i => i.id !== rejectingId));
      if (stats) {
        setStats({
          ...stats,
          pending: stats.pending - 1,
          rejected: stats.rejected + 1,
        });
      }
    } else {
      Alert.alert("Erro", error?.message || "Não foi possível rejeitar o post.");
    }
    
    setRejectingId(null);
    setRejectReason("");
  };

  const renderItem = ({ item, index }: { item: ModerationQueueItem; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <NathCard variant="elevated" style={[styles.itemCard, { backgroundColor: bgCard }]} padding="lg">
        {/* Header */}
        <View style={styles.itemHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: brand.primary[100] }]}>
              <Text style={{ color: brand.primary[600], fontWeight: "600" }}>
                {item.userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Body weight="bold" style={{ color: textPrimary }}>
                {item.userName}
              </Body>
              <Caption style={{ color: textSecondary }}>
                {new Date(item.createdAt).toLocaleDateString("pt-BR")}
              </Caption>
            </View>
          </View>
          
          {/* Quality Score */}
          <View style={styles.scoreContainer}>
            <LinearGradient
              colors={
                item.qualityScore >= 70
                  ? [brand.teal[400], brand.teal[500]]
                  : item.qualityScore >= 40
                    ? [brand.accent[400], brand.accent[500]]
                    : [Tokens.neutral[400], Tokens.neutral[500]]
              }
              style={styles.scoreBadge}
            >
              <Text style={styles.scoreText}>{item.qualityScore}</Text>
            </LinearGradient>
            <Caption style={{ color: textSecondary, fontSize: 10 }}>Qualidade</Caption>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Body style={{ color: textPrimary }} numberOfLines={4}>
            {item.content}
          </Body>
        </View>

        {/* Flags */}
        {item.flaggedTerms.length > 0 && (
          <View style={styles.flagsContainer}>
            <AlertTriangle size={14} color={nathAccent.coral} />
            <Caption style={{ color: nathAccent.coral, marginLeft: 4 }}>
              Termos detectados: {item.flaggedTerms.join(", ")}
            </Caption>
          </View>
        )}

        {/* Categories */}
        {item.categories.length > 0 && (
          <View style={styles.categoriesRow}>
            {item.categories.map((cat, idx) => (
              <NathBadge key={idx} variant="warning" size="sm" style={{ marginRight: 4 }}>
                {cat}
              </NathBadge>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => handleApprove(item)}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.approveBtn,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Aprovar post"
          >
            <Check size={18} color={Tokens.neutral[0]} />
            <Text style={styles.actionBtnText}>Aprovar</Text>
          </Pressable>

          <Pressable
            onPress={() => handleReject(item)}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.rejectBtn,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Rejeitar post"
          >
            <X size={18} color={nathAccent.coral} />
            <Text style={[styles.actionBtnText, { color: nathAccent.coral }]}>Rejeitar</Text>
          </Pressable>
        </View>
      </NathCard>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgPrimary, paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient
        colors={[mockupColors.rosa.blush, mockupColors.azul.sereno + "30"]}
        style={styles.header}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={textPrimary} />
        </Pressable>
        <Title style={{ color: textPrimary }}>Moderação</Title>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Stats */}
      {stats && (
        <Animated.View entering={FadeInRight.duration(300)} style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: bgCard }]}>
            <Clock size={16} color={brand.accent[500]} />
            <Caption weight="bold" style={{ color: brand.accent[500] }}>
              {stats.pending}
            </Caption>
            <Caption style={{ color: textSecondary, fontSize: 10 }}>Pendentes</Caption>
          </View>
          <View style={[styles.statCard, { backgroundColor: bgCard }]}>
            <Check size={16} color={brand.teal[500]} />
            <Caption weight="bold" style={{ color: brand.teal[500] }}>
              {stats.approved}
            </Caption>
            <Caption style={{ color: textSecondary, fontSize: 10 }}>Aprovados</Caption>
          </View>
          <View style={[styles.statCard, { backgroundColor: bgCard }]}>
            <X size={16} color={nathAccent.coral} />
            <Caption weight="bold" style={{ color: nathAccent.coral }}>
              {stats.rejected}
            </Caption>
            <Caption style={{ color: textSecondary, fontSize: 10 }}>Rejeitados</Caption>
          </View>
          <View style={[styles.statCard, { backgroundColor: bgCard }]}>
            <Shield size={16} color={Tokens.neutral[500]} />
            <Caption weight="bold" style={{ color: Tokens.neutral[500] }}>
              {stats.autoBlocked}
            </Caption>
            <Caption style={{ color: textSecondary, fontSize: 10 }}>Bloqueados</Caption>
          </View>
        </Animated.View>
      )}

      {/* Filter */}
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setFilter("best")}
          style={[
            styles.filterBtn,
            filter === "best" && styles.filterBtnActive,
          ]}
        >
          <Filter size={14} color={filter === "best" ? brand.accent[600] : textSecondary} />
          <Caption style={{ color: filter === "best" ? brand.accent[600] : textSecondary }}>
            Top 200 Melhores
          </Caption>
        </Pressable>
        <Pressable
          onPress={() => setFilter("all")}
          style={[
            styles.filterBtn,
            filter === "all" && styles.filterBtnActive,
          ]}
        >
          <Caption style={{ color: filter === "all" ? brand.accent[600] : textSecondary }}>
            Todos Pendentes
          </Caption>
        </Pressable>
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={brand.accent[500]} />
          <Caption style={{ color: textSecondary, marginTop: 12 }}>
            Carregando posts para moderação...
          </Caption>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Shield size={48} color={brand.teal[400]} />
          <Subtitle style={{ color: textPrimary, marginTop: 16 }}>
            Nenhum post pendente!
          </Subtitle>
          <Caption style={{ color: textSecondary, textAlign: "center", marginTop: 8 }}>
            Todos os posts foram moderados. Volte mais tarde.
          </Caption>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={brand.accent[500]}
            />
          }
        />
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeInDown.duration(200)}
            style={[styles.modal, { backgroundColor: bgCard }]}
          >
            <Title style={{ color: textPrimary, marginBottom: 16 }}>
              Motivo da Rejeição
            </Title>

            {REJECTION_REASONS.map((reason, idx) => (
              <Pressable
                key={idx}
                onPress={() => setRejectReason(reason)}
                style={[
                  styles.reasonOption,
                  rejectReason === reason && styles.reasonOptionActive,
                ]}
              >
                <Caption style={{ color: rejectReason === reason ? brand.accent[600] : textPrimary }}>
                  {reason}
                </Caption>
              </Pressable>
            ))}

            <TextInput
              placeholder="Ou escreva outro motivo..."
              value={rejectReason}
              onChangeText={setRejectReason}
              style={[styles.reasonInput, { color: textPrimary, borderColor: Tokens.neutral[300] }]}
              placeholderTextColor={textSecondary}
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setRejectingId(null)}
                style={[styles.modalBtn, { backgroundColor: Tokens.neutral[200] }]}
              >
                <Text style={{ color: textPrimary }}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={confirmReject}
                style={[styles.modalBtn, { backgroundColor: nathAccent.coral }]}
              >
                <Text style={{ color: Tokens.neutral[0] }}>Rejeitar</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: Tokens.neutral[100],
  },
  filterBtnActive: {
    backgroundColor: brand.accent[100],
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  itemCard: {
    marginBottom: spacing.md,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreContainer: {
    alignItems: "center",
  },
  scoreBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    color: Tokens.neutral[0],
    fontWeight: "700",
    fontSize: 14,
  },
  contentContainer: {
    marginBottom: spacing.sm,
  },
  flagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: `${nathAccent.coral}15`,
    borderRadius: radius.md,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Tokens.neutral[200],
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  approveBtn: {
    backgroundColor: brand.teal[500],
  },
  rejectBtn: {
    backgroundColor: `${nathAccent.coral}15`,
    borderWidth: 1,
    borderColor: nathAccent.coral,
  },
  actionBtnText: {
    color: Tokens.neutral[0],
    fontWeight: "600",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  modal: {
    width: "100%",
    maxWidth: 400,
    padding: spacing.xl,
    borderRadius: radius.xl,
    ...shadows.lg,
  },
  reasonOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  reasonOptionActive: {
    backgroundColor: brand.accent[100],
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
});
