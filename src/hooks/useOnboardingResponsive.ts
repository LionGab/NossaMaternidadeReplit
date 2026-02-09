/**
 * Hook de responsividade para telas de onboarding
 * Calcula valores adaptativos baseados no tamanho da tela
 */

import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { Tokens } from "@/theme/tokens";

// Breakpoints
const BREAKPOINTS = {
  heightCompact: 700, // iPhone SE, telas pequenas
  heightSmall: 800, // iPhone 8, etc
  widthNarrow: 375, // Largura mínima comum
} as const;

export interface OnboardingResponsiveValues {
  /** Se a tela é compacta (altura < 700) */
  isCompact: boolean;
  /** Se a tela é pequena (altura < 800) */
  isSmall: boolean;
  /** Se a largura é estreita (< 375) */
  isNarrow: boolean;
  /** Padding horizontal responsivo */
  paddingHorizontal: number;
  /** Espaçamento entre cards */
  cardGap: number;
  /** Tamanho de fonte do título */
  titleFontSize: number;
  /** Line height do título */
  titleLineHeight: number;
  /** Margin top do header container (após hero) */
  headerMarginTop: number;
  /** Hero height percent ajustado para telas pequenas */
  getHeroHeightPercent: (basePercent: number) => number;
}

/**
 * Hook para valores responsivos em telas de onboarding
 */
export function useOnboardingResponsive(): OnboardingResponsiveValues {
  const { height, width } = useWindowDimensions();

  return useMemo(() => {
    const isCompact = height < BREAKPOINTS.heightCompact;
    const isSmall = height < BREAKPOINTS.heightSmall;
    const isNarrow = width < BREAKPOINTS.widthNarrow;

    return {
      isCompact,
      isSmall,
      isNarrow,
      paddingHorizontal: isNarrow ? Tokens.spacing.lg : Tokens.spacing["2xl"],
      cardGap: isCompact ? Tokens.spacing.sm : Tokens.spacing.md,
      titleFontSize: isCompact ? 24 : 28,
      titleLineHeight: isCompact ? 30 : 34,
      headerMarginTop: isCompact ? 40 : isSmall ? 60 : 80,
      getHeroHeightPercent: (basePercent: number) => {
        // Reduz hero height em telas compactas para caber mais conteúdo
        if (isCompact) {
          return Math.max(basePercent * 0.7, 0.08); // Mínimo 8%
        }
        if (isSmall) {
          return basePercent * 0.85;
        }
        return basePercent;
      },
    };
  }, [height, width]);
}
