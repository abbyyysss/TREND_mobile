import React from 'react';
import { View, StyleSheet, ImageBackground, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import DarkModeToggle from '@/components/darkMode/DarkModeToggle';

export default function LoginLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Background Image - Covers entire screen */}
      <ImageBackground
        source={require('@/assets/images/LoginPage/LTP-tiles2.webp')}
        style={styles.background}
        resizeMode="cover"
        blurRadius={4}
      >
        {/* Overlay to darken/lighten the background */}
        <View style={[styles.overlay, isDark && styles.overlayDark]} />
      </ImageBackground>

      {/* Main Content - On top of background */}
      <View style={styles.contentWrapper}>
        <View style={[styles.contentBox, isDark && styles.contentBoxDark]}>
          {/* Dark Mode Toggle */}
          <View style={styles.toggleContainer}>
            <DarkModeToggle />
          </View>
          
          {/* Routes render here */}
          <View style={styles.stackContainer}>
            <Stack screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' }
            }}>
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="forgot-password" />
            </Stack>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#1a1a1a', // Fallback color
  },
  background: { 
    position: 'absolute', 
    width: '100%', 
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  overlayDark: { 
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentBox: {
    width: '100%',
    maxWidth: 450,
    height: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.98)', // Increased opacity
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C0BFBF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contentBoxDark: {
    backgroundColor: 'rgba(30, 30, 30, 0.98)', // Changed from black to dark gray
    borderColor: '#444',
  },
  toggleContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 20,
  },
  stackContainer: {
    flex: 1,
    paddingTop: 60,
  },
});