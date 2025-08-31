import { TextVariant } from "@/types/componentTypes";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export interface AppButtonProps {
    onPress: () => void;
    children: ReactNode;
    variant?: TextVariant;
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;

}

export interface AppIconButtonProps extends AppButtonProps {
    name: keyof typeof Ionicons.glyphMap,
    size?: number,
    color?: string,
    position?: "left" | "right"
}
