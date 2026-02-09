import React, { useState, useMemo } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useCheckInStore } from "../state/store";
import { useTheme } from "../hooks/useTheme";
import {
  Tokens,
  COLORS,
  surface,
  semantic,
  overlay,
  typography,
  spacing,
  radius,
} from "../theme/tokens";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface CheckInOption {
  value: number;
  icon: IoniconName;
  label: string;
  color?: string;
}

const MOOD_OPTIONS: CheckInOption[] = [
  { value: 1, icon: "sad-outline", label: "Difícil" },
  { value: 2, icon: "cloud-outline", label: "Baixo" },
  { value: 3, icon: "remove-outline", label: "Ok" },
  { value: 4, icon: "happy-outline", label: "Bem" },
  { value: 5, icon: "sunny-outline", label: "Ótimo" },
];

const ENERGY_OPTIONS: CheckInOption[] = [
  { value: 1, icon: "battery-dead-outline", label: "Esgotada", color: Tokens.semantic.light.error },
  {
    value: 2,
    icon: "battery-half-outline",
    label: "Cansada",
    color: Tokens.semantic.light.warning,
  },
  { value: 3, icon: "flash-outline", label: "Normal", color: COLORS.legacyAccent.peach },
  { value: 4, icon: "flash", label: "Boa", color: Tokens.semantic.light.success },
  { value: 5, icon: "star", label: "Plena", color: Tokens.brand.accent[500] },
];

const SLEEP_OPTIONS: CheckInOption[] = [
  { value: 1, icon: "alert-circle-outline", label: "Péssimo" },
  { value: 2, icon: "moon-outline", label: "Ruim" },
  { value: 3, icon: "moon", label: "Regular" },
  { value: 4, icon: "bed-outline", label: "Bom" },
  { value: 5, icon: "sparkles", label: "Ótimo" },
];

type CheckInStep = "mood" | "energy" | "sleep" | "complete";

interface DailyCheckInProps {
  onComplete?: () => void;
}

/**
 * Cores semânticas para check-in com suporte a dark mode
 * Todas as cores mapeadas para o design-system
 */
const getCheckInColors = (isDark: boolean) => ({
  // Estado completo - verde suave
  completeBg: isDark ? semantic.dark.successLight : semantic.light.successLight,
  completeBorder: isDark ? semantic.dark.successBorder : semantic.light.successLight,
  completeIcon: isDark ? semantic.dark.success : semantic.light.success,
  completeText: isDark ? Tokens.brand.accent[300] : Tokens.brand.accent[900],
  completeSubtext: isDark ? Tokens.brand.accent[400] : Tokens.brand.accent[700],
  // Estado pendente - amarelo suave
  pendingBg: isDark ? semantic.dark.warningLight : semantic.light.warningLight,
  pendingBorder: isDark ? semantic.dark.warningBorder : semantic.light.warningLight,
  pendingIcon: isDark ? semantic.dark.warning : semantic.light.warning,
  pendingText: isDark ? COLORS.legacyAccent.peach : Tokens.neutral[800],
  pendingSubtext: isDark ? Tokens.neutral[400] : Tokens.neutral[600],
  pendingChevron: isDark ? Tokens.neutral[400] : semantic.light.warning,
  // Modal
  modalBg: isDark ? surface.dark.card : Tokens.text.light.inverse,
  modalOverlay: overlay.heavy,
  closeBg: isDark ? Tokens.neutral[700] : Tokens.neutral[100],
  closeIcon: Tokens.neutral[500],
  // Progress bar
  progressActive: Tokens.brand.primary[500],
  progressComplete: isDark ? semantic.dark.success : semantic.light.success,
  progressPending: isDark ? Tokens.neutral[600] : Tokens.neutral[200],
  // Text
  title: isDark ? Tokens.text.dark.primary : Tokens.text.light.primary,
  subtitle: Tokens.neutral[500],
  // Options
  optionBg: isDark ? Tokens.neutral[700] : COLORS.background.warm,
});

