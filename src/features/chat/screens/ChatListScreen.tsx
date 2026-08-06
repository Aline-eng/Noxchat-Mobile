import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { useChatList, type ChatListItem } from "@/features/chat/api/useChatList";
import { ChatRow } from "@/features/chat/components/ChatRow";
import { colors, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "ChatList">;

export function ChatListScreen({ navigation }: Props) {
  const chats = useChatList();

  return (
    <View style={styles.container}>
      <FlatList<ChatListItem>
        data={chats}
        keyExtractor={(item) => item.chat.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ChatRow
            item={item}
            onPress={() =>
              navigation.navigate("Conversation", { chatId: item.chat.id, displayName: item.displayName })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noir },
  listContent: { paddingHorizontal: spacing.sm, paddingVertical: spacing.sm },
});
