/**
 * EmotionalCheckInPrimary - Check-in Emocional com Slider
 *
 * PRIMÁRIO na hierarquia da Home (Opção C - Progressive Disclosure)
 * - Slider contínuo estilo Instagram (HeartMoodSlider)
 * - Antes de interagir: apenas hint "Deslize para registrar"
 * - Depois de interagir:
 *   - mood ≤ 35% → CTA "Conversar sobre isso" (vai para Assistant)
 *   - mood > 35% → Apenas feedback acolhedor (sem CTA)
 * - Animação suave (FadeIn)
 */

import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { HeartMoodSlider } from "../HeartMoodSlider";
import { Button } from "../ui/Button";
import { useTheme } from "../../hooks/useTheme";
import { useCheckInStore } from "../../state/store";
import { brand, spacing, radius, shadows } from "../../theme/tokens";
import type { MainTabParamList } from "../../types/navigation";

// Tipos válidos de emotionalContext para navegação
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

// Mensagens de feedback baseadas no valor do slider (0-1)
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
      message: "Que lindo! Guarda esse sentimento com você. 💕",
      moodKey: "amada",
    };
  }
};

// Mapeia valor 0-1 para valor numérico 1-5 do store
const mapValueToMood = (value: number): number => {
  if (value < 0.2) return 1;
  if (value < 0.4) return 2;
  if (value < 0.6) return 3;
  if (value < 0.8) return 4;
  return 5;
};

// Mapeia valor 1-5 do store para valor 0-1 do slider
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

// Threshold para mostrar CTA de conversa (≤ 35% = mood baixo)
const MOOD_TALK_THRESHOLD = 0.35;

// Componente principal
export const EmotionalCheckInPrimary: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  // Store
  const setTodayMood = useCheckInStore((s) => s.setTodayMood);
  const getTodayCheckIn = useCheckInStore((s) => s.getTodayCheckIn);

  // Estado local
  const [sliderValue, setSliderValue] = useState(0.5);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    message: string;
    moodKey: EmotionalContextType;
  } | null>(null);

  // Verificar check-in existente ao montar
  useEffect(() => {
    const todayCheckIn = getTodayCheckIn();
    if (todayCheckIn?.mood) {
      const existingValue = mapMoodToValue(todayCheckIn.mood);
      setSliderValue(existingValue);
      setHasInteracted(true);
      setFeedbackData(getFeedbackMessage(existingValue));
    }
  }, [getTodayCheckIn]);

  // Handler quando valor muda (durante arraste)
  const handleValueChange = useCallback((value: number) => {
    setSliderValue(value);
  }, []);

  // Handler quando usuário solta o slider
  const handleValueCommit = useCallback(
    async (value: number) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      setSliderValue(value);

      // Converter para valor numérico e salvar
      const moodValue = mapValueToMood(value);
      setTodayMood(moodValue);

      // Atualizar feedback
      setFeedbackData(getFeedbackMessage(value));
    },
    [setTodayMood]
  );

  // Handler quando usuário interage pela primeira vez (via onInteracted)
  const handleFirstInteraction = useCallback(() => {
    setHasInteracted(true);
  }, []);

  // Handler para conversar com NathIA sobre o mood
  const handleTalkAboutMood = useCallback(async () => {
    if (!feedbackData) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Assistant", {
      emotionalContext: feedbackData.moodKey,
      seedMood: sliderValue,
    });
  }, [feedbackData, navigation, sliderValue]);

  // Verifica se deve mostrar CTA de conversa (mood baixo)
  const shouldShowTalkCTA = sliderValue <= MOOD_TALK_THRESHOLD;

  // Cores do tema
  const textMuted = isDark ? colors.neutral[400] : colors.neutral[500];

  return (
    <View style={styles.container}>
      {/* Slider Card */}
      <HeartMoodSlider
        initialValue={sliderValue}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        onInteracted={handleFirstInteraction}
        title="Como você está agora?"
      />

      {/* Progressive Disclosure: Hint → Feedback + CTA condicional */}
      {!hasInteracted ? (
        <Animated.View entering={FadeIn.duration(400)} style={styles.hintContainer}>
          <Text style={[styles.hintText, { color: textMuted }]}>
            Deslize para registrar como você está
          </Text>
        </Animated.View>
      ) : (
        feedbackData && (
          <Animated.View
            entering={FadeIn.duration(400)}
            style={[
              styles.feedbackContainer,
              {
                backgroundColor: isDark ? colors.neutral[800] : brand.primary[50],
              },
            ]}
          >
            <Text style={[styles.feedbackText, { color: textMuted }]}>{feedbackData.message}</Text>

            {/* CTA apenas se mood baixo (≤ 35%) */}
            {shouldShowTalkCTA && (
              <Button
                variant="primary"
                size="md"
                onPress={handleTalkAboutMood}
                accessibilityLabel="Conversar com NathIA sobre como você está"
                icon="chatbubble-ellipses"
              >
                Conversar sobre isso
              </Button>
            )}
          </Animated.View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  hintContainer: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  hintText: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    textAlign: "center",
    fontStyle: "italic",
  },
  feedbackContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
    ...shadows.sm,
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
