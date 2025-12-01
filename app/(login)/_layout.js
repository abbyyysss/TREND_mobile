import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import DarkModeToggle from '@/components/darkMode/DarkModeToggle';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function LoginLayout() {
  const { colors, isDark, radius, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        <View style={[
          styles.contentBox,
          { 
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderRadius: radius.lg,
            shadowColor: isDark ? '#000' : colors.border,
          }
        ]}>
          {/* Dark Mode Toggle */}
          <View style={[styles.toggleContainer, { top: spacing.md, right: spacing.md }]}>
            <DarkModeToggle />
          </View>
          
          {/* Routes render here */}
          <View style={styles.stackContainer}>
            <Stack 
              screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' }
              }}
            >
              <Stack.Screen name="login/index" />
              <Stack.Screen name="forgot-password/index" />
              <Stack.Screen name="forgot-password/change-password/index" />
              <Stack.Screen name="forgot-password/check-email/index" />
              <Stack.Screen name="forgot-password/success/index" />
              <Stack.Screen name="register" />
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
    borderWidth: 2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toggleContainer: {
    position: 'absolute',
    zIndex: 20,
  },
  stackContainer: {
    flex: 1,
    paddingTop: 60,
  },
});