import { useChatList, chatDisplayName, formatRelativeTime } from "@/features/chat/api/useChatList";
import { CHATS } from "@/mocks/fixtures";

const NOW = new Date("2026-07-26T22:00:00.000Z");

describe("useChatList", () => {
  it("returns one item per chat, sorted by lastMessageAt descending", () => {
    const items = useChatList(NOW);
    expect(items).toHaveLength(CHATS.length);
    for (let i = 1; i < items.length; i++) {
      expect(new Date(items[i - 1].chat.lastMessageAt).getTime()).toBeGreaterThanOrEqual(
        new Date(items[i].chat.lastMessageAt).getTime(),
      );
    }
  });

  it("derives the group name directly and the direct chat's other-member name", () => {
    const items = useChatList(NOW);
    const group = items.find((item) => item.chat.id === "c1")!;
    expect(group.displayName).toBe("Weekend Trip");

    const direct = items.find((item) => item.chat.id === "c2")!;
    expect(direct.displayName).toBe("Maya");
  });

  it("derives the preview from the latest message, including voice-note duration", () => {
    const items = useChatList(NOW);
    const direct = items.find((item) => item.chat.id === "c2")!;
    expect(direct.preview).toBe("sent a voice note · 0:42");
  });

  it("counts unread messages not sent by the current user", () => {
    const items = useChatList(NOW);
    const group = items.find((item) => item.chat.id === "c1")!;
    // m1 is read by "me", m3 isn't, m2 is mine so it's excluded either way.
    expect(group.unreadCount).toBe(1);
  });
});

describe("chatDisplayName", () => {
  it("returns the group's own name", () => {
    const group = CHATS.find((c) => c.id === "c1")!;
    expect(chatDisplayName(group)).toBe("Weekend Trip");
  });
});

describe("formatRelativeTime", () => {
  it("formats minutes, hours, and days", () => {
    expect(formatRelativeTime("2026-07-26T21:59:00.000Z", NOW)).toBe("1m");
    expect(formatRelativeTime("2026-07-26T20:00:00.000Z", NOW)).toBe("2h");
    expect(formatRelativeTime("2026-07-24T22:00:00.000Z", NOW)).toBe("2d");
  });
});
