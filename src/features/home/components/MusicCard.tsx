import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react-native";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";
import type { NowPlayingTrack } from "@/mocks/fixtures";

interface Props {
  track: NowPlayingTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const SPIN_DURATION_MS = 6000;

// The spinning-disc now-playing card from docs/design-reference.md /
// docs/web-prototype-reference.jsx's MusicCard. Uses a reanimated shared
// value (rather than moti's `loop` transition) so pausing freezes the disc
// at its current angle instead of snapping back to 0 — cancelAnimation
// leaves the shared value wherever it was interpolated to. Skip icons are
// decorative — there's no queue/track-list data yet to wire them to.
export function MusicCard({ track, isPlaying, onTogglePlay }: Props) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(rotation.value + 360, { duration: SPIN_DURATION_MS, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      cancelAnimation(rotation);
    }
  }, [isPlaying, rotation]);

  const discStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.disc, discStyle]}>
        <View style={styles.discCenter} />
      </Animated.View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {track.artist} · shared by {track.sharedBy}
        </Text>
      </View>

      <View style={styles.controls}>
        <SkipBack size={16} color={colors.donkey} accessibilityElementsHidden />
        <Pressable
          onPress={onTogglePlay}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Pause" : "Play"}
          style={styles.playButton}
        >
          {isPlaying ? (
            <Pause size={14} color={colors.charcoal} fill={colors.charcoal} />
          ) : (
            <Play size={14} color={colors.charcoal} fill={colors.charcoal} />
          )}
        </Pressable>
        <SkipForward size={16} color={colors.donkey} accessibilityElementsHidden />
      </View>
    </View>
  );
}

const DISC_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xxl - 2,
    padding: spacing.lg,
    borderRadius: radii.lg + 2,
    backgroundColor: colors.charcoal,
  },
  disc: {
    width: DISC_SIZE,
    height: DISC_SIZE,
    borderRadius: DISC_SIZE / 2,
    borderWidth: 3,
    borderColor: "#3a2f20",
    backgroundColor: "#1a140c",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  discCenter: {
    width: DISC_SIZE * 0.24,
    height: DISC_SIZE * 0.24,
    borderRadius: DISC_SIZE * 0.12,
    backgroundColor: colors.camel,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamily.uiBold,
    fontSize: fontSize.base,
    color: colors.latte,
  },
  subtitle: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.sm,
    color: colors.donkey,
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + 2,
  },
  playButton: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    backgroundColor: colors.camel,
    alignItems: "center",
    justifyContent: "center",
  },
});
