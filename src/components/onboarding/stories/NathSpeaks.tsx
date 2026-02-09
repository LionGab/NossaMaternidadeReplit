import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInUp } from "react-native-reanimated";
import { brand, premium, semantic, maternal } from "../../../theme/tokens";
import { FONTS } from "../../../config/onboarding-data";

// Imagem exclusiva para NathSpeaks no onboarding
const MYCARE_IMAGE = require("../../../../assets/mycare-image.jpg");

const GLASS = premium.glass;
const TEXT = premium.text;

interface NathSpeaksProps {
  message: string;
  delay?: number;
}

export const NathSpeaks: React.FC<NathSpeaksProps> = React.memo(({ message, delay = 0 }) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500).springify()}
      style={styles.nathContainer}
    >
      <View style={styles.nathAvatarWrap}>
        <Image
          source={MYCARE_IMAGE}
          style={styles.nathAvatar}
          contentFit="cover"
          accessibilityLabel="Ilustração de autocuidado"
        />
        <View style={styles.nathOnline} />
      </View>
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>{message}</Text>
        <View style={styles.speechTail} />
      </View>
    </Animated.View>
  );
});

NathSpeaks.displayName = "NathSpeaks";

const styles = StyleSheet.create({
  nathContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  nathAvatarWrap: {
    marginRight: 12,
  },
  nathAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: brand.accent[400],
  },
  nathOnline: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: semantic.light.success,
    borderWidth: 2,
    borderColor: maternal.stories.moment[0],
  },
  speechBubble: {
    flex: 1,
    backgroundColor: GLASS.medium,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    padding: 16,
    position: "relative",
  },
  speechText: {
    fontSize: 17,
    fontFamily: FONTS.body,
    color: TEXT.primary,
    lineHeight: 24,
  },
  speechTail: {
    position: "absolute",
    top: 14,
    left: -8,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: "transparent",
    borderBottomWidth: 8,
    borderBottomColor: "transparent",
    borderRightWidth: 8,
    borderRightColor: GLASS.medium,
  },
});
