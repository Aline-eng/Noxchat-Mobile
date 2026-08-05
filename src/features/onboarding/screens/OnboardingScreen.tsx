import React from "react";
import { Pressable } from "react-native";
import { PlaceholderScreen } from "@/features/shared/components/PlaceholderScreen";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

// TODO(Sprint 5): 3-slide carousel, see docs/design-reference.md + the
// ONBOARDING data shape in the web prototype reference for slide content.
export function OnboardingScreen({ navigation }: Props) {
  return (
    <Pressable
      style={{ flex: 1 }}
      accessibilityRole="button"
      accessibilityLabel="Continue to sign up"
      onPress={() => navigation.replace("Signup")}
    >
      <PlaceholderScreen
        title="Onboarding"
        sprintNote="Sprint 5: 3-slide intro carousel. Tap anywhere to continue for now."
      />
    </Pressable>
  );
}
