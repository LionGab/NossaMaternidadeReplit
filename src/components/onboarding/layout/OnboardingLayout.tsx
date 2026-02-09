/**
 * OnboardingLayout - Layout base unificado para telas de onboarding
 *
 * Features:
 * - Gradient background configurável
 * - SafeArea handling automático
 * - KeyboardAvoidingView integrado
 * - Scroll quando conteúdo excede tela
 *
 * @example
 * <OnboardingLayout gradient={[Tokens.brand.accent[50], Tokens.brand.primary[50]]}>
 *   <OnboardingHeader ... />
 *   {content}
 *   <OnboardingFooter ... />
 * </OnboardingLayout>
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tokens } from "@/theme/tokens";

// ===========================================
// TYPES
// ===========================================

export interface OnboardingLayoutProps {
  /** Children to render inside the layout */
  children: React.ReactNode;
  /** Gradient colors for background (top to bottom) */
  gradient?: readonly [string, string] | readonly [string, string, string];
  /** Whether to enable scroll (default: true) */
  scrollable?: boolean;
  /** Whether to use keyboard avoiding view (default: true) */
  keyboardAvoiding?: boolean;
  /** Additional style for the content container */
  contentStyle?: ViewStyle;
  /** Test ID for e2e testing */
  testID?: string;
}

// ===========================================
// DEFAULTS
// ===========================================

const DEFAULT_GRADIENT: readonly [string, string] = [
  Tokens.brand.accent[50],
  Tokens.brand.primary[50],
];

// ===========================================
// COMPONENT
// ===========================================

export function OnboardingLayout({
  children,
  gradient = DEFAULT_GRADIENT,
  scrollable = true,
  keyboardAvoiding = true,
  contentStyle,
  testID,
}: OnboardingLayoutProps) {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    paddingTop: insets.top,
  };

  const content = (
    <View style={[styles.content, contentStyle]} testID={testID}>
      {children}
    </View>
  );

  const scrollContent = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={false}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  const keyboardContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {scrollContent}
    </KeyboardAvoidingView>
  ) : (
    scrollContent
  );

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={gradient as [string, string] | [string, string, string]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Content with safe area */}
      <View style={containerStyle}>{keyboardContent}</View>
    </View>
  );
}

// ===========================================
// STYLES
// ===========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.neutral[50],
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
});

// ===========================================
// EXPORTS
// ===========================================

export default OnboardingLayout;
