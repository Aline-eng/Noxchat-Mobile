# Noxchat — Backend & API Specification (v1)

**Purpose of this document:** a contract between the frontend and the backend. It defines every data model, REST endpoint, real-time event, and background job the app needs. The goal is that your frontend can be built against this spec *today* — using mock data that matches it exactly — while your partner implements the real backend in parallel. When the real backend is ready, you swap a base URL and nothing on the frontend has to change.

This replaces the original feature doc. All 18 features from that doc are covered below — nothing was dropped, it's just organized the way a backend actually gets built.

---

## 0. How to Use This Document

1. **Frontend dev (you):** build every screen against the endpoints and data shapes in Sections 4–6. Use Section 8 to mock them so you're never blocked waiting on the backend.
2. **Backend dev (your partner):** implement Sections 3–7 in the order given in Section 10. The data models in Section 4 are your database schema starting point. The endpoints in Section 5 are your route list. Section 7 is your cron/worker checklist — this app has a lot of "automatic" behavior, and it's easy to forget these because they're not triggered by a button tap.
3. Treat this file as versioned. When something changes, edit this doc first, then change code — not the other way around.

---

## 1. Recommended Stack (and why)

You said "not sure — recommend one." Here's the recommendation, biased toward *this specific app's* needs rather than generic advice.

