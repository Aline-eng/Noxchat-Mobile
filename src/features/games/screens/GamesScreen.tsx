import React from "react";
import { View } from "react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootStackParamList, MainTabParamList } from "@/navigation/RootNavigator";
import { PlaceholderScreen } from "@/features/shared/components/PlaceholderScreen";
import { FloatingChatButton } from "@/features/shared/components/FloatingChatButton";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Games">,
  NativeStackScreenProps<RootStackParamList>
>;

// TODO(Sprint 3): category chips, wallet card, live game rows. Dark
// surface — see docs/design-reference.md palette table.
export function GamesScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <PlaceholderScreen title="Games" sprintNote="Sprint 3: wallet card + live games" dark />
      <FloatingChatButton onPress={() => navigation.navigate("ChatList")} />
    </View>
  );
}
