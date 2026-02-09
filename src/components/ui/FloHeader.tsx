/**
 * FloHeader - Header minimalista estilo Flo Health
 *
 * Design Flo Health Minimal:
 * - Tipografia limpa e elegante
 * - Ícones sutis
 * - Muito whitespace
 * - Sem bordas ou sombras pesadas
 *
 * @example
 * ```tsx
 * <FloHeader
 *   greeting="Bom dia"
 *   title="Maria"
 *   subtitle="Semana 24 de gestação"
 *   avatar={{ onPress: handleProfile }}
 * />
 * ```
 */

import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { spacing, typography, Tokens } from "../../theme/tokens";

interface FloHeaderProps {
  /** Greeting text (e.g., "Bom dia") */
  greeting?: string;
  /** Main title (e.g., user name) */
  title: string;
  /** Subtitle (e.g., pregnancy week) */
  subtitle?: string;
  /** Subtitle color accent */
  subtitleAccent?: boolean;
  /** Show back button */
  showBack?: boolean;
  /** Back button handler */
  onBack?: () => void;
  /** Avatar configuration */
  avatar?: {
    onPress: () => void;
    imageUri?: string;
  };
  /** Right action buttons */
  rightActions?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    badge?: number;
    label?: string;
  }[];
  /** Large variant for main screens */
  variant?: "default" | "large" | "compact";
  /** Animated entrance */
  animated?: boolean;
  /** Custom style */
  style?: ViewStyle;
}

export function FloHeader({
  greeting,
  title,
  subtitle,
  subtitleAccent = false,
  showBack = false,
  onBack,
  avatar,
  rightActions,
  variant = "default",
  animated = true,
  style,
}: FloHeaderProps) {
  const { isDark } = useTheme();

  const textPrimary = isDark ? Tokens.neutral[50] : Tokens.neutral[800];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[500];
  const accentColor = Tokens.brand.accent[500];

  const handlePress = async (callback: () => void) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  // Font sizes based on variant
  const getTitleSize = () => {
    switch (variant) {
      case "large":
        return 28;
      case "compact":
        return 18;
      default:
        return 24;
    }
  };

  const content = (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: variant === "large" ? spacing["2xl"] : spacing.lg,
        },
        style,
      ]}
    >
      {/* Left Section: Back button or Title */}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        {showBack && onBack && (
          <Pressable
            onPress={() => handlePress(onBack)}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              marginRight: spacing.sm,
              backgroundColor: isDark
                ? Tokens.overlay.lightInvertedLight
                : Tokens.overlay.darkVeryLight,
            }}
          >
            <Ionicons name="chevron-back" size={24} color={textPrimary} />
          </Pressable>
        )}

        <View style={{ flex: 1 }}>
          {greeting && (
            <Text
              style={{
                fontSize: 14,
                fontFamily: typography.fontFamily.medium,
                color: textSecondary,
                marginBottom: 2,
              }}
            >
              {greeting}
            </Text>
          )}

          <Text
            style={{
              fontSize: getTitleSize(),
              fontFamily: typography.fontFamily.bold,
              color: textPrimary,
              letterSpacing: -0.5,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={{
                fontSize: 13,
                fontFamily: typography.fontFamily.medium,
                color: subtitleAccent ? accentColor : textSecondary,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Right Section: Actions or Avatar */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
        {rightActions?.map((action, index) => (
          <Pressable
            key={index}
            onPress={() => handlePress(action.onPress)}
            accessibilityLabel={action.label || `Ação ${index + 1}`}
            accessibilityRole="button"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDark
                ? Tokens.overlay.lightInvertedLight
                : Tokens.overlay.darkVeryLight,
            }}
          >
            <Ionicons
              name={action.icon}
              size={22}
              color={isDark ? Tokens.neutral[300] : Tokens.neutral[600]}
            />
            {action.badge !== undefined && action.badge > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: Tokens.semantic.light.error,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: Tokens.neutral[0],
                    fontSize: 10,
                    fontFamily: typography.fontFamily.bold,
                  }}
                >
                  {action.badge > 99 ? "99+" : action.badge}
                </Text>
              </View>
            )}
          </Pressable>
        ))}

        {avatar && (
          <Pressable
            onPress={() => handlePress(avatar.onPress)}
            accessibilityLabel="Ver perfil"
            accessibilityRole="button"
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Tokens.brand.accent[100],
              borderWidth: 2,
              borderColor: Tokens.brand.accent[200],
              overflow: "hidden",
            }}
          >
            {avatar.imageUri ? (
              <Image
                source={{ uri: avatar.imageUri }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                }}
                contentFit="cover"
                accessibilityLabel="Foto do perfil"
              />
            ) : (
              <Ionicons name="person" size={24} color={Tokens.brand.accent[500]} />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );

  if (animated) {
    return <Animated.View entering={FadeInDown.duration(400).springify()}>{content}</Animated.View>;
  }

  return content;
}

export default FloHeader;
