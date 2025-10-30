import { FetchSearchedMovie } from '@/api/tmdb';
import AppInput from '@/components/app/AppInput'
import ThemedView from '@/components/views/ThemedView'
import { useTheme } from '@/context/themeContext';
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native'

export default function SearchPage() {

    const { colors } = useTheme();

    const [searchInput, setsearchInput] = useState<string>("");
    
    useEffect(() => {
        const delay = setTimeout(() =>  {
            if(searchInput.trim().length > 0) {
                // call api
            }
        }, 500);

        return () => clearTimeout(delay)
    }, [searchInput]);
    
    return (
        <ThemedView>
            <View style={{ flexDirection: "row"}}>

                <Pressable onPress={() => { router.back();}} style={{ justifyContent: "center", padding: 10}}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={colors.text.base}
                    />
                </Pressable>
                <AppInput placeholder='Search for a movie . . .  ' style={{ flexGrow: 1}} value={searchInput} onChangeText={(val) => { setsearchInput(val) }} />

            </View>
        </ThemedView>
    )
}