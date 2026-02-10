/**
 * Nossa Maternidade - DailyLogScreen
 * Flo Health Minimal Design - Mood logging with intensity slider
 *
 * Design Principles:
 * - Subtle gradient backgrounds
 * - Clean, minimal UI elements
 * - Soft shadows (shadows.flo.soft)
 * - Dark mode support
 * - Manrope typography
 */

import React, { useState, useMemo, useRef } from "react";
import { View, Text, Pressable, PanResponder, Dimensions } from "react-native";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useSaveCycleDailyLog } from "@/api/hooks";
import { RootStackScreenProps, DailyLog } from "@/types/navigation";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";
import { Tokens, typography, spacing, shadows } from "@/theme/tokens";
import { logger } from "@/utils/logger";
import { wp } from "@/utils/dimensions";
import { useToast } from "@/context/ToastContext";
import { MoodIcon, type MoodType } from "@/components/icons/MoodIcons";
import { FloScreenWrapper } from "@/components/ui/FloScreenWrapper";
import { FloHeader } from "@/components/ui/FloHeader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MOODS: Array<{ id: MoodType; label: string; color: string }> = [
  { id: "happy", label: "Feliz", color: Tokens.mood.happy },
  { id: "calm", label: "Calma", color: Tokens.mood.calm },
  { id: "energetic", label: "Enérgica", color: Tokens.mood.energetic },
  { id: "anxious", label: "Ansiosa", color: Tokens.mood.anxious },
  { id: "sad", label: "Triste", color: Tokens.mood.sad },
  { id: "irritated", label: "Irritada", color: Tokens.mood.irritated },
  { id: "sensitive", label: "Sensível", color: Tokens.mood.sensitive },
  { id: "tired", label: "Cansada", color: Tokens.mood.tired },
];

