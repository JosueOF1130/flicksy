import AppText from "@/components/app/AppText";
import ThemedView from "@/components/views/ThemedView";
import { useTheme } from "@/context/themeContext";
import { GetMovieDetailsById } from "@/services/tmdb";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import CastCarousel from "@/components/movies/CastCarousel";
import MovieCarousel from "@/components/movies/MovieCarousel";
import TrailerCarousel from "@/components/movies/TrailerCarousel";
import WatchProviders from "@/components/movies/WatchProviders";
import { useAuth } from "@/context/authContext";
import { MovieDetails } from "@/interfaces/tmdb";
import { IsMovieSaved, SaveMovie, UnSaveMovie } from "@/services/firebase";
import { heartColor, starColor } from "@/theme/colors";
import { TabRoute } from "@/types/componentTypes";
import { SavedMovieType } from "@/types/movieTypes";
import { Image } from "expo-image";
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    ScrollView,
    View
} from "react-native";

export default function MovieDetailsScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();

    const { id, backText, from } = useLocalSearchParams<{
        id: string;
        backText?: string;
        from?: TabRoute;
    }>();
    const [heartFilled, setHeartFilled] = useState<boolean>(false);


    const YT_BASE_URL: string = "https://www.youtube.com/watch?v=";
    const POSTER_BASE_URL: string = "https://image.tmdb.org/t/p/w500";



    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const rating = Math.round(((movie?.vote_average ?? 0) / 2) * 2) / 2;

    const { width: screenWidth } = Dimensions.get("window");
    const MAX_WIDTH = 1000;

    const stars: any = [];

    const region = movie?.watch_providers?.results?.["US"];
    const videos = movie?.videos?.results;



    const rentProviders = region?.rent || [];
    const buyProviders = region?.buy || [];
    const flatrateProviders = region?.flatrate || [];
    const trailers = videos?.filter(video => video.type === "Trailer");

    const cast = movie?.credits?.cast;
    const sortedCast = cast?.slice(0, 10).sort((a, b) => a.order - b.order) || [];

    const similarMovies = movie?.similar;
    console.log(similarMovies)





    useEffect(() => {
        async function getMovieDetails() {
            try {
                const response = await GetMovieDetailsById(id);
                if (user) {
                    const saved = await IsMovieSaved(user.uid, id);
                    setHeartFilled(saved);
                }
                setMovie(response);
            } catch (err) {
                console.error("Failed to fetch movie details", err);
            } finally {
                setLoading(false);
            }
        }
        getMovieDetails();

    }, [id]);
    function goBack() {
        if (from) {
            router.push(from);
        } else {
            router.replace("/(app)/(tabs)/(home)");
        }
    }
    async function toggleSaveMovie() {
        setHeartFilled((prev) => {
            const newState = !prev;

            const save = async () => {
                if (user) {
                    if (movie) {
                        if (newState) {
                            const movieOb: SavedMovieType = {
                                mid: id,
                                title: movie.title,
                                genres: movie.genres,
                                releaseYear: Number(movie.release_date.slice(0, 4)),
                                poster: POSTER_BASE_URL + movie.poster_path

                            }
                            await SaveMovie(user.uid, movieOb);
                        } else {
                            const results = await UnSaveMovie(user.uid, id);
                        }
                    }
                }
            }

            save();

            return newState;
        });
    }




    function starRating() {
        for (let i = 0; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<Ionicons key={i} name="star" size={20} color={starColor} />);
            } else if (rating + 0.5 >= i) {
                stars.push(<Ionicons key={i} name="star-half" size={20} color={starColor} />);
            } else {
                stars.push(<Ionicons key={i} name="star-outline" size={20} color={starColor} />);
            }
        }
        return <View style={{ flexDirection: "row", gap: 2 }}>{stars}</View>;

    }





    return (
        <ThemedView>
            <Stack.Screen options={{ headerShown: false, gestureEnabled: true, fullScreenGestureEnabled: true }} />
            <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 15 }} onPress={goBack}>
                <Ionicons name="arrow-back" size={24} color={colors.text.base} />
                <AppText style={{ marginLeft: 5 }} variant="title">{backText}</AppText>
            </Pressable>
            {loading ? (
                // loading indicator
                <>
                    <ActivityIndicator size="large" color={colors.text.base} />
                </>
            ) : (
                // movie info
                movie ?
                    (
                        // movie exists
                        <ScrollView contentContainerStyle={{ maxWidth: 800, marginHorizontal: "auto", paddingBottom: 100, }} showsVerticalScrollIndicator={false}>

                            <Image
                                source={{ uri: POSTER_BASE_URL + movie.poster_path }}
                                style={{ width: 180, height: 260, borderRadius: 7, marginHorizontal: "auto" }}

                            />
                            <AppText variant="display" center>{movie.title}</AppText>

                            <AppText center style={{ color: colors.text.shades[600], marginTop: 5 }}>
                                {movie.genres[0]?.name}{" · " + movie.genres[1]?.name}{" · " + movie.genres[2]?.name}
                            </AppText>
                            <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 5 }}>
                                <AppText style={{ color: colors.text.shades[500] }} center>
                                    {movie.release_date.slice(0, 4) + " · " + (movie.certification ?? "Not rated") + " · " + movie.runtime + " mins"}
                                </AppText>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                    <AppText center>{rating}</AppText>
                                    {starRating()}
                                </View>
                                <Pressable onPress={toggleSaveMovie}>
                                    <Ionicons
                                        name={heartFilled ? "heart" : "heart-outline"}
                                        size={25}
                                        color={heartColor}
                                    />
                                </Pressable>
                            </View>
                            <View>
                                <AppText variant="title" style={{ marginVertical: 10 }}>Synopsis:</AppText>
                                <AppText textBreakStrategy="simple">{movie.overview}</AppText>
                            </View>
                            {/* Watch Providers */}
                            <WatchProviders rent={rentProviders} buy={buyProviders} stream={flatrateProviders} />
                            {/* Cast */}
                            {sortedCast.length > 0 && <CastCarousel cast={sortedCast} />}
                            {/* Trailers */}
                            {trailers && <TrailerCarousel trailers={trailers} />}
                            {similarMovies && similarMovies?.results.length > 0 && (<MovieCarousel movies={similarMovies.results} back="Movie" title="You may also like" />)}
                        </ScrollView>
                    )
                    :
                    (
                        // movie doesnt exist
                        <>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <AppText center bold variant="title">Sorry, the movie you're looking for doesnt exist...</AppText>
                            </View>
                        </>
                    )
            )}
        </ThemedView>
    );
}
