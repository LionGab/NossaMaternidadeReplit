/**
 * GlassCard - Glass-morphism card container
 */

import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { premium } from "../../theme/tokens";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  return (
    <View style={[styles.glassCard, style]}>
      {/* Highlight edge */}
      <View style={styles.glassHighlight} />
      {children}
    </View>
  );
};

GlassCard.displayName = "GlassCard";

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: premium.glass.background,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: premium.glass.border,
    padding: 24,
    overflow: "hidden",
  },
  glassHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: premium.glass.highlight,
  },
});
