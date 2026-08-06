import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { GameRow } from "@/features/games/components/GameRow";
import { useGamesFeed } from "@/features/games/api/useGamesFeed";

describe("GameRow", () => {
  it("shows the LIVE badge and 'Join' for an active session", () => {
    const item = useGamesFeed().find((i) => i.session.id === "g1")!;
    const onPress = jest.fn();
    render(<GameRow item={item} onPress={onPress} />);

    expect(screen.getByText("LIVE")).toBeTruthy();
    fireEvent.press(screen.getByLabelText(`Join ${item.label}`));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows 'Start' with no LIVE badge for a waiting session", () => {
    const item = useGamesFeed().find((i) => i.session.id === "g2")!;
    render(<GameRow item={item} onPress={jest.fn()} />);

    expect(screen.queryByText("LIVE")).toBeNull();
    expect(screen.getByLabelText(`Start ${item.label}`)).toBeTruthy();
  });
});
