import { MovieDetails, MovieSearchResponse, SearchMovie } from "@/interfaces/tmdb";
import { MovieListTypes } from "@/types/apiTypes";

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_AUTH}`
    }
};





export async function FetchMovieLists(listType: MovieListTypes) {
    const url = `https://api.themoviedb.org/3/movie/${listType}?language=en-US&page=1`;
    
    try {
        const response = await fetch(url, options);

        const json = await response.json();

        return json;
    } catch (error: any) {
        return error;
    }

}

export async function FetchMoviesByGenre(genre: string) {
    const url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&with_genres=${genre}`

    try {
        const response = await fetch(url, options);

        const json = await response.json();

        return json;
    } catch(error: any) {
        return error;
    }
}

export async function FetchMovieDetailsById(id: string) {
    const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,watch/providers,similar,videos,release_dates&language=en-US`;

    try {
        const response = await fetch(url, options);

        const json = await response.json();


        if (json["watch/providers"]) {
            json.watch_providers = json["watch/providers"];
            delete json["watch/providers"];
        }

        console.warn("API: ", json);
        return json;

    } catch (error: any) {
        return error;
    }
}


type SearchType = SearchMovie[] | { error: string }



export async function FetchSearchedMovie(movie: string): Promise<SearchType> {
    const url = `https://api.themoviedb.org/3/search/movie?query=/${movie}&include_adult=false&language=en-US&page=1`;
    try {
        const response = await fetch(url, options);
        const json: MovieSearchResponse = await response.json();
        return json.results;
    } catch (error: any) {
        return error;
    }
}