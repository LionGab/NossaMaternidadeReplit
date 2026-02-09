/**
 * AffirmationsScreen Redesign - Flo Health Minimal Style
 *
 * Design: Clean, minimal affirmation cards with Flo aesthetics
 * - Subtle white/pink gradient background
 * - Serif typography (Georgia) for emotional content
 * - Soft gradient cards
 * - Minimal borders
 * - Clean category selector
 * - Subtle share/save buttons
 * - Full dark mode support
 *
 * @example
 * ```tsx
 * <AffirmationsScreenRedesign navigation={navigation} />
 * ```
 */

import { FloHeader } from "@/components/ui/FloHeader";
import { FloScreenWrapper } from "@/components/ui/FloScreenWrapper";
import { FloSectionTitle } from "@/components/ui/FloSectionTitle";
import { useTheme } from "@/hooks/useTheme";
import { Tokens, shadows, spacing, typography } from "@/theme/tokens";
import { logger } from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, Share, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

/**
 * Affirmation categories
 */
const CATEGORIES = [
  { id: "all", label: "Todas", icon: "sparkles" as const },
  { id: "strength", label: "Forca", icon: "fitness" as const },
  { id: "confidence", label: "Confianca", icon: "heart" as const },
  { id: "patience", label: "Paciencia", icon: "leaf" as const },
  { id: "love", label: "Amor", icon: "flower" as const },
  { id: "gratitude", label: "Gratidao", icon: "sunny" as const },
];

/**
 * Affirmations data
 */
const AFFIRMATIONS = [
  {
    id: "1",
    category: "strength",
    categoryLabel: "Forca Interior",
    text: "Voce e mais forte do que imagina. Cada desafio e uma oportunidade de descobrir sua coragem.",
    author: "Nathalia Valente",
    gradientLight: [Tokens.brand.accent[100], Tokens.brand.accent[50], Tokens.neutral[0]] as const,
    gradientDark: ["rgba(255,107,138,0.15)", "rgba(255,107,138,0.05)"] as const,
  },
  {
    id: "2",
    category: "confidence",
    categoryLabel: "Autoconfianca",
    text: "Seu corpo esta fazendo um trabalho extraordinario. Confie no processo e em voce mesma.",
    author: "Nathalia Valente",
    gradientLight: [
      Tokens.brand.secondary[200],
      Tokens.brand.secondary[50],
      Tokens.neutral[0],
    ] as const,
    gradientDark: ["rgba(168,85,247,0.15)", "rgba(168,85,247,0.05)"] as const,
  },
  {
    id: "3",
    category: "patience",
    categoryLabel: "Paciencia",
    text: "Tudo acontece no tempo certo. Respire fundo e permita-se viver cada momento desta jornada.",
    author: "Nathalia Valente",
    gradientLight: [
      Tokens.brand.primary[200],
      Tokens.brand.primary[50],
      Tokens.neutral[0],
    ] as const,
    gradientDark: ["rgba(56,189,248,0.15)", "rgba(56,189,248,0.05)"] as const,
  },
  {
    id: "4",
    category: "love",
    categoryLabel: "Amor-proprio",
    text: "Voce merece descanso, carinho e cuidado. Nao e egoismo, e necessidade.",
    author: "Nathalia Valente",
    gradientLight: [Tokens.brand.accent[200], Tokens.brand.accent[50], Tokens.neutral[0]] as const,
    gradientDark: ["rgba(244,63,94,0.15)", "rgba(244,63,94,0.05)"] as const,
  },
  {
    id: "5",
    category: "gratitude",
    categoryLabel: "Gratidao",
    text: "Hoje, celebre cada pequena vitoria. Voce esta construindo algo incrivel.",
    author: "Nathalia Valente",
    gradientLight: [
      Tokens.maternal.warmth.honey,
      Tokens.maternal.warmth.cream,
      Tokens.neutral[0],
    ] as const,
    gradientDark: ["rgba(251,191,36,0.15)", "rgba(251,191,36,0.05)"] as const,
  },
];

/**
 * Affirmations Screen Props
 */
interface AffirmationsScreenRedesignProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

