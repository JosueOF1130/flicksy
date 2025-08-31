import { useTheme } from "@/context/themeContext";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ThemedView({ children }: PropsWithChildren) {

    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            backgroundColor: colors.background.base,
            paddingHorizontal: 25,
            paddingTop: 50
        }
    })

    return (
        <SafeAreaProvider style={styles.container}>
            {children}
        </SafeAreaProvider>
    );
}

