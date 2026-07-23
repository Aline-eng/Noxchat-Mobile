# Noxchat Mobile

Cross-platform (iOS/Android) client for Noxchat — chat, games/betting, Vibes (status), and a blog feed, in one app.

## Stack
- Expo (React Native) + TypeScript (strict)
- `StyleSheet` + design tokens in `src/theme/` for styling (NativeWind was evaluated but its current release hard-requires `react-native-worklets`, which only has nightly builds right now — revisit once that stabilizes; see `docs/design-reference.md`)
- React Navigation (bottom tabs + native stack)
- react-native-reanimated + moti for motion
- TanStack Query for server state, Zustand for local UI state
- lucide-react-native for icons (same icon set as the web prototype)

## Getting started
```
npm install
npx expo start
```

## Before you touch any code, read:
- `CLAUDE.md` — non-negotiable conventions for this repo (git workflow, clean-code rules, definition of done)
- `SPRINT_PLAN.md` — current sprint, branch name, and acceptance criteria
- `docs/backend-spec.md` — the API contract (data models, endpoints, WS events) this app is built against
- `docs/design-reference.md` — palette, type system, motion patterns, and the reasoning behind them

## Branching
`main` (protected, always deployable) ← `develop` (integration) ← `feature/sN-*` (one per sprint scope). Never commit directly to `main` or `develop`. See `CLAUDE.md`.
