import { FetchMovieById } from "@/api/tmdb";
import AppText from "@/components/AppText";
import ThemedView from "@/components/ThemedView";
import { useTheme } from "@/context/themeContext";
import { GetMovieById } from "@/services/tmdb";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import {Movie} from "@/interfaces/tmdb"

export default function MovieDetailsScreen() {

    const { id, backText } = useLocalSearchParams<{ id: string; backText?: string }>();

    const { colors } = useTheme();

    function goBack() {
        router.back();
    }

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getMovieDetails() {
            try {
                const response = await GetMovieById(id);
                setMovie(response); 
            } catch (err) {
                console.error("Failed to fetch movie details", err);
            } finally {
                setLoading(false);
            }
        }
        getMovieDetails();
    }, [id]);


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

                {loading ? (
                    <ActivityIndicator size="large" color={colors.text.base} />
                ) : (
                    <>
                        {movie ? (
                            <ScrollView>
                                <AppText variant="heading">{movie.title}</AppText>
                                <AppText>{movie.overview}</AppText>
                                <AppText>Release Date: {movie.release_date}</AppText>
                                <AppText>Rating: {movie.vote_average}</AppText>
                            </ScrollView>
                        ) : (
                            <AppText>No details found.</AppText>
                        )}
                    </>
                )}

                <ScrollView>
                </ScrollView>
            </ThemedView>
        </>
    );
}