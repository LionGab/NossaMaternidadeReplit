/**
 * NotificationPreferencesScreen - Flo Health Minimal Redesign
 *
 * Tela para gerenciar preferências de notificações push
 *
 * Design Flo Health Minimal:
 * - Subtle gradient background via FloScreenWrapper
 * - Clean toggle/switch designs
 * - Soft shadows (shadows.flo.soft)
 * - Manrope typography
 * - Dark mode support
 *
 * Features:
 * - Master switch (habilita/desabilita tudo)
 * - Preferências granulares por tipo
 * - Horários personalizados (check-in, afirmação, hábitos, wellness)
 * - Sound e vibração toggles
 * - Sincroniza com backend em tempo real
 *
 * Grid 8pt compliant via Tokens
 */

import { supabase } from "@/api/supabase";
import { FloHeader } from "@/components/ui/FloHeader";
import { FloScreenWrapper } from "@/components/ui/FloScreenWrapper";
import { getSupabaseFunctionsUrl } from "@/config/env";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/state";
import { shadows, spacing, Tokens, typography } from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";
import { logger } from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, Switch, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface NotificationPreferences {
  notifications_enabled: boolean;
  daily_check_in: boolean;
  daily_affirmation: boolean;
  habit_reminders: boolean;
  wellness_reminders: boolean;
  community_comments: boolean;
  community_likes: boolean;
  community_mentions: boolean;
  chat_reminders: boolean;
  cycle_reminders: boolean;
  period_predictions: boolean;
  check_in_time: string;
  affirmation_time: string;
  habit_reminder_time: string;
  wellness_time: string;
  sound_enabled: boolean;
  vibration_enabled: boolean;
}

interface PreferenceSection {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  preferences: {
    key: keyof NotificationPreferences;
    label: string;
    description?: string;
  }[];
}

