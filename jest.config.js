module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|moti|react-native-reanimated|react-native-gesture-handler|react-native-svg)",
  ],
  // Each test file gets a fresh worker, and the first TextInput render in a
  // worker pays a one-off native-module init cost (~20s) well past Jest's
  // 5000ms default -- not a real hang, just this environment's cold start.
  testTimeout: 20000,
};