export default function DailyCheckIn({ onComplete }: DailyCheckInProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckInStep>("mood");
  const { isDark } = useTheme();
  const checkInColors = useMemo(() => getCheckInColors(isDark), [isDark]);

  const checkIns = useCheckInStore((s) => s.checkIns);
  const setTodayMood = useCheckInStore((s) => s.setTodayMood);
  const setTodayEnergy = useCheckInStore((s) => s.setTodayEnergy);
  const setTodaySleep = useCheckInStore((s) => s.setTodaySleep);

  const today = new Date().toISOString().split("T")[0];
  const todayCheckIn = useMemo(() => {
    return checkIns.find((c) => c.date === today);
  }, [checkIns, today]);

  const isComplete = todayCheckIn?.mood && todayCheckIn?.energy && todayCheckIn?.sleep;

  const handleOpen = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep("mood");
    setIsOpen(true);
  };

  const handleSelect = async (type: CheckInStep, value: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (type === "mood") {
      setTodayMood(value);
      setCurrentStep("energy");
    } else if (type === "energy") {
      setTodayEnergy(value);
      setCurrentStep("sleep");
    } else if (type === "sleep") {
      setTodaySleep(value);
      setCurrentStep("complete");
      setTimeout(() => {
        setIsOpen(false);
        onComplete?.();
      }, 1500);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "mood":
        return "Como você está se sentindo?";
      case "energy":
        return "Como está sua energia?";
      case "sleep":
        return "Como foi seu sono?";
      case "complete":
        return "Check-in completo!";
    }
  };

  const getOptions = () => {
    switch (currentStep) {
      case "mood":
        return MOOD_OPTIONS;
      case "energy":
        return ENERGY_OPTIONS;
      case "sleep":
        return SLEEP_OPTIONS;
      default:
        return [];
    }
  };

  const renderCompactView = () => {
    if (isComplete) {
      return (
        <Pressable
          onPress={handleOpen}
          style={{
            backgroundColor: checkInColors.completeBg,
            borderRadius: radius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: checkInColors.completeBorder,
          }}
          accessibilityLabel="Check-in diario completo. Toque para ver detalhes"
          accessibilityRole="button"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.md,
                  backgroundColor: checkInColors.completeIcon,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: spacing.md,
                }}
              >
                <Ionicons name="checkmark" size={22} color={Tokens.text.light.inverse} />
              </View>
              <View>
                <Text
                  style={{
                    color: checkInColors.completeText,
                    fontSize: typography.bodyMedium.fontSize,
                    fontWeight: typography.titleMedium.fontWeight,
                  }}
                >
                  Check-in feito!
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 2,
                    gap: spacing.sm,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Ionicons
                      name={
                        MOOD_OPTIONS.find((m) => m.value === todayCheckIn?.mood)?.icon ??
                        "happy-outline"
                      }
                      size={14}
                      color={checkInColors.completeSubtext}
                    />
                    <Text
                      style={{
                        color: checkInColors.completeSubtext,
                        fontSize: typography.caption.fontSize,
                      }}
                    >
                      Humor
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: checkInColors.completeSubtext,
                      fontSize: typography.caption.fontSize,
                    }}
                  >
                    ·
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Ionicons
                      name={
                        ENERGY_OPTIONS.find((e) => e.value === todayCheckIn?.energy)?.icon ??
                        "flash-outline"
                      }
                      size={14}
                      color={checkInColors.completeSubtext}
                    />
                    <Text
                      style={{
                        color: checkInColors.completeSubtext,
                        fontSize: typography.caption.fontSize,
                      }}
                    >
                      Energia
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: checkInColors.completeSubtext,
                      fontSize: typography.caption.fontSize,
                    }}
                  >
                    ·
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Ionicons
                      name={
                        SLEEP_OPTIONS.find((s) => s.value === todayCheckIn?.sleep)?.icon ?? "moon"
                      }
                      size={14}
                      color={checkInColors.completeSubtext}
                    />
                    <Text
                      style={{
                        color: checkInColors.completeSubtext,
                        fontSize: typography.caption.fontSize,
                      }}
                    >
                      Sono
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable
        onPress={handleOpen}
        style={{
          backgroundColor: checkInColors.pendingBg,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: checkInColors.pendingBorder,
        }}
        accessibilityLabel="Fazer check-in diario de humor, energia e sono"
        accessibilityRole="button"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.md,
                backgroundColor: checkInColors.pendingIcon,
                alignItems: "center",
                justifyContent: "center",
                marginRight: spacing.md,
              }}
            >
              <Ionicons name="sparkles" size={20} color={Tokens.text.light.inverse} />
            </View>
            <View className="flex-1">
              <Text
                style={{
                  color: checkInColors.pendingText,
                  fontSize: typography.bodyMedium.fontSize,
                  fontWeight: typography.titleMedium.fontWeight,
                }}
              >
                Check-in de hoje
              </Text>
              <Text
                style={{
                  color: checkInColors.pendingSubtext,
                  fontSize: typography.labelMedium.fontSize,
                  marginTop: 2,
                }}
              >
                10 segundos · Humor, energia e sono
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={checkInColors.pendingChevron} />
        </View>
      </Pressable>
    );
  };

  return (
    <>
      {renderCompactView()}

      <Modal
        visible={isOpen}
        animationType="fade"
        transparent
        statusBarTranslucent
        accessibilityViewIsModal={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: checkInColors.modalOverlay,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing["2xl"],
          }}
          accessibilityViewIsModal={true}
        >
          <Animated.View
            entering={ZoomIn.duration(300).springify()}
            style={{
              backgroundColor: checkInColors.modalBg,
              borderRadius: radius["2xl"],
              padding: spacing["2xl"],
              width: "100%",
              maxWidth: 340,
            }}
            accessibilityViewIsModal={true}
            accessibilityLabel={`Check-in diário. ${getStepTitle()}`}
          >
            {/* Close Button */}
            <Pressable
              onPress={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: spacing.lg,
                right: spacing.lg,
                width: Tokens.accessibility.minTapTarget,
                height: Tokens.accessibility.minTapTarget,
                borderRadius: radius.xl,
                backgroundColor: checkInColors.closeBg,
                alignItems: "center",
                justifyContent: "center",
              }}
              accessibilityLabel="Fechar check-in"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={22} color={checkInColors.closeIcon} />
            </Pressable>

            {/* Progress */}
            <View className="flex-row mb-6">
              {["mood", "energy", "sleep"].map((step, index) => (
                <View
                  key={step}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor:
                      currentStep === step
                        ? checkInColors.progressActive
                        : index < ["mood", "energy", "sleep"].indexOf(currentStep)
                          ? checkInColors.progressComplete
                          : checkInColors.progressPending,
                    marginRight: index < 2 ? spacing.sm : 0,
                  }}
                />
              ))}
            </View>

            {/* Title */}
            <Animated.Text
              entering={FadeIn.duration(300)}
              style={{
                fontSize: typography.titleLarge.fontSize,
                fontWeight: typography.titleLarge.fontWeight,
                color: checkInColors.title,
                textAlign: "center",
                marginBottom: spacing["2xl"],
              }}
            >
              {getStepTitle()}
            </Animated.Text>

            {/* Options or Complete State */}
            {currentStep === "complete" ? (
              <Animated.View
                entering={ZoomIn.duration(400).springify()}
                style={{ alignItems: "center", paddingVertical: spacing.xl }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: checkInColors.completeIcon,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing.lg,
                  }}
                >
                  <Ionicons name="checkmark" size={40} color={Tokens.text.light.inverse} />
                </View>
                <Text
                  style={{
                    fontSize: typography.bodyLarge.fontSize,
                    color: checkInColors.subtitle,
                    textAlign: "center",
                  }}
                >
                  Obrigada por cuidar de você!
                </Text>
              </Animated.View>
            ) : (
              <View className="flex-row justify-between">
                {getOptions().map((option, index) => (
                  <Animated.View
                    key={option.value}
                    entering={FadeInUp.delay(index * 50)
                      .duration(300)
                      .springify()}
                  >
                    <Pressable
                      onPress={() => handleSelect(currentStep, option.value)}
                      style={{
                        alignItems: "center",
                        padding: spacing.md,
                        borderRadius: radius.lg,
                        backgroundColor: checkInColors.optionBg,
                        minWidth: 56,
                      }}
                      accessibilityLabel={`${option.label}`}
                      accessibilityRole="button"
                    >
                      <Ionicons
                        name={option.icon}
                        size={28}
                        color={option.color ?? checkInColors.title}
                        style={{ marginBottom: spacing.xs }}
                      />
                      <Text
                        style={{
                          fontSize: typography.caption.fontSize,
                          color: checkInColors.subtitle,
                          fontWeight: typography.labelMedium.fontWeight,
                        }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
