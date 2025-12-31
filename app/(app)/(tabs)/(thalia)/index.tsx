import AppText from "@/components/app/AppText";
import ThemedView from "@/components/views/ThemedView";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import AppButton from "@/components/app/AppButton";

import { OpenAIService } from "@/api/openai";
import { useTheme } from "@/context/themeContext";
import { SearchMovie } from "@/interfaces/tmdb";
import { GetSearchedMovie } from "@/services/tmdb";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const openai = new OpenAIService(process.env.EXPO_PUBLIC_OPENAI_KEY!);


const OPENAIMESSAGE: string = "This is a movie recommendation app where with a click of a button i need you to return me a list of 15 new movies with the original title as shown in IMDB and the theoretical release data for example use this format exactly dont give me any additional text and dont give me a numbered list JUST the text as given the in the example below: movie title,release year; use the ; to seperate each movie and the comma to seperate the title from the year: Coco, 2017; Uncut Gems, 2019; Road House, 2024; Shrek, 2001; Shrek 2, 2004;"





export default function SearchScreen() {

    const { colors } = useTheme();


    type GPTResponse = {
        title: string,
        year: string
    }
    type RecommendationStatus = "idle" | "loading" | "success" | "error";

    const [moviesArray, setMoviesArray] = useState<GPTResponse[]>([]);

    const [reccomendedMovies, setReccomendedMovies] = useState<SearchMovie[]>([]);
    const [reccomendationStatus, setReccomendationStatus] = useState<RecommendationStatus>("idle");


    async function generateMovies() {
        setReccomendationStatus("loading");
        try {
            const res = await openai.sendMessage({
                model: "gpt-4o-mini", // or the model you prefer
                messages: [
                    { role: "user", content: OPENAIMESSAGE }
                ],
                temperature: 0.7,
            });

            const moviesString: string = res.choices[0].message.content;

            const movieArray = moviesString.split(';').map(item => {
                const match = item.trim().match(/^(.*),\s*(\d{4})$/);
                if (match) {
                    return { title: match[1], year: match[2] };
                }
                return null;
            }).filter(Boolean) as GPTResponse[];

            //translate array to movie title : movie relase year key value
            setMoviesArray(movieArray);

            // iterate through movies and set list of movie objects
            await translateResponse(movieArray);


            setReccomendationStatus("success");
        } catch (err: any) {
            setReccomendationStatus("error");
            console.error(err.message);
        }
    }


    async function translateResponse(movies: GPTResponse[]) {

        let list: SearchMovie[] = [];

        for (const movie of movies) {
            try {
                const result = await GetSearchedMovie(movie.title);
                if (Array.isArray(result)) {
                    const response = getResponseDetails(result, movies);
                    if(response !== null) {
                        list.push(response);
                    }
                } else {
                    setReccomendationStatus("error");
                    console.error(result.error);
                }
            } catch (err: any) {
                setReccomendationStatus("error");
                console.error(err.message);
            }
        }

        setReccomendedMovies(list);
    }


    function getResponseDetails(response: SearchMovie[], source: GPTResponse[]) {


        for (const movie of response) {
            const title: string = movie.title;
            const year: string = movie.release_date?.slice(0, 4);

            if (!year) continue;

            const yearInt: number = Number(year);
            const prevYearString = String(yearInt - 1);
            for (const obj of source) {
                if (title.toLowerCase() === obj.title.toLowerCase() && (year === obj.year || prevYearString === obj.year)) {
                    return movie
                    break;
                }
            }



        }

        return null;
    }

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

    function moviePressed(id: number) {
        router.push({
            pathname: '/details/[id]',
            params: { id: id.toString(), backText: 'Account', from: "/(app)/(tabs)/(account)" },
        });

    }


    return (
        <>
            <ThemedView>
                <AppText variant="display">Thalia</AppText>
                <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>

                    {/* IDLE */}

                    {
                        reccomendationStatus === "idle" && (
                            <>

                                <AppText variant="display" center>Thalia</AppText>
                                <AppText center variant="title" style={{ marginBottom: 50 }}>Get Movie Reccomendations</AppText>

                            </>
                        )
                    }

                    {/* LOADING */}

                    {
                        reccomendationStatus === "loading" && (
                            <>
                                <View style={{ alignItems: "center", marginTop: 40 }}>
                                    <ActivityIndicator size="large" />
                                    <AppText variant="small" style={{ marginTop: 12, marginBottom: 50 }}>
                                        Finding movies you'll love…
                                    </AppText>
                                </View>
                            </>
                        )
                    }
                    {/* SUCCESS */}
                    {
                        reccomendationStatus === "success" && (
                            <>
                                {reccomendedMovies?.length ? (
                                    <ScrollView style={{ flex: 1, gap: 10 }}>
                                        {
                                            reccomendedMovies.map((movie) => {

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
                                    <AppText>No results found</AppText>
                                )
                                }
                            </>
                        )
                    }
                    {/* ERROR */}

                    {
                        reccomendationStatus === "error" && (
                            <>
                                <AppText variant="heading">Sorry there seems to be an error</AppText>
                            </>
                        )
                    }

                    {
                        reccomendationStatus !== "loading" && (
                            <AppButton onPress={generateMovies} buttonStyle={{ borderRadius: 20, maxWidth: 400, marginHorizontal: "auto" }}>Generate 5 {reccomendationStatus !== "idle" && " more "}movies</AppButton>
                        )
                    }
                </View>
            </ThemedView>
        </>
    );
}