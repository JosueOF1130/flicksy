import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, } from 'react-native';

import { Image } from "expo-image";


import { useAuth } from "@/context/authContext";

import { useTheme } from "@/context/themeContext";


export default function AuthView() {

    const { colors } = useTheme();
    const [authView, setAuthView] = useState<"login" | "signup">("login");

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { LoginUser, CreateUser } = useAuth();

    const switchAuthView = () => {
        setAuthView(prev => prev === "login" ? "signup" : "login");
    }

    function authenticateUser() {
        if (authView === "login") {
            login();
        } else {
            createAccount();
        }
    }

    function login() {
        // TODO: uncomment this before uploading to github
        // loginUser(email, password);
        LoginUser("email@email.com", "password");
    }

    function createAccount() {
        // createUser(email, password, username);
        CreateUser("email@email.com", "password", "fattboii");
    }


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background.base,
            alignItems: 'center',
            padding: 25,
            paddingTop: 50
        },
        image: {
            width: 120,
            height: 120,
            marginBottom: 20,
        },
        subtitle: {
            color: colors.text.base,
            fontSize: 18,
        },
        title: {
            color: colors.accent.base,
            fontSize: 32,
            fontFamily: 'Harlow-Solid', // only works if you load this font!
            marginBottom: 20,
        },
        form: {
            width: '100%',
            maxWidth: 400,
            gap: 12,
        },
        heading: {
            color: colors.text.base,
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 12,
        },
        input: {
            backgroundColor: colors.background.base,
            padding: 12,
            borderRadius: 8,
            color: colors.text.base,
            borderWidth: .5,
            borderColor: colors.text.base
        },
        button: {
            backgroundColor: colors.primary.base,
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 12,
        },
        buttonText: {
            color: colors.text.base,
            fontWeight: 'bold',
            fontSize: 16,
        },
        switch: {
            flexDirection: 'row',
            marginTop: 20,
        },
        switchText: {
            color: colors.text.base,
            fontSize: 14,
        },
        switchLink: {
            marginLeft: 6,
            textDecorationLine: 'underline',
            color: colors.secondary.base, 
            fontWeight: 'bold',
        },
    });



    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Welcome tdo</Text>
            <Text style={styles.title}>Flicksy</Text>

            <View style={styles.form}>
                <Text style={styles.heading}>{authView === "login" ? "Welcome back!" : "Create an account to get started!"}</Text>

                {
                    authView === "signup" &&
                    <TextInput
                        style={styles.input}
                        placeholder="Username: e.g. Fattboii"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                }

                <TextInput
                    style={styles.input}
                    placeholder="Email: e.g. johndoe@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Pressable style={styles.button} onPress={authenticateUser}>
                    <Text style={styles.buttonText}>{authView === "login" ? "Login" : "Create an account"}</Text>
                </Pressable>
            </View>

            <View style={styles.switch}>
                <Text style={styles.switchText}>
                    {authView === "login" ? "Don't have an account?" : "Already have an account?"}
                </Text>
                <Pressable onPress={switchAuthView}>
                    <Text style={[styles.switchText, styles.switchLink]}>
                        {authView === "login" ? "Create an account" : "Login"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

