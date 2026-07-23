import React from "react";
import { Pressable } from "react-native";
import { MotiView } from "moti";
import { MessageCircle } from "lucide-react-native";
import { colors } from "@/theme";

interface Props {
  onPress: () => void;
}

// TODO(Sprint 4): swap the press-scale for the full magnetic drag-toward-
// touch behavior described in docs/design-reference.md. This stub only
// proves the position + basic spring feedback.
export function FloatingChatButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open chats"
      style={{ position: "absolute", right: 20, bottom: 96, zIndex: 6 }}
    >
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed ? 0.92 : 1 }}
          transition={{ type: "spring", damping: 16, stiffness: 180 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.forest,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: colors.forestDeep,
            shadowOpacity: 0.45,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}
        >
          <MessageCircle size={22} color={colors.latte} />
        </MotiView>
      )}
    </Pressable>
  );
}
