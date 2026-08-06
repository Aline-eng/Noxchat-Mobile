import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ConversationScreen } from "@/features/chat/screens/ConversationScreen";

const navigation = {} as never;

describe("ConversationScreen", () => {
  it("renders existing messages for the chat", () => {
    const route = { params: { chatId: "c1", displayName: "Weekend Trip" } } as never;
    render(<ConversationScreen navigation={navigation} route={route} />);
    expect(screen.getByText("ok who's driving Friday")).toBeTruthy();
  });

  it("appends a sent message to the list", () => {
    const route = { params: { chatId: "c1", displayName: "Weekend Trip" } } as never;
    render(<ConversationScreen navigation={navigation} route={route} />);

    fireEvent.changeText(screen.getByLabelText("Message"), "on my way");
    fireEvent.press(screen.getByLabelText("Send"));
    expect(screen.getByText("on my way")).toBeTruthy();
  });
});
