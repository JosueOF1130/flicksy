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
import { heartColor } from "@/theme/colors";

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



    function StarRating(rating: number) {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                // full star
                stars.push(<Ionicons key={i} name="star" size={20} color="#FFD700" />);
            } else if (rating + 0.5 >= i) {
                // half star
                stars.push(<Ionicons key={i} name="star-half" size={20} color="#FFD700" />);
            } else {
                // empty star
                stars.push(<Ionicons key={i} name="star-outline" size={20} color="#FFD700" />);
            }
        }

        return <View style={{ flexDirection: "row", gap: 2 }}>{stars}</View>;
    }

    function movieDetails(movie: Movie) {


        const rating = Math.round((movie.vote_average / 2) * 2) / 2;



        return (
            <View>
                <View style={{ gap: 10, marginTop: 25, flexDirection: "row", flexWrap: "wrap" ,marginBottom: 10, alignItems: "flex-end" }}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                        style={{ width: 180, height: 260, borderRadius: 7 }}
                    />
                    <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", rowGap: 10, columnGap: 25, flexWrap: "wrap"}}>
                        <View>
                            <AppText variant="display">{movie.title}</AppText>
                            <View style={{ flexDirection: "row", gap: 5, alignItems: "flex-end" }}>
                                <AppText style={{ color: colors.text.shades[600]}}>{movie.release_date.slice(0, 4)}</AppText>
                                <AppText style={{ color: colors.text.shades[600]}}>{movie.genres[0]?.name} {movie.genres[1]?.name}</AppText>
                                <AppText style={{ color: colors.text.shades[600]}}>{movie.runtime} mins</AppText>
                            </View>
                        </View>
                        <Pressable onPress={() => {}}>
                            <Ionicons name="heart-outline" size={25} color={heartColor} />
                        </Pressable>
                    </View>
                </View>


                <View style={{ flexDirection: "row", gap: 10}}>
                    <AppText>{rating}</AppText>
                    {StarRating(rating)}
                </View>


                <View>
                    <AppText variant="title" style={{ marginBottom: 5 }}>Synopsis:</AppText>
                    <AppText variant="small">{movie.overview}</AppText>
                </View>
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
                <ScrollView style={{ paddingTop: 35, paddingHorizontal: 15 }}>

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