import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="(dashboard)" options={{ headerShown: false }} /> */}
      {/* <Stack.Screen
        name="(modals)/CreateGroupModal"
        options={{ presentation: "modal" }}
      /> */}
    </Stack>
  );
}
