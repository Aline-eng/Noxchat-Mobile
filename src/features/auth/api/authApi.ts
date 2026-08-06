// Mirrors docs/backend-spec.md §3 (Authentication Flow) and §5.1. Gated by
// src/lib/apiClient.ts's USE_MOCKS pattern in spirit: these bodies simulate
// the real endpoints so screens can be built and swapped in Sprint 6 without
// changing their call sites.

import { CURRENT_USER_ID } from "@/mocks/fixtures";

export interface AuthUser {
  id: string;
  phoneNumber: string;
  displayName: string;
  birthDate: string;
  noxCoinBalance: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const MIN_SIGNUP_AGE = 13;
const MOCK_OTP_CODE = "123456";
const MOCK_NETWORK_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculateAge(birthDate: string, now: Date = new Date()): number {
  const dob = new Date(birthDate);
  let age = now.getFullYear() - dob.getFullYear();
  const hadBirthdayThisYear =
    now.getMonth() > dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return age;
}

export class UnderageError extends Error {}

// POST /auth/signup — phone + birth date, server sends OTP. The mock has no
// real SMS/server to call, so _phoneNumber is unused here but kept in the
// signature to match the real endpoint's contract.
export async function requestSignupOtp(_phoneNumber: string, birthDate: string): Promise<void> {
  if (calculateAge(birthDate) < MIN_SIGNUP_AGE) {
    throw new UnderageError(`You must be at least ${MIN_SIGNUP_AGE} to use Noxchat.`);
  }
  await delay(MOCK_NETWORK_DELAY_MS);
}

// POST /auth/login — existing user requests OTP again, no password.
export async function requestLoginOtp(_phoneNumber: string): Promise<void> {
  await delay(MOCK_NETWORK_DELAY_MS);
}

// POST /auth/verify-otp — verifies the code, returns tokens, creates the
// user with 100 starting Nox Coins (§3.2). birthDate is only present on the
// signup path; the login path re-uses this same verification step.
export async function verifyOtp(params: {
  phoneNumber: string;
  code: string;
  birthDate?: string;
}): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  await delay(MOCK_NETWORK_DELAY_MS);
  if (params.code !== MOCK_OTP_CODE) {
    throw new Error("Incorrect code. Try again.");
  }
  return {
    user: {
      id: CURRENT_USER_ID,
      phoneNumber: params.phoneNumber,
      displayName: "You",
      birthDate: params.birthDate ?? "2000-01-01",
      noxCoinBalance: 100,
    },
    tokens: { accessToken: "mock-access-token", refreshToken: "mock-refresh-token" },
  };
}
