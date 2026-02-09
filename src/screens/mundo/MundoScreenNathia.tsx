/**
 * MundoScreenNathia - Mundo da Nath (Feed de conteúdo)
 * Design inspirado no Nathia App - mundo.tsx
 *
 * Estrutura:
 * - Header com avatar + status ao vivo
 * - Welcome card com mensagem do dia
 * - Feed de posts (foto, destaque da comunidade, insight)
 */

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
  Star,
} from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Body, Caption, NathAvatar, NathBadge, NathCard, Subtitle, Title } from "@/components/ui";
import { CloseFriendsSection } from "@/components/mundo/CloseFriendsSection";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Navigation
import { MainTabScreenProps } from "@/types/navigation";

// Logo URL
const LOGO_URL =
  "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/536c9e80-8601-4c9c-80ad-f85c011a033a/1769082966051-d9ef612a/logo.png";

// Hero Image
const nathWorldMomImage = require("../../../assets/images/nath-world-mom.png");

// Cores do design Nathia
const nathColors = {
  rosa: { DEFAULT: Tokens.brand.accent[300], light: Tokens.brand.accent[100] },
  azul: {
    DEFAULT: Tokens.brand.primary[200],
    light: Tokens.brand.primary[50],
    dark: Tokens.brand.primary[300],
  },
  verde: {
    DEFAULT: Tokens.brand.teal[200],
    light: Tokens.brand.teal[50],
    dark: Tokens.brand.teal[300],
  },
  laranja: {
    DEFAULT: Tokens.maternal.warmth.peach,
    light: Tokens.maternal.warmth.honey,
    dark: Tokens.brand.accent[300],
  },
  cream: Tokens.maternal.warmth.cream,
  white: Tokens.neutral[0],
  text: {
    DEFAULT: Tokens.neutral[800],
    muted: Tokens.neutral[500],
    light: Tokens.neutral[600],
  },
  border: Tokens.neutral[200],
  input: Tokens.neutral[50],
};

// Gradients
const gradients = {
  rosaTOazul: [nathColors.rosa.DEFAULT, nathColors.azul.DEFAULT] as const,
};

type Props = MainTabScreenProps<"MundoNath">;

