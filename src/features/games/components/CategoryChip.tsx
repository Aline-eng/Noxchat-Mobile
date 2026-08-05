import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";

interface Props {
  label: string;
  color: string;
  active: boolean;
  onPress: () => void;
}

// A small pill filter button — visually distinct from Swatch (a color-block
// card, not a compact toggle), per docs/web-prototype-reference.jsx's
// GAME_CATS chips.
export function CategoryChip({ label, color, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={[styles.chip, { backgroundColor: active ? color : colors.noir2 }]}
    >
      <Text style={[styles.label, { color: active ? colors.latte : colors.donkey }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 1,
    borderRadius: radii.md - 2,
  },
  label: {
    fontFamily: fontFamily.uiBold,
    fontSize: fontSize.sm,
  },
});
