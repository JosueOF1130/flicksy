import { FirebaseError } from "firebase/app";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

import { database } from "@/firebase/firebase";
import { get, ref, set } from "firebase/database";

type AuthSuccess = User;
export type AuthError = { errorCode: string; errorMessage: string };
export type AuthResult = AuthSuccess | AuthError;

async function signInUser(email: string, password: string): Promise<AuthResult> {
    try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);

        return credentials.user;

    } catch (error) {
        return {
            errorCode: error instanceof FirebaseError ? error.code : "unknown",
            errorMessage: error instanceof FirebaseError ? error.message : "An unknown error occurred"
        };
    }
}

async function signUpUser(email: string, password: string, username: string): Promise<AuthResult> {
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = credentials.user;
        
        let myRef = ref(database, "users/" + user.uid);

        await set(myRef, {
            username: username,
            createdAt: Date.now()
        })
        return user;

    } catch (error) {
        return {
            errorCode: error instanceof FirebaseError ? error.code : "unknown",
            errorMessage: error instanceof FirebaseError ? error.message : "An unknown error occurred"
        };
    }
}

function onUserStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}


async function signOutUser(): Promise<void | AuthError>{
    try {
        signOut(auth);
    } catch (error) {
        return {
            errorCode: error instanceof FirebaseError ? error.code : "unknown",
            errorMessage: error instanceof FirebaseError ? error.message : "An unknown error occurred"
        };
    }
}

async function getUsername(uid: string): Promise<string | null | AuthError> {
    try {
        let usernameRef = ref(database, `users/${uid}/username`)
        const snapShot = await get(usernameRef);
        return snapShot.exists() ? snapShot.val() : null;
    }catch(error) {
        return {
            errorCode: error instanceof FirebaseError ? error.code : "unknown",
            errorMessage: error instanceof FirebaseError ? error.message : "An unknown error occurred"
        };
    }
}


async function getCurrentUser(): Promise<AuthSuccess | null> {
    const user = auth.currentUser;

    if(user) {
        return user;
    } else {
        return null
    }
}


export {
    getUsername, onUserStateChange, signInUser,
    signOutUser, signUpUser, getCurrentUser
};

