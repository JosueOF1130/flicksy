



import AppText from "@/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

interface ToastProps {
    visible: boolean;
    hideToast: () => void;
    type: "success" | "error" | "";
    message: string;
}

export default function ToastMessage({ visible, hideToast, type, message }: ToastProps) {
    const slideAnim = useRef(new Animated.Value(10)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(slideAnim, {
                        toValue: 80,
                        duration: 250,
                        easing: Easing.in(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start(() => hideToast());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    console.log(message);

    return (
        <Animated.View
            style={[
                styles.toastView,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                    backgroundColor: type === "success" ? "#8fe585" : "#ee7272",
                },
            ]}
        >
            <Ionicons name={type === "success" ? "checkmark-circle-outline" : "close-circle-outline"} size={34} color="white" />
            <View style={{ marginLeft: 10 }}>
                <AppText variant="body" style={styles.message}>
                    {message}
                </AppText>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toastView: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        width: 340,
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        paddingHorizontal: 10,
        zIndex: 1000,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5
    },
    message: {
        color: "white",
    },
});
