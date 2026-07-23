import { AccessibilityInfo } from "react-native";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";

describe("useReducedMotion", () => {
  it("defaults to false while the OS setting resolves", () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("reflects the OS reduce-motion setting once it resolves", async () => {
    jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValueOnce(true);
    const { result } = renderHook(() => useReducedMotion());
    await waitFor(() => expect(result.current).toBe(true));
  });
});
