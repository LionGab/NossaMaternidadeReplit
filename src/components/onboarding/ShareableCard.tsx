/**
 * ShareableCard - Card compartilhável da temporada
 * Preview do card que será salvo no rolo de câmera
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Tokens } from "../../theme/tokens";

interface ShareableCardProps {
  seasonName: string;
  nathImage?: number | { uri: string }; // require() asset ou URI da foto da Nath
}

export function ShareableCard({ seasonName, nathImage }: ShareableCardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Tokens.gradients.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header com contexto */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Sua temporada atual</Text>
          {nathImage && (
            <View style={styles.nathImageContainer}>
              <Image
                source={nathImage}
                style={styles.nathImage}
                resizeMode="cover"
                accessible={false}
              />
            </View>
          )}
        </View>

        {/* Texto principal */}
        <View style={styles.textContainer}>
          <Text style={styles.seasonText}>{seasonName}</Text>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>@nathaliavalente • #NossaMaternidade</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1, // Quadrado
    borderRadius: Tokens.radius["3xl"],
    overflow: "hidden",
    ...Tokens.shadows.lg,
  },
  gradient: {
    flex: 1,
    padding: Tokens.spacing["3xl"],
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: Tokens.neutral[0],
    opacity: 0.85,
    letterSpacing: 0.3,
  },
  nathImageContainer: {
    width: 48,
    height: 48,
    borderRadius: Tokens.radius.full,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: Tokens.neutral[0],
    ...Tokens.shadows.md,
  },
  nathImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing["3xl"],
  },
  seasonText: {
    fontSize: 32,
    fontWeight: Tokens.typography.headlineLarge.fontWeight,
    color: Tokens.neutral[0],
    textAlign: "center",
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  footer: {
    alignItems: "center",
    paddingTop: Tokens.spacing.md,
  },
  footerText: {
    fontSize: Tokens.typography.labelSmall.fontSize,
    color: Tokens.neutral[0],
    opacity: 0.9,
    letterSpacing: 0.5,
  },
});
