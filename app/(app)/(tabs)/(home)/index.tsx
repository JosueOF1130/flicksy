import AppText from "@/components/app/AppText";
import MovieCarousel from "@/components/movies/MovieCarousel";
import ThemedView from "@/components/views/ThemedView";
import { useTheme } from "@/context/themeContext";
import { GetMovieList, GetMoviesByGenre } from "@/services/tmdb";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {

    const { colors } = useTheme()

    
    const [popularMovies, setPopularMovies] = useState();
    
    const [nowPlayingMovies, setNowPlayingMovies] = useState();
    
    const [topRatedMovies, setTopRatedMovies] = useState();
    
    const [upcomingMovies, setUpcomingMovies] = useState();
    
    const [actionMovies, setActionMovies] = useState();
    const [adventureMovies, setAdventureMovies] = useState();
    const [animationMovies, setAnimationMovies] = useState();
    const [comedyMovies, setComedyMovies] = useState();
    const [dramaMovies, setDramaMovies] = useState();
    const [familyMovies, setFamilyMovies] = useState();
    const [fantasyMovies, setFantasyMovies] = useState();
    const [horrorMovies, setHorrorMovies] = useState();
    const [romanceMovies, setRomanceMovies] = useState();
    const [scienceFictionMovies, setScienceFictionMovies] = useState();
    const [thrillerMovies, setThrillerMovies] = useState();    
    
    useEffect(() => {
        async function getMovies() {
            const [responsePopular, responseNowPlaying, responseTopRated, responseUpcoming] = await Promise.all([
                GetMovieList("popular"),
                GetMovieList("now_playing"),
                GetMovieList("top_rated"),
                GetMovieList("upcoming")
            ]);

            setUpcomingMovies(responseUpcoming.results || []);
            setNowPlayingMovies(responseNowPlaying.results || []);
            setPopularMovies(responsePopular.results || []);
            setTopRatedMovies(responseTopRated.results || []);


            const [responseAction, responseAdventure, responseAnimation, responseComedy, responseDrama, responseFamily, responseFantasy, responseHorror, responseRomance, responseScienceFiction, responseThriller] = await Promise.all([
                GetMoviesByGenre("28"),
                GetMoviesByGenre("12"),
                GetMoviesByGenre("16"),
                GetMoviesByGenre("35"),
                GetMoviesByGenre("18"),
                GetMoviesByGenre("10751"),
                GetMoviesByGenre("14"),
                GetMoviesByGenre("27"),
                GetMoviesByGenre("10749"),
                GetMoviesByGenre("878"),
                GetMoviesByGenre("53"),
            ])

            setActionMovies(responseAction.results || []);
            setAdventureMovies(responseAdventure.results || []);
            setAnimationMovies(responseAnimation.results || []);
            setComedyMovies(responseComedy.results || []);
            setDramaMovies(responseDrama.results || [])
            setFamilyMovies(responseFamily.results || []);
            setFantasyMovies(responseFantasy.results || []);
            setHorrorMovies(responseHorror.results || []);
            setRomanceMovies(responseRomance.results || []);
            setScienceFictionMovies(responseScienceFiction.results || []);
            setThrillerMovies(responseThriller.results || []);
        }
        getMovies();
    }, []);


    return (
        <>

            <ThemedView>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 15 }}>
                        <AppText variant="display" style={{ marginLeft: 15, marginBottom: 10 }}>Home</AppText>
                        <Pressable onPress={() => {
                            router.push('/search');
                        }}>
                            <Ionicons name="search" size={24} color={colors.text.base} />
                        </Pressable>
                    </View>
                    <MovieCarousel movies={nowPlayingMovies} title="Now Playing"/>
                    <MovieCarousel movies={upcomingMovies} title="Upcoming" />
                    <MovieCarousel movies={popularMovies} title="Popular" />
                    <MovieCarousel movies={topRatedMovies} title="Top Rated" />
                    <MovieCarousel movies={actionMovies} title="Action" />
                    <MovieCarousel movies={adventureMovies} title="Adventure" />
                    <MovieCarousel movies={animationMovies} title="Animation" />
                    <MovieCarousel movies={comedyMovies} title="Comedy" />
                    <MovieCarousel movies={dramaMovies} title="Drama" />
                    <MovieCarousel movies={familyMovies} title="Family" />
                    <MovieCarousel movies={fantasyMovies} title="Fantasy" />
                    <MovieCarousel movies={horrorMovies} title="Horror" />
                    <MovieCarousel movies={romanceMovies} title="Romance" />
                    <MovieCarousel movies={scienceFictionMovies} title="Science Fiction" />
                    <MovieCarousel movies={thrillerMovies} title="Thriller" />

                </ScrollView>

            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        paddingTop: Platform.OS === "web" ? 0 : 45
    }
})