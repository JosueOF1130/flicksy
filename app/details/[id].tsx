import { FetchMovieById } from "@/api/tmdb";
import AppText from "@/components/AppText";
import ThemedView from "@/components/ThemedView";
import { useTheme } from "@/context/themeContext";
import { GetMovieById, GetMovieDetailsById } from "@/services/tmdb";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { Movie, MovieDetails } from "@/interfaces/tmdb"
import { Image } from "expo-image";
import { MovieBackdrop } from "@/components/MovieBackdrop";

export default function MovieDetailsScreen() {

    const { id, backText } = useLocalSearchParams<{ id: string; backText?: string }>();

    const { colors } = useTheme();

    function goBack() {
        router.back();
    }

    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getMovieDetails() {
            try {
                const response = await GetMovieDetailsById(id);
                setMovie(response);
            } catch (err) {
                console.error("Failed to fetch movie details", err);
            } finally {
                setLoading(false);
            }
        }
        getMovieDetails();
    }, [id]);





    function movieDetails(movie: Movie) {


        const rating = Math.round((movie.vote_average / 2) * 2) / 2;



        return (
            <View>
                <View style={{ gap: 10, marginTop: 25, flexDirection: "row", flexWrap: "wrap"}}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                        style={{ width: 180, height: 260, borderRadius: 7 }}
                    />
                        <AppText variant="heading">{movie.title}</AppText>
                    <View style={{ flexDirection: "row", gap: 5}}>
                        <AppText>{movie.release_date}</AppText>
                        <AppText>{movie.genres[0].name}</AppText>
                        <AppText>{movie.genres[1].name}</AppText>
                        <AppText>{movie.runtime} mins</AppText>
                    </View>
                </View>
                <View>
                    <AppText variant="title">Synopsis:</AppText>
                    <AppText variant="small">{movie.overview}</AppText>
                </View>
                <AppText>Release Date: {movie.release_date}</AppText>
                <AppText>Rating: {rating}</AppText>
            </View>
        );
    }

    function noMovieFound() {
        return (
            <AppText>No details found.</AppText>
        );
    }

    function loadingIndicator() {
        return (
            <ActivityIndicator size="large" color={colors.text.base} />
        );
    }


    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ThemedView>
                <ScrollView style={{ paddingTop: 35 }}>

                    <View style={{ marginVertical: 14 }} >
                        <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={goBack}>
                            <Ionicons name="arrow-back" size={24} color={colors.text.base} />
                            <AppText style={{ marginLeft: 5 }} variant="title">{backText}</AppText>
                        </Pressable>
                    </View>

                    {/* <AppText variant="heading" style={{ marginBottom: 10}}>Details</AppText> */}

                    {loading ? (
                        loadingIndicator()
                    ) : (
                        <>
                            {
                                movie ? (
                                    movieDetails(movie)
                                ) : (
                                    noMovieFound()
                                )
                            }
                        </>
                    )}
                </ScrollView>
            </ThemedView>
        </>
    );
}