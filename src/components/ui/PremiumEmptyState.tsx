import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image, ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";

interface PremiumEmptyStateProps {
  title: string;
  subtitle: string;
  image?: ImageSource; // Pode ser uri ou require (number | string | object)
  actionLabel?: string;
  onAction?: () => void;
  type?: "community" | "premium" | "error";
}

export function PremiumEmptyState({
  title,
  subtitle,
  image,
  actionLabel,
  onAction,
  type = "community",
}: PremiumEmptyStateProps) {
  const theme = useTheme();

  // Cores baseadas no tipo
  let accentColor: string = Tokens.brand.primary[500];
  let gradientColors: [string, string, ...string[]] = [Tokens.brand.primary[50], "transparent"];

  if (type === "premium") {
    accentColor = Tokens.nathAccent.rose;
    gradientColors = [Tokens.brand.accent[100], "transparent"];
  } else if (type === "error") {
    accentColor = Tokens.semantic.light.error;
    gradientColors = [Tokens.semantic.light.errorLight, "transparent"];
  }

  const isError = type === "error";

  return (
    <View style={styles.container}>
      {/* Background Glow */}
      <View style={styles.glowContainer}>
        <LinearGradient colors={gradientColors} style={styles.glow} />
      </View>

      <Animated.View entering={FadeInUp.delay(200)} style={styles.content}>
        {/* Avatar/Image Circle */}
        <View
          style={[
            styles.imageCircle,
            { borderColor: accentColor },
            isError && { borderColor: Tokens.neutral[200] },
          ]}
        >
          {image ? (
            <Image
              source={image}
              style={styles.image}
              contentFit="cover"
              accessibilityLabel={`Ilustração: ${title}`}
            />
          ) : (
            // Fallback icon when no image provided
            <View style={[styles.iconFallback, { backgroundColor: accentColor + "20" }]}>
              <Ionicons
                name={isError ? "alert-circle" : "sparkles"}
                size={48}
                color={accentColor}
              />
            </View>
          )}
        </View>

        <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>

        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>{subtitle}</Text>

        {actionLabel && onAction && (
          <Pressable
            onPress={onAction}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: accentColor,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Tokens.spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50%", // Use percentual para evitar scroll desnecessário em telas pequenas
    flex: 1,
  },
  glowContainer: {
    position: "absolute",
    width: "120%", // Relativo à tela
    aspectRatio: 1, // Mantém quadrado
    top: -50,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    width: "100%",
    height: "100%",
    borderRadius: 9999, // Full circle
    opacity: 0.6,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  imageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    padding: 4,
    marginBottom: Tokens.spacing.lg,
    backgroundColor: Tokens.neutral[0],
    ...Tokens.shadows.md,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  iconFallback: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22, // Tokens.typography.h3.fontSize
    fontWeight: "800",
    textAlign: "center",
    marginBottom: Tokens.spacing.sm,
    fontFamily: "Manrope_800ExtraBold",
  },
  subtitle: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Tokens.spacing.xl,
    maxWidth: 280,
    fontFamily: "Manrope_400Regular",
  },
  button: {
    paddingVertical: Tokens.spacing.md,
    paddingHorizontal: Tokens.spacing.xl,
    borderRadius: Tokens.radius.full,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    ...Tokens.shadows.sm,
  },
  buttonText: {
    color: Tokens.neutral[0],
    fontWeight: "700",
    fontSize: Tokens.typography.bodyMedium.fontSize,
    fontFamily: "Manrope_700Bold",
  },
});