export default function DailyLogScreen({ navigation, route }: RootStackScreenProps<"DailyLog">) {
  const { isDark } = useTheme();
  const saveCycleDailyLogMutation = useSaveCycleDailyLog();
  const { showSuccess, showError } = useToast();

  // Flo Clean color tokens
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const textMuted = isDark ? Tokens.neutral[500] : Tokens.neutral[400];
  const cardBg = isDark ? Tokens.glass.dark.light : Tokens.neutral[0];
  const sliderBg = isDark ? Tokens.glass.dark.medium : Tokens.neutral[100];

  const today = useMemo(() => {
    if (route.params?.date) {
      return new Date(route.params.date);
    }
    return new Date();
  }, [route.params?.date]);

  const dateStr = today.toISOString().split("T")[0];

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(50);

  // Slider config - responsive
  const SLIDER_WIDTH = wp(85);
  const EMOJI_SIZE = 56;
  const sliderProgress = useSharedValue(0.5);

  const handleMoodSelect = async (moodId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMood(moodId);
    sliderProgress.value = 0.5;
    setIntensity(50);
  };

  const handleSliderUpdate = (value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    sliderProgress.value = withSpring(clampedValue, { damping: 15 });
    setIntensity(Math.round(clampedValue * 100));

    const percentage = Math.round(clampedValue * 100);
    if (percentage % 25 === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (_evt, gestureState) => {
        const containerX = (SCREEN_WIDTH - SLIDER_WIDTH) / 2;
        const relativeX = gestureState.moveX - containerX;
        const newValue = relativeX / SLIDER_WIDTH;
        handleSliderUpdate(newValue);
      },
      onPanResponderRelease: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },
    })
  ).current;

  const emojiAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      sliderProgress.value,
      [0, 1],
      [0, SLIDER_WIDTH - EMOJI_SIZE],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateX }],
    };
  });

  const progressBarStyle = useAnimatedStyle(() => {
    const width = interpolate(sliderProgress.value, [0, 1], [0, SLIDER_WIDTH], Extrapolate.CLAMP);
    return { width };
  });

  const handleSave = async () => {
    if (!selectedMood) {
      showError("Selecione como você está se sentindo");
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const log: DailyLog = {
        id: Date.now().toString(),
        date: dateStr,
        symptoms: [],
        mood: selectedMood ? [selectedMood] : [],
        discharge: "none",
        sexActivity: "none",
      };

      await saveCycleDailyLogMutation.mutateAsync(log);
      logger.info("Daily log saved", "DailyLogScreen", {
        date: dateStr,
        mood: selectedMood,
        intensity,
      });
      showSuccess("Registro salvo com sucesso!");
      navigation.goBack();
    } catch (error) {
      logger.error(
        "Failed to save daily log",
        "DailyLogScreen",
        error instanceof Error ? error : new Error(String(error))
      );
      showError("Erro ao salvar. Tente novamente.");
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const months = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    return `${day} de ${months[date.getMonth()]}`;
  };

  const selectedMoodData = MOODS.find((m) => m.id === selectedMood);

  return (
    <FloScreenWrapper scrollable={false} paddingHorizontal={0} paddingTop={0} paddingBottom={0}>
      {/* Flo Header */}
      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.md }}>
        <FloHeader
          title={formatDate(today)}
          showBack
          onBack={() => navigation.goBack()}
          variant="compact"
          rightActions={[
            {
              icon: selectedMood ? "checkmark" : "close",
              onPress: selectedMood ? handleSave : () => navigation.goBack(),
              label: selectedMood ? "Salvar" : "Fechar",
            },
          ]}
        />
      </View>

      {/* Save Button - Flo Clean Style */}
      {selectedMood && (
        <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing.lg }}>
          <Pressable
            onPress={handleSave}
            accessibilityLabel="Salvar registro de humor"
            accessibilityRole="button"
            style={{
              backgroundColor: Tokens.brand.accent[500],
              paddingVertical: spacing.md,
              paddingHorizontal: spacing["2xl"],
              borderRadius: Tokens.radius.full,
              alignItems: "center",
              ...shadows.flo.cta,
            }}
          >
            <Text
              style={{
                color: Tokens.neutral[0],
                fontSize: typography.labelLarge.fontSize,
                fontFamily: typography.fontFamily.semibold,
                fontWeight: "600",
              }}
            >
              Salvar Registro
            </Text>
          </Pressable>
        </View>
      )}

      {/* Content */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: spacing.xl,
        }}
      >
        {!selectedMood ? (
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={{ alignItems: "center", width: "100%" }}
          >
            {/* Title Card - Flo Clean */}
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: Tokens.radius["2xl"],
                padding: spacing.xl,
                marginBottom: spacing["3xl"],
                alignItems: "center",
                ...shadows.flo.soft,
              }}
            >
              <Text
                style={{
                  color: textPrimary,
                  fontSize: typography.headlineLarge.fontSize,
                  fontFamily: typography.fontFamily.bold,
                  fontWeight: "700",
                  textAlign: "center",
                  marginBottom: spacing.sm,
                  letterSpacing: -0.5,
                }}
              >
                Como você está hoje?
              </Text>
              <Text
                style={{
                  color: textSecondary,
                  fontSize: typography.bodyMedium.fontSize,
                  fontFamily: typography.fontFamily.medium,
                  textAlign: "center",
                }}
              >
                Toque em um humor para registrar
              </Text>
            </View>

            {/* Mood Grid - Flo Clean Cards */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                width: "100%",
                gap: spacing.md,
              }}
            >
              {MOODS.map((mood, index) => (
                <Animated.View
                  key={mood.id}
                  entering={FadeInUp.delay(100 + index * 60).duration(500)}
                  style={{ width: "22%", alignItems: "center" }}
                >
                  <Pressable
                    onPress={() => handleMoodSelect(mood.id)}
                    accessibilityLabel={`Selecionar humor ${mood.label}`}
                    accessibilityRole="button"
                    accessibilityHint={`Toque para registrar que você está se sentindo ${mood.label.toLowerCase()}`}
                    style={{ alignItems: "center" }}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: Tokens.radius.xl,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: spacing.sm,
                        backgroundColor: cardBg,
                        borderWidth: 1,
                        borderColor: isDark ? Tokens.glass.dark.medium : Tokens.neutral[100],
                        ...shadows.flo.minimal,
                      }}
                    >
                      <MoodIcon mood={mood.id} size={32} color={mood.color} />
                    </View>
                    <Text
                      style={{
                        color: textSecondary,
                        fontSize: typography.caption.fontSize,
                        fontFamily: typography.fontFamily.medium,
                        textAlign: "center",
                      }}
                    >
                      {mood.label}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInUp.duration(600)}
            style={{ alignItems: "center", width: "100%" }}
          >
            {/* Selected Mood Display - Flo Clean Card */}
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: Tokens.radius["3xl"],
                alignItems: "center",
                justifyContent: "center",
                marginBottom: spacing.xl,
                backgroundColor: cardBg,
                borderWidth: 2,
                borderColor: `${selectedMoodData?.color}30`,
                ...shadows.flo.elevated,
              }}
            >
              {selectedMoodData && (
                <MoodIcon mood={selectedMoodData.id} size={64} color={selectedMoodData.color} />
              )}
            </View>

            <Text
              style={{
                color: textPrimary,
                fontSize: typography.headlineLarge.fontSize,
                fontFamily: typography.fontFamily.bold,
                fontWeight: "700",
                marginBottom: spacing.sm,
                letterSpacing: -0.5,
              }}
            >
              {selectedMoodData?.label}
            </Text>

            <Pressable
              onPress={() => setSelectedMood(null)}
              accessibilityLabel="Mudar seleção de humor"
              accessibilityRole="button"
              accessibilityHint="Toque para escolher outro humor"
              hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.lg,
                marginBottom: spacing["3xl"],
              }}
            >
              <Text
                style={{
                  color: Tokens.brand.accent[500],
                  fontSize: typography.bodySmall.fontSize,
                  fontFamily: typography.fontFamily.semibold,
                  fontWeight: "600",
                }}
              >
                Toque para mudar
              </Text>
            </Pressable>

            {/* Intensity Slider - Flo Clean Style */}
            <View style={{ width: "100%", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: Tokens.radius["2xl"],
                  padding: spacing.xl,
                  width: "100%",
                  alignItems: "center",
                  ...shadows.flo.soft,
                }}
              >
                <Text
                  style={{
                    color: textSecondary,
                    fontSize: typography.bodyMedium.fontSize,
                    fontFamily: typography.fontFamily.medium,
                    marginBottom: spacing.lg,
                  }}
                >
                  Intensidade:{" "}
                  <Text
                    style={{
                      color: textPrimary,
                      fontFamily: typography.fontFamily.bold,
                      fontWeight: "700",
                    }}
                  >
                    {intensity}%
                  </Text>
                </Text>

                {/* Slider Container */}
                <View
                  style={{
                    width: SLIDER_WIDTH,
                    height: 56,
                    borderRadius: Tokens.radius.full,
                    backgroundColor: sliderBg,
                    alignItems: "center",
                    justifyContent: "center",
                    ...shadows.flo.minimal,
                  }}
                  {...panResponder.panHandlers}
                  accessible
                  accessibilityRole="adjustable"
                  accessibilityLabel={`Intensidade do humor: ${intensity}%`}
                  accessibilityHint="Deslize para ajustar a intensidade do seu humor"
                  accessibilityValue={{ min: 0, max: 100, now: intensity }}
                >
                  {/* Progress Bar */}
                  <Animated.View
                    style={[
                      progressBarStyle,
                      {
                        position: "absolute",
                        left: 0,
                        height: 56,
                        backgroundColor: `${selectedMoodData?.color}20`,
                        borderRadius: Tokens.radius.full,
                      },
                    ]}
                  />

                  {/* Mood Icon Slider */}
                  <Animated.View
                    style={[
                      emojiAnimatedStyle,
                      {
                        position: "absolute",
                        left: 0,
                        width: EMOJI_SIZE,
                        height: EMOJI_SIZE,
                        borderRadius: EMOJI_SIZE / 2,
                        backgroundColor: selectedMoodData?.color || Tokens.brand.accent[500],
                        alignItems: "center",
                        justifyContent: "center",
                        ...shadows.glow(selectedMoodData?.color || Tokens.brand.accent[500]),
                      },
                    ]}
                  >
                    {selectedMoodData && (
                      <MoodIcon mood={selectedMoodData.id} size={26} color={Tokens.neutral[0]} />
                    )}
                  </Animated.View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: SLIDER_WIDTH,
                    marginTop: spacing.md,
                    paddingHorizontal: spacing.sm,
                  }}
                >
                  <Text
                    style={{
                      color: textMuted,
                      fontSize: typography.caption.fontSize,
                      fontFamily: typography.fontFamily.medium,
                    }}
                  >
                    Baixa
                  </Text>
                  <Text
                    style={{
                      color: textMuted,
                      fontSize: typography.caption.fontSize,
                      fontFamily: typography.fontFamily.medium,
                    }}
                  >
                    Alta
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </FloScreenWrapper>
  );
}
