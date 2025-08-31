import AppText from "@/components/AppText";
import ThemedView from "@/components/ThemedView";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";


export default function MovieDetailsScreen() {

    const { id, backText, movie } = useLocalSearchParams<{ id: string; backText?: string, movie: any }>();

    const { colors } = useTheme();

    function goBack() {
        router.back();
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false}} />
            <ThemedView>

                <View style={{ marginVertical: 14 }} >
                    <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={goBack}>
                        <Ionicons name="arrow-back" size={24} color={colors.text.base} />
                        <AppText style={{ marginLeft: 5 }} variant="title">{backText}</AppText>
                    </Pressable>
                </View>

                <AppText variant="display">Details</AppText>

                    <AppText variant="heading">{movie.title}</AppText>
                <ScrollView>
                </ScrollView>
            </ThemedView>
        </>
    );
}