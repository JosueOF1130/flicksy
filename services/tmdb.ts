
import { FetchMovieById, FetchMovieDetailsById, FetchMovieLists } from "@/api/tmdb";
import { MovieListTypes } from "@/types/apiTypes";


export async function GetMovieList(listType: MovieListTypes) {
    const movies = await FetchMovieLists(listType);

    return movies;
}



export async function GetMovieById(id: string) {
    const movie = await FetchMovieById(id);
    return movie;
}

export async function GetMovieDetailsById(id: string) {
    const movie = await FetchMovieDetailsById(id);
    return movie;
}