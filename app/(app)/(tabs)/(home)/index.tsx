import AppText from "@/components/AppText";
import MovieCarousel from "@/components/MovieCarousel";
import ThemedView from "@/components/ThemedView";
import { useTheme } from "@/context/themeContext";
import { GetMovieList } from "@/services/tmdb";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {

    const { colors } = useTheme()

    const [popularMovies, setPopularMovies] = useState();

    const [nowPlayingMovies, setNowPlayingMovies] = useState();

    const [topRatedMovies, setTopRatedMovies] = useState();

    const [upcomingMovies, setUpcomingMovies] = useState();

    useEffect(() => {
        async function getMovies() {
            const responsePopular = await GetMovieList("popular");
            const responseNowPlaying = await GetMovieList("now_playing");
            const responseTopRated = await GetMovieList("top_rated");
            const responseUpcoming = await GetMovieList("upcoming");


            setPopularMovies(responsePopular.results || []);
            setNowPlayingMovies(responseNowPlaying.results || []);
            setTopRatedMovies(responseTopRated.results || []);
            setUpcomingMovies(responseNowPlaying.results || []);

        }
        getMovies();
    }, []);

    useEffect(() => {
    }, [popularMovies, nowPlayingMovies]);


    return (
        <>

            <ThemedView>
                <ScrollView contentContainerStyle={ styles.scrollView}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 15}}>
                        <AppText variant="display" style={{ marginLeft: 15, marginBottom: 10}}>Home</AppText>
                        <Ionicons name="search" size={24} color={colors.text.base}/>
                    </View>
                    <MovieCarousel movies={nowPlayingMovies} title="Now Playing"></MovieCarousel>
                    <MovieCarousel movies={upcomingMovies} title="Upcoming" />
                    <MovieCarousel movies={popularMovies} title="Popular" />
                    <MovieCarousel movies={topRatedMovies} title="Top Rated" />
                </ScrollView>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        paddingTop: 45
    }
})