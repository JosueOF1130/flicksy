import { FetchMovieById } from "@/api/tmdb";
import AppText from "@/components/app/AppText";
import ThemedView from "@/components/views/ThemedView";
import { useTheme } from "@/context/themeContext";
import { GetMovieById, GetMovieDetailsById } from "@/services/tmdb";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Linking,
    NativeEventEmitter,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { Movie, MovieDetails } from "@/interfaces/tmdb";
import { Image } from "expo-image";
import { errorColor, heartColor, starColor } from "@/theme/colors";
import { IsMovieSaved, SaveMovie, UnSaveMovie } from "@/services/firebase";
import { useAuth } from "@/context/authContext";
import { SavedMovieType } from "@/types/movieTypes";
import YoutubePlayer from "react-native-youtube-iframe";
import { TabRoute } from "@/types/componentTypes";


// export default function MovieDetailsScreen() {
//     const { colors } = useTheme();
//     const { user } = useAuth();
//     const { id, backText, from } = useLocalSearchParams<{ id: string; backText?: string; from?: TabRoute }>();
//     const [movie, setMovie] = useState<MovieDetails | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [heartFilled, setHeartFilled] = useState(false);

//     const { width: screenWidth } = Dimensions.get("window");

//     useEffect(() => {
//         async function getMovieDetails() {
//             try {
//                 const response = await GetMovieDetailsById(id);
//                 setMovie(response);
//                 if (user) {
//                     const saved = await IsMovieSaved(user.uid, id);
//                     setHeartFilled(saved);
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch movie details", err);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         getMovieDetails();
//     }, [id]);

//     function goBack() {
//         if (from) router.push(from);
//         else router.replace("/(app)/(tabs)/(home)");
//     }

//     async function toggleSaveMovie() {
//         setHeartFilled(prev => {
//             const newState = !prev;
//             (async () => {
//                 if (!user || !movie) return;
//                 if (newState) {
//                     await SaveMovie(user.uid, {
//                         mid: id,
//                         title: movie.title,
//                         genres: movie.genres,
//                         releaseYear: Number(movie.release_date.slice(0, 4)),
//                         poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
//                     });
//                 } else {
//                     await UnSaveMovie(user.uid, id);
//                 }
//             })();
//             return newState;
//         });
//     }

//     if (loading) {
//         return (
//             <ThemedView>
//                 <ActivityIndicator size="large" color={colors.text.base} />
//             </ThemedView>
//         );
//     }

//     if (!movie) {
//         return (
//             <ThemedView>
//                 <AppText bold variant="title">Sorry, movie not found</AppText>
//             </ThemedView>
//         );
//     }

//     // Sorted cast (top 10 for performance)
//     const sortedCast = movie.credits?.cast?.slice(0, 10).sort((a, b) => a.order - b.order) || [];
//     const trailers = movie.videos?.results?.filter(v => v.type === "Trailer")?.slice(0, 5) || [];

//     // Watch providers (limit each to 5 items)
//     const region = movie.watch_providers?.results?.["US"];
//     const flatrateProviders = region?.flatrate?.slice(0, 5) || [];
//     const rentProviders = region?.rent?.slice(0, 5) || [];
//     const buyProviders = region?.buy?.slice(0, 5) || [];

//     // ListHeaderComponent for the main content
//     const ListHeader = () => (
//         <View style={{ padding: 16 }}>
//             {/* Back Button */}
//             <Pressable style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }} onPress={goBack}>
//                 <Ionicons name="arrow-back" size={24} color={colors.text.base} />
//                 <AppText style={{ marginLeft: 5 }} variant="title">{backText}</AppText>
//             </Pressable>

//             {/* Poster & Title */}
//             <Image
//                 source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
//                 style={{ width: 180, height: 260, borderRadius: 8, alignSelf: "center", marginBottom: 10 }}
//             />
//             <AppText variant="display" center>{movie.title}</AppText>
//             <AppText center style={{ color: colors.text.shades[600], marginVertical: 5 }}>
//                 {movie.genres.map(g => g.name).join(" · ")}
//             </AppText>

