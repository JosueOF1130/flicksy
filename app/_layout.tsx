
import { Slot } from 'expo-router';
import { AuthProvider } from '../context/authContext';
import { ThemeProvider } from '@/context/themeContext';


export default function RootLayout() {

  return (
    <AuthProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </AuthProvider>
  );
}
