import { ReactNode, createContext, useState, useContext, PropsWithChildren } from "react";

import themeColors from "@/theme/colors";

type Theme = "dark" | "light";

type ThemeColors = typeof themeColors.dark;


type ThemeContextType = {
    theme: Theme;
    colors: ThemeColors;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    colors: themeColors.dark, 
    toggleTheme: () => {},
});

export function ThemeProvider({ children }: PropsWithChildren){
    const [theme, setTheme] = useState<Theme>("dark");

    function toggleTheme() {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }

    const colors = themeColors[theme];

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme}}>
            { children }
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if(!context){
        throw new Error("useTheme must be used whitin Theme Provider");
    }
    return context;
}