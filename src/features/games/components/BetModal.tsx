import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { BetAmountSlider } from "@/features/games/components/BetAmountSlider";
import { colors, fontFamily, fontSize, radii, spacing } from "@/theme";

interface Props {
  visible: boolean;
  gameLabel: string;
  isLive: boolean;
  maxBet: number;
  onConfirm: (amount: number) => void;
  onCancel: () => void;
}

const MIN_BET = 1;

// Shown when a player taps Join/Start on a GameRow. maxBet is
// Math.min(50, wallet.coinBalance) -- both halves of docs/backend-spec.md
// §4.5's "1-50 coins, can't exceed balance" rule.
export function BetModal({ visible, gameLabel, isLive, maxBet, onConfirm, onCancel }: Props) {
  const [amount, setAmount] = useState(MIN_BET);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{isLive ? `Join ${gameLabel}` : `Start ${gameLabel}`}</Text>
          <BetAmountSlider min={MIN_BET} max={maxBet} value={amount} onChange={setAmount} />
          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              style={styles.cancelButton}
            >
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(amount)}
              accessibilityRole="button"
              accessibilityLabel={`Confirm ${amount} coin bet`}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmLabel}>{isLive ? "Join" : "Start"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.noir2,
    borderTopLeftRadius: radii.lg + 4,
    borderTopRightRadius: radii.lg + 4,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: { fontFamily: fontFamily.display, fontSize: fontSize.md, color: colors.latte },
  actions: { flexDirection: "row", gap: spacing.sm },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    backgroundColor: colors.noir3,
  },
  cancelLabel: { fontFamily: fontFamily.uiBold, fontSize: fontSize.base, color: colors.donkey },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    backgroundColor: colors.camel,
  },
  confirmLabel: { fontFamily: fontFamily.uiBold, fontSize: fontSize.base, color: colors.noir },
});
