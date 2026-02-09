/**
 * Nossa Maternidade - BreathingExerciseScreen
 * Flo Health Minimal Design - 3 breathing techniques: Box, 4-7-8, Calm
 *
 * Design Principles:
 * - Subtle gradient backgrounds
 * - Clean, minimal UI elements
 * - Soft shadows (shadows.flo.soft)
 * - Dark mode support
 * - Manrope typography
 */

import { useTheme } from "@/hooks/useTheme";
import { maternal, shadows, spacing, Tokens, typography } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BreathingTechnique = "box" | "478" | "calm";

interface Phase {
  name: string;
  duration: number;
  instruction: string;
}

interface Technique {
  name: string;
  description: string;
  duration: number;
  phases: Phase[];
  color: string;
  bgColors: readonly [string, string, string];
}

const TECHNIQUES: Record<BreathingTechnique, Technique> = {
  box: {
    name: "Respiracao Box",
    description: "4 segundos inspirar, 4 segurar, 4 expirar, 4 segurar",
    duration: 16000,
    phases: [
      { name: "Inspire", duration: 4000, instruction: "Inspire profundamente pelo nariz" },
      { name: "Segure", duration: 4000, instruction: "Segure o ar nos pulmoes" },
      { name: "Expire", duration: 4000, instruction: "Expire lentamente pela boca" },
      { name: "Segure", duration: 4000, instruction: "Segure com os pulmoes vazios" },
    ],
    color: Tokens.brand.primary[500],
    bgColors: maternal.breathing.box.bgColors,
  },
  "478": {
    name: "Tecnica 4-7-8",
    description: "4 segundos inspirar, 7 segurar, 8 expirar",
    duration: 19000,
    phases: [
      { name: "Inspire", duration: 4000, instruction: "Inspire pelo nariz" },
      { name: "Segure", duration: 7000, instruction: "Segure a respiracao" },
      { name: "Expire", duration: 8000, instruction: "Expire lentamente pela boca" },
    ],
    color: Tokens.brand.secondary[500],
    bgColors: maternal.breathing.technique478.bgColors,
  },
  calm: {
    name: "Respiracao Calma",
    description: "5 segundos inspirar, 5 segundos expirar",
    duration: 10000,
    phases: [
      { name: "Inspire", duration: 5000, instruction: "Inspire suavemente" },
      { name: "Expire", duration: 5000, instruction: "Expire relaxando" },
    ],
    color: Tokens.semantic.light.success,
    bgColors: maternal.breathing.calm.bgColors,
  },
};

