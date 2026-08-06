import { renderHook, act } from "@testing-library/react-native";
import { useMagneticPress } from "@/features/shared/hooks/useMagneticPress";

function layoutEvent(width: number, height: number) {
  return { nativeEvent: { layout: { x: 0, y: 0, width, height } } } as never;
}

function pressEvent(locationX: number, locationY: number) {
  return { nativeEvent: { locationX, locationY } } as never;
}

describe("useMagneticPress", () => {
  it("starts at zero offset", () => {
    const { result } = renderHook(() => useMagneticPress());
    expect(result.current.offset).toEqual({ x: 0, y: 0 });
  });

  it("offsets toward the touch point, scaled by pullStrength", () => {
    const { result } = renderHook(() => useMagneticPress(0.5, 100));
    act(() => result.current.onLayout(layoutEvent(40, 40)));
    act(() => result.current.onPressIn(pressEvent(40, 20)));
    // touch is (40,20); center is (20,20); dx = (40-20)*0.5 = 10, dy = 0
    expect(result.current.offset).toEqual({ x: 10, y: 0 });
  });

  it("clamps the offset to maxOffset", () => {
    const { result } = renderHook(() => useMagneticPress(1, 5));
    act(() => result.current.onLayout(layoutEvent(40, 40)));
    act(() => result.current.onPressIn(pressEvent(40, 40)));
    expect(result.current.offset).toEqual({ x: 5, y: 5 });
  });

  it("resets to zero on press out", () => {
    const { result } = renderHook(() => useMagneticPress(0.5, 100));
    act(() => result.current.onLayout(layoutEvent(40, 40)));
    act(() => result.current.onPressIn(pressEvent(40, 20)));
    act(() => result.current.onPressOut());
    expect(result.current.offset).toEqual({ x: 0, y: 0 });
  });
});