| Layer | Recommendation | Why |
|---|---|---|
| Backend language/runtime | **Node.js + TypeScript** | One language across frontend (if you're using React Native) and backend. Huge ecosystem, easy to hire for later. |
| Framework | **NestJS** | Gives you enforced structure (modules/controllers/services) out of the box. For a first real backend with 18 features, structure prevents the codebase turning into spaghetti. Plain Express is lighter but you own all the organization yourself. |
| Database | **PostgreSQL** (via **Prisma** ORM) | This app has real relational integrity needs: group membership + roles, a coin ledger that must never double-spend, poll votes, task assignments. A relational DB with foreign keys catches bugs a document DB won't. |
| Cache / presence / counters | **Redis** | Online/offline/ghost status, typing indicators, spam-detection counters (20 msgs/10 sec), Echo-message lock state, rate limits. All of these are short-lived, high-frequency, and don't belong in Postgres. |
| Real-time transport | **Socket.io** (WebSocket, Redis adapter for scaling) | Rooms-per-chat map naturally onto group chats. Automatic fallback if WebSocket is blocked on bad networks (your non-functional reqs mention 2G support). Far better documented than rolling raw WebSockets. |
| Object storage | **S3-compatible** (Cloudflare R2 or AWS S3) | Images, videos, voice notes, uploaded songs. Presigned upload URLs keep large files off your API servers. |
| Push notifications | **Firebase Cloud Messaging (FCM)** | Free, standard, works for both iOS and Android regardless of what you use for the actual backend. |
| Background jobs | **BullMQ** (Redis-backed queues) + cron | Weekly awards, leaderboard reset, daily throwback at 9am *local time per user*, poll expiry, Echo-lock expiry, coin daily bonus. See Section 7. |
| Auth | **Phone-number OTP + JWT** (access + refresh tokens) | Standard for chat apps. OTP delivery via Twilio or Firebase Auth (you can use Firebase *just* for OTP delivery without adopting Firebase as your whole backend). |

**Why not "just use Firebase/Supabase for everything"?** Those are great when your logic is mostly CRUD. Noxchat's logic isn't — a 60% group vote to unlock Confession Mode, an anonymous identity that literally no one (not even the group creator) can see except moderation, a coin wallet that must reconcile exactly, a "host" with exclusive control over shared playback state — this is much easier and safer to get right in server-side code you control than to express as database security rules. Use a BaaS piece (storage, push, OTP) where it *is* simple, and own the logic in a real backend everywhere else.

---

## 2. High-Level Architecture

```
┌─────────────────┐        HTTPS (REST)        ┌──────────────────────┐
│                  │ ─────────────────────────▶│                      │
│   Mobile App     │                            │   API Server         │
│ (iOS / Android)  │        WebSocket (WS)       │   (Node + NestJS)    │
│                  │ ◀────────────────────────▶ │                      │
└─────────────────┘                            └──────┬───────┬───────┘
                                                       │       │
                                        ┌──────────────┘       └──────────────┐
                                        ▼                                     ▼
                               ┌─────────────────┐                  ┌──────────────────┐
                               │   PostgreSQL     │                  │      Redis        │
                               │ (source of truth)│                  │ (presence, cache,  │
                               └─────────────────┘                  │  rate limits, echo │
                                        │                            │  locks, queues)    │
                                        ▼                            └──────────────────┘
                               ┌─────────────────┐
                               │  S3-compatible   │
                               │  object storage  │
                               │ (media, songs)   │
                               └─────────────────┘

                               ┌─────────────────┐
                               │  Background      │
                               │  Workers (BullMQ)│──▶ FCM (push notifications)
                               │  + Cron schedules│
                               └─────────────────┘
```

One important note: **the Personal Diary (Section on Incognito Mode) has no backend at all.** It's device-only storage (SQLite/Realm/SQLCipher on-device), never synced. Don't build diary endpoints — there aren't any.

---

## 3. Authentication Flow

1. `POST /auth/signup` — phone number + birth date (app must reject under-13 per legal requirement). Server sends OTP via SMS.
2. `POST /auth/verify-otp` — phone + code → server returns `accessToken` (short-lived, ~15 min) + `refreshToken` (long-lived, ~30 days) + creates the user with 100 starting Nox Coins.
3. `POST /auth/login` — existing user requests OTP again (same as signup path, no password).
4. `POST /auth/refresh` — trade refresh token for a new access token.
5. `POST /auth/logout` — invalidates the refresh token server-side.
6. Every authenticated REST request carries `Authorization: Bearer <accessToken>`.
7. The WebSocket connection authenticates once at `connect` time by passing the access token; the server maps `socketId ↔ userId` in Redis for the life of the connection.

**Why phone + OTP instead of email/password:** it's the standard for chat apps (WhatsApp, Signal, Telegram all do this), it doubles as light identity verification, and it removes password-reset flows entirely from your scope.

---

## 4. Data Models

These are written as language-agnostic interfaces (think TypeScript). They map directly to Prisma models / Postgres tables. Fields marked `// derived` are computed, not stored as-is.

### 4.1 Core identity

```ts
User {
  id: string
  phoneNumber: string          // unique
  displayName: string
  avatarUrl?: string
  bio?: string
  birthDate: date              // for age gate, not shown publicly
  presence: "online" | "offline" | "ghost"   // "ghost" only visible to self; others see offline
  lastSeenAt: datetime
  ghostMode: {
    enabled: boolean
    whitelistUserIds: string[]   // max 3, still see real status
    scheduleStart?: time
    scheduleEnd?: time
  }
  noxCoinBalance: number
  blockedUserIds: string[]
  mutedUserIds: string[]
  pushToken?: string
  createdAt: datetime
}
```

### 4.2 Chats, groups, messages

```ts
Chat {
  id: string
  type: "direct" | "group"
  memberIds: string[]
  createdAt: datetime
  lastMessageAt: datetime      // derived, for inbox sorting
  pinnedMessageIds: string[]   // max 3
  muteSettings: { [userId]: "1h" | "8h" | "1w" | "forever" | null }
  sleepMode: { [userId]: { startTime: time, endTime: time, lastEmergencyPingAt?: datetime } }
  throwbackEnabled: { [userId]: boolean }   // default true, per-user opt-out
}

Group extends Chat {
  name: string
  photoUrl?: string
  creatorId: string
  adminIds: string[]
  confession: {
    enabled: boolean
    votesToEnable: { [userId]: boolean }   // needs 60% of members
  }
}

Message {
  id: string
  chatId: string
  senderId: string              // null/hidden if isAnonymousConfession
  type: "text" | "image" | "video" | "voice" | "file"
  content?: string
  mediaUrl?: string
  replyToMessageId?: string
  forwardedFromMessageId?: string
  isAnonymousConfession: boolean
  isEcho: boolean
  reactions: { [userId]: emoji }
  deliveredToUserIds: string[]
  readByUserIds: string[]
  deletedForEveryoneAt?: datetime   // only within 2 min of sending
  deletedForUserIds: string[]
  createdAt: datetime
  editedAt?: datetime               // used for voice-note transcript edits
}
```

### 4.3 Confession Box

```ts
Confession {
  id: string
  groupId: string
  authorId: string              // NEVER exposed via any API to group members, only to moderation
  messageId: string
  upvotes: string[]             // userIds
  downvotes: string[]
  reportedByUserIds: string[]   // 5 distinct reports within 1h -> auto-hidden
  hiddenAt?: datetime
  createdAt: datetime
}
```
**Access rule (important for backend):** the `/confession/*` endpoints must never serialize `authorId` in any response reachable by non-moderation roles. Enforce this in the serializer/DTO layer, not just by convention.

### 4.4 Echo Messages

```ts
EchoMessage {
  id: string
  groupId: string
  messageId: string
  senderId: string
  reactions: { [userId]: "read" | "question" | "important" }
  lockedMessageIds: string[]    // next 10 messages, hidden from non-reactors
  expiresAt: datetime           // 24h after send
  createdAt: datetime
}

EchoDisableVote {
  groupId: string
  votes: { [userId]: boolean }  // 50% approval disables Echo for 24h
  disabledUntil?: datetime
}
```

### 4.5 Betting & Games

```ts
GameSession {
  id: string
  groupId: string
  gameType: "tictactoe" | "quizbattle" | "drawingguess" | "truthordare"
  participantIds: string[]
  bets: { [userId]: number }    // 1–50 coins, can't exceed balance
  potTotal: number              // derived: sum of bets
  status: "waiting" | "active" | "finished"
  winnerId?: string
  state: object                 // game-specific board/question state
  spectatorIds: string[]
  createdAt: datetime
}

CoinTransaction {
  id: string
  userId: string
  amount: number                 // positive = credit, negative = debit
  type: "signup_bonus" | "daily_bonus" | "bet_win" | "bet_loss"
  relatedGameId?: string
  createdAt: datetime
}
```

### 4.6 Voice Notes 2.0

```ts
VoiceNote {
  messageId: string
  durationSeconds: number         // max 300
  waveformData: number[]
  transcript: string              // generated ON DEVICE, uploaded as text only
  editedTranscript?: string
  detectedLanguage: "en" | "es" | "hi" | "ar" | "fr"
}
```
**Note:** transcription itself runs on-device (privacy requirement). The server only ever receives and stores the resulting text — never audio-to-server-side-STT.

### 4.7 Shared To-Do Lists

```ts
TodoList {
  id: string
  groupId: string
  title: string
  createdBy: string
  templateUsed?: "party_prep" | "trip_packing" | "project"
  createdAt: datetime
}

TodoTask {
  id: string
  listId: string
  description: string
  assignedTo?: string
  dueDate?: date
  completed: boolean
  completedBy?: string
  archivedAt?: datetime           // moved here, never deleted
  comments: { userId: string, text: string, createdAt: datetime }[]
}
```

### 4.8 Music Together

```ts
Song {
  id: string
  ownerId: string
  title: string
  fileUrl: string
  sizeBytes: number              // max 10MB/song, 50MB total/user
  uploadedAt: datetime
}

MusicRoom {
  id: string
  hostId: string
  songId: string
  isPlaying: boolean
  positionSeconds: number
  participantIds: string[]
  createdAt: datetime
}
```

### 4.9 Status (24h stories)

```ts
Status {
  id: string
  userId: string
  type: "text" | "image" | "video"   // video max 30s
  content?: string
  mediaUrl?: string
  hiddenFromUserIds: string[]        // privacy list, separate from block list
  viewedByUserIds: string[]
  reactions: { [userId]: "love" | "laugh" | "shock" | "sad" | "thanks" }
  createdAt: datetime
  expiresAt: datetime                 // createdAt + 24h
}
```

### 4.10 Throwback, Group Awards, Polls

```ts
// Throwback has no persisted entity — it's computed on read:
// "find 1 message or photo in this chat from ~365 days ago"
ThrowbackReaction {
  chatId: string
  originalMessageId: string
  userId: string
  reaction: "funny" | "wow" | "love" | "embarrassing"
}

GroupAward {
  id: string
  groupId: string
  weekOf: date
  chatterboxUserId: string
  clownUserId: string
  championUserId: string
  ghostUserId: string
  generatedAt: datetime
}

Poll {
  id: string
  chatId: string
  question: string
  options: string[]              // max 6
  type: "single" | "multiple"
  anonymous: boolean
  resultsVisibility: "immediate" | "on_end"
  expiresAt: datetime             // 1h, 1d, or 1w after creation
  votes: { [userId]: number[] }   // option indices
}
```

### 4.11 Safety / Moderation

```ts
Report {
  id: string
  targetType: "message" | "group" | "confession" | "user"
  targetId: string
  reporterId: string
  reason: string
  createdAt: datetime
  status: "open" | "actioned" | "dismissed"
}
```

---

## 5. REST API Reference

Base URL: `/api/v1`. All endpoints require `Authorization: Bearer <token>` unless marked otherwise.

### 5.1 Auth & Profile

| Method | Path | Description |
|---|---|---|
| POST | `/auth/signup` | Phone + birth date → sends OTP |
| POST | `/auth/verify-otp` | Verify code → returns tokens, creates user |
| POST | `/auth/login` | Existing user requests OTP |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate refresh token |
| GET | `/users/me` | Current profile |
| PATCH | `/users/me` | Update displayName, avatar, bio |
| GET | `/users/:id` | Public profile of another user |
| POST | `/users/:id/block` | Block a user |
| DELETE | `/users/:id/block` | Unblock |
| POST | `/users/:id/mute` | Mute notifications from a user (not a full block) |
| PATCH | `/users/me/ghost-mode` | Enable/disable, set schedule |
| PATCH | `/users/me/ghost-mode/whitelist` | Set up to 3 always-visible users |

### 5.2 Chats & Messages

| Method | Path | Description |
|---|---|---|
| GET | `/chats` | Inbox list, sorted by `lastMessageAt` |
| POST | `/chats` | Start a direct chat |
| GET | `/chats/:id` | Chat metadata |
| GET | `/chats/:id/messages?before=&limit=` | Paginated history |
| GET | `/chats/:id/messages/search?query=&type=media\|text&date=` | Search within a chat |
| POST | `/chats/:id/messages` | Send message (text/image/video/voice/file, optional `replyToMessageId`) |
| POST | `/messages/:id/forward` | Forward to another chat |
| DELETE | `/messages/:id?scope=me\|everyone` | "Everyone" only allowed within 2 min of `createdAt` — enforce server-side, not just client-side |
| POST | `/messages/:id/react` | Add/change emoji reaction |
| POST | `/chats/:id/pin/:messageId` | Pin (max 3 enforced server-side) |
| DELETE | `/chats/:id/pin/:messageId` | Unpin |
| PATCH | `/chats/:id/mute` | Set mute duration |
| PATCH | `/chats/:id/sleep-mode` | Set sleep window |
| POST | `/chats/:id/emergency-ping` | Once/day override of sleep mode |
| PATCH | `/chats/:id/throwback-settings` | Opt this chat out of throwback |
| GET | `/chats/:id/throwback` | Today's throwback card, computed on read |
| POST | `/throwback/react` | React to a throwback card |

### 5.3 Groups

| Method | Path | Description |
|---|---|---|
| POST | `/groups` | Create group |
| PATCH | `/groups/:id` | Update name/photo (creator only) |
| POST | `/groups/:id/members` | Add members (creator/admin only) |
| DELETE | `/groups/:id/members/:userId` | Remove member (creator/admin only) |
| POST | `/groups/:id/admins/:userId` | Promote to co-admin (creator only) |
| DELETE | `/groups/:id/admins/:userId` | Demote (creator only) |
| POST | `/groups/:id/leave` | Leave group |
| POST | `/groups/:id/report` | Report group to moderation |
| GET | `/groups/:id/awards/latest` | Most recent weekly awards card |

### 5.4 Confession Box

| Method | Path | Description |
|---|---|---|
| POST | `/groups/:id/confession/vote` | Vote to enable (auto-enables at 60%) |
| POST | `/groups/:id/confession/messages` | Post anonymously (max 5/day, enforced server-side) |
| POST | `/confession/:id/upvote` | Upvote |
| POST | `/confession/:id/downvote` | Downvote |
| POST | `/confession/:id/reveal-and-report` | 5 distinct reports/1h → auto-hide + real sender flagged to moderation only |
| GET | `/groups/:id/confession/best-of-week` | Weekly top-upvoted confession |

### 5.5 Echo Messages

| Method | Path | Description |
|---|---|---|
| POST | `/groups/:id/echo` | Send Echo (max 1/hour/person, enforced server-side via Redis) |
| POST | `/echo/:id/react` | React (read/question/important) — unlocks next 10 messages for that user |
| GET | `/echo/:id/pending-reactors` | Who hasn't reacted (sender only) |
| POST | `/groups/:id/echo/disable-vote` | Vote to disable Echo for 24h (50% approval) |

### 5.6 Games & Betting

| Method | Path | Description |
|---|---|---|
| GET | `/games/catalog` | Available games, both individual & group |
| POST | `/groups/:id/games/:gameType/start` | Start a group game with a bet amount (1–50 coins) |
| POST | `/games/:id/join` | Join with a bet (must not exceed balance) |
| POST | `/games/:id/move` | Submit a move (payload shape is game-specific) |
| GET | `/games/:id` | Current state (also used for spectate mode) |
| POST | `/games/individual/:type/result` | Sync score for Chess/Sudoku/2048/Wordle (e.g. for sharing to chat) |
| GET | `/users/me/coins` | Balance |
| GET | `/users/me/transactions?days=30` | Bet history |
| GET | `/groups/:id/leaderboard` | Top 3 by coins, resets Monday |

### 5.7 Diary

**No endpoints.** Fully on-device. Do not build a backend for this feature.

### 5.8 Shared To-Do Lists

| Method | Path | Description |
|---|---|---|
| POST | `/groups/:id/todo-lists` | Create list (optionally `templateUsed`) |
| GET | `/groups/:id/todo-lists` | List all lists for a group |
| POST | `/todo-lists/:id/tasks` | Add task (description, `assignedTo`, `dueDate`) |
| PATCH | `/tasks/:id` | Toggle complete/incomplete, reassign |
| POST | `/tasks/:id/comments` | Comment on a task |
| GET | `/todo-lists/:id/archive` | Completed/archived tasks |

### 5.9 Music Together

| Method | Path | Description |
|---|---|---|
| POST | `/music/upload` | Upload MP3 (10MB/song, 50MB/user total — reject over quota) |
| GET | `/music/library` | Your uploaded songs |
| POST | `/music/rooms` | Create a room from a song → returns shareable link |
| GET | `/music/rooms/:id` | Room state |
| POST | `/music/rooms/:id/play` | Host only |
| POST | `/music/rooms/:id/pause` | Host only |
| POST | `/music/rooms/:id/seek` | Host only |

### 5.10 Status

| Method | Path | Description |
|---|---|---|
| POST | `/status` | Post text/image/video (video max 30s) |
| GET | `/status/feed` | Statuses from your contacts (respecting privacy list) |
| GET | `/status/:id/viewers` | Who viewed yours |
| POST | `/status/:id/react` | React with emoji |
| POST | `/status/:id/hide` | Hide your status from specific people |
| POST | `/status/:id/reply` | Sends a DM referencing the status |

### 5.11 Polls

| Method | Path | Description |
|---|---|---|
| POST | `/chats/:id/polls` | Create poll |
| POST | `/polls/:id/vote` | Vote (respects single/multiple + anonymous flag) |
| GET | `/polls/:id/results` | Results (respects `resultsVisibility`) |

### 5.12 Safety

| Method | Path | Description |
|---|---|---|
| POST | `/reports` | Generic report (message/group/user/confession) |
| — | *(auto)* | Auto-hide at 5 distinct reports/1h — background rule, not a client-triggered endpoint |
| — | *(auto)* | Auto-mute 1h at 20 msgs/10sec — enforced in the message-send path via Redis counters |

---

## 6. Real-Time Events (WebSocket)

Single Socket.io connection per session, authenticated at `connect`. Client joins a room per chat it's a member of (`chat:<chatId>`), plus one personal room (`user:<userId>`) for things like game invites and awards.

### 6.1 Client → Server

| Event | Payload | Purpose |
|---|---|---|
| `message:typing` | `{ chatId }` | Typing indicator (auto-expires after ~5s client-side) |
| `message:read` | `{ chatId, messageId }` | Read receipt (double-check) |
| `presence:heartbeat` | `{}` | Keeps online status fresh |
| `echo:react` | `{ echoId, reaction }` | React to an Echo message |
| `music:play` / `music:pause` / `music:seek` | `{ roomId, positionSeconds }` | Host-only actions |
| `game:move` | `{ gameId, move }` | Game-specific move payload |
| `poll:vote` | `{ pollId, optionIndexes }` | Vote |

### 6.2 Server → Client

| Event | Payload | Purpose |
|---|---|---|
| `message:new` | `Message` | New message delivered to chat room |
| `message:delivered` | `{ messageId, userId }` | Delivery ack (single check) |
| `message:read:ack` | `{ messageId, userId }` | Read ack (double check) |
| `typing:update` | `{ chatId, userId, isTyping }` | Typing indicator broadcast |
| `presence:changed` | `{ userId, presence }` | Online/offline/ghost change (respects ghost mode + whitelist) |
| `echo:locked` | `{ groupId, echoId, lockedMessageIds }` | Broadcast when an Echo locks new messages |
| `echo:unlocked` | `{ groupId, userId }` | Sent to a user individually once they react |
| `confession:new` | `Confession` (no `authorId`) | New anonymous post |
| `game:state` | `GameSession` | Any state change, including for spectators |
| `game:result` | `{ gameId, winnerId, potTotal }` | Game finished |
| `music:sync` | `{ roomId, isPlaying, positionSeconds }` | Host action mirrored to all listeners |
| `poll:updated` | `{ pollId, results? }` | New vote (results included only if visibility is "immediate") |
| `group:updated` | `Group` | Membership/role/name/photo change |
| `awards:announced` | `GroupAward` | Weekly award card |
| `throwback:new` | `ThrowbackCard` | Pushed at 9am local time |
| `status:new` | `Status` | New status from a contact |
| `todo:updated` | `TodoTask` | Task added/completed/reassigned |
| `moderation:hidden` | `{ targetType, targetId }` | Something got auto-hidden (message/confession) |

---

## 7. Scheduled Jobs (Cron / Background Workers)

This is the section most likely to get missed in early development, because none of these are triggered by a user tapping a button. Build these as BullMQ repeatable jobs or cron tasks from day one, not as an afterthought.

| Job | Schedule | What it does |
|---|---|---|
| Daily coin bonus | Once per day, per user's first app-open | +5 Nox Coins |
| Weekly leaderboard reset | Every Monday 00:00 | Snapshot + reset top-3 coin leaderboard, apply 🏆 badge for 7 days |
| Weekly group awards | Every Sunday | Compute Chatterbox/Clown/Champion/Ghost per group, post award card |
| Daily throwback | Every hour, filtered to users whose **local** time is 9am | Find 1 message/photo from ~365 days ago per eligible chat |
| Echo auto-expiry | Continuous (TTL in Redis) | Unlock all messages 24h after an Echo is sent |
| Echo disable-vote expiry | Continuous | Re-enable Echo 24h after a successful disable vote |
| Confession auto-hide | Triggered by report count, checked in real time | Hide at 5 distinct reports within 1h |
| Spam auto-mute | Triggered in the message-send path via Redis counter | Mute sender 1h if >20 messages/10s |
| Poll auto-close | Per-poll TTL (1h/1d/1w) | Lock voting, finalize results |
| Status auto-expiry | Per-status TTL (24h) | Remove from feed (soft-delete, keep for a short grace period if you want undo) |
| Ghost mode schedule | Continuous, per-user schedule | Auto toggle ghost mode on/off at configured times |

---

## 8. Frontend-First Workflow: Building Now, Wiring Later

Since you're starting frontend before backend exists, here's how to avoid getting blocked:

1. **Treat Section 4 and Section 5 as frozen contracts.** Your frontend should be built entirely against these shapes — every screen fetches data that looks exactly like the interfaces in Section 4.
2. **Stand up a mock server, not hardcoded fixtures buried in components.** The simplest approach: a small Express (or `json-server`) app that returns static JSON matching Section 4's shapes for every route in Section 5. Point your app's `API_BASE_URL` at this mock server.
3. **Use one config value to switch between mock and real backend** (e.g. an env variable `API_BASE_URL=http://localhost:4000` for mock, later `https://api.noxchat.app` for real). Nothing else in the app should change when the switch happens.
4. **Mock the WebSocket events too.** A tiny local Socket.io server that fires a `message:new` every few seconds, or lets you trigger events from a debug panel, is enough to build and demo typing indicators, Echo locks, and live game state before the real backend exists.
5. **When your partner starts the real backend**, their job is to make it match Section 4/5/6 exactly — not to renegotiate the shapes with you mid-build. If a shape needs to change, update this doc first, then both sides update together.
6. **Suggested order to mock, matching Section 10's build priority:** Auth → Chats/Messages → Groups → Games/Betting → Confession/Echo/Music → Diary (skip, it's local-only) → To-do/Status → Throwback/Awards/Ghost mode.

