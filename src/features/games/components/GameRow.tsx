import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Dice5, Gamepad2, Palette, Swords } from "lucide-react-native";
import { Avatar } from "@/components/ui/Avatar";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";
import type { GameItem } from "@/features/games/api/useGamesFeed";
import type { GameType } from "@/mocks/fixtures";

interface Props {
  item: GameItem;
  onPress: () => void;
}

const GAME_TYPE_ICONS: Record<GameType, typeof Swords> = {
  quizbattle: Swords,
  tictactoe: Gamepad2,
  truthordare: Dice5,
  drawingguess: Palette,
};

const MAX_VISIBLE_AVATARS = 3;

// One row of the Games list — icon, name, LIVE badge, participant avatars,
// and a Join/Start button, per docs/web-prototype-reference.jsx's GameRow.
export function GameRow({ item, onPress }: Props) {
  const Icon = GAME_TYPE_ICONS[item.session.gameType];

  return (
    <View style={styles.container}>
      <View style={styles.iconTile}>
        <Icon size={19} color={colors.noir} />
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.label}</Text>
          {item.isLive ? (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveLabel}>LIVE</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.meta}>
          {item.participantNames.length} playing · {item.potDisplay}
        </Text>
      </View>

      <View style={styles.avatarStack}>
        {item.participantNames.slice(0, MAX_VISIBLE_AVATARS).map((name, index) => (
          <View key={name} style={index === 0 ? undefined : styles.avatarOverlap}>
            <Avatar name={name} size={26} />
          </View>
        ))}
      </View>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={item.isLive ? `Join ${item.label}` : `Start ${item.label}`}
        style={styles.actionButton}
      >
        <Text style={styles.actionLabel}>{item.isLive ? "Join" : "Start"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    padding: spacing.md + 2,
    borderRadius: radii.lg - 2,
    backgroundColor: colors.noir2,
  },
  iconTile: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.camel,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs + 2 },
  name: { fontFamily: fontFamily.uiBold, fontSize: fontSize.base, color: colors.latte },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FF9B7A" },
  liveLabel: { fontFamily: fontFamily.uiBold, fontSize: 10, color: "#FF9B7A" },
  meta: { fontFamily: fontFamily.ui, fontSize: fontSize.xs, color: colors.donkey, marginTop: 2 },
  avatarStack: { flexDirection: "row" },
  avatarOverlap: { marginLeft: -10 },
  actionButton: {
    backgroundColor: colors.camel,
    borderRadius: radii.md - 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionLabel: { fontFamily: fontFamily.uiBold, fontSize: fontSize.sm, color: colors.noir },
});
