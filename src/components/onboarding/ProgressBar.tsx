/**
 * ProgressBar - Barra de progresso animada para onboarding
 * Mostra progresso de 0-100% com animação spring
 */

import React, { memo, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";

interface ProgressBarProps {
  currentStep: number; // 0-7
  totalSteps?: number;
  showText?: boolean;
}

function ProgressBarComponent({ currentStep, totalSteps = 7, showText = true }: ProgressBarProps) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  // Calcular porcentagem
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  // Animar progresso
  useEffect(() => {
    progress.value = withSpring(percentage / 100, {
      damping: 20,
      stiffness: 90,
    });
  }, [percentage, progress]);

  // Estilo animado da barra
  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Progresso: ${currentStep} de ${totalSteps}`}
      accessibilityValue={{
        min: 0,
        max: totalSteps,
        now: currentStep,
        text: `${Math.round(percentage)}%`,
      }}
    >
      {showText && (
        <Text style={[styles.text, { color: theme.text.secondary }]}>
          {currentStep} de {totalSteps}
        </Text>
      )}
      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.isDark ? Tokens.overlay.lightInverted : Tokens.overlay.light,
          },
        ]}
      >
        <Animated.View style={animatedBarStyle}>
          <LinearGradient
            colors={Tokens.gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

export const ProgressBar = memo(ProgressBarComponent);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Tokens.spacing.sm,
  },
  text: {
    fontSize: Tokens.typography.labelSmall.fontSize,
    fontWeight: Tokens.typography.labelMedium.fontWeight,
    textAlign: "center",
  },
  track: {
    height: 6,
    borderRadius: Tokens.radius.full,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Tokens.radius.full,
  },
});
