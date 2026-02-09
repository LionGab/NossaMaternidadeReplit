/**
 * VideoPlayer - Player de vídeo para onboarding
 * Usa expo-video com controles simples (play/pause, mute)
 */

import React, { useState, useEffect, useCallback, memo } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator, ViewStyle } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { logger } from "../../utils/logger";

interface VideoPlayerProps {
  videoSource: number | { uri: string }; // require() asset ou URI
  onVideoEnd?: () => void;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  style?: ViewStyle;
}

function VideoPlayerComponent({
  videoSource,
  onVideoEnd,
  autoPlay = true,
  loop = false,
  muted = false,
  showControls = true,
  style,
}: VideoPlayerProps) {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Convert source format for expo-video
  const source = typeof videoSource === "number" ? videoSource : videoSource.uri;

  // Create video player using expo-video hook
  const player = useVideoPlayer(source, (player) => {
    player.loop = loop;
    player.muted = muted;
    if (autoPlay) {
      player.play();
    }
  });

  // Listen to player status changes
  useEffect(() => {
    if (!player) return;

    const statusListener = player.addListener("statusChange", (event) => {
      if (event.status === "loading") {
        setIsLoading(true);
      } else if (event.status === "readyToPlay") {
        setIsLoading(false);
      } else if (event.status === "error") {
        setHasError(true);
        setIsLoading(false);
        logger.error(
          "Video error",
          "VideoPlayer",
          new Error(event.error?.message || "Unknown error")
        );
      }
    });

    const endListener = player.addListener("playToEnd", () => {
      if (!loop) {
        setIsPlaying(false);
        onVideoEnd?.();
      }
    });

    const playingListener = player.addListener("playingChange", (event) => {
      setIsPlaying(event.isPlaying);
    });

    return () => {
      statusListener.remove();
      endListener.remove();
      playingListener.remove();
    };
  }, [player, loop, onVideoEnd]);

  // Sync muted state with player
  useEffect(() => {
    if (player) {
      player.muted = isMuted;
    }
  }, [player, isMuted]);

  const togglePlayPause = useCallback(() => {
    try {
      if (isPlaying) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    } catch (error) {
      logger.error(
        "Error controlling video",
        "VideoPlayer",
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }, [player, isPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  if (hasError) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Ionicons name="videocam-off" size={48} color={theme.text.tertiary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <VideoView player={player} style={styles.video} contentFit="cover" nativeControls={false} />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Tokens.brand.accent[500]} />
        </View>
      )}

      {showControls && !isLoading && (
        <View style={styles.controls}>
          <Pressable
            onPress={togglePlayPause}
            style={styles.controlButton}
            accessibilityLabel={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
            accessibilityRole="button"
          >
            <Ionicons name={isPlaying ? "pause" : "play"} size={32} color={Tokens.neutral[0]} />
          </Pressable>

          <Pressable
            onPress={toggleMute}
            style={styles.controlButton}
            accessibilityLabel={isMuted ? "Ativar som" : "Desativar som"}
            accessibilityRole="button"
          >
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={24}
              color={Tokens.neutral[0]}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

export const VideoPlayer = memo(VideoPlayerComponent);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Tokens.overlay.medium,
  },
  controls: {
    position: "absolute",
    bottom: Tokens.spacing.lg,
    left: Tokens.spacing.lg,
    flexDirection: "row",
    gap: Tokens.spacing.md,
  },
  controlButton: {
    width: Tokens.accessibility.minTapTarget,
    height: Tokens.accessibility.minTapTarget,
    borderRadius: Tokens.radius.full,
    backgroundColor: Tokens.overlay.dark,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Tokens.neutral[100],
    minHeight: 200,
  },
});
