module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|moti|react-native-reanimated|react-native-gesture-handler|react-native-svg)",
  ],
  setupFilesAfterEach: [],
};
