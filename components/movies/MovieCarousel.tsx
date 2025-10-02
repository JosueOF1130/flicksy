import { Image } from "expo-image";
import { router } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import AppText from "../app/AppText";


export default function MovieCarousel({ movies, title, back =" Home" }: any) {

    function moviePressed(id: number) {
        router.push({
            pathname: '/details/[id]',
            params: { id: id.toString(), backText: back, from: "/(app)/(tabs)/(home)"},
        });

    }


    return (
        <>
            <View>
                <AppText variant="heading" style={{ marginLeft: 15}}>{title}</AppText>
                <FlatList
                    data={movies}
                    style={{}}
                    horizontal
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 15 }}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => {
                            moviePressed(item.id);
                        }}
                        style={{marginLeft: 15}}
                        >
                            <View style={{ width: 122, justifyContent: "center", alignContent: "center"}}>
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                                    style={{ width: 120, height: 180, borderRadius: 8}}
                                />
                                <AppText style={{ marginTop: 4 }}>
                                    {item.title}
                                </AppText>
                            </View>
                        </Pressable>
                    )}
                />
            </View>
        </>
    );

}