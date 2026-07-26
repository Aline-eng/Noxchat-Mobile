import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Swatch } from "@/components/ui/Swatch";
import { colors, fontFamily, fontSize, spacing } from "@/theme";
import type { BlogPost } from "@/mocks/fixtures";

interface Props {
  post: BlogPost;
}

const SWATCH_SIZE = 74;

// One row of the "from your friends" blog feed — a Swatch category tag
// beside title/excerpt/byline, per docs/web-prototype-reference.jsx's
// BlogCard. The excerpt is the one place Literata (serif) is used, per
// docs/design-reference.md's type system — it's the one surface meant for
// reading, not scanning.
export function BlogCard({ post }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.swatchWrap}>
        <Swatch color={post.swatchColor} label={post.category} height={SWATCH_SIZE} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={2}>
          {post.excerpt}
        </Text>
        <Text style={styles.byline}>
          {post.author} · {post.readTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  swatchWrap: {
    width: SWATCH_SIZE,
    flexShrink: 0,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.base,
    color: colors.charcoal,
    lineHeight: 19,
    marginBottom: 5,
  },
  excerpt: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.sm,
    color: colors.inkDim,
    lineHeight: 18,
    marginBottom: 6,
  },
  byline: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.xs,
    color: colors.donkey,
  },
});
