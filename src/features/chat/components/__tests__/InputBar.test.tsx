import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { InputBar } from "@/features/chat/components/InputBar";

describe("InputBar", () => {
  it("shows the record button and swaps to send once text is entered", () => {
    render(<InputBar onSend={jest.fn()} />);
    expect(screen.getByLabelText("Record voice message")).toBeTruthy();

    fireEvent.changeText(screen.getByLabelText("Message"), "hey");
    expect(screen.getByLabelText("Send")).toBeTruthy();
  });

  it("calls onSend with the trimmed text and clears the field", () => {
    const onSend = jest.fn();
    render(<InputBar onSend={onSend} />);
    fireEvent.changeText(screen.getByLabelText("Message"), "  hey there  ");
    fireEvent.press(screen.getByLabelText("Send"));
    expect(onSend).toHaveBeenCalledWith("hey there");
    expect(screen.getByLabelText("Record voice message")).toBeTruthy();
  });

  it("calls onRecordPress when there's no text", () => {
    const onRecordPress = jest.fn();
    render(<InputBar onSend={jest.fn()} onRecordPress={onRecordPress} />);
    fireEvent.press(screen.getByLabelText("Record voice message"));
    expect(onRecordPress).toHaveBeenCalledTimes(1);
  });
});
