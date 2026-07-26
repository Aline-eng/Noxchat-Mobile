import { STATUSES, STATUS_AUTHORS, type Status } from "@/mocks/fixtures";
import { colors } from "@/theme";

export interface VibeItem {
  status: Status;
  authorName: string;
  swatchColor: string;
}

// Swatch cards need a color and a display name per Status. A real screen
// resolves the name via GET /users/:id (§5.1); the color has no backend
// field at all -- like Avatar's hueFromName, it's derived deterministically
// from userId so the same person always lands on the same swatch color.
const SWATCH_ROTATION = [colors.forest, colors.camel, colors.forestDeep, colors.donkey] as const;

function swatchColorForUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) % SWATCH_ROTATION.length;
  return SWATCH_ROTATION[hash];
}

// TODO(Sprint 6): swap STATUSES for a TanStack Query hook reading
// GET /status/feed (§5.10) once a real endpoint exists.
export function useVibesFeed(): VibeItem[] {
  return STATUSES.map((status) => {
    const author = STATUS_AUTHORS.find((a) => a.id === status.userId);
    return {
      status,
      authorName: author?.displayName ?? "Unknown",
      swatchColor: swatchColorForUserId(status.userId),
    };
  });
}
