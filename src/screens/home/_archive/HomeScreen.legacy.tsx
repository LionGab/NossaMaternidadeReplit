/**
 * HomeScreen - Premium Layout (Carousel + Grid + Bottom Nav)
 *
 * Estrutura:
 * - Header com avatar + greeting + notification
 * - Carousel "Sua Jornada" com 3 cards (Chat, Community, Premium)
 * - Carousel indicators (dinâmicos: 6px → 24px)
 * - Quote card full-width
 * - Grid 2x2 com cards coloridos (Check-in, Hábitos, Dica, Calendário)
 * - Bottom navigation (5 itens + center button flutuante)
 */

import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "@/hooks/useTheme";
import { useAppStore, useHabitsStore } from "@/state";
import { brand, maternal, neutral, semantic, shadows, text } from "@/theme/tokens";
import { MainTabScreenProps } from "@/types/navigation";
import { getGreeting } from "@/utils/greeting";

// Components
import { Avatar, AVATAR_SIZES } from "@/components/ui";

// Animated ScrollView
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// Screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_CARD_WIDTH = 280;
const CAROUSEL_CARD_HEIGHT = 180;
const GRID_CARD_HEIGHT = 140;
const PADDING_H = 24;

// Color Palette - All colors from design system tokens
const COLORS = {
  // Text colors
  brandText: text.light.primary, // #1F2937

  // Brand accent palette (rose tones)
  rose50: brand.accent[50], // #FFF1F3
  rose100: brand.accent[100], // #FFE4E9
  rose400: brand.accent[400], // #FB7196
  rose500: brand.accent[500], // #F43F68

  // Neutral palette
  gray400: neutral[400], // #9CA3AF
  gray500: neutral[500], // #6B7280
  white: neutral[0], // #FFFFFF

  // Semantic colors
  success: semantic.light.success, // #10B981
  warning: semantic.light.warning, // #F59E0B
  shadowBase: shadows.sm.shadowColor, // #000
} as const;

// ===========================================
// JOURNEY CAROUSEL CARD
// ===========================================
interface JourneyCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  gradientStart: string;
  gradientEnd: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  isNew?: boolean;
}

function JourneyCard({
  icon,
  iconColor,
  gradientStart,
  gradientEnd,
  title,
  subtitle,
  onPress,
  isNew,
}: JourneyCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.carouselCardWrapper, { opacity: pressed ? 0.9 : 1 }]}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <LinearGradient colors={[gradientStart, gradientEnd]} style={styles.journeyCard}>
        {/* NOVO Badge */}
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NOVO</Text>
          </View>
        )}

        {/* Icon Container */}
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={28} color={iconColor} />
        </View>

        {/* Text Container */}
        <View>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// ===========================================
// GRID CARD COMPONENT
// ===========================================
interface GridCardProps {
  icon?:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof Feather.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor: string;
  bgColor: string;
  gradientStart: string;
  gradientEnd: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  showProgress?: boolean;
  progress?: number;
  iconFamily?: "ionicons" | "feather" | "material";
}

