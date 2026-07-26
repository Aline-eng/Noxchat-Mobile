import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { MotiView } from "moti";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootStackParamList, MainTabParamList } from "@/navigation/RootNavigator";
import { FloatingChatButton } from "@/features/shared/components/FloatingChatButton";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";
import { useVibesFeed, type VibeItem } from "@/features/vibes/api/useVibesFeed";
import { StoriesRow } from "@/features/vibes/components/StoriesRow";
import { VibeCard } from "@/features/vibes/components/VibeCard";
import { colors, durations, spacing, staggerDelay } from "@/theme";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Vibes">,
  NativeStackScreenProps<RootStackParamList>
>;

const GRID_COLUMNS = 2;

export function VibesScreen({ navigation }: Props) {
  const vibes = useVibesFeed();
  const reducedMotion = useReducedMotion();

  return (
    <View style={styles.container}>
      <FlatList<VibeItem>
        data={vibes}
        keyExtractor={(item) => item.status.id}
        numColumns={GRID_COLUMNS}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<StoriesRow items={vibes} />}
        renderItem={({ item, index }) => (
          <MotiView
            style={styles.cell}
            from={reducedMotion ? undefined : { opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: durations.base, delay: staggerDelay(index) }}
          >
            <VibeCard item={item} />
          </MotiView>
        )}
      />
      <FloatingChatButton onPress={() => navigation.navigate("ChatList")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.latte },
  listContent: { paddingBottom: 110 },
  row: { gap: spacing.md, paddingHorizontal: spacing.xl },
  cell: { flex: 1, marginBottom: spacing.md },
});
