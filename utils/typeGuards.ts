import { AuthError } from "@/firebase/firebaseAuth";

export function isAuthError(value: any): value is AuthError {
    return value && typeof value === "object" && "errorCode" in value && "errorMessage" in value;
}

