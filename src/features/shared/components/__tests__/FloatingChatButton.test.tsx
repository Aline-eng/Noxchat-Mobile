import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { FloatingChatButton } from "@/features/shared/components/FloatingChatButton";

describe("FloatingChatButton", () => {
  it("renders and calls onPress", () => {
    const onPress = jest.fn();
    render(<FloatingChatButton onPress={onPress} />);
    fireEvent.press(screen.getByLabelText("Open chats"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
