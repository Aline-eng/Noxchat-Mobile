import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";
import type { ChatListItem } from "@/features/chat/api/useChatList";

interface Props {
  item: ChatListItem;
  onPress: () => void;
}

// One inbox row — avatar, name, message preview, relative time, and an
// unread badge, per docs/web-prototype-reference.jsx's ChatListScreen.
export function ChatRow({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open conversation with ${item.displayName}`}
      style={styles.container}
    >
      <Avatar name={item.displayName} size={48} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.displayName}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {item.preview}
        </Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.time}>{item.timeLabel}</Text>
        {item.unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{item.unreadCount}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg - 4,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontFamily: fontFamily.uiBold, fontSize: fontSize.base, color: colors.latte },
  preview: { fontFamily: fontFamily.ui, fontSize: fontSize.sm, color: colors.donkey, marginTop: 2 },
  meta: { alignItems: "flex-end", gap: spacing.xs + 2 },
  time: { fontFamily: fontFamily.ui, fontSize: fontSize.xs, color: colors.donkey },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.camel,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeLabel: { fontFamily: fontFamily.uiBold, fontSize: 10.5, color: colors.noir },
});
