/**
 * OnboardingDateNathia - Seleção de Data
 * Design Nathia 2026 - Pastel + Clean + Acolhedor
 *
 * Estrutura:
 * - Header com progress
 * - Título dinâmico por estágio
 * - Card de data com DateTimePicker
 * - CTA continuar / pular
 */

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Components
import { Body, Caption, Title } from "@/components/ui";

// Store
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";

// Theme
import { Tokens, radius, shadows, spacing } from "@/theme/tokens";

// Types
import type { RootStackScreenProps } from "@/types/navigation";

// Utils
import { logger } from "@/utils/logger";

// Cores do design Nathia
const nathColors = {
  rosa: { DEFAULT: Tokens.brand.accent[300], light: Tokens.brand.accent[100] },
  azul: {
    DEFAULT: Tokens.brand.primary[200],
    light: Tokens.brand.primary[50],
    dark: Tokens.brand.primary[300],
  },
  verde: {
    DEFAULT: Tokens.brand.teal[200],
    light: Tokens.brand.teal[50],
    dark: Tokens.brand.teal[300],
  },
  laranja: {
    DEFAULT: Tokens.maternal.warmth.peach,
    light: Tokens.maternal.warmth.honey,
    dark: Tokens.brand.accent[300],
  },
  cream: Tokens.maternal.warmth.cream,
  white: Tokens.neutral[0],
  text: {
    DEFAULT: Tokens.neutral[800],
    muted: Tokens.neutral[500],
    light: Tokens.neutral[600],
  },
  border: Tokens.neutral[200],
  input: Tokens.neutral[50],
};

type Props = RootStackScreenProps<"OnboardingDate">;

/**
 * DateDisplayCard - Card de exibição de data
 */
const DateDisplayCard = ({
  date,
  placeholder,
  onPress,
}: {
  date: Date | null;
  placeholder: string;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formattedDate = date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : null;

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.dateCard, animatedStyle]}>
        <View style={styles.dateCardContent}>
          <View style={styles.dateIconContainer}>
            <Ionicons name="calendar-outline" size={24} color={nathColors.rosa.DEFAULT} />
          </View>
          <View style={styles.dateTextContainer}>
            {formattedDate ? (
              <>
                <Caption style={styles.dateLabel}>Data selecionada</Caption>
                <Body weight="bold" style={styles.dateValue}>
                  {formattedDate}
                </Body>
              </>
            ) : (
              <Body style={styles.datePlaceholder}>{placeholder}</Body>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={nathColors.text.muted} />
        </View>
      </Animated.View>
    </Pressable>
  );
};

/**
 * Progress Dots
 */
const ProgressDots = ({ current, total }: { current: number; total: number }) => (
  <View style={styles.progressDots}>
    {Array.from({ length: total }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          index < current && styles.dotFilled,
          index === current - 1 && styles.dotActive,
        ]}
      />
    ))}
  </View>
);

