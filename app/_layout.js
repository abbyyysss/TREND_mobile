import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/assets/theme/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

// Keep splash screen until fonts finish loading
SplashScreen.preventAutoHideAsync();

// Navigation wrapper (needs theme)
function RootLayoutNav() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        console.log("🔵 Loading fonts...");

        await Font.loadAsync({
          'BARABARA-FINAL': require('@/assets/fonts/BARABARA-FINAL.ttf'),
          'Gotham': require('@/assets/fonts/Gotham.ttf'),
        });

        console.log("🟢 Fonts loaded!");

        setFontsLoaded(true);

      } catch (err) {
        console.error("🔴 Font loading error:", err);
        setError(err.message);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Font Error: {error}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return null; // Keep splash screen
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}