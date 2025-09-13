import AppIconButton from "@/components/AppIconButton";
import AppText from "@/components/AppText";
import ThemedView from "@/components/ThemedView";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, View } from "react-native";

export default function SettingsScreen() {
    const { LogOutUser } = useAuth();
    const { colors } = useTheme();

    const { theme, toggleTheme } = useTheme();

    function goBack() {
        router.back();
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ThemedView>
                <View style={{ marginVertical: 14 }} >
                    <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={goBack}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.base} />
                        <AppText style={{ marginLeft: 5 }} variant="title">Account</AppText>
                    </Pressable>
                </View>
                <AppIconButton name="contrast" onPress={toggleTheme}>Change to {theme === "dark" ? "light" : "dark"} theme</AppIconButton>

                <AppIconButton name="exit-outline" onPress={LogOutUser}>Logout</AppIconButton>
            </ThemedView>
        </>
    );
}