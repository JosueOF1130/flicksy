import { Stack } from "expo-router";

export default function AccountScreenLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}