import React, { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { CURRENT_USER_ID } from "@/mocks/fixtures";
import { useConversation, type ConversationItem } from "@/features/chat/api/useConversation";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { InputBar } from "@/features/chat/components/InputBar";
import { colors, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Conversation">;

// Sending appends to local screen state only -- there's no backend or
// WebSocket yet (that's Sprint 6, per SPRINT_PLAN.md), so a sent message
// doesn't persist past this screen instance.
export function ConversationScreen({ route }: Props) {
  const { chatId } = route.params;
  const initialItems = useConversation(chatId);
  const [items, setItems] = useState<ConversationItem[]>(initialItems);

  const handleSend = (text: string) => {
    setItems((prev) => [
      ...prev,
      {
        message: {
          id: `local-${Date.now()}`,
          chatId,
          senderId: CURRENT_USER_ID,
          type: "text",
          content: text,
          isAnonymousConfession: false,
          isEcho: false,
          reactions: {},
          deliveredToUserIds: [],
          readByUserIds: [],
          deletedForUserIds: [],
          createdAt: new Date().toISOString(),
        },
        mine: true,
        senderName: "You",
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList<ConversationItem>
        data={items}
        keyExtractor={(item) => item.message.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <MessageBubble item={item} />}
      />
      <InputBar onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noir },
  listContent: { padding: spacing.lg },
});
