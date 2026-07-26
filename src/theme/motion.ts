// Shared motion constants so every screen's "staggered entrance" or
// "spring" feels the same. See docs/design-reference.md for the full
// rationale on each pattern — implement with moti / react-native-reanimated.
export const springConfig = {
  damping: 16,
  stiffness: 180,
  mass: 0.9,
};

export const staggerMs = 60; // per-index delay for list entrance, cap total around 300-400ms
export const staggerCapMs = 400;

export function staggerDelay(index: number): number {
  return Math.min(index * staggerMs, staggerCapMs);
}

// Timing-animation durations (fades/rises), distinct from the spring configs
// above which are for gesture-driven motion.
export const durations = {
  fast: 150,
  base: 220,
  slow: 400,
} as const;
