/**
 * Nossa Maternidade - RestSoundsScreen
 * Flo Health Minimal Design - Relaxation sounds categorized by nature, meditation, and sleep
 *
 * Design Principles:
 * - Subtle gradient backgrounds (dark theme for relaxation)
 * - Clean, minimal UI elements
 * - Soft shadows (shadows.flo.soft)
 * - Dark mode support
 * - Manrope typography
 *
 * Uses expo-audio for audio playback (migrated from expo-av)
 */

import { useTheme } from "@/hooks/useTheme";
import { shadows, spacing, Tokens, typography } from "@/theme/tokens";
import { logger } from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SoundCategory = "nature" | "meditation" | "sleep";

interface SoundItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: SoundCategory;
  audioUri?: string;
}

const SOUNDS: SoundItem[] = [
  // Nature Sounds
  {
    id: "rain",
    title: "Chuva Suave",
    subtitle: "Som relaxante de chuva",
    duration: "30 min",
    icon: "rainy",
    color: Tokens.brand.primary[400],
    category: "nature",
  },
  {
    id: "ocean",
    title: "Ondas do Mar",
    subtitle: "Paz do oceano",
    duration: "45 min",
    icon: "water",
    color: Tokens.brand.accent[400],
    category: "nature",
  },
  {
    id: "forest",
    title: "Floresta",
    subtitle: "Passaros e natureza",
    duration: "40 min",
    icon: "leaf",
    color: Tokens.semantic.light.success,
    category: "nature",
  },
  {
    id: "fire",
    title: "Lareira",
    subtitle: "Crepitar do fogo",
    duration: "60 min",
    icon: "flame",
    color: Tokens.semantic.light.warning,
    category: "nature",
  },
  // Meditation
  {
    id: "breathe",
    title: "Respiracao Guiada",
    subtitle: "Para maes",
    duration: "10 min",
    icon: "heart",
    color: Tokens.brand.accent[500],
    category: "meditation",
  },
  {
    id: "body-scan",
    title: "Relaxamento Corporal",
    subtitle: "Meditacao guiada",
    duration: "15 min",
    icon: "body",
    color: Tokens.brand.secondary[500],
    category: "meditation",
  },
  {
    id: "loving-kindness",
    title: "Amor Proprio",
    subtitle: "Meditacao de bondade",
    duration: "12 min",
    icon: "sparkles",
    color: Tokens.brand.primary[500],
    category: "meditation",
  },
  // Sleep
  {
    id: "lullaby",
    title: "Cancao de Ninar",
    subtitle: "Para voce e seu bebe",
    duration: "20 min",
    icon: "musical-notes",
    color: Tokens.brand.secondary[400],
    category: "sleep",
  },
  {
    id: "sleep-story",
    title: "Historia para Dormir",
    subtitle: "Narracao tranquila",
    duration: "25 min",
    icon: "book",
    color: Tokens.brand.accent[400],
    category: "sleep",
  },
  {
    id: "white-noise",
    title: "Ruido Branco",
    subtitle: "Som continuo suave",
    duration: "60 min",
    icon: "radio",
    color: Tokens.neutral[400],
    category: "sleep",
  },
];

const CATEGORIES = [
  {
    id: "nature" as SoundCategory,
    name: "Natureza",
    icon: "leaf" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "meditation" as SoundCategory,
    name: "Meditacao",
    icon: "heart" as keyof typeof Ionicons.glyphMap,
  },
  {
    id: "sleep" as SoundCategory,
    name: "Sono",
    icon: "moon" as keyof typeof Ionicons.glyphMap,
  },
];

