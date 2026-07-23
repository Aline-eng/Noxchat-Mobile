import "react-native-gesture-handler";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { ArchivoBlack_400Regular } from "@expo-google-fonts/archivo-black";
import { Literata_400Regular } from "@expo-google-fonts/literata";
import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_700Bold,
} from "@expo-google-fonts/bricolage-grotesque";

import { RootNavigator } from "@/navigation/RootNavigator";
import { colors } from "@/theme";

const queryClient = new QueryClient();

export default function App() {
  const [fontsLoaded] = useFonts({
    ArchivoBlack_400Regular,
    Literata_400Regular,
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_700Bold,
  });

  // Per docs/design-reference.md: never render real content before fonts
  // resolve, even briefly, so nothing flashes in the system font.
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.noir }}>
        <ActivityIndicator color={colors.camel} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
