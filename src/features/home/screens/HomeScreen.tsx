import React from "react";
import { View } from "react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootStackParamList, MainTabParamList } from "@/navigation/RootNavigator";
import { PlaceholderScreen } from "@/features/shared/components/PlaceholderScreen";
import { FloatingChatButton } from "@/features/shared/components/FloatingChatButton";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

// TODO(Sprint 2): music now-playing card + blog feed. See
// docs/backend-spec.md §4.9/§4.10 for data shapes, src/mocks/fixtures.ts
// for mock content, and docs/design-reference.md for the Swatch component.
export function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <PlaceholderScreen title="Home" sprintNote="Sprint 2: music card + blog feed" />
      <FloatingChatButton onPress={() => navigation.navigate("ChatList")} />
    </View>
  );
}
