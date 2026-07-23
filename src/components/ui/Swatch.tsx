import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fontFamily } from "@/theme";

interface SwatchProps {
  color: string;
  label: string;
  sublabel?: string;
  height?: number;
}

// The signature recurring element — see docs/design-reference.md. A
// rounded color-block card naming a mood/category with color, echoing
// the moodboard's own color-combo reels. Reused for Vibes, blog category
// tags, and the games leaderboard highlight — reach for this before
// inventing a new "tag a thing with a color" component.
export function Swatch({ color, label, sublabel, height = 96 }: SwatchProps) {
  return (
    <View
      style={[styles.container, { backgroundColor: color, height }]}
      accessibilityRole="text"
      accessibilityLabel={sublabel ? `${label}: ${sublabel}` : label}
    >
      <Text style={styles.label}>{label}</Text>
      {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 14,
    justifyContent: "flex-end",
  },
  label: {
    fontFamily: fontFamily.display,
    fontSize: 13,
    color: "#fff",
  },
  sublabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
});
