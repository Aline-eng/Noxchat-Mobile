import { useGamesFeed, matchesCategory } from "@/features/games/api/useGamesFeed";
import { GAME_SESSIONS } from "@/mocks/fixtures";

describe("useGamesFeed", () => {
  it("joins every session to a label, participant names, and a pot display", () => {
    const items = useGamesFeed();
    expect(items).toHaveLength(GAME_SESSIONS.length);
    items.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.participantNames.length).toBe(item.session.participantIds.length);
      expect(item.participantNames).not.toContain("Unknown");
    });
  });

  it("marks active sessions as live and derives the pot display", () => {
    const items = useGamesFeed();
    const quiz = items.find((item) => item.session.id === "g1");
    expect(quiz?.isLive).toBe(true);
    expect(quiz?.potDisplay).toBe("35 coins");

    const waiting = items.find((item) => item.session.id === "g2");
    expect(waiting?.isLive).toBe(false);
    expect(waiting?.potDisplay).toBe("No bet");
  });
});

describe("matchesCategory", () => {
  const items = useGamesFeed();

  it("filters live sessions", () => {
    const quiz = items.find((item) => item.session.id === "g1")!;
    expect(matchesCategory(quiz, "live")).toBe(true);
  });

  it("filters 1v1 sessions by exactly two participants", () => {
    const truthOrDare = items.find((item) => item.session.id === "g3")!;
    expect(matchesCategory(truthOrDare, "1v1")).toBe(false);
    expect(matchesCategory(truthOrDare, "party")).toBe(true);
  });
});
