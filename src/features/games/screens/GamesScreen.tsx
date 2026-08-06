import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { MotiView } from "moti";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootStackParamList, MainTabParamList } from "@/navigation/RootNavigator";
import { TopBar } from "@/components/ui/TopBar";
import { FloatingChatButton } from "@/features/shared/components/FloatingChatButton";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";
import { useGamesFeed, matchesCategory, GAME_CATEGORIES, type GameCategory, type GameItem } from "@/features/games/api/useGamesFeed";
import { useWallet } from "@/features/games/api/useWallet";
import { CategoryChip } from "@/features/games/components/CategoryChip";
import { WalletCard } from "@/features/games/components/WalletCard";
import { GameRow } from "@/features/games/components/GameRow";
import { BetModal } from "@/features/games/components/BetModal";
import { colors, durations, spacing, staggerDelay } from "@/theme";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Games">,
  NativeStackScreenProps<RootStackParamList>
>;

const MAX_BET = 50;

export function GamesScreen({ navigation }: Props) {
  const games = useGamesFeed();
  const wallet = useWallet();
  const reducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<GameCategory>("live");
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);

  const filteredGames = useMemo(
    () => games.filter((item) => matchesCategory(item, activeCategory)),
    [games, activeCategory],
  );

  return (
    <View style={styles.container}>
      <FlatList<GameItem>
        data={filteredGames}
        keyExtractor={(item) => item.session.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <TopBar title="Games" dark onAvatarPress={() => navigation.navigate("Profile")} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {GAME_CATEGORIES.map((category) => (
                <CategoryChip
                  key={category.id}
                  label={category.label}
                  color={category.color}
                  active={activeCategory === category.id}
                  onPress={() => setActiveCategory(category.id)}
                />
              ))}
            </ScrollView>
            <WalletCard wallet={wallet} />
          </>
        }
        renderItem={({ item, index }) => (
          <MotiView
            from={reducedMotion ? undefined : { opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: durations.base, delay: staggerDelay(index) }}
          >
            <GameRow item={item} onPress={() => setSelectedGame(item)} />
          </MotiView>
        )}
      />
      <FloatingChatButton onPress={() => navigation.navigate("ChatList")} />

      <BetModal
        visible={selectedGame !== null}
        gameLabel={selectedGame?.label ?? ""}
        isLive={selectedGame?.isLive ?? false}
        maxBet={Math.min(MAX_BET, wallet.coinBalance)}
        onConfirm={() => setSelectedGame(null)}
        onCancel={() => setSelectedGame(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noir },
  listContent: { paddingBottom: 110 },
  chipRow: { gap: spacing.sm + 2, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
});
