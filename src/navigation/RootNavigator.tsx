import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Sparkles, Heart, Trophy } from "lucide-react-native";

import { colors } from "@/theme";
import { SplashScreen } from "@/features/onboarding/screens/SplashScreen";
import { OnboardingScreen } from "@/features/onboarding/screens/OnboardingScreen";
import { SignupScreen } from "@/features/auth/screens/SignupScreen";
import { LoginScreen } from "@/features/auth/screens/LoginScreen";
import { VerifyOtpScreen } from "@/features/auth/screens/VerifyOtpScreen";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { VibesScreen } from "@/features/vibes/screens/VibesScreen";
import { GamesScreen } from "@/features/games/screens/GamesScreen";
import { ChatListScreen } from "@/features/chat/screens/ChatListScreen";
import { ConversationScreen } from "@/features/chat/screens/ConversationScreen";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";

export type MainTabParamList = {
  Home: undefined;
  Vibes: undefined;
  Games: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Signup: undefined;
  Login: undefined;
  VerifyOtp: { phoneNumber: string; mode: "signup" | "login"; birthDate?: string };
  Main: undefined;
  Profile: undefined;
  ChatList: undefined;
  Conversation: { chatId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// TODO(Sprint 2/3): replace the default tab bar with the sliding-pill
// indicator described in docs/design-reference.md, sized to just 3 items
// per the "minimized bottom nav, profile lives up top" decision.
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.donkey,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Vibes"
        component={VibesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Heart color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "Sign up" }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Log in" }} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} options={{ title: "Verify code" }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
        <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: "Chats" }} />
        <Stack.Screen
          name="Conversation"
          component={ConversationScreen}
          options={{ title: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
