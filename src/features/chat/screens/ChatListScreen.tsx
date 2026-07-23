import React from "react";
import { PlaceholderScreen } from "@/features/shared/components/PlaceholderScreen";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "ChatList">;

// TODO(Sprint 4): chat list from src/mocks/fixtures.ts CHATS. Tapping a
// row navigates to "Conversation" with the chat id as a param.
export function ChatListScreen(_props: Props) {
  return <PlaceholderScreen title="Chats" sprintNote="Sprint 4: chat list" dark />;
}
