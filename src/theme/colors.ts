// Single source of truth for color — pulled directly from the design
// moodboard (see docs/design-reference.md). Never hardcode a hex in a
// screen; import from here.
export const colors = {
  latte: "#F9F3E1",
  ivory: "#FFF2E1",
  champagne: "#F7E7CE",
  charcoal: "#000000",
  ink: "#1B1712",
  inkDim: "#776E5E",
  forest: "#102C26",
  forestDeep: "#013324",
  camel: "#C19A6B",
  donkey: "#A79277",
  noir: "#0C1512",
  noir2: "#142019",
  noir3: "#1C2921",
  // Not part of the moodboard (docs/design-reference.md has no error/danger
  // swatch) -- a pragmatic addition for form validation, chosen to stay
  // legible on both latte/ivory and noir/noir2 surfaces.
  danger: "#B3261E",
} as const;

export type ColorToken = keyof typeof colors;

// Screens are either "light" (Home, Vibes, Profile, Onboarding) or "dark"
// (Games, Chat) — see docs/design-reference.md for why. Use these two
// bundles instead of picking individual tokens per screen.
export const lightSurface = {
  background: colors.latte,
  card: colors.ivory,
  cardAlt: colors.champagne,
  text: colors.ink,
  textDim: colors.inkDim,
  accent: colors.forest,
  accentDeep: colors.forestDeep,
};

export const darkSurface = {
  background: colors.noir,
  card: colors.noir2,
  cardAlt: colors.noir3,
  text: colors.latte,
  textDim: colors.donkey,
  accent: colors.camel,
  accentDeep: colors.donkey,
};
