import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { useConversation } from "@/features/chat/api/useConversation";

describe("MessageBubble", () => {
  it("renders text content", () => {
    const item = useConversation("c1").find((i) => i.message.id === "m1")!;
    render(<MessageBubble item={item} />);
    expect(screen.getByText("ok who's driving Friday")).toBeTruthy();
  });

  it("renders a voice note's transcript and duration, and toggles play/pause", () => {
    const item = useConversation("c2").find((i) => i.message.type === "voice")!;
    render(<MessageBubble item={item} />);

    expect(screen.getByText(item.voiceNote!.transcript)).toBeTruthy();
    expect(screen.getByText("0:42")).toBeTruthy();

    expect(screen.getByLabelText("Play voice note")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Play voice note"));
    expect(screen.getByLabelText("Pause voice note")).toBeTruthy();
  });
});
