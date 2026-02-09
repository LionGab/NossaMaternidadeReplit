/**
 * QuickComposerCard - Card de composer rápido no topo do feed
 *
 * Design premium com:
 * - Avatar do usuário
 * - Prompt acolhedor
 * - Ícones de ação (foto, vídeo)
 * - Animação sutil ao pressionar
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../../hooks/useTheme";
import { useAppStore } from "../../state";
import { brand, neutral, radius, semantic, shadows, spacing, typography } from "../../theme/tokens";

interface QuickComposerCardProps {
  onPress: () => void;
  onPhotoPress?: () => void;
  disabled?: boolean;
}

export const QuickComposerCard: React.FC<QuickComposerCardProps> = React.memo(
  ({ onPress, onPhotoPress, disabled }) => {
    const { isDark } = useTheme();
    const user = useAppStore((s) => s.user);
    const scale = useSharedValue(1);

    // Scales individuais para cada botão de ação
    const photoScale = useSharedValue(1);
    const videoScale = useSharedValue(1);
    const questionScale = useSharedValue(1);

    const bgCard = isDark ? neutral[800] : neutral[0];
    const borderColor = isDark ? neutral[700] : neutral[100];
    const textMuted = isDark ? neutral[400] : neutral[500];

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    // Estilos animados para cada botão
    const photoAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: photoScale.value }],
    }));
    const videoAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: videoScale.value }],
    }));
    const questionAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: questionScale.value }],
    }));

    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.98, { damping: 15 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 12 });
    }, [scale]);

    // Handlers para botões de ação com animação individual
    const createActionHandlers = useCallback(
      (scaleValue: SharedValue<number>) => ({
        onPressIn: () => {
          scaleValue.value = withSpring(0.95, { damping: 15, stiffness: 400 });
        },
        onPressOut: () => {
          scaleValue.value = withSpring(1, { damping: 12, stiffness: 300 });
        },
      }),
      []
    );

    const handlePress = useCallback(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }, [onPress]);

    const handlePhotoPress = useCallback(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPhotoPress?.();
    }, [onPhotoPress]);

    const userName = user?.name?.split(" ")[0] || "Mamãe";

    return (
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        style={[animatedStyle, styles.container]}
      >
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Criar nova publicação"
          accessibilityHint="Toque para escrever um novo post na comunidade"
          accessibilityState={{ disabled: !!disabled }}
          style={[
            styles.card,
            {
              backgroundColor: bgCard,
              borderColor,
            },
            disabled && styles.cardDisabled,
          ]}
        >
          {/* Top row: Avatar + Input placeholder */}
          <View style={styles.topRow}>
            {/* User Avatar */}
            <View style={styles.avatarContainer}>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatar}
                  contentFit="cover"
                  accessibilityLabel="Sua foto de perfil"
                />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: brand.primary[100] }]}>
                  <Ionicons name="person" size={20} color={brand.primary[500]} />
                </View>
              )}
              {/* Online indicator */}
              <View style={styles.onlineIndicator} />
            </View>

            {/* Input placeholder */}
            <View style={styles.inputPlaceholder}>
              <Text style={[styles.greeting, { color: textMuted }]}>Olá, {userName}!</Text>
              <Text style={[styles.placeholder, { color: isDark ? neutral[300] : neutral[600] }]}>
                Compartilhe sua experiência...
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          {/* Bottom row: Action icons */}
          <View style={styles.bottomRow}>
            <Animated.View style={photoAnimatedStyle}>
              <Pressable
                onPress={handlePhotoPress}
                {...createActionHandlers(photoScale)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel="Adicionar foto"
                accessibilityState={{ disabled: !!disabled }}
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: isDark ? `${brand.accent[500]}20` : brand.accent[50],
                    borderWidth: 1,
                    borderColor: isDark ? `${brand.accent[500]}30` : brand.accent[100],
                  },
                  !isDark && shadows.sm,
                ]}
              >
                <Ionicons name="image-outline" size={18} color={brand.accent[500]} />
                <Text style={[styles.actionText, { color: brand.accent[600] }]}>Foto</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={videoAnimatedStyle}>
              <Pressable
                onPress={handlePress}
                {...createActionHandlers(videoScale)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel="Adicionar vídeo"
                accessibilityState={{ disabled: !!disabled }}
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: isDark ? `${brand.primary[500]}20` : brand.primary[50],
                    borderWidth: 1,
                    borderColor: isDark ? `${brand.primary[500]}30` : brand.primary[100],
                  },
                  !isDark && shadows.sm,
                ]}
              >
                <Ionicons name="videocam-outline" size={18} color={brand.primary[500]} />
                <Text style={[styles.actionText, { color: brand.primary[600] }]}>Vídeo</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={questionAnimatedStyle}>
              <Pressable
                onPress={handlePress}
                {...createActionHandlers(questionScale)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel="Fazer pergunta"
                accessibilityState={{ disabled: !!disabled }}
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: isDark ? `${brand.teal[500]}20` : brand.teal[50],
                    borderWidth: 1,
                    borderColor: isDark ? `${brand.teal[500]}30` : brand.teal[100],
                  },
                  !isDark && shadows.sm,
                ]}
              >
                <Ionicons name="help-circle-outline" size={18} color={brand.teal[500]} />
                <Text style={[styles.actionText, { color: brand.teal[600] }]}>Dúvida</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

QuickComposerCard.displayName = "QuickComposerCard";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: radius["2xl"],
    borderWidth: 1,
    padding: spacing.lg, // 16px (era 12px) - mais espaço interno
    ...shadows.flo.soft, // sombra mais suave e elegante
  },
  cardDisabled: {
    opacity: 0.6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg, // 16px (era 12px) - mais espaço
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 48, // 48px (era 44px) - um pouco maior
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14, // 14px (era 12px)
    height: 14,
    borderRadius: 7,
    backgroundColor: semantic.light.success,
    borderWidth: 2,
    borderColor: neutral[0],
  },
  inputPlaceholder: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 4, // 4px (era 2px)
  },
  placeholder: {
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg, // 16px (era 12px) - mais respiração
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: spacing.md, // 12px (era 8px)
    paddingTop: spacing.xs, // pequeno espaço extra no topo
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm, // 8px (era 4px) - mais espaço entre ícone e texto
    paddingVertical: spacing.md, // 12px - bom touch target
    paddingHorizontal: spacing.xl, // 20px (era 16px) - mais área de toque
    borderRadius: radius.xl, // 20px - mais arredondado e convidativo
    minHeight: 48, // 48px (era 44px) - melhor touch target
    minWidth: 96, // largura mínima para consistência
  },
  actionText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.semibold,
    letterSpacing: 0.2, // leve espaçamento para legibilidade
  },
});
