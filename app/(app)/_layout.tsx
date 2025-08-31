import { useTheme } from "@/context/themeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar"

export default function AppEntry() {

    const { theme } = useTheme();


    return (
        <>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }}></Stack.Screen>
            </Stack>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
        </>
    );
}