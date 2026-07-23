import React from "react";
import { PlaceholderScreen } from "@/features/shared/components/PlaceholderScreen";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

// TODO(Sprint 5): avatar + stats + settings rows. Reachable only via the
// top-right avatar on Home/Vibes/Games — see the open question flagged
// in SPRINT_PLAN.md before assuming this stays out of the bottom tabs.
export function ProfileScreen(_props: Props) {
  return <PlaceholderScreen title="Profile" sprintNote="Sprint 5: settings + stats" />;
}
