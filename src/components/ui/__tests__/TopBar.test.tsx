import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { TopBar } from "@/components/ui/TopBar";

describe("TopBar", () => {
  it("renders the title and calls onAvatarPress", () => {
    const onAvatarPress = jest.fn();
    render(<TopBar title="Games" onAvatarPress={onAvatarPress} />);
    expect(screen.getByText("Games")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Open profile"));
    expect(onAvatarPress).toHaveBeenCalledTimes(1);
  });

  it("defaults to the Noxchat title", () => {
    render(<TopBar onAvatarPress={jest.fn()} />);
    expect(screen.getByText("Noxchat")).toBeTruthy();
  });

  it("only renders the search button when onSearchPress is provided", () => {
    render(<TopBar onAvatarPress={jest.fn()} />);
    expect(screen.queryByLabelText("Search")).toBeNull();
  });

  it("calls onSearchPress when the search button is pressed", () => {
    const onSearchPress = jest.fn();
    render(<TopBar onAvatarPress={jest.fn()} onSearchPress={onSearchPress} />);
    fireEvent.press(screen.getByLabelText("Search"));
    expect(onSearchPress).toHaveBeenCalledTimes(1);
  });
});
