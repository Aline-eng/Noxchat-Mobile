import { renderHook, act } from "@testing-library/react-native";
import { useLogin } from "@/features/auth/api/useLogin";

describe("useLogin", () => {
  it("succeeds for any phone number", async () => {
    const { result } = renderHook(() => useLogin());
    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.submit("+10000000000");
    });
    expect(success).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
