/**
 * NathAvatar Component
 *
 * Avatares com:
 * - Imagem, iniciais ou gradiente
 * - Indicador de status
 * - Dark mode support
 * - Acessibilidade
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { typography, brand, semantic, neutral } from "@/theme/tokens";
import { useTheme } from "@/hooks/useTheme";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type StatusType = "online" | "active" | "away" | "none";

interface NathAvatarProps {
  /** URL da imagem do avatar */
  source?: string;
  /** Iniciais para exibir quando sem imagem (max 2 caracteres) */
  initials?: string;
  /** Tamanho do avatar */
  size?: AvatarSize;
  /** Status do usuário */
  status?: StatusType;
  /** Cores do gradiente de fundo (para avatar sem imagem) */
  gradientColors?: readonly [string, string];
  style?: ViewStyle;
  /** Cor da borda */
  borderColor?: string;
  /** Nome do usuário para acessibilidade */
  userName?: string;
  /** Test ID para e2e testing */
  testID?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const fontSizeMap: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
};

const statusSizeMap: Record<AvatarSize, number> = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
};

export const NathAvatar: React.FC<NathAvatarProps> = ({
  source,
  initials,
  size = "md",
  status = "none",
  gradientColors,
  style,
  borderColor,
  userName,
  testID,
}) => {
  const { isDark, surface } = useTheme();

  // Cores adaptativas
  const colors = useMemo(
    () => ({
      defaultGradient: [brand.accent[400], brand.primary[300]] as const,
      statusOnline: semantic.light.success,
      statusActive: brand.accent[400],
      statusAway: semantic.light.warning,
      border: isDark ? surface.card : neutral[0],
      imageBg: isDark ? neutral[800] : neutral[100],
    }),
    [isDark, surface.card]
  );

  // Status colors
  const statusColors: Record<StatusType, string> = {
    online: colors.statusOnline,
    active: colors.statusActive,
    away: colors.statusAway,
    none: "transparent",
  };

  // Gradiente padrão ou customizado
  const finalGradientColors = gradientColors || colors.defaultGradient;

  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const statusSize = statusSizeMap[size];

  const containerStyle: ViewStyle[] = [
    styles.container,
    {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
    },
  ];

  if (borderColor) {
    containerStyle.push({
      borderWidth: 2,
      borderColor,
    });
  }

  if (style) {
    containerStyle.push(style);
  }

  // Accessibility label
  const accessibilityLabel = useMemo(() => {
    const parts: string[] = [];
    if (userName) {
      parts.push(`Avatar de ${userName}`);
    } else if (initials) {
      parts.push(`Avatar com iniciais ${initials}`);
    } else {
      parts.push("Avatar");
    }

    if (status !== "none") {
      const statusLabels: Record<StatusType, string> = {
        online: "online",
        active: "ativo",
        away: "ausente",
        none: "",
      };
      parts.push(statusLabels[status]);
    }

    return parts.join(", ");
  }, [userName, initials, status]);

  return (
    <View
      style={containerStyle}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            {
              borderRadius: dimension / 2,
              backgroundColor: colors.imageBg,
            },
          ]}
          contentFit="cover"
          transition={200}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <LinearGradient
          colors={finalGradientColors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: dimension / 2 }]}
        >
          <Text style={[styles.initials, { fontSize }]} accessibilityElementsHidden>
            {initials?.toUpperCase().slice(0, 2)}
          </Text>
        </LinearGradient>
      )}

      {status !== "none" && (
        <View
          style={[
            styles.status,
            {
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: statusColors[status],
              borderWidth: statusSize > 8 ? 2 : 1.5,
              borderColor: colors.border,
            },
          ]}
          accessibilityElementsHidden
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "visible",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  gradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  initials: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: "700",
    color: neutral[0], // Branco para contraste no gradiente
  },

  status: {
    position: "absolute",
    bottom: -1,
    right: -1,
  },
});

export default NathAvatar;
