import { useAuthStore } from "@/features/auth/store/useAuthStore";
import type { AuthTokens, AuthUser } from "@/features/auth/api/authApi";

const mockUser: AuthUser = {
  id: "u1",
  phoneNumber: "+10000000000",
  displayName: "You",
  birthDate: "2000-01-01",
  noxCoinBalance: 100,
};
const mockTokens: AuthTokens = { accessToken: "a", refreshToken: "b" };

describe("useAuthStore", () => {
  afterEach(() => {
    useAuthStore.getState().clearSession();
  });

  it("starts with no session", () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().tokens).toBeNull();
  });

  it("sets the session", () => {
    useAuthStore.getState().setSession(mockUser, mockTokens);
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().tokens).toEqual(mockTokens);
  });

  it("clears the session", () => {
    useAuthStore.getState().setSession(mockUser, mockTokens);
    useAuthStore.getState().clearSession();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().tokens).toBeNull();
  });
});