export function AffirmationsScreenRedesign({ navigation }: AffirmationsScreenRedesignProps) {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [todayIndex, setTodayIndex] = useState(0);

  // Daily rotation: use day of year to pick affirmation
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    setTodayIndex(dayOfYear % AFFIRMATIONS.length);
  }, []);

  // Filter affirmations by category
  const filteredAffirmations =
    selectedCategory === "all"
      ? AFFIRMATIONS
      : AFFIRMATIONS.filter((a) => a.category === selectedCategory);

  const todayAffirmation = AFFIRMATIONS[todayIndex];
  const otherAffirmations = filteredAffirmations.filter((a) => a.id !== todayAffirmation.id);

  // Handlers
  const handleCategoryPress = async (categoryId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(categoryId);
    logger.info(`Category selected: ${categoryId}`, "AffirmationsScreen");
  };

  const handleFavoriteToggle = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    logger.info(`Favorite toggled: ${id}`, "AffirmationsScreen");
  };

  const handleShare = async (affirmation: (typeof AFFIRMATIONS)[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `"${affirmation.text}"\n\n- ${affirmation.author}\n\nVia Nossa Maternidade`,
      });
      logger.info(`Shared affirmation: ${affirmation.id}`, "AffirmationsScreen");
    } catch (_error) {
      logger.error("Failed to share affirmation", "AffirmationsScreen");
    }
  };

  // Theme colors
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const accentColor = Tokens.brand.accent[500];
  const chipBg = isDark ? "rgba(255,255,255,0.08)" : Tokens.neutral[100];
  const chipActiveBg = isDark ? "rgba(255,107,138,0.2)" : Tokens.brand.accent[50];

  return (
    <FloScreenWrapper scrollable paddingHorizontal={0} paddingBottom={120}>
      {/* Header */}
      <View style={{ paddingHorizontal: spacing.xl }}>
        <FloHeader
          title="Afirmacoes"
          subtitle="Palavras que fortalecem"
          showBack
          onBack={() => navigation.goBack()}
          variant="large"
        />
      </View>

      {/* Category Selector */}
      <Animated.ScrollView
        entering={FadeIn.delay(200).duration(400)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: spacing.lg,
          gap: spacing.sm,
        }}
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <Pressable
              key={category.id}
              onPress={() => handleCategoryPress(category.id)}
              accessibilityLabel={category.label}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.lg,
                borderRadius: 20,
                backgroundColor: isActive ? chipActiveBg : chipBg,
                borderWidth: 1,
                borderColor: isActive ? accentColor : "transparent",
              }}
            >
              <Ionicons
                name={category.icon}
                size={16}
                color={isActive ? accentColor : textSecondary}
                style={{ marginRight: spacing.xs }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: isActive
                    ? typography.fontFamily.semibold
                    : typography.fontFamily.medium,
                  color: isActive ? accentColor : textSecondary,
                }}
              >
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </Animated.ScrollView>

      {/* Today's Affirmation */}
      <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.lg }}>
        <FloSectionTitle
          title="Afirmacao de Hoje"
          icon="star"
          iconColor={Tokens.premium.special.gold}
          animationDelay={300}
        />

        <AffirmationCard
          affirmation={todayAffirmation}
          isFavorite={favorites.has(todayAffirmation.id)}
          onFavoritePress={() => handleFavoriteToggle(todayAffirmation.id)}
          onSharePress={() => handleShare(todayAffirmation)}
          variant="featured"
          animationDelay={400}
        />
      </View>

      {/* Other Affirmations */}
      {otherAffirmations.length > 0 && (
        <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing["2xl"] }}>
          <FloSectionTitle
            title="Mais Afirmacoes"
            subtitle={`${otherAffirmations.length} disponiveis`}
            animationDelay={500}
          />

          {otherAffirmations.map((affirmation, index) => (
            <AffirmationCard
              key={affirmation.id}
              affirmation={affirmation}
              isFavorite={favorites.has(affirmation.id)}
              onFavoritePress={() => handleFavoriteToggle(affirmation.id)}
              onSharePress={() => handleShare(affirmation)}
              animationDelay={600 + index * 100}
            />
          ))}
        </View>
      )}

      {/* Favorites Section */}
      {favorites.size > 0 && (
        <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing["2xl"] }}>
          <FloSectionTitle
            title="Seus Favoritos"
            icon="heart"
            iconColor={Tokens.brand.accent[500]}
            subtitle={`${favorites.size} salvos`}
            animationDelay={700}
          />

          {AFFIRMATIONS.filter((a) => favorites.has(a.id)).map((affirmation, index) => (
            <AffirmationCard
              key={`fav-${affirmation.id}`}
              affirmation={affirmation}
              isFavorite={true}
              onFavoritePress={() => handleFavoriteToggle(affirmation.id)}
              onSharePress={() => handleShare(affirmation)}
              variant="minimal"
              animationDelay={800 + index * 100}
            />
          ))}
        </View>
      )}
    </FloScreenWrapper>
  );
}

/**
 * Affirmation Card Component
 */
