// MovieBackdrop.tsx
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

export function MovieBackdrop({ movie }: { movie: any }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` }}
        style={{ width: "100%", height: "80%"}}
        contentFit="cover"
        // transition={900}
      />
      <LinearGradient
        colors={["transparent", "rgba(141, 89, 89, 0.9)"]}
        style={{ }}
      />
    </View>
  );
}