export default function BreathingExerciseScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>("calm");
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [cycles, setCycles] = useState(0);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  const technique = TECHNIQUES[selectedTechnique];

  // Flo Clean color tokens
  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[600];
  const glassBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)";

  // Background gradient for Flo Clean style
  const floGradient = isDark
    ? ([Tokens.neutral[950], Tokens.neutral[900], Tokens.neutral[950]] as const)
    : technique.bgColors;

  const startBreathingCycle = useCallback(() => {
    const phases = technique.phases;
    let phaseIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const runPhase = () => {
      const phase = phases[phaseIndex];
      const isInhale = phase.name === "Inspire";
      const isHold = phase.name === "Segure";

      setCurrentPhase(phaseIndex);

      // Haptic feedback at phase start
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (isInhale) {
        scale.value = withTiming(1.6, {
          duration: phase.duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        opacity.value = withTiming(0.7, { duration: phase.duration });
      } else if (isHold) {
        // Keep current scale
      } else {
        // Exhale
        scale.value = withTiming(1, {
          duration: phase.duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        opacity.value = withTiming(0.4, { duration: phase.duration });
      }

      timeoutId = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        if (phaseIndex === 0) {
          setCycles((c) => c + 1);
        }
        runPhase();
      }, phase.duration);
    };

    runPhase();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [technique.phases, scale, opacity]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (isActive) {
      cleanup = startBreathingCycle();
    } else {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = withTiming(1, { duration: 500 });
      opacity.value = withTiming(0.4, { duration: 500 });
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [isActive, selectedTechnique, startBreathingCycle, scale, opacity]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isActive) {
      setCycles(0);
      setCurrentPhase(0);
    }
    setIsActive(!isActive);
  };

  const handleTechniqueSelect = (tech: BreathingTechnique) => {
    if (isActive) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTechnique(tech);
    setCurrentPhase(0);
  };

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const currentPhaseData = technique.phases[currentPhase];

  return (
    <LinearGradient colors={floGradient} style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* Flo Clean Header */}
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
            accessibilityLabel="Fechar exercicio"
            accessibilityRole="button"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: glassBg,
              alignItems: "center",
              justifyContent: "center",
              ...shadows.flo.minimal,
            }}
          >
            <Ionicons name="close" size={24} color={textPrimary} />
          </Pressable>

          <Text
            style={{
              fontSize: typography.titleMedium.fontSize,
              fontFamily: typography.fontFamily.bold,
              fontWeight: "700",
              color: textPrimary,
              letterSpacing: -0.3,
            }}
          >
            {technique.name}
          </Text>

          <View style={{ width: 44 }} />
        </View>

        {/* Main Content */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: spacing.xl,
          }}
        >
          {/* Breathing Circle - Flo Clean Style */}
          <Animated.View entering={FadeIn.duration(600)}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginBottom: spacing["3xl"],
              }}
            >
              {/* Outer glow ring */}
              <View
                style={{
                  position: "absolute",
                  width: 220,
                  height: 220,
                  borderRadius: 110,
                  backgroundColor: `${technique.color}15`,
                }}
              />

              {/* Animated breathing circle */}
              <Animated.View
                style={[
                  {
                    width: 180,
                    height: 180,
                    borderRadius: 90,
                    backgroundColor: technique.color,
                    ...shadows.glow(technique.color),
                  },
                  animatedCircleStyle,
                ]}
              />

              {/* Center Text */}
              <View
                style={{
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isActive ? (
                  <>
                    <Text
                      style={{
                        color: Tokens.neutral[0],
                        fontSize: 28,
                        fontFamily: typography.fontFamily.bold,
                        fontWeight: "700",
                        marginBottom: spacing.xs,
                        letterSpacing: -0.5,
                      }}
                    >
                      {currentPhaseData?.name}
                    </Text>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: typography.bodySmall.fontSize,
                        fontFamily: typography.fontFamily.medium,
                        textAlign: "center",
                      }}
                    >
                      Ciclo {cycles + 1}
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="leaf" size={40} color={Tokens.neutral[0]} />
                    <Text
                      style={{
                        color: Tokens.neutral[0],
                        fontSize: typography.bodyMedium.fontSize,
                        fontFamily: typography.fontFamily.semibold,
                        fontWeight: "600",
                        marginTop: spacing.sm,
                        textAlign: "center",
                      }}
                    >
                      Toque para{"\n"}comecar
                    </Text>
                  </>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Instruction Text - Flo Clean Card */}
          {isActive && (
            <Animated.View
              entering={FadeInUp.duration(400)}
              style={{
                backgroundColor: glassBg,
                borderRadius: Tokens.radius["2xl"],
                paddingVertical: spacing.lg,
                paddingHorizontal: spacing.xl,
                marginBottom: spacing.xl,
                ...shadows.flo.soft,
              }}
            >
              <Text
                style={{
                  color: textPrimary,
                  fontSize: typography.bodyLarge.fontSize,
                  fontFamily: typography.fontFamily.medium,
                  textAlign: "center",
                  lineHeight: 24,
                }}
              >
                {currentPhaseData?.instruction}
              </Text>
            </Animated.View>
          )}

          {/* Control Button - Flo Clean Style */}
          <Pressable
            onPress={handleToggle}
            accessibilityLabel={isActive ? "Pausar exercicio" : "Comecar exercicio"}
            accessibilityRole="button"
            style={{ marginBottom: spacing.xl }}
          >
            <View
              style={{
                backgroundColor: technique.color,
                paddingHorizontal: spacing["4xl"],
                paddingVertical: spacing.lg,
                borderRadius: Tokens.radius.full,
                ...shadows.flo.cta,
              }}
            >
              <Text
                style={{
                  color: Tokens.neutral[0],
                  fontSize: typography.labelLarge.fontSize,
                  fontFamily: typography.fontFamily.bold,
                  fontWeight: "700",
                  letterSpacing: 0.3,
                }}
              >
                {isActive ? "Pausar" : "Comecar"}
              </Text>
            </View>
          </Pressable>

          {/* Technique Info Card - Flo Clean */}
          {!isActive && (
            <Animated.View
              entering={FadeInUp.delay(200).duration(400)}
              style={{
                backgroundColor: glassBg,
                borderRadius: Tokens.radius["2xl"],
                padding: spacing.lg,
                marginBottom: spacing.xl,
                width: "100%",
                maxWidth: 320,
                ...shadows.flo.soft,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.sm }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: `${technique.color}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: spacing.sm,
                  }}
                >
                  <Ionicons name="information" size={16} color={technique.color} />
                </View>
                <Text
                  style={{
                    color: textPrimary,
                    fontSize: typography.labelMedium.fontSize,
                    fontFamily: typography.fontFamily.semibold,
                    fontWeight: "600",
                  }}
                >
                  Como funciona
                </Text>
              </View>
              <Text
                style={{
                  color: textSecondary,
                  fontSize: typography.bodySmall.fontSize,
                  fontFamily: typography.fontFamily.base,
                  lineHeight: 20,
                }}
              >
                {technique.description}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Technique Selector - Flo Clean Style */}
        {!isActive && (
          <Animated.View
            entering={FadeInUp.delay(300).duration(400)}
            style={{
              paddingHorizontal: spacing.xl,
              paddingBottom: insets.bottom + spacing.xl,
            }}
          >
            {/* Section Title */}
            <Text
              style={{
                color: textSecondary,
                fontSize: typography.labelMedium.fontSize,
                fontFamily: typography.fontFamily.semibold,
                fontWeight: "600",
                marginBottom: spacing.md,
                textAlign: "center",
              }}
            >
              Escolha uma tecnica
            </Text>

            {/* Technique Pills - Flo Clean */}
            <View
              style={{
                flexDirection: "row",
                gap: spacing.sm,
                backgroundColor: glassBg,
                borderRadius: Tokens.radius.full,
                padding: spacing.xs,
                ...shadows.flo.minimal,
              }}
            >
              {(Object.keys(TECHNIQUES) as BreathingTechnique[]).map((tech) => {
                const t = TECHNIQUES[tech];
                const isSelected = selectedTechnique === tech;
                return (
                  <Pressable
                    key={tech}
                    onPress={() => handleTechniqueSelect(tech)}
                    accessibilityLabel={`Selecionar ${t.name}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={{ flex: 1 }}
                  >
                    <View
                      style={{
                        backgroundColor: isSelected ? t.color : "transparent",
                        paddingVertical: spacing.md,
                        paddingHorizontal: spacing.sm,
                        borderRadius: Tokens.radius.full,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.labelSmall.fontSize,
                          fontFamily: typography.fontFamily.semibold,
                          fontWeight: "600",
                          textAlign: "center",
                          color: isSelected ? Tokens.neutral[0] : textSecondary,
                        }}
                        numberOfLines={1}
                      >
                        {t.name.replace("Respiracao ", "").replace("Tecnica ", "")}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}
