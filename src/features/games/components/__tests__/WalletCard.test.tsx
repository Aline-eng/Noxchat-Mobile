import React from "react";
import { render, screen } from "@testing-library/react-native";
import { WalletCard } from "@/features/games/components/WalletCard";
import { WALLET } from "@/mocks/fixtures";

describe("WalletCard", () => {
  it("renders the coin balance and leaderboard position", () => {
    render(<WalletCard wallet={WALLET} />);
    expect(screen.getByText(`${WALLET.coinBalance} Nox Coins`)).toBeTruthy();
    expect(screen.getByText(`#${WALLET.leaderboardPosition} on ${WALLET.groupName}'s leaderboard`)).toBeTruthy();
  });
});
