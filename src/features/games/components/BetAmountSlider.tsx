import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";

interface Props {
  min?: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}

const STEPPER_SIZE = 32;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Bet-amount picker for games/betting (docs/backend-spec.md §4.5: 1-50
// coins, can't exceed balance -- callers pass max = Math.min(50, balance)).
// Built once here, reusable across every game type once they exist.
// Tap-to-jump on the track + explicit +/- steppers, both driving the same
// clamped value -- deliberately not gesture-drag-only, so it stays fully
// keyboard/screen-reader accessible via accessibilityRole="adjustable".
export function BetAmountSlider({ min = 1, max, value, onChange, step = 1 }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);

  const setClamped = (next: number) => onChange(clamp(next, min, max));

  const handleTrackPress = (locationX: number) => {
    if (trackWidth <= 0) return;
    const ratio = clamp(locationX / trackWidth, 0, 1);
    const raw = min + ratio * (max - min);
    setClamped(Math.round(raw / step) * step);
  };

  const handleLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width);

  const fillRatio = max > min ? (value - min) / (max - min) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Bet amount</Text>
        <Text style={styles.value}>{value} coins</Text>
      </View>

      <View style={styles.controlRow}>
        <Pressable
          onPress={() => setClamped(value - step)}
          accessibilityRole="button"
          accessibilityLabel="Decrease bet"
          style={styles.stepper}
        >
          <Text style={styles.stepperLabel}>–</Text>
        </Pressable>

        <Pressable
          onLayout={handleLayout}
          onPress={(event) => handleTrackPress(event.nativeEvent.locationX)}
          accessibilityRole="adjustable"
          accessibilityLabel="Bet amount"
          accessibilityValue={{ min, max, now: value }}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === "increment") setClamped(value + step);
            if (event.nativeEvent.actionName === "decrement") setClamped(value - step);
          }}
          accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
          style={styles.track}
        >
          <View style={[styles.trackFill, { width: `${fillRatio * 100}%` }]} />
        </Pressable>

        <Pressable
          onPress={() => setClamped(value + step)}
          accessibilityRole="button"
          accessibilityLabel="Increase bet"
          style={styles.stepper}
        >
          <Text style={styles.stepperLabel}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm + 2 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontFamily: fontFamily.uiMedium, fontSize: fontSize.sm, color: colors.donkey },
  value: { fontFamily: fontFamily.uiBold, fontSize: fontSize.sm, color: colors.camel },
  controlRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  stepper: {
    width: STEPPER_SIZE,
    height: STEPPER_SIZE,
    borderRadius: STEPPER_SIZE / 2,
    backgroundColor: colors.noir2,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperLabel: { fontFamily: fontFamily.uiBold, fontSize: fontSize.md, color: colors.latte },
  track: {
    flex: 1,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.noir2,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    backgroundColor: colors.camel,
    borderRadius: radii.pill,
  },
});
