/**
 * FeatureCard - Ultra-Clean Feature Card (Flo + I Am inspired)
 *
 * Design Philosophy:
 * - Bordas quase invisiveis
 * - Sombras ultra-sutis
 * - Whitespace generoso
 * - Badges rosa accent (Flo-inspired)
 *
 * @version 5.0 - Clean Redesign
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { PressableScale } from "../ui";
import { staggeredFadeUp } from "../../utils/animations";
import { createShadow } from "../../utils/shadow";
import { brand, neutral, typography, shadows, cleanDesign } from "../../theme/tokens";

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  badge?: string;
  onPress: () => void;
  isDark: boolean;
  index?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = React.memo(
  ({ icon, iconBgColor, iconColor, title, subtitle, badge, onPress, isDark, index = 0 }) => {
    const cardBg = isDark ? brand.primary[900] : cleanDesign.card.background;
    const textMain = isDark ? neutral[100] : neutral[800];
    const textMuted = isDark ? neutral[400] : neutral[500];
    const borderColor = isDark ? brand.primary[800] : cleanDesign.card.border;

    return (
      <Animated.View entering={staggeredFadeUp(index, 80)}>
        <PressableScale onPress={onPress} spring="snappy">
          <View
            accessibilityLabel={title}
            style={[
              styles.featureCard,
              {
                backgroundColor: cardBg,
                borderColor: borderColor,
                borderWidth: isDark ? 0 : 1,
              },
              isDark ? styles.featureCardDark : styles.featureCardLight,
            ]}
          >
            {/* Icon - Clean circular container */}
            <View style={[styles.featureIconContainer, { backgroundColor: iconBgColor }]}>
              <Ionicons name={icon} size={22} color={iconColor} />
            </View>

            {/* Content */}
            <View style={styles.featureContent}>
              <View style={styles.featureTitleRow}>
                <Text style={[styles.featureTitle, { color: textMain }]}>{title}</Text>
                {badge && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: isDark ? brand.accent[600] : brand.accent[100] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: isDark ? neutral[100] : brand.accent[700] },
                      ]}
                    >
                      {badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.featureSubtitle, { color: textMuted }]} numberOfLines={2}>
                {subtitle}
              </Text>
            </View>

            {/* Arrow - subtle */}
            <Ionicons
              name="chevron-forward"
              size={18}
              color={isDark ? neutral[500] : brand.primary[300]}
              importantForAccessibility="no"
            />
          </View>
        </PressableScale>
      </Animated.View>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

const styles = StyleSheet.create({
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    borderRadius: cleanDesign.card.borderRadius,
  },
  // Light mode - ultra clean
  featureCardLight: {
    ...shadows.flo.soft,
  },
  // Dark mode - usando utilitário cross-platform
  featureCardDark: createShadow({
    shadowColor: brand.primary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  }),
  featureIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
    letterSpacing: -0.2,
  },
  featureSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: typography.fontFamily.medium,
    lineHeight: 18,
    opacity: 0.85,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.4,
  },
});
