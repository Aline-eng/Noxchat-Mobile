import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ChatListScreen } from "@/features/chat/screens/ChatListScreen";

const navigation = { navigate: jest.fn() } as never;
const route = {} as never;

describe("ChatListScreen", () => {
  it("renders the chat list and navigates to Conversation on row press", () => {
    render(<ChatListScreen navigation={navigation} route={route} />);
    expect(screen.getByText("Weekend Trip")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Open conversation with Weekend Trip"));
    expect((navigation as { navigate: jest.Mock }).navigate).toHaveBeenCalledWith("Conversation", {
      chatId: "c1",
      displayName: "Weekend Trip",
    });
  });
});
