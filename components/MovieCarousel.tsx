import { FlatList, Pressable, View } from "react-native";
import AppText from "./AppText";
import { Image } from "expo-image";
import { router } from "expo-router";


export default function MovieCarousel({ movies, title }: any) {

    function moviePressed(id: number, movie: any) {
        router.push({
            pathname: '/details/[id]',
            params: { id: id.toString(), backText: 'Home', movie: movie },
        });

    }



    return (
        <>
            <View>
                <AppText variant="heading">{title}</AppText>
                <FlatList
                    data={movies}
                    horizontal
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => {
                            console.log(item.id);
                            moviePressed(item.id, item);

                        }}>
                            <View style={{ marginRight: 12, width: 120 }}>
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                                    style={{ width: 120, height: 180, borderRadius: 8 }}
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