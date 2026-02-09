/**
 * HeartMoodSlider - Premium Emotional Slider
 *
 * Slider emocional premium com ícones SVG profissionais.
 * Design de alto nível para 40M+ seguidores.
 *
 * Features Premium:
 * - Ícones SVG animados (sem emojis)
 * - Gradiente suave na trilha
 * - Animações fluidas com Reanimated
 * - Haptic feedback refinado
 * - Visual minimalista e sofisticado
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  FadeIn,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { brand, cleanDesign, nathAccent, neutral, radius, spacing, typography } from "../theme/tokens";
import { shadowPresets } from "../utils/shadow";
import { MoodSadIcon, MoodCalmIcon, MoodHappyIcon, MoodAmadaIcon } from "./icons/MoodIcons";

// Constantes do slider - Premium sizing
const SLIDER_WIDTH = 280;
const TRACK_HEIGHT = 8;
const THUMB_SIZE = 52;
const HEART_SIZE = 28;
const ICON_SIZE = 28;

// Cores premium do gradiente emocional
const COLOR_LOW = nathAccent.roseSoft; // Rosa suave (baixa energia)
const COLOR_MID = brand.primary[300]; // Azul pastel
const COLOR_HIGH = brand.primary[500]; // Azul vibrante

// Checkpoints para haptic feedback
const HAPTIC_CHECKPOINTS = [0.25, 0.5, 0.75, 1.0];

type MoodLevel = "low" | "neutral" | "good" | "great";

interface MoodDescriptor {
  level: MoodLevel;
  label: string;
  color: string;
}

/**
 * Retorna descritor de humor baseado no valor (0-1)
 */
function getMoodDescriptor(value: number): MoodDescriptor {
  if (value <= 0.25) {
    return { level: "low", label: "Precisando de cuidado", color: nathAccent.roseSoft };
  }
  if (value <= 0.5) {
    return { level: "neutral", label: "Tranquila", color: brand.primary[400] };
  }
  if (value <= 0.75) {
    return { level: "good", label: "Bem", color: brand.primary[500] };
  }
  return { level: "great", label: "Radiante", color: cleanDesign.pink[500] };
}

/**
 * Renderiza o ícone SVG correto baseado no nível
 */
function MoodIndicator({ level, size = ICON_SIZE }: { level: MoodLevel; size?: number }) {
  switch (level) {
    case "low":
      return <MoodSadIcon size={size} color={nathAccent.roseSoft} />;
    case "neutral":
      return <MoodCalmIcon size={size} color={brand.primary[400]} />;
    case "good":
      return <MoodHappyIcon size={size} color={brand.primary[500]} />;
    case "great":
      return <MoodAmadaIcon size={size} color={cleanDesign.pink[500]} />;
  }
}

interface HeartMoodSliderProps {
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  onInteracted?: () => void;
  initialValue?: number;
  title?: string;
  disabled?: boolean;
}

