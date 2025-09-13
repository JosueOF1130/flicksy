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

export async function FetchMovieById(id: string) {
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;

    try {
        const response = await fetch(url, options);

        const json = await response.json();

        return json;
    } catch (error: any) {
        return error;
    }
}

export async function FetchMovieDetailsById(id: string) {
    const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos%2Cwatch%2Fproviders%2Csimilar&language=en-US`;

    try {
        const response = await fetch(url, options);

        const json = await response.json();

        if (json["watch/providers"]) {
            json.watch_providers = json["watch/providers"];
            delete json["watch/providers"];
        }

        return json;

    } catch (error: any) {
        return error;
    }
}