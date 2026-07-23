# Design Reference — Noxchat

This condenses the design decisions already made and reviewed, so implementation doesn't re-litigate them. `web-prototype-reference.jsx` in this folder is a browser-only interactive mockup (built with plain React + CSS, not React Native) — useful for seeing exactly how something should look and behave, but don't port its code directly; RN needs `StyleSheet`/NativeWind and `moti`/`reanimated` instead of CSS.

## Palette (source: moodboard, not to be substituted)

| Token | Hex | Role |
|---|---|---|
| `latte` | `#F9F3E1` | Base background — Home, Vibes, Profile, Onboarding |
| `ivory` | `#FFF2E1` | Card surfaces on light screens |
| `champagne` | `#F7E7CE` | Secondary light surface / dividers |
| `charcoal` | `#000000` | Wordmark, splash, headline ink |
| `ink` | `#1B1712` | Body text on light screens |
| `inkDim` | `#776E5E` | Secondary text on light screens |
| `forest` | `#102C26` | Primary brand color — CTAs, active states, light-screen accents |
| `forestDeep` | `#013324` | Gradient partner for `forest` |
| `camel` | `#C19A6B` | Secondary accent — coins, bets, badges, dark-screen CTAs |
| `donkey` | `#A79277` | Muted accent / secondary text on dark screens |
| `noir` | `#0C1512` | Base background — Games, Chat |
| `noir2` / `noir3` | `#142019` / `#1C2921` | Card surfaces on dark screens |

**Structural rule:** Home, Vibes, Profile, and Onboarding are light (`latte` base). Games and Chat are dark (`noir` base). This split is deliberate — it signals "reading/reflecting" vs. "playing/connecting" through color rather than a label. Don't flatten it to one theme without raising that as a design question first, not a code cleanup.

## Type system

| Role | Font | Used for |
|---|---|---|
| Display | Archivo Black | Splash wordmark, screen titles, blog headlines |
| Serif | Literata | Blog excerpts only — the one place someone is actually reading, not scanning |
| UI | Bricolage Grotesque | Navigation, buttons, chat text, timestamps, everything else |

Load via `@expo-google-fonts/archivo-black`, `@expo-google-fonts/literata`, `@expo-google-fonts/bricolage-grotesque`. Gate the splash screen on `useFonts()` resolving before transitioning — don't render text in the fallback system font, even briefly.

## Signature component: the Swatch card

A rounded color-block card with a label bottom-left (see `src/components/ui/Swatch.tsx`). This isn't decorative — it's the same visual language as the color-palette reels this whole system came from, repurposed to do the same job: naming a mood or category with a color. Used for: Vibes posts, blog category tags, games leaderboard highlight. Any new "tag a thing with a mood/category" UI should reach for this before inventing something new.

## Motion patterns (implement once, reuse everywhere — don't reinvent per screen)

- **Magnetic buttons** (floating chat button, send button): element eases toward the pointer/touch on press-in using a spring, not a linear tween. In RN, use `reanimated`'s `useAnimatedGestureHandler` + spring, or `moti`'s `animate` with a spring transition — not a CSS-style rAF loop like the web reference uses.
- **Sliding tab indicator** (bottom nav): a pill that animates its position/width to sit under the active tab, measured via `onLayout`, not a hardcoded position per tab.
- **Staggered list entrance**: list items fade/rise in with an increasing delay per index (`moti`'s `delay` prop keyed to index), capped around 300–400ms total so a long list doesn't take forever to finish appearing.
- **Text reveal** (splash wordmark, onboarding headline): per-line or per-character reveal, translateY + opacity, staggered. Used sparingly — splash and onboarding only, not on every screen transition.
- Respect `prefers-reduced-motion` equivalent: check `AccessibilityInfo.isReduceMotionEnabled()` and skip non-essential motion (magnetic pull, staggered entrance) when it's on. Never skip functional feedback (press states).

## Accessibility floor

Every pressable: `accessibilityRole="button"` + a real `accessibilityLabel` (not the visible text re-typed if the visible text is already descriptive, but never left blank on icon-only buttons). Contrast: body text on `latte`/`ivory` must hit 4.5:1 against `ink`; on `noir`, `latte` text against `noir`/`noir2` already clears that — don't introduce a lower-contrast text color for "subtlety."
