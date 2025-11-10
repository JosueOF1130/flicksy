import { FetchSearchedMovie } from '@/api/tmdb';
import AppInput from '@/components/app/AppInput'
import AppText from '@/components/app/AppText';
import ThemedView from '@/components/views/ThemedView'
import { useTheme } from '@/context/themeContext';
import { MovieDetails, SearchMovie } from '@/interfaces/tmdb';
import { GetSearchedMovie } from '@/services/tmdb';
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native'



const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
];

const genreLookup: Record<number, string> = {};
genres.forEach((g) => {
    genreLookup[g.id] = g.name;
});



export default function SearchPage() {

    const { colors } = useTheme();

    const [searchInput, setsearchInput] = useState<string>("");

    const [searchList, setSearchList] = useState<SearchMovie[]>();


    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchInput.trim().length > 0) {
                // call api
                const searchMovie = async () => {
                    let searchResult = await GetSearchedMovie(searchInput);


                    if (Array.isArray(searchResult)) {
                        setSearchList(searchResult);
                    } else {
                        console.error(searchResult.error);
                    }
                }

                searchMovie();
            } else {
                setSearchList([]);
            }
        }, 500);

        return () => clearTimeout(delay)
    }, [searchInput]);


    function moviePressed(id: number) {
        router.push({
            pathname: '/details/[id]',
            params: { id: id.toString(), backText: 'Account', from: "/(app)/(tabs)/(account)" },
        });

    }


    return (
        <ThemedView>
            <View style={{ flexDirection: "row", marginVertical: 25 }}>

                <Pressable onPress={() => { router.back(); }} style={{ justifyContent: "center", padding: 10 }}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={colors.text.base}
                    />
                </Pressable>
                <AppInput placeholder='Search for a movie . . .  ' style={{ flexGrow: 1 }} value={searchInput} onChangeText={(val) => { setsearchInput(val) }} />

            </View>
            {
                searchInput === "" && (
                    <View>
                        <AppText center>Search for a movie to see results</AppText>
                    </View>
                )
            }

            {
                searchList?.length ? (
                    <ScrollView style={{ flex: 1, gap: 10 }}>
                        {
                            searchList.map((movie) => {

                                const movieGenres = movie.genre_ids
                                    .map((id) => genreLookup[id])
                                    .filter(Boolean)
                                    .slice(0, 3);

                                return (
                                    (
                                        <Pressable key={movie.id} onPress={() => { moviePressed(Number(movie.id)) }} style={{ marginBottom: 15 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                <View style={{ flexDirection: "row", gap: 10 }}>
                                                    <Image
                                                        source={{ uri: `https://image.tmdb.org/t/p/original${movie.poster_path}` }}
                                                        style={{ height: 80, width: 50, borderRadius: 7 }}
                                                    />
                                                    <View style={{ justifyContent: "space-around" }}>
                                                        <AppText variant="title">{movie.title}</AppText>
                                                        <AppText variant="small" bold style={{ color: colors.text.shades[500] }}>{movie.release_date.slice(0, 4)}</AppText>
                                                        <View style={{ flexDirection: "row", gap: 10 }}>
                                                            <AppText variant="subtext" bold style={{ color: colors.text.shades[700] }}>{movieGenres.join(", ")}</AppText>
                                                        </View>
                                                    </View>
                                                </View>
                                                <Ionicons name="arrow-forward" size={26} color={colors.text.base} />
                                            </View>
                                        </Pressable>
                                    )
                                )
                            })
                        }
                    </ScrollView>
                ) : (
                    searchInput !== "" && <AppText>No results found</AppText>
                )
            }
        </ThemedView>
    )
}