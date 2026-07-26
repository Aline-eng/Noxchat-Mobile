import { useCallback, useState } from "react";
import { NOW_PLAYING, type NowPlayingTrack } from "@/mocks/fixtures";

interface UseNowPlayingResult {
  track: NowPlayingTrack;
  isPlaying: boolean;
  togglePlay: () => void;
}

// TODO(Sprint 6): there's no now-playing endpoint in docs/backend-spec.md
// yet (see the gap noted in src/mocks/fixtures.ts) — once one exists, swap
// NOW_PLAYING for a query and keep togglePlay posting the play/pause action.
export function useNowPlaying(): UseNowPlayingResult {
  const [isPlaying, setIsPlaying] = useState(true);
  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);
  return { track: NOW_PLAYING, isPlaying, togglePlay };
}
