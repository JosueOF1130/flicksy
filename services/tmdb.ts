
import { FetchMovieDetailsById, FetchMovieLists, FetchSearchedMovie } from "@/api/tmdb";
import { ReleaseDatesResult } from "@/interfaces/tmdb";
import { MovieListTypes } from "@/types/apiTypes";


export async function GetMovieList(listType: MovieListTypes) {
    const movies = await FetchMovieLists(listType);

    return movies;
}

export async function GetMovieDetailsById(id: string) {
    const movie = await FetchMovieDetailsById(id);


    let certification: string | undefined;

    const usaRelease: ReleaseDatesResult | undefined = movie.release_dates?.results?.find((result: ReleaseDatesResult) => result.iso_3166_1 === "US");
    if(usaRelease) {
        const theatrical = usaRelease.release_dates.find(
            (result) => result.type === 3 && result.certification !== ""
        );
        //get theatrical age rating if available
        certification = theatrical?.certification;

        //get first available non empty age rating
        if(!certification) {
            certification = usaRelease.release_dates.find((r) => r.certification !== "")?.certification;
        }
    }
    let movieToReturn = { ...movie, certification };
    return movieToReturn;
}

export async function GetSearchedMovie(searchInput: string) {
    const movie = await FetchSearchedMovie(searchInput);

    return movie;
}