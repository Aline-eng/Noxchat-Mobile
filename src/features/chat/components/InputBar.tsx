import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { MotiView } from "moti";
import { Mic, Send } from "lucide-react-native";
import { colors, radii, spacing } from "@/theme";
import { useMagneticPress } from "@/features/shared/hooks/useMagneticPress";

interface Props {
  onSend: (text: string) => void;
  onRecordPress?: () => void;
}

// The text<->mic icon swap from docs/web-prototype-reference.jsx: Send
// shows once there's text to send, Mic otherwise. Recording itself isn't
// built yet (no capture pipeline) -- onRecordPress is a stub hook for
// whichever sprint adds Voice Notes 2.0 recording.
export function InputBar({ onSend, onRecordPress }: Props) {
  const [text, setText] = useState("");
  const { onLayout, onPressIn, onPressOut, offset } = useMagneticPress(0.35, 10);
  const hasText = text.trim().length > 0;

  const handlePress = () => {
    if (hasText) {
      onSend(text.trim());
      setText("");
    } else {
      onRecordPress?.();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldWrap}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message"
          placeholderTextColor={colors.donkey}
          style={styles.field}
          accessibilityLabel="Message"
        />
      </View>
      <Pressable
        onLayout={onLayout}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={hasText ? "Send" : "Record voice message"}
      >
        {({ pressed }) => (
          <MotiView
            animate={{ scale: pressed ? 0.92 : 1, translateX: offset.x, translateY: offset.y }}
            transition={{ type: "spring", damping: 16, stiffness: 180 }}
            style={styles.button}
          >
            {hasText ? <Send size={16} color={colors.noir} /> : <Mic size={17} color={colors.noir} />}
          </MotiView>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.md,
  },
  fieldWrap: {
    flex: 1,
    backgroundColor: colors.noir2,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  field: { color: colors.latte, fontSize: 14.5 },
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.camel,
    alignItems: "center",
    justifyContent: "center",
  },
});
