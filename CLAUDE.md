# CLAUDE.md — Noxchat Mobile

Read this file, `SPRINT_PLAN.md`, `docs/backend-spec.md`, and `docs/design-reference.md` in full before writing any code. These four files are the source of truth — if something in a request conflicts with them, flag the conflict instead of silently picking one.

## What this project is

A React Native (Expo) app that combines chat, betting/games, 24h-status ("Vibes"), and a friend-written blog feed into one product. It's being built by a two-person team (frontend + backend) in parallel against a frozen API contract (`docs/backend-spec.md`), using mock data until the real backend is ready.

## Non-negotiable git workflow

- **Never commit directly to `main` or `develop`.** Every task happens on a branch named `feature/sN-<short-slug>`, branched from `develop` — check `SPRINT_PLAN.md` for the current sprint number and its exact scope before naming the branch.
- Commit early and often, in small logical units, using **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `style:`. One concern per commit — don't squash a whole screen's work into a single commit.
- When a sprint's acceptance criteria (in `SPRINT_PLAN.md`) are met: run the full check (`npm run lint && npm run typecheck && npm test`), then open a PR from the feature branch into `develop` describing what changed and why. **Stop there and wait for review** — don't merge your own PR.
- Once a sprint's PR is merged into `develop`, tag it `sprint-N`.
- If you discover mid-sprint that something belongs in a different sprint's scope, say so explicitly rather than quietly expanding the current branch.

## Clean code rules for this codebase

1. **Feature-first folders.** Everything for a feature lives under `src/features/<feature>/` — its screens, components, hooks, api calls, and types are co-located. Don't dump unrelated components into a shared bucket just because it's convenient.
2. **One file, one job.** A screen component that exceeds ~150 lines is a sign something should be extracted into a subcomponent or a hook.
3. **No inline magic values.** Colors, font sizes, spacing, radii, and durations come from `src/theme/` exclusively. If a value doesn't exist there yet, add it there — don't hardcode a hex or a pixel number inside a screen.
4. **Logic lives in hooks, not JSX.** Data fetching, derived state, and business rules belong in `src/features/*/hooks/` or `src/features/*/api/`, not inline in a component's render.
5. **No `any`.** Everything is typed. Data shapes must match `docs/backend-spec.md` §4 exactly — don't invent a slightly different shape because it's more convenient for one screen.
6. **Accessibility is not optional.** Every pressable needs `accessibilityRole` and `accessibilityLabel`. This was a stated requirement from day one, not a nice-to-have polish pass.
7. **Motion follows the established patterns.** The magnetic button, the sliding tab indicator, and the staggered list entrance are already defined in `docs/design-reference.md` — implement them with `moti` / `react-native-reanimated` consistently, don't invent a new motion idiom per screen.
8. **Build against mocks, swap later.** Use `src/mocks/fixtures.ts` and the single base-URL switch in `src/lib/apiClient.ts` until the real backend is confirmed ready — never hardcode a live URL inside a feature.

## Testing bar

- Every new component gets at least a render test.
- Every hook containing business logic gets a unit test.
- A sprint is not "done" with failing or skipped tests — fix or explicitly flag, never silently skip.

## Definition of done, every sprint

- [ ] Matches the acceptance criteria for that sprint in `SPRINT_PLAN.md`
- [ ] `npm run lint && npm run typecheck && npm test` all pass locally
- [ ] No hardcoded design values outside `src/theme/`
- [ ] No direct commits to `main`/`develop` — work is in a PR from the feature branch, awaiting review

## When you're not sure

Ask, using the specific language of this codebase (branch names, sprint numbers, file paths) — not generic clarifying questions. If `SPRINT_PLAN.md` doesn't cover something you've hit, say exactly what's missing rather than guessing and moving on.
