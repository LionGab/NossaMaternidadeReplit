/**
 * EmotionalCheckInPrimary - Check-in Emocional com Slider
 *
 * Layout unificado: mesmo esqueleto para todos os estados.
 * Zero layout shift entre transicoes de mood.
 *
 * - Slider continuo (HeartMoodSlider)
 * - Feedback area com altura fixa (previne layout shift)
 * - CTA "Conversar sobre isso" em posicao fixa (so aparece mood <= 35%)
 * - Dark mode completo
 */

import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { HeartMoodSlider } from "../HeartMoodSlider";
import { Button } from "../ui/Button";
import { useTheme } from "../../hooks/useTheme";
import { useCheckInStore } from "../../state";
import { neutral, spacing } from "../../theme/tokens";
import type { MainTabParamList } from "../../types/navigation";

type EmotionalContextType =
  | "ansiosa"
  | "desanimada"
  | "com_sono"
  | "enjoada"
  | "em_paz"
  | "orgulhosa"
  | "bem"
  | "cansada"
  | "indisposta"
  | "amada";

const getFeedbackMessage = (value: number): { message: string; moodKey: EmotionalContextType } => {
  if (value < 0.2) {
    return {
      message: "Está difícil, né? Respira. Eu tô aqui.",
      moodKey: "desanimada",
    };
  } else if (value < 0.4) {
    return {
      message: "Dias assim passam. Você não precisa resolver tudo agora.",
      moodKey: "cansada",
    };
  } else if (value < 0.6) {
    return {
      message: "Neutro também é um sentimento válido. Tudo bem estar assim.",
      moodKey: "em_paz",
    };
  } else if (value < 0.8) {
    return {
      message: "Que bom te ver assim! Aproveita esse respiro.",
      moodKey: "bem",
    };
  } else {
    return {
      message: "Que lindo! Guarda esse sentimento com você.",
      moodKey: "amada",
    };
  }
};

const mapValueToMood = (value: number): number => {
  if (value < 0.2) return 1;
  if (value < 0.4) return 2;
  if (value < 0.6) return 3;
  if (value < 0.8) return 4;
  return 5;
};

const mapMoodToValue = (mood: number): number => {
  const moodMap: Record<number, number> = {
    1: 0.1,
    2: 0.3,
    3: 0.5,
    4: 0.7,
    5: 0.9,
  };
  return moodMap[mood] ?? 0.5;
};

const MOOD_TALK_THRESHOLD = 0.35;

export const EmotionalCheckInPrimary: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const setTodayMood = useCheckInStore((s) => s.setTodayMood);
  const getTodayCheckIn = useCheckInStore((s) => s.getTodayCheckIn);

  const [sliderValue, setSliderValue] = useState(0.5);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    message: string;
    moodKey: EmotionalContextType;
  } | null>(null);

  useEffect(() => {
    const todayCheckIn = getTodayCheckIn();
    if (todayCheckIn?.mood) {
      const existingValue = mapMoodToValue(todayCheckIn.mood);
      setSliderValue(existingValue);
      setHasInteracted(true);
      setFeedbackData(getFeedbackMessage(existingValue));
    }
  }, [getTodayCheckIn]);

  const handleValueChange = useCallback((value: number) => {
    setSliderValue(value);
  }, []);

  const handleValueCommit = useCallback(
    async (value: number) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSliderValue(value);
      const moodValue = mapValueToMood(value);
      setTodayMood(moodValue);
      setFeedbackData(getFeedbackMessage(value));
    },
    [setTodayMood]
  );

  const handleFirstInteraction = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const handleTalkAboutMood = useCallback(async () => {
    if (!feedbackData) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Assistant", {
      emotionalContext: feedbackData.moodKey,
      seedMood: sliderValue,
    });
  }, [feedbackData, navigation, sliderValue]);

  const shouldShowTalkCTA = hasInteracted && sliderValue <= MOOD_TALK_THRESHOLD;

  // Theme colors
  const feedbackTextColor = isDark ? neutral[200] : neutral[600];
  const hintColor = isDark ? neutral[400] : neutral[500];

  const footerContent = !hasInteracted ? (
    <Text style={[styles.hintText, { color: hintColor }]}>
      Deslize para registrar como você está
    </Text>
  ) : feedbackData ? (
    <Animated.View entering={FadeIn.duration(300)} style={styles.feedbackContent}>
      <Text style={[styles.feedbackText, { color: feedbackTextColor }]}>
        {feedbackData.message}
      </Text>
      {shouldShowTalkCTA && (
        <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(200)}>
          <Button
            variant="primary"
            size="md"
            onPress={handleTalkAboutMood}
            fullWidth
            accessibilityLabel="Conversar com NathIA sobre como você está"
            icon="chatbubble-ellipses"
          >
            Conversar sobre isso
          </Button>
        </Animated.View>
      )}
    </Animated.View>
  ) : null;

  return (
    <HeartMoodSlider
      initialValue={sliderValue}
      onValueChange={handleValueChange}
      onValueCommit={handleValueCommit}
      onInteracted={handleFirstInteraction}
      title="Como você está agora?"
      footer={footerContent}
    />
  );
};

const styles = StyleSheet.create({
  hintText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    textAlign: "center",
    fontStyle: "italic",
  },
  feedbackContent: {
    gap: spacing.md,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default EmotionalCheckInPrimary;
