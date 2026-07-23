import React, { useEffect } from "react";
import { PlaceholderScreen } from "@/features/shared/components/PlaceholderScreen";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

// TODO(Sprint 5): real wordmark reveal + font-loading gate. See
// docs/design-reference.md "Motion patterns" for the text-reveal spec.
export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace("Onboarding"), 1500);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <PlaceholderScreen
      title="Noxchat"
      sprintNote="Sprint 5: real splash + font-loading gate"
      dark
    />
  );
}
