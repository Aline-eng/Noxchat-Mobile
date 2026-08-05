import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { CategoryChip } from "@/features/games/components/CategoryChip";

describe("CategoryChip", () => {
  it("renders the label and calls onPress", () => {
    const onPress = jest.fn();
    render(<CategoryChip label="Live now" color="#013324" active onPress={onPress} />);
    expect(screen.getByText("Live now")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Live now"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
