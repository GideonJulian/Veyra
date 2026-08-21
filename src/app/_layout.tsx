import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 300));

      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
