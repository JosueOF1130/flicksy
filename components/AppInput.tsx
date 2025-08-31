import { useTheme } from "@/context/themeContext";
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle } from "react-native";

type InputVariant = 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url';

interface AppInputProps extends TextInputProps {
    variant?: InputVariant;
    style?: StyleProp<TextStyle>;
    onChangeText?: (text: string) => void;
};

export default function AppInput({ variant = "default", style, onChangeText, ...props }: AppInputProps) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        default: {
            fontSize: 16,
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: colors.text.base,
            color: colors.text.base,
        }
    });
    return (
        <TextInput
            placeholderTextColor={colors.text.shades[900]}
            style={[styles.default, style]}
            keyboardType={variant}
            returnKeyType="done"
            enablesReturnKeyAutomatically={true}
            onChangeText={onChangeText}
            {...props}
        />
    );
}