---

## 9. Non-Functional Requirements

### Performance

| Requirement | Target |
|---|---|
| App cold start | Under 3 seconds |
| Message send | Under 0.5 seconds |
| Image load | Under 2 seconds |
| Voice transcription | Under 3 seconds (per 1-minute recording, on-device) |
| Scrolling | 60 FPS with 1000+ messages |

### Security & Privacy

| Requirement | What it means |
|---|---|
| End-to-end encryption | Only sender + recipient can read direct messages — not even the server |
| Diary | Never leaves the device, no cloud backup, no server access at all |
| Biometric lock | Face ID / fingerprint gate for diary incognito mode |
| Account deletion | Server wipes user data within 7 days of deletion request |
| Transcription privacy | Speech-to-text happens on-device, never uploaded as audio |

### Reliability

| Requirement | Target |
|---|---|
| Uptime | 99.9% |
| Message delivery | 99.99% of messages arrive within 5 seconds |
| Crash rate | Under 1% of sessions |
| Offline queue | Messages queue locally when offline, auto-send on reconnect |

### Compatibility

| Requirement | Minimum |
|---|---|
| Android | 8.0+ |
| iOS | 14+ |
| Tablet | Optimized layout, not a stretched phone screen |
| Networks | 4G, 5G, Wi-Fi, and degraded 2G |