export default function NotificationPreferencesScreen({
  navigation,
}: RootStackScreenProps<"NotificationPreferences">) {
  const { isDark } = useTheme();
  const user = useAppStore((s) => s.user);

  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Cores dinâmicas - Flo style
  const textMain = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const cardBg = isDark ? Tokens.surface.dark.elevatedSoft : Tokens.neutral[0];
  const borderColor = isDark ? Tokens.glass.dark.strong : Tokens.neutral[100];
  const accentColor = Tokens.brand.accent[500];

  // Seções de preferências
  const SECTIONS: PreferenceSection[] = [
    {
      title: "Bem-estar Diário",
      icon: "sparkles-outline",
      preferences: [
        {
          key: "daily_check_in",
          label: "Check-in diário",
          description: "Lembrete para registrar como você está se sentindo",
        },
        {
          key: "daily_affirmation",
          label: "Afirmação diária",
          description: "Receba mensagens motivacionais todo dia",
        },
        {
          key: "habit_reminders",
          label: "Lembretes de hábitos",
          description: "Notificações para manter seus hábitos de bem-estar",
        },
        {
          key: "wellness_reminders",
          label: "Lembretes de hidratação e movimento",
          description: "Pausas para beber água e alongar",
        },
      ],
    },
    {
      title: "Mães Valente",
      icon: "people-outline",
      preferences: [
        {
          key: "community_comments",
          label: "Novos comentários",
          description: "Quando alguém comenta nas suas publicações",
        },
        {
          key: "community_likes",
          label: "Curtidas",
          description: "Quando suas publicações recebem curtidas (marcos: 5, 10, 25...)",
        },
        {
          key: "community_mentions",
          label: "Menções",
          description: "Quando alguém menciona você em uma publicação",
        },
      ],
    },
    {
      title: "Ciclo e Saúde",
      icon: "calendar-outline",
      preferences: [
        {
          key: "cycle_reminders",
          label: "Lembretes de ciclo",
          description: "Avisos sobre fases do ciclo menstrual",
        },
        {
          key: "period_predictions",
          label: "Previsão de período",
          description: "Notificação 3 dias antes do período estimado",
        },
      ],
    },
    {
      title: "NathIA Chat",
      icon: "chatbubble-outline",
      preferences: [
        {
          key: "chat_reminders",
          label: "Lembretes de conversas",
          description: "Quando a NathIA tem algo importante para compartilhar",
        },
      ],
    },
  ];

  /**
   * Load preferences from backend via Edge Function
   */
  const loadPreferences = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error("No active session");
      }

      const functionsUrl = getSupabaseFunctionsUrl();
      if (!functionsUrl) {
        throw new Error("Functions URL not configured");
      }

      const response = await fetch(`${functionsUrl}/notifications/preferences`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load preferences");
      }

      const data = await response.json();
      setPrefs(data.preferences as NotificationPreferences);
    } catch (error) {
      logger.error("Failed to load notification preferences", "notifications", error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update preference in backend via Edge Function
   */
  const updatePreference = async (key: keyof NotificationPreferences, value: boolean | string) => {
    if (!user?.id || !prefs) return;

    try {
      setIsSaving(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error("No active session");
      }

      const functionsUrl = getSupabaseFunctionsUrl();
      if (!functionsUrl) {
        throw new Error("Functions URL not configured");
      }

      const response = await fetch(`${functionsUrl}/notifications/preferences`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update preference");
      }

      // Update local state
      setPrefs({ ...prefs, [key]: value });

      logger.info("Notification preference updated", "notifications", { key, value });
    } catch (error) {
      logger.error("Failed to update preference", "notifications", error as Error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Toggle master switch (enables/disables all notifications)
   */
  const toggleMasterSwitch = async (enabled: boolean) => {
    await updatePreference("notifications_enabled", enabled);
  };

  /**
   * Toggle individual preference
   */
  const togglePreference = async (key: keyof NotificationPreferences) => {
    if (!prefs) return;
    const currentValue = prefs[key];
    if (typeof currentValue === "boolean") {
      await updatePreference(key, !currentValue);
    }
  };

  useEffect(() => {
    loadPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Loading state
  if (isLoading) {
    return (
      <FloScreenWrapper>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={accentColor} />
          <Text
            style={{
              marginTop: spacing.lg,
              fontSize: 14,
              fontFamily: typography.fontFamily.medium,
              color: textSecondary,
            }}
          >
            Carregando preferências...
          </Text>
        </View>
      </FloScreenWrapper>
    );
  }

  // Error state
  if (!prefs) {
    return (
      <FloScreenWrapper>
        <FloHeader
          title="Notificações"
          showBack
          onBack={() => navigation.goBack()}
          variant="compact"
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: spacing["2xl"],
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: isDark ? Tokens.glass.dark.medium : Tokens.neutral[100],
              alignItems: "center",
              justifyContent: "center",
              marginBottom: spacing.xl,
            }}
          >
            <Ionicons name="alert-circle-outline" size={40} color={textSecondary} />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: typography.fontFamily.semibold,
              color: textMain,
              textAlign: "center",
              marginBottom: spacing.sm,
            }}
          >
            Erro ao carregar preferências
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: typography.fontFamily.base,
              color: textSecondary,
              textAlign: "center",
            }}
          >
            Verifique sua conexão e tente novamente
          </Text>
        </View>
      </FloScreenWrapper>
    );
  }

  return (
    <FloScreenWrapper scrollable paddingBottom={120}>
      {/* Header */}
      <FloHeader
        title="Notificações"
        showBack
        onBack={() => navigation.goBack()}
        variant="compact"
        rightActions={isSaving ? undefined : undefined}
      />

      {/* Saving indicator */}
      {isSaving && (
        <View
          style={{
            position: "absolute",
            top: spacing.lg,
            right: spacing.xl,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="small" color={accentColor} />
        </View>
      )}

      {/* Master Switch Card */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        style={{
          marginBottom: spacing["2xl"],
        }}
      >
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: prefs.notifications_enabled ? accentColor : borderColor,
            ...shadows.flo.soft,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: prefs.notifications_enabled
                  ? Tokens.accent.light.soft
                  : isDark
                    ? Tokens.glass.dark.medium
                    : Tokens.neutral[100],
                alignItems: "center",
                justifyContent: "center",
                marginRight: spacing.lg,
              }}
            >
              <Ionicons
                name={prefs.notifications_enabled ? "notifications" : "notifications-off"}
                size={26}
                color={prefs.notifications_enabled ? accentColor : textSecondary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: typography.fontFamily.semibold,
                  color: textMain,
                  marginBottom: 4,
                }}
              >
                Habilitar notificações
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: typography.fontFamily.base,
                  color: textSecondary,
                }}
              >
                Ativar ou desativar todas as notificações
              </Text>
            </View>
            <Switch
              value={prefs.notifications_enabled}
              onValueChange={toggleMasterSwitch}
              trackColor={{
                false: isDark ? Tokens.neutral[700] : Tokens.neutral[200],
                true: accentColor,
              }}
              thumbColor={Platform.OS === "android" ? Tokens.neutral[0] : undefined}
              ios_backgroundColor={isDark ? Tokens.neutral[700] : Tokens.neutral[200]}
              accessibilityLabel="Habilitar notificações"
              accessibilityRole="switch"
              accessibilityState={{ checked: prefs.notifications_enabled }}
            />
          </View>
        </View>
      </Animated.View>

      {/* Preference Sections */}
      {SECTIONS.map((section, sectionIndex) => (
        <Animated.View
          key={section.title}
          entering={FadeInDown.delay(200 + sectionIndex * 80).springify()}
          style={{ marginBottom: spacing["2xl"] }}
        >
          {/* Section Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: spacing.md,
              paddingHorizontal: spacing.xs,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: Tokens.accent.light.soft,
                alignItems: "center",
                justifyContent: "center",
                marginRight: spacing.sm,
              }}
            >
              <Ionicons name={section.icon} size={16} color={accentColor} />
            </View>
            <Text
              style={{
                fontSize: 13,
                fontFamily: typography.fontFamily.semibold,
                color: textSecondary,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {section.title}
            </Text>
          </View>

          {/* Section Card */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: borderColor,
              overflow: "hidden",
              ...shadows.flo.soft,
            }}
          >
            {section.preferences.map((pref, prefIndex) => {
              const isEnabled = prefs[pref.key] as boolean;
              const isLast = prefIndex === section.preferences.length - 1;

              return (
                <Pressable
                  key={pref.key}
                  onPress={() => togglePreference(pref.key)}
                  disabled={!prefs.notifications_enabled}
                  accessibilityRole="button"
                  accessibilityLabel={`${pref.label}. ${pref.description || ""}`}
                  accessibilityState={{ disabled: !prefs.notifications_enabled }}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: spacing.lg,
                    paddingHorizontal: spacing.xl,
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: borderColor,
                    opacity: prefs.notifications_enabled ? (pressed ? 0.7 : 1) : 0.5,
                    backgroundColor:
                      pressed && prefs.notifications_enabled
                        ? isDark
                          ? Tokens.accent.dark.whiteSubtle
                          : Tokens.accent.dark.blackSubtle
                        : "transparent",
                  })}
                >
                  <View style={{ flex: 1, marginRight: spacing.lg }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: typography.fontFamily.medium,
                        color: textMain,
                        marginBottom: pref.description ? 4 : 0,
                      }}
                    >
                      {pref.label}
                    </Text>
                    {pref.description && (
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: typography.fontFamily.base,
                          color: textSecondary,
                          lineHeight: 18,
                        }}
                      >
                        {pref.description}
                      </Text>
                    )}
                  </View>
                  <Switch
                    value={isEnabled}
                    onValueChange={() => togglePreference(pref.key)}
                    disabled={!prefs.notifications_enabled}
                    trackColor={{
                      false: isDark ? Tokens.neutral[700] : Tokens.neutral[200],
                      true: accentColor,
                    }}
                    thumbColor={Platform.OS === "android" ? Tokens.neutral[0] : undefined}
                    ios_backgroundColor={isDark ? Tokens.neutral[700] : Tokens.neutral[200]}
                    accessibilityLabel={pref.label}
                    accessibilityRole="switch"
                    accessibilityState={{
                      checked: isEnabled,
                      disabled: !prefs.notifications_enabled,
                    }}
                  />
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      ))}

      {/* Sound & Vibration Section */}
      <Animated.View
        entering={FadeInDown.delay(600).springify()}
        style={{ marginBottom: spacing["2xl"] }}
      >
        {/* Section Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: spacing.md,
            paddingHorizontal: spacing.xs,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: Tokens.accent.light.soft,
              alignItems: "center",
              justifyContent: "center",
              marginRight: spacing.sm,
            }}
          >
            <Ionicons name="volume-medium-outline" size={16} color={accentColor} />
          </View>
          <Text
            style={{
              fontSize: 13,
              fontFamily: typography.fontFamily.semibold,
              color: textSecondary,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Som e Vibração
          </Text>
        </View>

        {/* Sound & Vibration Card */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: borderColor,
            overflow: "hidden",
            ...shadows.flo.soft,
          }}
        >
          {/* Sound Toggle */}
          <Pressable
            onPress={() => updatePreference("sound_enabled", !prefs.sound_enabled)}
            disabled={!prefs.notifications_enabled}
            accessibilityRole="button"
            accessibilityLabel="Som das notificações"
            accessibilityState={{ disabled: !prefs.notifications_enabled }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: spacing.lg,
              paddingHorizontal: spacing.xl,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
              opacity: prefs.notifications_enabled ? (pressed ? 0.7 : 1) : 0.5,
              backgroundColor:
                pressed && prefs.notifications_enabled
                  ? isDark
                    ? Tokens.accent.dark.whiteSubtle
                    : Tokens.accent.dark.blackSubtle
                  : "transparent",
            })}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: typography.fontFamily.medium,
                  color: textMain,
                }}
              >
                Som
              </Text>
            </View>
            <Switch
              value={prefs.sound_enabled}
              onValueChange={(value) => updatePreference("sound_enabled", value)}
              disabled={!prefs.notifications_enabled}
              trackColor={{
                false: isDark ? Tokens.neutral[700] : Tokens.neutral[200],
                true: accentColor,
              }}
              thumbColor={Platform.OS === "android" ? Tokens.neutral[0] : undefined}
              ios_backgroundColor={isDark ? Tokens.neutral[700] : Tokens.neutral[200]}
              accessibilityLabel="Som das notificações"
              accessibilityRole="switch"
              accessibilityState={{
                checked: prefs.sound_enabled,
                disabled: !prefs.notifications_enabled,
              }}
            />
          </Pressable>

          {/* Vibration Toggle */}
          <Pressable
            onPress={() => updatePreference("vibration_enabled", !prefs.vibration_enabled)}
            disabled={!prefs.notifications_enabled}
            accessibilityRole="button"
            accessibilityLabel="Vibração das notificações"
            accessibilityState={{ disabled: !prefs.notifications_enabled }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: spacing.lg,
              paddingHorizontal: spacing.xl,
              opacity: prefs.notifications_enabled ? (pressed ? 0.7 : 1) : 0.5,
              backgroundColor:
                pressed && prefs.notifications_enabled
                  ? isDark
                    ? Tokens.accent.dark.whiteSubtle
                    : Tokens.accent.dark.blackSubtle
                  : "transparent",
            })}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: typography.fontFamily.medium,
                  color: textMain,
                }}
              >
                Vibração
              </Text>
            </View>
            <Switch
              value={prefs.vibration_enabled}
              onValueChange={(value) => updatePreference("vibration_enabled", value)}
              disabled={!prefs.notifications_enabled}
              trackColor={{
                false: isDark ? Tokens.neutral[700] : Tokens.neutral[200],
                true: accentColor,
              }}
              thumbColor={Platform.OS === "android" ? Tokens.neutral[0] : undefined}
              ios_backgroundColor={isDark ? Tokens.neutral[700] : Tokens.neutral[200]}
              accessibilityLabel="Vibração das notificações"
              accessibilityRole="switch"
              accessibilityState={{
                checked: prefs.vibration_enabled,
                disabled: !prefs.notifications_enabled,
              }}
            />
          </Pressable>
        </View>
      </Animated.View>

      {/* Info Footer */}
      <Animated.View entering={FadeInDown.delay(700).springify()}>
        <View
          style={{
            padding: spacing.xl,
            backgroundColor: isDark ? Tokens.glass.dark.ultraLight : Tokens.accent.light.subtle,
            borderRadius: 16,
            borderLeftWidth: 3,
            borderLeftColor: accentColor,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons
              name="information-circle"
              size={20}
              color={accentColor}
              style={{ marginRight: spacing.sm, marginTop: 2 }}
            />
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                fontFamily: typography.fontFamily.base,
                color: textSecondary,
                lineHeight: 20,
              }}
            >
              As notificações ajudam você a manter seus hábitos de bem-estar e ficar conectada com a
              comunidade. Você pode personalizar cada tipo de notificação individualmente.
            </Text>
          </View>
        </View>
      </Animated.View>
    </FloScreenWrapper>
  );
}
