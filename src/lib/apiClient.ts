// Single switch between mock and real data, per docs/backend-spec.md §8
// (Frontend-First Workflow). Sprint 6 flips USE_MOCKS to false and points
// BASE_URL at the real backend — no screen code should need to change.

export const USE_MOCKS = true;

export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

export async function apiGet<T>(path: string): Promise<T> {
  if (USE_MOCKS) {
    throw new Error(
      `apiGet("${path}") called with USE_MOCKS=true — read from src/mocks/fixtures.ts instead until Sprint 6.`,
    );
  }
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}
