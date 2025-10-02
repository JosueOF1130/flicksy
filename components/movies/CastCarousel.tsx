// components/movie/CastList.tsx
import AppText from "@/components/app/AppText";
import { Image } from "expo-image";
import { FlatList, View } from "react-native";

interface CastListProps {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
}

export default function CastCarousel({ cast }: CastListProps) {
  if (!cast?.length) return null;

  return (
    <View style={{ marginVertical: 10 }}>
      <AppText variant="title" style={{ marginBottom: 10 }}>Cast</AppText>
      <FlatList
        data={cast}
        horizontal
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={5}
        renderItem={({ item }) => (
          <View style={{ width: 100, alignItems: "center", marginRight: 10 }}>
            {item.profile_path ? (
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w185${item.profile_path}` }}
                style={{ width: 80, height: 120, borderRadius: 8, marginBottom: 5 }}
              />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 120,
                  borderRadius: 8,
                  backgroundColor: "#ccc",
                  marginBottom: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AppText variant="small">No Image</AppText>
              </View>
            )}
            <AppText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 12, textAlign: "center" }}
            >
              {item.name}
            </AppText>
            <AppText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 10, color: "#888", textAlign: "center" }}
            >
              {item.character}
            </AppText>
          </View>
        )}
      />
    </View>
  );
}
