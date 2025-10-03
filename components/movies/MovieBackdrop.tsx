// MovieBackdrop.tsx
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

export function MovieBackdrop({ path }: { path: any }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/original${path}` }}
        style={{ width: 180, height: 260}}
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
