import AppText from "@/components/app/AppText";
import ThemedView from "@/components/views/ThemedView";
import { View } from "react-native";


export default function SearchScreen() {
    return (
        <>
            <ThemedView>
                <AppText variant="display">Thalia</AppText>
                <View style={{ flex: 1, alignContent: "center", justifyContent: "center"}}>
                    <AppText variant="heading" center>Comming soon</AppText>
                </View>
            </ThemedView>
        </>
    );
}