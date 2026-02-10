/**
 * MundoDaNath Redesign - Flo Health Minimal Design Style
 *
 * Design Concept: Clean, Minimal, Premium Content Hub
 * - FloScreenWrapper: Subtle white/light pink gradient background
 * - FloHeader: Minimal header with clean typography
 * - FloActionCard: Action cards with icon, title, subtitle
 * - FloSectionTitle: Section titles with clean hierarchy
 * - FloMotivationalCard: Motivational message cards
 *
 * Design Principles:
 * 1. Very subtle backgrounds (white/light pink gradient)
 * 2. Content cards with soft pink shadows
 * 3. Minimal borders (1px, neutral[100])
 * 4. Typography: Manrope font family
 * 5. Video/content thumbnails with rounded corners
 * 6. Category chips should be minimal
 * 7. Dark mode support using useTheme hook
 * 8. Use Tokens from '../theme/tokens' for all colors
 *
 * @example
 * ```tsx
 * <MundoDaNathScreenRedesign navigation={navigation} />
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PostCreator } from "@/components/admin/PostCreator";
import { FAB } from "@/components/ui/FAB";
import { useAdmin } from "@/hooks/useAdmin";
import { usePremium } from "@/hooks/usePremium";
import { useTheme } from "@/hooks/useTheme";
import { mundoNathService } from "@/services/mundoNath";
import { Tokens } from "@/theme/tokens";
import { MundoNathPost } from "@/types/community";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";

// =============================================================================
// FLO DESIGN COMPONENTS
// =============================================================================

/**
 * FloScreenWrapper - Screen wrapper with subtle gradient background
 */
interface FloScreenWrapperProps {
  children: React.ReactNode;
  isDark: boolean;
}

function FloScreenWrapper({ children, isDark }: FloScreenWrapperProps) {
  const gradientColors = isDark
    ? ([Tokens.surface.dark.base, Tokens.surface.dark.card] as const)
    : ([Tokens.neutral[0], Tokens.cleanDesign.pink[50], Tokens.neutral[0]] as const);

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
}

/**
 * FloHeader - Minimal header component
 */
interface FloHeaderProps {
  title: string;
  subtitle?: string;
  isDark: boolean;
  rightElement?: React.ReactNode;
}

function FloHeader({ title, subtitle, isDark, rightElement }: FloHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Tokens.spacing["2xl"],
        paddingVertical: Tokens.spacing.lg,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: Tokens.typography.fontFamily.bold,
            fontSize: Tokens.typography.headlineLarge.fontSize,
            lineHeight: Tokens.typography.headlineLarge.lineHeight,
            color: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontFamily: Tokens.typography.fontFamily.base,
              fontSize: Tokens.typography.bodySmall.fontSize,
              lineHeight: Tokens.typography.bodySmall.lineHeight,
              color: isDark ? Tokens.text.dark.secondary : Tokens.text.light.secondary,
              marginTop: Tokens.spacing.xs,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement}
    </View>
  );
}

/**
 * FloActionCard - Action card with icon, title, subtitle
 */
