import { WALLET, type WalletSummary } from "@/mocks/fixtures";

// TODO(Sprint 6): swap WALLET for TanStack Query hooks reading
// GET /users/me/coins and GET /groups/:id/leaderboard (§5.6) once a real
// endpoint exists and "current group" is a concept in the app.
export function useWallet(): WalletSummary {
  return WALLET;
}
