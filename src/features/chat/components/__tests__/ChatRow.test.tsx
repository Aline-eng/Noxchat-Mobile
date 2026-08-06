import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ChatRow } from "@/features/chat/components/ChatRow";
import { useChatList } from "@/features/chat/api/useChatList";

const NOW = new Date("2026-07-26T22:00:00.000Z");

describe("ChatRow", () => {
  it("renders name, preview, time, and calls onPress", () => {
    const item = useChatList(NOW).find((i) => i.chat.id === "c1")!;
    const onPress = jest.fn();
    render(<ChatRow item={item} onPress={onPress} />);

    expect(screen.getByText("Weekend Trip")).toBeTruthy();
    expect(screen.getByText(item.preview)).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Open conversation with Weekend Trip"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows an unread badge only when there are unread messages", () => {
    const unread = useChatList(NOW).find((i) => i.chat.id === "c1")!;
    render(<ChatRow item={unread} onPress={jest.fn()} />);
    expect(screen.getByText(String(unread.unreadCount))).toBeTruthy();
  });
});
