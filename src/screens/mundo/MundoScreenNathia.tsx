/**
 * MundoScreenNathia - Mundo da Nath
 *
 * Personal editorial feed by Nathalia - curated content,
 * daily messages, community highlights, and insights.
 * Premium design matching HomeScreen standard.
 *
 * @version 2.0 - Premium Redesign Feb 2026
 */

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  BookOpen,
  Heart,
  MessageCircle,
  Quote,
  Send,
  Share2,
  Sparkles,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { brand, maternal, neutral, Tokens, typography, spacing, radius } from "@/theme/tokens";
import { MainTabScreenProps } from "@/types/navigation";
import { staggeredFadeUp } from "@/utils/animations";
import { getGreeting } from "@/utils/greeting";
import { shadowPresets } from "@/utils/shadow";

const LOGO_URL =
  "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/536c9e80-8601-4c9c-80ad-f85c011a033a/1769082966051-d9ef612a/logo.png";

const nathWorldMomImage = require("../../../assets/images/nath-world-mom.png");

type Props = MainTabScreenProps<"MundoNath">;

export default function MundoScreenNathia(_props: Props) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { isDark, colors, text } = useTheme();

  const textMain = text.primary;
  const textSecondary = text.secondary;
  const greeting = useMemo(() => getGreeting(), []);

  const gradientColors: readonly [string, string, string] = isDark
    ? [neutral[900], neutral[800], neutral[900]]
    : [maternal.warmth.blush, maternal.warmth.cream, brand.primary[50]];

  return (
    <LinearGradient colors={gradientColors} style={styles.container} locations={[0, 0.3, 1]}>
      {/* Header */}
      <Animated.View entering={staggeredFadeUp(0)}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={[brand.accent[400], brand.primary[400], brand.secondary[400]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <View style={[styles.avatarInner, { backgroundColor: colors.background.card }]}>
                <Image source={{ uri: LOGO_URL }} style={styles.avatar} contentFit="cover" />
              </View>
            </LinearGradient>
            <View>
              <Text
                style={[
                  styles.headerTitle,
                  { color: textMain, fontFamily: typography.fontFamily.bold },
                ]}
              >
                Mundo da Nath
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: textSecondary, fontFamily: typography.fontFamily.base },
                ]}
              >
                Conteúdo exclusivo
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.bellButton,
              {
                backgroundColor: colors.background.card,
                ...shadowPresets.sm,
              },
              pressed && { opacity: 0.7 },
            ]}
            accessibilityLabel="Notificações"
            accessibilityRole="button"
          >
            <Bell size={20} color={textSecondary} strokeWidth={2} />
          </Pressable>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + spacing["3xl"] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <Animated.View entering={staggeredFadeUp(1)}>
          <LinearGradient
            colors={
              isDark
                ? [colors.primary[800], colors.primary[900]]
                : [maternal.warmth.blush, maternal.calm.lavender]
            }
            style={[styles.welcomeCard, shadowPresets.md]}
          >
            <View style={styles.welcomeRow}>
              <View style={styles.welcomeContent}>
                <View
                  style={[
                    styles.welcomeBadge,
                    {
                      backgroundColor: isDark ? Tokens.glass.dark.medium : Tokens.glass.light.soft,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.welcomeBadgeText,
                      {
                        color: isDark ? neutral[200] : neutral[600],
                        fontFamily: typography.fontFamily.semibold,
                      },
                    ]}
                  >
                    {greeting.text}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.welcomeTitle,
                    {
                      color: isDark ? neutral[100] : neutral[800],
                      fontFamily: typography.fontFamily.bold,
                    },
                  ]}
                >
                  Vamos focar em nós hoje?
                </Text>

                <Text
                  style={[
                    styles.welcomeBody,
                    {
                      color: isDark ? neutral[300] : neutral[600],
                      fontFamily: typography.fontFamily.base,
                    },
                  ]}
                >
                  A louça pode esperar, mas o meu café quentinho não!
                </Text>
              </View>
              <Image
                source={nathWorldMomImage}
                style={styles.welcomeImage}
                contentFit="contain"
                transition={300}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Photo Post */}
        <Animated.View entering={staggeredFadeUp(2)}>
          <View
            style={[
              styles.postCard,
              { backgroundColor: colors.background.card, ...shadowPresets.sm },
            ]}
          >
            <View style={styles.postHeader}>
              <View style={styles.postAuthor}>
                <Image
                  source={{ uri: LOGO_URL }}
                  style={[
                    styles.postAvatar,
                    { backgroundColor: isDark ? colors.primary[800] : brand.accent[100] },
                  ]}
                  contentFit="cover"
                />
                <View>
                  <Text
                    style={[
                      styles.postAuthorName,
                      { color: textMain, fontFamily: typography.fontFamily.semibold },
                    ]}
                  >
                    Nathalia
                  </Text>
                  <Text
                    style={[
                      styles.postTime,
                      { color: textSecondary, fontFamily: typography.fontFamily.base },
                    ]}
                  >
                    Há 2 horas - Rotina da Manhã
                  </Text>
                </View>
              </View>
              <Pressable
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                accessibilityLabel="Compartilhar"
                accessibilityRole="button"
              >
                <Send size={18} color={textSecondary} strokeWidth={2} />
              </Pressable>
            </View>

            <View style={styles.postImageContainer}>
              <LinearGradient
                colors={
                  isDark
                    ? [brand.accent[800], brand.primary[800]]
                    : [brand.accent[200], brand.primary[200]]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.imagePlaceholder}
              >
                <Text
                  style={[
                    styles.imagePlaceholderText,
                    {
                      color: isDark ? neutral[300] : neutral[0],
                      fontFamily: typography.fontFamily.base,
                    },
                  ]}
                >
                  Imagem do momento
                </Text>
              </LinearGradient>
            </View>

            <Text
              style={[
                styles.postCaption,
                { color: textMain, fontFamily: typography.fontFamily.base },
              ]}
            >
              O segredo não é ter tempo, é{" "}
              <Text style={{ color: brand.accent[500], fontFamily: typography.fontFamily.bold }}>
                criar tempo
              </Text>
              . Esses 15 minutos salvam meu dia inteiro. Tente hoje!
            </Text>

            <View
              style={[styles.postActions, { borderTopColor: isDark ? neutral[700] : neutral[200] }]}
            >
              <Pressable
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
                accessibilityLabel="Curtir post"
                accessibilityRole="button"
              >
                <Heart size={20} color={textSecondary} strokeWidth={2} />
                <Text
                  style={[
                    styles.actionText,
                    { color: textSecondary, fontFamily: typography.fontFamily.base },
                  ]}
                >
                  2.4k
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
                accessibilityLabel="Comentar post"
                accessibilityRole="button"
              >
                <MessageCircle size={20} color={textSecondary} strokeWidth={2} />
                <Text
                  style={[
                    styles.actionText,
                    { color: textSecondary, fontFamily: typography.fontFamily.base },
                  ]}
                >
                  342
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.shareButton, { opacity: pressed ? 0.7 : 1 }]}
                accessibilityLabel="Compartilhar post"
                accessibilityRole="button"
              >
                <Send size={20} color={textSecondary} strokeWidth={2} />
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Community Highlight */}
        <Animated.View entering={staggeredFadeUp(3)}>
          <View
            style={[
              styles.highlightCard,
              {
                backgroundColor: colors.background.card,
                borderColor: isDark ? colors.primary[700] : brand.primary[100],
                ...shadowPresets.sm,
              },
            ]}
          >
            <View
              style={[
                styles.highlightHeader,
                {
                  backgroundColor: isDark ? `${brand.primary[500]}15` : `${brand.primary[500]}10`,
                },
              ]}
            >
              <Sparkles size={14} color={colors.primary[500]} strokeWidth={2} />
              <Text
                style={[
                  styles.highlightLabel,
                  { color: colors.primary[500], fontFamily: typography.fontFamily.bold },
                ]}
              >
                DESTAQUE DA COMUNIDADE
              </Text>
            </View>

            <View style={styles.highlightBody}>
              <View style={styles.communityAuthor}>
                <View
                  style={[
                    styles.communityAvatar,
                    { backgroundColor: isDark ? colors.primary[800] : colors.primary[50] },
                  ]}
                >
                  <Text
                    style={[
                      styles.communityAvatarText,
                      { color: colors.primary[500], fontFamily: typography.fontFamily.bold },
                    ]}
                  >
                    MJ
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.communityAuthorName,
                      { color: textMain, fontFamily: typography.fontFamily.semibold },
                    ]}
                  >
                    Maria Julia
                  </Text>
                  <Text
                    style={[
                      styles.communityAuthorMeta,
                      { color: textSecondary, fontFamily: typography.fontFamily.base },
                    ]}
                  >
                    Mãe de 2 - Postado ontem
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.quote,
                  { borderLeftColor: isDark ? colors.primary[600] : brand.primary[200] },
                ]}
              >
                <Text
                  style={[
                    styles.quoteText,
                    {
                      color: isDark ? neutral[300] : neutral[600],
                      fontFamily: typography.fontFamily.base,
                    },
                  ]}
                >
                  &quot;Depois de 3 semanas seguindo a dica da Nath sobre o &apos;banho da paz&apos;
                  antes de dormir, meu bebê finalmente dormiu a noite toda!&quot;
                </Text>
              </View>

              <View
                style={[
                  styles.nathResponse,
                  { backgroundColor: isDark ? neutral[800] : maternal.warmth.cream },
                ]}
              >
                <Image
                  source={{ uri: LOGO_URL }}
                  style={styles.nathResponseAvatar}
                  contentFit="cover"
                />
                <View style={styles.nathResponseContent}>
                  <Text
                    style={[
                      styles.nathResponseName,
                      { color: textMain, fontFamily: typography.fontFamily.semibold },
                    ]}
                  >
                    Nathalia respondeu:
                  </Text>
                  <Text
                    style={[
                      styles.nathResponseText,
                      { color: textSecondary, fontFamily: typography.fontFamily.base },
                    ]}
                  >
                    Que emoção, Ju! O descanso da mãe muda a casa toda. Orgulho de você por
                    persistir!
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Insight Card */}
        <Animated.View entering={staggeredFadeUp(4)}>
          <LinearGradient
            colors={[neutral[800], neutral[900]]}
            style={[styles.insightCard, shadowPresets.lg]}
          >
            <View style={styles.insightDecor}>
              <Quote size={80} color={Tokens.accent.dark.whiteStrong} strokeWidth={1} />
            </View>

            <View style={styles.insightMeta}>
              <View style={styles.insightBadge}>
                <Text style={[styles.insightBadgeText, { fontFamily: typography.fontFamily.bold }]}>
                  INSIGHT
                </Text>
              </View>
              <Text
                style={[
                  styles.insightReadTime,
                  { color: Tokens.glass.dark.text60, fontFamily: typography.fontFamily.base },
                ]}
              >
                Leitura de 1 min
              </Text>
            </View>

            <Text
              style={[
                styles.insightTitle,
                { color: neutral[0], fontFamily: typography.fontFamily.bold },
              ]}
            >
              Maternidade não é sobre ser perfeita. É sobre ser presente.
            </Text>

            <Text
              style={[
                styles.insightBody,
                { color: Tokens.glass.dark.text80, fontFamily: typography.fontFamily.base },
              ]}
            >
              Sempre que você sentir que &quot;falhou&quot; hoje, lembre-se: seu filho não quer uma
              mãe de comercial de margarina. Ele quer você.
            </Text>

            <View style={styles.insightActions}>
              <Pressable
                style={({ pressed }) => [styles.insightButton, { opacity: pressed ? 0.7 : 1 }]}
                accessibilityLabel="Ler reflexão completa"
                accessibilityRole="button"
              >
                <BookOpen size={16} color={Tokens.glass.dark.text90} strokeWidth={2} />
                <Text
                  style={[
                    styles.insightButtonText,
                    {
                      color: Tokens.glass.dark.text90,
                      fontFamily: typography.fontFamily.semibold,
                    },
                  ]}
                >
                  Ler reflexão completa
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.insightShareButton, { opacity: pressed ? 0.7 : 1 }]}
                accessibilityLabel="Compartilhar insight"
                accessibilityRole="button"
              >
                <Share2 size={16} color={neutral[0]} strokeWidth={2} />
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },

  headerTitle: {
    fontSize: typography.titleMedium.fontSize,
  },

  headerSubtitle: {
    fontSize: typography.caption.fontSize,
    marginTop: 1,
  },

  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // Scroll
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.xl,
  },

  // Welcome Card
  welcomeCard: {
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    overflow: "hidden",
  },

  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  welcomeContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  welcomeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },

  welcomeBadgeText: {
    fontSize: typography.caption.fontSize,
  },

  welcomeTitle: {
    fontSize: typography.titleMedium.fontSize,
    marginBottom: spacing.sm,
  },

  welcomeBody: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 22,
  },

  welcomeImage: {
    width: 100,
    height: 120,
  },

  // Post Card
  postCard: {
    borderRadius: radius["2xl"],
    padding: spacing.xl,
  },

  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },

  postAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  postAuthorName: {
    fontSize: typography.bodyMedium.fontSize,
  },

  postTime: {
    fontSize: typography.caption.fontSize,
    marginTop: 1,
  },

  postImageContainer: {
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
  },

  imagePlaceholder: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },

  imagePlaceholderText: {
    fontSize: typography.bodySmall.fontSize,
  },

  postCaption: {
    fontSize: typography.bodyMedium.fontSize,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },

  postActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: spacing.lg,
  },

  actionText: {
    fontSize: typography.caption.fontSize,
  },

  shareButton: {
    marginLeft: "auto",
  },

  // Highlight Card
  highlightCard: {
    borderRadius: radius["2xl"],
    overflow: "hidden",
    borderWidth: 1,
  },

  highlightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },

  highlightLabel: {
    fontSize: typography.caption.fontSize,
    letterSpacing: 1,
  },

  highlightBody: {
    padding: spacing.xl,
  },

  communityAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  communityAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  communityAvatarText: {
    fontSize: typography.caption.fontSize,
  },

  communityAuthorName: {
    fontSize: typography.bodySmall.fontSize,
  },

  communityAuthorMeta: {
    fontSize: 11,
    marginTop: 1,
  },

  quote: {
    borderLeftWidth: 2,
    paddingLeft: spacing.md,
    marginBottom: spacing.lg,
  },

  quoteText: {
    fontSize: typography.bodySmall.fontSize,
    fontStyle: "italic",
    lineHeight: 22,
  },

  nathResponse: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
  },

  nathResponseAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  nathResponseContent: {
    flex: 1,
  },

  nathResponseName: {
    fontSize: typography.caption.fontSize,
    marginBottom: 2,
  },

  nathResponseText: {
    fontSize: typography.caption.fontSize,
    lineHeight: 18,
  },

  // Insight Card
  insightCard: {
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    position: "relative",
    overflow: "hidden",
  },

  insightDecor: {
    position: "absolute",
    top: -20,
    right: -10,
  },

  insightMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  insightBadge: {
    backgroundColor: Tokens.premium.glass.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },

  insightBadgeText: {
    fontSize: 10,
    color: Tokens.glass.dark.text90,
    letterSpacing: 1,
  },

  insightReadTime: {
    fontSize: typography.caption.fontSize,
  },

  insightTitle: {
    fontSize: typography.titleMedium.fontSize,
    lineHeight: 26,
    marginBottom: spacing.md,
  },

  insightBody: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },

  insightActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  insightButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  insightButtonText: {
    fontSize: typography.bodySmall.fontSize,
  },

  insightShareButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Tokens.accent.dark.whiteStrong,
    alignItems: "center",
    justifyContent: "center",
  },
});
