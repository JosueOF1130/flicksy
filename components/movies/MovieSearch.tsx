import { useTheme } from '@/context/themeContext';
import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import AppInput from '../app/AppInput';

interface MovieSearchProps {
    setShow: (value: boolean) => void;
}

export default function MovieSearch({ setShow }: MovieSearchProps) {
    const { colors } = useTheme();


    return (
        <Pressable style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={() => setShow(false)} >
            <Pressable style={[styles.container, { backgroundColor: colors.background.base }]} onPress={(e) => e.stopPropagation()} >
                <View>
                    <AppInput placeholder='Search a movie...' />
                </View>
            </Pressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        paddingTop: 50
    },
    container: {
        width: '80%',
        maxWidth: 800,
        borderRadius: 30,
        paddingHorizontal: 35,
        paddingVertical: 20,
        cursor: "auto"
    },
});
