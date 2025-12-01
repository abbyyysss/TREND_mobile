import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/assets/theme/ThemeContext';

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

// Inner component that uses theme
function RootLayoutNav() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}

// Main layout component
export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        console.log('Loading fonts...');
        await Font.loadAsync({
          'Barabara': require('@/assets/fonts/BARABARA-FINAL.ttf'),
          'Gotham': require('@/assets/fonts/Gotham.ttf'),
        });
        console.log('Fonts loaded successfully!');
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setError(error.message);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red' }}>Font Loading Error: {error}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return null; // Let splash screen show
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}