export function HeartMoodSlider({
  onValueChange,
  onValueCommit,
  onInteracted,
  initialValue = 0.5,
  title = "Como você está agora?",
  disabled = false,
}: HeartMoodSliderProps) {
  const translateX = useSharedValue(initialValue * SLIDER_WIDTH);
  const heartScale = useSharedValue(1);
  const pulse = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  const lastCheckpointRef = useRef<number | null>(null);
  const hasInteractedRef = useRef(false);

  const [descriptor, setDescriptor] = useState(getMoodDescriptor(initialValue));

  const notifyChange = useCallback(
    (value: number) => {
      if (!hasInteractedRef.current && onInteracted) {
        hasInteractedRef.current = true;
        onInteracted();
      }
      onValueChange?.(value);
      setDescriptor(getMoodDescriptor(value));
    },
    [onValueChange, onInteracted]
  );

  const notifyCommit = useCallback(
    (value: number) => {
      onValueCommit?.(value);
      setDescriptor(getMoodDescriptor(value));
    },
    [onValueCommit]
  );

  const maybeHaptic = useCallback((normalizedValue: number) => {
    const hit = HAPTIC_CHECKPOINTS.find(
      (c) =>
        normalizedValue >= c && (lastCheckpointRef.current == null || lastCheckpointRef.current < c)
    );

    if (hit) {
      lastCheckpointRef.current = hit;
      void Haptics.selectionAsync();
    }

    if (normalizedValue < 0.25) {
      lastCheckpointRef.current = null;
    }
  }, []);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      context.value = { x: translateX.value };
      heartScale.value = withSpring(1.12, { damping: 18, stiffness: 280 });
      pulse.value = withSpring(1, { damping: 16, stiffness: 220 });
    })
    .onUpdate((event) => {
      const newX = Math.max(0, Math.min(SLIDER_WIDTH, context.value.x + event.translationX));
      translateX.value = newX;

      const normalizedValue = newX / SLIDER_WIDTH;
      runOnJS(notifyChange)(normalizedValue);
      runOnJS(maybeHaptic)(normalizedValue);
    })
    .onEnd(() => {
      heartScale.value = withSpring(1, { damping: 18, stiffness: 280 });
      pulse.value = withSpring(0, { damping: 16, stiffness: 220 });

      const normalizedValue = translateX.value / SLIDER_WIDTH;
      runOnJS(notifyCommit)(normalizedValue);
    });

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onEnd((event) => {
      const tapX = Math.max(0, Math.min(SLIDER_WIDTH, event.x));
      translateX.value = withSpring(tapX, { damping: 22, stiffness: 180 });

      heartScale.value = withSpring(1.15, { damping: 12, stiffness: 350 });
      setTimeout(() => {
        heartScale.value = withSpring(1, { damping: 18, stiffness: 280 });
      }, 100);

      const normalizedValue = tapX / SLIDER_WIDTH;
      runOnJS(notifyChange)(normalizedValue);
      runOnJS(notifyCommit)(normalizedValue);
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const heartColor = interpolateColor(
      translateX.value,
      [0, SLIDER_WIDTH * 0.5, SLIDER_WIDTH],
      [COLOR_LOW, COLOR_MID, COLOR_HIGH]
    );

    const totalScale = heartScale.value * (1 + 0.06 * pulse.value);

    return {
      transform: [{ translateX: translateX.value - THUMB_SIZE / 2 }, { scale: totalScale }],
      backgroundColor: heartColor,
    };
  });

  const fillAnimatedStyle = useAnimatedStyle(() => {
    const fillColor = interpolateColor(
      translateX.value,
      [0, SLIDER_WIDTH * 0.5, SLIDER_WIDTH],
      [COLOR_LOW, COLOR_MID, COLOR_HIGH]
    );

    return {
      width: translateX.value,
      backgroundColor: fillColor,
    };
  });

  const heartIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SLIDER_WIDTH * 0.3, SLIDER_WIDTH],
      [0.6, 0.85, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  // Animação do ícone central
  const centerIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(1, { duration: 200 }) }],
    };
  });

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={[styles.card, disabled && styles.cardDisabled]}
    >
      {/* Título elegante */}
      <Text style={styles.title}>{title}</Text>

      {/* Indicadores visuais premium */}
      <View style={styles.labelsContainer}>
        {/* Ícone esquerdo - mood baixo */}
        <View style={styles.iconWrapper}>
          <MoodSadIcon size={24} color={neutral[400]} />
        </View>

        {/* Status central com ícone dinâmico */}
        <Animated.View style={[styles.centerLabelContainer, centerIconStyle]}>
          <View style={styles.moodIndicatorWrapper}>
            <MoodIndicator level={descriptor.level} size={32} />
          </View>
          <Text style={[styles.centerLabel, { color: descriptor.color }]}>{descriptor.label}</Text>
        </Animated.View>

        {/* Ícone direito - mood alto */}
        <View style={styles.iconWrapper}>
          <MoodAmadaIcon size={24} color={neutral[400]} />
        </View>
      </View>

      {/* Slider Premium */}
      <GestureDetector gesture={composedGesture}>
        <View style={styles.sliderContainer}>
          {/* Trilha de fundo com gradiente sutil */}
          <View style={styles.track}>
            <Animated.View style={[styles.trackFill, fillAnimatedStyle]} />
          </View>

          {/* Thumb premium com coração */}
          <Animated.View style={[styles.thumb, thumbAnimatedStyle]}>
            <Animated.View style={heartIconStyle}>
              <Ionicons name="heart" size={HEART_SIZE} color={neutral[0]} />
            </Animated.View>
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Indicadores de escala sutis */}
      <View style={styles.scaleIndicators}>
        <View style={styles.scaleDot} />
        <View style={styles.scaleDot} />
        <View style={styles.scaleDot} />
        <View style={styles.scaleDot} />
        <View style={styles.scaleDot} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: neutral[0],
    borderRadius: radius["3xl"],
    padding: spacing["2xl"],
    ...shadowPresets.md,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
    color: neutral[800],
    textAlign: "center",
    marginBottom: spacing.lg,
    letterSpacing: -0.3,
  },
  labelsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: SLIDER_WIDTH + 48,
    alignSelf: "center",
    marginBottom: spacing.lg,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },
  centerLabelContainer: {
    alignItems: "center",
    flex: 1,
  },
  moodIndicatorWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: neutral[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
    ...shadowPresets.sm,
  },
  centerLabel: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.2,
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: THUMB_SIZE,
    alignSelf: "center",
    justifyContent: "center",
  },
  track: {
    width: SLIDER_WIDTH,
    height: TRACK_HEIGHT,
    backgroundColor: neutral[100],
    borderRadius: TRACK_HEIGHT / 2,
    overflow: "hidden",
  },
  trackFill: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: neutral[0],
    ...shadowPresets.lg,
  },
  scaleIndicators: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SLIDER_WIDTH,
    alignSelf: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  scaleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: neutral[200],
  },
});

export default HeartMoodSlider;
