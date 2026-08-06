import { create } from "zustand";
import type { AuthTokens, AuthUser } from "@/features/auth/api/authApi";

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  setSession: (user: AuthUser, tokens: AuthTokens) => void;
  clearSession: () => void;
}

// In-memory only for now -- persisting across app restarts (e.g. via
// expo-secure-store) is a Sprint 6 concern once there's a real refresh-token
// endpoint to validate a restored session against.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  setSession: (user, tokens) => set({ user, tokens }),
  clearSession: () => set({ user: null, tokens: null }),
}));
