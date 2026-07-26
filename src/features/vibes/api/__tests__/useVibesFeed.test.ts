import { renderHook } from "@testing-library/react-native";
import { useVibesFeed } from "@/features/vibes/api/useVibesFeed";
import { STATUSES } from "@/mocks/fixtures";

describe("useVibesFeed", () => {
  it("joins every status to its author name and a swatch color", () => {
    const { result } = renderHook(() => useVibesFeed());
    expect(result.current).toHaveLength(STATUSES.length);
    result.current.forEach((item) => {
      expect(item.authorName).not.toBe("Unknown");
      expect(item.swatchColor).toMatch(/^#/);
    });
  });

  it("derives the same swatch color for the same author every time", () => {
    const { result: first } = renderHook(() => useVibesFeed());
    const { result: second } = renderHook(() => useVibesFeed());
    expect(first.current[0].swatchColor).toBe(second.current[0].swatchColor);
  });
});
