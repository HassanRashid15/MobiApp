import { Stack } from "expo-router";
import { useColorScheme, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ScreenWrapper from "../components/ScreenWrapper";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ScreenWrapper
          backgroundColor={colorScheme === "dark" ? "#000" : "#fff"}
          statusBarStyle={
            colorScheme === "dark" ? "light-content" : "dark-content"
          }
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ScreenWrapper>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
