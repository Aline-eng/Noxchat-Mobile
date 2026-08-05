import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { GamesScreen } from "@/features/games/screens/GamesScreen";
import { WALLET } from "@/mocks/fixtures";

const navigation = { navigate: jest.fn() } as never;
const route = {} as never;

describe("GamesScreen", () => {
  it("renders the wallet card and the default (Live now) category's games", () => {
    render(<GamesScreen navigation={navigation} route={route} />);
    expect(screen.getByText(`${WALLET.coinBalance} Nox Coins`)).toBeTruthy();
    expect(screen.getAllByText("LIVE").length).toBeGreaterThan(0);
  });

  it("filters the list when a different category chip is pressed", () => {
    render(<GamesScreen navigation={navigation} route={route} />);
    fireEvent.press(screen.getByLabelText("Party"));
    expect(screen.getByText("Truth or Dare")).toBeTruthy();
    expect(screen.queryByText("Tic-Tac-Toe")).toBeNull();
  });

  it("opens the bet modal when Join is pressed", () => {
    render(<GamesScreen navigation={navigation} route={route} />);
    fireEvent.press(screen.getByLabelText("Join Quiz Battle"));
    expect(screen.getByText("Join Quiz Battle")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Cancel"));
  });
});
