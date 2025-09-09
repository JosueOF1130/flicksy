// Starting new for flicksy

import { get, ref, remove, set } from "firebase/database";
import { database } from "./firebase";
import { SavedMovieType } from "@/types/movieTypes";
import { DBResult } from "@/types/promiseTypes"

export async function SaveMovieDB(uid: string, movie: SavedMovieType): Promise<DBResult> {
    try {
        const savedMoviesRef = ref(database, `users/${uid}/savedMovies/${movie.mid}`);
        await set(savedMoviesRef, movie);
        return { success: true}
    } catch (error: any) {
        return { success: false, error: error.message}
    }
}

export async function UnSaveMovieDB(uid: string, mid: string): Promise<DBResult> {
    try {
        const movieRef = ref(database, `users/${uid}/savedMovies/${mid}`);
        await remove(movieRef);
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function IsMovieSavedDB(uid: string, mid: string): Promise<boolean> {
    try {
        const movieRef = ref(database, `users/${uid}/savedMovies/${mid}`);
        const snapShot = await get(movieRef);
        return snapShot.exists();
    } catch(error: any) {
        return false;
    }
}