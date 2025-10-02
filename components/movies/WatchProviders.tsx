import { errorColor } from "@/theme/colors";
import { Image } from "expo-image";
import { FlatList, View } from "react-native";
import AppText from "../app/AppText";


interface WatchProvidersInterface {
    rent: any[];
    buy: any[];
    stream: any[];
}

export default function WatchProviders({rent, buy, stream}: WatchProvidersInterface) {
    if (rent.length === 0 && buy.length === 0 && stream.length === 0) {
        return (
            <AppText style={{ color: errorColor, marginVertical: 10 }}>Not avalible on demand yet</AppText>
        );
    }
    return (
        <View style={{ marginVertical: 15 }}>
            <AppText variant="title" >Watch Providers</AppText>

            {stream.length > 0 && (
                <>
                    <AppText variant="small" bold style={{ marginVertical: 10 }}>Stream</AppText>
                    <View style={{ height: 50 }}>
                        <FlatList
                            data={stream}
                            horizontal
                            keyExtractor={(prov) => String(prov.provider_id)}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w45${item.logo_path}` }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        marginRight: 8,
                                        borderRadius: 10,
                                    }}
                                />
                            )}
                        />
                    </View>

                </>
            )}

            {rent.length > 0 && (
                <>
                    <AppText variant="small" bold style={{ marginVertical: 10 }}>Rent</AppText>
                    <View style={{ height: 50 }}>
                        <FlatList
                            data={rent}
                            horizontal
                            keyExtractor={(prov) => String(prov.provider_id)}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w45${item.logo_path}` }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        marginRight: 8,
                                        borderRadius: 10,
                                    }}
                                />
                            )}
                        />
                    </View>

                </>
            )}

            {buy.length > 0 && (
                <>
                    <AppText variant="small" bold style={{ marginVertical: 10 }}>Buy</AppText>
                    <View style={{ height: 50 }}>
                        <FlatList
                            data={buy}
                            horizontal
                            keyExtractor={(prov) => String(prov.provider_id)}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w45${item.logo_path}` }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        marginRight: 8,
                                        borderRadius: 10,
                                    }}
                                />
                            )}
                        />
                    </View>

                </>
            )}
        </View>
    )
}