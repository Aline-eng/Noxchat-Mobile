import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { BetModal } from "@/features/games/components/BetModal";

describe("BetModal", () => {
  it("shows Join for a live game and calls onConfirm with the selected amount", () => {
    const onConfirm = jest.fn();
    render(
      <BetModal visible gameLabel="Quiz Battle" isLive maxBet={50} onConfirm={onConfirm} onCancel={jest.fn()} />,
    );
    expect(screen.getByText("Join Quiz Battle")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Increase bet"));
    fireEvent.press(screen.getByLabelText(/Confirm \d+ coin bet/));
    expect(onConfirm).toHaveBeenCalledWith(2);
  });

  it("shows Start for a non-live game and calls onCancel", () => {
    const onCancel = jest.fn();
    render(
      <BetModal visible gameLabel="Tic-Tac-Toe" isLive={false} maxBet={10} onConfirm={jest.fn()} onCancel={onCancel} />,
    );
    expect(screen.getByText("Start Tic-Tac-Toe")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
