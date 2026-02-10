/**
 * QuickComposerCard - Card de composer rapido no topo do feed
 *
 * Design compacto:
 * - Avatar 40px
 * - Botoes de acao compactos com icone + label
 * - shadowPresets.sm cross-platform
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
import { brand, neutral, radius, semantic, spacing, typography } from "../../theme/tokens";
import { shadowPresets } from "../../utils/shadow";

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

    // Scales individuais para cada botao de acao
    const photoScale = useSharedValue(1);
    const videoScale = useSharedValue(1);
    const questionScale = useSharedValue(1);

    const bgCard = isDark ? neutral[800] : neutral[0];
    const borderColor = isDark ? neutral[700] : neutral[100];
    const textMuted = isDark ? neutral[400] : neutral[500];

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    // Estilos animados para cada botao
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

    // Handlers para botoes de acao com animacao individual
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
        <View
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
          <Pressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Criar nova publicação"
            accessibilityHint="Toque para escrever um novo post na comunidade"
            accessibilityState={{ disabled: !!disabled }}
            style={styles.topRow}
          >
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
                  <Ionicons name="person" size={18} color={brand.primary[500]} />
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
          </Pressable>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          {/* Bottom row: Action icons */}
          <View style={styles.bottomRow}>
            <Animated.View style={[photoAnimatedStyle, styles.actionFlex]}>
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
                ]}
              >
                <Ionicons name="image-outline" size={16} color={brand.accent[500]} />
                <Text style={[styles.actionText, { color: brand.accent[600] }]}>Foto</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={[videoAnimatedStyle, styles.actionFlex]}>
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
                ]}
              >
                <Ionicons name="videocam-outline" size={16} color={brand.primary[500]} />
                <Text style={[styles.actionText, { color: brand.primary[600] }]}>Vídeo</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={[questionAnimatedStyle, styles.actionFlex]}>
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
                ]}
              >
                <Ionicons name="help-circle-outline" size={16} color={brand.teal[500]} />
                <Text style={[styles.actionText, { color: brand.teal[600] }]}>Dúvida</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    );
  }
);

QuickComposerCard.displayName = "QuickComposerCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: radius["2xl"],
    borderWidth: 1,
    padding: spacing.md,
    ...shadowPresets.sm,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: semantic.light.success,
    borderWidth: 1.5,
    borderColor: neutral[0],
  },
  inputPlaceholder: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 2,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
  },
  bottomRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionFlex: {
    flex: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    minHeight: 40,
  },
  actionText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semibold,
    letterSpacing: 0.2,
  },
});
