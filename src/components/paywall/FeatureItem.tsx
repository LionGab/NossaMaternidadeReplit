/**
 * FeatureItem - Feature list item for paywall screens
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { premium, typography, overlay } from "../../theme/tokens";

interface FeatureItemProps {
  icon: string;
  text: string;
  delay: number;
}

export const FeatureItem: React.FC<FeatureItemProps> = React.memo(({ icon, text, delay }) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(400).springify()}
      style={styles.featureItem}
    >
      <View style={styles.featureIcon}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color={premium.text.accent}
        />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </Animated.View>
  );
});

FeatureItem.displayName = "FeatureItem";

const styles = StyleSheet.create({
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: premium.glass.background,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: "48%",
    borderWidth: 0,
    shadowColor: overlay.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: premium.text.secondary,
    lineHeight: 20,
  },
});
