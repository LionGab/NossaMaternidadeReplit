/**
 * OnboardingDate - Flo Health Minimal Design
 *
 * Clean, minimal date selection screen following Flo Health design principles:
 * - Subtle pink-to-white gradient background
 * - Manrope typography throughout
 * - Progress indicator at top
 * - Clean date picker interface
 * - CTA button at bottom using Button component
 *
 * Features:
 * - Branching: GENERAL/TENTANTE skip this screen
 * - DPP for pregnant users, birth date for mothers
 * - Date range validation by stage
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { addDays, subDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/Button";
import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { Tokens } from "@/theme/tokens";
import { logger } from "@/utils/logger";
import { RootStackScreenProps } from "@/types/navigation";

// ===========================================
// TYPES
// ===========================================

type Props = RootStackScreenProps<"OnboardingDate">;

// ===========================================
// CONSTANTS
// ===========================================

const TOTAL_STEPS = 7;
const CURRENT_STEP = 2;

// ===========================================
// PROGRESS INDICATOR COMPONENT
// ===========================================

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const progress = current / total;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <Animated.View
          entering={FadeIn.delay(200).duration(400)}
          style={[styles.progressFill, { width: `${progress * 100}%` }]}
        />
      </View>
      <Text style={styles.progressText}>
        {current} de {total}
      </Text>
    </View>
  );
}

// ===========================================
// DATE DISPLAY CARD COMPONENT
// ===========================================

interface DateDisplayCardProps {
  date: Date | null;
  placeholder: string;
  onPress: () => void;
}

function DateDisplayCard({ date, placeholder, onPress }: DateDisplayCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const formattedDate = date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : null;

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.dateCard, animatedStyle]}>
        <View style={styles.dateCardContent}>
          <View style={styles.dateIconContainer}>
            <Ionicons name="calendar-outline" size={24} color={Tokens.brand.accent[500]} />
          </View>
          <View style={styles.dateTextContainer}>
            {formattedDate ? (
              <>
                <Text style={styles.dateLabel}>Data selecionada</Text>
                <Text style={styles.dateValue}>{formattedDate}</Text>
              </>
            ) : (
              <Text style={styles.datePlaceholder}>{placeholder}</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={Tokens.neutral[400]} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function OnboardingDate({ navigation }: Props) {
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
      logger.info(`Skipping OnboardingDate for stage: ${stage}`, "OnboardingDate");
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
        title: "Qual a data prevista\ndo parto?",
        subtitle: "Assim podemos acompanhar sua jornada semana a semana",
        placeholder: "Selecione a data prevista",
      };
    }
    return {
      title: "Quando seu bebê\nnasceu?",
      subtitle: "Vamos personalizar seu conteudo de acordo com a idade",
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
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

        logger.info(`Date selected: ${isoString}`, "OnboardingDate");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }
    },
    [isGravida, isMae, setDate]
  );

  const handleClosePicker = useCallback(() => {
    setShowPicker(false);
  }, []);

  const handleContinue = useCallback(() => {
    if (!canProceed) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    navigation.navigate("OnboardingConcerns");
  }, [canProceed, navigation]);

  // Don't render if should skip
  if (shouldSkip) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Tokens.cleanDesign.pink[50], Tokens.cleanDesign.pink[100], Tokens.neutral[0]]}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color={Tokens.neutral[800]} />
        </Pressable>

        <ProgressIndicator current={CURRENT_STEP} total={TOTAL_STEPS} />

        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.delay(100).duration(500).springify()}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.subtitle}>{content.subtitle}</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500).springify()}
          style={styles.datePickerContainer}
        >
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
                  <Text style={styles.pickerDoneText}>Concluir</Text>
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
        style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}
      >
        <Button
          variant="accent"
          size="lg"
          fullWidth
          onPress={handleContinue}
          disabled={!canProceed}
        >
          Continuar
        </Button>

        {!isGravida && (
          <Pressable
            onPress={handleContinue}
            style={styles.skipButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.skipText}>Pular por enquanto</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.neutral[0],
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingBottom: Tokens.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Tokens.radius.full,
    backgroundColor: Tokens.neutral[0],
    alignItems: "center",
    justifyContent: "center",
    ...Tokens.shadows.sm,
  },
  headerSpacer: {
    width: 40,
  },

  // Progress
  progressContainer: {
    alignItems: "center",
    gap: Tokens.spacing.xs,
  },
  progressTrack: {
    width: 120,
    height: 4,
    backgroundColor: Tokens.neutral[200],
    borderRadius: Tokens.radius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Tokens.brand.accent[500],
    borderRadius: Tokens.radius.full,
  },
  progressText: {
    fontFamily: Tokens.typography.fontFamily.medium,
    fontSize: Tokens.typography.caption.fontSize,
    color: Tokens.neutral[500],
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing["4xl"],
  },
  titleContainer: {
    marginBottom: Tokens.spacing["4xl"],
  },
  title: {
    fontFamily: Tokens.typography.fontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
    color: Tokens.neutral[900],
    marginBottom: Tokens.spacing.md,
  },
  subtitle: {
    fontFamily: Tokens.typography.fontFamily.base,
    fontSize: Tokens.typography.bodyMedium.fontSize,
    lineHeight: Tokens.typography.bodyMedium.lineHeight,
    color: Tokens.neutral[500],
  },

  // Date Picker
  datePickerContainer: {
    marginTop: Tokens.spacing.lg,
  },
  dateCard: {
    backgroundColor: Tokens.neutral[0],
    borderRadius: Tokens.radius.xl,
    padding: Tokens.spacing.xl,
    borderWidth: 1,
    borderColor: Tokens.neutral[200],
    ...Tokens.shadows.flo.soft,
  },
  dateCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Tokens.radius.lg,
    backgroundColor: Tokens.brand.accent[50],
    alignItems: "center",
    justifyContent: "center",
    marginRight: Tokens.spacing.lg,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    fontFamily: Tokens.typography.fontFamily.medium,
    fontSize: Tokens.typography.caption.fontSize,
    color: Tokens.neutral[500],
    marginBottom: Tokens.spacing.xs,
  },
  dateValue: {
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontSize: Tokens.typography.bodyLarge.fontSize,
    color: Tokens.neutral[900],
  },
  datePlaceholder: {
    fontFamily: Tokens.typography.fontFamily.medium,
    fontSize: Tokens.typography.bodyMedium.fontSize,
    color: Tokens.neutral[400],
  },

  // Picker
  pickerWrapper: {
    marginTop: Tokens.spacing["2xl"],
    backgroundColor: Tokens.neutral[0],
    borderRadius: Tokens.radius.xl,
    overflow: "hidden",
    ...Tokens.shadows.flo.soft,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: Tokens.spacing.lg,
    paddingVertical: Tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Tokens.neutral[200],
  },
  pickerDone: {
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.sm,
  },
  pickerDoneText: {
    fontFamily: Tokens.typography.fontFamily.semibold,
    fontSize: Tokens.typography.bodyMedium.fontSize,
    color: Tokens.brand.accent[500],
  },
  datePicker: {
    backgroundColor: Tokens.neutral[0],
  },

  // Footer
  footer: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.xl,
    gap: Tokens.spacing.lg,
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: Tokens.spacing.md,
  },
  skipText: {
    fontFamily: Tokens.typography.fontFamily.medium,
    fontSize: Tokens.typography.bodyMedium.fontSize,
    color: Tokens.neutral[500],
  },
});
