
import { FetchMovieLists } from "@/api/tmdb";
import { MovieListTypes } from "@/types/apiTypes";


export async function GetMovieList(listType: MovieListTypes) {
    const movies = await FetchMovieLists(listType);

    return movies;
}

