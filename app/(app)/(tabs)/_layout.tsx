import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/themeContext';
export default function TabsLayout() {

    const { colors } = useTheme();



    return (
        <Tabs
            screenOptions={() => ({
                tabBarStyle: {
                    backgroundColor: colors.background.base,
                    borderTopColor: colors.accent.shades[900], 
                    borderTopWidth: 1,
                    height: 90,
                    paddingTop: 10
                },
                tabBarActiveTintColor: colors.primary.shades[500],
                tabBarInactiveTintColor: colors.primary.shades[500],
                headerShown: false,
                tabBarShowLabel: false
            })}
        >
            <Tabs.Screen name="(home)" options={{
                headerShown: false,
                
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                ),
            }} />
            <Tabs.Screen name="(search)" options={{
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
                ),
            }} />
            <Tabs.Screen name="(account)" options={{
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
                ),
            }} />
        </Tabs>
    );
}
