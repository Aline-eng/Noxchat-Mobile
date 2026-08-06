import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

// Per react-native-safe-area-context's README: this is the library's own
// recommended mock, giving useSafeAreaInsets a zero-inset default without
// needing a <SafeAreaProvider> wrapped around every test.
jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);
