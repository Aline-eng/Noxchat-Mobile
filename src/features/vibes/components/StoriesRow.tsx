import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { colors, fontFamily, fontSize, spacing } from "@/theme";
import type { VibeItem } from "@/features/vibes/api/useVibesFeed";

interface Props {
  items: VibeItem[];
}

const AVATAR_SIZE = 46;
const ITEM_WIDTH = 56;

// The horizontal ring-avatar row at the top of Vibes, one per active
// status — see docs/web-prototype-reference.jsx's VibesScreen.
export function StoriesRow({ items }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {items.map((item) => (
        <View key={item.status.id} style={styles.item}>
          <Avatar name={item.authorName} size={AVATAR_SIZE} ring />
          <Text style={styles.label} numberOfLines={1}>
            {item.authorName}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm - 2,
  },
  item: {
    alignItems: "center",
    gap: spacing.xs + 2,
    width: ITEM_WIDTH,
  },
  label: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.xs,
    color: colors.inkDim,
  },
});
