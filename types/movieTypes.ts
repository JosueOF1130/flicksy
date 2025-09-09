interface Genre {
    id: number;
    name: string;
}

export type SavedMovieType = {
    mid: string;
    title: string;
    genres: Genre[];
    releaseYear: number;
    poster: string
}
