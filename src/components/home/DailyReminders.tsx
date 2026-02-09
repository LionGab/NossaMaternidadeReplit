/**
 * DailyReminders - Próximos lembretes do dia
 *
 * Mostra os 2 próximos lembretes configurados para aumentar
 * retorno diário ao app (maior ganho de retenção).
 *
 * Features:
 * - Mock data (TODO: integrar com reminders-store real)
 * - Ícone + título + horário
 * - Link para ajustar lembretes
 * - WCAG AAA compliant
 */

import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { useRemindersStore } from "@/state/reminders-store";
import type { RootStackParamList } from "@/types/navigation";
import { accessibility, brand, neutral, radius, shadows, spacing } from "@/theme/tokens";
import { logger } from "@/utils/logger";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

// ============================================================================
// COMPONENT
// ============================================================================

export const DailyReminders: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark, text, surface } = useTheme();

  // Busca os 2 próximos lembretes (não completados) do store
  const getUpcomingReminders = useRemindersStore((s) => s.getUpcomingReminders);
  const upcomingReminders = getUpcomingReminders(2);

  // Colors
  const cardBg = isDark ? surface.card : neutral[50];
  const textPrimary = isDark ? text.primary : neutral[800];
  const textSecondary = isDark ? text.secondary : neutral[500];
  const iconColor = isDark ? brand.primary[400] : brand.primary[500];
  const linkColor = brand.primary[600];

  // Handler para ajustar lembretes
  // TODO: Implementar tela Settings com tab de reminders
  const handleAdjust = () => {
    logger.info("Adjust reminders clicked (Settings screen not implemented)", "DailyReminders");
    // Placeholder: navegando para NotificationSettings até implementar Settings completo
    navigation.navigate("NotificationSettings");
  };

  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      {/* Header com título + link ajustar */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textPrimary }]}>Hoje</Text>
        <Pressable
          onPress={handleAdjust}
          style={styles.adjustButton}
          accessibilityRole="button"
          accessibilityLabel="Ajustar lembretes"
        >
          <Text style={[styles.adjustText, { color: linkColor }]}>AJUSTAR</Text>
        </Pressable>
      </View>

      {/* Lista de lembretes */}
      <View style={styles.remindersContainer}>
        {upcomingReminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderRow}>
            <Ionicons name={reminder.icon as IoniconsName} size={18} color={iconColor} />
            <Text style={[styles.reminderText, { color: textPrimary }]}>{reminder.title}</Text>
            <Text style={[styles.reminderTime, { color: textSecondary }]}>{reminder.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  adjustButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    minHeight: accessibility.minTapTarget,
    justifyContent: "center",
  },
  adjustText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0.5,
  },
  remindersContainer: {
    gap: spacing.sm,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  reminderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
  },
  reminderTime: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
});

export default DailyReminders;
