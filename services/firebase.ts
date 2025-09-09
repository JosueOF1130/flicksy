import { IsMovieSavedDB, SaveMovieDB, UnSaveMovieDB } from "@/firebase/firebaseDatabase";
import { SavedMovieType } from "@/types/movieTypes";
import { DBResult } from "@/types/promiseTypes";


export async function SaveMovie(uid: string, movie: SavedMovieType): Promise<DBResult> {
    return await SaveMovieDB(uid, movie);
}

export async function UnSaveMovie(uid: string, mid: string): Promise<DBResult> {
    return await UnSaveMovieDB(uid, mid);
}

export async function IsMovieSaved(uid: string, mid: string): Promise<boolean> {
    return await IsMovieSavedDB(uid, mid);
}