interface FloActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isDark: boolean;
  badge?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FloActionCard({
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  isDark,
  badge,
}: FloActionCardProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardStyle: ViewStyle = {
    backgroundColor: isDark ? Tokens.surface.dark.card : Tokens.neutral[0],
    borderRadius: Tokens.radius["2xl"],
    padding: Tokens.spacing.xl,
    borderWidth: 1,
    borderColor: isDark ? Tokens.border.dark.subtle : Tokens.neutral[100],
    ...(isDark ? Tokens.shadows.md : Tokens.shadows.flo.soft),
  };

  const content = (
    <View style={cardStyle}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: Tokens.radius.lg,
            backgroundColor: isDark ? Tokens.premium.glass.base : Tokens.cleanDesign.pink[100],
            alignItems: "center",
            justifyContent: "center",
            marginRight: Tokens.spacing.lg,
          }}
        >
          <Ionicons
            name={icon}
            size={24}
            color={iconColor || (isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500])}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: Tokens.typography.fontFamily.semibold,
              fontSize: Tokens.typography.titleMedium.fontSize,
              lineHeight: Tokens.typography.titleMedium.lineHeight,
              color: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={{
                fontFamily: Tokens.typography.fontFamily.base,
                fontSize: Tokens.typography.bodySmall.fontSize,
                lineHeight: Tokens.typography.bodySmall.lineHeight,
                color: isDark ? Tokens.text.dark.secondary : Tokens.text.light.secondary,
                marginTop: Tokens.spacing.xs,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {badge && (
          <View
            style={{
              backgroundColor: isDark ? Tokens.brand.accent[600] : Tokens.brand.accent[500],
              paddingHorizontal: Tokens.spacing.md,
              paddingVertical: Tokens.spacing.xs,
              borderRadius: Tokens.radius.full,
            }}
          >
            <Text
              style={{
                fontFamily: Tokens.typography.fontFamily.semibold,
                fontSize: Tokens.typography.labelSmall.fontSize,
                color: Tokens.neutral[0],
              }}
            >
              {badge}
            </Text>
          </View>
        )}
        {onPress && !badge && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? Tokens.text.dark.tertiary : Tokens.text.light.tertiary}
          />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
        accessibilityRole="button"
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
}

/**
 * FloSectionTitle - Section title component
 */
interface FloSectionTitleProps {
  title: string;
  subtitle?: string;
  isDark: boolean;
  action?: {
    label: string;
    onPress: () => void;
  };
}

function FloSectionTitle({ title, subtitle, isDark, action }: FloSectionTitleProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: Tokens.spacing.lg,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: Tokens.typography.fontFamily.semibold,
            fontSize: Tokens.typography.headlineSmall.fontSize,
            lineHeight: Tokens.typography.headlineSmall.lineHeight,
            color: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontFamily: Tokens.typography.fontFamily.base,
              fontSize: Tokens.typography.caption.fontSize,
              lineHeight: Tokens.typography.caption.lineHeight,
              color: isDark ? Tokens.text.dark.tertiary : Tokens.text.light.tertiary,
              marginTop: Tokens.spacing.xs,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {action && (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
        >
          <Text
            style={{
              fontFamily: Tokens.typography.fontFamily.medium,
              fontSize: Tokens.typography.labelMedium.fontSize,
              color: isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500],
            }}
          >
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/**
 * FloMotivationalCard - Motivational message card
 */
interface FloMotivationalCardProps {
  message: string;
  author?: string;
  isDark: boolean;
}

function FloMotivationalCard({ message, author, isDark }: FloMotivationalCardProps) {
  const cardStyle: ViewStyle = {
    backgroundColor: isDark ? Tokens.premium.glass.light : Tokens.maternal.warmth.blush,
    borderRadius: Tokens.radius["2xl"],
    padding: Tokens.spacing["2xl"],
    borderWidth: 1,
    borderColor: isDark ? Tokens.border.dark.subtle : Tokens.cleanDesign.pink[200],
  };

  return (
    <View style={cardStyle}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: Tokens.spacing.md,
        }}
      >
        <Ionicons
          name="heart"
          size={20}
          color={isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500]}
          style={{ marginRight: Tokens.spacing.sm, marginTop: 2 }}
        />
        <Text
          style={{
            flex: 1,
            fontFamily: Tokens.typography.fontFamily.base,
            fontSize: Tokens.typography.bodyMedium.fontSize,
            lineHeight: Tokens.typography.bodyMedium.lineHeight,
            color: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
            fontStyle: "italic",
          }}
        >
          {message}
        </Text>
      </View>
      {author && (
        <Text
          style={{
            fontFamily: Tokens.typography.fontFamily.medium,
            fontSize: Tokens.typography.caption.fontSize,
            color: isDark ? Tokens.text.dark.secondary : Tokens.text.light.secondary,
            textAlign: "right",
          }}
        >
          - {author}
        </Text>
      )}
    </View>
  );
}

/**
 * FloContentCard - Content card for posts with clean design
 */
interface FloContentCardProps {
  post: MundoNathPost;
  isPremium: boolean;
  isDark: boolean;
  onUnlock: () => void;
}

