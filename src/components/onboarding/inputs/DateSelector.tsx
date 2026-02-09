/**
 * DateSelector - Seletor de data estilizado para onboarding
 *
 * Features:
 * - Display estilizado da data selecionada
 * - Botão para abrir picker nativo
 * - Validação de range
 * - Formatação em português
 * - Acessibilidade completa
 *
 * @example
 * <DateSelector
 *   value={selectedDate}
 *   onChange={(date) => setDate(date)}
 *   minDate={subDays(new Date(), 7)}
 *   maxDate={addDays(new Date(), 280)}
 *   placeholder="Selecione a DPP"
 * />
 */

import * as Haptics from "expo-haptics";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Tokens } from "@/theme/tokens";

// ===========================================
// TYPES
// ===========================================

export interface DateSelectorProps {
  /** Selected date value (ISO string) */
  value: string | null;
  /** Callback when date changes */
  onChange: (date: string | null) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Placeholder text when no date selected */
  placeholder?: string;
  /** Label for the change button */
  changeLabel?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Test ID for e2e testing */
  testID?: string;
}

// ===========================================
// COMPONENT
// ===========================================

export function DateSelector({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Selecione uma data",
  changeLabel = "Alterar data",
  disabled = false,
  testID,
}: DateSelectorProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(value ? new Date(value) : new Date());

  const handleOpenPicker = useCallback(() => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setShowPicker(true);
  }, [disabled]);

  const handleDateChange = useCallback(
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      // Android closes picker automatically
      if (Platform.OS === "android") {
        setShowPicker(false);
      }

      if (selectedDate) {
        setPickerDate(selectedDate);
        const isoDate = selectedDate.toISOString().split("T")[0];
        onChange(isoDate ?? null);
      }
    },
    [onChange]
  );

  const handleIOSConfirm = useCallback(() => {
    setShowPicker(false);
    const isoDate = pickerDate.toISOString().split("T")[0];
    onChange(isoDate ?? null);
  }, [pickerDate, onChange]);

  const handleIOSCancel = useCallback(() => {
    setShowPicker(false);
  }, []);

  // Format date for display
  const formattedDate = value
    ? new Date(value).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <View style={styles.container} testID={testID}>
      {/* Date display card */}
      {formattedDate && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.dateCard}>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </Animated.View>
      )}

      {/* Open picker button */}
      <Pressable
        onPress={handleOpenPicker}
        disabled={disabled}
        style={[styles.pickerButton, disabled && styles.pickerButtonDisabled]}
        accessibilityLabel={formattedDate ? changeLabel : placeholder}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <Text
          style={[styles.pickerButtonText, !formattedDate && styles.pickerButtonTextPlaceholder]}
        >
          {formattedDate ? changeLabel : placeholder}
        </Text>
      </Pressable>

      {/* Native date picker */}
      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}

      {/* iOS date picker with confirm/cancel */}
      {showPicker && Platform.OS === "ios" && (
        <View style={styles.iosPickerContainer}>
          <View style={styles.iosPickerHeader}>
            <Pressable
              onPress={handleIOSCancel}
              style={styles.iosPickerButton}
              accessibilityLabel="Cancelar"
              accessibilityRole="button"
            >
              <Text style={styles.iosPickerCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleIOSConfirm}
              style={styles.iosPickerButton}
              accessibilityLabel="Confirmar"
              accessibilityRole="button"
            >
              <Text style={styles.iosPickerConfirmText}>Confirmar</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={minDate}
            maximumDate={maxDate}
            style={styles.iosPicker}
          />
        </View>
      )}
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    gap: Tokens.spacing.md,
  },
  dateCard: {
    backgroundColor: Tokens.brand.primary[50],
    paddingVertical: Tokens.spacing.xl,
    paddingHorizontal: Tokens.spacing["2xl"],
    borderRadius: Tokens.radius["2xl"],
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  dateText: {
    fontSize: 20,
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontWeight: "600",
    color: Tokens.neutral[800],
    textTransform: "capitalize",
  },
  pickerButton: {
    backgroundColor: Tokens.neutral[0],
    borderWidth: 1.5,
    borderColor: Tokens.neutral[200],
    borderRadius: Tokens.radius.xl,
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing["2xl"],
    alignItems: "center",
    minHeight: Tokens.accessibility.minTapTarget + 8,
    justifyContent: "center",
  },
  pickerButtonDisabled: {
    opacity: 0.5,
  },
  pickerButtonText: {
    fontSize: 16,
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontWeight: "600",
    color: Tokens.brand.accent[500],
  },
  pickerButtonTextPlaceholder: {
    color: Tokens.neutral[500],
  },
  iosPickerContainer: {
    backgroundColor: Tokens.neutral[0],
    borderRadius: Tokens.radius["2xl"],
    overflow: "hidden",
    ...Tokens.shadows.lg,
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Tokens.spacing.lg,
    paddingVertical: Tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Tokens.neutral[200],
  },
  iosPickerButton: {
    paddingVertical: Tokens.spacing.sm,
    paddingHorizontal: Tokens.spacing.md,
    minHeight: Tokens.accessibility.minTapTarget,
    justifyContent: "center",
  },
  iosPickerCancelText: {
    fontSize: 16,
    fontFamily: Tokens.typography.fontFamily.medium,
    fontWeight: "500",
    color: Tokens.neutral[500],
  },
  iosPickerConfirmText: {
    fontSize: 16,
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontWeight: "600",
    color: Tokens.brand.accent[500],
  },
  iosPicker: {
    height: 200,
  },
});

// ===========================================
// EXPORTS
// ===========================================

export default DateSelector;
