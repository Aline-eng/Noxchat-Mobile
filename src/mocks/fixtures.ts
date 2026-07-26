// Mock data shaped exactly like docs/backend-spec.md §4 (Data Models).
// Screens should import from here via the hooks in each feature's
// api/ folder, never directly — that indirection is what makes Sprint 6
// (swapping to the real API) a non-event.

// NOTE: docs/backend-spec.md has no Blog data model or endpoints at all
// (it's one of the four pillars named in CLAUDE.md's product description,
// but the spec doc never caught up). This shape is mock-only until that's
// reconciled — flagged to the team rather than guessed into the spec.
export interface BlogPost {
  id: string;
  title: string;
  category: string;
  swatchColor: string;
  author: string;
  readTime: string;
  excerpt: string;
}

export const BLOGS: BlogPost[] = [
  { id: "b1", title: "Why your group chat needs a coin economy", category: "Culture", swatchColor: "#102C26", author: "Maya R.", readTime: "4 min", excerpt: "Betting a few fake coins on trivia does something real to a friend group." },
  { id: "b2", title: "The lost art of the voice note", category: "Essays", swatchColor: "#A79277", author: "Theo K.", readTime: "6 min", excerpt: "A text can be reread for tone. A voice note can't hide what it sounded like." },
  { id: "b3", title: "Ghost mode is a feature, not a red flag", category: "Product", swatchColor: "#013324", author: "Priya N.", readTime: "3 min", excerpt: "Presence shouldn't be a performance." },
];

// NOTE: same gap as Blog above — there's no "personal now-playing" model in
// docs/backend-spec.md. §4.8 Music Together is a shared-room concept
// (host/participants/playback), not this. Mock-only until the spec adds it.
export interface NowPlayingTrack {
  title: string;
  artist: string;
  sharedBy: string;
  durationSeconds: number;
}

export const NOW_PLAYING: NowPlayingTrack = {
  title: "Sunset Blvd",
  artist: "Nia James",
  sharedBy: "Maya",
  durationSeconds: 214,
};

// Status (24h stories) — shape matches docs/backend-spec.md §4.9 exactly.
export interface Status {
  id: string;
  userId: string;
  type: "text" | "image" | "video";
  content?: string;
  mediaUrl?: string;
  hiddenFromUserIds: string[];
  viewedByUserIds: string[];
  reactions: Partial<Record<string, "love" | "laugh" | "shock" | "sad" | "thanks">>;
  createdAt: string;
  expiresAt: string;
}

// A real screen resolves author display names via GET /users/:id (§5.1).
// There's no Users fixture yet, so this is the minimal subset of §4.1 User
// (id + displayName) needed to render the stories row and swatch grid.
export interface MockAuthor {
  id: string;
  displayName: string;
}

export const STATUS_AUTHORS: MockAuthor[] = [
  { id: "u1", displayName: "Maya" },
  { id: "u2", displayName: "Sam" },
  { id: "u3", displayName: "Theo" },
  { id: "u4", displayName: "Priya" },
];

export const STATUSES: Status[] = [
  { id: "v1", userId: "u1", type: "text", content: "cabin weekend", hiddenFromUserIds: [], viewedByUserIds: [], reactions: {}, createdAt: "2026-07-22T09:00:00.000Z", expiresAt: "2026-07-23T09:00:00.000Z" },
  { id: "v2", userId: "u2", type: "text", content: "3am diner run", hiddenFromUserIds: [], viewedByUserIds: [], reactions: {}, createdAt: "2026-07-22T11:00:00.000Z", expiresAt: "2026-07-23T11:00:00.000Z" },
  { id: "v3", userId: "u3", type: "text", content: "quiz night champion", hiddenFromUserIds: [], viewedByUserIds: [], reactions: { u1: "love" }, createdAt: "2026-07-22T14:00:00.000Z", expiresAt: "2026-07-23T14:00:00.000Z" },
  { id: "v4", userId: "u4", type: "text", content: "new plant, who dis", hiddenFromUserIds: [], viewedByUserIds: [], reactions: {}, createdAt: "2026-07-22T18:00:00.000Z", expiresAt: "2026-07-23T18:00:00.000Z" },
];

export interface GameSession {
  id: string;
  name: string;
  players: string[];
  live: boolean;
  pot: string;
}

export const GAMES: GameSession[] = [
  { id: "g1", name: "Quiz Battle", players: ["Maya", "Theo", "Sam"], live: true, pot: "35 coins" },
  { id: "g2", name: "Tic-Tac-Toe", players: ["Priya"], live: false, pot: "Open lobby" },
  { id: "g3", name: "Truth or Dare", players: ["Maya", "Sam", "Theo", "Priya"], live: true, pot: "No bet" },
];

export interface ChatSummary {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
}

export const CHATS: ChatSummary[] = [
  { id: "c1", name: "Weekend Trip", preview: "packing list is in the to-do list!", time: "2m", unread: 3 },
  { id: "c2", name: "Maya", preview: "sent a voice note • 0:42", time: "12m", unread: 0 },
  { id: "c3", name: "Quiz Night Crew", preview: "sent an Echo message", time: "1h", unread: 0 },
];

export interface Message {
  id: string;
  mine: boolean;
  text: string;
}

export const MESSAGES: Message[] = [
  { id: "m1", mine: false, text: "ok who's driving Friday" },
  { id: "m2", mine: true, text: "I can take 3 people, car's already packed with snacks" },
  { id: "m3", mine: false, text: "packing list is in the to-do list!" },
];
