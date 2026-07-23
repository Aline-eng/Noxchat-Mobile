// Type roles — see docs/design-reference.md for rationale. Load these
// three families via @expo-google-fonts/* in App.tsx before rendering
// any real content.
export const fontFamily = {
  display: "ArchivoBlack_400Regular", // splash wordmark, screen titles, blog headlines
  serif: "Literata_400Regular", // blog excerpts only
  ui: "BricolageGrotesque_400Regular", // everything else
  uiMedium: "BricolageGrotesque_500Medium",
  uiBold: "BricolageGrotesque_700Bold",
} as const;

export const fontSize = {
  xs: 11,
  sm: 12.5,
  base: 14.5,
  md: 16,
  lg: 20,
  xl: 26,
  display: 34,
} as const;
