import { renderHook, act } from "@testing-library/react-native";
import { useNowPlaying } from "@/features/home/api/useNowPlaying";
import { NOW_PLAYING } from "@/mocks/fixtures";

describe("useNowPlaying", () => {
  it("starts playing with the mock track", () => {
    const { result } = renderHook(() => useNowPlaying());
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.track).toEqual(NOW_PLAYING);
  });

  it("toggles play state", () => {
    const { result } = renderHook(() => useNowPlaying());
    act(() => result.current.togglePlay());
    expect(result.current.isPlaying).toBe(false);
    act(() => result.current.togglePlay());
    expect(result.current.isPlaying).toBe(true);
  });
});
