import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useSignup } from "@/features/auth/api/useSignup";
import { MIN_SIGNUP_AGE } from "@/features/auth/api/authApi";

describe("useSignup", () => {
  it("succeeds for an eligible birth date", async () => {
    const { result } = renderHook(() => useSignup());
    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.submit("+10000000000", "2000-01-01");
    });
    expect(success).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("surfaces the age-gate error for an underage birth date", async () => {
    const under13 = new Date();
    under13.setFullYear(under13.getFullYear() - (MIN_SIGNUP_AGE - 1));
    const { result } = renderHook(() => useSignup());
    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.submit("+10000000000", under13.toISOString().slice(0, 10));
    });
    expect(success).toBe(false);
    await waitFor(() => expect(result.current.error).toMatch(/at least/i));
  });
});
