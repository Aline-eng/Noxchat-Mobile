import { CURRENT_USER_ID, MESSAGES, STATUS_AUTHORS, VOICE_NOTES, type Message, type VoiceNote } from "@/mocks/fixtures";

export interface ConversationItem {
  message: Message;
  mine: boolean;
  senderName: string;
  voiceNote?: VoiceNote;
}

function senderName(senderId: string): string {
  if (senderId === CURRENT_USER_ID) return "You";
  return STATUS_AUTHORS.find((author) => author.id === senderId)?.displayName ?? "Unknown";
}

// TODO(Sprint 6): swap MESSAGES for a TanStack Query hook reading
// GET /chats/:id/messages (§5.2) once a real endpoint exists.
export function useConversation(chatId: string): ConversationItem[] {
  return MESSAGES.filter((message) => message.chatId === chatId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((message) => ({
      message,
      mine: message.senderId === CURRENT_USER_ID,
      senderName: senderName(message.senderId),
      voiceNote: message.type === "voice" ? VOICE_NOTES.find((note) => note.messageId === message.id) : undefined,
    }));
}