export default function MundoScreenNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const handleUpgradeToPremium = () => {
    const rootNav = navigation.getParent();
    if (rootNav) {
      rootNav.navigate("Paywall", { source: "close_friends" });
    }
  };

  const handleViewExclusiveContent = () => {
    const rootNav = navigation.getParent();
    if (rootNav) {
      rootNav.navigate("ComingSoon", {
        title: "Close Friends",
        description: "Conteúdo exclusivo da Nath para assinantes premium. Em breve você terá acesso a diários, mensagens especiais e lives privadas!",
        emoji: "💜",
        primaryCtaLabel: "Voltar",
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarRing}>
            <Image source={{ uri: LOGO_URL }} style={styles.avatar} contentFit="cover" />
            <View style={styles.statusBadge}>
              <Star size={8} color={nathColors.white} fill={nathColors.white} />
            </View>
          </View>
          <View>
            <Title style={{ fontSize: 18 }}>Mundo da Nath</Title>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Caption style={{ color: nathColors.rosa.DEFAULT }} weight="medium">
                Ao vivo agora
              </Caption>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.bellButton, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel="Notificações"
          accessibilityRole="button"
        >
          <Bell size={22} color={nathColors.text.DEFAULT} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Close Friends Section */}
        <CloseFriendsSection 
          onUpgrade={handleUpgradeToPremium}
          onViewContent={handleViewExclusiveContent}
        />

        {/* Welcome Card */}
        <LinearGradient
          colors={[Tokens.maternal.warmth.blush, Tokens.maternal.calm.lavender]}
          style={styles.welcomeCard}
        >
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeContent}>
              <View style={styles.welcomeHeader}>
                <NathBadge variant="muted" style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
                  🌞 Bom dia
                </NathBadge>
                <Caption>8:30 AM</Caption>
              </View>

              <Subtitle style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
                Vamos focar em nós hoje?
              </Subtitle>

              <Body style={{ color: nathColors.text.light, lineHeight: 22 }}>
                A louça pode esperar, mas o meu café quentinho não! ☕️
              </Body>
            </View>
            <Image
              source={nathWorldMomImage}
              style={styles.welcomeImage}
              contentFit="contain"
              transition={300}
            />
          </View>
        </LinearGradient>

        {/* Post 1: Photo Post */}
        <NathCard variant="outlined" style={styles.postCard} padding="md">
          <View style={styles.postHeader}>
            <View style={styles.postAuthor}>
              <Image source={{ uri: LOGO_URL }} style={styles.postAvatar} contentFit="cover" />
              <View>
                <Body weight="bold">Nathália</Body>
                <Caption>Há 2 horas • Rotina da Manhã</Caption>
              </View>
            </View>
            <Pressable
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              accessibilityLabel="Compartilhar"
              accessibilityRole="button"
            >
              <Send size={18} color={nathColors.text.muted} />
            </Pressable>
          </View>

          <View style={styles.postImagePlaceholder}>
            <LinearGradient colors={gradients.rosaTOazul} style={styles.imagePlaceholder}>
              <Caption style={{ color: nathColors.white }}>📸 Imagem do momento</Caption>
            </LinearGradient>
          </View>

          <Body style={styles.postCaption}>
            O segredo não é ter tempo, é{" "}
            <Body weight="bold" style={{ color: nathColors.rosa.DEFAULT }}>
              criar tempo
            </Body>
            . Esses 15 minutos salvam meu dia inteiro. Tente hoje! 💖
          </Body>

          <View style={styles.postActions}>
            <Pressable
              style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
              accessibilityLabel="Curtir post"
              accessibilityRole="button"
            >
              <Heart size={20} color={nathColors.text.muted} />
              <Caption>2.4k</Caption>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
              accessibilityLabel="Comentar post"
              accessibilityRole="button"
            >
              <MessageCircle size={20} color={nathColors.text.muted} />
              <Caption>342</Caption>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.shareButton, { opacity: pressed ? 0.7 : 1 }]}
              accessibilityLabel="Compartilhar post"
              accessibilityRole="button"
            >
              <Send size={20} color={nathColors.text.muted} />
            </Pressable>
          </View>
        </NathCard>

        {/* Post 2: Community Highlight */}
        <NathCard
          variant="outlined"
          style={[styles.postCard, { borderColor: nathColors.azul.light }]}
          padding="none"
        >
          <View style={styles.highlightHeader}>
            <Sparkles size={14} color={nathColors.azul.DEFAULT} />
            <Caption weight="bold" style={{ color: nathColors.azul.DEFAULT, letterSpacing: 1 }}>
              DESTAQUE DA COMUNIDADE
            </Caption>
          </View>

          <View style={{ padding: spacing.lg }}>
            <View style={styles.communityAuthor}>
              <NathAvatar
                initials="MJ"
                size="sm"
                gradientColors={[nathColors.input, nathColors.border]}
              />
              <View>
                <Caption weight="bold">Maria Júlia</Caption>
                <Caption style={{ fontSize: 10 }}>Mãe de 2 • Postado ontem</Caption>
              </View>
            </View>

            <View style={styles.quote}>
              <Body style={{ fontStyle: "italic", color: nathColors.text.light }}>
                &quot;Depois de 3 semanas seguindo a dica da Nath sobre o &apos;banho da paz&apos;
                antes de dormir, meu bebê finalmente dormiu a noite toda! 😭🙌&quot;
              </Body>
            </View>

            <View style={styles.nathResponse}>
              <Image
                source={{ uri: LOGO_URL }}
                style={styles.nathResponseAvatar}
                contentFit="cover"
              />
              <View style={styles.nathResponseContent}>
                <Caption weight="bold">Nathália respondeu:</Caption>
                <Caption style={{ lineHeight: 18 }}>
                  Que emoção, Ju! 🎉 O descanso da mãe muda a casa toda. Orgulho de você por
                  persistir!
                </Caption>
              </View>
            </View>
          </View>
        </NathCard>

        {/* Post 3: Insight Card */}
        <LinearGradient
          colors={[Tokens.neutral[800], Tokens.neutral[900]]}
          style={styles.insightCard}
        >
          <View style={styles.insightDecor}>
            <Quote size={80} color="rgba(255,255,255,0.1)" />
          </View>

          <View style={styles.insightMeta}>
            <NathBadge variant="muted" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
              INSIGHT
            </NathBadge>
            <Caption style={{ color: "rgba(255,255,255,0.6)" }}>Leitura de 1 min</Caption>
          </View>

          <Subtitle style={{ color: nathColors.white, marginBottom: spacing.md }}>
            Maternidade não é sobre ser perfeita. É sobre ser presente.
          </Subtitle>

          <Body
            style={{ color: "rgba(255,255,255,0.8)", lineHeight: 22, marginBottom: spacing.lg }}
          >
            Sempre que você sentir que &quot;falhou&quot; hoje, lembre-se: seu filho não quer uma
            mãe de comercial de margarina. Ele quer você.
          </Body>

          <View style={styles.insightActions}>
            <Pressable
              style={({ pressed }) => [styles.insightButton, { opacity: pressed ? 0.7 : 1 }]}
              accessibilityLabel="Ler reflexão completa"
              accessibilityRole="button"
            >
              <BookOpen size={16} color="rgba(255,255,255,0.9)" />
              <Caption style={{ color: "rgba(255,255,255,0.9)" }} weight="medium">
                Ler reflexão completa
              </Caption>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.insightShareButton, { opacity: pressed ? 0.7 : 1 }]}
              accessibilityLabel="Compartilhar insight"
              accessibilityRole="button"
            >
              <Share2 size={16} color={nathColors.white} />
            </Pressable>
          </View>
        </LinearGradient>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nathColors.cream,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderBottomWidth: 1,
    borderBottomColor: nathColors.border + "80",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  avatarRing: {
    padding: 2,
    borderRadius: radius.full,
    position: "relative",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: nathColors.white,
  },

  statusBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: nathColors.verde.dark,
    borderWidth: 2,
    borderColor: nathColors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: nathColors.rosa.DEFAULT,
  },

  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: spacing.xl,
  },

  welcomeCard: {
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    marginBottom: spacing.xl,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: nathColors.rosa.light + "40",
  },

  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  welcomeContent: {
    flex: 1,
    position: "relative",
    zIndex: 1,
    paddingRight: spacing.sm,
  },

  welcomeImage: {
    width: 100,
    height: 120,
  },

  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  postCard: {
    marginBottom: spacing.xl,
  },

  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
    marginBottom: spacing.md,
  },

  postAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: nathColors.rosa.light,
  },

  postImagePlaceholder: {
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: spacing.md,
  },

  imagePlaceholder: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },

  postCaption: {
    lineHeight: 22,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },

  postActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: nathColors.border,
    marginHorizontal: spacing.xs,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: spacing.lg,
  },

  shareButton: {
    marginLeft: "auto",
  },

  highlightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: nathColors.azul.light + "30",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },

  communityAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  quote: {
    borderLeftWidth: 2,
    borderLeftColor: nathColors.azul.light,
    paddingLeft: spacing.md,
    marginBottom: spacing.lg,
  },

  nathResponse: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: nathColors.cream,
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

  insightCard: {
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    position: "relative",
    overflow: "hidden",
    ...shadows.lg,
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

  insightShareButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
