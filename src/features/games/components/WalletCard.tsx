import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Flame } from "lucide-react-native";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";
import type { WalletSummary } from "@/mocks/fixtures";

interface Props {
  wallet: WalletSummary;
}

// Coin balance + leaderboard position, per
// docs/web-prototype-reference.jsx's GamesScreen wallet strip.
export function WalletCard({ wallet }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Flame size={18} color={colors.camel} />
      </View>
      <View>
        <Text style={styles.balance}>{wallet.coinBalance} Nox Coins</Text>
        <Text style={styles.leaderboard}>
          #{wallet.leaderboardPosition} on {wallet.groupName}&apos;s leaderboard
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.noir2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  balance: {
    fontFamily: fontFamily.uiBold,
    fontSize: fontSize.base,
    color: colors.latte,
  },
  leaderboard: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.xs,
    color: colors.donkey,
    marginTop: 2,
  },
});
