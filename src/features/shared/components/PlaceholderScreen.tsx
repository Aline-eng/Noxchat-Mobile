import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";

interface Props {
  title: string;
  sprintNote: string;
  dark?: boolean;
}

// Not a real screen — a marker so the nav shell boots and every future
// sprint has an obvious place to start. Delete this import once a
// feature's real screen replaces it.
export function PlaceholderScreen({ title, sprintNote, dark }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: dark ? colors.noir : colors.latte }]}>
      <Text style={[styles.title, { color: dark ? colors.latte : colors.charcoal }]}>{title}</Text>
      <Text style={[styles.note, { color: dark ? colors.donkey : colors.inkDim }]}>{sprintNote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 10 },
  title: { fontFamily: fontFamily.display, fontSize: 22 },
  note: { fontFamily: fontFamily.ui, fontSize: 13, textAlign: "center", lineHeight: 19 },
});
