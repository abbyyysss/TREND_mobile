// theme/colors.js
// Converted from Tailwind CSS to React Native theme system

/**
 * OKLCH colors converted to hex/rgba for React Native compatibility
 * Original CSS used OKLCH which isn't supported in RN
 */

export const lightTheme = {
  background: '#FFFFFF',           // oklch(1 0 0)
  foreground: '#252525',           // oklch(0.145 0 0)
  card: '#FFFFFF',                 // oklch(1 0 0)
  cardForeground: '#252525',       // oklch(0.145 0 0)
  popover: '#FFFFFF',              // oklch(1 0 0)
  popoverForeground: '#252525',    // oklch(0.145 0 0)
  primary: '#343434',              // oklch(0.205 0 0)
  primaryForeground: '#FAFAFA',    // oklch(0.985 0 0)
  secondary: '#F7F7F7',            // oklch(0.97 0 0)
  secondaryForeground: '#343434',  // oklch(0.205 0 0)
  muted: '#F7F7F7',                // oklch(0.97 0 0)
  mutedForeground: '#8E8E8E',      // oklch(0.556 0 0)
  accent: '#F7F7F7',               // oklch(0.97 0 0)
  accentForeground: '#343434',     // oklch(0.205 0 0)
  destructive: '#EF4444',          // oklch(0.577 0.245 27.325)
  border: '#EBEBEB',               // oklch(0.922 0 0)
  input: '#EBEBEB',                // oklch(0.922 0 0)
  ring: '#B5B5B5',                 // oklch(0.708 0 0)
  
  // Chart colors
  chart1: '#F59E0B',               // oklch(0.646 0.222 41.116)
  chart2: '#3B82F6',               // oklch(0.6 0.118 184.704)
  chart3: '#6366F1',               // oklch(0.398 0.07 227.392)
  chart4: '#84CC16',               // oklch(0.828 0.189 84.429)
  chart5: '#EAB308',               // oklch(0.769 0.188 70.08)
  
  // Sidebar
  sidebar: '#FAFAFA',              // oklch(0.985 0 0)
  sidebarForeground: '#252525',    // oklch(0.145 0 0)
  sidebarPrimary: '#343434',       // oklch(0.205 0 0)
  sidebarPrimaryForeground: '#FAFAFA',
  sidebarAccent: '#F7F7F7',        // oklch(0.97 0 0)
  sidebarAccentForeground: '#343434',
  sidebarBorder: '#EBEBEB',        // oklch(0.922 0 0)
  sidebarRing: '#B5B5B5',          // oklch(0.708 0 0)
};

export const darkTheme = {
  background: '#252525',           // oklch(0.145 0 0)
  foreground: '#FAFAFA',           // oklch(0.985 0 0)
  card: '#343434',                 // oklch(0.205 0 0)
  cardForeground: '#FAFAFA',       // oklch(0.985 0 0)
  popover: '#343434',              // oklch(0.205 0 0)
  popoverForeground: '#FAFAFA',    // oklch(0.985 0 0)
  primary: '#EBEBEB',              // oklch(0.922 0 0)
  primaryForeground: '#343434',    // oklch(0.205 0 0)
  secondary: '#454545',            // oklch(0.269 0 0)
  secondaryForeground: '#FAFAFA',  // oklch(0.985 0 0)
  muted: '#454545',                // oklch(0.269 0 0)
  mutedForeground: '#B5B5B5',      // oklch(0.708 0 0)
  accent: '#454545',               // oklch(0.269 0 0)
  accentForeground: '#FAFAFA',     // oklch(0.985 0 0)
  destructive: '#F87171',          // oklch(0.704 0.191 22.216)
  border: 'rgba(255, 255, 255, 0.1)',  // oklch(1 0 0 / 10%)
  input: 'rgba(255, 255, 255, 0.15)',  // oklch(1 0 0 / 15%)
  ring: '#8E8E8E',                 // oklch(0.556 0 0)
  
  // Chart colors (dark mode)
  chart1: '#A78BFA',               // oklch(0.488 0.243 264.376)
  chart2: '#34D399',               // oklch(0.696 0.17 162.48)
  chart3: '#EAB308',               // oklch(0.769 0.188 70.08)
  chart4: '#C084FC',               // oklch(0.627 0.265 303.9)
  chart5: '#FB923C',               // oklch(0.645 0.246 16.439)
  
  // Sidebar (dark mode)
  sidebar: '#343434',              // oklch(0.205 0 0)
  sidebarForeground: '#FAFAFA',    // oklch(0.985 0 0)
  sidebarPrimary: '#A78BFA',       // oklch(0.488 0.243 264.376)
  sidebarPrimaryForeground: '#FAFAFA',
  sidebarAccent: '#454545',        // oklch(0.269 0 0)
  sidebarAccentForeground: '#FAFAFA',
  sidebarBorder: 'rgba(255, 255, 255, 0.1)',
  sidebarRing: '#8E8E8E',          // oklch(0.556 0 0)
};

