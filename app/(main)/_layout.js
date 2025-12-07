import { Slot } from 'expo-router';
import React from 'react';
import { View, StatusBar, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '@/components/header/MainHeader';
import AuthGate from '@/components/auth/AuthGate';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function MainLayout() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaProvider>
      <AuthGate
        loginPath="/login"
        forbiddenPath="/dashboard"
        // allowRoles={['AE', 'DOT', 'PROVINCE']} // Uncomment and specify roles if needed
        debounceMs={300}
        overlayStyle={{ backgroundColor: colors.background }}
      >
        <SafeAreaView 
          style={[
            styles.container,
            { backgroundColor: colors.background }
          ]}
          edges={['top']}
        >
          {/* Status Bar */}
          <StatusBar 
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={colors.background}
          />

          {/* Fixed Header */}
          <View
            style={[
              styles.header,
              { 
                backgroundColor: colors.surface,
                borderBottomColor: colors.border,
              }
            ]}
          >
            <MainHeader />
          </View>

          {/* UNIVERSAL SCROLLING */}
          <ScrollView 
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Slot />
          </ScrollView>

        </SafeAreaView>
      </AuthGate>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 50,
  },
  scrollContent: {
    padding: 16,        // avoid edge-to-edge screen content
    paddingBottom: 40,  // breathing room at bottom
    minHeight: '100%',
  },
});