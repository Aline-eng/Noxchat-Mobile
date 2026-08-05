import {
  calculateAge,
  requestSignupOtp,
  requestLoginOtp,
  verifyOtp,
  UnderageError,
  MIN_SIGNUP_AGE,
} from "@/features/auth/api/authApi";

describe("calculateAge", () => {
  it("counts a birthday that already happened this year", () => {
    expect(calculateAge("2000-01-01", new Date("2026-06-15"))).toBe(26);
  });

  it("does not count a birthday that hasn't happened yet this year", () => {
    expect(calculateAge("2000-12-31", new Date("2026-06-15"))).toBe(25);
  });
});

describe("requestSignupOtp", () => {
  it("rejects a birth date under the minimum age", async () => {
    const under13 = new Date();
    under13.setFullYear(under13.getFullYear() - (MIN_SIGNUP_AGE - 1));
    await expect(requestSignupOtp("+10000000000", under13.toISOString().slice(0, 10))).rejects.toBeInstanceOf(
      UnderageError,
    );
  });

  it("succeeds for a birth date at or above the minimum age", async () => {
    await expect(requestSignupOtp("+10000000000", "2000-01-01")).resolves.toBeUndefined();
  });
});

describe("requestLoginOtp", () => {
  it("resolves for any phone number", async () => {
    await expect(requestLoginOtp("+10000000000")).resolves.toBeUndefined();
  });
});

describe("verifyOtp", () => {
  it("creates a user with 100 starting Nox Coins on a correct code", async () => {
    const { user, tokens } = await verifyOtp({ phoneNumber: "+10000000000", code: "123456" });
    expect(user.noxCoinBalance).toBe(100);
    expect(user.phoneNumber).toBe("+10000000000");
    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
  });

  it("rejects an incorrect code", async () => {
    await expect(verifyOtp({ phoneNumber: "+10000000000", code: "000000" })).rejects.toThrow(/incorrect/i);
  });
});
