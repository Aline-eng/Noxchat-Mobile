// Spacing and radius scale — see CLAUDE.md's "no inline magic values" rule.
// Add a step here rather than hardcoding a pixel number in a screen.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 20,
  pill: 999,
} as const;
