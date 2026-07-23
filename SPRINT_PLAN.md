# Sprint Plan — Noxchat Mobile

Each row is one branch, cut from `develop`, merged back via PR when its acceptance criteria are met. Don't start a sprint's branch until the previous one is merged — later sprints assume earlier ones' shared components exist.

## Sprint 1 — Scaffold ✅ done (this handoff)
**Branch:** `feature/s1-scaffold` (already merged to `develop`, tagged `sprint-1`)
Project setup, toolchain, design tokens, navigation shell, placeholder screens so the app boots and tab-navigates. Nothing here is pixel-final — it exists so every later sprint has somewhere to plug in.

## Sprint 2 — Home & Vibes
**Branch:** `feature/s2-home-vibes`
- [ ] Home screen: music now-playing card (see `docs/design-reference.md` for the spinning-disc interaction), blog feed list using the `Swatch` component for category tags
- [ ] Vibes screen: stories row (ring avatars) + swatch-card grid
- [ ] `BlogCard`, `MusicCard`, `VibeCard` built as reusable components under their feature folders, not inline in the screen
- [ ] All data from `src/mocks/fixtures.ts`, matching `docs/backend-spec.md` §4.9/§4.10 shapes
- [ ] Staggered list entrance animation on both screens (moti)

## Sprint 3 — Games & Wallet
**Branch:** `feature/s3-games`
- [ ] Games screen: category filter chips, live game rows, join/start button
- [ ] Wallet card (coin balance, leaderboard position) — reuse the neumorphic-inspired card treatment from the prototype
- [ ] Dark theme variant of `TopBar` gets used here for the first time — confirm it renders correctly on both platforms
- [ ] Bet-amount slider component, built once, reusable across game types later

## Sprint 4 — Chat
**Branch:** `feature/s4-chat`
- [ ] Chat list screen + single conversation screen (dark theme)
- [ ] Message bubble component handling text + voice-note types per `docs/backend-spec.md` §4.2/§4.6
- [ ] Floating action button (magnetic hover/press behavior) that opens chat from Home/Vibes/Games
- [ ] Input bar with the text↔mic icon swap behavior from the prototype
- [ ] Still against mocks — no live WebSocket yet, that's Sprint 6

## Sprint 5 — Profile & Onboarding polish
**Branch:** `feature/s5-profile-onboarding`
- [ ] Profile screen reachable only via the top-right avatar (confirm this is still the right call — flagged as an open question in the prototype review)
- [ ] Settings rows (sleep mode, notifications, privacy, log out)
- [ ] Onboarding 3-slide flow with real asset placeholders instead of flat color blocks
- [ ] Splash screen with real font loading gate (don't transition until fonts are ready)

## Sprint 6 — API integration
**Branch:** `feature/s6-api-integration`
- [ ] Point `src/lib/apiClient.ts` at the real backend base URL (env-driven, not hardcoded)
- [ ] Replace `src/mocks/fixtures.ts` reads with TanStack Query hooks per `docs/backend-spec.md` §5
- [ ] Wire the real WebSocket events from §6 (typing, message:new, presence) into the chat screens built in Sprint 4
- [ ] Everything from Sprints 2–5 must still work unchanged from the screen's point of view — if a screen needs to change to accommodate the real API, that's a sign the mock shape in Sprint 1 didn't match the contract, and it should be fixed at the type level, not screen-by-screen

## Backlog (not yet sprinted)
Group management, Confession Box, Echo messages, Shared to-do lists, Music Together rooms, Throwback, Group Awards, Ghost mode scheduling, Polls — all specified in `docs/backend-spec.md`, none yet scheduled. Pull into a sprint once 1–6 are stable.
