import { Video } from "@/interfaces/tmdb";
import { FlatList, Linking, Pressable, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import AppText from "../app/AppText";
// interface TrailerCarouselProps {
//     trailers: Video[];
// }

// export default function TrailerCarousel({ trailers }: TrailerCarouselProps) {
//     if (!trailers || trailers.length === 0) return null;
//     console.log(trailers)
//     return (
//         <>
//             <View style={{ marginTop: 20, gap: 10 }}>
//                 <AppText variant="title">Trailers</AppText>
//                 <FlatList
//                     data={trailers}
//                     horizontal
//                     keyExtractor={(prov) => String(prov.id)}
//                     showsHorizontalScrollIndicator={false}
//                     renderItem={({ item }) => (
//                         <>
//                             <View key={item.id} style={{ width: 300, marginRight: 16 }} > 
//                                 {/* Inline YouTube player */}
//                                 <YoutubePlayer height={180} play={false} // play only when user presses video
//                                     videoId={item.key} />
//                                 {/* Button to open fullscreen */}
//                                 <Pressable style={{
//                                     marginTop: 6, padding: 10, borderRadius: 6, backgroundColor: "#e50914", // Netflix-red vibe
//                                     alignItems: "center",
//                                 }} onPress={() => {
//                                     const youtubeUrl = `https://www.youtube.com/watch?v=${item.key}`
//                                     Linking.canOpenURL(youtubeUrl).then((supported) => {
//                                         if (supported) {
//                                             Linking.openURL(youtubeUrl);
//                                         } else {
//                                             console.warn("Can't open URL:", youtubeUrl);
//                                         }
//                                     });
//                                 }} >
//                                     <AppText style={{ color: "white", fontWeight: "bold" }}> Play trailer on Youtube </AppText>
//                                 </Pressable>
//                             </View>
//                         </>
//                     )}
//                 />
//             </View>
//         </>
//     )
// }

export default function TrailerCarousel({ trailers }: { trailers: Video[] }) {
  if (!trailers?.length) return null;

  return (
    <View style={{ marginTop: 20 }}>
      <AppText variant="title">Trailers</AppText>
      <FlatList
        data={trailers}
        horizontal
        nestedScrollEnabled
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View key={item.id} style={{ width: 300, marginRight: 16 }}>
            <YoutubePlayer height={180} play={false} videoId={item.key} />
            <Pressable
              style={{
                marginTop: 6,
                padding: 10,
                borderRadius: 6,
                backgroundColor: "#e50914",
                alignItems: "center",
              }}
              onPress={() => {
                const youtubeUrl = `https://www.youtube.com/watch?v=${item.key}`;
                Linking.canOpenURL(youtubeUrl).then((supported) => {
                  if (supported) Linking.openURL(youtubeUrl);
                  else console.warn("Can't open URL:", youtubeUrl);
                });
              }}
            >
              <AppText style={{ color: "white", fontWeight: "bold" }}>
                Play trailer on YouTube
              </AppText>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
