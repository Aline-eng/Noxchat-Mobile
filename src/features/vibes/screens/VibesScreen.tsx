import React from "react";
import { View } from "react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootStackParamList, MainTabParamList } from "@/navigation/RootNavigator";
import { PlaceholderScreen } from "@/features/shared/components/PlaceholderScreen";
import { FloatingChatButton } from "@/features/shared/components/FloatingChatButton";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Vibes">,
  NativeStackScreenProps<RootStackParamList>
>;

// TODO(Sprint 2): stories row + Swatch-card grid. See src/mocks/fixtures.ts
// VIBES and src/components/ui/Swatch.tsx.
export function VibesScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <PlaceholderScreen title="Vibes" sprintNote="Sprint 2: stories row + swatch-card grid" />
      <FloatingChatButton onPress={() => navigation.navigate("ChatList")} />
    </View>
  );
}
