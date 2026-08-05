# Sprint Plan — Noxchat Mobile

Each row is one branch, cut from `develop`, merged back via PR when its acceptance criteria are met. Don't start a sprint's branch until the previous one is merged — later sprints assume earlier ones' shared components exist.

## Sprint 1 — Scaffold ✅ done (this handoff)
**Branch:** `feature/s1-scaffold` (already merged to `develop`, tagged `sprint-1`)
Project setup, toolchain, design tokens, navigation shell, placeholder screens so the app boots and tab-navigates. Nothing here is pixel-final — it exists so every later sprint has somewhere to plug in.

## Sprint 2 — Home & Vibes ✅ done
**Branch:** `feature/s2-home-vibes` (merged to `develop`, tagged `sprint-2`)
- [x] Home screen: music now-playing card (see `docs/design-reference.md` for the spinning-disc interaction), blog feed list using the `Swatch` component for category tags
- [x] Vibes screen: stories row (ring avatars) + swatch-card grid
- [x] `BlogCard`, `MusicCard`, `VibeCard` built as reusable components under their feature folders, not inline in the screen
- [x] All data from `src/mocks/fixtures.ts`, matching `docs/backend-spec.md` §4.9/§4.10 shapes
- [x] Staggered list entrance animation on both screens (moti)

**Flagged during this sprint, unresolved:** `docs/backend-spec.md` has no data model for Blog posts or a personal "now playing" widget (§4.8 Music Together is a shared-room concept, not this). Built as clearly-commented mock-only shapes in `src/mocks/fixtures.ts` — needs reconciling in the spec doc before Sprint 6 gives them real endpoints.

**Also landed alongside this sprint (its own branch/PR, `fix/lockfile-sync`, merged first):** repaired `npm ci` (lockfile drift), a duplicate-React bug under `moti` that broke any `MotiView` using presence hooks, and an `expo-asset` module-resolution failure that broke `expo start` entirely. Root cause for all three: npm 7+'s strict peer-dependency resolution; fixed via `.npmrc` (`legacy-peer-deps=true`).

## Sprint 2b — Auth (Login / Signup)
**Branch:** `feature/s2b-auth`
Not originally in this plan — `docs/backend-spec.md` §3/§5.1 defines phone+OTP auth, but no sprint owned building the screens for it. Added here, between Sprint 2 and Sprint 3, rather than silently folding it into Sprint 5.
- [ ] Signup screen: phone number + birth date → request OTP. Reject under-13 client-side (server-side enforcement is the backend's job per §3, but the client shouldn't let an obviously-underage birth date through either)
- [ ] Login screen: phone number → request OTP (same OTP path as signup, no password, per §3)
- [ ] Verify-OTP screen shared by both flows → on success, creates a mock session (100 starting Nox Coins per §3.2) and enters the app
- [ ] Session state (current user + tokens) in a small Zustand store — in-memory only for now; persisting across app restarts (e.g. `expo-secure-store`) is a Sprint 6 concern once there's a real refresh-token endpoint to validate against
- [ ] Onboarding's "tap anywhere to continue" now leads into this flow instead of straight to `Main`
- [ ] Still against mocks — a fixed mock OTP code, no real SMS/backend yet

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
