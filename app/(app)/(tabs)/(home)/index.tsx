import AppText from "@/components/AppText";
import MovieCarousel from "@/components/MovieCarousel";
import ThemedView from "@/components/ThemedView";
import { GetMovieList } from "@/services/tmdb";
import { useEffect, useState } from "react";

export default function HomeScreen() {

    const [popularMovies, setPopularMovies] = useState();

    const [nowPlayingMovies, setNowPlayingMovies] = useState()

    useEffect(() => {
        async function getMovies() {
            const responsePopular = await GetMovieList("popular");
            const responseNowPlaying = await GetMovieList("now_playing");

            setPopularMovies(responsePopular.results || []);
            setNowPlayingMovies(responseNowPlaying.results || []);

        }
        getMovies();
    }, []);

    useEffect(() => {
    }, [popularMovies, nowPlayingMovies]);


    return (
        <>
            <ThemedView>
                <AppText variant="display">Home</AppText>
                <MovieCarousel movies={nowPlayingMovies} title="Now Playing"></MovieCarousel>
                <MovieCarousel movies={popularMovies} title="Popular"/>
            </ThemedView>
        </>
    );
}