//             {/* Rating & Heart */}
//             <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 10 }}>
//                 <AppText>{Math.round((movie.vote_average / 2) * 2) / 2}</AppText>
//                 <Pressable onPress={toggleSaveMovie}>
//                     <Ionicons name={heartFilled ? "heart" : "heart-outline"} size={25} color={heartColor} />
//                 </Pressable>
//             </View>

//             {/* Synopsis */}
//             <AppText variant="title" style={{ marginBottom: 5 }}>Synopsis:</AppText>
//             <AppText textBreakStrategy="simple">{movie.overview}</AppText>

//             {/* Watch Providers */}
//             {(flatrateProviders.length || rentProviders.length || buyProviders.length) > 0 && (
//                 <View style={{ marginVertical: 15 }}>
//                     <AppText variant="title">Watch Providers</AppText>
//                     {flatrateProviders.length > 0 && (
//                         <>
//                             <AppText variant="small" bold style={{ marginVertical: 5 }}>Stream</AppText>
//                             <FlatList
//                                 data={flatrateProviders}
//                                 horizontal
//                                 keyExtractor={p => String(p.provider_id)}
//                                 showsHorizontalScrollIndicator={false}
//                                 renderItem={({ item }) => (
//                                     <Image
//                                         source={{ uri: `https://image.tmdb.org/t/p/w45${item.logo_path}` }}
//                                         style={{ width: 50, height: 50, marginRight: 8, borderRadius: 10 }}
//                                     />
//                                 )}
//                             />
//                         </>
//                     )}
//                     {rentProviders.length > 0 && (
//                         <>
//                             <AppText variant="small" bold style={{ marginVertical: 5 }}>Rent</AppText>
//                             <FlatList
//                                 data={rentProviders}
//                                 horizontal
//                                 keyExtractor={p => String(p.provider_id)}
//                                 showsHorizontalScrollIndicator={false}
//                                 renderItem={({ item }) => (
//                                     <Image
//                                         source={{ uri: `https://image.tmdb.org/t/p/w45${item.logo_path}` }}
//                                         style={{ width: 50, height: 50, marginRight: 8, borderRadius: 10 }}
//                                     />
//                                 )}
//                             />
//                         </>
//                     )}
//                     {buyProviders.length > 0 && (
//                         <>
//                             <AppText variant="small" bold style={{ marginVertical: 5 }}>Buy</AppText>
//                             <FlatList
//                                 data={buyProviders}
//                                 horizontal
//                                 keyExtractor={p => String(p.provider_id)}
//                                 showsHorizontalScrollIndicator={false}
//                                 renderItem={({ item }) => (
//                                     <Image
//                                         source={{ uri: `https://image.tmdb.org/t/p/w45${item.logo_path}` }}
//                                         style={{ width: 50, height: 50, marginRight: 8, borderRadius: 10 }}
//                                     />
//                                 )}
//                             />
//                         </>
//                     )}
//                 </View>
//             )}

//             {/* Cast */}
//             {sortedCast.length > 0 && (
//                 <>
//                     <AppText variant="title" style={{ marginVertical: 10 }}>Cast:</AppText>
//                     <FlatList
//                         data={sortedCast}
//                         horizontal
//                         keyExtractor={item => String(item.id)}
//                         showsHorizontalScrollIndicator={false}
//                         renderItem={({ item }) => (
//                             <View style={{ width: 100, alignItems: 'center', marginRight: 10 }}>
//                                 {item.profile_path ? (
//                                     <Image
//                                         source={{ uri: `https://image.tmdb.org/t/p/w45${item.profile_path}` }}
//                                         style={{ width: 80, height: 120, borderRadius: 8, marginBottom: 5 }}
//                                     />
//                                 ) : (
//                                     <View style={{ width: 80, height: 120, borderRadius: 8, backgroundColor: '#ccc', marginBottom: 5, justifyContent: 'center', alignItems: 'center' }}>
//                                         <AppText variant="small">No Image</AppText>
//                                     </View>
//                                 )}
//                                 <AppText numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, textAlign: 'center' }}>{item.name}</AppText>
//                                 <AppText numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 10, color: '#888', textAlign: 'center' }}>{item.character}</AppText>
//                             </View>
//                         )}
//                     />
//                 </>
//             )}

