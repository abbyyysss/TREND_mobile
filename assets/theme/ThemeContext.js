// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useSharedValue, withTiming } from 'react-native-reanimated';

// Prevent splash from hiding too early
SplashScreen.preventAutoHideAsync();

// Light / Dark palettes
export const lightColors = {
  background: '#FFFFFF',
  foreground: '#252525',
  card: '#FFFFFF',
  surface: '#FAFAFA',
  border: '#D9D9D9',
  primary: '#1976d2',
  primaryForeground: '#FFFFFF',
  secondary: '#F7F7F7',
  text: '#000000',
  textSecondary: '#666666',
  placeholder: '#999999',
  checkboxChecked: '#8DC641',
};

export const darkColors = {
  background: '#121212',
  foreground: '#FAFAFA',
  card: '#1D1D1D',
  surface: '#1E1E1E',
  border: '#333333',
  primary: '#90caf9',
  primaryForeground: '#343434',
  secondary: '#2C2C2C',
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  placeholder: '#666666',
  checkboxChecked: '#8DC641',
};

// Rounded corners
export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 18,
  full: 999,
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography scale
export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Default fonts loaded by expo-font
export const fonts = {
  barabara: 'BARABARA-FINAL',
  gotham: 'Gotham',
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Animated color value for smooth transitions
  const animation = useSharedValue(0);

  // Load saved theme mode
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('APP_THEME_MODE');
        if (savedTheme === 'dark') {
          setIsDark(true);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  // Save user-selected mode
  useEffect(() => {
    if (isReady) {
      AsyncStorage.setItem('APP_THEME_MODE', isDark ? 'dark' : 'light');
    }
  }, [isDark, isReady]);

  // Determine active theme
  const themeColors = isDark ? darkColors : lightColors;

  // Animate transitions
  useEffect(() => {
    animation.value = withTiming(isDark ? 1 : 0, { duration: 350 });
  }, [isDark]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Manual setting
  const setTheme = mode => {
    if (mode === 'dark') {
      setIsDark(true);
    } else if (mode === 'light') {
      setIsDark(false);
    }
  };

  if (!isReady) return null;

  return (
    <ThemeContext.Provider
      value={{
        colors: themeColors,
        isDark,  // ← Make sure this is here
        animation,
        toggleTheme,
        setTheme,
        radius,
        spacing,
        typography,
        fonts,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};