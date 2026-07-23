import React from "react";
import { StyleSheet, View } from "react-native";
import { Swatch } from "@/components/ui/Swatch";
import type { VibeItem } from "@/features/vibes/api/useVibesFeed";

interface Props {
  item: VibeItem;
  height?: number;
}

const DEFAULT_HEIGHT = 150;

// One cell of the Vibes swatch-card grid — the same Swatch component used
// for blog category tags, repurposed to name a person + their vibe with
// color, per docs/design-reference.md's "Swatch" section.
export function VibeCard({ item, height = DEFAULT_HEIGHT }: Props) {
  return (
    <View style={styles.container}>
      <Swatch
        color={item.swatchColor}
        label={item.authorName}
        sublabel={item.status.content}
        height={height}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
