import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useVerifyOtp } from "@/features/auth/api/useVerifyOtp";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

describe("useVerifyOtp", () => {
  afterEach(() => {
    useAuthStore.getState().clearSession();
  });

  it("sets the session on a correct code", async () => {
    const { result } = renderHook(() => useVerifyOtp());
    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.submit({ phoneNumber: "+10000000000", code: "123456" });
    });
    expect(success).toBe(true);
    expect(useAuthStore.getState().user?.phoneNumber).toBe("+10000000000");
    expect(useAuthStore.getState().tokens).not.toBeNull();
  });

  it("surfaces an error and leaves the session empty on an incorrect code", async () => {
    const { result } = renderHook(() => useVerifyOtp());
    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.submit({ phoneNumber: "+10000000000", code: "000000" });
    });
    expect(success).toBe(false);
    await waitFor(() => expect(result.current.error).toMatch(/incorrect/i));
    expect(useAuthStore.getState().user).toBeNull();
  });
});
