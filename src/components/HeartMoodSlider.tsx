/**
 * HeartMoodSlider - Premium Emotional Slider
 *
 * Slider emocional premium com icones SVG profissionais.
 *
 * Features:
 * - Icones SVG animados (sem emojis)
 * - Fill progressivo com cor dinamica
 * - Thumb 40px visual / 48px hit area
 * - Track 6px com ticks refinados
 * - Dark mode support
 * - Haptic feedback nos checkpoints
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import { type LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
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
import {
  brand,
  cleanDesign,
  nathAccent,
  neutral,
  radius,
  spacing,
  typography,
} from "../theme/tokens";
import { useTheme } from "../hooks/useTheme";
import { shadowPresets } from "../utils/shadow";
import { MoodSadIcon, MoodCalmIcon, MoodHappyIcon, MoodAmadaIcon } from "./icons/MoodIcons";

// Constantes do slider
const DEFAULT_SLIDER_WIDTH = 280;
const CARD_PADDING = spacing["2xl"]; // 24px
const TRACK_HEIGHT = 6;
const THUMB_SIZE = 40;
const THUMB_HIT_SLOP = 4; // extra hit area each side = 48px total
const HEART_SIZE = 20;
const ICON_SIZE = 28;

// Cores do gradiente emocional
const COLOR_LOW = nathAccent.roseSoft;
const COLOR_MID = brand.primary[300];
const COLOR_HIGH = brand.primary[500];

// Checkpoints para haptic feedback
const HAPTIC_CHECKPOINTS = [0.25, 0.5, 0.75, 1.0];

type MoodLevel = "low" | "neutral" | "good" | "great";

interface MoodDescriptor {
  level: MoodLevel;
  label: string;
  color: string;
}

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
  footer?: React.ReactNode;
}

export function HeartMoodSlider({
  onValueChange,
  onValueCommit,
  onInteracted,
  initialValue = 0.5,
  title = "Como você está agora?",
  disabled = false,
  footer,
}: HeartMoodSliderProps) {
  const { isDark } = useTheme();
  const [sliderWidth, setSliderWidth] = useState(DEFAULT_SLIDER_WIDTH);
  const sliderWidthSV = useSharedValue(DEFAULT_SLIDER_WIDTH);
  const translateX = useSharedValue(initialValue * DEFAULT_SLIDER_WIDTH);
  const heartScale = useSharedValue(1);
  const pulse = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  const lastCheckpointRef = useRef<number | null>(null);
  const hasInteractedRef = useRef(false);
  const hasLayoutRef = useRef(false);

  const [descriptor, setDescriptor] = useState(getMoodDescriptor(initialValue));

  // Colors responsive to theme
  const cardBg = isDark ? neutral[800] : neutral[0];
  const titleColor = isDark ? neutral[100] : neutral[800];
  const trackBg = isDark ? neutral[700] : neutral[100];
  const indicatorBg = isDark ? neutral[700] : neutral[50];
  const scaleDotColor = isDark ? neutral[600] : neutral[200];
  const scaleDotCenterColor = isDark ? neutral[500] : neutral[300];

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const cardWidth = e.nativeEvent.layout.width;
      const newSliderWidth = cardWidth - CARD_PADDING * 2;
      if (newSliderWidth > 0 && !hasLayoutRef.current) {
        hasLayoutRef.current = true;
        setSliderWidth(newSliderWidth);
        sliderWidthSV.value = newSliderWidth;
        translateX.value = initialValue * newSliderWidth;
      }
    },
    [initialValue, sliderWidthSV, translateX]
  );

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
    .hitSlop({
      top: THUMB_HIT_SLOP,
      bottom: THUMB_HIT_SLOP,
      left: THUMB_HIT_SLOP,
      right: THUMB_HIT_SLOP,
    })
    .onStart(() => {
      context.value = { x: translateX.value };
      heartScale.value = withSpring(1.12, { damping: 18, stiffness: 280 });
      pulse.value = withSpring(1, { damping: 16, stiffness: 220 });
    })
    .onUpdate((event) => {
      const w = sliderWidthSV.value;
      const newX = Math.max(0, Math.min(w, context.value.x + event.translationX));
      translateX.value = newX;

      const normalizedValue = w > 0 ? newX / w : 0;
      runOnJS(notifyChange)(normalizedValue);
      runOnJS(maybeHaptic)(normalizedValue);
    })
    .onEnd(() => {
      heartScale.value = withSpring(1, { damping: 18, stiffness: 280 });
      pulse.value = withSpring(0, { damping: 16, stiffness: 220 });

      const w = sliderWidthSV.value;
      const normalizedValue = w > 0 ? translateX.value / w : 0;
      runOnJS(notifyCommit)(normalizedValue);
    });

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onEnd((event) => {
      const w = sliderWidthSV.value;
      const tapX = Math.max(0, Math.min(w, event.x));
      translateX.value = withSpring(tapX, { damping: 22, stiffness: 180 });

      heartScale.value = withSpring(1.15, { damping: 12, stiffness: 350 });
      setTimeout(() => {
        heartScale.value = withSpring(1, { damping: 18, stiffness: 280 });
      }, 100);

      const normalizedValue = w > 0 ? tapX / w : 0;
      runOnJS(notifyChange)(normalizedValue);
      runOnJS(notifyCommit)(normalizedValue);
    });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const w = sliderWidthSV.value;
    const heartColor = interpolateColor(
      translateX.value,
      [0, w * 0.5, w],
      [COLOR_LOW, COLOR_MID, COLOR_HIGH]
    );

    const totalScale = heartScale.value * (1 + 0.06 * pulse.value);

    return {
      transform: [{ translateX: translateX.value - THUMB_SIZE / 2 }, { scale: totalScale }],
      backgroundColor: heartColor,
    };
  });

  const fillAnimatedStyle = useAnimatedStyle(() => {
    const w = sliderWidthSV.value;
    const fillColor = interpolateColor(
      translateX.value,
      [0, w * 0.5, w],
      [COLOR_LOW, COLOR_MID, COLOR_HIGH]
    );

    return {
      width: translateX.value,
      backgroundColor: fillColor,
    };
  });

  const heartIconStyle = useAnimatedStyle(() => {
    const w = sliderWidthSV.value;
    const opacity = interpolate(
      translateX.value,
      [0, w * 0.3, w],
      [0.7, 0.9, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  const centerIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(1, { duration: 200 }) }],
    };
  });

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={[styles.card, { backgroundColor: cardBg }, disabled && styles.cardDisabled]}
      onLayout={handleLayout}
    >
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>

      {/* Indicador de humor central */}
      <View style={styles.labelsContainer}>
        <Animated.View style={[styles.centerLabelContainer, centerIconStyle]}>
          <View style={[styles.moodIndicatorWrapper, { backgroundColor: indicatorBg }]}>
            <MoodIndicator level={descriptor.level} size={28} />
          </View>
          <Text style={[styles.centerLabel, { color: descriptor.color }]}>{descriptor.label}</Text>
        </Animated.View>
      </View>

      {/* Slider */}
      <GestureDetector gesture={composedGesture}>
        <View style={[styles.sliderContainer, { width: sliderWidth }]}>
          <View style={[styles.track, { width: sliderWidth, backgroundColor: trackBg }]}>
            <Animated.View style={[styles.trackFill, fillAnimatedStyle]} />
          </View>

          <Animated.View style={[styles.thumb, { borderColor: cardBg }, thumbAnimatedStyle]}>
            <Animated.View style={heartIconStyle}>
              <Ionicons name="heart" size={HEART_SIZE} color={neutral[0]} />
            </Animated.View>
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Ticks - centro mais proeminente */}
      <View style={[styles.scaleIndicators, { width: sliderWidth }]}>
        <View style={[styles.scaleDot, { backgroundColor: scaleDotColor }]} />
        <View style={[styles.scaleDot, { backgroundColor: scaleDotColor }]} />
        <View style={[styles.scaleDotCenter, { backgroundColor: scaleDotCenterColor }]} />
        <View style={[styles.scaleDot, { backgroundColor: scaleDotColor }]} />
        <View style={[styles.scaleDot, { backgroundColor: scaleDotColor }]} />
      </View>

      {/* Footer integrado (feedback + CTA) */}
      {footer && (
        <View style={[styles.footerArea, { borderTopColor: isDark ? neutral[700] : neutral[100] }]}>
          {footer}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius["2xl"],
    padding: spacing["2xl"],
    ...shadowPresets.md,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: typography.fontFamily.base,
    textAlign: "center",
    marginBottom: spacing.md,
    opacity: 0.7,
  },
  labelsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  centerLabelContainer: {
    alignItems: "center",
    flex: 1,
  },
  moodIndicatorWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
    ...shadowPresets.sm,
  },
  centerLabel: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
    letterSpacing: -0.2,
  },
  sliderContainer: {
    height: THUMB_SIZE + THUMB_HIT_SLOP * 2,
    alignSelf: "center",
    justifyContent: "center",
  },
  track: {
    height: TRACK_HEIGHT,
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
    borderWidth: 2.5,
    ...shadowPresets.md,
  },
  scaleIndicators: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  scaleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  scaleDotCenter: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  footerArea: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
});

export default HeartMoodSlider;
