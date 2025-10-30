import AppText from "@/components/app/AppText";
import ThemedView from "@/components/views/ThemedView";
import { useTheme } from "@/context/themeContext";
import { GetMovieDetailsById } from "@/services/tmdb";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    FlatList,
    Linking,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { MovieDetails } from "@/interfaces/tmdb";
import { Image } from "expo-image";
import { errorColor, heartColor, starColor } from "@/theme/colors";
import { IsMovieSaved, SaveMovie, UnSaveMovie } from "@/services/firebase";
import { useAuth } from "@/context/authContext";
import { SavedMovieType } from "@/types/movieTypes";
import YoutubePlayer from "react-native-youtube-iframe";
import { TabRoute } from "@/types/componentTypes";
import MovieCarousel from "@/components/movies/MovieCarousel";



export default function MovieDetailsScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();

    const { id } = useLocalSearchParams<{
        id: string;
    }>();
    const [heartFilled, setHeartFilled] = useState<boolean>(false);
    const YOuTUBE_BASE_URL: string = "https://www.youtube.com/watch?v=";
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const rating = Math.round(((movie?.vote_average ?? 0) / 2) * 2) / 2;

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
        router.back();
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
                                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`

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
        for (let i = 1; i <= 5; i++) {
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

    function RenderProviders() {
        if (flatrateProviders.length === 0 && rentProviders.length === 0 && buyProviders.length === 0) {
            return (
                <AppText style={{ color: errorColor, marginVertical: 10 }}>Not avalible on demand yet</AppText>
            );
        }
        return (
            <View style={{ marginVertical: 15 }}>
                <AppText variant="title" >Watch Providers</AppText>

                {flatrateProviders.length > 0 && (
                    <>
                        <AppText variant="small" bold style={{ marginVertical: 10 }}>Stream</AppText>
                        <View style={{ height: 50 }}>
                            <FlatList
                                data={flatrateProviders}
                                horizontal
                                keyExtractor={(prov) => String(prov.provider_id)}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/original${item.logo_path}` }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            marginRight: 8,
                                            borderRadius: 10,
                                        }}
                                    />
                                )}
                            />
                        </View>

                    </>
                )}

                {rentProviders.length > 0 && (
                    <>
                        <AppText variant="small" bold style={{ marginVertical: 10 }}>Rent</AppText>
                        <View style={{ height: 50 }}>
                            <FlatList
                                data={rentProviders}
                                horizontal
                                keyExtractor={(prov) => String(prov.provider_id)}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/original${item.logo_path}` }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            marginRight: 8,
                                            borderRadius: 10,
                                        }}
                                    />
                                )}
                            />
                        </View>

                    </>
                )}

                {buyProviders.length > 0 && (
                    <>
                        <AppText variant="small" bold style={{ marginVertical: 10 }}>Buy</AppText>
                        <View style={{ height: 50 }}>
                            <FlatList
                                data={rentProviders}
                                horizontal
                                keyExtractor={(prov) => String(prov.provider_id)}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/original${item.logo_path}` }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            marginRight: 8,
                                            borderRadius: 10,
                                        }}
                                    />
                                )}
                            />
                        </View>

                    </>
                )}
            </View>
        )
    }

    function RenderTrailers() {

        if(trailers){
            if(trailers.length > 0) {
                return (
            <View style={{ marginTop: 20, gap: 10 }}>
                <AppText variant="title">Trailers</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {trailers?.map((trailer) => (
                        <View
                            key={trailer.id}
                            style={{ width: 300, marginRight: 16 }}
                        >
                            <YoutubePlayer
                                height={180}
                                play={false} 
                                videoId={trailer.key}
                            />
                            <Pressable
                                style={{
                                    marginTop: 6,
                                    padding: 10,
                                    borderRadius: 6,
                                    backgroundColor: "#e50914",
                                    alignItems: "center",
                                }}
                                onPress={() => {
                                    const youtubeUrl = YOuTUBE_BASE_URL + trailer.key;
                                    Linking.canOpenURL(youtubeUrl).then((supported) => {
                                        if (supported) {
                                            Linking.openURL(youtubeUrl);
                                        } else {
                                            console.warn("Can't open URL:", youtubeUrl);
                                        }
                                    });
                                }}
                            >
                                <Text style={{ color: "white", fontWeight: "bold" }}>
                                    Play trailer on Youtube
                                </Text>
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
            }
        }
        return (
            <>
                <AppText variant="small" style={{ marginVertical: 10}}>No trailers for this movie</AppText>
            </>
        )
        
    }

    function RenderCast() {
        console.warn(sortedCast.length);
        if(sortedCast.length === 0) {
            return(
                <>
                    <AppText variant="small">No Cast information avalible</AppText>
                </>
            );
        }

        return (
            <>
                <AppText variant="title" style={{ marginVertical: 10 }}>Cast:</AppText>
                <FlatList
                    data={sortedCast}
                    horizontal
                    keyExtractor={item => String(item.id)}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={5}
                    nestedScrollEnabled={true} 
                    renderItem={({ item }) => (
                        <View style={{ width: 100, alignItems: 'center', marginRight: 10 }}>
                            {item.profile_path ? (
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/original${item.profile_path}` }}
                                    style={{ width: 80, height: 120, borderRadius: 8, marginBottom: 5 }}
                                />
                            ) : (
                                <View style={{
                                    width: 80,
                                    height: 120,
                                    borderRadius: 8,
                                    backgroundColor: '#ccc',
                                    marginBottom: 5,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <AppText variant="small">No Image</AppText>
                                </View>
                            )}
                            <AppText numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, textAlign: 'center' }}>{item.name}</AppText>
                            <AppText numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 10, color: '#888', textAlign: 'center' }}>{item.character}</AppText>
                        </View>
                    )}
                />
            </>

        )
    }

    function RenderSimilarMovies() {
        if(!similarMovies){
            return(
                <>
                    <AppText variant="small">Sorry cant display similar movies at the moment</AppText>
                </>
            );
        }
        return (
            <View style={{ marginVertical: 20}}>
                <MovieCarousel movies={movie?.similar?.results} title="Similar Movies"/>
            </View>
        );
    }


    return (
        <ThemedView>
            <Stack.Screen options={{ headerShown: false, gestureEnabled: true, fullScreenGestureEnabled: true }} />
            <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 15 }} onPress={goBack}>
                <Ionicons name="arrow-back" size={24} color={colors.text.base} />
                <AppText style={{ marginLeft: 5 }} variant="title">{}</AppText>
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
                        <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

                            <View style={{ width: "100%", maxWidth: 900 }}>
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/original${movie.poster_path}` }}
                                    style={{ width: 180, height: 260, borderRadius: 7, marginHorizontal: "auto" }}

                                />
                                <AppText variant="display" center>{movie.title}</AppText>

                                <AppText center style={{ color: colors.text.shades[600], marginTop: 5 }}>
                                    {movie.genres[0] && movie.genres[0].name}{movie.genres[1] && " · " + movie.genres[1].name}{movie.genres[2] && " · " + movie.genres[2].name}
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
                                {/* Watch providers */}
                                {RenderProviders()}
                                {/* Cast */}
                                {RenderCast()}
                                {/* Trailers */}
                                {RenderTrailers()}
                                {/* Simlar Movies */}
                                {RenderSimilarMovies()}
                            </View>
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
