import { colors } from "@/theme";
import { GAME_SESSIONS, GAME_TYPE_LABELS, STATUS_AUTHORS, type GameSession } from "@/mocks/fixtures";

export interface GameItem {
  session: GameSession;
  label: string;
  participantNames: string[];
  isLive: boolean;
  potDisplay: string;
}

export type GameCategory = "live" | "1v1" | "party";

export const GAME_CATEGORIES: { id: GameCategory; label: string; color: string }[] = [
  { id: "live", label: "Live now", color: colors.forestDeep },
  { id: "1v1", label: "1v1", color: colors.donkey },
  { id: "party", label: "Party", color: colors.forest },
];

// Filter chips are a client-side view over GameSession, not a stored field
// on the model -- same reasoning as Vibes' swatch color in Sprint 2.
export function matchesCategory(item: GameItem, category: GameCategory): boolean {
  if (category === "live") return item.isLive;
  if (category === "1v1") return item.session.participantIds.length === 2;
  return item.session.participantIds.length > 2;
}

function participantName(userId: string): string {
  return STATUS_AUTHORS.find((author) => author.id === userId)?.displayName ?? "Unknown";
}

// TODO(Sprint 6): swap GAME_SESSIONS for a TanStack Query hook reading
// GET /games/catalog (§5.6) once a real endpoint exists.
export function useGamesFeed(): GameItem[] {
  return GAME_SESSIONS.map((session) => ({
    session,
    label: GAME_TYPE_LABELS[session.gameType],
    participantNames: session.participantIds.map(participantName),
    isLive: session.status === "active",
    potDisplay: session.potTotal > 0 ? `${session.potTotal} coins` : "No bet",
  }));
}