export default function RestSoundsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory>("nature");
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [loadingSound, setLoadingSound] = useState<string | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);

  // Flo Clean color tokens - Dark theme for relaxation
  const textPrimary = Tokens.neutral[50];
  const textSecondary = Tokens.neutral[400];
  const textMuted = Tokens.neutral[500];
  const cardBg = "rgba(255,255,255,0.06)";
  const cardBgActive = (color: string) => `${color}15`;
  const glassBg = "rgba(255,255,255,0.08)";
  const tabBg = "rgba(255,255,255,0.06)";
  const tabActive = "rgba(255,255,255,0.15)";

  // Dark gradient for relaxation screen
  const restGradient = isDark
    ? ([Tokens.neutral[950], Tokens.neutral[900], Tokens.neutral[950]] as const)
    : ([Tokens.neutral[900], Tokens.neutral[800], Tokens.neutral[900]] as const);

  const filteredSounds = useMemo(
    () => SOUNDS.filter((s) => s.category === selectedCategory),
    [selectedCategory]
  );

  const handleCategoryChange = (category: SoundCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
    logger.info("Category changed", "RestSoundsScreen", { category });
  };

  const handlePlaySound = async (soundId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const soundItem = SOUNDS.find((s) => s.id === soundId);

    // Stop currently playing sound
    if (playerRef.current) {
      try {
        playerRef.current.pause();
        playerRef.current.release();
        logger.info("Sound stopped", "RestSoundsScreen", { soundId: playingSound });
      } catch {
        // Ignore cleanup errors
      }
      playerRef.current = null;
    }

    if (playingSound === soundId) {
      // Stop if same sound
      setPlayingSound(null);
      setLoadingSound(null);
      return;
    }

    // Simulate loading state
    setLoadingSound(soundId);
    logger.info("Sound loading", "RestSoundsScreen", { soundId, title: soundItem?.title });

    // In production, load and play the actual audio file
    // For now, just simulate playing with a brief delay
    setTimeout(() => {
      setLoadingSound(null);
      setPlayingSound(soundId);
      logger.info("Sound playing", "RestSoundsScreen", { soundId, title: soundItem?.title });
    }, 500);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (playerRef.current) {
      try {
        playerRef.current.pause();
        playerRef.current.release();
      } catch {
        // Ignore cleanup errors
      }
      playerRef.current = null;
    }
    navigation.goBack();
  };

  return (
    <LinearGradient colors={restGradient} style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: spacing.lg,
          paddingHorizontal: spacing.xl,
        }}
      >
        {/* Top Bar */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: spacing.xl,
          }}
        >
          <Pressable
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar tela de descanso"
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 22,
              backgroundColor: glassBg,
              ...shadows.flo.minimal,
            }}
          >
            <Ionicons name="close" size={24} color={textPrimary} />
          </Pressable>
          <Text
            style={{
              color: textPrimary,
              fontSize: typography.titleLarge.fontSize,
              fontFamily: typography.fontFamily.bold,
              fontWeight: "700",
              letterSpacing: -0.5,
            }}
          >
            Descanso
          </Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* Info Card - Flo Clean */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(400)}
          style={{
            backgroundColor: glassBg,
            borderRadius: Tokens.radius["2xl"],
            padding: spacing.lg,
            marginBottom: spacing.xl,
            ...shadows.flo.soft,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                backgroundColor: `${Tokens.brand.secondary[400]}25`,
                borderRadius: Tokens.radius.full,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                marginRight: spacing.md,
              }}
            >
              <Ionicons name="moon" size={20} color={Tokens.brand.secondary[400]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: textPrimary,
                  fontSize: typography.titleSmall.fontSize,
                  fontFamily: typography.fontFamily.semibold,
                  fontWeight: "600",
                  marginBottom: 2,
                }}
              >
                Sons para relaxar
              </Text>
              <Text
                style={{
                  color: textMuted,
                  fontSize: typography.caption.fontSize,
                  fontFamily: typography.fontFamily.base,
                }}
              >
                Encontre paz e tranquilidade
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Category Tabs - Flo Clean Pills */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={{
            flexDirection: "row",
            backgroundColor: tabBg,
            borderRadius: Tokens.radius.full,
            padding: spacing.xs,
            ...shadows.flo.minimal,
          }}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => handleCategoryChange(cat.id)}
              style={{ flex: 1 }}
              accessibilityRole="tab"
              accessibilityLabel={`Categoria ${cat.name}`}
              accessibilityState={{ selected: selectedCategory === cat.id }}
            >
              <View
                style={{
                  paddingVertical: spacing.sm + 2,
                  borderRadius: Tokens.radius.full,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedCategory === cat.id ? tabActive : "transparent",
                }}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={selectedCategory === cat.id ? textPrimary : textSecondary}
                />
                <Text
                  style={{
                    marginLeft: spacing.xs,
                    fontSize: typography.labelSmall.fontSize,
                    fontFamily: typography.fontFamily.semibold,
                    fontWeight: "600",
                    color: selectedCategory === cat.id ? textPrimary : textSecondary,
                  }}
                >
                  {cat.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </Animated.View>
      </View>

      {/* Sounds List */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing["3xl"] }}
      >
        <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.md }}>
          {filteredSounds.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.delay(100 + index * 80).duration(500)}
              style={{ marginBottom: spacing.md }}
            >
              <Pressable
                onPress={() => handlePlaySound(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`${playingSound === item.id ? "Pausar" : "Reproduzir"} ${item.title}`}
                accessibilityHint={item.subtitle}
              >
                <View
                  style={{
                    backgroundColor: playingSound === item.id ? cardBgActive(item.color) : cardBg,
                    borderRadius: Tokens.radius["2xl"],
                    padding: spacing.lg,
                    borderWidth: 1,
                    borderColor:
                      playingSound === item.id ? `${item.color}40` : "rgba(255,255,255,0.06)",
                    ...shadows.flo.soft,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* Icon */}
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,
                        backgroundColor:
                          playingSound === item.id ? item.color : "rgba(255,255,255,0.08)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: spacing.md,
                      }}
                    >
                      {playingSound === item.id ? (
                        <Ionicons name="pause" size={24} color={textPrimary} />
                      ) : (
                        <Ionicons
                          name={item.icon}
                          size={24}
                          color={playingSound === item.id ? textPrimary : item.color}
                        />
                      )}
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: textPrimary,
                          fontSize: typography.titleSmall.fontSize,
                          fontFamily: typography.fontFamily.semibold,
                          fontWeight: "600",
                          marginBottom: 2,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          color: textSecondary,
                          fontSize: typography.bodySmall.fontSize,
                          fontFamily: typography.fontFamily.base,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {item.subtitle}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="time-outline" size={12} color={textMuted} />
                        <Text
                          style={{
                            color: textMuted,
                            fontSize: typography.caption.fontSize,
                            fontFamily: typography.fontFamily.medium,
                            marginLeft: 4,
                          }}
                        >
                          {item.duration}
                        </Text>
                      </View>
                    </View>

                    {/* Play Button */}
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor:
                          playingSound === item.id || loadingSound === item.id
                            ? item.color
                            : "rgba(255,255,255,0.08)",
                        alignItems: "center",
                        justifyContent: "center",
                        ...(playingSound === item.id || loadingSound === item.id
                          ? shadows.glow(item.color)
                          : {}),
                      }}
                    >
                      {loadingSound === item.id ? (
                        <ActivityIndicator size="small" color={textPrimary} />
                      ) : (
                        <Ionicons
                          name={playingSound === item.id ? "pause" : "play"}
                          size={20}
                          color={textPrimary}
                        />
                      )}
                    </View>
                  </View>

                  {/* Playing Indicator */}
                  {playingSound === item.id && (
                    <Animated.View
                      entering={FadeInDown.duration(300)}
                      style={{
                        marginTop: spacing.md,
                        paddingTop: spacing.md,
                        borderTopWidth: 1,
                        borderTopColor: "rgba(255,255,255,0.08)",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            color: textMuted,
                            fontSize: typography.caption.fontSize,
                            fontFamily: typography.fontFamily.medium,
                          }}
                        >
                          Tocando...
                        </Text>
                        <View style={{ flexDirection: "row", gap: 3 }}>
                          {[1, 2, 3, 4].map((i) => (
                            <View
                              key={i}
                              style={{
                                width: 3,
                                height: 10 + Math.random() * 8,
                                backgroundColor: item.color,
                                borderRadius: 2,
                              }}
                            />
                          ))}
                        </View>
                      </View>
                    </Animated.View>
                  )}
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Tip - Flo Clean Card */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(400)}
          style={{ paddingHorizontal: spacing.xl, marginTop: spacing.lg }}
        >
          <View
            style={{
              backgroundColor: `${Tokens.brand.secondary[500]}10`,
              borderRadius: Tokens.radius["2xl"],
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: `${Tokens.brand.secondary[500]}20`,
              ...shadows.flo.minimal,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: `${Tokens.brand.secondary[400]}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing.md,
                }}
              >
                <Ionicons name="bulb" size={18} color={Tokens.brand.secondary[400]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: textPrimary,
                    fontSize: typography.labelMedium.fontSize,
                    fontFamily: typography.fontFamily.semibold,
                    fontWeight: "600",
                    marginBottom: spacing.xs,
                  }}
                >
                  Dica
                </Text>
                <Text
                  style={{
                    color: textMuted,
                    fontSize: typography.bodySmall.fontSize,
                    fontFamily: typography.fontFamily.base,
                    lineHeight: 20,
                  }}
                >
                  Use fones de ouvido para uma experiencia mais imersiva. Sons da natureza podem
                  ajudar seu bebe a dormir melhor tambem.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
