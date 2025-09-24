import { Pressable, StyleSheet, ViewStyle } from "react-native";
import AppText from "./AppText";
import { useTheme } from "@/context/themeContext";
import { AppButtonProps } from "@/interfaces/component";

export default function AppButton({ onPress, children, variant = "body", buttonStyle, textStyle }: AppButtonProps) {

    const { colors } = useTheme();


    const styles = StyleSheet.create({
        base: {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: colors.primary.base,
            alignItems: "center",
            justifyContent: "center",
        },
        text: {
            fontWeight: "bold",
            color: colors.background.base
        }
    });

    return (
        <Pressable
            onPress={onPress}
            style={[styles.base, buttonStyle]}
        >
            <AppText variant={variant} style={[styles.text, textStyle]}>{children}</AppText>
        </Pressable>
    );
}


