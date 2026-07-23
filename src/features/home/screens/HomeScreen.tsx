import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { MotiView } from "moti";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootStackParamList, MainTabParamList } from "@/navigation/RootNavigator";
import { FloatingChatButton } from "@/features/shared/components/FloatingChatButton";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";
import { useBlogFeed } from "@/features/home/api/useBlogFeed";
import { useNowPlaying } from "@/features/home/api/useNowPlaying";
import { MusicCard } from "@/features/home/components/MusicCard";
import { BlogCard } from "@/features/home/components/BlogCard";
import { colors, fontFamily, fontSize, spacing, durations, staggerDelay } from "@/theme";
import type { BlogPost } from "@/mocks/fixtures";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

export function HomeScreen({ navigation }: Props) {
  const posts = useBlogFeed();
  const { track, isPlaying, togglePlay } = useNowPlaying();
  const reducedMotion = useReducedMotion();

  return (
    <View style={styles.container}>
      <FlatList<BlogPost>
        data={posts}
        keyExtractor={(post) => post.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <MusicCard track={track} isPlaying={isPlaying} onTogglePlay={togglePlay} />
            <Text style={styles.sectionHeader}>From your friends</Text>
          </>
        }
        renderItem={({ item, index }) => (
          <MotiView
            from={reducedMotion ? undefined : { opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: durations.base, delay: staggerDelay(index) }}
          >
            <BlogCard post={item} />
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
  sectionHeader: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.sm,
    color: colors.charcoal,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
});
