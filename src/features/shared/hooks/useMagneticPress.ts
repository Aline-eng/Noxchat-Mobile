import { useState } from "react";
import type { GestureResponderEvent, LayoutChangeEvent } from "react-native";

interface Offset {
  x: number;
  y: number;
}

interface UseMagneticPressResult {
  onLayout: (event: LayoutChangeEvent) => void;
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: () => void;
  offset: Offset;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// The magnetic button behavior from docs/design-reference.md: "element
// eases toward the pointer/touch on press-in using a spring." There's no
// hover on touchscreens, so this reads the touch's position within the
// element on press-in (Pressable already reports this via locationX/Y --
// no gesture-handler needed) and offsets it a fraction of the way toward
// that point, capped at maxOffset px. Pair the returned offset with a
// spring transition (moti/reanimated) on translateX/translateY; springs
// back to (0, 0) on release.
export function useMagneticPress(pullStrength = 0.35, maxOffset = 10): UseMagneticPressResult {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  const onPressIn = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    const dx = clamp((locationX - size.width / 2) * pullStrength, -maxOffset, maxOffset);
    const dy = clamp((locationY - size.height / 2) * pullStrength, -maxOffset, maxOffset);
    setOffset({ x: dx, y: dy });
  };

  const onPressOut = () => setOffset({ x: 0, y: 0 });

  return { onLayout, onPressIn, onPressOut, offset };
}
