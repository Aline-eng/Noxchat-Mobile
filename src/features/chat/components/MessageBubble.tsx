import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CheckCheck, Pause, Play } from "lucide-react-native";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";
import type { ConversationItem } from "@/features/chat/api/useConversation";

interface Props {
  item: ConversationItem;
}

const MAX_BAR_HEIGHT = 20;

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Handles both text and voice-note message types per
// docs/backend-spec.md §4.2/§4.6. There's no real audio playback yet (no
// recording pipeline built) -- the play button just toggles a local
// "playing" visual state. The transcript is what §4.6 actually promises:
// generated on-device, uploaded as text only, shown here directly.
export function MessageBubble({ item }: Props) {
  const { message, mine, voiceNote } = item;
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={[styles.row, { alignItems: mine ? "flex-end" : "flex-start" }]}>
      <View
        style={[
          styles.bubble,
          mine ? styles.mineBubble : styles.theirsBubble,
          mine ? styles.mineCorner : styles.theirsCorner,
        ]}
      >
        {message.type === "voice" && voiceNote ? (
          <View>
            <View style={styles.voiceRow}>
              <Pressable
                onPress={() => setIsPlaying((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={isPlaying ? "Pause voice note" : "Play voice note"}
                style={styles.playButton}
              >
                {isPlaying ? (
                  <Pause size={13} color={colors.noir} fill={colors.noir} />
                ) : (
                  <Play size={13} color={colors.noir} fill={colors.noir} />
                )}
              </Pressable>
              <View style={styles.waveform}>
                {voiceNote.waveformData.map((value, index) => (
                  <View
                    key={index}
                    style={[styles.waveformBar, { height: Math.max(3, (value / 14) * MAX_BAR_HEIGHT) }]}
                  />
                ))}
              </View>
              <Text style={styles.duration}>{formatDuration(voiceNote.durationSeconds)}</Text>
            </View>
            <Text style={styles.transcript}>{voiceNote.editedTranscript ?? voiceNote.transcript}</Text>
          </View>
        ) : (
          <Text style={styles.text}>{message.content}</Text>
        )}
      </View>
      {mine ? <CheckCheck size={13} color={colors.camel} style={styles.readReceipt} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: spacing.sm + 2 },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: spacing.lg - 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.lg - 2,
  },
  mineBubble: { backgroundColor: colors.forest },
  theirsBubble: { backgroundColor: colors.noir2 },
  mineCorner: { borderBottomRightRadius: 5 },
  theirsCorner: { borderBottomLeftRadius: 5 },
  text: { fontFamily: fontFamily.ui, fontSize: fontSize.base, color: colors.latte, lineHeight: 19 },
  readReceipt: { marginTop: 3, alignSelf: "flex-end" },
  voiceRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.camel,
    alignItems: "center",
    justifyContent: "center",
  },
  waveform: { flexDirection: "row", alignItems: "center", gap: 2, height: MAX_BAR_HEIGHT },
  waveformBar: { width: 3, borderRadius: 1.5, backgroundColor: colors.donkey },
  duration: { fontFamily: fontFamily.ui, fontSize: fontSize.xs, color: colors.donkey },
  transcript: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.sm,
    color: colors.donkey,
    marginTop: spacing.xs + 2,
    lineHeight: 17,
  },
});
