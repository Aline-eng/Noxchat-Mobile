import {
  CHATS,
  CURRENT_USER_ID,
  MESSAGES,
  STATUS_AUTHORS,
  VOICE_NOTES,
  type Chat,
  type GroupChat,
  type Message,
} from "@/mocks/fixtures";

export interface ChatListItem {
  chat: Chat | GroupChat;
  displayName: string;
  preview: string;
  timeLabel: string;
  unreadCount: number;
}

export function isGroupChat(chat: Chat | GroupChat): chat is GroupChat {
  return chat.type === "group";
}

// Direct chats have no stored name (§4.2) -- it's the other member's
// profile. Groups have their own name field directly on the model.
export function chatDisplayName(chat: Chat | GroupChat): string {
  if (isGroupChat(chat)) return chat.name;
  const otherMemberId = chat.memberIds.find((id) => id !== CURRENT_USER_ID);
  return STATUS_AUTHORS.find((author) => author.id === otherMemberId)?.displayName ?? "Unknown";
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function previewForMessage(message: Message): string {
  switch (message.type) {
    case "text":
      return message.content ?? "";
    case "voice": {
      const voiceNote = VOICE_NOTES.find((note) => note.messageId === message.id);
      return voiceNote ? `sent a voice note · ${formatDuration(voiceNote.durationSeconds)}` : "sent a voice note";
    }
    case "image":
      return "sent a photo";
    case "video":
      return "sent a video";
    case "file":
      return "sent a file";
  }
}

export function formatRelativeTime(iso: string, now: Date): string {
  const diffMinutes = Math.floor((now.getTime() - new Date(iso).getTime()) / 60000);
  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.floor(diffHours / 24)}d`;
}

function latestMessageFor(chatId: string): Message | undefined {
  return MESSAGES.filter((message) => message.chatId === chatId).reduce<Message | undefined>(
    (latest, message) =>
      !latest || new Date(message.createdAt) > new Date(latest.createdAt) ? message : latest,
    undefined,
  );
}

function unreadCountFor(chatId: string): number {
  return MESSAGES.filter(
    (message) =>
      message.chatId === chatId &&
      message.senderId !== CURRENT_USER_ID &&
      !message.readByUserIds.includes(CURRENT_USER_ID),
  ).length;
}

// TODO(Sprint 6): swap CHATS/MESSAGES for a TanStack Query hook reading
// GET /chats (§5.2) once a real endpoint exists.
export function useChatList(now: Date = new Date()): ChatListItem[] {
  return [...CHATS]
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    .map((chat) => {
      const latest = latestMessageFor(chat.id);
      return {
        chat,
        displayName: chatDisplayName(chat),
        preview: latest ? previewForMessage(latest) : "",
        timeLabel: formatRelativeTime(chat.lastMessageAt, now),
        unreadCount: unreadCountFor(chat.id),
      };
    });
}
