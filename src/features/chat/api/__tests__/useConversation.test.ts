import { useConversation } from "@/features/chat/api/useConversation";

describe("useConversation", () => {
  it("returns messages for the given chat, sorted oldest-first", () => {
    const items = useConversation("c1");
    expect(items).toHaveLength(3);
    for (let i = 1; i < items.length; i++) {
      expect(new Date(items[i - 1].message.createdAt).getTime()).toBeLessThanOrEqual(
        new Date(items[i].message.createdAt).getTime(),
      );
    }
  });

  it("marks the current user's own message as mine, with the right sender name", () => {
    const items = useConversation("c1");
    const mine = items.find((item) => item.message.id === "m2")!;
    expect(mine.mine).toBe(true);
    expect(mine.senderName).toBe("You");

    const theirs = items.find((item) => item.message.id === "m1")!;
    expect(theirs.mine).toBe(false);
    expect(theirs.senderName).toBe("Maya");
  });

  it("attaches the VoiceNote for voice-type messages", () => {
    const items = useConversation("c2");
    const voiceMessage = items.find((item) => item.message.type === "voice")!;
    expect(voiceMessage.voiceNote?.durationSeconds).toBe(42);
  });
});
