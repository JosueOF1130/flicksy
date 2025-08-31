import AppIconButton from "@/components/AppIconButton";
import AppText from "@/components/AppText";
import ThemedView from "@/components/ThemedView";
import { useAuth } from "@/context/authContext";

export default function AccountScreen() {

    const { LogOutUser } = useAuth();

    return (
        <>
            <ThemedView>
                <AppText variant="display">Account</AppText>

                <AppIconButton name="exit-outline" onPress={ LogOutUser }>Logout</AppIconButton>
            </ThemedView>
        </>
    );
}