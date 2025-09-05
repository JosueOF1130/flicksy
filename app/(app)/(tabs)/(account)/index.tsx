import AppIconButton from "@/components/AppIconButton";
import AppText from "@/components/AppText";
import ThemedView from "@/components/ThemedView";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { StyleSheet, View } from "react-native";

export default function AccountScreen() {

    const { LogOutUser } = useAuth();

    const { theme, toggleTheme } = useTheme();

    
    return (
        <>
            <ThemedView>
                <View style={{ padding: 10, gap: 20}}>
                    <AppText variant="display">Account</AppText>
                    <AppIconButton name="contrast" onPress={toggleTheme}>Change to {theme === "dark" ? "light" : "dark"} theme</AppIconButton>
                    
                    <AppIconButton name="exit-outline" onPress={LogOutUser}>Logout</AppIconButton>
                </View>
            </ThemedView>
        </>
    );
}
