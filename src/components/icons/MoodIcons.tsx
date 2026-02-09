/**
 * MoodIcons - Ícones SVG para estados emocionais
 *
 * Substituem emojis para visual mais profissional e acessível.
 * Usando cores de `feeling` tokens para consistência.
 *
 * Ícones disponíveis:
 * - MoodBemIcon (sol radiante)
 * - MoodCansadaIcon (nuvem com sono)
 * - MoodIndispostaIcon (gota de chuva)
 * - MoodAmadaIcon (coração)
 *
 * @version 1.0
 */

import React from "react";
import Svg, { Circle, Path, G, Ellipse } from "react-native-svg";
import { feeling, Tokens } from "../../theme/tokens";
import { useTheme } from "../../hooks/useTheme";

interface MoodIconProps {
  size?: number;
  color?: string;
}

/**
 * MoodBemIcon - Sol radiante (feliz, bem)
 * Cor padrão: feeling.bem.icon (#F59E0B - amarelo dourado)
 */
export const MoodBemIcon: React.FC<MoodIconProps> = React.memo(
  ({ size = 24, color = feeling.bem.icon }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Bem">
      {/* Centro do sol */}
      <Circle cx="12" cy="12" r="5" fill={color} />
      {/* Raios do sol */}
      <G stroke={color} strokeWidth="2" strokeLinecap="round">
        <Path d="M12 2v3" />
        <Path d="M12 19v3" />
        <Path d="M2 12h3" />
        <Path d="M19 12h3" />
        <Path d="M4.93 4.93l2.12 2.12" />
        <Path d="M16.95 16.95l2.12 2.12" />
        <Path d="M4.93 19.07l2.12-2.12" />
        <Path d="M16.95 7.05l2.12-2.12" />
      </G>
    </Svg>
  )
);

MoodBemIcon.displayName = "MoodBemIcon";

/**
 * MoodCansadaIcon - Nuvem com lua (cansaço, sono)
 * Cor padrão: feeling.cansada.icon (#60A5FA - azul pastel)
 */
export const MoodCansadaIcon: React.FC<MoodIconProps> = React.memo(
  ({ size = 24, color = feeling.cansada.icon }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Cansada">
      {/* Nuvem principal */}
      <Path
        d="M19 17H7.5C5.01 17 3 14.99 3 12.5S5.01 8 7.5 8c.26 0 .52.02.77.06A5.5 5.5 0 0113.5 4c2.76 0 5.05 2.03 5.44 4.68A4.502 4.502 0 0121 13c0 2.21-1.79 4-4 4h-2"
        fill={color}
        opacity={0.3}
      />
      <Path
        d="M19 17H7.5C5.01 17 3 14.99 3 12.5S5.01 8 7.5 8c.26 0 .52.02.77.06A5.5 5.5 0 0113.5 4c2.76 0 5.05 2.03 5.44 4.68A4.502 4.502 0 0121 13c0 2.21-1.79 4-4 4h-2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lua crescente pequena (indicando sono) */}
      <Path d="M16 9a2 2 0 11-2.5 2.5A2 2 0 0116 9z" fill={color} />
    </Svg>
  )
);

MoodCansadaIcon.displayName = "MoodCansadaIcon";

/**
 * MoodIndispostaIcon - Gota (enjoo, indisposição)
 * Cor padrão: feeling.indisposta.icon (#A855F7 - lavanda)
 */
export const MoodIndispostaIcon: React.FC<MoodIconProps> = React.memo(
  ({ size = 24, color = feeling.indisposta.icon }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Indisposta">
      {/* Gota grande */}
      <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" fill={color} opacity={0.3} />
      <Path
        d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Brilho na gota */}
      <Ellipse cx="9.5" cy="11" rx="1.5" ry="2" fill={Tokens.neutral[0]} opacity={0.6} />
    </Svg>
  )
);

MoodIndispostaIcon.displayName = "MoodIndispostaIcon";

// Alias para enjoada (mesmo ícone que indisposta)
export const MoodEnjoaadaIcon = MoodIndispostaIcon;

/**
 * MoodAmadaIcon - Coração (amor, afeto)
 * Cor padrão: feeling.amada.icon (#FF5C94 - rosa vibrante)
 */
export const MoodAmadaIcon: React.FC<MoodIconProps> = React.memo(
  ({ size = 24, color = feeling.amada.icon }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Amada">
      {/* Coração preenchido */}
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
      />
      {/* Brilho no coração */}
      <Ellipse cx="8" cy="9" rx="2" ry="2.5" fill={Tokens.neutral[0]} opacity={0.4} />
    </Svg>
  )
);

MoodAmadaIcon.displayName = "MoodAmadaIcon";

