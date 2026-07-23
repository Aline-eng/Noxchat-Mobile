import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme";

interface AvatarProps {
  name: string;
  size?: number;
  ring?: boolean;
}

// Deterministic color from name so the same person always gets the same
// gradient, without needing a real avatar image yet.
function hueFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

export function Avatar({ name, size = 44, ring = false }: AvatarProps) {
  const hue = useMemo(() => hueFromName(name), [name]);
  const initial = name.charAt(0).toUpperCase();
  const inner = ring ? size - 6 : size;

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityRole="image"
      accessibilityLabel={`${name}'s avatar`}
    >
      {ring && (
        <LinearGradient
          colors={[colors.camel, colors.forest, colors.donkey]}
          style={[StyleSheet.absoluteFillObject, { borderRadius: size / 2, padding: 2 }]}
        >
          <View style={{ flex: 1, borderRadius: size / 2, backgroundColor: colors.latte }} />
        </LinearGradient>
      )}
      <LinearGradient
        colors={[`hsl(${hue}, 32%, 42%)`, `hsl(${(hue + 30) % 360}, 28%, 26%)`] as unknown as string[]}
        style={{
          position: "absolute",
          top: ring ? 3 : 0,
          left: ring ? 3 : 0,
          width: inner,
          height: inner,
          borderRadius: inner / 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: inner * 0.38, fontWeight: "700" }}>{initial}</Text>
      </LinearGradient>
    </View>
  );
}