// Border radius values
export const radius = {
  sm: 6,   // calc(10px - 4px)
  md: 8,   // calc(10px - 2px)
  lg: 10,  // 10px (0.625rem)
  xl: 14,  // calc(10px + 4px)
};

// ============================================
// THEME CONTEXT & PROVIDER
// ============================================

// theme/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'
  
  // Determine active theme based on mode
  const getActiveTheme = () => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };
  
  const theme = getActiveTheme();
  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';
  
  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };
  
  const setTheme = (mode) => {
    if (['light', 'dark', 'system'].includes(mode)) {
      setThemeMode(mode);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDark, 
      themeMode,
      toggleTheme,
      setTheme,
      radius,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// ============================================
// CUSTOM DRAWER BACKDROP STYLES
// ============================================

export const getDrawerBackdropStyle = (isDark) => ({
  backgroundColor: isDark 
    ? 'rgba(255, 255, 255, 0.08)'  // lighter overlay for dark mode
    : 'rgba(0, 0, 0, 0.5)',         // light mode default
});

// ============================================
// SCROLLBAR STYLES (Web only)
// ============================================

// Note: React Native ScrollView doesn't support custom scrollbar styling
// These styles are for when using react-native-web
export const scrollbarStyles = {
  light: {
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(140, 140, 140, 0.55) transparent',
  },
  dark: {
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(190, 190, 190, 0.6) transparent',
  },
};

// ============================================
// USAGE EXAMPLE
// ============================================

/*
// App.js
import React from 'react';
import { ThemeProvider } from './theme/ThemeContext';
import MainApp from './MainApp';

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

// In any component:
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from './theme/ThemeContext';

const MyComponent = () => {
  const { theme, isDark, toggleTheme, radius } = useTheme();
  
  return (
    <View style={{ 
      backgroundColor: theme.background,
      flex: 1,
      padding: 16,
    }}>
      <View style={{
        backgroundColor: theme.card,
        borderRadius: radius.lg,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.border,
      }}>
        <Text style={{ 
          color: theme.foreground,
          fontSize: 24,
          fontWeight: '600',
        }}>
          Hello World
        </Text>
        
        <Text style={{ 
          color: theme.mutedForeground,
          fontSize: 14,
          marginTop: 8,
        }}>
          This uses the theme system
        </Text>
        
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            backgroundColor: theme.primary,
            borderRadius: radius.md,
            padding: 12,
            marginTop: 16,
          }}
        >
          <Text style={{ 
            color: theme.primaryForeground,
            textAlign: 'center',
            fontWeight: '600',
          }}>
            Toggle Theme
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
*/

// ============================================
// FONT LOADING WITH EXPO
// ============================================

/*
// Install fonts first:
// npx expo install expo-font

// app/_layout.js or App.js
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Gotham': require('./assets/fonts/Gotham.otf'),
    'Barabara': require('./assets/fonts/Barabara.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      // Your app here
    </ThemeProvider>
  );
}

// Use fonts in components:
<Text style={{ fontFamily: 'Poppins-Regular' }}>Regular text</Text>
<Text style={{ fontFamily: 'Poppins-SemiBold' }}>Semi-bold text</Text>
<Text style={{ fontFamily: 'Gotham' }}>Gotham font</Text>
*/

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Text truncation helper (replaces CSS .truncate class)
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Create themed shadow (elevation)
 */
export const createShadow = (isDark, elevation = 2) => {
  if (isDark) {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.5,
      shadowRadius: elevation * 2,
      elevation: elevation * 2,
    };
  }
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: 0.1,
    shadowRadius: elevation * 2,
    elevation: elevation,
  };
};

// ============================================
// MIGRATION NOTES
// ============================================

/*
CSS → React Native Conversions:

1. ❌ @import, @theme, @layer → Use ThemeContext
2. ❌ :root CSS variables → Use JS theme objects
3. ❌ .class selectors → Use inline styles or StyleSheet
4. ❌ @media queries → Use useColorScheme() hook
5. ❌ ::-webkit-scrollbar → Not supported (mobile native scrollbars)
6. ✅ Colors: OKLCH → HEX/RGBA (converted above)
7. ✅ Font families: Load with expo-font
8. ✅ Border radius: CSS px → RN numbers
9. ✅ Dark mode: Handled by ThemeContext
10. ✅ Text truncation: Use numberOfLines prop or helper function

Key Differences:
- No CSS cascade - styles don't inherit
- All styles must be explicitly set
- Text styles only work on <Text> components
- Use StyleSheet.create() for optimized styles
- Flexbox is default layout (not block)
- No hover states on mobile (use onPress states)
*/