import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Search } from "lucide-react-native";
import { Avatar } from "@/components/ui/Avatar";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";

interface Props {
  title?: string;
  dark?: boolean;
  onAvatarPress: () => void;
  onSearchPress?: () => void;
}

const AVATAR_SIZE = 32;
const ICON_BUTTON_SIZE = 36;

// Shared header row for every tab screen — title, optional search action,
// and the top-right avatar that opens Profile. Light on Home/Vibes, dark on
// Games/Chat per docs/design-reference.md's surface split. Renders as part
// of each screen's own scrollable content (see docs/web-prototype-reference.jsx),
// not as React Navigation chrome, since Home/Vibes/Games can't share one
// stack-level header once some of them need to be dark and some light.
export function TopBar({ title = "Noxchat", dark = false, onAvatarPress, onSearchPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: dark ? colors.latte : colors.charcoal }]}>{title}</Text>
      <View style={styles.actions}>
        {onSearchPress ? (
          <Pressable
            onPress={onSearchPress}
            accessibilityRole="button"
            accessibilityLabel="Search"
            style={[styles.iconButton, { backgroundColor: dark ? colors.noir2 : colors.ivory }]}
          >
            <Search size={16} color={dark ? colors.latte : colors.ink} />
          </Pressable>
        ) : null}
        <Pressable onPress={onAvatarPress} accessibilityRole="button" accessibilityLabel="Open profile">
          <Avatar name="You" size={AVATAR_SIZE} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.lg,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + 2,
  },
  iconButton: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    borderRadius: radii.md - 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
