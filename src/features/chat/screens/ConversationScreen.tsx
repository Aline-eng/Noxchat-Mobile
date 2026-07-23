import React from "react";
import { PlaceholderScreen } from "@/features/shared/components/PlaceholderScreen";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Conversation">;

// TODO(Sprint 4): message bubbles, input bar with text<->mic swap.
// See src/mocks/fixtures.ts MESSAGES and docs/backend-spec.md §4.2/§4.6.
export function ConversationScreen(_props: Props) {
  return <PlaceholderScreen title="Conversation" sprintNote="Sprint 4: message thread" dark />;
}
