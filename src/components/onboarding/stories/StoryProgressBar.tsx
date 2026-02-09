import React from "react";
import { View, StyleSheet } from "react-native";
import { premium } from "../../../theme/tokens";

const GLASS = premium.glass;

interface StoryProgressBarProps {
  currentSlide: number;
  totalSlides: number;
  progress: number;
}

export const StoryProgressBar: React.FC<StoryProgressBarProps> = React.memo(
  ({ currentSlide, totalSlides, progress }) => {
    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <View key={index} style={styles.progressSegment}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    index < currentSlide
                      ? "100%"
                      : index === currentSlide
                        ? `${progress * 100}%`
                        : "0%",
                  backgroundColor: index <= currentSlide ? GLASS.progressActive : GLASS.strong,
                },
              ]}
            />
          </View>
        ))}
      </View>
    );
  }
);

StoryProgressBar.displayName = "StoryProgressBar";

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    backgroundColor: GLASS.strong,
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 1.5,
  },
});
