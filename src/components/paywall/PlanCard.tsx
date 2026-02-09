/**
 * PlanCard - Pricing plan card for paywall screens
 */

import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { brand, premium, typography } from "../../theme/tokens";

export type PlanType = "monthly" | "yearly";

interface PlanCardProps {
  type: PlanType;
  price: string;
  period: string;
  monthlyEquivalent?: string;
  savings?: string;
  isPopular?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
}

export const PlanCard: React.FC<PlanCardProps> = React.memo(
  ({ type, price, period, monthlyEquivalent, savings, isPopular, isSelected, onSelect, delay }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scale.value = withSequence(
        withTiming(0.97, { duration: 80 }),
        withSpring(1, { damping: 12 })
      );
      onSelect();
    };

    const planLabel = type === "yearly" ? "Plano anual" : "Plano mensal";
    const priceDescription = monthlyEquivalent
      ? `${price} por ${period}, equivalente a ${monthlyEquivalent} por mês`
      : `${price} por ${period}`;

    return (
      <Animated.View entering={FadeInUp.delay(delay).duration(400).springify()}>
        <Animated.View style={animatedStyle}>
          <Pressable
            onPress={handlePress}
            accessibilityRole="radio"
            accessibilityLabel={`${planLabel}. ${priceDescription}${savings ? `. Economia de ${savings}` : ""}${isPopular ? ". Mais popular" : ""}`}
            accessibilityState={{ selected: isSelected }}
            accessibilityHint="Toque duas vezes para selecionar este plano"
          >
            <View style={[styles.planCard, isSelected && styles.planCardSelected]}>
              {/* Popular badge */}
              {isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>MAIS POPULAR</Text>
                </View>
              )}

              {/* Savings badge */}
              {savings && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsBadgeText}>{savings}</Text>
                </View>
              )}

              {/* Content */}
              <View style={styles.planHeader}>
                {/* Radio */}
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.planType}>{type === "yearly" ? "Anual" : "Mensal"}</Text>
              </View>

              <Text style={styles.planPrice}>{price}</Text>
              <Text style={styles.planPeriod}>/{period}</Text>

              {monthlyEquivalent && (
                <Text style={styles.planEquivalent}>= {monthlyEquivalent}/mês</Text>
              )}
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    );
  }
);

PlanCard.displayName = "PlanCard";

const COLORS = {
  glassBg: premium.glass.background,
  glassBorder: premium.glass.border,
  glassSelected: premium.glass.selected,
  glassSelectedBorder: brand.accent[400],
  textPrimary: premium.text.primary,
  textSecondary: premium.text.secondary,
  textMuted: premium.text.muted,
  textAccent: premium.text.accent,
  success: premium.special.success,
};

const FONTS = {
  display: typography.fontFamily.extrabold,
  headline: typography.fontFamily.bold,
  body: typography.fontFamily.medium,
  accent: typography.fontFamily.semibold,
};

const styles = StyleSheet.create({
  planCard: {
    flex: 1,
    backgroundColor: COLORS.glassBg,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.glassBorder,
    padding: 20,
    position: "relative",
    minHeight: 140,
  },
  planCardSelected: {
    backgroundColor: COLORS.glassSelected,
    borderColor: COLORS.glassSelectedBorder,
    shadowColor: COLORS.textAccent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    left: "50%",
    transform: [{ translateX: -45 }],
    backgroundColor: COLORS.textAccent,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  popularBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.headline,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  savingsBadge: {
    position: "absolute",
    top: -10,
    right: -8,
    backgroundColor: COLORS.success,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  savingsBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.headline,
    color: COLORS.textPrimary,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: COLORS.textAccent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.textAccent,
  },
  planType: {
    fontSize: 14,
    fontFamily: FONTS.accent,
    color: COLORS.textSecondary,
  },
  planPrice: {
    fontSize: 32,
    fontFamily: FONTS.display,
    color: COLORS.textPrimary,
    letterSpacing: -0.6,
  },
  planPeriod: {
    fontSize: 15,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  planEquivalent: {
    fontSize: 13,
    fontFamily: FONTS.accent,
    color: COLORS.textAccent,
    marginTop: 8,
  },
});