function FloContentCard({ post, isPremium, isDark, onUnlock }: FloContentCardProps) {
  const isLocked = post.is_locked || (!isPremium && post.media_path);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (isLocked) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (isLocked) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "";
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Agora";
    if (hours === 1) return "Há 1h";
    if (hours < 24) return `Há ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Há 1 dia";
    return `Há ${days} dias`;
  };

  const cardStyle: ViewStyle = {
    backgroundColor: isDark ? Tokens.surface.dark.card : Tokens.neutral[0],
    borderRadius: Tokens.radius["2xl"],
    borderWidth: 1,
    borderColor: isDark ? Tokens.border.dark.subtle : Tokens.neutral[100],
    overflow: "hidden",
    ...(isDark ? Tokens.shadows.md : Tokens.shadows.flo.soft),
  };

  // Locked content card
  if (isLocked) {
    return (
      <AnimatedPressable
        onPress={onUnlock}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
        accessibilityRole="button"
        accessibilityLabel="Desbloquear conteúdo premium"
      >
        <View
          style={{
            ...cardStyle,
            backgroundColor: isDark ? Tokens.premium.glass.light : Tokens.cleanDesign.pink[50],
            borderColor: isDark ? Tokens.brand.accent[700] : Tokens.cleanDesign.pink[200],
            borderStyle: "dashed",
          }}
        >
          <View style={{ padding: Tokens.spacing["2xl"], alignItems: "center" }}>
            {/* Lock Icon */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: Tokens.radius.full,
                backgroundColor: isDark ? Tokens.premium.glass.base : Tokens.cleanDesign.pink[100],
                alignItems: "center",
                justifyContent: "center",
                marginBottom: Tokens.spacing.lg,
              }}
            >
              <Ionicons
                name="lock-closed"
                size={28}
                color={isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500]}
              />
            </View>

            {/* Title */}
            <Text
              style={{
                fontFamily: Tokens.typography.fontFamily.semibold,
                fontSize: Tokens.typography.titleMedium.fontSize,
                lineHeight: Tokens.typography.titleMedium.lineHeight,
                color: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
                marginBottom: Tokens.spacing.sm,
                textAlign: "center",
              }}
            >
              Conteúdo Exclusivo
            </Text>

            {/* Description */}
            <Text
              style={{
                fontFamily: Tokens.typography.fontFamily.base,
                fontSize: Tokens.typography.bodySmall.fontSize,
                lineHeight: Tokens.typography.bodySmall.lineHeight,
                color: isDark ? Tokens.text.dark.secondary : Tokens.text.light.secondary,
                textAlign: "center",
                marginBottom: Tokens.spacing.xl,
              }}
            >
              Desbloqueie para acessar conteúdos especiais do Mundo da Nath
            </Text>

            {/* Unlock Button */}
            <View
              style={{
                backgroundColor: isDark ? Tokens.brand.accent[600] : Tokens.brand.accent[500],
                paddingHorizontal: Tokens.spacing["2xl"],
                paddingVertical: Tokens.spacing.md,
                borderRadius: Tokens.radius.lg,
                ...(isDark ? {} : Tokens.shadows.flo.cta),
              }}
            >
              <Text
                style={{
                  fontFamily: Tokens.typography.fontFamily.semibold,
                  fontSize: Tokens.typography.labelLarge.fontSize,
                  color: Tokens.neutral[0],
                }}
              >
                Desbloquear
              </Text>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    );
  }

  // Unlocked content card
  return (
    <View style={cardStyle}>
      {/* Media placeholder if exists */}
      {post.media_path && (
        <View
          style={{
            height: 180,
            backgroundColor: isDark ? Tokens.surface.dark.tertiary : Tokens.cleanDesign.pink[50],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="play-circle"
            size={56}
            color={isDark ? Tokens.text.dark.tertiary : Tokens.cleanDesign.pink[400]}
          />
        </View>
      )}

      {/* Content */}
      <View style={{ padding: Tokens.spacing.xl }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: Tokens.spacing.md,
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: Tokens.radius.full,
              backgroundColor: isDark ? Tokens.brand.accent[600] : Tokens.cleanDesign.pink[400],
              alignItems: "center",
              justifyContent: "center",
              marginRight: Tokens.spacing.md,
            }}
          >
            <Ionicons name="star" size={18} color={Tokens.neutral[0]} />
          </View>

          {/* Author Info */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: Tokens.typography.fontFamily.semibold,
                  fontSize: Tokens.typography.labelLarge.fontSize,
                  color: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
                }}
              >
                Nathalia Valente
              </Text>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500]}
                style={{ marginLeft: Tokens.spacing.xs }}
              />
            </View>
            <Text
              style={{
                fontFamily: Tokens.typography.fontFamily.base,
                fontSize: Tokens.typography.caption.fontSize,
                color: isDark ? Tokens.text.dark.tertiary : Tokens.text.light.tertiary,
              }}
            >
              {formatTimeAgo(post.published_at)}
            </Text>
          </View>

          {/* Premium Badge */}
          <View
            style={{
              backgroundColor: isDark
                ? Tokens.premium.glass.accentLight
                : Tokens.cleanDesign.pink[100],
              paddingHorizontal: Tokens.spacing.md,
              paddingVertical: Tokens.spacing.xs,
              borderRadius: Tokens.radius.full,
            }}
          >
            <Text
              style={{
                fontFamily: Tokens.typography.fontFamily.semibold,
                fontSize: 10,
                color: isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[600],
                letterSpacing: 0.5,
              }}
            >
              EXCLUSIVO
            </Text>
          </View>
        </View>

        {/* Post Text */}
        <Text
          style={{
            fontFamily: Tokens.typography.fontFamily.base,
            fontSize: Tokens.typography.bodyMedium.fontSize,
            lineHeight: Tokens.typography.bodyMedium.lineHeight,
            color: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
          }}
        >
          {post.text || ""}
        </Text>
      </View>
    </View>
  );
}

/**
 * FloCategoryChip - Minimal category chip
 */
interface FloCategoryChipProps {
  label: string;
  isSelected?: boolean;
  isDark: boolean;
  onPress?: () => void;
}

function FloCategoryChip({ label, isSelected, isDark, onPress }: FloCategoryChipProps) {
  const chipStyle: ViewStyle = {
    backgroundColor: isSelected
      ? isDark
        ? Tokens.brand.accent[600]
        : Tokens.brand.accent[500]
      : isDark
        ? Tokens.premium.glass.light
        : Tokens.neutral[0],
    borderRadius: Tokens.radius.full,
    paddingHorizontal: Tokens.spacing.lg,
    paddingVertical: Tokens.spacing.md,
    minHeight: 44,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: isSelected
      ? isDark
        ? Tokens.brand.accent[600]
        : Tokens.brand.accent[500]
      : isDark
        ? Tokens.border.dark.subtle
        : Tokens.neutral[100],
  };

  return (
    <Pressable
      onPress={onPress}
      style={chipStyle}
      accessibilityRole="button"
      accessibilityLabel={`Categoria ${label}${isSelected ? ", selecionada" : ""}`}
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        style={{
          fontFamily: Tokens.typography.fontFamily.medium,
          fontSize: Tokens.typography.labelSmall.fontSize,
          color: isSelected
            ? Tokens.neutral[0]
            : isDark
              ? Tokens.text.dark.secondary
              : Tokens.text.light.secondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// =============================================================================
// MAIN SCREEN COMPONENT
// =============================================================================

export default function MundoDaNathScreenRedesign({
  navigation,
}: RootStackScreenProps<"MundoDaNath">) {
  const insets = useSafeAreaInsets();
  const { isPremium } = usePremium();
  const { isAdmin } = useAdmin();
  const { isDark } = useTheme();

  // State
  const [posts, setPosts] = useState<MundoNathPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Categories for filtering
  const categories = [
    "Todos",
    "Vídeos",
    "Artigos",
    "Dicas",
    "Reflexões",
    "Maternidade",
    "Autocuidado",
    "Beleza",
  ];

  // Load posts
  const loadPosts = useCallback(async () => {
    try {
      const { data } = await mundoNathService.getFeed();
      setPosts(data);
    } catch (e) {
      logger.error("Erro ao carregar posts", "MundoDaNathScreenRedesign", e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, [loadPosts]);

  const handleSubmitAdminPost = useCallback(
    async (post: {
      title: string;
      body: string;
      category: string;
      type: "text" | "video" | "image";
    }) => {
      try {
        setSubmittingPost(true);
        const result = await mundoNathService.createPost({
          title: post.title,
          body: post.body,
          type: post.type,
        });

        if (!result.success) {
          logger.warn("Falha ao publicar post (admin)", "MundoDaNathScreenRedesign", {
            error: result.error,
          });
          return;
        }

        setShowPostCreator(false);
        await loadPosts();
      } catch (e) {
        logger.error("Erro ao publicar post (admin)", "MundoDaNathScreenRedesign", e as Error);
      } finally {
        setSubmittingPost(false);
      }
    },
    [loadPosts]
  );

  const handleUnlockPremium = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logger.info("Unlock premium pressed", "MundoDaNathScreenRedesign");
    navigation.navigate("Paywall", { source: "mundo_nath" });
  }, [navigation]);

  return (
    <FloScreenWrapper isDark={isDark}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500]}
          />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)}>
          <FloHeader
            title="Mundo da Nath"
            subtitle="Conteúdos exclusivos da Nathalia"
            isDark={isDark}
            rightElement={
              isAdmin ? (
                <Pressable
                  onPress={() => navigation.navigate("AdminDashboard")}
                  accessibilityRole="button"
                  accessibilityLabel="Abrir painel admin"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: isDark
                      ? Tokens.premium.glass.light
                      : Tokens.cleanDesign.pink[100],
                    paddingHorizontal: Tokens.spacing.md,
                    paddingVertical: Tokens.spacing.sm,
                    borderRadius: Tokens.radius.full,
                  })}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={16}
                    color={isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500]}
                  />
                  <Text
                    style={{
                      marginLeft: Tokens.spacing.xs,
                      fontFamily: Tokens.typography.fontFamily.semibold,
                      fontSize: Tokens.typography.labelSmall.fontSize,
                      color: isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500],
                    }}
                  >
                    Admin
                  </Text>
                </Pressable>
              ) : undefined
            }
          />
        </Animated.View>

        {/* Motivational Card */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={{ paddingHorizontal: Tokens.spacing["2xl"], marginBottom: Tokens.spacing["2xl"] }}
        >
          <FloMotivationalCard
            message="Bem-vinda ao meu cantinho especial! Aqui compartilho conteúdos exclusivos, dicas, reflexões e tudo que preparo com carinho só para você."
            author="Nathalia Valente"
            isDark={isDark}
          />
        </Animated.View>

        {/* Category Chips */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          style={{ marginBottom: Tokens.spacing["2xl"] }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: Tokens.spacing["2xl"],
              gap: Tokens.spacing.sm,
            }}
          >
            {categories.map((category) => (
              <FloCategoryChip
                key={category}
                label={category}
                isSelected={
                  selectedCategory === category ||
                  (selectedCategory === null && category === "Todos")
                }
                isDark={isDark}
                onPress={() => setSelectedCategory(category === "Todos" ? null : category)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Content Section */}
        <View style={{ paddingHorizontal: Tokens.spacing["2xl"] }}>
          <FloSectionTitle
            title="Conteúdos Recentes"
            subtitle="Atualizados diariamente"
            isDark={isDark}
          />

          {/* Loading State */}
          {loading && (
            <View style={{ alignItems: "center", paddingVertical: Tokens.spacing["4xl"] }}>
              <ActivityIndicator
                size="large"
                color={isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[500]}
              />
              <Text
                style={{
                  fontFamily: Tokens.typography.fontFamily.base,
                  fontSize: Tokens.typography.bodySmall.fontSize,
                  color: isDark ? Tokens.text.dark.secondary : Tokens.text.light.secondary,
                  marginTop: Tokens.spacing.lg,
                }}
              >
                Carregando conteúdos...
              </Text>
            </View>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <Animated.View entering={FadeIn.duration(400)}>
              <FloActionCard
                icon="sparkles"
                title="Novos conteúdos em breve!"
                subtitle="Estamos preparando conteúdos especiais para você"
                isDark={isDark}
              />
            </Animated.View>
          )}

          {/* Posts List */}
          {!loading && posts.length > 0 && (
            <View style={{ gap: Tokens.spacing.lg }}>
              {posts.map((post, index) => (
                <Animated.View
                  key={post.id}
                  entering={FadeInUp.delay(300 + index * 100).duration(500)}
                >
                  <FloContentCard
                    post={post}
                    isPremium={isPremium}
                    isDark={isDark}
                    onUnlock={handleUnlockPremium}
                  />
                </Animated.View>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions Section */}
        {!loading && (
          <Animated.View
            entering={FadeInUp.delay(600).duration(500)}
            style={{
              paddingHorizontal: Tokens.spacing["2xl"],
              marginTop: Tokens.spacing["4xl"],
            }}
          >
            <FloSectionTitle title="Ações Rápidas" isDark={isDark} />
            <View style={{ gap: Tokens.spacing.md }}>
              <FloActionCard
                icon="star"
                iconColor={Tokens.premium.special.gold}
                title="Assinar Premium"
                subtitle="Acesse todos os conteúdos exclusivos"
                onPress={handleUnlockPremium}
                isDark={isDark}
                badge={isPremium ? "Ativo" : undefined}
              />
              <FloActionCard
                icon="chatbubble-ellipses"
                title="Falar com NathIA"
                subtitle="Tire suas dúvidas com a assistente"
                onPress={() => navigation.navigate("MainTabs", { screen: "Assistant" })}
                isDark={isDark}
              />
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Admin FAB */}
      {isAdmin && (
        <View
          style={{
            position: "absolute",
            right: Tokens.spacing["2xl"],
            bottom: insets.bottom + Tokens.spacing["2xl"],
          }}
        >
          <FAB
            icon="add"
            onPress={() => setShowPostCreator(true)}
            variant="accent"
            size="md"
            accessibilityLabel="Criar novo post"
            animated
          />
        </View>
      )}

      {/* Post Creator Modal */}
      <PostCreator
        visible={showPostCreator}
        onClose={() => {
          if (!submittingPost) setShowPostCreator(false);
        }}
        onSubmit={handleSubmitAdminPost}
      />
    </FloScreenWrapper>
  );
}
