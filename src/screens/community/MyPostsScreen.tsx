/**
 * MyPostsScreen - Tela "Meus Posts"
 *
 * Mostra todos os posts do usuário com status de moderação:
 * - Tabs: Publicados / Em Revisão / Rejeitados
 * - Cada tab mostra posts com status correspondente
 * - Posts rejeitados mostram motivo da rejeição
 */

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useCallback, useState, useMemo } from "react";
import { Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { CommunityPostCard, EmptyStateCommunity } from "@/components/community";
import { ListSkeleton } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { communityService } from "@/services/community";
import { brand, neutral, semantic, typography, spacing, radius, surface } from "@/theme/tokens";
import { CommunityPost } from "@/types/community";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";

type Tab = "published" | "pending" | "rejected";

interface TabConfig {
  id: Tab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  statuses: string[];
}

const TABS: TabConfig[] = [
  {
    id: "published",
    label: "Publicados",
    icon: "checkmark-circle-outline",
    statuses: ["approved"],
  },
  {
    id: "pending",
    label: "Em Revisão",
    icon: "time-outline",
    statuses: ["submitted", "draft"],
  },
  {
    id: "rejected",
    label: "Rejeitados",
    icon: "close-circle-outline",
    statuses: ["rejected", "needs_changes"],
  },
];

export default function MyPostsScreen({ navigation }: RootStackScreenProps<"MyPosts">) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  // State
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("published");

  // Theme colors
  const bgPrimary = isDark ? surface.dark.base : surface.light.base;
  const textPrimary = isDark ? neutral[100] : neutral[900];
  const textSecondary = isDark ? neutral[400] : neutral[600];
  const borderColor = isDark ? neutral[700] : neutral[200];

  // Load user posts
  const loadMyPosts = useCallback(async () => {
    try {
      setHasError(false);
      const data = await communityService.getMyPosts();
      setPosts(data);
    } catch (e) {
      setHasError(true);
      logger.error("Erro ao carregar meus posts", "MyPostsScreen", e as Error);
    }
  }, []);

  // Reload on focus
  useFocusEffect(
    useCallback(() => {
      loadMyPosts().finally(() => setLoading(false));
    }, [loadMyPosts])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMyPosts();
    setRefreshing(false);
  }, [loadMyPosts]);

  // Filter posts by active tab
  const filteredPosts = useMemo(() => {
    const tabConfig = TABS.find((t) => t.id === activeTab);
    if (!tabConfig) return [];
    return posts.filter((post) => tabConfig.statuses.includes(post.status));
  }, [posts, activeTab]);

  // Count posts per tab
  const tabCounts = useMemo(() => {
    const counts: Record<Tab, number> = {
      published: 0,
      pending: 0,
      rejected: 0,
    };

    posts.forEach((post) => {
      if (["approved"].includes(post.status)) counts.published++;
      else if (["submitted", "draft"].includes(post.status)) counts.pending++;
      else if (["rejected", "needs_changes"].includes(post.status)) counts.rejected++;
    });

    return counts;
  }, [posts]);

  // Handlers
  const handleTabChange = useCallback(async (tab: Tab) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleLike = useCallback(async (postId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    logger.info("Like my post", "MyPostsScreen", { postId });
  }, []);

  const handleComment = useCallback((postId: string) => {
    logger.info("Comment on my post", "MyPostsScreen", { postId });
  }, []);

  const handleShare = useCallback((post: CommunityPost) => {
    logger.info("Share my post", "MyPostsScreen", { postId: post.id });
  }, []);

  const handlePostPress = useCallback((postId: string) => {
    logger.info("View my post detail", "MyPostsScreen", { postId });
  }, []);

  const handleCreatePost = useCallback(() => {
    navigation.navigate("NewPost");
  }, [navigation]);

  // Get empty state variant based on active tab
  const getEmptyStateVariant = useCallback(() => {
    if (hasError) return "error";
    return "my_posts_empty";
  }, [hasError]);

  // Render tab button
  const renderTab = useCallback(
    (tab: TabConfig) => {
      const isActive = activeTab === tab.id;
      const count = tabCounts[tab.id];

      return (
        <Pressable
          key={tab.id}
          onPress={() => handleTabChange(tab.id)}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={`${tab.label} (${count} posts)`}
          style={[
            styles.tab,
            {
              backgroundColor: isActive
                ? isDark
                  ? brand.primary[900]
                  : brand.primary[50]
                : "transparent",
              borderColor: isActive ? brand.primary[500] : isDark ? neutral[700] : neutral[200],
            },
          ]}
        >
          <Ionicons
            name={tab.icon}
            size={18}
            color={isActive ? brand.primary[500] : textSecondary}
          />
          <Text style={[styles.tabLabel, { color: isActive ? brand.primary[600] : textSecondary }]}>
            {tab.label}
          </Text>
          {count > 0 && (
            <View
              style={[
                styles.tabBadge,
                {
                  backgroundColor: isActive
                    ? brand.primary[500]
                    : isDark
                      ? neutral[600]
                      : neutral[300],
                },
              ]}
            >
              <Text style={styles.tabBadgeText}>{count}</Text>
            </View>
          )}
        </Pressable>
      );
    },
    [activeTab, tabCounts, isDark, textSecondary, handleTabChange]
  );

  // Render post item
  const renderPost = useCallback(
    ({ item, index }: { item: CommunityPost; index: number }) => (
      <View style={styles.postContainer}>
        <CommunityPostCard
          post={item}
          index={index}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onPress={handlePostPress}
          showStatus
        />
        {/* Show rejection reason for rejected posts */}
        {(item.status === "rejected" || item.status === "needs_changes") && item.review_reason && (
          <Animated.View
            entering={FadeInDown.delay(100).duration(200)}
            style={[
              styles.rejectionCard,
              { backgroundColor: isDark ? semantic.dark.errorLight : semantic.light.errorLight },
            ]}
          >
            <Ionicons
              name="information-circle"
              size={18}
              color={isDark ? semantic.dark.error : semantic.light.error}
            />
            <View style={styles.rejectionContent}>
              <Text
                style={[
                  styles.rejectionTitle,
                  { color: isDark ? semantic.dark.error : semantic.light.errorText },
                ]}
              >
                Motivo da rejeição
              </Text>
              <Text style={[styles.rejectionText, { color: isDark ? neutral[300] : neutral[600] }]}>
                {item.review_reason}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>
    ),
    [handleLike, handleComment, handleShare, handlePostPress, isDark]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgPrimary }]} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Meus Posts</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { borderBottomColor: borderColor }]}>
        {TABS.map(renderTab)}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ListSkeleton type="post" count={3} />
        </View>
      ) : (
        <FlashList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          ListFooterComponent={<View style={{ height: 100 }} />}
          ListEmptyComponent={
            <EmptyStateCommunity
              variant={getEmptyStateVariant()}
              onAction={handleCreatePost}
              onRetry={loadMyPosts}
            />
          }
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={brand.primary[500]}
              colors={[brand.primary[500]]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    flex: 1,
  },
  headerSpacer: {
    width: 32,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semibold,
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    color: neutral[0],
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: spacing.lg,
  },
  emptyListContent: {
    flex: 1,
  },
  postContainer: {
    paddingHorizontal: spacing.lg,
  },
  rejectionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginTop: -spacing.md,
    marginBottom: spacing.xl,
    marginHorizontal: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  rejectionContent: {
    flex: 1,
  },
  rejectionTitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: 2,
  },
  rejectionText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 18,
  },
});
