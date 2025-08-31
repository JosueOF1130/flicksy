import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from "react-native";

import { useTheme } from "@/context/themeContext";

import type { TextVariant } from "@/types/componentTypes";

interface AppTextProps extends TextProps {
    variant?: TextVariant,
    style?: StyleProp<TextStyle>,
    bold?: boolean,
    center?: boolean
}


export default function AppText({ variant = 'body', style, bold, center, ...props }: AppTextProps) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        subtext: {
            fontSize: 12,
            fontWeight: "300",
        },
        small: {
            fontSize: 14,
            fontWeight: "400",
        },
        body: {
            fontSize: 16,
            fontWeight: "400",
        },
        title: {
            fontSize: 20,
            fontWeight: "600",
        },
        heading: {
            fontSize: 24,
            fontWeight: "700",
        },
        display: {
            fontSize: 32,
            fontWeight: "800",
        },
        bold: {
            fontWeight: "bold"
        },
        center: {
            textAlign: "center"
        },
        default: {
            color: colors.text.base,
        }
    })

    return (
        <Text style={[styles.default, styles[variant], style, bold && styles.bold, center && styles.center]} {...props} />
    );
}



