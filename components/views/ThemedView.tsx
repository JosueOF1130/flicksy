import { useTheme } from "@/context/themeContext";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export default function ThemedView({ children }: PropsWithChildren) {

    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: "100%",
            backgroundColor: colors.background.base,
            paddingTop: 45,
            paddingHorizontal: 15
        }
    })

    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}

