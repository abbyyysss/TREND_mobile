import { Slot } from 'expo-router';
import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MainHeader from '@/components/header/MainHeader';
import { useTheme } from '@/assets/theme/ThemeContext';

export default function MainLayout() {
  const { colors, isDark } = useTheme();
  
  return (
    <SafeAreaProvider>
      <SafeAreaView 
        style={[
          styles.container,
          { backgroundColor: colors.background }
        ]}
        edges={['top']}
      >
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        
        {/* Fixed Header with Drawer */}
        <View style={[
          styles.header, 
          { 
            backgroundColor: colors.surface, 
            borderBottomColor: colors.border 
          }
        ]}>
          <MainHeader />
        </View>
        
        {/* Content Area - Each screen handles its own scrolling */}
        <View style={styles.content}>
          <Slot />
        </View>
      </SafeAreaView>
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
  content: {
    flex: 1,
  },
});