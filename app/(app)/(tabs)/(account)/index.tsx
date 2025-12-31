import AppText from "@/components/app/AppText";
import ThemedView from "@/components/views/ThemedView";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { GetSavedMoviesDB, subscribeToSavedMoviesDB } from "@/firebase/firebaseDatabase";
import { SavedMovieType } from "@/types/movieTypes";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";

export default function AccountScreen() {

    const { colors } = useTheme();

    const [movies, setMovies] = useState<SavedMovieType[]>();

    const { user } = useAuth();


    useEffect(() => {
        async function getMovies() {
            if (user) {
                const results = await GetSavedMoviesDB(user.uid);
                if (results.success) {
                    setMovies(results.data);
                }
            }
        }
        getMovies();

    }, []);


    useEffect(() => {
        if (user) {
            const unsubscribe = subscribeToSavedMoviesDB(user.uid, setMovies);
            return () => unsubscribe();
        }
    }, []);

    function moviePressed(id: number) {
        router.push({
            pathname: '/details/[id]',
            params: { id: id.toString(), backText: 'Account', from: "/(app)/(tabs)/(account)" },
        });

    }

    return (
        <>
            <ThemedView>
                <View style={{ paddingTop: Platform.OS === "web" ? 0 : 45, paddingHorizontal: 25, flex: 1 }}>
                    <View style={{ gap: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <AppText variant="display">Account</AppText>
                        <Pressable onPress={() => {
                            router.push("./settings");
                        }}>
                            <Ionicons name="settings" size={25} color={colors.text.base} />
                        </Pressable>
                    </View>
                    {/* Movie library */}
                    <AppText variant="heading" bold>Movies</AppText>
                    <ScrollView style={{ flex: 1, gap: 10 }}>
                        {movies && movies.map(movie => {
                            return (
                                <Pressable key={movie.mid} onPress={() => { moviePressed(Number(movie.mid)) }} style={{ marginBottom: 15}}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                        <View style={{ flexDirection: "row", gap: 10 }}>
                                            <Image
                                                source={{ uri: movie.poster }}
                                                style={{ height: 80, width: 50, borderRadius: 7 }}
                                            />
                                            <View style={{ justifyContent: "space-around" }}>
                                                <AppText variant="title">{movie.title}</AppText>
                                                <AppText variant="small" bold style={{ color: colors.text.shades[500]}}>{movie.releaseYear}</AppText>
                                                <View style={{ flexDirection: "row", gap: 10 }}>
                                                    <AppText variant="subtext" bold style={{ color: colors.text.shades[700]}}>{movie.genres[0].name}</AppText>
                                                    <AppText variant="subtext" bold style={{ color: colors.text.shades[700]}}>{movie.genres[1]?.name}</AppText>
                                                </View>
                                            </View>
                                        </View>
                                        <Ionicons name="arrow-forward" size={26} color={colors.text.base} />
                                    </View>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>
            </ThemedView>
        </>
    );
}