/**
 * MoodHappyIcon - Rosto sorridente (feliz)
 * Para DailyLogScreen - happy mood
 */
export const MoodHappyIcon: React.FC<MoodIconProps> = React.memo(({ size = 24, color }) => {
  const defaultColor = color ?? Tokens.semantic.light.success;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Feliz">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={defaultColor}
        strokeWidth="1.5"
        fill={defaultColor}
        opacity={0.15}
      />
      <Circle cx="9" cy="10" r="1.5" fill={defaultColor} />
      <Circle cx="15" cy="10" r="1.5" fill={defaultColor} />
      <Path
        d="M8 14c1.5 2 4 2.5 5.5 2.5S16 16 17 14"
        stroke={defaultColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
});

MoodHappyIcon.displayName = "MoodHappyIcon";

/**
 * MoodCalmIcon - Rosto sereno (calma)
 */
export const MoodCalmIcon: React.FC<MoodIconProps> = React.memo(({ size = 24, color }) => {
  const defaultColor = color ?? Tokens.brand.primary[500];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Calma">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={defaultColor}
        strokeWidth="1.5"
        fill={defaultColor}
        opacity={0.15}
      />
      <Path d="M8 10.5h2" stroke={defaultColor} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M14 10.5h2" stroke={defaultColor} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M9 14.5h6" stroke={defaultColor} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
});

MoodCalmIcon.displayName = "MoodCalmIcon";

/**
 * MoodEnergeticIcon - Raio (energia)
 */
export const MoodEnergeticIcon: React.FC<MoodIconProps> = React.memo(({ size = 24, color }) => {
  const defaultColor = color ?? Tokens.semantic.light.warning;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Energética">
      <Path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
        fill={defaultColor}
        stroke={defaultColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

MoodEnergeticIcon.displayName = "MoodEnergeticIcon";

/**
 * MoodAnxiousIcon - Rosto preocupado (ansiosa)
 */
export const MoodAnxiousIcon: React.FC<MoodIconProps> = React.memo(({ size = 24, color }) => {
  const defaultColor = color ?? Tokens.semantic.light.error;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Ansiosa">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={defaultColor}
        strokeWidth="1.5"
        fill={defaultColor}
        opacity={0.15}
      />
      <Circle cx="9" cy="10" r="1.5" fill={defaultColor} />
      <Circle cx="15" cy="10" r="1.5" fill={defaultColor} />
      <Path
        d="M8 16c.5-1 2-2 4-2s3.5 1 4 2"
        stroke={defaultColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Gotinha de suor */}
      <Path d="M17 6c0 1-1 2-1 2s-1-1-1-2a1 1 0 012 0z" fill={defaultColor} />
    </Svg>
  );
});

MoodAnxiousIcon.displayName = "MoodAnxiousIcon";

/**
 * MoodSadIcon - Rosto triste (triste)
 */
export const MoodSadIcon: React.FC<MoodIconProps> = React.memo(({ size = 24, color }) => {
  const defaultColor = color ?? Tokens.brand.primary[400];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Triste">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={defaultColor}
        strokeWidth="1.5"
        fill={defaultColor}
        opacity={0.15}
      />
      <Circle cx="9" cy="10" r="1.5" fill={defaultColor} />
      <Circle cx="15" cy="10" r="1.5" fill={defaultColor} />
      <Path
        d="M8 16c1-1.5 2.5-2 4-2s3 .5 4 2"
        stroke={defaultColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Lágrima */}
      <Path d="M9 12.5v1.5" stroke={defaultColor} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
});

MoodSadIcon.displayName = "MoodSadIcon";

/**
 * MoodIrritatedIcon - Rosto irritado
 */
export const MoodIrritatedIcon: React.FC<MoodIconProps> = React.memo(({ size = 24, color }) => {
  const defaultColor = color ?? Tokens.semantic.light.warning;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Irritada">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={defaultColor}
        strokeWidth="1.5"
        fill={defaultColor}
        opacity={0.15}
      />
      {/* Sobrancelhas franzidas */}
      <Path d="M7 8l3 1.5" stroke={defaultColor} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M17 8l-3 1.5" stroke={defaultColor} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="9" cy="11" r="1.5" fill={defaultColor} />
      <Circle cx="15" cy="11" r="1.5" fill={defaultColor} />
      <Path d="M9 15.5h6" stroke={defaultColor} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
});

MoodIrritatedIcon.displayName = "MoodIrritatedIcon";

/**
 * MoodSensitiveIcon - Rosto sensível/emotivo
 */
export const MoodSensitiveIcon: React.FC<MoodIconProps> = React.memo(({ size = 24, color }) => {
  const { colors } = useTheme();
  const defaultColor = color ?? colors.accent[500];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Sensível">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={defaultColor}
        strokeWidth="1.5"
        fill={defaultColor}
        opacity={0.15}
      />
      {/* Olhos grandes e brilhantes */}
      <Circle cx="9" cy="10" r="2" fill={defaultColor} />
      <Circle cx="15" cy="10" r="2" fill={defaultColor} />
      <Circle cx="9.5" cy="9.5" r="0.7" fill={Tokens.neutral[0]} />
      <Circle cx="15.5" cy="9.5" r="0.7" fill={Tokens.neutral[0]} />
      <Path
        d="M10 15c.5.5 1.2.8 2 .8s1.5-.3 2-.8"
        stroke={defaultColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
});

MoodSensitiveIcon.displayName = "MoodSensitiveIcon";

/**
 * MoodTiredIcon - Rosto cansado/sonolento
 */
export const MoodTiredIcon: React.FC<MoodIconProps> = React.memo(({ size = 24, color }) => {
  const defaultColor = color ?? Tokens.brand.secondary[500];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityLabel="Cansada">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke={defaultColor}
        strokeWidth="1.5"
        fill={defaultColor}
        opacity={0.15}
      />
      {/* Olhos fechados (linhas) */}
      <Path
        d="M7 10.5c1 .5 2 .5 3 0"
        stroke={defaultColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M14 10.5c1 .5 2 .5 3 0"
        stroke={defaultColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Boca aberta bocejando */}
      <Ellipse
        cx="12"
        cy="15"
        rx="2"
        ry="1.5"
        fill={defaultColor}
        opacity={0.3}
        stroke={defaultColor}
        strokeWidth="1"
      />
      {/* Z's */}
      <Path
        d="M18 5l1.5-1h-1.5l1.5-1"
        stroke={defaultColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

MoodTiredIcon.displayName = "MoodTiredIcon";

/**
 * Tipo para identificar mood - expandido
 */
export type MoodType =
  | "bem"
  | "cansada"
  | "indisposta"
  | "amada"
  | "enjoada"
  | "happy"
  | "calm"
  | "energetic"
  | "anxious"
  | "sad"
  | "irritated"
  | "sensitive"
  | "tired";

/**
 * Componente genérico que renderiza o ícone correto baseado no mood
 */
export const MoodIcon: React.FC<MoodIconProps & { mood: MoodType }> = React.memo(
  ({ mood, size = 24, color }) => {
    const iconProps = { size, color };

    switch (mood) {
      // Moods do EmotionalCheckInPrimary
      case "bem":
        return <MoodBemIcon {...iconProps} color={color ?? feeling.bem.icon} />;
      case "cansada":
        return <MoodCansadaIcon {...iconProps} color={color ?? feeling.cansada.icon} />;
      case "indisposta":
      case "enjoada":
        return <MoodIndispostaIcon {...iconProps} color={color ?? feeling.indisposta.icon} />;
      case "amada":
        return <MoodAmadaIcon {...iconProps} color={color ?? feeling.amada.icon} />;
      // Moods do DailyLogScreen
      case "happy":
        return <MoodHappyIcon {...iconProps} color={color} />;
      case "calm":
        return <MoodCalmIcon {...iconProps} color={color} />;
      case "energetic":
        return <MoodEnergeticIcon {...iconProps} color={color} />;
      case "anxious":
        return <MoodAnxiousIcon {...iconProps} color={color} />;
      case "sad":
        return <MoodSadIcon {...iconProps} color={color} />;
      case "irritated":
        return <MoodIrritatedIcon {...iconProps} color={color} />;
      case "sensitive":
        return <MoodSensitiveIcon {...iconProps} color={color} />;
      case "tired":
        return <MoodTiredIcon {...iconProps} color={color} />;
      default:
        return <MoodBemIcon {...iconProps} color={color ?? feeling.bem.icon} />;
    }
  }
);

MoodIcon.displayName = "MoodIcon";

/**
 * Mapa de ícones por mood para uso direto
 */
export const MOOD_ICONS = {
  // EmotionalCheckInPrimary moods
  bem: MoodBemIcon,
  cansada: MoodCansadaIcon,
  indisposta: MoodIndispostaIcon,
  enjoada: MoodIndispostaIcon,
  amada: MoodAmadaIcon,
  // DailyLogScreen moods
  happy: MoodHappyIcon,
  calm: MoodCalmIcon,
  energetic: MoodEnergeticIcon,
  anxious: MoodAnxiousIcon,
  sad: MoodSadIcon,
  irritated: MoodIrritatedIcon,
  sensitive: MoodSensitiveIcon,
  tired: MoodTiredIcon,
} as const;

export default MoodIcon;
