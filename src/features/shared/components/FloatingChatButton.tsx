import React from "react";
import { Pressable } from "react-native";
import { MotiView } from "moti";
import { MessageCircle } from "lucide-react-native";
import { colors } from "@/theme";
import { useMagneticPress } from "@/features/shared/hooks/useMagneticPress";

interface Props {
  onPress: () => void;
}

// Magnetic press behavior per docs/design-reference.md: eases toward the
// touch point on press-in, springs back on release. Opens chat from
// Home/Vibes/Games.
export function FloatingChatButton({ onPress }: Props) {
  const { onLayout, onPressIn, onPressOut, offset } = useMagneticPress(0.35, 10);

  return (
    <Pressable
      onLayout={onLayout}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open chats"
      style={{ position: "absolute", right: 20, bottom: 96, zIndex: 6 }}
    >
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed ? 0.92 : 1, translateX: offset.x, translateY: offset.y }}
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
