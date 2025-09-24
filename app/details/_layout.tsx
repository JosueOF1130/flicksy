import { Stack } from "expo-router";

export default function DetailsScreen() {
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ headerShown: false }}  />
        </Stack>
    );
}