export default function OnboardingDateNathia({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // Store selectors
  const stage = useNathJourneyOnboardingStore((s) => s.data.stage);
  const dateKind = useNathJourneyOnboardingStore((s) => s.data.dateKind);
  const dateIso = useNathJourneyOnboardingStore((s) => s.data.dateIso);
  const setDate = useNathJourneyOnboardingStore((s) => s.setDate);
  const setCurrentScreen = useNathJourneyOnboardingStore((s) => s.setCurrentScreen);

  // Local state
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(dateIso ? new Date(dateIso) : null);

  // Stage-based logic
  const shouldSkip = stage === "GENERAL" || stage === "TENTANTE";
  const isGravida = stage?.startsWith("GRAVIDA_") ?? false;
  const isMae = stage === "PUERPERIO_0_40D" || stage === "MAE_RECENTE_ATE_1ANO";
  const isPuerperio = stage === "PUERPERIO_0_40D";

  // Skip for GENERAL/TENTANTE
  useEffect(() => {
    if (shouldSkip) {
      logger.info(`Skipping OnboardingDateNathia for stage: ${stage}`, "OnboardingDateNathia");
      navigation.replace("OnboardingConcerns");
    }
  }, [shouldSkip, navigation, stage]);

  // Set current screen
  useEffect(() => {
    if (!shouldSkip) {
      setCurrentScreen("OnboardingDate");
    }
  }, [shouldSkip, setCurrentScreen]);

  // Calculate date constraints
  const dateConstraints = useMemo(() => {
    const today = new Date();

    if (isGravida) {
      return {
        minDate: subDays(today, 7),
        maxDate: addDays(today, 280),
      };
    }

    if (isMae) {
      return {
        minDate: isPuerperio ? subDays(today, 40) : subDays(today, 365),
        maxDate: isPuerperio ? today : subDays(today, 41),
      };
    }

    return { minDate: undefined, maxDate: undefined };
  }, [isGravida, isMae, isPuerperio]);

  // Content based on stage
  const content = useMemo(() => {
    if (isGravida) {
      return {
        title: "Qual a data prevista do parto?",
        subtitle: "Assim posso acompanhar sua jornada semana a semana",
        placeholder: "Selecione a data prevista",
      };
    }
    return {
      title: "Quando seu bebê nasceu?",
      subtitle: "Vou personalizar seu conteúdo de acordo com a idade",
      placeholder: "Selecione a data de nascimento",
    };
  }, [isGravida]);

  // Can proceed validation
  const canProceed = useMemo(() => {
    if (dateKind === "due_date") return Boolean(dateIso);
    return true;
  }, [dateKind, dateIso]);

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenPicker = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setShowPicker(true);
  }, []);

  const handleDateChange = useCallback(
    (_event: unknown, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowPicker(false);
      }

      if (selectedDate) {
        setTempDate(selectedDate);
        const isoString = selectedDate.toISOString().split("T")[0];

        if (isGravida) {
          setDate("due_date", isoString);
        } else if (isMae) {
          setDate("baby_birth", isoString);
        }

        logger.info(`Date selected: ${isoString}`, "OnboardingDateNathia");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }
    },
    [isGravida, isMae, setDate]
  );

  const handleClosePicker = useCallback(() => {
    setShowPicker(false);
  }, []);

  const handleContinue = useCallback(async () => {
    if (!canProceed) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("OnboardingConcerns");
  }, [canProceed, navigation]);

  // Don't render if should skip
  if (shouldSkip) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[nathColors.rosa.light, nathColors.cream]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
      />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="chevron-back" size={24} color={nathColors.text.muted} />
        </Pressable>

        <ProgressDots current={2} total={5} />

        <View style={styles.backButton} />
      </Animated.View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).duration(500).springify()}>
          <Title style={styles.title}>{content.title}</Title>
          <Body style={styles.subtitle}>{content.subtitle}</Body>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500).springify()}>
          <DateDisplayCard
            date={tempDate}
            placeholder={content.placeholder}
            onPress={handleOpenPicker}
          />
        </Animated.View>

        {/* Native Date Picker */}
        {showPicker && (
          <View style={styles.pickerWrapper}>
            {Platform.OS === "ios" && (
              <Animated.View entering={FadeIn.duration(200)} style={styles.pickerHeader}>
                <Pressable onPress={handleClosePicker} style={styles.pickerDone}>
                  <Body weight="bold" style={styles.pickerDoneText}>
                    Concluir
                  </Body>
                </Pressable>
              </Animated.View>
            )}
            <DateTimePicker
              value={tempDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              minimumDate={dateConstraints.minDate}
              maximumDate={dateConstraints.maxDate}
              locale="pt-BR"
              style={styles.datePicker}
            />
          </View>
        )}
      </View>

      {/* Footer */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(500).springify()}
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <Pressable
          onPress={handleContinue}
          disabled={!canProceed}
          style={[styles.continueButton, !canProceed && styles.continueButtonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Continuar"
          accessibilityState={{ disabled: !canProceed }}
        >
          <Body
            weight="bold"
            style={[styles.continueButtonText, !canProceed && styles.continueButtonTextDisabled]}
          >
            Continuar
          </Body>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={!canProceed ? nathColors.text.muted : nathColors.white}
          />
        </Pressable>

        {!isGravida && (
          <Pressable onPress={handleContinue} style={styles.skipButton}>
            <Caption style={styles.skipText}>Pular por enquanto</Caption>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nathColors.cream,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  progressDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: nathColors.border,
  },

  dotFilled: {
    backgroundColor: nathColors.rosa.light,
  },

  dotActive: {
    backgroundColor: nathColors.rosa.DEFAULT,
    width: 24,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["2xl"],
  },

  title: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: nathColors.text.DEFAULT,
    marginBottom: spacing.md,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: nathColors.text.muted,
    marginBottom: spacing["3xl"],
  },

  dateCard: {
    backgroundColor: nathColors.white,
    borderRadius: radius["2xl"],
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: nathColors.border,
    ...shadows.sm,
  },

  dateCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: nathColors.rosa.light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
  },

  dateTextContainer: {
    flex: 1,
  },

  dateLabel: {
    fontSize: 12,
    color: nathColors.text.muted,
    marginBottom: spacing.xs,
  },

  dateValue: {
    fontSize: 16,
    color: nathColors.text.DEFAULT,
  },

  datePlaceholder: {
    fontSize: 16,
    color: nathColors.text.muted,
  },

  pickerWrapper: {
    marginTop: spacing["2xl"],
    backgroundColor: nathColors.white,
    borderRadius: radius["2xl"],
    overflow: "hidden",
    ...shadows.sm,
  },

  pickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: nathColors.border,
  },

  pickerDone: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  pickerDoneText: {
    fontSize: 16,
    color: nathColors.rosa.DEFAULT,
  },

  datePicker: {
    backgroundColor: nathColors.white,
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },

  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: nathColors.rosa.DEFAULT,
    borderRadius: radius["2xl"],
    paddingVertical: spacing.lg,
    ...shadows.md,
  },

  continueButtonDisabled: {
    backgroundColor: nathColors.input,
    ...shadows.sm,
  },

  continueButtonText: {
    fontSize: 16,
    color: nathColors.white,
  },

  continueButtonTextDisabled: {
    color: nathColors.text.muted,
  },

  skipButton: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },

  skipText: {
    fontSize: 14,
    color: nathColors.text.muted,
  },
});