//             {/* Trailers */}
//             {trailers.length > 0 && (
//                 <>
//                     <AppText variant="title" style={{ marginVertical: 10 }}>Trailers:</AppText>
//                     <FlatList
//                         data={trailers}
//                         horizontal
//                         keyExtractor={t => t.id}
//                         showsHorizontalScrollIndicator={false}
//                         renderItem={({ item }) => (
//                             <View style={{ width: 300, marginRight: 16 }}>
//                                 <YoutubePlayer height={180} width={300} videoId={item.key} play={false} />
//                                 <Pressable style={{ marginTop: 6, padding: 10, borderRadius: 6, backgroundColor: "#e50914", alignItems: "center" }} onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${item.key}`)}>
//                                     <Text style={{ color: "white", fontWeight: "bold" }}>Play on YouTube</Text>
//                                 </Pressable>
//                             </View>
//                         )}
//                     />
//                 </>
//             )}
//         </View>
//     );

//     return (
//         <ThemedView>
//             <Stack.Screen options={{ headerShown: false }} />
//             <FlatList
//     data={[]} // dummy data
//     keyExtractor={() => "dummy"}
//     renderItem={() => null} // <- required for TypeScript
//     ListHeaderComponent={ListHeader}
// />
//         </ThemedView>
//     );
// }



export default function MovieDetailsScreen() {
    const { colors } = useTheme();
    const { user } = useAuth();

    const { id, backText, from } = useLocalSearchParams<{
        id: string;
        backText?: string;
        from?: TabRoute;
    }>();
    const [heartFilled, setHeartFilled] = useState<boolean>(false);
    const YOuTUBE_BASE_URL: string = "https://www.youtube.com/watch?v=";
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [playingTrailerId, setPlayingTrailerId] = useState<string | null>(null);
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
                                        source={{ uri: `https://image.tmdb.org/t/p/w45${item.logo_path}` }}
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
                                        source={{ uri: `https://image.tmdb.org/t/p/w45${item.logo_path}` }}
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
                                        source={{ uri: `https://image.tmdb.org/t/p/w45${item.logo_path}` }}
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
        return (

            <View style={{ marginTop: 20, gap: 10 }}>
                <AppText variant="title">Trailers</AppText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {trailers?.map((trailer) => (
                        <View
                            key={trailer.id}
                            style={{ width: 300, marginRight: 16 }}
                        >
                            {/* Inline YouTube player */}
                            <YoutubePlayer
                                height={180}
                                play={false} // play only when user presses
                                videoId={trailer.key}
                            />
                            {/* Button to open fullscreen */}
                            <Pressable
                                style={{
                                    marginTop: 6,
                                    padding: 10,
                                    borderRadius: 6,
                                    backgroundColor: "#e50914", // Netflix-red vibe
                                    alignItems: "center",
                                }}
                                onPress={() => {
                                    const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
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
                                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
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
                            {RenderProviders()}
                            {/* Cast */}
                            {sortedCast.length > 0 && (
                                <>
                                    <AppText variant="title" style={{ marginVertical: 10 }}>Cast:</AppText>
                                    <FlatList
                                        data={sortedCast}
                                        horizontal
                                        keyExtractor={item => String(item.id)}
                                        showsHorizontalScrollIndicator={false}
                                        initialNumToRender={5} // Only render first 5 at first for performance
                                        nestedScrollEnabled={true} // Fixes rendering in ScrollView on mobile
                                        renderItem={({ item }) => (
                                            <View style={{ width: 100, alignItems: 'center', marginRight: 10 }}>
                                                {item.profile_path ? (
                                                    <Image
                                                        source={{ uri: `https://image.tmdb.org/t/p/w45${item.profile_path}` }}
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
                            )}

                            {RenderTrailers()}
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
