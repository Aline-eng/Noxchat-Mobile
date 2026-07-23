// Mock data shaped exactly like docs/backend-spec.md §4 (Data Models).
// Screens should import from here via the hooks in each feature's
// api/ folder, never directly — that indirection is what makes Sprint 6
// (swapping to the real API) a non-event.

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

export interface Vibe {
  id: string;
  userName: string;
  swatchColor: string;
  caption: string;
  song: string | null;
}

export const VIBES: Vibe[] = [
  { id: "v1", userName: "Maya", swatchColor: "#102C26", caption: "cabin weekend", song: "Sunset Blvd — Nia James" },
  { id: "v2", userName: "Sam", swatchColor: "#C19A6B", caption: "3am diner run", song: null },
  { id: "v3", userName: "Theo", swatchColor: "#013324", caption: "quiz night champion", song: "Victory Lap — KOTO" },
  { id: "v4", userName: "Priya", swatchColor: "#A79277", caption: "new plant, who dis", song: null },
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