### Battery & Data

| Requirement | Target |
|---|---|
| Battery drain | Under 5%/day from background sync |
| Image compression | Auto-compressed under 500KB |
| Data saver mode | Option to disable auto-download of media on mobile data |

### Legal

| Requirement | What it means |
|---|---|
| GDPR | EU users can request or delete their data |
| Age restriction | No users under 13 — enforced at signup via birth date |
| Terms of Service | Must accept before use |
| Privacy Policy | Discloses what's collected and why |

---

## 10. Build Priority / Roadmap

Unchanged from your original plan — it's already sound. Use this to sequence both the mock server (Section 8) and the real backend.

| Priority | Features | Target |
|---|---|---|
| P0 (must have) | Core chat + group management | Week 4 |
| P1 (high) | Betting + all games | Week 8 |
| P2 (medium) | Confession, Echo, Music Together | Week 12 |
| P3 (nice) | Diary (local-only, no backend), To-do list, Status | Week 16 |
| P4 (polish) | Throwback, Group Awards, Ghost Mode | Week 20 |

---

## 11. Appendix: Suggested Backend Project Structure

```
noxchat-backend/
├── src/
│   ├── auth/              # OTP, JWT, refresh
│   ├── users/             # profile, block/mute, ghost mode
│   ├── chats/              # direct + group, messages, pin, sleep mode
│   ├── groups/             # membership, roles, awards
│   ├── confession/
│   ├── echo/
│   ├── games/              # betting, individual + group games
│   ├── todo/
│   ├── music/
│   ├── status/
│   ├── polls/
│   ├── safety/             # reports, auto-mod thresholds
│   ├── realtime/           # Socket.io gateway, event handlers
│   ├── jobs/               # BullMQ processors: awards, leaderboard, throwback, expiries
│   ├── storage/            # S3 presigned upload helpers
│   └── common/             # guards, DTOs, Redis client, Prisma client
├── prisma/
│   └── schema.prisma       # generated from Section 4 models
└── test/
```

---

*This document supersedes the original feature doc as the source of truth for backend implementation. Keep it updated as decisions change — it's the contract both of you build against.*
