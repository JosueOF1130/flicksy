import { Stack } from "expo-router";


export default function SearchScreenLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}}/>
        </Stack>
    );
}