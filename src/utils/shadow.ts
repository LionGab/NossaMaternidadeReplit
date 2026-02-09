import { Platform, ViewStyle } from "react-native";
import { Tokens } from "../theme/tokens";

// Shadow base color from design system
const SHADOW_COLOR = Tokens.neutral[900];

export interface ShadowConfig {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

/**
 * Converte shadow props para boxShadow CSS (web)
 */
function shadowToBoxShadow(
  shadowColor: string,
  shadowOffset: { width: number; height: number },
  shadowOpacity: number,
  shadowRadius: number
): string {
  const alpha = Math.round(Math.max(0, Math.min(1, shadowOpacity)) * 255)
    .toString(16)
    .padStart(2, "0");
  const color = `${shadowColor}${alpha}`;
  return `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px ${color}`;
}

/**
 * Cria estilos de shadow/elevation compatíveis com iOS, Android e Web
 * @param config Configuração de shadow
 * @returns Objeto de estilo com shadow para iOS, elevation para Android, boxShadow para Web
 */
export function createShadow(config: ShadowConfig = {}): ViewStyle {
  const {
    shadowColor = SHADOW_COLOR,
    shadowOffset = { width: 0, height: 2 },
    shadowOpacity = 0.1,
    shadowRadius = 8,
    elevation = 3,
  } = config;

  if (Platform.OS === "web") {
    // Web: usar boxShadow ao invés de shadow props deprecated
    return {
      boxShadow: shadowToBoxShadow(shadowColor, shadowOffset, shadowOpacity, shadowRadius),
    } as ViewStyle;
  }

  if (Platform.OS === "ios") {
    return {
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
    };
  }

  // Android usa elevation
  return {
    elevation,
  };
}

/**
 * Presets de shadow comuns para uso rápido
 */
export const shadowPresets = {
  none: createShadow({ shadowOpacity: 0, elevation: 0 }),
  sm: createShadow({
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  }),
  md: createShadow({
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  }),
  lg: createShadow({
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  }),
  xl: createShadow({
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  }),
  colored: (color: string, intensity: number = 0.3) =>
    createShadow({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: intensity,
      shadowRadius: 12,
      elevation: 6,
    }),
};