function GridCard({
  icon,
  iconColor,
  bgColor: _bgColor,
  gradientStart,
  gradientEnd,
  title,
  subtitle,
  onPress,
  showProgress,
  progress: _progress,
  iconFamily = "feather",
}: GridCardProps) {
  const renderIcon = () => {
    if (!icon) return null;

    if (showProgress) {
      // Progress circle SVG
      return (
        <View style={styles.progressCircleContainer}>
          <Svg width="44" height="44" viewBox="0 0 44 44">
            <Circle cx="22" cy="22" r="18" stroke="white" strokeWidth="3" opacity={0.4} />
            <Circle
              cx="22"
              cy="22"
              r="18"
              stroke={iconColor}
              strokeWidth="3"
              strokeDasharray="113"
              strokeDashoffset="113"
              transform="rotate(-90 22 22)"
            />
          </Svg>
          <View style={styles.absoluteCheck}>
            <Feather name="check" size={14} color={iconColor} />
          </View>
        </View>
      );
    }

    const iconProps = { size: 24, color: iconColor };

    switch (iconFamily) {
      case "feather":
        return (
          <View style={[styles.miniIconBox, { backgroundColor: COLORS.white }]}>
            <Feather name={icon as keyof typeof Feather.glyphMap} {...iconProps} />
          </View>
        );
      case "material":
        return (
          <View style={[styles.miniIconBox, { backgroundColor: COLORS.white }]}>
            <MaterialCommunityIcons
              name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
              {...iconProps}
            />
          </View>
        );
      default:
        return (
          <View style={[styles.miniIconBox, { backgroundColor: COLORS.white }]}>
            <Ionicons name={icon as keyof typeof Ionicons.glyphMap} {...iconProps} />
          </View>
        );
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={[gradientStart, gradientEnd]}
        style={[
          styles.gridCard,
          {
            borderColor: "rgba(255, 255, 255, 0.4)",
          },
        ]}
      >
        {renderIcon()}

        {/* Text */}
        <View style={styles.gridCardText}>
          <Text style={styles.gridCardTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.gridCardSubtitle, { color: iconColor }]} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// ===========================================
// QUOTE CARD
// ===========================================
function QuoteCard() {
  return (
    <View style={styles.glassCard}>
      <View style={styles.quoteRow}>
        <View style={styles.heartIconCircle}>
          <Ionicons name="heart" size={18} color={COLORS.rose400} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.quoteText}>
            "A tarde também merece seu <Text style={{ color: COLORS.rose500 }}>autocuidado</Text>."
          </Text>
          <Text style={styles.authorText}>— NATHALIA VALENTE</Text>
        </View>
      </View>
    </View>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================
type Props = MainTabScreenProps<"Home">;

export default function HomeScreen({ navigation }: Props) {
  const { colors: _colors } = useTheme();

  // Store selectors
  const user = useAppStore((s) => s.user);
  const userAvatar = user?.avatarUrl;

  // Check-in store - using default value since checkInStreak not in store
  const checkInStreak = 0;

  // Saudação memoizada
  const greeting = useMemo(() => getGreeting(), []);

  // Habits store
  const habits = useHabitsStore((s) => s.habits);
  const completedHabits = useMemo(() => habits.filter((h) => h.completed).length, [habits]);
  const totalHabits = habits.length || 8;

  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Scroll animation
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Navigation handlers
  const handleAvatarPress = useCallback(() => {
    navigation.navigate("Profile" as never);
  }, [navigation]);

  const handleMoodCheckIn = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("DailyLog" as never);
  }, [navigation]);

  const handleHabits = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Habits" as never);
  }, [navigation]);

  const handleChat = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Assistant" as never);
  }, [navigation]);

  const handleCommunity = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Community" as never);
  }, [navigation]);

  const handlePremium = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Paywall" as never);
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsRefreshing(false);
  }, []);

  const handleCarouselScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (CAROUSEL_CARD_WIDTH + 16));
    setCarouselIndex(Math.min(index, 2));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.rose50 }]}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Background Blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobMiddleLeft} />

      <SafeAreaView style={styles.safeArea}>
        <AnimatedScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.rose500}
            />
          }
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
        >
          {/* HEADER */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <View style={styles.headerLeft}>
              <Pressable
                onPress={handleAvatarPress}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                accessibilityLabel="Ir para perfil"
                accessibilityRole="button"
              >
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={[brand.accent[300], brand.accent[400]]}
                    style={styles.avatarGradient}
                  >
                    <Feather name="user" size={20} color={COLORS.white} />
                  </LinearGradient>
                  {checkInStreak > 0 && <View style={styles.onlineBadge} />}
                </View>
              </Pressable>

              <View>
                <View style={styles.greetingRow}>
                  <Text style={styles.greetingText}>
                    {greeting.emoji} {greeting.text}
                  </Text>
                </View>
                <Text style={styles.userName}>{user?.name || "Admin"}</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.notificationBtn, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => navigation.navigate("Notifications" as never)}
              accessibilityLabel="Notificações"
              accessibilityRole="button"
            >
              <Feather name="bell" size={20} color={COLORS.gray500} />
            </Pressable>
          </Animated.View>

          {/* JOURNEY CAROUSEL SECTION */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(500)}
            style={styles.sectionContainer}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sua Jornada</Text>
              <Pressable
                onPress={() => navigation.navigate("MyCare" as never)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                accessibilityLabel="Ver todos os itens da jornada"
                accessibilityRole="button"
              >
                <Text style={styles.seeAllText}>VER TUDO</Text>
              </Pressable>
            </View>

            {/* Carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CAROUSEL_CARD_WIDTH + 16}
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={handleCarouselScroll}
              contentContainerStyle={styles.carouselContent}
            >
              {/* Chat Card - Rose Pink */}
              <JourneyCard
                icon="chatbubble-ellipses"
                iconColor={COLORS.rose400}
                gradientStart={brand.accent[100]}
                gradientEnd={brand.accent[50]}
                title="Conversar com NathIA"
                subtitle="Sua companheira sempre disponível"
                onPress={handleChat}
              />

              {/* Community Card - Orange */}
              <JourneyCard
                icon="people"
                iconColor={semantic.light.warning}
                gradientStart={maternal.warmth.peach}
                gradientEnd={maternal.warmth.honey}
                title="Mães Valente"
                subtitle="Conecte-se com outras mães"
                onPress={handleCommunity}
              />

              {/* Premium Card - Purple + NOVO Badge */}
              <JourneyCard
                icon="star"
                iconColor={brand.secondary[400]}
                gradientStart={brand.secondary[100]}
                gradientEnd={brand.secondary[50]}
                title="Mundo da Nath"
                subtitle="Conteúdos exclusivos premium"
                onPress={handlePremium}
                isNew
              />
            </ScrollView>

            {/* Carousel Indicators */}
            <View style={styles.indicators}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      width: carouselIndex === i ? 24 : 6,
                      backgroundColor: carouselIndex === i ? COLORS.rose400 : neutral[300],
                    },
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          {/* GRID SECTION */}
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.gridSection}>
            {/* Quote Card */}
            <QuoteCard />

            <View style={styles.gridContainer}>
              {/* Check-in Card - Rose */}
              <GridCard
                icon="heart"
                iconColor={COLORS.rose400}
                bgColor={brand.accent[100]}
                gradientStart={brand.accent[100]}
                gradientEnd={brand.accent[50]}
                title="Como você está?"
                subtitle="Registre hoje"
                onPress={handleMoodCheckIn}
                iconFamily="feather"
              />

              {/* Habits Card - Purple with SVG Progress */}
              <GridCard
                icon="check"
                iconColor={brand.secondary[400]}
                bgColor={brand.secondary[100]}
                gradientStart={brand.secondary[100]}
                gradientEnd={brand.secondary[50]}
                title="Hábitos"
                subtitle={`${completedHabits}/${totalHabits} completos`}
                onPress={handleHabits}
                showProgress
                iconFamily="feather"
              />

              {/* Daily Tip Card - Yellow */}
              <GridCard
                icon="lightbulb-on"
                iconColor={semantic.light.warning}
                bgColor={semantic.light.warningLight}
                gradientStart={semantic.light.warningLight}
                gradientEnd={maternal.warmth.cream}
                title="Dica do Dia"
                subtitle="Nova dica!"
                onPress={() => navigation.navigate("DailyTips" as never)}
                iconFamily="material"
              />

              {/* Calendar Card - Turquoise */}
              <GridCard
                icon="calendar-check"
                iconColor={brand.teal[400]}
                bgColor={brand.teal[100]}
                gradientStart={brand.teal[100]}
                gradientEnd={brand.teal[50]}
                title="Calendário"
                subtitle="2 eventos"
                onPress={() => navigation.navigate("Calendar" as never)}
                iconFamily="material"
              />
            </View>
          </Animated.View>

          {/* Spacer for bottom nav */}
          <View style={{ height: 100 }} />
        </AnimatedScrollView>
      </SafeAreaView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable
          style={({ pressed }) => [styles.navItem, { opacity: pressed ? 0.7 : 1 }]}
          onPress={() => navigation.navigate("Home")}
          accessibilityLabel="Home"
          accessibilityRole="button"
        >
          <Ionicons name="home" size={24} color={COLORS.rose500} />
          <Text style={[styles.navLabel, { color: COLORS.rose500, fontWeight: "600" }]}>Home</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navItem, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel="Grupo"
          accessibilityRole="button"
        >
          <Ionicons name="people-outline" size={24} color={COLORS.gray400} />
          <Text style={styles.navLabel}>Grupo</Text>
        </Pressable>

        {/* Center Floating Button */}
        <Pressable
          style={({ pressed }) => [styles.centerNavBtnContainer, { opacity: pressed ? 0.9 : 1 }]}
          onPress={handleChat}
          accessibilityLabel="Conversar com NathIA"
          accessibilityRole="button"
        >
          <View style={styles.centerNavBtn}>
            <Avatar
              size={AVATAR_SIZES.sm}
              source={userAvatar ? { uri: userAvatar } : undefined}
              fallbackIcon="sparkles"
              fallbackBgColor={COLORS.rose100}
              fallbackColor={COLORS.rose500}
            />
          </View>
          <Text style={styles.centerNavLabel}>NathIA</Text>
          <View style={styles.pulseDot} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navItem, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel="Favoritos"
          accessibilityRole="button"
        >
          <Ionicons name="heart-outline" size={24} color={COLORS.gray400} />
          <Text style={styles.navLabel}>Favoritos</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navItem, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel="Cuidados"
          accessibilityRole="button"
        >
          <Ionicons name="sparkles-outline" size={24} color={COLORS.gray400} />
          <Text style={styles.navLabel}>Cuidados</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.rose50,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Background Blobs
  blobTopRight: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: "rgba(254, 205, 211, 0.4)", // rose-200/40
  },
  blobMiddleLeft: {
    position: "absolute",
    top: "40%",
    left: -128,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(233, 213, 255, 0.3)", // purple-200/30
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: PADDING_H,
    paddingTop: 56,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.rose100,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    elevation: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  onlineBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    backgroundColor: COLORS.success,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  greetingText: {
    fontSize: 12,
    color: COLORS.gray500,
    fontWeight: "500",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.brandText,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },

  // SECTION HEADERS
  sectionContainer: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: PADDING_H,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.brandText,
  },
  seeAllText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.rose500,
    textTransform: "uppercase",
    letterSpacing: 2,
  },

  // CAROUSEL
  carouselContent: {
    paddingHorizontal: PADDING_H,
    paddingBottom: 16,
    gap: 16,
  },
  carouselCardWrapper: {
    marginRight: 0,
  },
  journeyCard: {
    width: CAROUSEL_CARD_WIDTH,
    height: CAROUSEL_CARD_HEIGHT,
    borderRadius: 32,
    padding: 24,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  newBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    zIndex: 10,
  },
  newBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  iconBox: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.brandText,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },

  // GRID SECTION
  gridSection: {
    paddingHorizontal: PADDING_H,
    marginTop: 24,
    gap: 12,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  quoteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  heartIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.rose100,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: COLORS.brandText,
  },
  authorText: {
    fontSize: 10,
    color: COLORS.gray400,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 8,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  gridCard: {
    width: (SCREEN_WIDTH - PADDING_H * 2 - 12) / 2,
    minHeight: GRID_CARD_HEIGHT,
    borderRadius: 24,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  miniIconBox: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    shadowColor: COLORS.shadowBase,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  progressCircleContainer: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    alignSelf: "flex-start",
  },
  absoluteCheck: {
    position: "absolute",
  },
  gridCardText: {
    gap: 2,
  },
  gridCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brandText,
    marginBottom: 2,
  },
  gridCardSubtitle: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  // BOTTOM NAVIGATION
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 228, 230, 0.5)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: PADDING_H,
    paddingBottom: 24,
    paddingTop: 12,
    height: 85,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.2,
    color: COLORS.gray400,
  },
  centerNavBtnContainer: {
    alignItems: "center",
    marginTop: -40,
  },
  centerNavBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    padding: 4,
    shadowColor: COLORS.rose100,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  centerNavLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.gray500,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  pulseDot: {
    position: "absolute",
    top: 0,
    right: 4,
    width: 12,
    height: 12,
    backgroundColor: COLORS.rose400,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});
