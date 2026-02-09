/**
 * FloScreenWrapper - Wrapper padronizado para telas no estilo Flo Health
 *
 * Design Flo Health Minimal:
 * - Fundo clean com gradiente muito sutil
 * - Safe area padding automático
 * - Scroll view opcional
 * - Keyboard avoiding behavior
 *
 * @example
 * ```tsx
 * <FloScreenWrapper scrollable>
 *   <FloHeader title="Início" />
 *   <Content />
 * </FloScreenWrapper>
 * ```
 */

import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { Tokens, spacing } from "../../theme/tokens";

interface FloScreenWrapperProps {
  /** Screen content */
  children: ReactNode;
  /** Enable scrolling */
  scrollable?: boolean;
  /** Use gradient background (default: true) */
  gradient?: boolean;
  /** Custom background colors override */
  backgroundColors?: readonly [string, string, ...string[]];
  /** Padding horizontal (default: 20) */
  paddingHorizontal?: number;
  /** Padding top (additional to safe area) */
  paddingTop?: number;
  /** Padding bottom (additional to safe area) */
  paddingBottom?: number;
  /** Enable pull-to-refresh */
  refreshing?: boolean;
  /** Pull-to-refresh callback */
  onRefresh?: () => void;
  /** Custom style */
  style?: ViewStyle;
  /** Show keyboard avoiding view */
  keyboardAvoiding?: boolean;
  /** Test ID */
  testID?: string;
}

export function FloScreenWrapper({
  children,
  scrollable = false,
  gradient = true,
  backgroundColors,
  paddingHorizontal = spacing.xl,
  paddingTop = spacing.lg,
  paddingBottom = 100,
  refreshing = false,
  onRefresh,
  style,
  keyboardAvoiding = false,
  testID,
}: FloScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  // Flo-style background: very subtle gradient
  const defaultGradient = isDark
    ? ([Tokens.neutral[950], Tokens.neutral[900], Tokens.neutral[950]] as const)
    : ([Tokens.brand.accent[50], Tokens.maternal.warmth.blush, Tokens.neutral[0]] as const);

  const bgColors = backgroundColors || defaultGradient;

  const contentStyle: ViewStyle = {
    paddingTop: insets.top + paddingTop,
    paddingBottom: insets.bottom + paddingBottom,
    paddingHorizontal,
    flexGrow: 1,
    ...style,
  };

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          testID={testID ? `${testID}-scroll` : undefined}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Tokens.brand.accent[400]}
                colors={[Tokens.brand.accent[400]]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View testID={testID} style={contentStyle}>
        {children}
      </View>
    );
  };

  const content = (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      {gradient ? (
        <LinearGradient
          colors={bgColors}
          style={{ flex: 1 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: isDark ? Tokens.neutral[950] : Tokens.neutral[0],
          }}
        >
          {renderContent()}
        </View>
      )}
    </>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}

export default FloScreenWrapper;
