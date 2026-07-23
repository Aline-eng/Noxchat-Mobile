import { renderHook } from "@testing-library/react-native";
import { useBlogFeed } from "@/features/home/api/useBlogFeed";
import { BLOGS } from "@/mocks/fixtures";

describe("useBlogFeed", () => {
  it("returns the mock blog posts", () => {
    const { result } = renderHook(() => useBlogFeed());
    expect(result.current).toEqual(BLOGS);
  });
});
