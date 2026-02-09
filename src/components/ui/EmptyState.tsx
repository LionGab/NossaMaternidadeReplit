/**
 * EmptyState - Premium Empty State Component (NativeWind 2025)
 *
 * Estados vazios premium com suporte a:
 * - Glassmorphism cards
 * - Animated glow effect
 * - Suggestion chips
 * - Dark mode
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="chatbubbles-outline"
 *   title="Nenhuma conversa"
 *   message="Comece uma conversa com a NathIA"
 *   actionLabel="Iniciar"
 *   onAction={handleStart}
 *   variant="premium"
 * />
 *
 * // With suggestions
 * <EmptyState
 *   icon="search-outline"
 *   title="Sem resultados"
 *   suggestions={[
 *     { label: "Ver todos", onPress: handleViewAll },
 *     { label: "Filtrar", onPress: handleFilter },
 *   ]}
 * />
 * ```
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils/cn";
import { shadows } from "../../theme/tokens";

interface Suggestion {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface EmptyStateProps {
  /** Icon to display (Ionicons name) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Main title */
  title: string;
  /** Supporting message */
  message?: string;
  /** CTA button label */
  actionLabel?: string;
  /** CTA button handler */
  onAction?: () => void;
  /** Visual variant */
  variant?: "default" | "compact" | "centered" | "premium";
  /** Show animation on mount */
  animated?: boolean;
  /** Custom emoji instead of icon */
  emoji?: string;
  /** Show glow effect on icon (premium feel) */
  glow?: boolean;
  /** Suggestion chips */
  suggestions?: Suggestion[];
  /** Additional className for NativeWind styling */
  className?: string;
}

/**
 * NativeWind class mappings for variants
 */
const ICON_CONTAINER_CLASSES = {
  default: "w-20 h-20 rounded-full items-center justify-center mb-5",
  compact: "w-16 h-16 rounded-full items-center justify-center mb-4",
  centered: "w-20 h-20 rounded-full items-center justify-center mb-5",
  premium: "w-20 h-20 rounded-full items-center justify-center mb-5",
};

const CONTAINER_CLASSES = {
  default: "items-center justify-center p-7",
  compact: "items-center justify-center p-5",
  centered: "flex-1 items-center justify-center p-7",
  premium: "items-center justify-center p-7",
};

export function EmptyState({
  icon = "document-outline",
  title,
  message,
  actionLabel,
  onAction,
  variant = "default",
  animated = true,
  emoji,
  glow = false,
  suggestions,
  className,
}: EmptyStateProps) {
  const { isDark, brand } = useTheme();

  const handleAction = async () => {
    if (onAction) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onAction();
    }
  };

  const handleSuggestion = async (suggestion: Suggestion) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    suggestion.onPress();
  };

  // Size based on variant
  const iconSize = variant === "compact" ? 32 : 40;

  // Glow style for premium effect
  const glowStyle =
    glow || variant === "premium"
      ? {
          ...shadows.accentGlow,
          shadowOpacity: isDark ? 0.4 : 0.3,
        }
      : undefined;

  const content = (
    <View className={cn(CONTAINER_CLASSES[variant], className)}>
      {/* Icon/Emoji Container */}
      <Animated.View
        entering={animated ? FadeIn.delay(100).duration(400) : undefined}
        className={cn(ICON_CONTAINER_CLASSES[variant], isDark ? "bg-primary-900" : "bg-primary-50")}
        style={glowStyle}
      >
        {emoji ? (
          <Text className={variant === "compact" ? "text-[32px]" : "text-[40px]"}>{emoji}</Text>
        ) : (
          <Ionicons
            name={icon}
            size={iconSize}
            color={isDark ? brand.primary[300] : brand.primary[500]}
          />
        )}
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={animated ? FadeInUp.delay(200).duration(400) : undefined}
        className={cn(
          "text-center font-bold",
          variant === "compact" ? "text-base" : "text-lg",
          isDark ? "text-neutral-100" : "text-neutral-900",
          (message || actionLabel || suggestions) && "mb-3"
        )}
      >
        {title}
      </Animated.Text>

      {/* Message */}
      {message && (
        <Animated.Text
          entering={animated ? FadeInUp.delay(300).duration(400) : undefined}
          className={cn(
            "text-center text-[15px] leading-[22px] max-w-[280px]",
            isDark ? "text-neutral-400" : "text-neutral-600",
            (actionLabel || suggestions) && "mb-5"
          )}
        >
          {message}
        </Animated.Text>
      )}

      {/* Suggestion Chips (Premium Feature) */}
      {suggestions && suggestions.length > 0 && (
        <Animated.View
          entering={animated ? FadeInUp.delay(350).duration(400) : undefined}
          className="flex-row flex-wrap justify-center gap-2 mb-5 max-w-[320px]"
        >
          {suggestions.map((suggestion, index) => (
            <Pressable
              key={index}
              onPress={() => handleSuggestion(suggestion)}
              accessibilityRole="button"
              accessibilityLabel={suggestion.label}
              className={cn(
                "flex-row items-center px-4 py-2.5 rounded-full border",
                isDark ? "bg-neutral-800/50 border-neutral-700" : "bg-white/80 border-neutral-200"
              )}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              {suggestion.icon && (
                <Ionicons
                  name={suggestion.icon}
                  size={16}
                  color={isDark ? brand.primary[300] : brand.primary[500]}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-primary-300" : "text-primary-600"
                )}
              >
                {suggestion.label}
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      )}

      {/* CTA Button */}
      {actionLabel && onAction && (
        <Animated.View entering={animated ? FadeInUp.delay(400).duration(400) : undefined}>
          <Pressable
            onPress={handleAction}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            className="px-6 py-4 rounded-2xl min-h-[44px] items-center justify-center"
            style={({ pressed }) => ({
              backgroundColor: brand.primary[500],
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              ...(variant === "premium" ? shadows.accentGlow : {}),
            })}
          >
            <Text className="text-sm font-bold text-white">{actionLabel}</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );

  if (animated && variant !== "centered") {
    return <Animated.View entering={FadeIn.duration(300)}>{content}</Animated.View>;
  }

  if (variant === "centered") {
    return (
      <Animated.View entering={animated ? FadeIn.duration(300) : undefined} className="flex-1">
        {content}
      </Animated.View>
    );
  }

  return content;
}

export default EmptyState;
