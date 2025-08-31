import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, PropsWithChildren, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onUserStateChange, signInUser, signUpUser, signOutUser } from "@/firebase/firebaseAuth";

type AuthContextType = {
    user: User | null;
    LoginUser: (email: string, password: string) => Promise<void>;
    CreateUser: (email: string, password: string, username: string) => Promise<void>;
    LogOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function     useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [ready, setReady] = useState(false);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const unsubscribe = onUserStateChange((user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (segments.length > 0) {
            setReady(true);
        }
    }, [segments]);

    useEffect(() => {
        if (!ready) return;
        const rootSegment = segments[0];
        console.log(segments);

        if (!user && rootSegment !== "(auth)") {
            router.replace("/(auth)/auth");
        } else if (user && rootSegment !== "(app)") {
            router.replace("/(app)/(tabs)/(home)");
        }
    }, [user, ready]);

    async function LoginUser(email: string, password: string) {
        const results = await signInUser(email, password);
        if ("errorCode" in results) {
            console.warn(results.errorMessage);
            return;
        }
        setUser(results);
    }

    async function CreateUser(email: string, password: string, username: string) {
        const results = await signUpUser(email, password, username);
        if ("errorCode" in results) {
            console.warn("Failed to create new user: " + results.errorMessage);
            return;
        }
        setUser(results);
    }

    async function LogOutUser() {
        const results = await signOutUser();
        if (results && "errorCode" in results) {
            console.warn("logout error: ", results.errorMessage);
            return;
        }
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, LoginUser, CreateUser, LogOutUser }}>
            {children}
        </AuthContext.Provider>
    );
}
