import { useTheme } from "@/context/themeContext";
import { AppIconButtonProps } from "@/interfaces/component";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import AppText from "./AppText";




export default function AppIconButton({ onPress, children, variant = "body", buttonStyle, textStyle, name, size = 24, position = "left", color }: AppIconButtonProps) {

    const { colors } = useTheme();


    const icon = () => {
        return <Ionicons
            name={name}
            size={size}
            color={color ? color : colors.background.base}
            style={styles.icon}
        />
    }

    return (
        <>
            <Pressable onPress={onPress} style={[styles.base, { backgroundColor: colors.primary.base}, buttonStyle]}>
                {position === "left" && icon()}

                <AppText variant={variant} style={[{color: colors.background.base, fontWeight: "bold"}, textStyle]}>{children}</AppText>

                {position === "right" && icon()}
            </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    icon: {
        marginHorizontal: 6,
    },
});