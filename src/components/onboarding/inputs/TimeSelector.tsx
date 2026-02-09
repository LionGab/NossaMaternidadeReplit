/**
 * TimeSelector - Componente de seleção de horário
 *
 * Features:
 * - Botão estilizado com horário formatado
 * - DateTimePicker nativo (spinner no iOS)
 * - Normaliza para horas cheias
 * - Haptic feedback
 */

import React, { useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Tokens, DEFAULT_CHECKIN_TIME } from "@/theme/tokens";
import { useTheme } from "@/hooks/useTheme";
import { logger } from "@/utils/logger";

// ===========================================
// TYPES
// ===========================================

export interface TimeSelectorProps {
  /** Current hour (0-23) */
  value: number | null;
  /** Callback when hour changes */
  onChange: (hour: number) => void;
  /** Label above the selector */
  label?: string;
  /** Format function for display */
  formatTime?: (hour: number) => string;
  testID?: string;
}

// ===========================================
// HELPERS
// ===========================================

const defaultFormatTime = (hour: number): string => {
  return `${hour.toString().padStart(2, "0")}:00`;
};

// ===========================================
// COMPONENT
// ===========================================

export function TimeSelector({
  value,
  onChange,
  label = "Horário",
  formatTime = defaultFormatTime,
  testID,
}: TimeSelectorProps) {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  // Initialize time from value or default
  const [time, setTime] = useState<Date>(() => {
    const hour =
      value !== null && Number.isInteger(value)
        ? value
        : Number.parseInt(DEFAULT_CHECKIN_TIME.split(":")[0] ?? "21", 10);
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date;
  });

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setShowPicker(true);
  }, []);

  const handleTimeChange = useCallback(
    (_event: unknown, selectedTime?: Date) => {
      if (Platform.OS === "android") {
        setShowPicker(false);
      }

      if (selectedTime) {
        // Normalize to full hour
        const normalized = new Date(selectedTime);
        normalized.setMinutes(0, 0, 0);
        setTime(normalized);

        const hour = normalized.getHours();
        onChange(hour);
        logger.info(`Time selected: ${hour}:00`, "TimeSelector");
      }
    },
    [onChange]
  );

  // iOS: inline picker, hide when done
  const handleDone = useCallback(() => {
    setShowPicker(false);
  }, []);

  const displayHour = value !== null ? value : time.getHours();

  return (
    <View testID={testID}>
      {label && <Text style={[styles.label, { color: theme.text.secondary }]}>{label}</Text>}

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.surface.card,
            borderColor: theme.colors.border.subtle,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        accessibilityLabel={`Selecionar horário, atual: ${formatTime(displayHour)}`}
        accessibilityRole="button"
      >
        <Text style={[styles.buttonText, { color: theme.text.primary }]}>
          {formatTime(displayHour)}
        </Text>
      </Pressable>

      {/* Time Picker */}
      {showPicker && (
        <Animated.View entering={FadeInDown.duration(200)}>
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
            is24Hour={true}
          />
          {Platform.OS === "ios" && (
            <Pressable
              onPress={handleDone}
              style={[styles.doneButton, { backgroundColor: Tokens.brand.accent[400] }]}
              accessibilityLabel="Confirmar horário"
              accessibilityRole="button"
            >
              <Text style={styles.doneButtonText}>OK</Text>
            </Pressable>
          )}
        </Animated.View>
      )}
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  label: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    fontFamily: Tokens.typography.fontFamily.base,
    marginBottom: Tokens.spacing.sm,
  },
  button: {
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing["2xl"],
    borderRadius: Tokens.radius.lg,
    borderWidth: 1.5,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
    ...Tokens.shadows.sm,
  },
  buttonText: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
    fontFamily: Tokens.typography.fontFamily.semibold,
  },
  doneButton: {
    marginTop: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    alignItems: "center",
    minHeight: Tokens.accessibility.minTapTarget,
    justifyContent: "center",
  },
  doneButtonText: {
    color: Tokens.neutral[0],
    fontSize: Tokens.typography.labelMedium.fontSize,
    fontWeight: Tokens.typography.labelMedium.fontWeight,
    fontFamily: Tokens.typography.fontFamily.semibold,
  },
});
