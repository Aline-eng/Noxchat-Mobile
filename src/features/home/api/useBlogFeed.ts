import { BLOGS, type BlogPost } from "@/mocks/fixtures";

// TODO(Sprint 6): Blog has no endpoint in docs/backend-spec.md yet (see the
// gap noted in src/mocks/fixtures.ts) — once one exists, swap this body for
// a TanStack Query hook. The screen shouldn't need to change.
export function useBlogFeed(): BlogPost[] {
  return BLOGS;
}
