// Starting new for flicksy

import { get, onValue, ref, remove, set } from "firebase/database";
import { database } from "./firebase";
import { SavedMovieType } from "@/types/movieTypes";
import { DBResult } from "@/types/promiseTypes"

export async function SaveMovieDB(uid: string, movie: SavedMovieType): Promise<DBResult> {
    try {
        const savedMoviesRef = ref(database, `users/${uid}/savedMovies/${movie.mid}`);
        await set(savedMoviesRef, movie);
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
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
    } catch (error: any) {
        return false;
    }
}

export async function GetSavedMoviesDB(uid: string) {
    try {
        const collectionRef = ref(database, `users/${uid}/savedMovies`);

        const response = await get(collectionRef);


        if (!response.exists()) {
            return { success: true, data: [] }
        }

        const movies = response.val() as Record<string, SavedMovieType>;

        const moviesArray = Object.entries(movies).map(([id, movie]) => ({
            id,
            ...movie,
        }));

        return { success: true, data: moviesArray }

    } catch (error: any) {
        return { success: false, error: error.message }
    }
}


export function subscribeToSavedMoviesDB(uid: string, callback: (movies: SavedMovieType[]) => void) {
    const collectionRef = ref(database, `users/${uid}/savedMovies`);

    // Attach the listener
    const unsubscribe = onValue(collectionRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback([]); // no movies yet
            return;
        }

        const data = snapshot.val() as Record<string, SavedMovieType>;
        const moviesArray = Object.entries(data).map(([id, movie]) => ({
            id,
            ...movie,
        }));

        callback(moviesArray);
    });

    // Return an unsubscribe function so you can detach the listener when needed
    return () => unsubscribe();
}