/**
 * HomeScreenNathia - Dashboard principal do app
 * Design inspirado no Nathia App
 *
 * Estrutura:
 * - Header com logo + avatar + notificações
 * - Saudação personalizada
 * - Banner destacado (Mundo da Nath)
 * - Grid de navegação rápida
 * - Últimas atualizações
 */

import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, Sparkles, Target, User, Users } from "lucide-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Body, Caption, NathAvatar, NathCard, Subtitle, Title } from "@/components/ui";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Navigation
import { MainTabScreenProps } from "@/types/navigation";

// Store
import { useAppStore } from "@/state";

// Utils
import { getGreeting } from "@/utils/greeting";

// Logo URL
const LOGO_URL =
  "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/536c9e80-8601-4c9c-80ad-f85c011a033a/1769082966051-d9ef612a/logo.png";

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
  text: { DEFAULT: Tokens.neutral[800], muted: Tokens.neutral[500] },
  border: Tokens.neutral[200],
};

// Gradients
const gradients = {
  rosaTOazul: [nathColors.rosa.DEFAULT, nathColors.azul.DEFAULT] as const,
};

type Props = MainTabScreenProps<"Home">;

export default function HomeScreenNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const user = useAppStore((s) => s.user);

  // Saudação memoizada
  const greeting = useMemo(() => getGreeting(), []);

  const quickNavItems = [
    {
      id: "maes",
      title: "Mães Valente",
      icon: Users,
      color: nathColors.azul.DEFAULT,
      bgColor: nathColors.azul.light,
      route: "Community" as const,
    },
    {
      id: "mundo",
      title: "Mundo da Nath",
      icon: Sparkles,
      color: nathColors.verde.dark,
      bgColor: nathColors.verde.light,
      route: "MundoNath" as const,
    },
    {
      id: "habitos",
      title: "Meus Hábitos",
      icon: Target,
      color: nathColors.laranja.dark,
      bgColor: nathColors.laranja.light,
      route: "MyCare" as const,
    },
    {
      id: "perfil",
      title: "Perfil",
      icon: User,
      color: nathColors.rosa.DEFAULT,
      bgColor: nathColors.rosa.light,
      route: "Profile" as const,
    },
  ];

  const updates = [
    {
      id: "1",
      name: "Maria",
      action: "comentou",
      preview: '"Adorei essa dica! Vou testar..."',
      time: "há 2h",
      gradient: [nathColors.azul.DEFAULT, nathColors.verde.DEFAULT] as const,
    },
    {
      id: "2",
      name: "Julia",
      action: "curtiu seu post",
      preview: '"Momento de autocuidado"',
      time: "há 5h",
      gradient: [nathColors.rosa.DEFAULT, nathColors.laranja.DEFAULT] as const,
    },
    {
      id: "3",
      name: "Nathia",
      action: "",
      preview: 'Novo artigo: "5 dicas para..."',
      time: "há 1d",
      gradient: [nathColors.verde.DEFAULT, nathColors.azul.DEFAULT] as const,
      isNathia: true,
    },
  ];

  const handleNavigation = async (route: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(route as never);
  };

  const userName = user?.name || "Mamãe";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={nathColors.cream} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: LOGO_URL }} style={styles.logo} contentFit="cover" />
          <Subtitle>Nossa Maternidade</Subtitle>
        </View>

        <View style={styles.headerRight}>
          <Pressable
            style={({ pressed }) => [styles.notificationBtn, { opacity: pressed ? 0.7 : 1 }]}
            onPress={() => handleNavigation("Notifications")}
            accessibilityLabel="Notificações"
            accessibilityRole="button"
          >
            <Bell size={22} color={nathColors.text.muted} />
            <View style={styles.notificationDot} />
          </Pressable>

          <Pressable
            onPress={() => handleNavigation("Profile")}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            accessibilityLabel="Ir para perfil"
            accessibilityRole="button"
          >
            <NathAvatar initials={userName[0]} size="sm" gradientColors={gradients.rosaTOazul} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Title>Olá, {userName.split(" ")[0]}!</Title>
          <Body color="muted" style={{ marginTop: 4 }}>
            {greeting.emoji} {greeting.text}. Como está sua jornada hoje?
          </Body>
        </View>

        {/* Featured Banner */}
        <Pressable style={styles.bannerContainer} onPress={() => handleNavigation("MundoNath")}>
          <LinearGradient
            colors={gradients.rosaTOazul}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <View style={styles.bannerDecor1} />
            <View style={styles.bannerDecor2} />

            <View style={styles.bannerContent}>
              <Subtitle style={{ color: nathColors.white }}>Novo Conteúdo da Nath</Subtitle>
              <Body style={{ color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
                Dica rápida de autocuidado
              </Body>

              <View style={styles.bannerButton}>
                <Body weight="bold" style={{ color: nathColors.rosa.DEFAULT }}>
                  Ver Agora
                </Body>
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Quick Navigation */}
        <View style={styles.section}>
          <Subtitle style={{ marginBottom: spacing.md }}>Navegação Rápida</Subtitle>

          <View style={styles.navGrid}>
            {quickNavItems.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.navCard, { opacity: pressed ? 0.8 : 1 }]}
                onPress={() => handleNavigation(item.route)}
                accessibilityLabel={`Ir para ${item.title}`}
                accessibilityRole="button"
              >
                <View style={[styles.navIconContainer, { backgroundColor: item.bgColor }]}>
                  <item.icon size={24} color={item.color} />
                </View>
                <Caption weight="bold" style={{ marginTop: 8, color: nathColors.text.DEFAULT }}>
                  {item.title}
                </Caption>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Latest Updates */}
        <View style={styles.section}>
          <Subtitle style={{ marginBottom: spacing.md }}>Últimas Atualizações</Subtitle>

          <NathCard variant="outlined" padding="xs">
            {updates.map((update, index) => (
              <React.Fragment key={update.id}>
                <Pressable
                  style={({ pressed }) => [styles.updateItem, { opacity: pressed ? 0.7 : 1 }]}
                  accessibilityLabel={`Atualização de ${update.name}`}
                  accessibilityRole="button"
                >
                  <NathAvatar
                    initials={update.isNathia ? undefined : update.name[0]}
                    source={update.isNathia ? LOGO_URL : undefined}
                    size="md"
                    gradientColors={update.gradient}
                  />

                  <View style={styles.updateContent}>
                    <Body weight="medium" numberOfLines={1}>
                      {update.name} {update.action}
                    </Body>
                    <Caption numberOfLines={1}>{update.preview}</Caption>
                  </View>

                  <Caption>{update.time}</Caption>
                </Pressable>

                {index < updates.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </NathCard>
        </View>

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
    backgroundColor: nathColors.white,
    borderBottomWidth: 1,
    borderBottomColor: nathColors.border,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  logo: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  notificationBtn: {
    position: "relative",
    padding: spacing.xs,
  },

  notificationDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: nathColors.rosa.DEFAULT,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.xl,
  },

  greetingSection: {
    paddingVertical: spacing.xl,
    backgroundColor: nathColors.cream,
  },

  bannerContainer: {
    marginBottom: spacing.xl,
  },

  banner: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    height: 140,
    overflow: "hidden",
    position: "relative",
  },

  bannerDecor1: {
    position: "absolute",
    top: -32,
    right: -32,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  bannerDecor2: {
    position: "absolute",
    bottom: -16,
    right: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  bannerContent: {
    position: "relative",
    zIndex: 1,
  },

  bannerButton: {
    marginTop: spacing.lg,
    backgroundColor: nathColors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignSelf: "flex-start",
  },

  section: {
    marginBottom: spacing.xl,
  },

  navGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },

  navCard: {
    width: "47%",
    backgroundColor: nathColors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    ...shadows.md,
  },

  navIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },

  updateItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },

  updateContent: {
    flex: 1,
    minWidth: 0,
  },

  divider: {
    height: 1,
    backgroundColor: nathColors.border,
    marginHorizontal: spacing.lg,
  },
});