interface AffirmationCardProps {
  affirmation: (typeof AFFIRMATIONS)[0];
  isFavorite: boolean;
  onFavoritePress: () => void;
  onSharePress: () => void;
  variant?: "default" | "featured" | "minimal";
  animationDelay?: number;
}

function AffirmationCard({
  affirmation,
  isFavorite,
  onFavoritePress,
  onSharePress,
  variant = "default",
  animationDelay = 0,
}: AffirmationCardProps) {
  const { isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Theme colors
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const accentColor = Tokens.brand.accent[400];
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
  const iconBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(255,107,138,0.1)";

  // Serif font for emotional content
  const serifFont = Platform.OS === "ios" ? "Georgia" : "serif";

  // Gradient colors
  const gradientColors = isDark ? affirmation.gradientDark : affirmation.gradientLight;

  // Variant styles
  const cardPadding = variant === "minimal" ? spacing.lg : spacing.xl;
  const fontSize = variant === "featured" ? 22 : variant === "minimal" ? 16 : 18;
  const lineHeight = variant === "featured" ? 32 : variant === "minimal" ? 24 : 28;

  if (variant === "minimal") {
    return (
      <Animated.View
        entering={FadeInUp.delay(animationDelay).duration(400)}
        style={{ marginBottom: spacing.lg }}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityLabel={`${affirmation.categoryLabel}: ${affirmation.text}`}
          accessibilityRole="button"
        >
          <Animated.View
            style={[
              animatedStyle,
              {
                backgroundColor: isDark ? "rgba(255,255,255,0.04)" : Tokens.neutral[50],
                borderRadius: 16,
                padding: cardPadding,
                borderWidth: 1,
                borderColor: cardBorder,
              },
            ]}
          >
            {/* Category Badge */}
            <Text
              style={{
                fontSize: 11,
                fontFamily: typography.fontFamily.semibold,
                color: accentColor,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: spacing.sm,
              }}
            >
              {affirmation.categoryLabel}
            </Text>

            {/* Text */}
            <Text
              style={{
                fontSize,
                lineHeight,
                fontFamily: serifFont,
                color: textPrimary,
              }}
            >
              {affirmation.text}
            </Text>

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: spacing.md,
                gap: spacing.sm,
              }}
            >
              <ActionButton
                icon={isFavorite ? "heart" : "heart-outline"}
                active={isFavorite}
                onPress={onFavoritePress}
                label="Favoritar"
              />
              <ActionButton icon="share-outline" onPress={onSharePress} label="Compartilhar" />
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay).duration(400)}
      style={{ marginBottom: spacing.xl }}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={`${affirmation.categoryLabel}: ${affirmation.text}`}
        accessibilityRole="button"
      >
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              {
                borderRadius: 24,
                borderWidth: 1,
                borderColor: cardBorder,
                padding: cardPadding,
                ...(!isDark && shadows.flo.soft),
              },
            ]}
          >
            {/* Category Badge */}
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)",
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.md,
                borderRadius: 12,
                marginBottom: spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: typography.fontFamily.semibold,
                  color: accentColor,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {affirmation.categoryLabel}
              </Text>
            </View>

            {/* Affirmation Text */}
            <Text
              style={{
                fontSize,
                lineHeight,
                fontFamily: serifFont,
                color: textPrimary,
                marginBottom: spacing.xl,
              }}
            >
              {affirmation.text}
            </Text>

            {/* Footer: Author + Actions */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Author */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: iconBg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: spacing.sm,
                  }}
                >
                  <Ionicons name="heart" size={16} color={accentColor} />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: typography.fontFamily.medium,
                    color: textSecondary,
                  }}
                >
                  - {affirmation.author}
                </Text>
              </View>

              {/* Actions */}
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <ActionButton
                  icon={isFavorite ? "heart" : "heart-outline"}
                  active={isFavorite}
                  onPress={onFavoritePress}
                  label="Favoritar"
                />
                <ActionButton icon="share-outline" onPress={onSharePress} label="Compartilhar" />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Action Button Component - Subtle icon button
 */
interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  active?: boolean;
  label: string;
}

function ActionButton({ icon, onPress, active = false, label }: ActionButtonProps) {
  const { isDark } = useTheme();

  const bgColor = active
    ? isDark
      ? "rgba(255,107,138,0.2)"
      : Tokens.brand.accent[50]
    : isDark
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.04)";

  const iconColor = active
    ? Tokens.brand.accent[500]
    : isDark
      ? Tokens.neutral[400]
      : Tokens.neutral[500];

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: bgColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
    </Pressable>
  );
}

export default AffirmationsScreenRedesign;
