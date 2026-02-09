import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { brand, premium } from "../../../theme/tokens";
import { FONTS } from "../../../config/onboarding-data";

const GLASS = premium.glass;
const TEXT = premium.text;

interface EpisodeCardProps {
  day: number;
  title: string;
  icon: string;
  delay: number;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = React.memo(({ day, title, icon, delay }) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={styles.episodeCard}
    >
      <View style={styles.episodeDay}>
        <Text style={styles.episodeDayText}>{day}</Text>
      </View>
      <View style={styles.episodeContent}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color={brand.accent[400]}
        />
        <Text style={styles.episodeTitle}>{title}</Text>
      </View>
      <View style={styles.episodeLock}>
        <Ionicons name="lock-closed" size={14} color={TEXT.hint} />
      </View>
    </Animated.View>
  );
});

EpisodeCard.displayName = "EpisodeCard";

const styles = StyleSheet.create({
  episodeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GLASS.ultraLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: GLASS.base,
  },
  episodeDay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GLASS.base,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  episodeDayText: {
    fontSize: 14,
    fontFamily: FONTS.headline,
    color: TEXT.bright,
  },
  episodeContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  episodeTitle: {
    fontSize: 15,
    fontFamily: FONTS.body,
    color: TEXT.bright,
  },
  episodeLock: {
    padding: 8,
  },
});
